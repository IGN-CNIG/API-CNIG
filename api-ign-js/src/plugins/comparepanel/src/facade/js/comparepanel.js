/**
 * @module M/plugin/Comparepanel
 */
import 'assets/css/comparepanel';
import ComparepanelControl from './comparepanelcontrol';
import api from '../../api';
import { getValue } from './i18n/language';

export default class Comparepanel extends M.Plugin {
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
     * Name plugin
     * @private
     * @type {String}
     */
    this.name_ = 'comparepanel';

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
     * Class name of the html view Plugin
     * @public
     * @type {string}
     */
    this.className = 'm-plugin-comparepanel';

    /**
     * Position of the Plugin
     * @public
     * Posible values: TR | TL | BL | BR
     * @type {String}
     */
    const positions = ['TR', 'TL', 'BL', 'BR'];
    this.position = positions.includes(options.position) ? options.position : 'TR';

    /**
     * Collapsed attribute
     * @public
     * @type {boolean}
     */
    this.collapsed = options.collapsed;
    if (this.collapsed === undefined) this.collapsed = true;

    /**
     * Collapsible attribute
     * @public
     * @type {boolean}
     */
    this.collapsible = options.collapsible;
    if (this.collapsible === undefined) this.collapsible = true;

    /**
     * Vertical attribute
     * @public
     * Changes the plugin's orientation
     * @type {boolean}
     */
    this.vertical = options.vertical;
    if (this.vertical === undefined) this.vertical = true;

    /**
     * Base Layers
     * @public
     * Value: Array of layers with the layout [{name, tag, service},{...}]
     * @type {Array}
     */
    this.baseLayers = options.baseLayers;

    /**
     * mirrorpanelParams
     * @public
     * Value: Object with the rest of mirrorpanel's parameters 
     * @type {Object}
     */
    this.mirrorpanelParams = options.mirrorpanelParams || {};

    /**
     * timelineParams
     * @public
     * Value: Object with the rest of timeline's parameters 
     * @type {Object}
     */
    this.timelineParams = options.timelineParams || {};

    /**
     * lyrcompareParams
     * @public
     * Value: Object with the rest of lyrcompare's parameters 
     * @type {Object}
     */
    this.lyrcompareParams = options.lyrcompareParams || {};

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     *@private
     *@type { string }
     */
    this.tooltip_ = options.tooltip || getValue('tooltip');
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
    this.control_ = new ComparepanelControl({
      baseLayers: this.baseLayers,
      mirrorpanelParams: this.mirrorpanelParams,
      timelineParams: this.timelineParams,
      lyrcompareParams: this.lyrcompareParams,
    });
    this.controls_.push(this.control_);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelComparepanel', {
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      position: M.ui.position[this.position],
      className: this.className,
      collapsedButtonClass: 'cp-icon',
      tooltip: this.tooltip_,
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
    this.panel_._element.classList.add(this.vertical ? 'orientation-vertical' : 'orientation-horizontal');
  }


  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.control_.deactivate();
    this.map_.removeControls([this.control_]);
    [this.control_, this.panel_, this.map_] = [null, null, null];
  }

  /**
   * This function gets name plugin
   * @getter
   * @public
   * @returns {string}
   * @api stable
   */
  get name() {
    return this.name_;
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @getter
   * @api stable
   * @return {Object}
   */
  getMetadata() {
    return this.metadata_;
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
   * Activate plugin
   *
   * @function
   * @public
   * @api
   */
  activate() {
    this.control_.activate();
  }

  /**
   * Desactivate plugin
   *
   * @function
   * @public
   * @api
   */
  deactivate() {
    this.control_.deactivate();
  }

  /**
   * This function compare if pluging recieved
   * by param is instance of M.plugin.Comparepanel
   * @public
   * @function
   * @param {M.plugin} plugin to compare
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof Comparepanel) {
      return true;
    }
    return false;
  }
}
