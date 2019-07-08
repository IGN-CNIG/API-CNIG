/**
 * @module M/plugin/SRSselector
 */
import 'assets/css/srsselector';
import SRSselectorControl from './srsselectorcontrol';

/**
 * @classdesc
 * SRS Mapea plugin.
 * This plugin reprojects the map.
 */
export default class SRSselector extends M.Plugin {
  /**
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor(options) {
    super();

    /**
     * Array of controls
     *
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Projections options
     *
     * @private
     * @type {Array<object>} - {code: ..., title: ..., units: m | d}
     */
    this.projections = options.projections;

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
    this.tooltip_ = options.tooltip || 'Selector de SRS';
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
    this.control_ = new SRSselectorControl(this.projections);
    this.controls_.push(this.control_);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelSRSselector', {
      collapsible: true,
      position: M.ui.position[this.position_],
      tooltip: this.tooltip_,
      className: `srsselector-panel ${this.positionClass_}`,
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
