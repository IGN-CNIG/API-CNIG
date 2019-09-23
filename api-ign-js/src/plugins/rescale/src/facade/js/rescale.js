/**
 * @module M/plugin/Rescale
 */
import 'assets/css/rescale';
import RescaleControl from './rescalecontrol';

export default class Rescale extends M.Plugin {
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
     * This variable indicates plugin's position on window
     * @private
     * @type {string} { 'TL' | 'TR' | 'BL' | 'BR' } (corners)
     */
    this.position = options !== undefined ? options.position : 'TR';

    /**
     * This variable indicates if this plugin is collapsible.
     * @private
     * @type {boolean}
     */
    this.collapsible = options !== undefined ? options.collapsible : true;

    /**
     * This variable indicates if this plugin is collapsed on load.
     * @private
     * @type {boolean}
     */
    this.collapsed = options !== undefined ? options.collapsed : true;
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
    this.controls_.push(new RescaleControl());
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelRescale', {
      className: 'm-rescale-panel',
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      position: M.ui.position[this.position],
      collapsedButtonClass: 'g-cartografia-escala3',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
