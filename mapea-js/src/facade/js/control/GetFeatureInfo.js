/**
 * @module M/control/GetFeatureInfo
 */
import 'assets/css/controls/getfeatureinfo';
import GetFeatureInfoImpl from 'impl/control/GetFeatureInfo';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * @api
 */
class GetFeatureInfo extends ControlBase {
  /**
   * @constructor
   * @param {string} format - Format response
   * @param {object} options - Control options
   * @extends {M.Control}
   * @api
   */
  constructor(format, options = {}) {
    // implementation of this control
    const impl = new GetFeatureInfoImpl(format, options);
    // calls the super constructor
    super(impl, GetFeatureInfo.NAME);

    if (isUndefined(GetFeatureInfoImpl)) {
      Exception(getValue('exception').getfeatureinfo_method);
    }
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Facade map
   * @returns {Promise} HTML template
   * @api
   */
  createView(map) {
    return '';
  }

  /**
   * This function returns the HTML button control.
   *
   * @public
   * @function
   * @param {HTMLElement} element - Template control
   * @returns {HTMLElement} HTML control button
   * @api
   * @export
   */
  getActivationButton(element) {
    return null;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof GetFeatureInfo) {
      equals = (this.name === obj.name);
    }
    return equals;
  }
}

/**
 * Name to identify this control
 * @const
 * @type {string}
 * @public
 * @api
 */
GetFeatureInfo.NAME = 'getfeatureinfo';

export default GetFeatureInfo;
