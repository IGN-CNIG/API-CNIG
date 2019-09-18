/**
 * @module M/plugin/OverviewMap
 */
import 'assets/css/overviewmap';
import OverviewMapControl from './overviewmapcontrol';

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

    this.options = options || {};
    this.position = options.position || 'BL';

    this.vendorOptions = vendorOptions || {};
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
    this.controls_.push(new OverviewMapControl(this.options, this.vendorOptions));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelOverviewMap', {
      className: 'm-overviewmap-panel',
      collapsible: false,
      collapsed: true,
      position: M.ui.position[this.position],
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
