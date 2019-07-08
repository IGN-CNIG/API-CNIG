/**
 * @module M/plugin/ShowCoordinates
 */
import 'assets/css/showcoordinates';
import ShowCoordinatesControl from './showcoordinatescontrol';

/**
 * @classdesc
 * ShowCoordinates mapea plugin
 */
export default class ShowCoordinates extends M.Plugin {
  /** @constructor
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
     * @private
     * @type {string}
     */
    this.position_ = options.position || 'TR';

    /**
     * Tooltip of the plugin
     * @private
     * @type {string}
     */
    this.tooltip_ = options.tooltip || 'Obtener coordenadas';
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api
   */
  addTo(map) {
    this.controls_.push(new ShowCoordinatesControl());
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelShowCoordinates', {
      collapsible: false,
      collapsed: false,
      position: M.ui.position[this.position_],
      className: 'showcoordinates-panel',
      tooltip: this.tooltip_,
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
