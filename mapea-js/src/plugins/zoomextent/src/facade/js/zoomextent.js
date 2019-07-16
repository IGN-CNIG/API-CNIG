/**
 * @module M/plugin/ZoomExtent
 */
import 'assets/css/zoomextent';
import ZoomExtentControl from './zoomextentcontrol';

export default class ZoomExtent extends M.Plugin {
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
     *
     * @private
     * @type {Enum} TL | TR | BL | BR
     */
    this.position_ = options.position || 'TL';
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
    this.controls_.push(new ZoomExtentControl());
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelZoomExtent', {
      position: M.ui.position[this.position_],
      className: 'm-plugin-zoomextent',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
   * Name of the plugin
   *
   * @public
   * @function
   * @api
   */
  get name() {
    return 'zoomextent';
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position}`;
  }
}
