/**
 * @module M/plugin/ViewHistory
 */
import 'assets/css/viewhistory';
import ViewHistoryControl from './viewhistorycontrol';

export default class ViewHistory extends M.Plugin {
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
    this.facadeMap_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Position of the plugin on browser window
     * @private
     * @type {String}
     * Possible values: 'TL', 'TR', 'BR', 'BL'
     */
    this.position = options.position || 'TR';
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
    this.controls_.push(new ViewHistoryControl());
    this.facadeMap_ = map;
    this.panel_ = new M.ui.Panel('panelViewHistory', {
      collapsible: false,
      position: M.ui.position[this.position],
      className: 'viewhistory-plugin',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
