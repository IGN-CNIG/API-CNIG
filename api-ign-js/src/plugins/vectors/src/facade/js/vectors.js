/**
 * @module M/plugin/Vectors
 */
import '../assets/css/vectors';
import '../assets/css/fonts';
import VectorsControl from './vectorscontrol';
import api from '../../api';
import { getValue } from './i18n/language';

export default class Vectors extends M.Plugin {
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
    this.position_ = options.position || 'TR';

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
     * Name of the plugin
     * @private
     * @type {String}
     */
    this.name_ = 'vectors';

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;
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
    this.panel_ = new M.ui.Panel('panelVectors', {
      className: 'm-vectors',
      collapsed: this.collapsed_,
      collapsible: this.collapsible_,
      position: M.ui.position[this.position_],
      collapsedButtonClass: 'icon-vectors',
      tooltip: getValue('tooltip'),
    });
    this.control_ = new VectorsControl();
    this.controls_.push(this.control_);

    this.map_.on(M.evt.ADDED_LAYER, () => {
      if (this.control_ !== null) {
        this.control_.renderLayers();
      }
    });

    this.map_.on(M.evt.REMOVED_LAYER, () => {
      if (this.control_ !== null) {
        this.control_.renderLayers();
      }
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
    return `${this.name_}=${this.position_}*${this.collapsed_}*${this.collapsible_}`;
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
    this.control_.resetInteractions();
    this.map_.removeControls([this.control_]);
    [this.map_, this.control_, this.panel_] = [null, null, null];
  }
}
