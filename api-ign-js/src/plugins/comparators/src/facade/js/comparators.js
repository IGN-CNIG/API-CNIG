/**
 * @module M/plugin/Comparators
 */
import '../assets/css/comparators';
import ComparatorsControl from './comparatorscontrol';
import es from './i18n/es';
import en from './i18n/en';
import { getValue } from './i18n/language';

export default class Comparators extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
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
     * Plugin name
     * @public
     * @type {String}
     */
    this.name = 'comparators';

    /**
     * Plugin parameters
     * @public
     * @type {Object}
     */
    this.options = options;

    /**
     * Position of the plugin
     *
     * @private
     * @type {String} TL | TR | BL | BR
     */
    this.position_ = options.position || 'TL';

    /**
     * Option to allow the plugin to be collapsed or not
     * @private
     * @type {Boolean}
     */
    this.collapsed = !M.utils.isUndefined(options.collapsed) ? options.collapsed : true;

    /**
     * Option to allow the plugin to be collapsible or not
     * @private
     * @type {Boolean}
     */
    this.collapsible = !M.utils.isUndefined(options.collapsible) ? options.collapsible : true;

    /**
     * Tooltip of plugin
     * @private
     * @type {String}
     */
    this.tooltip_ = options.tooltip || getValue('tooltip');

    /**
     * Option to allow the plugin to be draggable or not
     * @private
     * @type {Boolean}
     */
    this.isDraggable = !M.utils.isUndefined(options.isDraggable) ? options.isDraggable : false;

    /**
     * Indicates order to the plugin
     * @private
     * @type {Number}
     */
    this.order = options.order >= -1 ? options.order : null;


    /**
     * Nombre del constructor de la clase
     * @private
     * @type {String}
     * @api stable
     */
    this.nameConstructor = 'Comparators';
  }

  /**
   * Return plugin language
   *
   * @public
   * @function
   * @param {string} lang type language
   * @api
   */
  static getJSONTranslations(lang) {
    if (lang === 'en' || lang === 'es') {
      return (lang === 'en') ? en : es;
    }
    return M.language.getTranslation(lang).comparators;
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
    // if (this.predefinedzoom === false && this.zoomextent === false &&
    //   this.viewhistory === false && this.zoompanel === false) {
    //   M.dialog.error(getValue('exception.no_controls'));
    // }
    // TO-DO Comprobar si pasar isDraggable por aqui
    this.controls_.push(new ComparatorsControl(this.isDraggable, this.order, this.options, map));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelComparators', {
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      position: M.ui.position[this.position_],
      className: 'm-plugin-comparators',
      tooltip: this.tooltip_,
      collapsedButtonClass: 'comparators-icon-zoom-mapa',
      order: this.order,
    });

    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }


  // TO-DO Crear getAPIRest
  /**
   * Gets the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return 'TO-DO';
  }

  /**
   * Gets the API REST Parameters in base64 of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRestBase64() {
    return `${this.name}=base64=${M.utils.encodeBase64(this.options)}`;
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    this.map_.removeControls(this.controls_);
    this.map_ = null;
    this.controls_ = null;
    this.panel_ = null;
    this.name = null;
  }

  /**
   * This function compare if pluging recieved by param is instance of M.plugin.Comparators
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api
   */
  equals(plugin) {
    if (plugin instanceof Comparators) {
      return true;
    }
    return false;
  }
}