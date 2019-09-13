/**
 * @module M/plugin/PredefinedZoom
 */
import 'assets/css/predefinedzoom';
import PredefinedZoomControl from './predefinedzoomcontrol';

export default class PredefinedZoom extends M.Plugin {
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
    this.position = options.position || 'TL';

    /**
     * Bbox entered by user.
     * @private
     * @type {Array<Object>} [ {name, bbox}, {...} ]
     */
    this.savedZooms = options.savedZooms || [];
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
    this.controls_.push(new PredefinedZoomControl(this.savedZooms));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelPredefinedZoom', {
      collapsible: false,
      position: M.ui.position[this.position],
      className: 'm-predefinedzoom',
      // collapsedButtonClass: 'g-cartografia-flecha-izquierda',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
