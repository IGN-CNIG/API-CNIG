/**
 * @module M/plugin/BaseLayerSelector
 */
import 'assets/css/baselayerselector';
import BaseLayerSelectorControl from './baselayerselectorcontrol';

/**
 * @classdesc
 * Base layer selector Mapea plugin.
 */
export default class BaseLayerSelector extends M.Plugin {
  /**
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
    this.controls_.push(new BaseLayerSelectorControl(this.options.layerOpts));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelBaseLayerSelector', {
      collapsible: false,
      position: M.ui.position[this.position_],
      className: 'm-plugin-baselayer',
      tooltip: 'Selección de capa base',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
