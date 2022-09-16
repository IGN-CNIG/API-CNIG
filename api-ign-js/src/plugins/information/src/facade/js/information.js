/**
 * @module M/plugin/Information
 */
import '../assets/css/information';
import api from '../../api';
import InformationControl from './informationcontrol';
import { getValue } from './i18n/language';

export default class Information extends M.Plugin {
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
  constructor(options) {
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
     * Position of the plugin
     *
     * @private
     * @type {string} - TL | TR | BL | BR
     */
    this.position_ = options.position || 'TR';

    /**
     * Plugin tooltip
     *
     * @private
     * @type {string}
     */
    this.tooltip_ = options.tooltip || getValue('tooltip');

    /**
     * Information format
     *
     * @private
     * @type {string}
     */
    this.format_ = options.format || 'text/html';

    /**
     * Maximum feature count
     *
     * @private
     * @type {Integer}
     */
    this.featureCount_ = options.featureCount || 10;

    /**
     * Buffer for click information
     *
     * @private
     * @type {Integer}
     */
    this.buffer_ = options.buffer || 10;

    /**
     * Information opened all, only if there is one layer, or not opened
     *
     * @private
     * @type {string}
     */
    this.opened_ = options.opened || 'closed';

    /**
     * Plugin name
     *
     * @private
     * @type {string}
     */
    this.name_ = 'information';

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;
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
    const fc = this.featureCount_;
    this.ctrl = new InformationControl(this.format_, fc, this.buffer_, this.tooltip_, this.opened_);
    this.controls_.push(this.ctrl);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelInformation', {
      className: 'm-plugin-information',
      position: M.ui.position[this.position_],
      tooltip: this.tooltip_,
      collapsedButtonClass: 'g-cartografia-info',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
   * Name of the plugin
   *
   * @getter
   * @function
   */
  get name() {
    return 'information';
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
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    let cadena = `${this.name_}=${this.position_}*${this.tooltip_}*${this.format_}*${this.featureCount_}`;

    if (this.buffer_ === undefined || this.buffer_ === null || this.buffer_ === '') {
      cadena += '*';
    } else {
      cadena += `*${this.buffer_}`;
    }

    if (this.opened_ === undefined || this.opened_ === null || this.opened_ === '') {
      cadena += '*';
    } else {
      cadena += `*${this.opened_}`;
    }

    return cadena;
  }

  /**
   * This function compares plugins
   *
   * @public
   * @function
   * @param {M.Plugin} plugin to compare
   * @api
   */
  equals(plugin) {
    return plugin instanceof Information;
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata() {
    return this.metadata_;
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    this.ctrl.deactivate();
    this.map_.removeControls(this.controls_);
    [this.map_, this.controls_, this.panel_] = [null, null, null];
  }
}
