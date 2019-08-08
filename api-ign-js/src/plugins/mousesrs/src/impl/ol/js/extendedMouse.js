/**
 * @module M/impl/control/Mouse
 */

/**
 * @classdesc
 * @api
 */
class Mouse extends ol.control.MousePosition {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC selector
   * control
   *
   * @constructor
   * @extends {ol.control.Control}
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(vendorOptions) {
    super(vendorOptions);

    /**
     * Coordinate format given in OpenLayers format.
     * @private
     * @type {Object}
     */
    this.coordinateFormat = vendorOptions.coordinateFormat;

    this.label = vendorOptions.label;

    // FIXME: is this what mapProjection is supposed to be?
    this.mapProjection_ = vendorOptions.projection;

    this.target = vendorOptions.target;

    this.geoDecimalDigits = vendorOptions.geoDecimalDigits;

    this.utmDecimalDigits = vendorOptions.utmDecimalDigits;
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api
   */
  getElement() {
    return this.element;
  }

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api
   * @export
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
  }

  /**
   * @param {Event} event Browser event.
   * @protected
   */
  handleMouseMove(event) {
    const map = this.getMap();
    this.lastMouseMovePixel_ = map.getEventPixel(event);
    this.updateHTML_(this.lastMouseMovePixel_);
  }

  /**
   * @param {Event} event Browser event.
   * @protected
   */
  handleMouseOut(event) {
    this.updateHTML_(null);
    this.lastMouseMovePixel_ = null;
  }

  /**
   * @private
   * @function
   */
  updateHTML_(pixel) {
    // Text shown is empty if coordinates are not available.
    let html = ''; // this.undefinedHTML;
    // let decimalDigits;
    const projection = this.getProjection();

    if (pixel && this.mapProjection_) {
      // If given projection hasn't been transformed into map projection
      if (!this.transform_) {
        if (projection) {
          this.transform_ = ol.proj.getTransform(this.mapProjection_, projection);
        } else {
          this.transform_ = ol.proj.identityTransform;
        }
      }

      const map = this.getMap();
      const coordinate = map.getCoordinateFromPixel(pixel);

      // Transforms coordinates to map projection
      if (coordinate) {
        this.transform_(coordinate, coordinate);
        html = this.coordinateFormat(coordinate);

        // const coordinateFormat = this.coordinateFormat; // this.getCoordinateFormat();

        // if (coordinateFormat) {
        //   html = coordinateFormat(coordinate);
        // } else {
        //   html = coordinate.toString();
        // }
      }

      // eslint-disable-next-line no-underscore-dangle
      // if (this.getProjection().units_ === 'd') { // geographical coordinates
      //   decimalDigits = this.geoDecimalDigits;
      // } else { // 'm'
      //   decimalDigits = this.utmDecimalDigits;
      // }

      html += ` | ${this.label}`;
    }

    if (!this.renderedHTML_ || html !== this.renderedHTML_) {
      this.element.innerHTML = html;
      this.renderedHTML_ = html;
    }
  }
}
export default Mouse;
