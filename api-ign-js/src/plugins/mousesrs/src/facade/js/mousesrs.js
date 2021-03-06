/**
 * @module M/plugin/MouseSRS
 */
import '../assets/css/mousesrs';
import MouseSRSControl from './mousesrscontrol';
import { getValue } from './i18n/language';

export default class MouseSRS extends M.Plugin {
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
  constructor(options = {}) {
    super();

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Plugin tooltip
     *
     * @private
     * @type {string}
     */
    this.tooltip_ = options.tooltip || getValue('tooltip');

    /**
     * Shown coordinates SRS
     *
     * @private
     * @type {string}
     */
    this.srs_ = options.srs || 'EPSG:4326';

    /**
     * Label with SRS name
     * @private
     * @type {string}
     */
    this.label_ = options.label || 'WGS84';

    /**
     * Precision of coordinates
     *
     * @private
     * @type {number}
     */
    this.precision_ = M.utils.isNullOrEmpty(options.precision) ? 4 : options.precision;

    /**
     * Coordinates decimal digits for geographical projections
     * @private
     * @type {number}
     */
    this.geoDecimalDigits = options.geoDecimalDigits;

    /**
     * Coordinates decimal digits for UTM projections
     * @private
     * @type {number}
     */
    this.utmDecimalDigits = options.utmDecimalDigits;

    /**
     * Activate viewing z value
     * @private
     * @type {boolean}
     */
    this.activeZ = options.activeZ || false;
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.control_ = new MouseSRSControl(
      this.srs_,
      this.label_,
      this.precision,
      this.geoDecimalDigits,
      this.utmDecimalDigits,
      this.tooltip_,
      this.activeZ,
    );
    this.controls_.push(this.control_);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelMouseSRS', {
      collapsible: false,
      tooltip: this.tooltip_,
      className: 'm-plugin-mousesrs',
    });
    map.addControls(this.controls_);
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    this.map_.removeControls([this.control_]);
    this.map_ = null;
    this.control_ = null;
    this.panel_ = null;
  }


  /**
   * Name of the plugin
   *
   * @getter
   * @function
   */
  get name() {
    return 'mousesrs';
  }

  /**
   * This function returns the position
   *
   * @public
   * @return {string}
   * @api
   */
  get position() {
    return this.position_;
  }

  /**
   * This function returns the label
   *
   * @public
   * @function
   * @api
   */
  get label() {
    return this.label_;
  }

  /**
   * This function returns the srs (Spatial Reference System)
   *
   * @public
   * @function
   * @api
   */
  get srs() {
    return this.srs_;
  }

  /**
   * Precision of coordinates
   * @public
   * @function
   * @api
   */
  get precision() {
    return this.precision_;
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    let cadena = `${this.name}=${this.tooltip_}*${this.srs}*${this.label}*${this.precision}`;

    if (this.geoDecimalDigits === undefined || this.geoDecimalDigits == null || this.geoDecimalDigits === '') {
      cadena += '*';
    } else {
      cadena += `*${this.geoDecimalDigits}`;
    }

    if (this.utmDecimalDigits === undefined || this.utmDecimalDigits == null || this.utmDecimalDigits === '') {
      cadena += '*';
    } else {
      cadena += `*${this.utmDecimalDigits}`;
    }
    return cadena;
    // return `${this.name}=${this.tooltip_}*${this.srs}*${this.label}*$
    // {this.precision}*${this.geoDecimalDigits}*${this.utmDecimalDigits}`;
  }
}
