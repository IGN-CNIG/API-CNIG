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
 * Generic permite añadir cualquier tipo de capa definida con la librería base.
 * Sus propiedades dependerán del tipo de capa, GenericRaster o GenericVector.
 * @api
 */
class Generic {
  /**
   * Constructor principal de la clase. Crea una capa WMS
   * con parámetros especificados por el usuario.
   * @constructor
   * @param {string|Mx.parameters.WMS} userParameters Parámetros para la construcción de la capa.
   * - name: nombre de la capa.
   * - legend: Nombre asociado en el árbol de contenidos, si usamos uno.
   * - transparent: Falso si es una capa base, verdadero en caso contrario.
   * - version: Versión WMS.
   * - isBase: Indica si la capa es base.
   * - ids: Opcional - identificadores por los que queremos filtrar los objetos geográficos.
   * - cql: Opcional - Sentencia CQL para filtrar los objetos geográficos.
   *  El método setCQL(cadena_cql) refresca la capa aplicando el nuevo predicado CQL que reciba.
   * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán a
   * la implementación de la capa.
   * - visibility: Indica la visibilidad de la capa.
   * - format: Formato de la capa, por defecto image/png.
   * - styles: Estilos de la capa.
   * - sldBody: Parámetros "ol.source.ImageWMS"
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - queryable: Indica si la capa es consultable.
   * - minScale: Escala mínima.
   * - maxScale: Escala máxima.
   * - minResolution: Resolución mínima.
   * - maxResolution: Resolución máxima.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * <pre><code>
   * import OLSourceTileWMS from 'ol/source/TileWMS';
   * {
   *  opacity: 0.1,
   *  source: new OLSourceTileWMS({
   *    attributions: 'wms',
   *    ...
   *  })
   * }
   * </code></pre>
   * @api
   */
  constructor(userParameters, options, vendorOptions) {
    let vendorOpt = vendorOptions;
    let params = userParameters || {};

    if (typeof userParameters === 'string') {
      params = parameter.layer(userParameters, LayerType.Generic);
      vendorOpt = params.vendorOptions;
    } else if (!isNullOrEmpty(userParameters)) {
      params.type = LayerType.Generic;
    }

    let opts = isNullOrEmpty(options) ? {} : options;
    // - Valores que llegaran a las herencias
    opts = {
      ...opts,
      ids: params.ids,
      cql: params.cql,
      type: params.type,
      legend: params.legend || params.name,
      visibility: params.visibility,
      opacity: params.opacity,
      isBase: params.isBase,
      transparent: params.transparent,
      version: params.version,
      maxExtent: params.useMaxExtent,
    };

    if (vendorOpt) {
      this.sourceType = Utils.getSourceType(vendorOpt);
      opts.name = Utils.addFacadeName(opts.name, vendorOpt);
      opts.legend = opts.legend || Utils.addFacadeLegend(vendorOpt);
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
