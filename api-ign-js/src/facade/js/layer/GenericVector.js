/**
 * @module M/layer/GenericVector
 */
import GenericImpl from 'impl/layer/Generic';
import {
  isNullOrEmpty,
  isUndefined,
  isFunction,
  isArray,
  normalize,
  isString,
} from '../util/Utils';
import Exception from '../exception/exception';
import Vector from './Vector';
import { getValue } from '../i18n/language';
import * as EventType from '../event/eventtype';
import GenericStyle from '../style/Generic';

/**
 * @classdesc
 * GenericVector permite añadir cualquier tipo de capa vector.
 *
 * @property {String} name Nombre de la capa, identificador.
 * @property {Boolean} extract Activa la consulta al hacer clic sobre un objeto geográfico,
 * por defecto falso.
 * @property {Array} ids Identificadores por los que queremos filtrar los objetos geográficos.
 * @property {String} cql Sentencia CQL para filtrar los objetos geográficos.
 * @property {Object} options Opciones GenericVector.
 *
 * @api
 * @extends {M.layer.Vector}
 */
class GenericVector extends Vector {
  /**
   * Constructor principal de la clase.
   * @constructor
   * @param {string|Mx.parameters} userParameters Parámetros para la construcción de la capa.
   * - name: nombre de la capa.
   * - legend: Nombre asociado en el árbol de contenidos, si usamos uno.
   * - transparent: Falso si es una capa base, verdadero en caso contrario.
   * - isBase: Indica si la capa es base.
   * - ids: Opcional - identificadores por los que queremos filtrar los objetos geográficos.
   * - cql: Opcional - Sentencia CQL para filtrar los objetos geográficos.
   *  El método setCQL(cadena_cql) refresca la capa aplicando el nuevo predicado CQL que reciba.
   * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán a
   * la implementación de la capa.
   * - visibility: Indica la visibilidad de la capa.
   * - format: Formato de la capa, por defecto image/png.
   * - styles: Estilos de la capa.
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - queryable: Indica si la capa es consultable.
   * - minScale: Escala mínima.
   * - maxScale: Escala máxima.
   * - minResolution: Resolución mínima.
   * - maxResolution: Resolución máxima.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * @api
   */
  constructor(userParameters, options, vendorOptions = {}) {
    const params = { ...userParameters, ...options };

    params.infoEventType = params.userParameters || 'click';

    // checks if the implementation can create Generic layers
    if (isUndefined(GenericImpl)) {
      Exception(getValue('exception').generic_method);
    }

    const impl = new GenericImpl(options, vendorOptions, 'vector');

    // calls the super constructor
    super(params, options, vendorOptions, impl);

    if (!isNullOrEmpty(impl) && isFunction(impl.setFacadeObj)) {
      impl.setFacadeObj(this);
    }

    this.sourceType = impl.sourceType;

    // -- WFS --
    this.ids = userParameters.ids;

    /**
      * WFS cql: Opcional: instrucción CQL para filtrar.
      * El método setCQL(cadena_cql) refresca la capa aplicando el
      * nuevo predicado CQL que recibe.
      */
    this.cql = userParameters.cql;

    if (isNullOrEmpty(this.namespace)) {
      if (isNullOrEmpty(userParameters.namespace)) {
        this.namespace = undefined;
      } else {
        this.namespace = userParameters.namespace;
      }
    }

    /**
    * extract: Opcional, activa la consulta
    * haciendo clic en el objeto geográfico, por defecto falso.
    */
    this.extract = userParameters.extract || false;

    // -- Vector --
    /**
      * predefinedStyles: Estilos predefinidos para la capa.
      */
    this.predefinedStyles =
       isUndefined(options.predefinedStyles) ? [] : options.predefinedStyles;

    const defaultOptionsStyle = !isUndefined(this.constructor.DEFAULT_OPTS_STYLE)
      ? this.constructor.DEFAULT_OPTS_STYLE : this.constructor.DEFAULT_OPTIONS_STYLE;

    if (isUndefined(options.style) && !defaultOptionsStyle) {
      this.predefinedStyles.unshift(new GenericStyle(defaultOptionsStyle));
    } else if (isUndefined(options.style)) {
      this.predefinedStyles.unshift(new GenericStyle(GenericStyle.DEFAULT_OPTIONS_STYLE));
    } else {
      this.predefinedStyles.unshift(options.style);
    }
  }

  /**
    * Devuelve la url del servicio.
    *
    * @function
    * @getter
    * @public
    * @returns {String} URL del servicio.
    * @api
    */
  get url() {
    return this.getImpl().getURLService();
  }

  /**
    * Modifica la url del servicio.
    * @function
    * @setter
    * @public
    * @param {String} newUrl Nueva URL.
    * @api
    */
  set url(newUrl) {
    this.getImpl().setURLService(newUrl);
  }

  /**
   * Devuelve el valor de la propiedad "extract". La propiedad "extract" tiene la
   * siguiente función: Activa la consulta al hacer clic en la característica, por defecto falso.
   *
   * @function
   * @getter
   * @returns {M.LayerType.KML} Valor de la propiedad "extract".
   * @api
   */
  get extract() {
    return this.getImpl().extract;
  }

  /**
   * Sobrescribe el valor de la propiedad "extract". La propiedad "extract" tiene la
   * siguiente función: Activa la consulta al hacer clic en la característica, por defecto falso.
   *
   * @function
   * @setter
   * @param {Boolean} newExtract Nuevo valor para sobreescribir la propiedad "extract".
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
    * Devuelve la versión del servicio, por defecto es 1.3.0.
    *
    * @function
    * @getter
    * @return {M.layer.WMS.impl.version} Versión del servicio.
    * @api
    */
  get version() {
    return this.getImpl().version;
  }

  /**
    * Sobrescribe la versión del servicio, por defecto es 1.3.0.
    *
    * @function
    * @setter
    * @param {String} newVersion Nueva versión del servicio.
    * @api
    */
  set version(newVersion) {
    if (!isNullOrEmpty(newVersion)) {
      this.getImpl().setVersion(newVersion);
    }
  }

  /**
    * Devuelve los ids de la capa.
    * @function
    * @return {M.layer.WFS.impl.ids} Devuelve los ids.
    * @api
    */
  get ids() {
    return this.getImpl().ids;
  }

  /**
    * Sobrescribe los ids de la capa.
    * @function
    * @param {Array} newIds Nuevos ids.
    * @api
    */
  set ids(newIds) {
    if (isNullOrEmpty(newIds)) {
      this.getImpl().ids = this.ids;
    } else {
      this.getImpl().ids = newIds;
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
    if (obj instanceof GenericVector) {
      equals = (this.legend === obj.legend);
      equals = equals && (this.url === obj.url);
      equals = equals && (this.name === obj.name);
    }

    return equals;
  }

  addFeatures(featuresParam, update = false) {
    let features = featuresParam;
    if (!isNullOrEmpty(features)) {
      if (!isArray(features)) {
        features = [features];
      }
      if (this.getImpl().isLoaded()) {
        this.getImpl().addFeatures(features, update);
      } else {
        this.getImpl().on(EventType.LOAD, () => {
          this.getImpl().addFeatures(features, update);
        });
      }
    }
  }
}

/**
 * Parámetros predeterminados.
 * @const
 * @type {Object}
 * @public
 * @api
 */
GenericVector.DEFAULT_PARAMS = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: 'orange',
    width: 1.5,
  },
};

/**
   * Estilos predeterminados.
   * @const
   * @type {Object}
   * @public
   * @api
   */
GenericVector.DEFAULT_OPTIONS_STYLE = {
  point: {
    ...GenericVector.DEFAULT_PARAMS,
    radius: 5,
  },
  line: {
    ...GenericVector.DEFAULT_PARAMS,
  },
  polygon: {
    ...GenericVector.DEFAULT_PARAMS,
  },
};

export default GenericVector;
