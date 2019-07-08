/**
 * @module M/plugin/MouseSRS
 */
import 'assets/css/mousesrs';
import MouseSRSControl from './mousesrscontrol';

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
    this.position_ = options.position || 'BL';

    /**
     * Plugin tooltip
     *
     * @private
     * @type {string}
     */
    this.tooltip_ = options.tooltip || 'Muestra coordenadas';

    /**
     * Shown coordinates SRS
     *
     * @private
     * @type {string}
     */
    this.srs_ = options.srs || 'EPSG:4326';
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
    this.controls_.push(new MouseSRSControl(this.srs_));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelMouseSRS', {
      collapsible: false,
      position: M.ui.position[this.position_],
      tooltip: this.tooltip_,
      className: 'm-plugin-mousesrs',
    });
    map.addControls(this.controls_);
  }
}
