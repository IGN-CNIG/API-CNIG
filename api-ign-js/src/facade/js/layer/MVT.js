/**
 * @module M/layer/MVT
 */
import MVTTileImpl from 'impl/layer/MVT';
import RenderFeatureImpl from 'impl/feature/RenderFeature';
import Vector from './Vector';
import { isUndefined, isNullOrEmpty, normalize, isString } from '../util/Utils';
import Exception from '../exception/exception';
import { MVT as MVTType } from './Type';

/**
 * Posibles modos para la capa MVT.
 * @const
 * @public
 * @api
 */
export const mode = {
  RENDER: 'render',
  FEATURE: 'feature',
};

/**
 * @classdesc
 * Las capas de tipo Vector Tile ofrecen ciertas ventajas en algunos escenarios,
 * debido a su bajo peso y carga rápida,
 * ya que se sirven en forma de teselas que contienen la información vectorial
 * del área que delimitan.
 *
 * @property {Boolean} extract Activa la consulta al hacer clic sobre un objeto geográfico,
 * por defecto falso.
 *
 * @api
 * @extends {M.layer.Vector}
 */
class MVT extends Vector {
  /**
   * Constructor principal de la clase. Crea una capa MVT
   * con parámetros especificados por el usuario.
   *
   * @constructor
   * @param {string|Mx.parameters.MVT} parameters Parámetros para la construcción de la capa.
   * - url: Url del servicio que devuelve los tiles vectoriales.
   * - name: Nombre de la capa, debe ser único en el mapa.
   * - projection: SRS usado por la capa.
   * - opacity: Opacidad de la capa (0-1), por defecto 1.
   * - visibility: Verdadero si la capa es visible, falso si queremos que no lo sea.
   *   En este caso la capa sería detectado por los plugins de tablas de
   *   contenidos y aparecería como no visible.
   * - mode: Modo de renderizado de la capa. Valores posibles: 'renderizar' | 'característica'.
   * - extract: Opcional Activa la consulta por click en el objeto geográfico, por defecto falso.
   * - type: Tipo de la capa.
   * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán a
   * la implementación de la capa.
   * - style: Define el estilo de la capa.
   * - minZoom. Zoom mínimo aplicable a la capa.
   * - maxZoom. Zoom máximo aplicable a la capa.
   * - visibility. Define si la capa es visible o no. Verdadero por defecto.
   * - displayInLayerSwitcher. Indica si la capa se muestra en el selector de capas.
   * - opacity. Opacidad de capa, por defecto 1.
   * @param {Object} implParam Valores de la implementación por defecto,
   * se pasa un objeto implementación MVT.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * <pre><code>
   * import OLSourceVector from 'ol/source/Vector';
   * {
   *  opacity: 0.1,
   *  source: new OLSourceVector({
   *    attributions: 'mvt',
   *    ...
   *  })
   * }
   * </code></pre>
   * @api
   */
  constructor(parameters = {}, options = {}, vendorOptions = {}, implParam) {
    const impl = implParam || new MVTTileImpl(parameters, options, vendorOptions);
    super(parameters, options, vendorOptions, impl);

    if (isUndefined(MVTTileImpl)) {
      Exception('La implementación usada no puede crear capas Vector');
    }

    /**
     * extract: Optional Activa la consulta al hacer clic sobre un objeto geográfico,
     * por defecto falso.
     */
    this.extract = parameters.extract;
  }


  /**
   * Devuelve el tipo de capa, MVT.
   *
   * @function
   * @getter
   * @return {M.LayerType.MVT} Tipo MVT.
   * @api
   */
  get type() {
    return MVTType;
  }

  /**
   * Sobrescribe el tipo de capa.
   *
   * @function
   * @setter
   * @param {String} newType Nuevo tipo.
   * @api
   */
  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== MVTType)) {
      Exception('El tipo de capa debe ser \''.concat(MVTType).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * Devuelve el valor de la propiedad "extract". La propiedad "extract"
   * activa la consulta al hacer clic sobre un objeto geográfico, por defecto falso.
   * @function
   * @return {M.layer.MVT.impl.extract} Devuelve valor del "extract".
   * @api
   */
  get extract() {
    return this.getImpl().extract;
  }

  /**
   * Sobrescribe el valor de la propiedad "extract". La propiedad "extract"
   * activa la consulta al hacer clic sobre un objeto geográfico, por defecto falso.
   * @function
   * @param {Boolean} newExtract Nuevo valor para el "extract".
   * @api
   */
  set extract(newExtract) {
    if (!isNullOrEmpty(newExtract)) {
      if (isString(newExtract)) {
        this.getImpl().extract = (normalize(newExtract) === 'true');
      } else {
        this.getImpl().extract = newExtract;
      }
    } else {
      this.getImpl().extract = false;
    }
  }

  /**
   * Este método calcula la extensión máxima de esta capa.
   *
   * @function
   * @returns {M.layer.MVT.maxExtent} maxExtent.
   * @api
   */
  getMaxExtent() {
    let maxExtent = this.userMaxExtent;
    if (isNullOrEmpty(maxExtent)) {
      maxExtent = this.map_.userMaxExtent;
      if (isNullOrEmpty(maxExtent)) {
        maxExtent = this.map_.getProjection().getExtent();
      }
    }
    return maxExtent;
  }

  /**
   * Este método calcula la extensión máxima de esta capa, devuelve una promesa.
   *
   * @function
   * @returns {M.layer.MVT.maxExtent} Promesa, maxExtent.
   * @api
   */
  calculateMaxExtent() {
    return new Promise(resolve => resolve(this.getMaxExtent()));
  }

  /**
   * Este método establece el estilo en capa.
   *
   * @function
   * @public
   * @param {M.Style} styleParam Estilos que proporciona el usuario.
   * @param {Boolean} applyToFeature Verdadero el estilo se aplicará a los objetos geográficos,
   * por defecto falso.
   * @param {M.layer.MVT.DEFAULT_OPTIONS_STYLE} defaultStyle Estilos por defecto de la capa.
   * @api
   */
  setStyle(styleParam, applyToFeature = false, defaultStyle = MVT.DEFAULT_OPTIONS_STYLE) {
    super.setStyle(styleParam, applyToFeature, defaultStyle);
  }

  /**
   * Este método obtiene la proyección del mapa.
   *
   * @function
   * @public
   * @returns {M.layer.MVT.impl.getProjection} Devuelve la proyección.
   * @api
   */
  getProjection() {
    return this.getImpl().getProjection();
  }

  /**
   * Obtiene el tipo de geometría de la capa.
   * Tipo de geometría: POINT (Punto), MPOINT (Multiples puntos), LINE (línea),
   * MLINE (Multiples línes), POLYGON (Polígono), or MPOLYGON (Multiples polígonos).
   * @function
   * @public
   * @return {String} Tipo de geometría de la capa.
   * @api
   */
  getGeometryType() {
    let geometry = null;
    const features = this.getFeatures();
    if (!isNullOrEmpty(features)) {
      const firstFeature = features[0];
      if (!isNullOrEmpty(firstFeature)) {
        geometry = firstFeature.getType();
      }
    }
    return geometry;
  }

  /**
   * Devuelve todos los objetos geográficos de la capa.
   *
   * @function
   * @public
   * @return {Array<M.RenderFeature>} Devuelve un array con los objetos geográficos.
   * @api
   */
  getFeatures() {
    const features = this.getImpl().getFeatures();

    return features.map(olFeature => RenderFeatureImpl.olFeature2Facade(olFeature));
  }

  /**
   * Modifica el filtro.
   *
   * @function
   * @public
   * @api
   */
  setFilter() {}

  /**
   * Añade objeto geográficos.
   *
   * @function
   * @public
   * @api
   */
  addFeatures() {}

  /**
   * Elimina objeto geográficos.
   *
   * @function
   * @public
   * @api
   */
  removeFeatures() {}

  /**
   * Recarga la capa.
   *
   * @function
   * @public
   * @api
   */
  refresh() {}

  /**
   * Este método redibuja la capa.
   *
   * @function
   * @public
   * @api
   */
  redraw() {}

  /**
   * Transforma la capa en un GeoJSON.
   *
   * @function
   * @public
   * @api
   */
  toGeoJSON() {}
}

/**
 *Estilos por defecto de la capa.
 * @const
 * @type {Object}
 * @public
 * @api
 */
MVT.DEFAULT_PARAMS_STYLE = {
  fill: {
    color: '#fff',
    opacity: 0.6,
  },
  stroke: {
    color: '#827ec5',
    width: 2,
  },
};

/**
 * Opciones por defecto de la capa.
 *
 * @const
 * @type {Object}
 * @public
 * @api
 */
MVT.DEFAULT_OPTIONS_STYLE = {
  point: {
    ...MVT.DEFAULT_PARAMS_STYLE,
    radius: 5,
  },
  line: {
    ...MVT.DEFAULT_PARAMS_STYLE,
  },
  polygon: {
    ...MVT.DEFAULT_PARAMS_STYLE,
  },
};

export default MVT;
