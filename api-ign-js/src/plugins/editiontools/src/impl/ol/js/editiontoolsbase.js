/**
 * @namespace M.impl.control
 */
export default class EditionToolsBase extends M.impl.Control {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor() {
    super();

    /**
     * Layer for use in control
     * @private
     * @type {M.layer.WFS}
     */
    this.feature_ = null;

    /**
     * Interaction pointer
     * @private
     * @type {ol.interaction.Pointer}
     */
    this.interaction_ = null;

    /**
     * Store modified features
     * @public
     * @type {array}
     * @api stable
     */
    this.modifiedFeatures = [];
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @param {HTMLElement} element - Container control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    ol.control.Control.call(this, { element, target: null });
    map.getMapImpl().addControl(this);
  }

  /**
   * This function activate control
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    if (M.utils.isNullOrEmpty(this.interaction_)) {
      this.createInteraction_();
      this.facadeMap_.getMapImpl().addInteraction(this.interaction_);
      this.interaction_.setActive(true);
    } else {
      this.interaction_.setActive(true);
    }
  }

  /**
   * This function deactivate control
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    if (M.utils.isNullOrEmpty(this.interaction_)) {
      this.createInteraction_();
      this.facadeMap_.getMapImpl().addInteraction(this.interaction_);
      this.interaction_.setActive(false);
    } else {
      this.interaction_.setActive(false);
    }
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.layer_ = null;
    this.interaction_ = null;
    this.modifiedFeatures = null;
  }
  //
  // setScale(scale) {
  //   this.controls_[0].setScale(scale);
  // }
  //
  // getCenter(coordinates) {
  //   this.controls_[0].getCenter(coordinates);
  // }
  // rotate(actualOrientation) {
  //   this.controls_[0].rotate(actualOrientation);
  // }
  //
  // scaleMap(actualScale, newScale) {
  //   this.controls_[0].scaleMap(actualScale, newScale);
  //
  // }
  // setMapCenter(map) {
  //   this.controls_[0].setMapCenter(map);
  // }
  // translateCenter(center) {
  //   this.controls_[0].translateCenter(center);
  // }
  // setMapCenterZoom(map, zoom) {
  //   this.controls_[0].setMapCenterZoom(map, zoom);
  // }
  // getCoordinates() {
  //   return this.controls_[0].getCoordinates();
  // }
  // setCoordinates(coordinates) {
  //   this.controls_[0].setCoordinates(coordinates);
  // }
  getControls() {
    return this.controls_;
  }
}
