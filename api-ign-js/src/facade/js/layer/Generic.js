/**
 * @module M/layer/Generic
 */
import Utils from 'impl/util/Utils';
import GenericVector from './GenericVector';
import GenericRaster from './GenericRaster';
import * as parameter from '../parameter/parameter';

import * as LayerType from './Type';

import { isNullOrEmpty, isUndefined, isArray, isObject } from '../util/Utils';


/**
 * @classdesc
 * Generic permite añadir cualquier tipo de capa definida con la librería base
 * @property {String} sourceType - Tipo de capa
 * @api
 */
class Generic {
  constructor(userParameters, options, vendorOptions) {
    let vendorOpt = vendorOptions;
    let params = userParameters;

    if (isNullOrEmpty(userParameters) && typeof userParameters === 'string') {
      params = parameter.layer(userParameters, LayerType.Generic);
      vendorOpt = params.vendorOptions;
    } else {
      params.type = LayerType.Generic;
    }

    let opts = isNullOrEmpty(options) ? {} : options;
    opts = {
      ...opts,
      maxExtent: params.maxExtent,
      ids: params.ids,
      cql: params.cql,
      type: params.type,
      legend: params.legend || params.name,
      name: params.name,
      minZoom: params.minZoom,
      maxZoom: params.maxZoom,
      visibility: params.visibility,
      opacity: params.opacity,
      isBase: params.isBase,
      transparent: params.transparent,
      numZoomLevels: params.numZoomLevels,
      version: params.version,
    };

    if (vendorOpt) {
      this.sourceType = Utils.getSourceType(vendorOpt);
    }

    let ObjectGeneric = null;

    if (this.sourceType === 'vector') {
      ObjectGeneric = new GenericVector(params, opts, vendorOpt);
    }

    if (this.sourceType === 'raster') {
      ObjectGeneric = new GenericRaster(params, opts, vendorOpt);
    }

    // Parametros comunes
    ObjectGeneric.sourceType = this.sourceType;

    // Métodos comunes
    ObjectGeneric.getMaxExtent = this.getMaxExtent;
    ObjectGeneric.calculateMaxExtent = this.calculateMaxExtent;
    ObjectGeneric.setMaxExtent = this.setMaxExtent;

    return ObjectGeneric;
  }

  /**
  * Este método devuelve extensión máxima de esta capa.
  *
  * @function
  * @returns {Array} Devuelve la extensión máxima de esta capa.
  * @api
  */
  getMaxExtent(isSource = true) {
    let extent = !isSource ? this.maxExtent_ : this.getImpl().getMaxExtent();
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
}

export default Generic;
