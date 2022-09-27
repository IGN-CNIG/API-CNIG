/**
 * @module M/plugin/Popup
 */
import 'assets/css/popup';
import PopupControl from './popupcontrol';
import api from '../../api';
import { getValue, addTranslation } from './i18n/language';


export default class Popup extends M.Plugin {
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
     * Plugin position on window.
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
     * Url of HTML with the content for popup in the selected language.
     * @private
     * @type {String}
     */

    const defaultLenguage = {
      es: 'template_es',
      en: 'template_en',
    };

    if (options.helpLink) {
      this.url_ = options.helpLink[`${M.language.getLang()}`];
    } else {
      this.url_ = defaultLenguage[`${M.language.getLang()}`];
    }

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     * Name of the plugin
     * @public
     * @type {String}
     */
    this.name = 'popup';

    /**
     * Plugin tooltip
     *
     * @private
     * @type {string}
     */
    this.tooltip_ = options.tooltip || getValue('tooltip');
  }

  /**
 * change plugin language
 *
 * @public
 * @function
 * @param {string} lang type language
 * @api stable
 */
  addTranslationPlugin(lang) {
    addTranslation(lang, M.language.getTranslation(lang).popup);
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
    this.control_ = new PopupControl(this.url_);
    this.controls_.push(this.control_);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelPopup', {
      className: 'm-panel-popup',
      collapsed: this.collapsed_,
      collapsedButtonClass: 'icon-help',
      collapsible: true,
      position: M.ui.position[this.position_],
      tooltip: this.tooltip_,
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
    return `${this.name}=${this.position_}*${this.collapsed_}*${this.url_es_}*${this.url_en_}`;
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
    this.map_.removeControls([this.control_]);
    [this.map_, this.control_, this.panel_] = [null, null, null];
  }
}
