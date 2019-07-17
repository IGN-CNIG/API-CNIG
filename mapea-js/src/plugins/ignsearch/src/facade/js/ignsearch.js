/**
 * @module M/plugin/IGNSearch
 */
import 'assets/css/ignsearch';
import 'assets/css/fonts';
import IGNSearchControl from './ignsearchcontrol';

export default class IGNSearch extends M.Plugin {
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
     * This variable indicates which services should be searched
     * (geocoder, nomenclator or both)
     * @private
     * @type {string} - 'g' | 'n' | 'gn'
     */
    this.servicesToSearch = options.servicesToSearch || 'gn';

    /**
     * This variable sets the maximun results returned by a service
     * (if both services are searched the maximum results will be twice this number)
     * @private
     * @type {number}
     */
    this.maxResults = options.maxResults || 10;

    /**
     * This variables indicates which entities shouldn't be searched
     * @private
     * @type {string} - 'municipio' | 'poblacion' | 'toponimo' | 'municipio,poblacion' | etc
     */
    this.noProcess = options.noProcess || 'municipio,poblacion';

    /**
     * This variable indicates the country code.
     * @private
     * @type {string} - 'es'
     */
    this.countryCode = options.countryCode || 'es';

    /**
     * This variable indicates Geocoder Candidates service url
     * @private
     * @type {string}
     */
    this.urlCandidates = options.urlCandidates || 'https://www.cartociudad.es/geocoder/api/geocoder/candidatesJsonp';

    /**
     * This variable indicates Geocoder Find service url
     * @private
     * @type {string}
     */
    this.urlFind = options.urlFind || 'https://www.cartociudad.es/geocoder/api/geocoder/findJsonp';

    /**
     * This variable indicates Geocoder Reverse service url
     * @private
     * @type {string}
     */
    this.urlReverse = options.urlReverse || 'https://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode';

    /**
     * This variable indicates Nomenclator url prefix
     * @private
     * @type {string}
     */
    this.urlPrefix = options.urlPrefix || 'http://www.idee.es/';

    /**
     * This variable indicates Nomenclator SearchAssistant service url
     * @private
     * @type {string}
     */
    this.urlAssistant = options.urlAssistant || 'https://www.idee.es/communicationsPoolServlet/SearchAssistant';

    /**
     * This variable indicates Nomenclator Dispatcher service url
     * @private
     * @type {string}
     */
    this.urlDispatcher = options.urlDispatcher || 'https://www.idee.es/communicationsPoolServlet/Dispatcher';

    /**
     * This variable indicates which entity types should be searched on Nomenclator service.
     * @private
     * @type {Array<string>}
     */
    this.nomenclatorSearchType = options.nomenclatorSearchType;

    /**
     * This variable indicates whether result geometry should be drawn on map.
     * @private
     * @type {boolean}
     */
    this.resultVisibility = options.resultVisibility || true;

    /**
     * This variable indicates whether the plugin can be collapsed.
     * @private
     * @type {boolean}
     */
    this.isCollapsed = options.isCollapsed || false;

    /**
     * This variable indicates plugin's position on window
     * @private
     * @type {string} { 'TL' | 'TR' | 'BL' | 'BR' } (corners)
     */
    this.position = options.position || 'TL';

    /**
     * @private
     * @type {string} - tooltip on hover on plugin button
     */
    this.tooltip_ = options.tooltip || 'Búsqueda de lugares';

    /**
     * @private
     * @type {boolean}
     */
    this.reverse_ = options.reverse || false;
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
    this.controls_.push(new IGNSearchControl(
      this.servicesToSearch,
      this.maxResults,
      this.noProcess,
      this.countryCode,
      this.urlCandidates,
      this.urlFind,
      this.urlReverse,
      this.urlPrefix,
      this.urlAssistant,
      this.urlDispatcher,
      this.resultVisibility,
      this.reverse_,
    ));
    this.controls_[0].on('ignsearch:entityFound', (extent) => {
      this.fire('ignsearch:entityFound', [extent]);
    });
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelIGNSearch', {
      collapsible: true,
      position: M.ui.position[this.position],
      collapsed: this.isCollapsed,
      className: 'ign-search-panel',
      tooltip: this.tooltip_,
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
   * This function sets geometry visibility on map (visible|invisible).
   * @public
   * @function
   * @param {boolean} flag
   * @api
   */
  setResultVisibility(flag) {
    this.controls_[0].setResultVisibility(flag);
  }

  /**
   * Name of the plugin
   *
   * @getter
   * @function
   */
  get name() {
    return 'ignsearch';
  }

  /**
   * Reverse parameter
   *
   * @getter
   * @function
   */
  get reverse() {
    return this.reverse_;
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.servicesToSearch}*${this.maxResults}*${this.noProcess}*${this.resultVisibility}*${this.isCollapsed}*${this.position}*${this.reverse}`;
  }
}
