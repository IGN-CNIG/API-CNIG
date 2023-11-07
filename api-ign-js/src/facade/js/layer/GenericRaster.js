/**
 * @module M/layer/GenericRaster
 */
import GenericImpl from 'impl/layer/GenericRaster';
import {
  isNullOrEmpty,
  isUndefined,
  isArray,
  isObject,
  isFunction,
} from '../util/Utils';
import Exception from '../exception/exception';
import LayerBase from './Layer';
import * as LayerType from './Type';
import { getValue } from '../i18n/language';

class GenericRaster extends LayerBase {
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

    const params = isNullOrEmpty(userParameters) ? {} : userParameters;
    params.type = LayerType.Generic;

    let opts = isNullOrEmpty(options) ? {} : options;
    opts = {
      ...opts,
      maxExtent: params.maxExtent,
      ids: params.ids,
      cql: params.cql,
      type: params.type,
      legend: params.legend || params.name,
      name: params.name,
    };

    const impl = new GenericImpl(opts, vendorOptions);

    // calls the super constructor
    super(opts, impl);

    if (!isNullOrEmpty(impl) && isFunction(impl.setFacadeObj)) {
      impl.setFacadeObj(this);
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
    * Este método devuelve extensión máxima de esta capa.
    *
    * @function
    * @returns {Array} Devuelve la extensión máxima de esta capa.
    * @api
    */
  getMaxExtent(isSource = true) {
    let extent = !isSource ? this.userMaxExtent : this.getImpl().getMaxExtent();
    if (isUndefined(extent) || isNullOrEmpty(extent)) {
      extent = this.map_.getProjection().getExtent();
    }
    return extent;
  }


  /**
    * Este método calcula la extensión máxima de esta capa.
    *
    * @function
    * @returns {M.layer.maxExtent} Devuelve una promesa, con la extensión máxima de esta capa.
    * @api
    */
  calculateMaxExtent() {
    return new Promise(resolve => resolve(this.getMaxExtent(false)));
  }
  /**
    * Este método cambia la extensión máxima de la capa.
    *
    * @function
    * @param {Array|Object} maxExtent Nuevo valor para el "MaxExtent".
    * @api
    * @export
    */
  setMaxExtent(maxExtent) {
    let extent = maxExtent;
    if (!isArray(maxExtent) && isObject(maxExtent)) {
      extent = [
        maxExtent.x.min,
        maxExtent.y.min,
        maxExtent.x.max,
        maxExtent.y.max,
      ];
    }
    this.getImpl().setMaxExtent(extent);
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
    if (obj instanceof GenericRaster) {
      equals = (this.legend === obj.legend);
      equals = equals && (this.url === obj.url);
      equals = equals && (this.name === obj.name);
    }

    return equals;
  }
}

export default GenericRaster;
