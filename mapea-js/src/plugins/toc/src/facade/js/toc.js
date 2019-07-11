/**
 * @module M/plugin/TOC
 */
import 'assets/css/toc';
import 'assets/css/fonts';
import TOCControl from './toc_control';

export default class TOC extends M.Plugin {
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
    this.control = new TOCControl();
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelTOC', {
      collapsible: true,
      position: M.ui.position[this.position_],
      collapsedButtonClass: 'g-plugin-toc-capas2',
      className: 'm-plugin-toc',
    });
    this.panel_.addControls([this.control]);
    map.addPanels(this.panel_);

    map.on(M.evt.ADDED_LAYER, () => {
      this.control.render();
    });
  }
}
