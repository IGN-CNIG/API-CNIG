/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/**
 * @module M/impl/layer/COG
 */
import {
  isNullOrEmpty,
  getResolutionFromScale,
  addParameters,
  concatUrlPaths,
  getCOGGetCapabilitiesUrl,
} from 'M/util/Utils';
import FacadeLayerBase from 'M/layer/Layer';
import * as LayerType from 'M/layer/Type';
import FacadeCOG from 'M/layer/COG';
import { get as getRemote } from 'M/util/Remote';
import * as EventType from 'M/event/eventtype';
import TileLayer from 'ol/layer/WebGLTile';
import GeoTIFF from 'ol/source/GeoTIFF';
import { get as getProj } from 'ol/proj';
import GetCapabilities from '../util/WMSCapabilities';
import ImplUtils from '../util/Utils';
import ImplMap from '../Map';
import LayerBase from './Layer';
import FormatCOG from '../format/COG';

/**
 * @classdesc
 * COG devuelve un mapa en formato imagen de un conjunto capas ráster o vectoriales.
 * Permitiendo las personalización de las capas mediante estilos. Se trata de un mapa dínamico.
 *
 * @property {Object} options Opciones de la capa COG.
 * @property {Array<M.layer.COG>} layers Intancia de COG con metadatos.
 *
 * @api
 * @extends {M.impl.layer.Layer}
 */
class COG extends LayerBase {
  /**
   * Constructor principal de la clase. Crea una capa COG
   * con parámetros especificados por el usuario.
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options Parámetros opcionales para la capa.
   * - visibility: Indica la visibilidad de la capa.
   * - singleTile: Indica si la tesela es única o no.
   * - numZoomLevels: Número de niveles de zoom.
   * - animated: Define si la capa está animada,
   * el valor predeterminado es falso.
   * - format: Formato de la capa, por defecto image/png.
   * - styles: Estilos de la capa.
   * - sldBody: Parámetros "ol.source.ImageCOG"
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - queryable: Indica si la capa es consultable.
   * - minScale: Escala mínima.
   * - maxScale: Escala máxima.
   * - minResolution: Resolución mínima.
   * - maxResolution: Resolución máxima.
   * - animated: Define si la capa está animada,
   * el valor predeterminado es falso.
   * - ratio: determina el tamaño de las solicitudes de las imágenes.1 significa que tienen el *
   * tamaño de la ventana, 2 significa que tienen el doble del tamaño de la ventana,
   * y así sucesivamente.Debe ser 1 o superior.Por defecto es 1.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * <pre><code>
   * import OLSourceTileCOG from 'ol/source/TileCOG';
   * {
   *  opacity: 0.1,
   *  source: new OLSourceTileCOG({
   *    attributions: 'COG',
   *    ...
   *  })
   * }
   * </code></pre>
   * @api stable
   */
  constructor(options = {}, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);

    /**
     * COG facadeLayer_. Instancia de la fachada.
     */
    this.facadeLayer_ = null;

    /**
     * COG options. Opciones de la capa.
     */
    this.options = options;

    /**
     * COG layers. Capas.
     */
    this.layers = [];

    /**
     * COG displayInLayerSwitcher. Mostrar en el selector de capas.
     */
    this.displayInLayerSwitcher_ = true;

    /**
     * COG getCapabilitiesPromise. Metadatos, promesa.
     */
    this.getCapabilitiesPromise = null;

    /**
     * COG extentPromise. Extensión de la capa, promesa.
     */
    this.extentPromise = null;

    /**
     * COG extent. Extensión de la capa que se obtuvo del servicio getCapabilities.
     */
    this.extent = null;

    /**
     * COG resolutions_. Resoluciones de la capa.
     */
    this.resolutions_ = null;

    /**
     * COG extentProj_. Proyección actual.
     */
    this.extentProj_ = null;

    /**
     * COG visibility. Indica la visibilidad de la capa.
     */
    if (this.options.visibility === false) {
      this.visibility = false;
    }

    /**
     * COG numZoomLevels. Número de niveles de zoom.
     */
    if (isNullOrEmpty(this.options.numZoomLevels)) {
      this.options.numZoomLevels = 20; // by default
    }

    /**
     * COG animated. Define si la capa está animada,
     * el valor predeterminado es falso.
     */
    if (isNullOrEmpty(this.options.animated)) {
      this.options.animated = false; // by default
    }

    /**
     * COG styles. Estilos de la capa.
     */
    this.styles = this.options.styles || '';


    /**
     * COG sldBody. Parámetros "ol.source.ImageCOG"
     */
    this.sldBody = options.sldBody;

    /**
     * COG zIndex_. Índice de la capa, (+40).
     */
    this.zIndex_ = ImplMap.Z_INDEX[LayerType.COG];

    /**
     * COG minZoom. Zoom mínimo aplicable a la capa.
     */
    this.minZoom = options.minZoom || Number.NEGATIVE_INFINITY;


    /**
     * COG maxZoom. Zoom máximo aplicable a la capa.
     */
    this.maxZoom = options.maxZoom || Number.POSITIVE_INFINITY;

    /**
     * COG useCapabilities. Indica si se usa el getCapabilities.
     */
    this.useCapabilities = options.useCapabilities !== false;

    /**
     * COG ratio. Tamaño de las solicitudes de las imágenes.
     */
    this.ratio = options.ratio || 1;
    if (options.ratio < 1) {
      // eslint-disable-next-line no-console
      console.error('El ratio debe ser 1 o superior');
    }

    /**
     * CrossOrigin. Indica si se usa crossOrigin.
     */
    this.crossOrigin = options.crossOrigin || null;
  }

  /**
   * Este método establece la visibilidad de esta capa.
   *
   * @function
   * @param {Boolean} visibility Verdadero es visible, falso si no.
   * @api stable
   */
  setVisible(visibility) {
    this.visibility = visibility;
    // if this layer is base then it hides all base layers
    if ((visibility === true) && (this.transparent !== true)) {
      // hides all base layers
      this.map.getBaseLayers()
        .filter(layer => !layer.equals(this.facadeLayer_) && layer.isVisible())
        .forEach(layer => layer.setVisible(false));

      // set this layer visible
      if (!isNullOrEmpty(this.ol3Layer)) {
        this.ol3Layer.setVisible(visibility);
      }

      // updates resolutions and keep the zoom
      const oldZoom = this.map.getZoom();
      this.map.getImpl().updateResolutionsFromBaseLayer();
      if (!isNullOrEmpty(oldZoom)) {
        this.map.setZoom(oldZoom);
      }
    } else if (!isNullOrEmpty(this.ol3Layer)) {
      this.ol3Layer.setVisible(visibility);
    }
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
   * Este método agrega la capa al mapa.
   *
   * @public
   * @function
   * @param {M.impl.Map} map Mapa de la implementación.
   * @api stable
   */
  addTo(map) {
    this.map = map;
    this.fire(EventType.ADDED_TO_MAP);

    this.addSingleLayer_(null);

    if (this.legendUrl_ === concatUrlPaths([M.config.THEME_URL, FacadeLayerBase.LEGEND_DEFAULT])) {
      this.legendUrl_ = addParameters(this.url, {
        SERVICE: 'COG',
        VERSION: this.version,
        REQUEST: 'GetLegendGraphic',
        LAYER: this.name,
        FORMAT: 'image/png',
        // EXCEPTIONS: 'image/png',
      });
    }
  }

  /**
   * Este método establece las resoluciones para esta capa.
   *
   * @public
   * @function
   * @param {Array<Number>} resolutions Nuevas resoluciones a aplicar.
   * @api stable
   */
  setResolutions(resolutions) {
    this.resolutions_ = resolutions;
    this.facadeLayer_.calculateMaxExtent().then((extent) => {
      if (!isNullOrEmpty(this.ol3Layer)) {
        const minResolution = this.options.minResolution;
        const maxResolution = this.options.maxResolution;
        const source = this.createOLSource_(resolutions, minResolution, maxResolution, extent);
        this.ol3Layer.setSource(source);
        this.ol3Layer.setExtent(extent);
      }
    });
  }

  /**
   * Este método agrega esta capa como capa única.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   *
   * @public
   * @function
   * @api stable
   */
  addSingleLayer_() {
    let extent;

    const source = this.createOLSource_();

    // this.ol3Layer = new TileLayer(extend({
    //   source,
    //   extent,
    // }, this.vendorOptions_, true));
    this.ol3Layer = new TileLayer({
      source,
      extent,
    });

    this.map.getMapImpl().addLayer(this.ol3Layer);

    this.setVisible(this.visibility);

    // sets the resolutions
    if (this.resolutions_ !== null) {
      this.setResolutions(this.resolutions_);
    }
    // activates animation for base layers or animated parameters
    const animated = ((this.transparent === false) || (this.options.animated === true));
    this.ol3Layer.set('animated', animated);
    this.ol3Layer.setMaxZoom(this.maxZoom);
    this.ol3Layer.setMinZoom(this.minZoom);
  }

  // Devuelve un capabilities formateado en el caso
  // de que sea un array
  formatCapabilities_(capabilites, selff) {
    let capabilitiesLayer = capabilites;
    for (let i = 0, ilen = capabilitiesLayer.length; i < ilen; i += 1) {
      if (capabilitiesLayer[i] !== undefined && capabilitiesLayer[i].Name !== undefined && capabilitiesLayer[i].Name === selff.facadeLayer_.name) {
        capabilitiesLayer = capabilitiesLayer[i];

        try {
          this.legendUrl_ = capabilitiesLayer.Style[0].LegendURL[0].OnlineResource;
          // this.legendUrl_ = capabilitiesLayer.Style.find(s => s.Name === this.styles).LegendURL[0].OnlineResource;
          /* eslint-disable no-empty */
        } catch (err) {}
      } else if (capabilitiesLayer[i] !== undefined && capabilitiesLayer[i].Layer !== undefined) {
        if (capabilitiesLayer[i].Layer.filter(l => l.Name === selff.facadeLayer_.name)[0] !== undefined) {
          capabilitiesLayer = capabilitiesLayer[i].Layer.filter(l => l.Name === selff.facadeLayer_.name)[0];
          try {
            this.legendUrl_ = capabilitiesLayer.Style[0].LegendURL[0].OnlineResource;
            // this.legendUrl_ = capabilitiesLayer.Style.find(s => s.Name === this.styles).LegendURL[0].OnlineResource;
            /* eslint-disable no-empty */
          } catch (err) {}
        }
      }
    }

    return capabilitiesLayer;
  }

  /**
   * Este método agrega metadatos.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   *
   * @public
   * @function
   * @param {Object} capabilitiesLayer Metadatos de la capa.
   * @api stable
   */
  addCapabilitiesMetadata(capabilitiesLayer) {
    const abstract = !isNullOrEmpty(capabilitiesLayer.Abstract) ? capabilitiesLayer.Abstract : '';
    const attribution = !isNullOrEmpty(capabilitiesLayer.Attribution) ? capabilitiesLayer.Attribution : '';
    const metadataURL = !isNullOrEmpty(capabilitiesLayer.MetadataURL) ? capabilitiesLayer.MetadataURL : '';
    const style = !isNullOrEmpty(capabilitiesLayer.Style) ? capabilitiesLayer.Style : '';

    const capabilitiesMetadata = {
      abstract,
      attribution,
      metadataURL,
      style,
    };
    if (this.facadeLayer_.capabilitiesMetadata === undefined) {
      this.facadeLayer_.capabilitiesMetadata = capabilitiesMetadata;
    }
  }

  /**
   * Este método crea la fuente ol para esta instancia.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @function
   * @param {Array<Number>} resolutions Resolución
   * @param {Number} minResolution Resolución máxima.
   * @param {Number} maxResolution Resolución mínima.
   * @param {Array} extent Extensión.
   * @return {ol.source} Fuente de Openlayers.
   * @api
   */
  createOLSource_() {
    let olSource = this.vendorOptions_.source;
    if (isNullOrEmpty(this.vendorOptions_.source)) {
      const layerParams = {
        LAYERS: this.name,
        VERSION: this.version,
        TRANSPARENT: this.transparent,
        FORMAT: this.format,
        STYLES: this.styles,
      };

      if (!isNullOrEmpty(this.sldBody)) {
        layerParams.SLD_BODY = this.sldBody;
      }

      if (!isNullOrEmpty(this.options.params)) {
        Object.keys(this.options.params).forEach((key) => {
          layerParams[key.toUpperCase()] = this.options.params[key];
        });
      }
      // const opacity = this.opacity_;
      // const zIndex = this.zIndex_;
      // const tileGrid = (this.useCapabilities) ?
      //   new OLTileGrid({ resolutions, extent, origin: getBottomLeft(extent) }) :
      //   false;
      const sources = [
        {
          // crossOrigin: this.crossOrigin, // crossOrigin inicial
          url: this.url,
          // params: layerParams,
          // tileGrid,
          // extent,
          // minResolution,
          // maxResolution,
          // opacity,
          // zIndex,
          // ratio: this.ratio,
        },
      ];
      olSource = new GeoTIFF({
        sources,
      });
    }
    return olSource;
  }

  /**
   * Este método agrega todas las capas definidas en el servidor.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @function
   * @api stable
   */
  addAllLayers_() {
    this.getCapabilities().then((getCapabilities) => {
      getCapabilities.getLayers().forEach((layer) => {
        const COGLayer = new FacadeCOG({
          url: this.url,
          name: layer.name,
          version: layer.version,
        }, this.vendorOptions_);
        this.layers.push(COGLayer);
      });

      // if no base layers was specified then it stablishes
      // the first layer as base
      // if (this.map.getBaseLayers().length === 0) {
      //    this.layers[0].transparent = false;
      // }

      this.map.addCOG(this.layers);

      // updates the z-index of the layers
      let baseLayersIdx = this.layers.length;
      this.layers.forEach((layer) => {
        layer.setZIndex(ImplMap.Z_INDEX[LayerType.COG] + baseLayersIdx);
        baseLayersIdx += 1;
      });
    });
  }

  /**
   * Este método obtiene la extensión.
   *
   * @public
   * @function
   * @returns {Array<Number>} Extensión, asincrono.
   * @api stable
   */
  getExtent() {
    const olProjection = getProj(this.map.getProjection().code);

    // creates the promise
    this.extentPromise = new Promise((success, fail) => {
      if (!isNullOrEmpty(this.extent_)) {
        this.extent_ = ImplUtils.transformExtent(this.extent_, this.extentProj_, olProjection);
        this.extentProj_ = olProjection;
        success(this.extent_);
      } else {
        this.getCapabilities().then((getCapabilities) => {
          this.extent_ = getCapabilities.getLayerExtent(this.name);
          this.extentProj_ = olProjection;
          success(this.extent_);
        });
      }
    });
    return this.extentPromise;
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
    return this.options.minResolution;
  }

  /**
   * Este método obtiene la resolución máxima para
   * este COG.
   *
   *
   * @public
   * @function
   * @return {Number} Resolución Máxima.
   * @api stable
   */
  getMaxResolution() {
    return this.options.maxResolution;
  }

  /**
   * Actualiza la resolución mínima y máxima de la capa.
   *
   * @public
   * @function
   * @param {ol.Projection} projection Proyección del mapa.
   * @api stable
   */
  updateMinMaxResolution(projection) {
    if (!isNullOrEmpty(this.options.minResolution)) {
      this.options.minResolution = getResolutionFromScale(this.options.minScale, projection.units);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    }

    if (!isNullOrEmpty(this.options.maxResolution)) {
      this.options.maxResolution = getResolutionFromScale(this.options.maxScale, projection.units);
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
    }
  }

  /**
   * Sobrescribe la extensión máxima de la capa.
   *
   * @public
   * @function
   * @param {maxExtent} maxExtent Extensión máxima.
   * @api stable
   */
  setMaxExtent(maxExtent) {
    // maxExtentPromise.then((maxExtent) => {
    this.getOL3Layer().setExtent(maxExtent);

    // });
  }

  /**
   * Este método obtiene el número de niveles de zoom
   * disponibles para la capa COG.
   *
   * @public
   * @function
   * @returns {Number} Número de niveles de zoom.
   * @api stable
   */
  getNumZoomLevels() {
    return this.options.numZoomLevels;
  }

  /**
   * Devuelve las capas COG.
   *
   * @public
   * @function
   * @return {M.layer.COG.impl} Capa COG.
   * @api stable
   */
  getLayers() {
    return this.layers;
  }

  /**
   * Devuelve los metadatos, asincrono.
   *
   * @public
   * @function
   * @returns {capabilities} Metadatos.
   * @api stable
   */
  getCapabilities() {
    const capabilitiesInfo = this.map.collectionCapabilities.find((cap) => {
      return cap.url === this.url;
    });

    if (capabilitiesInfo.capabilities) {
      this.getCapabilitiesPromise = capabilitiesInfo.capabilities;
    } else if (isNullOrEmpty(this.getCapabilitiesPromise)) {
      const layerUrl = this.url;
      const layerVersion = this.version;
      const projection = this.map.getProjection();
      this.getCapabilitiesPromise = new Promise((success, fail) => {
        // gest the capabilities URL
        const COGGetCapabilitiesUrl = getCOGGetCapabilitiesUrl(layerUrl, layerVersion);
        // gets the getCapabilities response
        getRemote(COGGetCapabilitiesUrl).then((response) => {
          const getCapabilitiesDocument = response.xml;
          const getCapabilitiesParser = new FormatCOG();
          const getCapabilities = getCapabilitiesParser.customRead(getCapabilitiesDocument);

          const getCapabilitiesUtils = new GetCapabilities(getCapabilities, layerUrl, projection);
          success(getCapabilitiesUtils);
        });
      });
      capabilitiesInfo.capabilities = this.getCapabilitiesPromise;
    }

    return this.getCapabilitiesPromise;
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

  /**
   * Sobrescribe la leyenda.
   *
   * @public
   * @function
   * @param {String} legendUrl URL de la leyenda.
   * @api stable
   */
  setLegendURL(legendUrl) {
    this.legendUrl_ = legendUrl;
  }

  /**
   * Este método actualiza el estado de este
   * capa.
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  refresh() {
    const ol3Layer = this.getOL3Layer();
    if (!isNullOrEmpty(ol3Layer)) {
      ol3Layer.getSource().changed();
    }
  }

  /**
   * Devuelve la extensión de los metadatos.
   *
   * @public
   * @function
   * @param {capabilities} capabilities Metadatos COG.
   * @returns {Array<Number>} COG Extensión.
   * @api stable
   */
  getExtentFromCapabilities(capabilities) {
    const name = this.facadeLayer_.name;
    return capabilities.getLayerExtent(name);
  }

  /**
   * Este método establece la clase de fachada COG.
   * La fachada se refiere a
   * un patrón estructural como una capa de abstracción con un patrón de diseño.
   *
   * @function
   * @param {object} obj COG de la fachada.
   * @api stable
   */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
  }

  /**
   * Este método destruye esta capa, limpiando el HTML
   * y anulando el registro de todos los eventos.
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    if (!isNullOrEmpty(this.layers)) {
      this.layers.map(this.map.removeLayers, this.map);
      this.layers.length = 0;
    }
    this.map = null;
  }

  /**
   * Este método comprueba si un objeto es igual
   * a esta capa.
   *
   * @function
   * @param {Object} obj Objeto a comparar.
   * @returns {Boolean} Verdadero es igual, falso si no.
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof COG) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  }
}

/**
 * COG LEGEND_IMAGE.
 *
 * Imagen de la leyenda por defecto.
 *
 * @public
 * @const
 * @type {string | null}
 * @api stable
 */
COG.LEGEND_IMAGE = null;

export default COG;
