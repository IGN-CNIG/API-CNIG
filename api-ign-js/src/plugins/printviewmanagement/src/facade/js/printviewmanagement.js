/**
 * @module M/plugin/PrintViewManagement
 */
import '../assets/css/printviewmanagement';
import PrintViewManagementControl from './printviewmanagementcontrol';
import es from './i18n/es';
import en from './i18n/en';
import { getValue } from './i18n/language';

export default class PrintViewManagement extends M.Plugin {
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
    this.name = 'viewmanagement';

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
     * Indicates if the control georefImageEpsg is added to the plugin
     * @private
     * @type {Boolean|Array<Object>}
     */
    this.georefImageEpsg = options.georefImageEpsg ? this.getGeorefImageEpsg() : false;

    /**
     * Indicates if the control georefImage is added to the plugin
     * @private
     * @type {Boolean}
     */
    this.georefImage = !M.utils.isUndefined(options.georefImage) ? options.georefImage : true;

    /**
     * Indicates if the control printermap is added to the plugin
     * @private
     * @type {Boolean}
     */
    this.printermap = !M.utils.isUndefined(options.printermap) ? options.printermap : true;

    /**
     * Indicates if the control ZoomPanel is added to the plugin
     * @private
     * @type {Boolean}
     */
    this.zoompanel = !M.utils.isUndefined(options.zoompanel) ? options.zoompanel : true;

    /**
     * Indicates order to the plugin
     * @private
     * @type {Number}
     */
    this.order = options.order >= -1 ? options.order : null;
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
    return M.language.getTranslation(lang).printviewmanagement;
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
    this.map_ = map;
    if (this.georefImageEpsg === false && this.georefImage === false &&
      this.printermap === false && this.zoompanel === false) {
      M.dialog.error(getValue('exception.no_controls'));
    }
    // TO-DO Cambiar por un objeto
    this.controls_.push(new PrintViewManagementControl(
      this.isDraggable,
      this.georefImageEpsg,
      this.georefImage,
      this.printermap,
      this.zoompanel,
      this.order,
      this.map_,
    ));

    this.panel_ = new M.ui.Panel('panelPrintViewManagement', {
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      position: M.ui.position[this.position_],
      className: 'm-plugin-printviewmanagement',
      tooltip: this.tooltip_,
      collapsedButtonClass: 'printviewmanagement-icon-zoom-mapa',
      order: this.order,
    });

    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
   * the control georefImageEpsg
   *
   * @public
   * @function
   * @returns Default center and zoom level
   * @api
   */
  getGeorefImageEpsg() {
    const { layers, tooltip } = this.options.georefImageEpsg;

    const order = 0; // ?¿
    const georefImageEpsg = {
      layers,
      order,
      tooltip,
    };
    return georefImageEpsg;
  }

  /**
   * Gets the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position_}*${this.collapsed}*${this.collapsible}*${this.tooltip_}*${this.isDraggableE}
    *${this.predefinedzoom}*${this.georefImage}*${this.printermap}*${this.zoompanel}`;
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
   * This function compare if pluging recieved by param is instance of M.plugin.PrintViewManagement
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api
   */
  equals(plugin) {
    if (plugin instanceof PrintViewManagement) {
      return true;
    }
    return false;
  }
}
