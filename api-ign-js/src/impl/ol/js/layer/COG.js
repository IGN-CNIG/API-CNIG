/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/**
 * @module M/impl/layer/COG
 */
import {
  isNullOrEmpty,
  isNull,
  getResolutionFromScale,
  fillResolutions,
  generateResolutionsFromExtent,
} from 'M/util/Utils';
import * as LayerType from 'M/layer/Type';
import * as EventType from 'M/event/eventtype';
import TileLayer from 'ol/layer/WebGLTile';
import GeoTIFF from 'ol/source/GeoTIFF';
import { get as getProj } from 'ol/proj';
import ImplMap from '../Map';
import LayerBase from './Layer';
import ImplUtils from '../util/Utils';

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
   * - url: url del servicio WFS.
   * - projection: SRS usado por la capa.
   * - legend: Nombre asociado en el árbol de contenidos, si usamos uno.
   * - transparent: Falso si es una capa base, verdadero en caso contrario.
   * - convertToRGB: Convierte la compresion de la imagen a RGB, puede ser 'auto', true o false,
   *   por defecto 'auto'.
   * - opacity: Opacidad de la capa de 0 a 1, por defecto 1.
   * - bands: Bandas a mostrar en forma de array y como numero, si el array esta vacio muestra todas
   *   por defecto [].
   * - nodata: Usado para sobreescribir el parametro nodata del dato original
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - minScale: Escala mínima.
   * - maxScale: Escala máxima.
   * - minResolution: Resolución mínima.
   * - maxResolution: Resolución máxima.
   * - styles: Estilos de las bandas.
   * - visibility: Verdadero si la capa es visible, falso si queremos que no lo sea.
   *   En este caso la capa sería detectado por los plugins de tablas de contenidos
   *   y aparecería como no visible.
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
  constructor(options = {}, vendorOptions = {}) {
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
     * COG extentPromise. Extensión de la capa, promesa.
     */
    this.extentPromise = null;

    /**
     * COG resolutions_. Resoluciones de la capa.
     */
    this.resolutions_ = null;

    /**
     * COG extentProj_. Proyección actual.
     */
    this.extentProj_ = null;

    /**
     * COG opacity_. Opacidad entre 0 y 1. Por defecto 1.
     */
    this.opacity_ = this.options.opacity || 1;

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

    this.projection_ = this.options.projection;

    /**
     * COG sldBody. Parámetros "ol.source.ImageCOG"
     */
    this.sldBody = options.sldBody;

    /**
     * COG zIndex_. Índice de la capa, (+40).
     */
    this.zIndex_ = ImplMap.Z_INDEX[LayerType.COG];

    /**
     * COG convertToRGB_. .
     */
    this.convertToRGB_ = !isNullOrEmpty(options.convertToRGB) ? options.convertToRGB : 'auto';

    /**
     * COG bands_. Bandas a renderizar.
     */
    this.bands_ = options.bands ? options.bands : [];

    /**
     * COG nodata_. Bandas a renderizar.
     */
    this.nodata_ = options.nodata;

    /**
     * COG minZoom. Zoom mínimo aplicable a la capa.
     */
    this.minZoom = options.minZoom || Number.NEGATIVE_INFINITY;

    /**
     * COG maxZoom. Zoom máximo aplicable a la capa.
     */
    this.maxZoom = options.maxZoom || Number.POSITIVE_INFINITY;

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
        .filter((layer) => !layer.equals(this.facadeLayer_) && layer.isVisible())
        .forEach((layer) => layer.setVisible(false));

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

    this.createOLLayer_(null);

    // calculates the resolutions from scales
    if (!isNull(this.options)
      && !isNull(this.options.minScale) && !isNull(this.options.maxScale)) {
      const units = this.map.getProjection().units;
      this.options.minResolution = getResolutionFromScale(this.options.minScale, units);
      this.options.maxResolution = getResolutionFromScale(this.options.maxScale, units);
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
  createOLLayer_() {
    let extent;

    const minResolution = this.options.minResolution;
    const maxResolution = this.options.maxResolution;
    const zIndex = this.zIndex_;

    let resolutions = this.map.getResolutions();
    if (isNullOrEmpty(resolutions) && !isNullOrEmpty(this.resolutions_)) {
      resolutions = this.resolutions_;
    } else if (isNullOrEmpty(resolutions)) {
      // generates the resolution
      const zoomLevels = this.getNumZoomLevels();
      const size = this.map.getMapImpl().getSize();
      const units = this.map.getProjection().units;
      if (!isNullOrEmpty(minResolution) && !isNullOrEmpty(maxResolution)) {
        resolutions = fillResolutions(minResolution, maxResolution, zoomLevels);
      } else {
        resolutions = generateResolutionsFromExtent(extent, size, zoomLevels, units);
      }
    }

    const source = this.createOLSource_(minResolution, maxResolution);

    // this.ol3Layer = new TileLayer(extend({
    //   source,
    //   extent,
    // }, this.vendorOptions_, true));
    this.ol3Layer = new TileLayer({
      opacity: this.opacity_,
      source,
      extent,
      style: this.styles,
      zIndex,
    });

    this.map.getMapImpl().addLayer(this.ol3Layer);

    this.setVisible(this.visibility);

    // sets its z-index
    if (zIndex !== null) {
      this.setZIndex(zIndex);
    }
    // activates animation for base layers or animated parameters
    this.ol3Layer.setMaxZoom(this.maxZoom);
    this.ol3Layer.setMinZoom(this.minZoom);
  }

  /**
   * Este método crea la fuente ol para esta instancia.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @function
   * @return {ol.source} Fuente de Openlayers.
   * @api
   */
  createOLSource_(resolutions, minResolution, maxResolution, extent) {
    let olSource = this.vendorOptions_.source;
    if (isNullOrEmpty(this.vendorOptions_.source)) {
      const convertToRGB = this.convertToRGB_;
      const bands = this.bands_;
      const nodata = this.nodata_;
      const zIndex = this.zIndex_;
      const projectionCOG = this.projection_;
      const sources = [
        {
          url: this.url,
          nodata,
        },
      ];
      if (bands.length !== 0) {
        sources.forEach((src) => {
          // eslint-disable-next-line no-param-reassign
          src.bands = bands;
        });
      }
      olSource = new GeoTIFF({
        sources,
        convertToRGB,
        minResolution,
        maxResolution,
        zIndex,
        projection: projectionCOG,
      });
    }
    return olSource;
  }

  /**
   * Este método obtiene la extensión.
   *
   * @public
   * @function
   * @returns {Array<Number>} Extensión, asincrono.
   * @api stable
   */
  getMaxExtent() {
    return this.getExtent();
  }

  getExtent() {
    const olProjection = getProj(this.map.getProjection().code);

    const olProperties = this.getOL3Layer().getProperties();
    if (olProperties.source.tileGrid) {
      this.extent_ = olProperties.source.getTileGrid().extent_;
      this.extentProj_ = olProperties.source.projection.code_;
      this.extent_ = ImplUtils.transformExtent(this.extent_, this.extentProj_, olProjection);
    } else {
      this.extent_ = olProjection.getExtent();
    }
    return this.extent_;
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
    const minResolution = this.options.minResolution;
    const maxResolution = this.options.maxResolution;
    this.getOL3Layer().setExtent(maxExtent);
    if (this.tiled === true) {
      let resolutions = this.map.getResolutions();
      if (isNullOrEmpty(resolutions) && !isNullOrEmpty(this.resolutions_)) {
        resolutions = this.resolutions_;
      }
      // gets the tileGrid
      if (!isNullOrEmpty(resolutions)) {
        const source = this.createOLSource_(resolutions, minResolution, maxResolution, maxExtent);
        this.ol3Layer.setSource(source);
      }
    }
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
