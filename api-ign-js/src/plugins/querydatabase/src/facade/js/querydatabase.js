/**
 * @module M/plugin/QueryDatabase
 */
import 'assets/css/querydatabase';
import 'assets/css/fonts';
import QueryDatabaseControl from './querydatabasecontrol';
// import api from '../../api';
import { getValue } from './i18n/language';

import es from './i18n/es';
import en from './i18n/en';

export default class QueryDatabase extends M.Plugin {
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
     * Position of the plugin on browser window
     * @private
     * @type {Enum}
     * Possible values: 'TL', 'TR', 'BR', 'BL'
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

    this.connection_ = options.connection;

    this.styles_ = options.styles;
  }

  /**
   * Return plugin language
   *
   * @public
   * @function
   * @param {string} lang type language
   * @api stable
   */
  static getJSONTranslations(lang) {
    if (lang === 'en' || lang === 'es') {
      return (lang === 'en') ? en : es;
    }
    return M.language.getTranslation(lang).querydatabase;
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
    this.panel_ = new M.ui.Panel('panelQueryDatabase', {
      className: 'm-querydatabase',
      collapsed: this.collapsed_,
      collapsible: this.collapsible_,
      position: M.ui.position[this.position_],
      collapsedButtonClass: 'icon-tabla',
      tooltip: getValue('tooltip'),
    });

    this.control_ = new QueryDatabaseControl(
      this.collapsed_, this.position_, this.connection_,
      this.styles_,
    );
    this.controls_.push(this.control_);
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
    this.control_.initPanelAttributes();
  }

  /**
   * Destroys plugin
   * @public
   * @function
   * @api
   */
  destroy() {
    this.map_.removeControls(this.controls_);
    [this.map_, this.control_, this.controls_, this.panel_] = [null, null, null, null];
  }

  /**
   * @getter
   * @public
   */
  get name() {
    return 'querydatabase';
  }
}
