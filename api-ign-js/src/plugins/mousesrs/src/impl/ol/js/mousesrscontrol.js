/**
 * @module M/impl/control/MouseSRSControl
 */
import ExtendedMouse from './extendedMouse';

export default class MouseSRSControl extends M.impl.Control {
  constructor(srs, label, precision, geoDecimalDigits, utmDecimalDigits) {
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
      tooltip: 'Coordenadas',
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
    if (this.facadeMap_.getProjection().units === 'd' && this.geoDecimalDigits !== undefined) { // geographical coordinates
      decimalDigits = this.geoDecimalDigits;
      // eslint-disable-next-line no-underscore-dangle
    } else if (this.facadeMap_.getProjection().units === 'm' && this.utmDecimalDigits !== undefined) { // 'm'
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
