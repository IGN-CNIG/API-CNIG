/**
 * @module M/layer/TMS
 */
import TMSImpl from 'impl/layer/TMS';
import LayerBase from './Layer';
import { isNullOrEmpty, isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import * as LayerType from './Type';
import tms from '../parameter/tms';
import { getValue } from '../i18n/language';
/**
 * @classdesc
 * Main constructor of the class. Creates a TMS layer
 * with parameters specified by the user
 * @api
 */
class TMS extends LayerBase {
  /**
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.TMS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions = {}) {
    // checks if the implementation can create TMS
    if (isUndefined(TMSImpl)) {
      Exception(getValue('exception').tms_method);
    }
    const parameters = { ...tms(userParameters), source: userParameters.source };
    /**
     * Implementation of this layer
     * @public
     * @type {M/impl/layer/TMS}
     */
    const impl = new TMSImpl(userParameters, options, vendorOptions);
    // calls the super constructor
    super(parameters, impl);
    /**
     * TMS url
     * @public
     * @type {string}
     */
    this.url = parameters.url;
    /**
     * TMS name
     * @public
     * @type {string}
     */
    this.name = parameters.name;
    /**
     * TMS legend
     * @public
     * @type {string}
     */
    this.legend = parameters.legend;
    /**
     * TMS options
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
    return LayerType.TMS;
  }


  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.TMS)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.TMS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
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
    if (obj instanceof TMS) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  }
}
export default TMS;
