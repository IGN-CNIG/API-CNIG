/**
 * @module M/plugin/SelectionDraw
 */
import 'assets/css/selectiondraw';
import SelectionDrawControl from './selectiondrawcontrol';

export default class SelectionDraw extends M.Plugin {
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
  constructor(opts = {}) {
    super();

    const options = {
      collapsed: false,
      collapsible: true,
      position: 'TL',
      projection: 'EPSG:3857',
      ...opts,

    };

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
     * Collapsed attribute
     * @public
     * @type {boolean}
     */
    this.collapsed = options.collapsed;

    /**
     * Collapsible attribute
     * @public
     * @type {boolean}
     */
    this.collapsible = options.collapsible;

    /**
     * Position of plugin
     * @public
     * @type
     */
    this.position = options.position;

    /**
     * SelectionDraw control
     * @public
     * @type {M.control.SelectionDraw}
     */
    this.control_ = new SelectionDrawControl(options);
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
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panel_selection_raw', {
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      position: M.ui.position[this.position],
      collapsedButtonClass: 'g-plugin-selectordraw-editar',
      className: 'm-selectiondraw',
      tooltip: 'Búsqueda por geometría',
    });
    this.panel_.addControls(this.control_);
    map.addPanels(this.panel_);
    this.control_.on('finished:draw', (geometry) => {
      this.fire('finished:draw', [geometry]);
    });
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
    this.map_ = null;
    this.control_ = null;
    this.panel_ = null;
  }
}
