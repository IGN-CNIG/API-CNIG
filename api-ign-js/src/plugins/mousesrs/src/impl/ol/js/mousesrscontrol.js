/**
 * @module M/impl/control/MouseSRSControl
 */
import ExtendedMouse from './extendedMouse';

export default class MouseSRSControl extends M.impl.Control {
  constructor(srs, label, precision, geoDecimalDigits, utmDecimalDigits, tooltip) {
    super();

    /**
     * Coordinates spatial reference system
     *
     * @type { ProjectionLike } https://openlayers.org/en/latest/apidoc/module-ol_proj.html#~ProjectionLike
     * @private
     */
    this.srs_ = srs;

    /**
     * Label to show
     *
     * @type {string}
     * @private
     */
    this.label_ = label;

    /**
     * Precision of coordinates
     *
     * @private
     * @type {number}
     */
    this.precision_ = precision;

    /**
     * Number of decimal digits for geographic coordinates.
     * @private
     * @type {number}
     */
    this.geoDecimalDigits = geoDecimalDigits;

    /**
     * Number of decimal digits for UTM coordinates.
     * @private
     * @type {number}
     */
    this.utmDecimalDigits = utmDecimalDigits;

    /**
     * Tooltip
     *
     * @private
     * @type {string}
     */
    this.tooltip = tooltip;
  }

  /**
   * This function adds the control to the specified map
   *
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api
   */
  addTo(map, html) {
    this.facadeMap_ = map;
    this.mousePositionControl = new ExtendedMouse({
      coordinateFormat: ol.coordinate.createStringXY(this.getDecimalUnits()), // this.precision_),
      projection: this.srs_,
      label: this.label_,
      undefinedHTML: '',
      className: 'm-mouse-srs',
      target: html,
      tooltip: this.tooltip,
      geoDecimalDigits: this.geoDecimalDigits,
      utmDecimalDigits: this.utmDecimalDigits,
    });

    map.getMapImpl().addControl(this.mousePositionControl);

    super.addTo(map, html);
  }

  /**
   * Calculates desired decimal digits for coordinate format.
   * @private
   * @function
   */
  getDecimalUnits() {
    let decimalDigits;

    // eslint-disable-next-line no-underscore-dangle
    const srsUnits = ol.proj.get(this.srs_).units_;

    // eslint-disable-next-line no-underscore-dangle
    if (srsUnits === 'd' && this.geoDecimalDigits !== undefined) { // geographical coordinates
      decimalDigits = this.geoDecimalDigits;
      // eslint-disable-next-line no-underscore-dangle
    } else if (srsUnits === 'm' && this.utmDecimalDigits !== undefined) { // 'm'
      decimalDigits = this.utmDecimalDigits;
    } else {
      decimalDigits = this.precision_;
    }
    return decimalDigits;
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
}
