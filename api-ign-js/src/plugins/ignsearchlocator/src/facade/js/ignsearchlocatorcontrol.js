/**
 * @module M/control/IGNSearchLocatorControl
 */
import IGNSearchLocatorImplControl from '../../impl/ol/js/ignsearchlocatorcontrol';
import template from '../../templates/ignsearchlocator';
import results from '../../templates/results';
import xylocator from '../../templates/xylocator';
import registerHelpers from './helpers';
import geographicNameType from './constants';
import { getValue } from './i18n/language';

let typingTimer;
/**
 * @classdesc
 * This class creates an input for searching locations on a map.
 * It uses Instituto Geográfico Nacional services Geocoder and Nomenclator
 * to search user's input location and return coordinates on click.
 */
export default class IGNSearchLocatorControl extends M.Control {
  /*
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(
    servicesToSearch = 'gn',
    maxResults = 10,
    noProcess = 'municipio,poblacion',
    countryCode = 'es',
    urlCandidates,
    urlFind,
    urlReverse,
    urlPrefix,
    urlAssistant,
    urlDispatcher,
    resultVisibility = true,
    reverse,
    locationID,
    requestStreet,
    geocoderCoords,
    nomenclatorSearchType = geographicNameType,
  ) {
    if (M.utils.isUndefined(IGNSearchLocatorImplControl)) {
      M.exception('La implementación usada no puede crear controles IGNSearchLocatorControl');
    }
    const impl = new IGNSearchLocatorImplControl();
    super(impl, 'IGNSearchLocator');
    // Class properties
    /**
     * This variable indicates which services should be searched
     * (geocoder, nomenclator or both)
     * @private
     * @type {string} - 'g' | 'n' | 'gn'
     */
    this.servicesToSearch = servicesToSearch;
    /**
     * This variable sets the maximun results returned by a service
     * (if both services are searched the maximum results will be twice this number)
     * @private
     * @type {number}
     */
    this.maxResults = maxResults;
    /**
     * This variables indicates which entities shouldn't be searched
     * @private
     * @type {string} - 'municipio' | 'poblacion' | 'toponimo' | 'municipio,poblacion' | etc
     */
    this.noProcess = noProcess;
    /**
     * This variable indicates the country code.
     * @private
     * @type {string} - 'es'
     */
    this.countryCode = countryCode;
    /**
     * This variable indicates Geocoder Candidates service url
     * @private
     * @type {string}
     */
    this.urlCandidates = urlCandidates;
    /**
     * This variable indicates Geocoder Find service url
     * @private
     * @type {string}
     */
    this.urlFind = urlFind;
    /**
     * This variable indicates Geocoder Reverse service url
     * @private
     * @type {string}
     */
    this.urlReverse = urlReverse;
    /**
     * This variable indicates Nomenclator url prefix
     * @private
     * @type {string}
     */
    this.urlPrefix = urlPrefix;
    /**
     * This variable indicates Nomenclator SearchAssistant service url
     * @private
     * @type {string}
     */
    this.urlAssistant = urlAssistant;
    /**
     * This variable indicates Nomenclator Dispatcher service url
     * @private
     * @type {string}
     */
    this.urlDispatcher = urlDispatcher;
    /**
     * This variable indicates whether result geometry should be drawn on map.
     * @private
     * @type {boolean}
     */
    this.resultVisibility_ = resultVisibility;
    /**
     * This variable indicates which entity types should be searched on Nomenclator service.
     * @private
     * @type {Array<string>}
     */
    this.nomenclatorSearchType = nomenclatorSearchType;
    /**
     * This variable indicates whether reverse geocoder button should be available.
     * @private
     * @type {Boolean}
     */
    this.reverse = reverse;
    /**
     * This variable indicates whether reverse geocoder button is activated.
     * @private
     * @type {Boolean}
     */
    this.reverseActivated = false;
    /**
     * Text to search
     * @private
     * @type {string}
     */
    this.locationID = locationID;
    /**
     * Text to search
     * @private
     * @type {string}
     */
    this.requestStreet = requestStreet;
    /**
     * Reverse geocoder coordinates
     * @private
     * @type {string}
     */
    this.geocoderCoords = geocoderCoords;
    registerHelpers();
  }
  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api
   */
  createView(map) {
    this.map = map;
    return new Promise((success) => {
      const html = M.template.compileSync(template);
      this.html = html;
      this.resultsBox = html.querySelector('#m-ignsearchlocator-results');
      this.searchInput = this.html.querySelector('#m-ignsearchlocator-search-input');
      html.querySelector('#m-ignsearchlocator-clear-button').addEventListener('click', this.clearResultsAndGeometry.bind(this));
      html.querySelector('#m-ignsearchlocator-xylocator-button').addEventListener('click', this.openXYLocator.bind(this));
      html.querySelector('#m-ignsearchlocator-search-input').addEventListener('keyup', e => this.createTimeout(e));
      html.querySelector('#m-ignsearchlocator-search-input').addEventListener('keydown', () => {
        clearTimeout(typingTimer);
      });
      html.querySelector('#m-ignsearchlocator-search-input').addEventListener('keydown', () => {
        clearTimeout(typingTimer);
      });
      html.querySelector('#m-ignsearchlocator-locate-button').addEventListener('click', this.activateDeactivateReverse.bind(this));
      document.querySelector('.ign-search-panel>.m-panel-btn').addEventListener('click', this.clearResults.bind(this));
      this.clickReverseEvent = this.map.on(M.evt.CLICK, e => this.showReversePopUp(e));
      this.changePlaceholder();
      if (!this.reverse) {
        html.querySelector('#m-ignsearchlocator-locate-button').style.display = 'none';
      }
      this.on(M.evt.ADDED_TO_MAP, () => {
        if (this.locationID && this.locationID.length > 0) {
          this.point = new M.style.Point({
            radius: 5,
            icon: {
              form: 'none',
              class: 'g-cartografia-pin',
              radius: 12,
              rotation: 0,
              rotate: false,
              offset: [0, -12],
              color: '#f00',
              opacity: 1,
            },
          });
          this.simple = new M.style.Polygon({
            fill: {
              color: 'black',
              opacity: 0,
            },
          });
          this.drawNomenclatorResult(this.locationID, false);
        }
        if (this.requestStreet && this.requestStreet.length > 0) {
          M.proxy(false);
          M.remote.get(this.requestStreet).then((res) => {
            const geoJsonData = res.text.substring(9, res.text.length - 1);
            this.map.removeLayers(this.clickedElementLayer);
            const featureJSON = JSON.parse(geoJsonData);
            featureJSON.geometry.coordinates = this.fixCoordinatesPath(featureJSON);
            // Center coordinates
            this.coordinates = `${featureJSON.properties.lat}, ${featureJSON.properties.lng}`;
            // New layer with geometry
            this.clickedElementLayer = new M.layer.GeoJSON({
              name: 'Resultado búsquedas',
              source: {
                type: 'FeatureCollection',
                features: [featureJSON],
              },
            });
            this.clickedElementLayer.displayInLayerSwitcher = false;

            if (featureJSON.geometry.type === 'Point') {
              this.clickedElementLayer.setStyle(this.point);
            }

            // Stops showing polygon geometry
            if (!this.resultVisibility_) {
              this.clickedElementLayer.setStyle(this.simple);
            }
            this.map.addLayers(this.clickedElementLayer);
            // show popup for streets
            if (featureJSON.properties.type === 'callejero' || featureJSON.properties.type === 'portal') {
              const fullAddress = this.createFullAddress(featureJSON.properties);

              const coordinates = [featureJSON.properties.lat, featureJSON.properties.lng];
              const perfectResult = featureJSON.properties.state;
              this.showSearchPopUp(fullAddress, coordinates, perfectResult, { fake: true });
            }
            M.proxy(true);
          });
        }
        if (this.geocoderCoords && this.geocoderCoords.length === 2) {
          this.activateDeactivateReverse();
          const reprojCoords = this.getImpl().reproject(this.geocoderCoords, 'EPSG:4326', map.getProjection().code);
          this.showReversePopUp({
            coord: reprojCoords,
            fake: true,
          });
        }
      });
      success(html);
    });
  }
  /**
   * This function toggles reverse geocoder button activation.
   *
   * @public
   * @function
   * @api
   *
   */
  activateDeactivateReverse() {
    if (!this.reverseActivated) {
      this.reverseActivated = true;
      document.querySelector('#m-ignsearchlocator-locate-button span').style.color = '#71a7d3';
    } else {
      this.reverseActivated = false;
      document.querySelector('#m-ignsearchlocator-locate-button span').style.color = '#7A7A73';
    }
  }
  /**
   * This function shows information tooltip on clicked point.
   * @param {Event} e - Event
   */
  showReversePopUp(e) {
    if (this.reverseActivated) {
      const origin = this.map.getProjection().code;
      const destiny = 'EPSG:4258';
      const etrs89pointCoordinates = this.getImpl()
        .reproject([e.coord[0], e.coord[1]], origin, destiny);
      const params = `lon=${etrs89pointCoordinates[0]}&lat=${etrs89pointCoordinates[1]}`;
      const urlToGet = `${this.urlReverse}?${params}`;
      const mapCoordinates = e.coord;
      this.geocoderCoords = etrs89pointCoordinates;
      const dataCoordinates = [etrs89pointCoordinates[1], etrs89pointCoordinates[0]];
      let fullAddress = '';
      M.remote.get(urlToGet).then((res) => {
        if (res.text !== null) {
          const returnData = JSON.parse(res.text);
          fullAddress = this.createFullAddress(returnData);
        } else {
          fullAddress = 'No existe dirección asociada para esta ubicación.';
        }
        this.showPopUp(fullAddress, mapCoordinates, dataCoordinates, null, true, e);
      });
    }
  }

  /**
   * This function sets a timeout between keypress and search.
   * @public
   * @function
   * @param {e} event that triggers the method
   * @api
   */
  createTimeout(e) {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => this.searchInputValue(e), 500);
  }
  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api
   */
  getActivationButton(html) {
    return html.querySelector('.m-ignsearchlocator button');
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
   * This function
   * 1.- Takes user's input
   * 2.- Searches for ocurrences on IGN sources
   * 3.- Returns results as items in a drop-down list (returns address)
   * 4.- Onclick on an item goes to its coordinates
   * @public
   * @function
   * @param {event} e - event that triggers this method
   * @api
   */
  searchInputValue(e, firstResult = false) {
    // const { value } = e.target;
    const value = e.target.value.replace(',', ' ');
    this.searchValue = value;
    if (value.length <= 2) {
      this.resultsBox.innerHTML = '';
    } else {
      this.resultsBox.innerHTML = '';
      // Adds animation class during loading
      this.resultsBox.classList.add('g-cartografia-spinner');
      this.resultsBox.style.fontSize = '24px';
      this.allCandidates = [];
      // saves on allCandidates search results from Nomenclator (CommunicationPoolservlet)
      this.getNomenclatorData(value, this.allCandidates).then(() => {
        // saves on allCandidates search results from CartoCiudad (geocoder)
        this.getCandidatesData(value, this.allCandidates).then(() => {
          // Clears previous search
          this.resultsBox.innerHTML = '';
          const compiledResult = M.template.compileSync(results, {
            vars: {
              places: this.allCandidates,
            },
          });
          const elementList = compiledResult.querySelectorAll('li');
          elementList.forEach((listElement) => {
            listElement.addEventListener('click', () => {
              this.goToLocation(listElement);
            });
          });
          if (firstResult === true && elementList.length > 0) {
            elementList.item(0).click();
          }
          // remove animation class and return to normal font size after loading
          this.resultsBox.classList.remove('g-cartografia-spinner');
          this.resultsBox.style.fontSize = '1em';
          this.resultsBox.appendChild(compiledResult);
          // Service doesn't find results
          if (this.allCandidates.length === 0) {
            const infoMsg = document.createTextNode('No se encuentran resultados para esta petición.');
            this.resultsBox.appendChild(infoMsg);
          }
        });
      });
    }
  }
  /**
   * This function removes last search layer and adds new layer with current result (from geocoder)
   * features to map, zooms in result, edits popup information and shows a message saying
   *  if it's a perfect result or an approximation.
   * @public
   * @function
   * @param {Object} geoJsonData - clicked result object
   * @api
   */
  drawGeocoderResult(geoJsonData) {
    this.map.removeLayers(this.clickedElementLayer);
    const featureJSON = JSON.parse(geoJsonData);
    featureJSON.geometry.coordinates = this.fixCoordinatesPath(featureJSON);
    // Center coordinates
    this.coordinates = `${featureJSON.properties.lat}, ${featureJSON.properties.lng}`;
    // New layer with geometry
    this.clickedElementLayer = new M.layer.GeoJSON({
      name: 'Resultado búsquedas',
      source: {
        type: 'FeatureCollection',
        features: [featureJSON],
      },
    });
    this.clickedElementLayer.displayInLayerSwitcher = false;

    if (featureJSON.geometry.type === 'Point') {
      this.clickedElementLayer.setStyle(this.point);
    }

    // Stops showing polygon geometry
    if (!this.resultVisibility_) {
      this.clickedElementLayer.setStyle(this.simple);
    }
    this.map.addLayers(this.clickedElementLayer);
    this.zoomInLocation('g', featureJSON.geometry.type);
    // show popup for streets
    if (featureJSON.properties.type === 'callejero' || featureJSON.properties.type === 'portal') {
      const fullAddress = this.createFullAddress(featureJSON.properties);

      const coordinates = [featureJSON.properties.lat, featureJSON.properties.lng];
      const perfectResult = featureJSON.properties.state;
      this.showSearchPopUp(fullAddress, coordinates, perfectResult);
    }
  }
  /**
   * This function takes data from an entity and returns the complete address
   * @param {string} jsonResult - json string with entity data
   */
  createFullAddress(jsonResult) {
    const via = (jsonResult.tip_via === null ||
      jsonResult.tip_via === undefined) ? '' : jsonResult.tip_via;
    const address = (jsonResult.address === null ||
      jsonResult.address === undefined) ? '' : jsonResult.address;
    const portal = (jsonResult.portalNumber === null ||
      jsonResult.portalNumber === undefined ||
      jsonResult.portalNumber === 0) ? '' : jsonResult.portalNumber;
    return `${via} ${address} ${portal}`;
  }
  /**
   * This function removes last search layer and adds new layer
   * with current result (from nomenclator) features to map and zooms in result.
   * @public
   * @function
   * @param {string} locationId - id of the location object
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
    M.remote.get(this.requestPlace).then((res) => {
      const latLngString = JSON.parse(res.text).results[0].location;
      const resultTitle = JSON.parse(res.text).results[0].title;
      const latLngArray = latLngString.split(' ');
      const latitude = parseFloat(latLngArray[0]);
      const longitude = parseFloat(latLngArray[1]);
      this.map.removeLayers(this.clickedElementLayer);
      const newGeojson = {
        name: 'Resultado búsquedas',
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
      this.clickedElementLayer = new M.layer.GeoJSON(newGeojson);
      this.clickedElementLayer.displayInLayerSwitcher = false;
      this.clickedElementLayer.setStyle(this.point);
      // Stops showing polygon geometry
      if (!this.resultVisibility_) {
        this.clickedElementLayer.setStyle(this.simple);
      }
      this.map.addLayers(this.clickedElementLayer);
      if (zoomIn === true) {
        this.zoomInLocation('n', 'Point');
      }
    });
  }
  /**
   * This function gets user input, searches for coincidences and adds each one to the given array.
   * @public
   * @function
   * @param {string} inputValue search text written by user
   * @param { Array < Object > } resultsArray search result candidates from IGN services
   * @api
   */
  getCandidatesData(inputValue, resultsArray) {
    const newInputVal = window.encodeURIComponent(inputValue);
    return new Promise((resolve) => {
      if (this.servicesToSearch !== 'n') {
        let params = `q=${newInputVal}&limit=${this.maxResults}&no_process=${this.noProcess}`;
        params += `&countrycode=${this.countryCode}&autocancel='true'`;
        const urlToGet = `${this.urlCandidates}?${params}`;
        M.remote.get(urlToGet).then((res) => {
          const returnData = JSON.parse(res.text.substring(9, res.text.length - 1));
          for (let i = 0; i < returnData.length; i += 1) {
            resultsArray.push(returnData[i]);
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  /**
   * This function adds search coincidences on Nomenclator to array
   * @public
   * @function
   * @param {string} inputValue location searched by user
   * @param {Array <Object>} resultsArray search results
   * @api
   */
  getNomenclatorData(inputValue, resultsArray) {
    const newInputVal = window.encodeURIComponent(inputValue);
    return new Promise((resolve) => {
      if (this.servicesToSearch !== 'g') {
        const params = `maxresults=${this.maxResults}&name_equals=${newInputVal}`;
        const urlToGet = `${this.urlAssistant}?${params}`;
        M.remote.get(urlToGet).then((res) => {
          const temporalData = res.text !== '' ? JSON.parse(res.text) : { results: [] };
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
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  /**
   * This function gets address of selected item and returns geojson data (with coordinates)
   * Only for Geocoder service
   * @public
   * @function
   * @param {string} listElement element from drop-down list("li")
   * @param {Array <Object> } elementsData search results
   * @api
   */
  getFindData(listElement, elementsData) {
    return new Promise((resolve) => {
      let id;
      let type;
      let portal;
      let via;
      let address;
      elementsData.forEach((element) => {
        if (listElement.getAttribute('id') === element.id) {
          id = `&id=${element.id}`;
          type = `&type=${element.type}`;
          portal = (element.portalNumber !== 0 && element.portalNumber !== undefined) ?
            `&portal=${element.portalNumber}` : '';
          via = element.tip_via !== '' ? `&tip_via=${element.tip_via}` : '';
        }
      });
      address = listElement.innerHTML;
      if (listElement.innerHTML.includes('(')) {
        const parenthesisIndex = listElement.innerHTML.indexOf('(');
        address = listElement.innerHTML.substring(0, parenthesisIndex);
      }
      const params = `${type}${via}${id}${portal}&outputformat=geojson`;
      const urlToGet = `${this.urlFind}?q=${address}${params}`;
      this.requestStreet = urlToGet;
      this.locationID = '';
      M.proxy(false);
      M.remote.get(urlToGet).then((res) => {
        const geoJsonData = res.text.substring(9, res.text.length - 1);
        resolve(geoJsonData);
      });
      M.proxy(true);
    });
  }
  /**
   * This function zooms in clicked location and draws geometry
   * @public
   * @function
   * @param {Object} listElement clicked result information
   * @api
   */
  goToLocation(listElement) {
    this.currentElement = listElement; // <li>
    const selectedObject = this.findClickedItem(listElement, this.allCandidates); // json
    this.createGeometryStyles();
    // if item comes from geocoder
    if (Object.prototype.hasOwnProperty.call(selectedObject, 'address')) {
      this.getFindData(listElement, this.allCandidates).then((geoJsonData) => {
        this.drawGeocoderResult(geoJsonData);
      });
    } else { // if item comes from nomenclator
      this.drawNomenclatorResult(selectedObject.id);
    }
    this.resultsBox.innerHTML = '';
  }
  /**
   * This function zooms in MaxExtent of clicked element
   * @public
   * @function
   * @param {string} service { 'g' | 'n' }
   * @param { string } type of geometry in which we zoom
   * @api
   */
  zoomInLocation(service, type) {
    this.resultsList = document.getElementById('m-ignsearchlocator-results-list');
    if (this.clickedElementLayer instanceof M.layer.Vector) {
      this.clickedElementLayer.calculateMaxExtent().then((extent) => {
        this.map.setBbox(extent);
        if (service === 'n' || type === 'Point' || type === 'LineString' || type === 'MultiLineString') {
          this.setScale(17061);
        }

        this.fire('ignsearchlocator:entityFound', [extent]);
      });
    }
  }
  /**
   * This function returns clicked location object
   * @public
   * @function
   * @param { string } listElement <li>Location</li>
   * @param { Array < Object > } allCandidates possible locations
   * @api
   */
  findClickedItem(listElement, allCandidates) {
    return allCandidates.filter(element => element.id === listElement.getAttribute('id'))[0];
  }
  /**
   * This function fixes path to get to this feature's coordinates
   * @public
   * @function
   * @param {feature} feature with geometry information for the given location
   * @api
   */
  fixCoordinatesPath(feature) {
    let coordinates;
    if (feature.geometry.type === 'Point') {
      coordinates = feature.geometry.coordinates[0][0];
    } else if (feature.geometry.type === 'MultiPolygon') {
      coordinates = [feature.geometry.coordinates];
    } else if (feature.geometry.type === 'LineString') {
      coordinates = feature.geometry.coordinates[0];
    } else {
      coordinates = feature.geometry.coordinates;
    }
    return coordinates;
  }
  /* Given a set of coordinates (lat, long),
    searches for the corresponding place
  */
  searchCoordinates(setOfCoordinates) {
    return new Promise((resolve) => {
      resolve();
    });
  }
  /**
   * This function clears drawn geometry from map.
   * @public
   * @function
   * @api
   */
  clearResults() {
    this.searchInput.value = '';
    this.resultsBox.innerHTML = '';
    this.searchValue = '';
    this.map.removeLayers(this.coordinatesLayer);
    if (document.querySelector('.m-xylocator-container') !== null) {
      document.querySelector('.m-xylocator-container input#UTM-X').value = '';
      document.querySelector('.m-xylocator-container input#UTM-Y').value = '';
      document.querySelector('.m-xylocator-container input#LON').value = '';
      document.querySelector('.m-xylocator-container input#LAT').value = '';
      document.querySelector('.m-xylocator-container input#LONHH').value = 0;
      document.querySelector('.m-xylocator-container input#LONMM').value = 0;
      document.querySelector('.m-xylocator-container input#LONSS').value = 0;
      document.querySelector('.m-xylocator-container input#LATHH').value = 0;
      document.querySelector('.m-xylocator-container input#LATMM').value = 0;
      document.querySelector('.m-xylocator-container input#LATSS').value = 0;
    }
  }
  /**
   * This function clears input content, results box, popup and shown geometry.
   * @public
   * @function
   * @api
   */
  clearResultsAndGeometry() {
    this.clearResults();
    if (this.clickedElementLayer !== undefined) {
      this.clickedElementLayer.setStyle(this.simple);
    }
    this.map.removePopup(this.popup, [
      this.lng,
      this.lat,
    ]);
  }

  /**
   * This function opens xylocator functions
   * @public
   * @function
   * @api
   */
  openXYLocator() {
    if (this.resultsBox.innerHTML.indexOf('coordinatesSystem') > -1) {
      this.clearResults();
    } else {
      this.clearResults();
      const compiledXYLocator = M.template.compileSync(xylocator, {
        vars: {
          translations: {
            title: getValue('title'),
            srs: getValue('srs'),
            longitude: getValue('longitude'),
            latitude: getValue('latitude'),
            locate: getValue('locate'),
            east: getValue('east'),
            west: getValue('west'),
            north: getValue('north'),
            south: getValue('south'),
            geographic: getValue('geographic'),
            zone: getValue('zone'),
            dms: getValue('dms'),
            dd: getValue('dd'),
          },
        },
      });
      compiledXYLocator.querySelector('select#m-xylocator-srs').addEventListener('change', evt => this.manageInputs_(evt));
      compiledXYLocator.querySelector('button#m-xylocator-loc').addEventListener('click', evt => this.calculate_(evt));
      this.resultsBox.appendChild(compiledXYLocator);
    }
  }

  /**
   * This function transforms coordinates to map SRS
   *
   * @public
   * @function
   * @param {DOMEvent} evt - event
   * @api
   */
  calculate_(evt) {
    try {
      const selectTarget = document.querySelector('.m-xylocator-container select#m-xylocator-srs');
      const selectedOption = selectTarget.options[selectTarget.selectedIndex];
      const origin = selectedOption.value;

      let x = -1;
      let y = -1;
      if (selectedOption.getAttribute('data-units') === 'd') {
        try {
          const xString = document.querySelector('div#m-xylocator-latlon input#LON').value;
          const yString = document.querySelector('div#m-xylocator-latlon input#LAT').value;
          x = parseFloat(xString);
          y = parseFloat(yString);
        } catch (ex) {
          M.dialog.error(getValue('exception.transforming'), 'Error');
        }
      } else if (selectedOption.getAttribute('data-units') === 'dms') {
        const hhLon = document.querySelector('div#m-xylocator-dms input#LONHH').value;
        const mmLon = document.querySelector('div#m-xylocator-dms input#LONMM').value;
        const ssLon = document.querySelector('div#m-xylocator-dms input#LONSS').value;
        const dirLon = document.querySelector('div#m-xylocator-dms input[name="LONDIR"]:checked').value;
        const hhLat = document.querySelector('div#m-xylocator-dms input#LATHH').value;
        const mmLat = document.querySelector('div#m-xylocator-dms input#LATMM').value;
        const ssLat = document.querySelector('div#m-xylocator-dms input#LATSS').value;
        const dirLat = document.querySelector('div#m-xylocator-dms input[name="LATDIR"]:checked').value;
        try {
          x = parseFloat(hhLon) + (parseFloat(mmLon) / 60) + (parseFloat(ssLon) / 3600);
          y = parseFloat(hhLat) + (parseFloat(mmLat) / 60) + (parseFloat(ssLat) / 3600);
          if (dirLon !== 'east' && x !== 0) {
            x = -x;
          }

          if (dirLat !== 'north' && y !== 0) {
            y = -y;
          }
        } catch (ex) {
          M.dialog.error(getValue('exception.transforming'), 'Error');
        }
      } else {
        try {
          const xString = document.querySelector('div#m-xylocator-utm input#UTM-X').value;
          const yString = document.querySelector('div#m-xylocator-utm input#UTM-Y').value;
          x = parseFloat(xString);
          y = parseFloat(yString);
        } catch (ex) {
          M.dialog.error(getValue('exception.transforming'), 'Error');
        }
      }

      const coordinatesTransform = this.getImpl().reprojectXY(origin, [x, y]);
      this.locator_(coordinatesTransform);
    } catch (ex) {
      M.dialog.error(getValue('exception.wrong_coords'), 'Error');
      throw ex;
    }
  }

  /**
   * This function changes input label depending on SRS
   *
   * @private
   * @function
   * @param {DOMEvent} evt - event
   */
  manageInputs_(evt) {
    const selectTarget = evt.target;
    const selectedOption = selectTarget.options[selectTarget.selectedIndex];
    if (selectedOption.getAttribute('data-units') === 'd') {
      const divToHidden1 = document.querySelector('div#m-xylocator-utm');
      divToHidden1.style.display = 'none';
      const divToHidden2 = document.querySelector('div#m-xylocator-dms');
      divToHidden2.style.display = 'none';
      const divToShow = document.querySelector('div#m-xylocator-latlon');
      divToShow.style.display = 'block';
    } else if (selectedOption.getAttribute('data-units') === 'dms') {
      const divToHidden1 = document.querySelector('div#m-xylocator-utm');
      divToHidden1.style.display = 'none';
      const divToHidden2 = document.querySelector('div#m-xylocator-latlon');
      divToHidden2.style.display = 'none';
      const divToShow = document.querySelector('div#m-xylocator-dms');
      divToShow.style.display = 'block';
    } else {
      const divToHidden1 = document.querySelector('div#m-xylocator-latlon');
      divToHidden1.style.display = 'none';
      const divToHidden2 = document.querySelector('div#m-xylocator-dms');
      divToHidden2.style.display = 'none';
      const divToShow = document.querySelector('div#m-xylocator-utm');
      divToShow.style.display = 'block';
    }
  }

  /**
   * This function centers the map on given point
   *
   * @public
   * @function
   * @param coords - coordinates writen by user
   * @api
   */
  locator_(coords) {
    const x = coords[0];
    const y = coords[1];
    const xFloat = parseFloat(x);
    const yFloat = parseFloat(y);
    this.map.removeLayers(this.coordinatesLayer);
    if (!Number.isNaN(xFloat) && !Number.isNaN(yFloat)) {
      this.map.setCenter(`${xFloat},${yFloat}*false`);
      this.map.setZoom(14);
      this.fire('xylocator:locationCentered', [{
        zoom: 14,
        center: [xFloat, yFloat],
      }]);

      this.coordinatesLayer = new M.layer.Vector({
        name: getValue('search_result'),
      }, { displayInLayerSwitcher: false });

      const feature = new M.Feature('localizacion', {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [xFloat, yFloat],
        },
      });

      this.coordinatesLayer.addFeatures([feature]);
      this.coordinatesLayer.setStyle(new M.style.Point({
        radius: 8,
        fill: {
          color: '#f00',
          opacity: 0.5,
        },
        stroke: {
          color: '#f00',
          opacity: 1,
          width: 3,
        },
      }));

      this.map.addLayers(this.coordinatesLayer);
    } else {
      M.dialog.error(getValue('exception.wrong_coords'), 'Error');
    }
  }

  /**
   * This function sets geometry visibility on map (visible|invisible).
   * @public
   * @function
   * @param {boolean} flag
   * @api
   */
  setResultVisibility(flag) {
    this.resultVisibility_ = flag;
  }
  /**
   * This function changes input placeholder based on services choice
   * @public
   * @function
   * @api
   */
  changePlaceholder() {
    if (this.servicesToSearch === 'g') {
      this.searchInput.placeholder = 'Dirección o Ref. catastral (14 díg.) ';
    } else if (this.servicesToSearch === 'n') {
      this.searchInput.placeholder = 'Topónimo';
    }
  }
  /**
   * This function creates some geometry styles.
   * @public
   * @function
   * @api
   */
  createGeometryStyles() {
    // Shows pin on drawn point
    this.point = new M.style.Point({
      radius: 5,
      icon: {
        form: 'none',
        class: 'g-cartografia-pin',
        radius: 12,
        rotation: 0,
        rotate: false,
        offset: [0, -12],
        color: '#f00',
        opacity: 1,
      },
    });
    // Style for hiding geometry
    this.simple = new M.style.Polygon({
      fill: {
        color: 'black',
        opacity: 0,
      },
    });
  }
  /**
    * This
    function inserts a popUp with information about the searched location
      (and whether it 's an exact result or an approximation)
    * @param { string } fullAddress location address(street, portal, etc.)
    * @param { Array } coordinates latitude[0] and longitude[1] coordinates
    * @param { boolean } exactResult indicating
    if the given result is a perfect match
    */
  showSearchPopUp(fullAddress, coordinates, exactResult, e = {}) {
    const destinyProj = this.map.getProjection().code;
    const destinySource = 'EPSG:4326';
    const newCoordinates = this.getImpl()
      .reproject([coordinates[1], coordinates[0]], destinySource, destinyProj);
    let exitState;
    if (exactResult !== 1) {
      exitState = 'Dirección aproximada';
    } else {
      exitState = 'Dirección exacta';
    }
    this.showPopUp(fullAddress, newCoordinates, coordinates, exitState, false, e);
  }
  /**
   * This function inserts a popup on the map with information about its location.
   * @param { string } fullAddress location address(street, portal, etc.)
   * @param { Array } mapCoordinates latitude[0] and longitude[1] coordinates on map projection
   * @param { Array } featureCoordinates latitude[0] and longitude[1] coordinates from feature
   * @param { string } exitState indicating if the given result is a perfect match
   */
  showPopUp(fullAddress, mapcoords, featureCoordinates, exitState = null, addTab = true, e = {}) {
    const featureTabOpts = { content: '', icon: 'icon-localizacion3' };
    if (exitState !== null) {
      featureTabOpts.content += `<div><b>${exitState}</b></div>`;
    }
    featureTabOpts.content += `<div>${fullAddress}</div>
                <div class='ignsearchlocator-popup'>Lat: ${featureCoordinates[0]}</div>
                <div class='ignsearchlocator-popup'> Long: ${featureCoordinates[1]} </div>`;
    if (this.map.getPopup() instanceof M.Popup && addTab === true) {
      this.popup = this.map.getPopup();
      this.popup.addTab(featureTabOpts);
    } else {
      const myPopUp = new M.Popup({ panMapIfOutOfView: !e.fake });
      myPopUp.addTab(featureTabOpts);

      this.map.addPopup(myPopUp, [
        mapcoords[0],
        mapcoords[1],
      ]);
      this.popup = myPopUp;
    }
    this.lat = mapcoords[1];
    this.lng = mapcoords[0];
  }
  /**
   * This function sets given scale to map
   * @public
   * @function
   * @param { number } scale to which the map will zoom in
   *   (5000 if we want 1: 5000)
   * @api
   */
  setScale(scale) {
    this.getImpl().setScale(scale);
  }
}
