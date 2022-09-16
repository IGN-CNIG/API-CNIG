/**
 * @module M/plugin/Infocoordinates
 */
import 'assets/css/fonts';
import 'assets/css/infocoordinates';
import InfocoordinatesControl from './infocoordinatescontrol';
import api from '../../api';
import { getValue } from './i18n/language';

export default class Infocoordinates extends M.Plugin {
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
     *  Decimal digits fixed on geographic coordinates
     * @public     *
     * @type {int}
     */
    this.decimalGEOcoord_ = options.decimalGEOcoord || 4;

    /**
     *  Decimal digits fixed on projected coordinates
     * @public     *
     * @type {int}
     */
    this.decimalUTMcoord_ = options.decimalUTMcoord || 2;

    /**
     * Name plugin
     * @private
     * @type {String}
     */
    this.name_ = 'infocoordinates';

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    this.control_ = null;

    /**
     * Position of the Plugin
     * @public
     * Posible values: TR | TL | BL | BR
     * @type {String}
     */
    const positions = ['TR', 'TL', 'BL', 'BR'];
    this.position_ = positions.includes(options.position) ? options.position : 'TR';

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     * URL to the help for the icon
     * @private
     * @type {string}
     */
    this.helpUrl_ = options.helpUrl;
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
    this.control_ = new InfocoordinatesControl(this.decimalGEOcoord_, this.decimalUTMcoord_, this.helpUrl_);
    this.controls_.push(this.control_);
    this.map_ = map;
    // panel para agregar control - no obligatorio
    this.panel_ = new M.ui.Panel('panelInfocoordinates', {
      collapsed: true,
      collapsible: true,
      position: M.ui.position[this.position_],
      className: 'm-plugin-infocoordinates',
      collapsedButtonClass: 'icon-target',
      tooltip: getValue('tooltip')
    });
    this.panel_.addControls(this.controls_);

    map.addPanels(this.panel_);
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.map_.removeControls([this.control_]);
    this.control_.deactivate();
    this.control_.removeLayerFeatures();
    [this.control_, this.panel_, this.map] = [null, null, null];
  }

  /**
   * This function gets name plugin
   * @getter
   * @public
   * @returns {string}
   * @api stable
   */
  get name() {
    return this.name_;
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
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position_}*${this.decimalGEOcoord_}*${this.decimalUTMcoord_}`;
  }
}
