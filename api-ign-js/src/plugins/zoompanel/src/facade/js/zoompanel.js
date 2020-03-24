/**
 * @module M/plugin/ZoomPanel
 */
import 'assets/css/zoompanel';
import ZoomPanelControl from './zoompanelcontrol';
import api from '../../api';

export default class ZoomPanel extends M.Plugin {
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
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     * ZoomPanel control
     * @public
     * @type {M.control.ZoomPanel}
     */
    this.control_ = new ZoomPanelControl(options);
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
    this.facadeMap_ = map;
    this.panel_ = new M.ui.Panel('panel_selection_raw', {
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      position: M.ui.position[this.position],
      collapsedButtonClass: 'g-plugin-zoompanel-editar',
      className: 'm-zoompanel',
      tooltip: 'Búsqueda por geometría',
    });
    this.panel_.addControls(this.control_);
    map.addPanels(this.panel_);
    this.control_.on('finished:draw', (geometry) => {
      this.fire('finished:draw', [geometry]);
    });
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

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata() {
    return this.metadata_;
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    this.facadeMap_.removeControls([this.control_]);
    [this.facadeMap_, this.control_, this.panel_] = [null, null, null];
  }
}
