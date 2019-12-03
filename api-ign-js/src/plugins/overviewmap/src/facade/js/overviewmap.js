/**
 * @module M/plugin/OverviewMap
 */
import 'assets/css/overviewmap';
import OverviewMapControl from './overviewmapcontrol';
import api from '../../api';

export default class OverviewMap extends M.Plugin {
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
  constructor(options, vendorOptions) {
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
     * Options of the plugin
     * @private
     * @type {Object}
     */
    this.options_ = options || {};

    /**
     * Position of the plugin
     * @private
     * @type {String}
     */
    this.position_ = options !== undefined ? options.position : 'BR';

    /**
     * Fixed zoom
     * @private
     * @type {Boolean}
     */
    this.fixed_ = options !== undefined ? options.fixed : false;

    /**
     * Zoom to make fixed
     * @private
     * @type {Number}
     */
    this.zoom_ = options !== undefined ? options.zoom : 4;

    /**
     * Vendor options
     * @public
     * @type {Object}
     */
    this.vendorOptions = vendorOptions || {};

    /**
     * Collapsed flad
     * @public
     * @type {Boolean}
     */
    this.vendorOptions.collapsed = vendorOptions !== undefined ? vendorOptions.collapsed : false;

    /**
     * Collapsible flag
     * @public
     * @type {Boolean}
     */
    this.vendorOptions.collapsible = vendorOptions !== undefined ? vendorOptions.collapsible : true;

    /**
     * Name of the plugin
     * @public
     * @type {String}
     */
    this.name = 'overviewmap';

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
    this.controls_.push(new OverviewMapControl(this.options_, this.vendorOptions));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelOverviewMap', {
      className: 'm-overviewmap-panel',
      position: M.ui.position[this.position_],
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
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
    this.map_.removeControls([this.control_]);
    [this.map_, this.control_, this.panel_] = [null, null, null];
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position_}*${this.vendorOptions.collapsed}*${this.vendorOptions.collapsible}*${this.fixed_}*${this.zoom_}`;
  }
}
