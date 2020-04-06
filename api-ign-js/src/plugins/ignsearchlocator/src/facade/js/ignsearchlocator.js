/**
 * @module M/plugin/IGNSearchLocator
 */
import '../assets/css/ignsearchlocator';
import '../assets/css/fonts';
import api from '../../api';
import IGNSearchLocatorControl from './ignsearchlocatorcontrol';

export default class IGNSearchLocator extends M.Plugin {
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
     * CMC_url
     * @private
     * @type {String}
     */
    const defectCMC = 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/ConsultaMunicipioCodigos';
    this.CMC_url = options.CMC_url != null ? options.CMC_url : defectCMC;

    /**
     * DNPPP_url
     * @private
     * @type {String}
     */
    const defectDNPP = 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/Consulta_DNPPP_Codigos';
    this.DNPPP_url = options.DNPPP_url != null ? options.DNPPP_url : defectDNPP;

    /**
     * CPMRC_url
     * @private
     * @type {String}
     */
    const defectCPMRC = 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_CPMRC';
    this.CPMRC_url = options.CPMRC_url != null ? options.CPMRC_url : defectCPMRC;

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

    /**
     * Text to search
     * @private
     * @type {string}
     */
    this.locationID_ = (options.locationID && options.locationID.replace(/\^/g, '&')) || '';

    /**
     * Text to search
     * @private
     * @type {string}
     */
    this.requestStreet_ = (options.requestStreet && options.requestStreet.replace(/\^/g, '&')) || '';

    let geocoderCoords = options.geocoderCoords;
    if (M.utils.isString(geocoderCoords)) {
      geocoderCoords = geocoderCoords.split(',');
      geocoderCoords = [Number.parseFloat(geocoderCoords[0]),
        Number.parseFloat(geocoderCoords[1]),
      ];
    }
    /**
     * Geocoder reverse coordinates
     *
     * @private
     * @type {number}
     */
    this.geocoderCoords_ = geocoderCoords || [];

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
   * @api
   */
  addTo(map) {
    this.controls_.push(new IGNSearchLocatorControl(
      this.servicesToSearch,
      this.CMC_url,
      this.DNPPP_url,
      this.CPMRC_url,
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
      this.locationID_,
      this.requestStreet_,
      this.geocoderCoords_,
    ));
    this.controls_[0].on('ignsearchlocator:entityFound', (extent) => {
      this.fire('ignsearchlocator:entityFound', [extent]);
    });
    this.controls_[0].on('xylocator:locationCentered', (data) => {
      this.fire('xylocator:locationCentered', data);
    });
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelIGNSearchLocator', {
      collapsible: false,
      position: M.ui.position[this.position],
      collapsed: false,
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
    return 'ignsearchlocator';
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
   * Reverse geocoder coordinates
   *
   * @getter
   * @function
   */
  get geocoderCoords() {
    return this.controls_[0].geocoderCoords;
  }

  /**
   * Text to search
   * @getter
   * @function
   */
  get requestStreet() {
    return this.controls_[0].requestStreet;
  }

  /**
   * Text to search
   * @getter
   * @function
   */
  get locationID() {
    return this.controls_[0].locationID;
  }

  /**
   * This function compares plugins
   *
   * @public
   * @function
   * @param {M.Plugin} plugin to compare
   * @api
   */
  equals(plugin) {
    return plugin instanceof IGNSearchLocator;
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.servicesToSearch}*${this.maxResults}*${this.noProcess}*${this.resultVisibility}*${this.position}*${this.reverse}*${this.requestStreet.replace(/&/g, '^')}*${this.locationID}*${this.geocoderCoords}`;
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
    this.map_.removeControls(this.controls_);
    [this.map_, this.controls_, this.panel_] = [null, null, null];
  }
}
