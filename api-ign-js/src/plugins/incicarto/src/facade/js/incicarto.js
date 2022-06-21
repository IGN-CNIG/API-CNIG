/**
 * @module M/plugin/Incicarto
 */
import '../assets/css/incicarto';
import '../assets/css/fonts';
import IncicartoControl from './incicartocontrol';
import api from '../../api';
import { getValue } from './i18n/language';

export default class Incicarto extends M.Plugin {
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
     * Option to allow the plugin to be collapsible or not
     * @private
     * @type {Boolean}
     */
    this.wfszoom_ = parseInt(options.wfszoom, 10);
    if (this.wfszoom_ === undefined || Number.isNaN(this.wfszoom_)) this.wfszoom_ = 12;

    this.precharged_ = options.precharged || [];

    this.controllist_ = options.controllist || [];

    this.interfazmode_ = options.interfazmode;
    if (this.interfazmode_ === undefined) this.interfazmode_ = 'simple';

    this.buzones_ = options.buzones;
    this.themes_ = options.themeList;
    this.errors_ = options.errorList;
    this.products_ = options.productList;

    /**
     * Name of the plugin
     * @private
     * @type {String}
     */
    this.name_ = 'incicarto';

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
    this.panel_ = new M.ui.Panel('panelIncicarto', {
      className: 'm-incicarto',
      collapsed: this.collapsed_,
      collapsible: this.collapsible_,
      position: M.ui.position[this.position_],
      collapsedButtonClass: 'icon-incicarto', //Icono de la App
      tooltip: getValue('tooltip'),
    });

    if (this.controllist_[0].id==="themeList"){
      this.errThemes_=this.controllist_[0];
    }
    if (this.controllist_[1].id==="errorList"){
      this.errTypes_=this.controllist_[1];
    }
    if (this.controllist_[2].id==="productList"){
      this.errProducts_=this.controllist_[2];
    }


    this.control_ = new IncicartoControl({
        wfszoom: this.wfszoom_,
        precharged: this.precharged_,
        controllist: this.controllist_,
        interfazmode: this.interfazmode_,
        buzones: this.buzones_,
        themes: this.themes_,
        errors: this.errors_,
        products: this.products_,
        errThemes: this.errThemes_,
        errTypes: this.errTypes_,
        errProducts: this.errProducts_,
    });

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
