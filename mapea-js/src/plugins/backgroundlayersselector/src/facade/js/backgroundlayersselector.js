/**
 * @module M/plugin/BackgroundLayersSelector
 */
import 'assets/css/main';
import BackgroundLayersSelectorControl from './backgroundlayersselectorcontrol';

/**
 * @classdesc
 * Background layers selector Mapea plugin.
 */
export default class BackgroundLayersSelector extends M.Plugin {
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
     *
     * @private
     * @type {Enum} TL | TR | BL | BR
     */
    this.position_ = options.position || 'TR';

    /**
     * @public
     * @type {object}
     */
    this.options = options;
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
    this.controls_.push(new BackgroundLayersSelectorControl(this.options.layerOpts));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelBackgroundLayersSelector', {
      collapsible: false,
      position: M.ui.position[this.position_],
      className: 'm-plugin-baselayer',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
