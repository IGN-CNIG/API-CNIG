import FacadeMeasureArea from '../../../facade/js/measurearea';
import FacadeMeasureLength from '../../../facade/js/measurelength';

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureClear
 * control
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
export default class MeasureClear extends M.impl.Control {
  constructor(measureLengthControl, measureAreaControl) {
    super();

    /**
     * Implementation measureLength
     * @private
     * @type {M.impl.control.Measure}
     */
    this.measureLengthControl_ = measureLengthControl;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    /**
     * Implementation measureArea
     * @private
     * @type {M.impl.control.Measure}
     */
    this.measureAreaControl_ = measureAreaControl;
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {HTMLElement} element - Container MeasureClear
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    const button = element.querySelector('#measurebar-clear-btn');
    button.addEventListener('click', this.onClick.bind(this));
    this.element = element;
    map.getMapImpl().addControl(this);
  }

  /**
   * This function remove items drawn on the map
   *
   * @public
   * @function
   * @api stable
   */
  onClick() {
    this.measureLengthControl_.clear();
    this.measureAreaControl_.clear();
    this.deactivateOtherBtns();
  }

  /**
   * Deactivates length measure and area measure buttons.
   * @public
   * @function
   * @api
   */
  deactivateOtherBtns() {
    const measureLength = this.facadeMap_.getControls().filter((control) => {
      return (control instanceof FacadeMeasureLength);
    })[0];

    if (measureLength) {
      measureLength.deactivate();
    }
    const measureArea = this.facadeMap_.getControls().filter((control) => {
      return (control instanceof FacadeMeasureArea);
    })[0];
    if (measureArea) {
      measureArea.deactivate();
    }
  }

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.element.remove();
    this.facadeMap_.removeControls(this);
    this.facadeMap_ = null;
  }
}
