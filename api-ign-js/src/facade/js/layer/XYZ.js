/**
 * @module M/layer/XYZ
 */
import XYZImpl from 'impl/layer/XYZ';
import LayerBase from './Layer';
import { isNullOrEmpty, isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import * as LayerType from './Type';
import xyz from '../parameter/xyz';
import { getValue } from '../i18n/language';
/**
 * @classdesc
 * Main constructor of the class. Creates a XYZ layer
 * with parameters specified by the user
 * @api
 */
class XYZ extends LayerBase {
  /**
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions = {}) {
    // checks if the implementation can create XYZ
    if (isUndefined(XYZImpl)) {
      Exception(getValue('exception').xyz_method);
    }
    const parameters = { ...xyz(userParameters), source: userParameters.source };
    /**
     * Implementation of this layer
     * @public
     * @type {M/impl/layer/XYZ}
     */
    const impl = new XYZImpl(userParameters, options, vendorOptions);
    // calls the super constructor
    super(parameters, impl);
    /**
     * XYZ url
     * @public
     * @type {string}
     */
    this.url = parameters.url;
    /**
     * XYZ name
     * @public
     * @type {string}
     */
    this.name = parameters.name;
    /**
     * XYZ legend
     * @public
     * @type {string}
     */
    this.legend = parameters.legend;
    /**
     * XYZ minZoom
     * @public
     * @type {number}
     */
    this.minZoom = parameters.minZoom;
    /**
     * XYZ maxZoom
     * @public
     * @type {number}
     */
    this.maxZoom = parameters.maxZoom;
    /**
     * XYZ tileGridMaxZoom
     * @public
     * @type {number}
     */
    this.tileGridMaxZoom = parameters.tileGridMaxZoom;
    /**
     * XYZ options
     * @public
     * @type {object}
     */
    this.options = options;
  }
  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.XYZ;
  }

  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.XYZ)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.XYZ).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }
  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof XYZ) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  }
}
export default XYZ;
