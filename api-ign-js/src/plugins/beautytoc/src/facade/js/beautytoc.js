/**
 * @module M/plugin/BeautyTOC
 */
import '../assets/css/beautytoc';
import '../assets/css/fonts';
import BeautyTOCControl from './beautytoc_control';

export default class BeautyTOC extends M.Plugin {
  /**
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api
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
     * @private
     * @type {string}
     */
    this.position_ = options.position || 'TR';

    /**
     * This parameter set if the plugin is collapsed
     * @private
     * @type {boolean}
     */
    this.collapsed_ = options.collapsed === true;
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
    this.control = new BeautyTOCControl();
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelBeautyTOC', {
      collapsible: true,
      position: M.ui.position[this.position_],
      collapsedButtonClass: 'icon-capas2',
      className: 'm-plugin-beautytoc',
      tooltip: 'Capas',
      collapsed: this.collapsed_,
    });
    this.panel_.addControls([this.control]);
    map.addPanels(this.panel_);

    map.on(M.evt.ADDED_LAYER, () => {
      this.control.render();
    });

    map.on(M.evt.COMPLETED, () => {
      this.control.render();
    });
  }

  /**
   * This function returns the position
   *
   * @public
   * @return {string}
   * @api
   */
  get position() {
    return this.position_;
  }

  /**
   * Name of the plugin
   *
   * @getter
   * @function
   */
  get name() {
    return 'beautytoc';
  }

  /**
   * Collapsed parameter
   *
   * @getter
   * @function
   */
  get collapsed() {
    return this.panel_.isCollapsed();
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position}*${this.collapsed}`;
  }
}
