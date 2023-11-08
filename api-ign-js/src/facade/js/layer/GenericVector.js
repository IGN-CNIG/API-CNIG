/**
 * @module M/layer/GenericVector
 */
import GenericImpl from 'impl/layer/Generic';
import {
  isNullOrEmpty,
  isUndefined,
  isFunction,
} from '../util/Utils';
import Exception from '../exception/exception';
import Vector from './Vector';
import { getValue } from '../i18n/language';
import * as EventType from '../event/eventtype';
import GenericStyle from '../style/Generic';

class GenericVector extends Vector {
  /**
    * Constructor principal de la clase. Crea una capa Generic
    * con parámetros especificados por el usuario.
    * @constructor
    * @param {string|Mx.parameters.Generic} userParameters Parámetros para la construcción
    * de la capa.
    * - legend: Nombre asociado en el árbol de contenidos, si usamos uno.
    * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán a
    * la implementación de la capa.
    * - visibility: Indica la visibilidad de la capa.
    * @param {Object} vendorOptions Capa definida en con la librería base.
    * @api
    */
  constructor(userParameters, options, vendorOptions = {}) {
    // checks if the implementation can create Generic layers
    if (isUndefined(GenericImpl)) {
      Exception(getValue('exception').generic_method);
    }

    const impl = new GenericImpl(options, vendorOptions, 'vector');

    // calls the super constructor
    super(userParameters, options, vendorOptions, impl);

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

    // -- Vector --
    /**
      * predefinedStyles: Estilos predefinidos para la capa.
      */
    this.predefinedStyles =
       isUndefined(options.predefinedStyles) ? [] : options.predefinedStyles;
    if (isUndefined(options.style) && !isUndefined(this.constructor.DEFAULT_OPTS_STYLE)) {
      this.predefinedStyles.unshift(new GenericStyle(this.constructor.DEFAULT_OPTS_STYLE));
    } else if (isUndefined(options.style)) {
      this.predefinedStyles.unshift(new GenericStyle(GenericStyle.DEFAULT_OPTIONS_STYLE));
    } else {
      this.predefinedStyles.unshift(options.style);
    }

    this.setStyle(options.style);

    impl.on(EventType.LOAD, features => this.fire(EventType.LOAD, [features]));
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