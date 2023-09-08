/**
 * @module M/control/IGNSearchLocatorControl
 */
import template from 'templates/ignsearchlocator';
import results from 'templates/ignsearchlocator-results';
import IGNSearchLocatorImpl from '../../impl/ol/js/ignsearchlocatorcontrol';
import { getValue } from './i18n/language';

let typingTimer;

/** IGNSearch List Control
 *
 * @private
 * @type {object}
 */
const IGNSEARCH_TYPES_CONFIGURATION = [
  'Estado',
  // 'Comunidad aut\u00F3noma',
  // 'Ciudad con estatuto de autonom\u00EDa',
  // 'Provincia',
  // 'Municipio',
  // 'EATIM',
  'Isla administrativa',
  'Comarca administrativa',
  'Jurisdicci\u00F3n',
  // 'Capital de Estado',
  // 'Capital de comunidad aut\u00F3noma y ciudad con estatuto de autonom\u00EDa',
  // 'Capital de provincia',
  // 'Capital de municipio',
  // 'Capital de EATIM',
  // 'Entidad colectiva',
  // 'Entidad menor de poblaci\u00F3n',
  // 'Distrito municipal',
  // 'Barrio',
  // 'Entidad singular',
  // 'Construcci\u00F3n/instalaci\u00F3n abierta',
  // 'Edificaci\u00F3n',
  'V\u00E9rtice Geod\u00E9sico',
  // 'Hitos de demarcaci\u00F3n territorial',
  // 'Hitos en v\u00EDas de comunicaci\u00F3n',
  'Alineaci\u00F3n monta\u00F1osa',
  'Monta\u00F1a',
  'Paso de monta\u00F1a',
  'Llanura',
  'Depresi\u00F3n',
  'Vertientes',
  'Comarca geogr\u00E1fica',
  'Paraje',
  'Elemento puntual del paisaje',
  'Saliente costero',
  'Playa',
  'Isla',
  'Otro relieve costero',
  // 'Parque Nacional y Natural',
  // 'Espacio protegido restante',
  // 'Aeropuerto',
  // 'Aer\u00F3dromo',
  // 'Pista de aviaci\u00F3n y helipuerto',
  // 'Puerto de Estado',
  // 'Instalaci\u00F3n portuaria',
  // 'Carretera',
  // 'Camino y v\u00EDa pecuaria',
  // 'V\u00EDa urbana',
  // 'Ferrocarril',
  'Curso natural de agua',
  'Masa de agua',
  'Curso artificial de agua',
  // 'Embalse',
  'Hidr\u00F3nimo puntual',
  'Glaciares',
  'Mar',
  'Entrante costero y estrecho mar\u00EDtimo',
  'Relieve submarino',
];

export default class IGNSearchLocatorControl extends M.Control {
  /**
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(
    map,
    zoom,
    pointStyle,
    options,
    useProxy,
    statusProxy,
    positionPlugin,
  ) {
    if (M.utils.isUndefined(IGNSearchLocatorImpl)) {
      M.exception(getValue('exception.impl_ignsearchlocator'));
    }
    const impl = new IGNSearchLocatorImpl(map);
    super(impl, 'IGNSearchLocatorImpl');

    /**
     * Zoom
     *
     * @type {number}
     */
    this.zoom = zoom;

    /**
     * This variable indicates which services should be searched
     * (geocoder, nomenclator or both)
     * @private
     * @type {string} - 'g' | 'n' | 'gn'
     */
    this.servicesToSearch = options.servicesToSearch || 'g';

    /**
     * This variable sets the maximun results returned by a service
     * (if both services are searched the maximum results will be twice this number)
     * @private
     * @type {number}
     */
    this.maxResults = options.maxResults || 10;

    /**
     * This variable indicate which entities shouldn't be searched
     * @private
     * @type {string} - 'municipio' | 'poblacion' | 'toponimo' | 'callejero'
     * | 'municipio,poblacion' | etc
     */
    this.noProcess = options.noProcess;

    /**
     * This variable indicates the country code.
     * @private
     * @type {string} - 'es'
     */
    this.countryCode = options.countryCode || 'es';

    /**
     * This variable indicates whether the option to obtain the address
     * at a point on the map appears
     * @private
     * @type {boolean}
     */
    this.reverse = !M.utils.isUndefined(options.reverse) ? options.reverse : true;

    /**
     * This variable indicates whether result geometry should be drawn on map.
     * @private
     * @type {boolean}
     */
    this.resultVisibility = !M.utils.isUndefined(options.resultVisibility) ?
      options.resultVisibility : true;

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
     * Type of icon to display when a punctual type result is found
     * @private
     * @type {string}
     */
    this.pointStyle = pointStyle;

    /**
     * This variable indicates Nomenclator SearchAssistant service url
     * @private
     * @type {string}
     */
    this.searchPosition = options.searchPosition || 'geocoder,nomenclator';

    /**
     * Text to search
     * @private
     * @type {string}
     */
    this.locationID = (options.locationID && options.locationID.replace(/\^/g, '&')) || '';

    /**
     * Text to search
     * @private
     * @type {string}
     */
    this.requestStreet = (options.requestStreet && options.requestStreet.replace(/\^/g, '&')) || '';

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
    this.geocoderCoords = geocoderCoords || [];

    /**
     * This variable indicates which entity types should be searched on Nomenclator service.
     * @private
     * @type {Array<string>}
     */
    if (options.nomenclatorSearchType) {
      if (Array.isArray(options.nomenclatorSearchType)) {
        this.nomenclatorSearchType = options.nomenclatorSearchType;
      } else {
        this.nomenclatorSearchType = options.nomenclatorSearchType.split(',');
      }
    } else {
      this.nomenclatorSearchType = IGNSEARCH_TYPES_CONFIGURATION;
    }

    /**
     * This variable indicates whether reverse geocoder button is activated.
     * @private
     * @type {Boolean}
     */
    this.reverseActivated = false;

    /**
     * Indicates if you want to use proxy in requests
     * @private
     * @type {Number}
     */
    this.useProxy = useProxy;

    /**
     * Stores the proxy state at plugin load time
     * @private
     * @type {Boolean}
     */
    this.statusProxy = statusProxy;

    /**
     * Position plugin
     * @private
     * @type {String}
     */
    this.positionPlugin = positionPlugin;

    /**
     * Map
     */
    this.map = map;
  }

  /**
   * This function gets the initial lookup
   *
   * @function
   * @public
   * @api
   * @param {Node} html - Panel html
   */
  initializateAddress(html) {
    if ((this.locationID && this.locationID.length > 0) || (this.requestStreet &&
        this.requestStreet.length > 0) ||
      (this.geocoderCoords && this.geocoderCoords.length === 2)) {
      this.active(html);
    }
    if (this.locationID && this.locationID.length > 0) {
      this.createGeometryStyles();
      this.drawNomenclatorResult(this.locationID, false);
    }
    if (this.requestStreet && this.requestStreet.length > 0) {
      M.proxy(this.useProxy);
      M.remote.get(this.requestStreet).then((res) => {
        const geoJsonData = res.text.substring(9, res.text.length - 1);
        this.createGeometryStyles();
        this.drawGeocoderResult(geoJsonData);
      }).catch();
      M.proxy(this.statusProxy);
    }
    if (this.geocoderCoords && this.geocoderCoords.length === 2) {
      const reprojCoords = this.getImpl().reproject('EPSG:4326', this.geocoderCoords);
      this.showReversePopUp({
        coord: reprojCoords,
        fake: true,
      }, true);
    }
  }

  /**
   * This function active control
   *
   * @public
   * @function
   * @param {Node} html
   * @api
   */
  active(html) {
    this.html_ = html;
    const ignsearchactive = this.html_.querySelector('#m-locator-ignsearch').classList.contains('activated');
    this.deactive();
    if (!ignsearchactive) {
      if (this.positionPlugin === 'TC') {
        document.querySelector('.m-plugin-locator').classList.remove('m-plugin-locator-tc');
        document.querySelector('.m-plugin-locator').classList.add('m-plugin-locator-tc-withpanel');
      }
      this.html_.querySelector('#m-locator-ignsearch').classList.add('activated');
      const panel = M.template.compileSync(template, {
        vars: {
          reverse: this.reverse,
          placeholder: this.servicesToSearch === 'n' ? getValue('toponimo') : getValue('search_direction'),
          translations: {
            search_direction: getValue('search_direction'),
            get_direction: getValue('get_direction'),
            clean: getValue('clean'),
          },
        },
      });
      document.querySelector('#div-contenedor-locator').appendChild(panel);
      this.resultsBox = this.html_.querySelector('#m-ignsearch-panel>#m-ignsearchlocator-results');
      this.searchInput = this.html_.querySelector('#m-ignsearch-panel>#m-ignsearchlocator-search-input');
      this.addEvents();
    }
  }

  /**
   * This function deactive control
   *
   * @public
   * @function
   * @api
   */
  deactive() {
    this.html_.querySelector('#m-locator-ignsearch').classList.remove('activated');
    const panel = this.html_.querySelector('#m-ignsearch-panel');
    if (panel) {
      this.clearResults();
      document.querySelector('#div-contenedor-locator').removeChild(panel);
    }
  }

  /**
   * This function add events to html
   *
   * @public
   * @function
   * @api
   */
  addEvents() {
    this.html_.querySelector('#m-ignsearch-panel>#m-ignsearchlocator-search-input').addEventListener('keyup', e => this.createTimeout(e));
    this.html_.querySelector('#m-ignsearch-panel>#m-ignsearchlocator-search-input').addEventListener('click', () => this.openRecentsResults());
    if (this.reverse) {
      this.html_.querySelector('#m-ignsearch-panel>#m-ignsearchlocator-search-input').style.width = '160px';
      this.html_.querySelector('#m-ignsearch-panel>#m-ignsearchlocator-locate-button').addEventListener('click', this.activateDeactivateReverse.bind(this));
      this.clickReverseEvent = this.map.on(M.evt.CLICK, e => this.showReversePopUp(e));
    }
    this.html_.querySelector('#m-ignsearch-panel>#m-ignsearchlocator-clean-button').addEventListener('click', () => this.clearResults());
  }

  /**
   * This function toggles reverse geocoder button activation.
   *
   * @public
   * @function
   * @api
   */
  activateDeactivateReverse() {
    if (!this.reverseActivated) {
      this.invokeEscKey();
      this.reverseActivated = true;
      this.html_.querySelector('#m-ignsearchlocator-locate-button').style.color = '#71a7d3';
      document.addEventListener('keyup', this.checkEscKey.bind(this));
      document.getElementsByTagName('body')[0].style.cursor = `url(${M.utils.concatUrlPaths([M.config.THEME_URL, '/img/pushpin.svg'])}) 0 20, auto`;
    } else {
      this.reverseActivated = false;
      this.html_.querySelector('#m-ignsearchlocator-locate-button').style.color = '#7A7A73';
      document.removeEventListener('keyup', this.checkEscKey);
      document.getElementsByTagName('body')[0].style.cursor = 'auto';
    }
  }

  /**
   * This function invoke "Esc" key
   *
   * @public
   * @function
   * @api
   */
  invokeEscKey() {
    try {
      document.dispatchEvent(new window.KeyboardEvent('keyup', {
        key: 'Escape',
        keyCode: 27,
        code: '',
        which: 69,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
      }));
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err);
    }
  }

  /**
   * This function deactive option reverse when the user presses
   * "Esc" key
   *
   * @function
   * @public
   * @param {Event} evt - Event
   * @api
   */
  checkEscKey(evt) {
    if (evt.key === 'Escape') {
      this.reverseActivated = false;
      this.html_.querySelector('#m-ignsearchlocator-locate-button').style.color = '#7A7A73';
      document.removeEventListener('keyup', this.checkEscKey);
      document.getElementsByTagName('body')[0].style.cursor = 'auto';
    }
  }

  /**
   * This function shows information tooltip on clicked point.
   *
   * @public
   * @funcion
   * @param {Event} e - Event
   * @api
   */
  showReversePopUp(e, isGeocoderCoords = false) {
    if (this.reverseActivated || isGeocoderCoords) {
      // Reproject coordinates to ETRS89 on decimal grades (+ North latitude and East longitude)
      const origin = this.map.getProjection().code;
      const destiny = 'EPSG:4258';
      const etrs89pointCoordinates = this.getImpl()
        .reprojectReverse([e.coord[0], e.coord[1]], origin, destiny);
      const params = `lon=${etrs89pointCoordinates[0]}&lat=${etrs89pointCoordinates[1]}`;
      const urlToGet = `${this.urlReverse}?${params}`;
      const mapCoordinates = e.coord;
      this.geocoderCoords = etrs89pointCoordinates;
      const dataCoordinates = [etrs89pointCoordinates[1], etrs89pointCoordinates[0]];
      let fullAddress = '';
      M.proxy(this.useProxy);
      M.remote.get(urlToGet).then((res) => {
        if (res.text) {
          const returnData = JSON.parse(res.text);
          fullAddress = this.createFullAddress(returnData);
        } else {
          fullAddress = '';
        }
        this.showPopUp(fullAddress, mapCoordinates, dataCoordinates, null, e, false);
      });
      M.proxy(this.statusProxy);
    }
  }

  /**
   * This function takes data from an entity and returns the complete address
   *
   * @function
   * @public
   * @param {string} jsonResult - json string with entity data
   * @api
   */
  createFullAddress(jsonResult) {
    const via = (jsonResult.tip_via === null ||
      jsonResult.tip_via === undefined) ? '' : jsonResult.tip_via;
    const address = (jsonResult.address === null ||
      jsonResult.address === undefined) ? '' : jsonResult.address;
    const portal = (jsonResult.portalNumber === null ||
      jsonResult.portalNumber === undefined ||
      jsonResult.portalNumber === 0) ? '' : jsonResult.portalNumber;
    const muni = (jsonResult.muni === null ||
      jsonResult.muni === undefined) ? '' : jsonResult.muni;
    const province = (jsonResult.province === null ||
      jsonResult.province === undefined) ? '' : jsonResult.province;
    const extension = (jsonResult.extension === null ||
      jsonResult.extension === undefined) ? '' : jsonResult.extension.trim();
    let street = `${via} ${address} ${portal}`;
    if (!M.utils.isNullOrEmpty(extension)) {
      street += ` ${extension}`;
    }
    return `${street}, ${muni.toUpperCase()}, ${province.toUpperCase()}`;
  }

  /**
   * This function sets a timeout between keypress and search.
   *
   * @public
   * @function
   * @param {e} event - Event that triggers the method
   * @api
   */
  createTimeout(e) {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => this.searchInputValue(e), 500);
  }

  /**
   * This function open recent results
   *
   * @public
   * @function
   * @api
   */
  openRecentsResults() {
    if (!this.html_.querySelector('#m-ignsearch-panel>#m-ignsearchlocator-search-input').value &&
      !this.html_.querySelector('#m-ignsearchlocator-results-list')) {
      const recents = window.localStorage.getItem('recents');
      if (recents && recents.length > 0) {
        const compiledResult = M.template.compileSync(results, {
          vars: {
            noresults: false,
            places: JSON.parse(recents),
            translations: {
              noresults: getValue('exception.noresults'),
            },
          },
        });
        const elementList = compiledResult.querySelectorAll('li');
        elementList.forEach((listElement) => {
          listElement.addEventListener('click', () => {
            this.goToLocation(listElement, true);
          });
        });
        this.resultsBox.appendChild(compiledResult);
      }
    }
  }

  /**
   * This function
   * 1.- Takes user's input
   * 2.- Searches for ocurrences on IGN sources
   * 3.- Returns results as items in a drop-down list (returns address)
   * 4.- Onclick on an item goes to its coordinates
   *
   * @public
   * @function
   * @param {event} e - Event that triggers this method
   * @api
   */
  searchInputValue(e) {
    const value = e.target.value.replace(',', ' ');
    this.searchValue = value;
    this.resultsBox.innerHTML = '';

    if (value.length > 2) {
      // Adds animation class during loading
      this.resultsBox.classList.add('locator-icon-spinner');

      this.nomenclatorCandidates = [];
      this.geocoderCandidates = [];

      this.nomenclatorFinished = false;
      this.candidatesFinished = false;

      // saves on allCandidates search results from Nomenclator (CommunicationPoolservlet)
      this.getNomenclatorData(value, this.nomenclatorCandidates).then(() => {
        this.nomenclatorFinished = true;
        this.showCandidatesResults();
      });

      // saves on allCandidates search results from CartoCiudad (geocoder)
      this.getCandidatesData(value, this.geocoderCandidates).then(() => {
        this.candidatesFinished = true;
        this.showCandidatesResults();
      });
    }
  }

  /**
   * This function adds search coincidences on Nomenclator to array
   *
   * @public
   * @function
   * @param {string} inputValue - Location searched by user
   * @param {Array <Object>} resultsArray - Search results
   * @api
   */
  getNomenclatorData(inputValue, resultsArray) {
    const newInputVal = window.encodeURIComponent(inputValue);
    return new Promise((resolve) => {
      if (this.servicesToSearch !== 'g') {
        const params = `maxresults=${this.maxResults - 5}&name_equals=${newInputVal}`;
        const urlToGet = `${this.urlAssistant}?${params}`;
        M.proxy(this.useProxy);
        M.remote.get(urlToGet).then((res) => {
          const temporalData = (res.text !== '' && res.text !== null) ? JSON.parse(res.text) : { results: [] };
          const returnData = temporalData.results;
          for (let i = 0; i < returnData.length; i += 1) {
            // avoid nameplaces not included in this.nomenclatorSearchType
            if (this.nomenclatorSearchType.indexOf(returnData[i].type) >= 0) {
              resultsArray.push(returnData[i]);
            }
          }
          // move 'Núcleos de población' to start
          for (let i = 0; i < resultsArray.length; i += 1) {
            if (resultsArray[i].type === 'Núcleos de población') {
              const thisElement = resultsArray.splice(i, 1);
              resultsArray.splice(0, 0, thisElement);
            }
          }

          resultsArray.forEach((elem) => {
            // eslint-disable-next-line no-param-reassign
            elem.cps = true;
          });

          resolve();
        });
        M.proxy(this.statusProxy);
      } else {
        resolve();
      }
    });
  }

  /**
   * This function gets user input, searches for coincidences and adds each one to the given array.
   *
   * @public
   * @function
   * @param {string} inputValue - Search text written by user
   * @param {Array<Object>} resultsArray - Search result candidates from IGN services
   * @api
   */
  getCandidatesData(inputValue, resultsArray) {
    const newInputVal = window.encodeURIComponent(inputValue);
    return new Promise((resolve) => {
      if (this.servicesToSearch !== 'n') {
        let params = `q=${newInputVal}&limit=${this.maxResults}&no_process=${this.noProcess}`;
        params += `&countrycode=${this.countryCode}&autocancel=true`;
        const urlToGet = `${this.urlCandidates}?${params}`;
        M.proxy(this.useProxy);
        M.remote.get(urlToGet).then((res) => {
          if (res.code === 404 || res.code === 500) {
            M.dialog.error(getValue('exception.error_candidates'));
          } else {
            const returnData = JSON.parse(res.text.substring(9, res.text.length - 1));
            for (let i = 0; i < returnData.length; i += 1) {
              resultsArray.push(returnData[i]);
            }
          }
          resolve();
        });
        M.proxy(this.statusProxy);
      } else {
        resolve();
      }
    });
  }

  /**
   * This function show results of search
   *
   * @function
   * @public
   * @api
   */
  showCandidatesResults() {
    this.allCandidates = [];
    for (let i = 0; i < this.searchPosition.split(',').length; i += 1) {
      if (this.searchPosition.split(',')[i] === 'nomenclator') {
        for (let j = 0; j < this.nomenclatorCandidates.length; j += 1) {
          this.allCandidates.push(this.nomenclatorCandidates[j]);
        }
      }
      if (this.searchPosition.split(',')[i] === 'geocoder') {
        for (let j = 0; j < this.geocoderCandidates.length; j += 1) {
          this.allCandidates.push(this.geocoderCandidates[j]);
        }
      }
    }

    // Clears previous search
    this.resultsBox.innerHTML = '';
    // remove animation class and return to normal font size after loading
    this.resultsBox.classList.remove('locator-icon-spinner');
    const compiledResult = M.template.compileSync(results, {
      vars: {
        noresults: this.allCandidates.length === 0 &&
          this.nomenclatorFinished && this.candidatesFinished,
        places: this.allCandidates,
        translations: {
          noresults: getValue('exception.noresults'),
        },
      },
    });
    if (this.allCandidates.length > 0) {
      const elementList = compiledResult.querySelectorAll('li');
      elementList.forEach((listElement) => {
        listElement.addEventListener('click', () => {
          this.goToLocation(listElement);
        });
      });
    }

    this.resultsBox.appendChild(compiledResult);
  }

  /**
   * This function zooms in clicked location and draws geometry
   *
   * @public
   * @function
   * @param {Object} listElement - Element clicked result information
   * @param {Boolean} isRecentElement - True if the clicked item is from the recents list
   * @api
   */
  goToLocation(listElement, isRecentElement = false) {
    this.currentElement = listElement;
    const text = listElement.querySelector('#info').innerHTML;
    this.html_.querySelector('#m-ignsearchlocator-search-input').value = text;
    const candidates = isRecentElement ? JSON.parse(window.localStorage.getItem('recents')) : this.allCandidates;
    const selectedObject = candidates.filter(element => element.id === this.currentElement.getAttribute('id'))[0];
    this.setRecents(selectedObject);
    this.createGeometryStyles();
    // if item comes from geocoder
    if (Object.prototype.hasOwnProperty.call(selectedObject, 'address')) {
      this.getFindData(selectedObject).then((geoJsonData) => {
        if (geoJsonData) {
          this.drawGeocoderResult(geoJsonData);
          if (geoJsonData.includes('"tip_via":null') && (geoJsonData.includes('"type":"Municipio"') || geoJsonData.includes('"type":"municipio"') || geoJsonData.includes('"type":"Provincia"') || geoJsonData.includes('"type":"provincia"') || geoJsonData.includes('"type":"comunidad autonoma"'))) {
            this.map.removePopup();
          }
        }
      });
    } else { // if item comes from nomenclator
      this.map.removePopup();
      this.drawNomenclatorResult(selectedObject.id);
    }
    this.resultsBox.innerHTML = '';
  }

  /**
   * This function set search
   *
   * @public
   * @function
   * @param {Node} element - Element clicked
   * @api
   */
  setRecents(element) {
    let recents = JSON.parse(window.localStorage.getItem('recents'));

    if (!recents || recents.length === 0) {
      recents = [element];
    } else if (!this.checkDuplicateRecent(element)) {
      if (recents.length === 5) {
        recents.pop();
        recents.unshift(element);
      } else {
        recents.unshift(element);
      }
    }
    window.localStorage.setItem('recents', JSON.stringify(recents));
  }

  /**
   * This function check duplicates results
   *
   * @public
   * @function
   * @param {Node} element - Element clicked
   * @api
   */
  checkDuplicateRecent(element) {
    const recents = JSON.parse(window.localStorage.getItem('recents'));
    let found = false;

    recents.forEach((r) => {
      if (r.id === element.id) {
        found = true;
      }
    });

    return found;
  }

  /**
   * This function creates some geometry styles.
   *
   * @public
   * @function
   * @api
   */
  createGeometryStyles() {
    // Shows pin on drawn point
    if (this.pointStyle === 'pinAzul') {
      this.point = new M.style.Point({
        radius: 5,
        icon: {
          src: M.utils.concatUrlPaths([M.config.THEME_URL, '/img/marker.svg']),
          scale: 1.4,
          fill: {
            color: '#71a7d3',
          },
          stroke: {
            width: 30,
            color: 'white',
          },
          anchor: [0.5, 1],
        },
      });
    } else if (this.pointStyle === 'pinRojo') {
      this.point = new M.style.Point({
        radius: 5,
        icon: {
          src: M.utils.concatUrlPaths([M.config.THEME_URL, '/img/pinign.svg']),
          anchor: [0.5, 1],
        },
      });
    } else if (this.pointStyle === 'pinMorado') {
      this.point = new M.style.Point({
        radius: 5,
        icon: {
          src: M.utils.concatUrlPaths([M.config.THEME_URL, '/img/m-pin-24.svg']),
          anchor: [0.5, 1],
        },
      });
    }
    // Style for hiding geometry
    this.simple = new M.style.Polygon({
      fill: {
        color: 'black',
        opacity: 0,
      },
    });
  }

  /**
   * This function removes last search layer and adds new layer
   * with current result (from nomenclator) features to map and zooms in result.
   *
   * @public
   * @function
   * @param {string} locationId - id of the location object
   * @param {boolean} zoomIn - True for zoom
   * @api
   */
  drawNomenclatorResult(locationId, zoomIn = true) {
    this.requestStreet = '';
    this.requestPlace = M.utils.addParameters(this.urlDispatcher, {
      request: 'OpenQuerySource',
      query: `<ogc:Filter><ogc:FeatureId fid="${locationId}"/></ogc:Filter>`,
      sourcename: `${this.urlPrefix}communicationsPoolServlet/sourceAccessWFS-INSPIRE-NGBE.rdf`,
      outputformat: 'application/json',
    });
    this.locationID = locationId;
    M.proxy(this.useProxy);
    M.remote.get(this.requestPlace).then((res) => {
      const latLngString = JSON.parse(res.text).results[0].location;
      const resultTitle = JSON.parse(res.text).results[0].title;
      const latLngArray = latLngString.split(' ');
      const latitude = parseFloat(latLngArray[0]);
      const longitude = parseFloat(latLngArray[1]);
      this.map.removeLayers(this.clickedElementLayer);
      const newGeojson = {
        name: 'searchresult',
        source: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [
                longitude, latitude,
              ],
            },
            properties: {
              name: resultTitle,
            },
          }],
        },
      };
      this.clickedElementLayer = new M.layer.GeoJSON(newGeojson, { displayInLayerSwitcher: false });
      this.clickedElementLayer.displayInLayerSwitcher = false;
      this.clickedElementLayer.setStyle(this.point);

      // Change zIndex value
      this.clickedElementLayer.setZIndex(9999999999999999999);
      // Stops showing polygon geometry
      if (!this.resultVisibility) {
        this.clickedElementLayer.setStyle(this.simple);
      }
      this.map.addLayers(this.clickedElementLayer);
      if (zoomIn === true) {
        this.zoomInLocation('n', 'Point', this.zoom);
      }
    });
    M.proxy(this.statusProxy);
  }

  /**
   * This function zooms in MaxExtent of clicked element
   *
   * @public
   * @function
   * @param {string} service - { 'g' | 'n' }
   * @param {string} type - Type of geometry in which we zoom
   * @param {number} zoom - Zoom
   * @api
   */
  zoomInLocation(service, type, zoom) {
    if (this.html_) {
      this.resultsList = this.html_.querySelector('#m-ignsearchlocator-results-list');
    }
    if (this.clickedElementLayer instanceof M.layer.Vector) {
      if (service === 'n' && type === 'Point') {
        this.clickedElementLayer.calculateMaxExtent().then((extent) => {
          this.map.setBbox(extent);
          this.map.setZoom(zoom);
          this.fire('ignsearchlocator:entityFound', [extent]);
        });
      } else {
        const extent = this.clickedElementLayer.getImpl().getOL3Layer().getSource().getExtent();
        this.map.setBbox(extent);
        this.fire('ignsearchlocator:entityFound', [extent]);
      }
    }
  }

  /**
   * This function gets address of selected item and returns geojson data (with coordinates)
   * Only for Geocoder service
   *
   * @public
   * @function
   * @param {Node} selectedObject - Element from drop-down list("li")
   * @api
   */
  getFindData(selectedObject) {
    return new Promise((resolve) => {
      const id = `&id=${selectedObject.id}`;
      const type = `&type=${selectedObject.type}`;
      const portal = (selectedObject.portalNumber !== 0 &&
          selectedObject.portalNumber !== undefined) ?
        `&portal=${selectedObject.portalNumber}` : '';
      const extension = (selectedObject.extension !== 0 &&
          selectedObject.extension !== undefined) ?
        `&extension=${selectedObject.extension}` : '';
      const via = selectedObject.tip_via !== '' ? `&tip_via=${selectedObject.tip_via}` : '';
      let address = selectedObject.address;

      if (address.includes('(')) {
        const parenthesisIndex = address.indexOf('(');
        address = address.substring(0, parenthesisIndex);
      }
      address = window.encodeURIComponent(address);
      const params = `${type}${via}${id}${portal}${extension}`;
      const urlToGet = `${this.urlFind}?q=${address}${params}`;
      this.urlParse = urlToGet;
      this.requestStreet = urlToGet;
      this.locationID = '';
      M.proxy(this.useProxy);
      M.remote.get(urlToGet).then((res) => {
        if (res.code === 404 || res.code === 500) {
          M.dialog.error(getValue('exception.error_findjsonp'));
          resolve();
        } else {
          const geoJsonData = res.text.substring(9, res.text.length - 1);
          resolve(geoJsonData);
        }
      });
      M.proxy(this.statusProxy);
    });
  }

  /**
   * This function removes last search layer and adds new layer with current result (from geocoder)
   * features to map, zooms in result, edits popup information and shows a message saying
   *  if it's a perfect result or an approximation.
   *
   * @public
   * @function
   * @param {Object} geoJsonData - Clicked result object
   * @api
   */
  drawGeocoderResult(geoJsonData) {
    this.map.removeLayers(this.clickedElementLayer);
    const urlSinJSON = geoJsonData;
    const json = JSON.parse(urlSinJSON);
    const olFeature = this.getImpl().readFromWKT(json.geom, urlSinJSON);
    const mFeature = M.impl.Feature.olFeature2Facade(olFeature);
    const properties = JSON.parse(urlSinJSON);
    // Center coordinates
    this.coordinates = `${properties.lat}, ${properties.lng}`;
    // New layer with geometry
    this.clickedElementLayer = new M.layer.GeoJSON({
      name: 'searchresult',
      source: {
        type: 'FeatureCollection',
        features: [],
      },
    }, { displayInLayerSwitcher: false });

    this.clickedElementLayer.displayInLayerSwitcher = false;
    const type = mFeature.getGeometry().type;

    this.clickedElementLayer.on(M.evt.LOAD, () => {
      this.clickedElementLayer.addFeatures(mFeature);
      this.zoomInLocation('g', type, this.zoom);
    });
    this.map.addLayers(this.clickedElementLayer);
    if (type === 'Point') {
      this.clickedElementLayer.setStyle(this.point);
    }

    if (type.indexOf('Polygon') > -1 || type.indexOf('Collection') > -1) {
      this.clickedElementLayer.setStyle(new M.style.Polygon({
        fill: {
          color: '#3399CC',
          opacity: 0,
        },
        stroke: {
          color: '#3399CC',
          width: 2,
        },
      }));
    }

    // Change zIndex value
    this.clickedElementLayer.setZIndex(99999999999999999);
    // Stops showing polygon geometry
    if (!this.resultVisibility) {
      this.clickedElementLayer.setStyle(this.simple);
    }

    // // show popup for streets
    M.config.MOVE_MAP_EXTRACT = false;
    if (properties.type === 'callejero' || properties.type === 'portal') {
      const fullAddress = this.createFullAddress(properties);
      const coordinates = [properties.lat, properties.lng];
      const perfectResult = properties.state;
      this.showSearchPopUp(fullAddress, coordinates, perfectResult);
    } else if (this.popup !== undefined) {
      this.map.removePopup(this.popup);
    }
    M.config.MOVE_MAP_EXTRACT = true;
  }

  /**
   * This function inserts a popUp with information about the searched location
   * (and whether it 's an exact result or an approximation)
   *
   * @param {string} fullAddress - Location address(street, portal, etc.)
   * @param {Array} coordinates - Latitude[0] and longitude[1] coordinates
   * @param {boolean} exactResult - Indicating if the given result is a perfect match
   * @param {Object} e
   * @function
   * @public
   * @api
   */
  showSearchPopUp(fullAddress, coordinates, exactResult, e = {}) {
    const destinyProj = this.map.getProjection().code;
    const destinySource = 'EPSG:4326';
    const newCoordinates = this.getImpl()
      .reprojectReverse([coordinates[1], coordinates[0]], destinySource, destinyProj);
    let exitState;
    if (exactResult !== 1) {
      exitState = getValue('aprox');
    } else {
      exitState = getValue('exact');
    }
    this.showPopUp(fullAddress, newCoordinates, coordinates, exitState, e);
  }

  /**
   * This function inserts a popup on the map with information about its location.
   *
   * @param {string} fullAddress - Location address(street, portal, etc.)
   * @param {Array} mapCoordinates - Latitude[0] and longitude[1] coordinates on map projection
   * @param {Array} featureCoordinates - Latitude[0] and longitude[1] coordinates from feature
   * @param {string} exitState - Indicating if the given result is a perfect match
   * @param {Object} e - Object
   * @param {boolean} hasOffset - Indicating if it has offset
   * @public
   * @function
   * @api
   */
  showPopUp(
    fullAddress, mapcoords, featureCoordinates, exitState = null, e = {},
    hasOffset = true,
  ) {
    const featureTabOpts = { content: '', title: '' };
    if (exitState !== null) {
      featureTabOpts.content += `<div><b>${exitState}</b></div>`;
    }

    featureTabOpts.content += `<div><b>${fullAddress !== undefined ? fullAddress : '-'}</b></div><br/>
                <div class='ignsearchlocator-popup'><b>Lon: </b>${featureCoordinates[1].toFixed(6)} </div>
                <div class='ignsearchlocator-popup'><b>Lat: </b>${featureCoordinates[0].toFixed(6)}</div>`;


    const myPopUp = new M.Popup({ panMapIfOutOfView: !e.fake });
    myPopUp.addTab(featureTabOpts);
    this.map.addPopup(myPopUp, [
      mapcoords[0],
      mapcoords[1],
    ]);
    this.popup = myPopUp;

    if (hasOffset && this.pointStyle === 'pinAzul') {
      this.popup.getImpl().setOffset([0, -30]);
    } else if (hasOffset && this.pointStyle === 'pinRojo') {
      this.popup.getImpl().setOffset([2, -30]);
    } else if (hasOffset && this.pointStyle === 'pinMorado') {
      this.popup.getImpl().setOffset([1, -20]);
    }
    this.lat = mapcoords[1];
    this.lng = mapcoords[0];
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api
   */
  equals(control) {
    return control instanceof IGNSearchLocatorControl;
  }

  /**
   * This function clears input values
   *
   * @public
   * @function
   * @api
   */
  clearResults() {
    this.searchInput.value = '';
    this.resultsBox.innerHTML = '';
    this.searchValue = '';
    if (this.reverse) {
      this.reverseActivated = false;
      this.html_.querySelector('#m-ignsearchlocator-locate-button').style.color = '#7A7A73';
      document.removeEventListener('keyup', this.checkEscKey);
      document.getElementsByTagName('body')[0].style.cursor = 'auto';
    }
    this.map.removeLayers(this.clickedElementLayer);
    this.map.removePopup(this.map.getPopup());
  }

  /**
   * This function destroys this control
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    document.getElementsByTagName('body')[0].style.cursor = 'auto';
    document.removeEventListener('keyup', this.checkEscKey);
    this.map.removeLayers(this.clickedElementLayer);
    this.map.removePopup(this.map.getPopup());
  }
}
