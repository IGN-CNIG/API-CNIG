/**
 * @module M/layer/MapLibre
 */
import MapLibreImpl from 'impl/layer/MapLibre';
import LayerBase from './Layer';
import {
  isUndefined,
  isNullOrEmpty,
  normalize,
  isString,
} from '../util/Utils';
import Exception from '../exception/exception';
import { MapLibre as MapLibreType } from './Type';
import * as parameter from '../parameter/parameter';
import * as dialog from '../dialog';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * Las capas de tipo MapLibre ofrecen la posibilidad de cargar styles (.json) de MapLibre.
 *
 * @property {Boolean} extract Activa la consulta al hacer clic sobre un objeto geográfico,
 * por defecto falso.
 * @property {String} infoEventType Tipo de evento para mostrar la info de una feature.
 * @property {Boolean} disableBackgroundColor Desactiva el color de fondo de la capa.
 * @property {Object} style Estilos de la capa.
 * @property {String} type Tipo de capa.
 * @property {String} name Nombre de la capa.
 * @property {Number} opacity Opacidad de la capa.
 * @property {Boolean} visibility Verdadero si la capa es visible, falso si queremos que no lo sea.
 * @property {String} legend Leyenda de la capa.
 * @property {Object} attribution Atribución de la capa.
 *
 *
 * @api
 * @extends {M.layer.Vector}
 */
class MapLibre extends LayerBase {
  /**
   * Constructor principal de la clase. Crea una capa MapLibre
   * con parámetros especificados por el usuario.
   *
   * @constructor
   * @param {string|Mx.parameters.MapLibre} parameters Parámetros para la construcción de la capa.
   * - style: Url del servicio (.json).
   * - name: Nombre de la capa, debe ser único en el mapa.
   * - opacity: Opacidad de la capa (0-1), por defecto 1.
   * - visibility: Verdadero si la capa es visible, falso si queremos que no lo sea.
   *   En este caso la capa sería detectado por los plugins de tablas de
   *   contenidos y aparecería como no visible.
   * - extract: Opcional Activa la consulta por click en el objeto geográfico, por defecto falso.
   * - type: Tipo de la capa.
   * - infoEventType: Tipo de evento para mostrar la info de una feature.
   * - disableBackgroundColor: Desactiva el color de fondo de la capa.
   * - legend: Leyenda de la capa.
   * - attribution: Atribución de la capa.
   * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán a
   * la implementación de la capa.
   * - minZoom. Zoom mínimo aplicable a la capa.
   * - maxZoom. Zoom máximo aplicable a la capa.
   * - minScale. Escala mínima aplicable a la capa.
   * - maxScale. Escala máxima aplicable a la capa.
   * - minResolution. Resolución mínima aplicable a la capa.
   * - maxResolution. Resolución máxima aplicable a la capa.
   * - displayInLayerSwitcher. Indica si la capa se muestra en el selector de capas.
   * @param {Object} implParam Valores de la implementación por defecto,
   * se pasa un objeto implementación MapLibre.
   * @param {Object} vendorOptions Opciones para la biblioteca base.
   * @api
   */
  constructor(parameters = {}, options = {}, vendorOptions = {}) {
    let opts = parameter.layer(parameters, MapLibreType);
    const optionsVar = options;

    // ! No API REST
    if (Object.keys(opts).length === 0) {
      opts = { ...opts, ...optionsVar };
    }

    // ! No se encontro soporte para maxExtent
    if (opts.maxExtent) {
      opts.maxExtent = undefined;
      // eslint-disable-next-line no-console
      console.warn('La propiedad maxExtent no está soportada');
    }

    // ! Evitar que sea capa base
    if (opts.isBase || (!opts.transparent && opts.transparent !== undefined)) {
      opts.isBase = false;
      opts.transparent = true;
    }

    opts.type = MapLibreType;
    optionsVar.displayInLayerSwitcher = opts.displayInLayerSwitcher;

    const impl = new MapLibreImpl(opts, optionsVar, vendorOptions);

    // calls the super constructor
    super(opts, impl);

    if (isUndefined(MapLibreImpl)) {
      Exception('La implementación usada no puede crear capas Vector');
    }

    /**
     * extract: Optional Activa la consulta al hacer clic sobre un objeto geográfico,
     * por defecto falso.
     */
    this.extract = opts.extract === undefined ? false : opts.extract;

    /**
     * infoEventType. Tipo de evento para mostrar la info de una feature.
     */
    this.infoEventType = opts.infoEventType || 'click';

    this.disableBackgroundColor = opts.disableBackgroundColor !== undefined
      ? opts.disableBackgroundColor : undefined;

    this.style = opts.style;
  }

  /**
   * Devuelve el valor de la propiedad "extract". La propiedad "extract"
   * activa la consulta al hacer clic sobre un objeto geográfico, por defecto falso.
   * @function
   * @return {M.layer.MapLibre.impl.extract} Devuelve valor del "extract".
   * @api
   */
  get extract() {
    return this.getImpl().extract;
  }

  /**
   *  Devuelve el style de la capa.
   * @returns {Object} Estilos de la capa.
   */
  getStyle() {
    return this.style;
  }

  /**
   * Devuelve el objeto geográfico con el id pasado por parámetros.
   *
   * @function
   * @public
   * @param {String|Number} id - Id objeto geográfico.
   * @return {Null|M.feature} objeto geográfico: devuelve el objeto geográfico con esa
   * identificación si se encuentra,
   * en caso de que no se encuentre o no indique el id devuelve nulo.
   * @api
   */
  getFeatureById(id) {
    let feature = null;
    if (!isNullOrEmpty(id)) {
      feature = this.getImpl().getFeatureById(id);
    } else {
      dialog.error(getValue('dialog').id_feature);
    }
    return feature;
  }

  /**
   * Sobrescribe el filtro de la capa.
   *
   * @function
   * @public
   * @param {M.Filter} filter Filtro para configurar.
   * @api
   */
  setFilter(filter) {}

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
   * Este método establece el estilo en capa.
   *
   * @function
   * @public
   * @param {Object} newStyle Estilo de la capa.
   * @api
   */
  setStyle(newStyle) {
    if (isNullOrEmpty(newStyle)) return;
    if (Array.isArray(newStyle)) {
      newStyle.forEach(({ id, paint = false, layout = false }) => {
        if (paint) {
          paint.forEach(({ property, value }) => {
            this.setPaintProperty(id, property, value);
          });
        }

        if (layout) {
          layout.forEach(({ property, value }) => {
            this.setLayoutProperty(id, property, value);
          });
        }
      });
    } else {
      // eslint-disable-next-line no-underscore-dangle
      this.getImpl().setStyleMap(newStyle);
    }
  }

  /**
   * Este método establece el valor de una propiedad de pintura.
   * @function
   * @public
   * @param {String} layerId Id de la capa.
   * @param {String} property Propiedad de pintura.
   * @param {*} value Valor de la propiedad.
   * @api
   */
  setPaintProperty(layerId, property, value) {
    this.getImpl().setPaintProperty(layerId, property, value);
  }

  /**
   * Este método establece el valor de una propiedad de diseño.
   * @function
   * @public
   * @param {String} layerId Id de la capa.
   * @param {String} property Propiedad de diseño.
   * @param {*} value Valor de la propiedad.
   * @api
   */
  setLayoutProperty(layerId, property, value) {
    this.getImpl().setLayoutProperty(layerId, property, value);
  }

  /**
   * Este método obtiene la proyección del mapa.
   *
   * @function
   * @public
   * @returns {M.layer.MapLibre.impl.getProjection} Devuelve la proyección.
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
    return null;
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
    return this.getImpl().getFeatures();
  }

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

  /**
   * Devuelve el tipo de layer, MabLibre.
   *
   * @function
   * @getter
   * @returns {M.LayerType.MapLibre} Tipo MabLibre.
   * @api
   */
  get type() {
    return MapLibreType;
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
    if (!isUndefined(newType)
        && !isNullOrEmpty(newType) && (newType !== MapLibreType)) {
      Exception('El tipo de capa debe ser \''.concat(MapLibreType).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * Este método comprueba si un objeto es igual
   * a esta capa.
   *
   * @function
   * @param {Object} obj Objeto a comparar.
   * @returns {Boolean} Valor verdadero es igual, falso no lo es.
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof MapLibre) {
      equals = (this.style === obj.style);
      equals = equals && (this.name === obj.name);
    }

    return equals;
  }
}

/**
 *Estilos por defecto de la capa.
 * @const
 * @type {Object}
 * @public
 * @api
 */
MapLibre.DEFAULT_PARAMS_STYLE = {
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
MapLibre.DEFAULT_OPTIONS_STYLE = {
  point: {
    ...MapLibre.DEFAULT_PARAMS_STYLE,
    radius: 5,
  },
  line: {
    ...MapLibre.DEFAULT_PARAMS_STYLE,
  },
  polygon: {
    ...MapLibre.DEFAULT_PARAMS_STYLE,
  },
};

export default MapLibre;