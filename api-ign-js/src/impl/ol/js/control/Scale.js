/**
 * @module M/impl/control/Scale
 */
import { isNullOrEmpty } from 'M/util/Utils';
import Utils from 'impl/util/Utils';
import Control from './Control';

/**
 * @private
 */
const formatLongNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * @private
 */
const updateElement = (viewState, container, map, exact) => {
  const containerVariable = container;
  let num;
  if (map.getWMTS().length > 0) {
    num = Utils.getWMTSScale(map, exact);
    // num = map.getExactScale();
  } else if (map.getWMTS().length <= 0 && exact === true) {
    num = Utils.getWMTSScale(map, exact);
    // num = map.getExactScale();
  } else if (map.getWMTS().length <= 0 && !exact === true) {
    num = map.getScale();
  }

  if (!isNullOrEmpty(num)) {
    containerVariable.innerHTML = formatLongNumber(num);
  }
  const elem = document.querySelector('#m-level-number');
  if (elem !== null) {
    elem.innerHTML = Math.round(map.getZoom(), 2);
  }
};

/**
 * @classdesc
 * Main constructor of the class. Creates a WMC selector
 * control
 * @api
 */
class Scale extends Control {
  /**
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(options = {}) {
    super();
    this.facadeMap_ = null;
    this.exactScale = options.exactScale || false;
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;

    const scaleId = 'm-scale-span';
    this.scaleContainer_ = element.querySelector('#'.concat(scaleId));
    this.element = element;
    this.render = this.renderCB;
    this.target_ = null;
    map.getMapImpl().addControl(this);
  }

  /**
   * Update the scale line element.
   * @param {ol.MapEvent} mapEvent Map event.
   * @this {ol.control.ScaleLine}
   * @api
   */
  renderCB(mapEvent) {
    const frameState = mapEvent.frameState;
    if (!isNullOrEmpty(frameState)) {
      updateElement(frameState.viewState, this.scaleContainer_, this.facadeMap_, this.exactScale);
    }
  }

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    super.destroy();
    this.scaleContainer_ = null;
  }
}

export default Scale;
