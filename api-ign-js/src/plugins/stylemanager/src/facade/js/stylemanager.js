/* eslint-disable import/extensions */
/**
 * @module M/plugin/StyleManager
 */
import 'css/stylemanager';
import 'css/font-awesome.min';
import 'templates/categorystyles';
import StyleManagerControl from './stylemanagerControl';
import { ColorPickerPolyfill } from './utils/colorpicker';
import { getValue } from './i18n/language';

export default class StyleManager extends M.Plugin {
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
     * @private
     * @type {String}
     */
    this.position_ = options.position || 'TL';

    /**
     * Option to allow the plugin to be collapsed or not
     * @private
     * @type {Boolean}
     */
    this.collapsed_ = options.collapsed;
    if (this.collapsed_ === undefined) this.collapsed_ = true;

    /**
     * Option to allow the plugin to be collapsible or not
     * @private
     * @type {Boolean}
     */
    this.collapsible_ = options.collapsible;
    if (this.collapsible_ === undefined) this.collapsible_ = true;

    /**
     * @private
     * @type {M.ui.Panel}
     */
    this.panel_ = null;

    /**
     * @private
     * @type {M.layer.Vector}
     */
    this.layer_ = options.layer;

    ColorPickerPolyfill.apply(window);

    M.utils.extends = M.utils.extendsObj;
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
    this.controls_.push(new StyleManagerControl(this.layer_));
    this.map_ = map;
    this.panel_ = new M.ui.Panel(StyleManager.NAME, {
      collapsed: this.collapsed_,
      collapsible: this.collapsible_,
      className: 'm-stylemanager',
      collapsedButtonClass: 'stylemanager-palette',
      position: M.ui.position[this.position_],
      tooltip: getValue('symbology'),
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${StyleManager.NAME}=${this.position_}*${this.collapsed_}*${this.collapsible_}`;
  }

  /**
   * TODO
   */
  destroy() {
    this.map_.removeControls(this.controls_);
    [this.control_, this.panel_, this.map_] = [null, null, null];
  }

  get name() {
    return 'stylemanager';
  }
}
