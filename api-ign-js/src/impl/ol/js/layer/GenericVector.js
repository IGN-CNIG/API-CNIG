/**
 * @module M/impl/layer/Generic
 */
import * as LayerType from 'M/layer/Type';
import * as EventType from 'M/event/eventtype';
import {
  isNullOrEmpty,
  isNull,
  getResolutionFromScale,
  generateRandom,
  isUndefined,
} from 'M/util/Utils';
import Vector from './Vector';
import ImplMap from '../Map';
import Feature from '../feature/Feature';

/**
  * @classdesc
  * La API-CNIG permite visualizar la capa de Open Street Map.
  *
  * @api
  * @extends {M.impl.layer.Layer}
  */
class GenericVector extends Vector {
  constructor(options = {}, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);
    this.options = options;


    /**
      * Layer map. La instancia del mapa.
      */
    this.map = null;

    /**
      * Layer ol3layer. La instancia de la capa ol3.
      */
    this.ol3Layer = vendorOptions;

    this.loaded_ = false;

    /**
      * Genetiv visibility. Indica la visibilidad de la capa.
      */
    if (this.options.visibility === false) {
      this.visibility = false;
    } else {
      this.visibility = true;
    }

    /**
      * Generic minZoom. Zoom mínimo aplicable a la capa.
      */
    this.minZoom = options.minZoom || Number.NEGATIVE_INFINITY;


    /**
      * Generic maxZoom. Zoom máximo aplicable a la capa.
      */
    this.maxZoom = options.maxZoom || Number.POSITIVE_INFINITY;

    /**
      * WMS zIndex_. Índice de la capa, (+40).
      */
    this.zIndex_ = ImplMap.Z_INDEX[LayerType.Generic];

    this.sldBody = options.sldBody;

    /**
      * WMS styles. Estilos de la capa.
      */
    this.styles = this.options.styles || '';

    this.style = vendorOptions.getStyle === undefined ? null : vendorOptions.getStyle().name;

    if (this.style !== 'createDefaultStyle' && vendorOptions.getStyle) {
      this.style = vendorOptions.getStyle();
    }

    /**
      * WMS numZoomLevels. Número de niveles de zoom.
      */
    this.numZoomLevels = this.options.numZoomLevels || ''; // by default

    /**
      * WMS numZoomLevels. Número de niveles de zoom.
      */
    this.maxExtent = this.options.maxExtent || []; // by default

    /**
      * WMS numZoomLevels. Número de niveles de zoom.
      */
    this.opacity = this.options.opacity || 1; // by default

    /**
      * WMS version: Versión WMS.
      */
    this.version = this.options.version;

    /**
      * WMS format. Formato de la capa, por defecto image/png.
      */
    this.format = this.options.format;

    /**
      * WMS format. Formato de la capa, por defecto image/png.
      */
    this.ids = this.options.ids;

    /**
      * WFS cql: Opcional: instrucción CQL para filtrar.
      * El método setCQL(cadena_cql) refresca la capa aplicando el
      * nuevo predicado CQL que recibe.
      */
    this.cql = this.options.cql;

    this.features_ = [];

    this.fnAddFeatures_ = null;
  }

  /**
    * Este método agrega la capa al mapa.
    *
    * @public
    * @function
    * @param {M.impl.Map} map Mapa de la implementación.
    * @api stable
    */
  addTo(map) {
    this.map = map;

    if (!isNullOrEmpty(this.visibility)) {
      this.ol3Layer.setVisible(this.visibility);
    }

    if (!isNullOrEmpty(this.maxZoom)) {
      this.ol3Layer.setMaxZoom(this.maxZoom);
    }

    if (!isNullOrEmpty(this.minZoom)) {
      this.ol3Layer.setMinZoom(this.minZoom);
    }

    if (!isNullOrEmpty(this.zIndex_)) {
      this.ol3Layer.setZIndex(this.zIndex_);
    }

    if (!isNullOrEmpty(this.visibility)) {
      this.ol3Layer.setVisible(this.visibility);
    }

    if (!isNullOrEmpty(this.sldBody)) {
      this.ol3Layer.getSource().updateParams({ SLD_BODY: this.sldBody });
    }

    if (!isNullOrEmpty(this.styles)) {
      this.ol3Layer.getSource().updateParams({ STYLES: this.styles });
    }

    if (!isNullOrEmpty(this.format)) {
      this.ol3Layer.getSource().updateParams({ FORMAT: this.format });
    }

    if (!isNullOrEmpty(this.version)) {
      this.ol3Layer.getSource().updateParams({ VERSION: this.version });
    }

    if (!isNullOrEmpty(this.maxExtent)) {
      this.ol3Layer.setExtent(this.maxExtent);
    }

    if (!isUndefined(this.ol3Layer.getSource().getLegendUrl)) {
      this.legendUrl_ = this.ol3Layer.getSource().getLegendUrl();
    }
    this.ol3Layer.setOpacity(this.opacity);
    this.ol3Layer.setVisible(this.visibility);

    if (!isNullOrEmpty(this.ids)) {
      const featureId = this.ids.split(',').map((id) => {
        return this.name.concat('.').concat(id);
      });
      this.ol3Layer.getSource().setUrl(`${this.ol3Layer.getSource().getUrl()}&featureId=${featureId}`);
    }

    if (!isNullOrEmpty(this.cql)) {
      this.ol3Layer.getSource().setUrl(`${this.ol3Layer.getSource().getUrl()}&CQL_FILTER=${window.encodeURIComponent(this.cql)}`);
    }

    // calculates the resolutions from scales
    if (!isNull(this.options) &&
       !isNull(this.options.minScale) && !isNull(this.options.maxScale)) {
      const units = this.map.getProjection().units;
      this.options.minResolution = getResolutionFromScale(this.options.minScale, units);
      this.options.maxResolution = getResolutionFromScale(this.options.maxScale, units);
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    } else if (!isNull(this.options) &&
       !isNull(this.options.minResolution) && !isNull(this.options.maxResolution)) {
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    }

    if (!this.facadeLayer_.name) {
      this.addFacadeName();
    }

    map.getMapImpl().addLayer(this.ol3Layer);

    this.fnAddFeatures_ = this.addFeaturesToFacade.bind(this);
    this.ol3Layer.getSource().on('change', this.fnAddFeatures_);
  }

  /**
    * Este método obtiene la URL del servicio.
    *
    * @function
    * @returns {String} URL del servicio
    * @api
    */
  getURLService() {
    let url = '';
    if (!isNullOrEmpty(this.ol3Layer) && !isNullOrEmpty(this.ol3Layer.getSource) &&
       !isNullOrEmpty(this.ol3Layer.getSource())) {
      url = this.ol3Layer.getSource().getUrl();
    }
    return url;
  }

  /**
    * Este método modifica la URL del servicio.
    *
    * @function
    * @param {String} URL del servicio.
    * @api
    */
  setURLService(url) {
    if (!isNullOrEmpty(this.ol3Layer) && !isNullOrEmpty(this.ol3Layer.getSource) &&
       !isNullOrEmpty(this.ol3Layer.getSource()) && !isNullOrEmpty(url)) {
      this.ol3Layer.getSource().setUrl(url);
    }
  }

  addFeaturesToFacade() {
    if (this.ol3Layer.getSource().getState() === 'ready') {
      if (this.ol3Layer.getSource().getFeatures) {
        const features = this.ol3Layer.getSource().getFeatures().map((f) => {
          return Feature.olFeature2Facade(f);
        });
        this.facadeLayer_.addFeatures(features);
        this.loaded_ = true;
        this.deactivate();
        this.fire(EventType.LOAD, [this.features_]);
        if (this.style !== 'createDefaultStyle') {
          this.ol3Layer.setStyle(this.style);
        }
      } else {
        this.deactivate();
      }
    }
  }

  /**
    * Este método vuelve a dibujar la capa.
    *
    * @function
    * @public
    * @api stable
    */
  redraw() {
    const olLayer = this.getOL3Layer();
    if (!isNullOrEmpty(olLayer)) {
      const olSource = olLayer.getSource();
      /**  if (olSource instanceof OLSourceCluster) {
         olSource = olSource.getSource();
       } */
      // remove all features from ol vector
      const olFeatures = [...olSource.getFeatures()];
      olFeatures.forEach(olSource.removeFeature, olSource);

      const features = this.facadeLayer_.getFeatures();
      olSource.addFeatures(features.map(Feature.facade2OLFeature));
    }
  }

  /**
    * Devuelve si la capa esta cargada o no.
    *
    * @function
    * @returns {Boolean} Verdadero cargada, falso si no.
    * @api stable
    */
  isLoaded() {
    return this.loaded_;
  }


  /**
    * Este método añade los objetos geográficos a la capa.
    *
    * @function
    * @public
    * @param {Array<M.feature>} features Objetos geográficos.
    * @param {Boolean} update Actualiza la capa.
    * @api stable
    */
  addFeatures(features, update) {
    features.forEach((newFeature) => {
      const feature = this.features_.find(feature2 => feature2.equals(newFeature));
      if (isNullOrEmpty(feature)) {
        this.features_.push(newFeature);
      }
    });
    if (update) {
      this.updateLayer_();
    }
    this.redraw();
  }

  /**
    * Este método devuelve un objeto geográfico por su id.
    *
    * @function
    * @public
    * @param {string|number} id Identificador del objeto geográfico..
    * @return {null|M.feature} Objeto Geográfico - Devuelve el objeto geográfico con
    * ese id si se encuentra, en caso de que no se encuentre o no indique el id devuelve nulo.
    * @api stable
    */
  getFeatureById(id) {
    return this.features_.filter(feature => feature.getId() === id)[0];
  }

  /**
    * Este método devuelve todos los objetos geográficos, se le puede pasar un filtro.
    *
    * @function
    * @public
    * @param {boolean} skipFilter Indica el filtro.
    * @param {M.Filter} filter Filtro que se ejecuta.
    * @return {Array<M.Feature>} Devuelve todos los objetos geográficos que coincidan.
    * @api stable
    */
  getFeatures(skipFilter, filter) {
    let features = this.features_;
    if (!skipFilter) features = filter.execute(features);
    return features;
  }


  deactivate() {
    this.ol3Layer.getSource().un('change', this.fnAddFeatures_);
    this.fnAddFeatures_ = null;
  }

  setVersion(newVersion) {
    this.version = newVersion;
    this.ol3Layer.getSource().updateParams({ VERSION: newVersion });
  }

  getMaxExtent() {
    return this.ol3Layer.getExtent();
  }

  setMaxExtent(extent) {
    return this.ol3Layer.setExtent(extent);
  }

  /**
    * Este método indica si la capa es consultable.
    *
    * @function
    * @returns {Boolean} Verdadero es consultable, falso si no.
    * @api stable
    * @expose
    */
  isQueryable() {
    return (this.options.queryable !== false);
  }

  /**
    * Devuelve la URL de la leyenda.
    *
    * @public
    * @function
    * @returns {String} URL de la leyenda.
    * @api stable
    */
  getLegendURL() {
    return this.legendUrl_;
  }

  setLegendURL(newLegend) {
    if (!isNullOrEmpty(newLegend)) {
      this.legendUrl_ = newLegend;
    }
  }

  /**
    * Este método actualiza la capa.
    * @function
    * @api stable
    */
  refresh() {
    this.ol3Layer.getSource().refresh();
  }

  addFacadeName() {
    if (isNullOrEmpty(this.facadeLayer_.name) && !isNullOrEmpty(this.ol3Layer.getSource()) &&
       !isNullOrEmpty(this.ol3Layer.getSource().getParams) &&
       !isNullOrEmpty(this.ol3Layer.getSource().getParams().LAYERS)) {
      this.facadeLayer_.name = this.ol3Layer.getSource().getParams().LAYERS;
    } else if (isNullOrEmpty(this.facadeLayer_.name) && !isNullOrEmpty(this.ol3Layer.getSource()) &&
       !isNullOrEmpty(this.ol3Layer.getSource().getUrl) &&
       !isNullOrEmpty(this.ol3Layer.getSource().getUrl())) {
      const url = this.ol3Layer.getSource().getUrl();
      const result = url.split('&typeName=')[1].split('&')[0].split(':');
      if (!isNullOrEmpty(result)) {
        this.facadeLayer_.name = result[1];
        this.facadeLayer_.namespace = result[0];
      } else {
        this.facadeLayer_.name = generateRandom('layer_', '_'.concat(this.type));
      }
    } else if (isNullOrEmpty(this.facadeLayer_.name)) {
      this.facadeLayer_.name = generateRandom('layer_', '_'.concat(this.type));
    }
  }

  /**
    * Este método obtiene la resolución mínima.
    *
    * @public
    * @function
    * @return {Number} Resolución mínima.
    * @api stable
    */
  getMinResolution() {
    return this.ol3Layer.getMinResolution();
  }

  /**
    * Este método obtiene la resolución máxima para
    * este WMS.
    *
    *
    * @public
    * @function
    * @return {Number} Resolución Máxima.
    * @api stable
    */
  getMaxResolution() {
    return this.ol3Layer.getMaxResolution();
  }

  /**
    * Este método elimina todos los objetos geográficos indicado.
    *
    * @function
    * @public
    * @param {Array<M.feature>} features Objetos geográficos que se eliminarán.
    * @api stable
    */
  removeFeatures(features) {
    this.features_ = this.features_.filter(f => !(features.includes(f)));
    this.redraw();
  }

  /**
    * Este método establece la clase de la fachada
    * de MBTiles.
    *
    * @function
    * @param {Object} obj Objeto a establecer como fachada.
    * @public
    * @api
    */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
  }

  equals(obj) {
    let equals = false;
    if (obj instanceof GenericVector) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  }
}

export default GenericVector;

