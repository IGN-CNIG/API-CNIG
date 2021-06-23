import Measure from './measurebase';
import MeasurePositionImpl from '../../impl/ol/js/measureposition';
import measurepositionHTML from '../../templates/measureposition';
import { getValue } from './i18n/language';

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasurePosition
 * control to provides measure distances
 *
 * @constructor
 * @extends {M.control.Measure}
 * @api stable
 */

export default class MeasurePosition extends Measure {
  constructor() {
    // implementation of this control
    const impl = new MeasurePositionImpl();

    // calls the super constructor
    super(impl, measurepositionHTML, MeasurePosition.NAME);

    // checks if the implementation can create WMC layers
    if (M.utils.isUndefined(MeasurePositionImpl)) {
      M.Exception(getValue('exception.impl_position'));
    }
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof MeasurePosition) {
      equals = (this.name === obj.name);
    }
    return equals;
  }
}
/**
 * Name for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
MeasurePosition.NAME = 'measureposition';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
MeasurePosition.TEMPLATE = 'measureposition.html';

/**
 * Help message
 * @const
 * @type {string}
 * @public
 * @api stable
 */
export const HELP_KEEP_MESSAGE = getValue('text.keep_drawing_new_position_lines');
