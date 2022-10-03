/**
 * @module M/plugin/ShareMap
 */
import '../assets/css/sharemap';
import ShareMapControl from './sharemapcontrol';
import { getValue } from './i18n/language';

import es from './i18n/es';
import en from './i18n/en';

/**
 * @typedef {Object} ShareMapOptions
 * @property {number} [baseUrl] Base url of the shared map.
 * @property {enum<string>} [position='BR']? Position of the view plugin.
 * Allowed values: 'BR' | 'TR' | 'BL' | 'TL'.
 * @property {string} [title='Compartir URL']? The title of the plugin modal.
 * @property {string} [btn='OK']? The button text which close the modal plugin.
 * @property {string} [copyBtn='Copiar']? The button text which copy the url of shared map.
 * @property {StyleOptions} [styles={}]? The object with the information about primary color
 * and secondary color.
 * @property {bool} [overwriteStyles=false]? This flag allows to overwrite the colors of the plugin
 * with a custom css.
 * @property {string} [tooltip='¡Copiado!']? The text what is shown when the shared map url
 * is copied.
 *
 * Note: The character '?' indicates that the parameter is optional.
 */

/**
 * @typedef {Object} StyleOptions
 * @property {string} [primaryColor='#71a7d3']? Primary color of the plugin view in format CSS color
 * @property {string} [secondaryColor = '#fff']? Secondary color of the plugin view
 * in format CSS color.
 *
 * Note: The character '?' indicates that the parameter is optional.
 */

/**
 * Complete example of ShareMapPlugin options
 * @example
 *
 * {
 * 'baseUrl': 'https://cnigvisores_pub.desarrollo.guadaltel.es/mapea/'
 * 'position': 'BL',
 * 'title': 'Compartir Mapa',
 * 'btn': 'Aceptar',
 * 'copyBtn': 'Copiar url',
 * 'styles': {
 *  'primaryColor': 'yellow',
 *  'secondaryColor': 'green'
 *  },
 *  'overwriteStyles': 'false',
 *  'tooltip': 'Copiado'
 * }
 */

/**
 * Minimum example of ShareMapPlugin options
 * @example
 *
 * {
 * 'baseUrl': 'https://cnigvisores_pub.desarrollo.guadaltel.es/mapea/'
 * }
 */

/**
 * ShareMap plugin
 * @classdesc
 */
export default class ShareMap extends M.Plugin {
  /**
   * @constructor
   * @extends {M.Plugin}
   * @param {ShareMapOptions} options
   * @api
   */
  constructor(options) {
    super();

    if (M.utils.isNullOrEmpty(options.baseUrl)) {
      throw new Error('options.baseUrl is null or undefined.');
    }

    if (!M.utils.isString(options.baseUrl)) {
      throw new Error('options.baseUrl is not string type.');
    }

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
     * Base url of the shared map
     *
     * @private
     * @type {URLLike}
     */
    this.baseUrl_ = options.baseUrl;

    /**
     * Position of the plugin
     *
     * @private
     * @type {Enum} TL | TR | BL | BR
     */
    this.position_ = options.position || 'BR';

    /**
     * Title of the modal
     *
     * @private
     * @type {string}
     */
    this.title_ = options.title || getValue('title');

    /**
     * Title of the modal
     *
     * @private
     * @type {string}
     */
    this.text_ = options.text || getValue('text');

    /**
     * Text of the button
     *
     * @private
     * @type {string}
     */
    this.btn_ = options.btn || 'OK';

    /**
     * Text of the button
     *
     * @private
     * @type {string}
     */
    this.copyBtn_ = options.copyBtn || getValue('copy');

    /**
     * Text of the button
     *
     * @private
     * @type {string}
     */
    this.copyBtnHtml_ = options.copyBtnHtml || getValue('copy');

    /**
     * Styles options
     * @private
     * @type {object}
     */
    this.styles_ = options.styles || {};

    /**
     * Overwritten styles
     *
     * @private
     * @type {bool}
     */
    this.overwriteStyles_ = options.overwriteStyles || false;

    /**
     * Generate minimized url
     *
     * @private
     * @type {bool}
     */
    this.minimize_ = options.minimize || false;

    /**
     * Tooltip information for copy action
     *
     * @private
     * @type {string}
     */
    this.tooltip_ = options.tooltip || getValue('tooltip');

    /**
      * URL API or URL Visor (true o fdefault API, false visor)
      *
      * @private
      * @type @type {bool}
      */
    this.urlAPI_ = options.urlAPI || false;
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
    return M.language.getTranslation(lang).sharemap;
  }

  /**
   * This function adds this plugin into the map.
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api
   */
  addTo(map) {
    this.control = new ShareMapControl({
      baseUrl: this.baseUrl_,
      title: this.title_,
      text: this.text_,
      btn: this.btn_,
      copyBtn: this.copyBtn_,
      copyBtnHtml: this.copyBtnHtml_,
      primaryColor: this.styles_.primaryColor,
      secondaryColor: this.styles_.secondaryColor,
      tooltip: this.tooltip_,
      overwriteStyles: this.overwriteStyles_,
      minimize: this.minimize_,
      urlAPI: this.urlAPI_,
    });

    this.controls_.push(this.control);

    this.map_ = map;

    this.panel_ = new M.ui.Panel('panelShareMap', {
      collapsible: false,
      position: M.ui.position[this.position_],
      className: 'm-plugin-sharemap',
      tooltip: getValue('tooltipPanel'),
    });

    this.panel_.addControls(this.controls_);

    map.addPanels(this.panel_);
  }
  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    this.map_.removeControls([this.control]);
    [this.map_, this.control, this.controls_, this.panel_, this.baseUrl_,
      this.position_, this.title_, this.text_, this.btn_, this.copyBtn_,
      this.copyBtnHtml_, this.styles_, this.overwriteStyles_, this.tooltip_,
    ] = [null, null, null, null, null, null, null, null, null, null, null, null, null, null];
  }

  /**
   * This functions returns the controls of the plugin.
   *
   * @public
   * @return {M.Control}
   * @api
   */
  getControls() {
    return this.controls_;
  }

  /**
   * Name of the plugin
   *
   * @getter
   * @function
   */
  get name() {
    return 'sharemap';
  }

  /**
   * This function returns the base url option
   *
   * @public
   * @function
   * @api
   */
  get baseUrl() {
    return this.baseUrl_;
  }

  /**
   * This function returns the facade map.
   *
   * @public
   * @return {M.Map}
   * @api
   */
  get map() {
    return this.map_;
  }

  /**
   * This function returns the position
   *
   * @public
   * @return {string}
   * @api
   */
  get position() {
    return this.position_;
  }

  /**
   * This function returns the position
   *
   * @public
   * @return {string}
   * @api
   */
  get tooltip() {
    return this.tooltip_;
  }

  /**
   * This function returns the title
   *
   * @public
   * @return {string}
   * @api
   */
  get title() {
    return this.title_;
  }

  /**
   * This function returns the text
   *
   * @public
   * @return {string}
   * @api
   */
  get text() {
    return this.text_;
  }

  /**
   * This function returns the accept button
   *
   * @public
   * @return {string}
   * @api
   */
  get btn() {
    return this.btn_;
  }

  /**
   * This function returns the copy button
   *
   * @public
   * @return {string}
   * @api
   */
  get copyBtn() {
    return this.copyBtn_;
  }

  /**
   * This function returns the copy button html
   *
   * @public
   * @return {string}
   * @api
   */
  get copyBtnHtml() {
    return this.copyBtnHtml_;
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    // eslint-disable-next-line max-len
    // return `${this.name}=${this.baseUrl}*${this.position}*${this.title}*${this.text}*${this.tooltip}*${this.btn}*${this.copyBtn}*${this.copyBtnHtml}`;
    return `${this.name}=${this.baseUrl}*${this.position}`;
  }
}
