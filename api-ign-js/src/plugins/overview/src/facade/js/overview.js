/**
 * @module M/plugin/Overview
 */
import 'assets/css/overview';
import OverviewControl from './overviewcontrol';

export default class Overview extends M.Plugin {
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
     * Position of the plugin
     * @private
     * @type {String} - 'TR', 'TL', 'BL', 'BR'
     */
    this.position_ = options.position || 'TR';

    /**
     * Whether plugin is collapsed on the beginning.
     * @private
     * @type {Boolean}
     */
    this.collapsed_ = options.collapsed !== undefined ? options.collapsed : true;

    /**
     * Whether plugin is collapsible or not.
     * @private
     * @type {Boolean}
     */
    this.collapsible_ = options.collapsible !== undefined ? options.collapsible : true;

    /**
     * Base layer for overview map.
     * @private
     * @type {String}
     */
    this.baseLayer_ = options.baseLayer;
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
    this.control_ = new OverviewControl(this.baseLayer_, this.collapsed_);
    this.controls_.push(this.control_);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelOverview', {
      collapsible: this.collapsible_,
      collapsed: this.collapsed_,
      position: M.ui.position[this.position_],
      collapsedButtonClass: 'overview-mundo',
      className: 'overview-panel',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
