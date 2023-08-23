/**
 * @module M/control/GeorefimageControl
 */
import GeorefimageControlImpl from '../../impl/ol/js/georefimagecontrol';
import georefimageHTML from '../../templates/georefimage';
import { getValue } from './i18n/language';

import {
  innerQueueElement,
  removeLoadQueueElement,
  getQueueContainer,
  createWLD,
  createZipFile,
  LIST_SERVICES,
  generateTitle,
  getBase64Image,
  getBase64ImageClient,
} from './utils';

export default class GeorefimageControl extends M.Control {
  /**
    * @classdesc
    * Main constructor of the class.
    *
    * @constructor
    * @extends {M.Control}
    * @api stable
    */
  constructor({
    serverUrl, printTemplateUrl, printStatusUrl, printSelector, printType,
  }, map) {
    const impl = new GeorefimageControlImpl();
    super(impl, GeorefimageControl.NAME);
    this.map_ = map;
    if (M.utils.isUndefined(GeorefimageControlImpl)) {
      M.exception('La implementación usada no puede crear controles Georefimage');
    }

    if (M.utils.isUndefined(GeorefimageControlImpl.prototype.encodeLayer)) {
      M.exception('La implementación usada no posee el método encodeLayer');
    }

    /**
      * Mapfish server url
      * @private
      * @type {String}
      */
    this.serverUrl_ = serverUrl || 'https://componentes.cnig.es/geoprint';

    /**
      * Mapfish template url
      * @private
      * @type {String}
      */
    this.printTemplateUrl_ = printTemplateUrl || 'https://componentes.cnig.es/geoprint/print/mapexport';

    /**
      * Url for getting priting status
      * @private
      * @type {String}
      */
    this.printStatusUrl_ = printStatusUrl || 'https://componentes.cnig.es/geoprint/print/status';

    this.printSelector = !!printSelector;

    this.printType = printType === 'client' ? 'client' : 'server';

    /**
      * Map title
      * @private
      * @type {HTMLElement}
      */
    this.elementTitle_ = null;

    /**
      * Map description
      * @private
      * @type {HTMLElement}
      */
    this.areaDescription_ = null;

    /**
      * Layout
      * @private
      * @type {HTMLElement}
      */
    this.layout_ = null;

    /**
      * Map format to print
      * @private
      * @type {HTMLElement}
      */
    this.format_ = null;

    /**
      * Map projection to print
      * @private
      * @type {HTMLElement}
      */
    this.projection_ = null;

    /**
      * Map dpi to print
      * @private
      * @type {HTMLElement}
      */
    this.dpi_ = null;

    /**
      * Force scale boolean
      * @private
      * @type {HTMLElement}
      */
    this.forceScale_ = null;

    /**
      * Mapfish params
      * @private
      * @type {String}
      */
    this.params_ = {
      layout: {
        outputFilename: 'mapa_${yyyy-MM-dd_hhmmss}',
      },
      pages: {
        clientLogo: '', // logo url
        creditos: getValue('printInfo'),
      },
      parameters: {},
    };

    /**
      * Facade of the map
      * @private
      * @type {Promise}
      */
    this.capabilitiesPromise_ = null;

    /**
      * Mapfish options params
      * @private
      * @type {String}
      */
    this.options_ = {
      dpi: 150,
      forceScale: false,
      format: 'jpg',
      legend: 'false',
      layout: 'A4 horizontal jpg',
    };

    this.layoutOptions_ = [];
    this.dpisOptions_ = [];
    this.outputFormats_ = ['pdf', 'png', 'jpg'];
    this.documentRead_ = document.createElement('img');
    this.canvas_ = document.createElement('canvas');
    this.proyectionsDefect_ = ['EPSG:3857'];
    // this.proyectionsDefect_ = ['EPSG:25828', 'EPSG:25829',
    // 'EPSG:25830', 'EPSG:25831', 'EPSG:3857', 'EPSG:4326', 'EPSG:4258'];
  }

  /**
    * This function checks when map printing is finished.
    * @param {String} url - Mapfish GET request url
    * @param {Function} callback - function that removes loading icon class.
    */
  getStatus(url, callback) {
    M.proxy(false);
    const newUrl = `${url}?timestamp=${new Date().getTime()}`;
    M.remote.get(newUrl).then((response) => {
      M.proxy(true);
      const statusJson = JSON.parse(response.text);
      const { status } = statusJson;
      if (status === 'finished') {
        callback();
      } else if (status === 'error' || status === 'cancelled') {
        callback();
        if (statusJson.error.toLowerCase().indexOf('network is unreachable') > -1 || statusJson.error.toLowerCase().indexOf('illegalargument') > -1) {
          M.dialog.error(getValue('exception.teselaError'), 'Error');
        } else {
          M.dialog.error(getValue('exception.printError'), 'Error');
        }
        getQueueContainer(this.html_).lastChild.remove();
      } else {
        setTimeout(() => this.getStatus(url, callback), 1000);
      }
    }).catch((err) => {
      M.proxy(true);
    });
  }

  active(html) {
    this.html_ = html;
    const button = this.html_.querySelector('#m-printviewmanagement-georefImage');

    const promise = new Promise((success, fail) => {
      // Tareas #4827
      // "Hasta que no veamos cómo hacer las transformaciones al vuelo en cliente y mapfish,
      // si es con servidor lo dejaría estático a 3857"
      //
      // this.getCapabilities().then((capabilitiesParam) => {
      //   const capabilities = capabilitiesParam;
      //   let i = 0;
      //   let ilen;
      //   this.dpi_ = capabilitiesParam.layouts[0].attributes[0].clientInfo.maxDPI;
      //   // default layout
      //   for (i = 0, ilen = capabilities.layouts.length; i < ilen; i += 1) {
      //     const layout = capabilities.layouts[i];
      //     if (layout.name === this.options_.layout) {
      //       layout.default = true;
      //       break;
      //     }
      //   }

      //   this.layoutOptions_ = [].concat(capabilities.layouts.map((item) => {
      //     return item.name;
      //   }));

      //   capabilities.proyections = [];
      //   const proyectionsDefect = this.proyectionsDefect_;
      //   for (i = 0, ilen = proyectionsDefect.length; i < ilen; i += 1) {
      //     if (proyectionsDefect[i] !== null) {
      //       const proyection = proyectionsDefect[i];
      //       const object = { value: proyection };
      //       if (proyection === 'EPSG:4258') {
      //         object.default = true;
      //       }

      //       capabilities.proyections.push(object);
      //     }
      //   }

      //   if (Array.isArray(capabilities.formats)) {
      //     this.outputFormats_ = capabilities.formats;
      //   }

      //   capabilities.format = this.outputFormats_.map((format) => {
      //     return {
      //       name: format,
      //       default: format === 'pdf',
      //     };
      //   });

      //   // forceScale
      //   capabilities.forceScale = this.options_.forceScale;
      const template = M.template.compileSync(georefimageHTML, {
        jsonp: true,
        vars: {
          // capabilities,
          translations: {
            referenced: getValue('referenced'),
            projection: getValue('projection'),
            down: getValue('down'),
            title: getValue('title'),
            keep: getValue('keep'),
          },
          keepView: true,
        },
      });
      this.template_ = template;
      success(template);
      //  });
    });
    promise.then((t) => {
      const DEFAULT_PROJECTION_SERVER = 'EPSG:3857';

      // Select Element Template
      this.selectElementHTML(t);

      // SET EPSG PROJECTION DEPENS FIELDSET
      this.defaultValueFieldset = null;
      if (this.printSelector) {
        this.defaultValueFieldset = this.elementFieldset_.querySelector('input[type="radio"]:checked').value;
        this.projection_ = (this.defaultValueFieldset === 'server') ? DEFAULT_PROJECTION_SERVER : this.map_.getProjection().code;
        this.elementProjection_.innerText = this.projection_;
      } else {
        this.defaultValueFieldset = this.printType;
        this.projection_ = (this.defaultValueFieldset === 'server') ? DEFAULT_PROJECTION_SERVER : this.map_.getProjection().code;
        this.removeSelector();
      }

      // Add event template
      this.addEvents();

      if (!button.classList.contains('activated')) {
        this.html_.querySelector('#m-printviewmanagement-controls').appendChild(t);
      } else {
        document.querySelector('.m-georefimage-container').remove();
      }
      button.classList.toggle('activated');
    });
  }

  removeSelector() {
    this.elementFieldset_.remove();
    this.template_.innerHTML += `
      <h4 id="m-georefimage-projection">${this.projection_}</h4>
    `;
  }

  /**
    * Esta función añade los eventos a los elementos del control
    *
    * @public
    * @function
    * @param {HTMLElement} html Contenedor del control
    * @api stable
    */
  addEvents() {
    // ADD EVENT LIST SERVICES DIALOG
    this.elementListServices_.addEventListener('click', () => M.dialog.info(LIST_SERVICES));

    // Disable m-georefimage-dpi when elementFieldset_ is client
    this.elementFieldset_.addEventListener('change', ({ target }) => {
      const value = target.value;
      if (value === 'client') {
        this.elementDpi_.setAttribute('disabled', 'disabled');
      } else {
        this.elementDpi_.removeAttribute('disabled');
      }
    });

    // ADD ENABLE TOUCH SCROLL
    M.utils.enableTouchScroll(getQueueContainer(this.html_));
  }

  selectElementHTML(html) {
    // ID ELEMENTS
    const ID_TITLE = '#m-georefimage-title';
    const ID_FORMAT_SELECT = '#m-georefimage-format';
    const ID_WLD = '#m-georefimage-wld';
    const ID_DPI = '#m-georefimage-dpi';
    const ID_PROJECTION = '#m-georefimage-projection';
    const ID_FIELDSET = '#m-georefimage-fieldset';
    const ID_LIST_SERVICES = '#m-georefimage-listServices';

    // SELECTOR CANVAS
    const SELECTOR_CANVAS = '.ol-layer canvas';

    // ELEMENTS
    this.elementTitle_ = html.querySelector(ID_TITLE);
    this.elementFormatSelect_ = html.querySelector(ID_FORMAT_SELECT);
    this.elementWld_ = html.querySelector(ID_WLD);
    this.elementDpi_ = html.querySelector(ID_DPI);
    this.elementProjection_ = html.querySelector(ID_PROJECTION);
    this.elementFieldset_ = html.querySelector(ID_FIELDSET);
    this.elementListServices_ = html.querySelector(ID_LIST_SERVICES);

    // CANVAS ELEMENT
    this.elementCanvas_ = document.querySelector(SELECTOR_CANVAS);
  }

  /**
    * This function prints on click
    *
    * @private
    * @function
    */
  printClick(evt) {
    evt.preventDefault();
    const valueFieldset = (this.printSelector) ? this.elementFieldset_.querySelector('input[type="radio"]:checked').value : this.printType;
    if (valueFieldset === 'server') {
      this.downloadServer();
    } else {
      this.downloadClient();
    }
  }

  downloadServer() {
    this.getPrintData().then((printData) => {
      let printUrl = M.utils.concatUrlPaths([this.printTemplateUrl_, `report.${printData.outputFormat}`]);

      const queueEl = innerQueueElement(
        this.html_,
        this.elementTitle_,
        this.elementQueueContainer_,
      );

      printUrl = M.utils.addParameters(printUrl, 'mapeaop=geoprint');
      // FIXME: delete proxy deactivation and uncomment if/else when proxy is fixed on Mapea
      M.proxy(false);
      M.remote.post(printUrl, printData).then((responseParam) => {
        let response = responseParam;
        const responseStatusURL = JSON.parse(response.text);
        const ref = responseStatusURL.ref;
        const statusURL = M.utils.concatUrlPaths([this.printStatusUrl_, `${ref}.json`]);
        this.getStatus(
          statusURL,
          () => removeLoadQueueElement(queueEl),
        );

        // if (response.error !== true) { // withoud proxy, response.error === true
        let downloadUrl;
        try {
          response = JSON.parse(response.text);
          if (this.serverUrl_.endsWith('/geoprint')) {
            const url = this.serverUrl_.substring(0, this.serverUrl_.lastIndexOf('/geoprint'));
            downloadUrl = M.utils.concatUrlPaths([url, response.downloadURL]);
          } else {
            downloadUrl = M.utils.concatUrlPaths([this.serverUrl_, response.downloadURL]);
          }
          this.documentRead_.src = downloadUrl;
        } catch (err) {
          M.exception(err);
        }
        queueEl.setAttribute(GeorefimageControl.DOWNLOAD_ATTR_NAME, downloadUrl);
        queueEl.addEventListener('click', this.downloadPrint.bind(this));
        // } else {
        //   M.dialog.error('Se ha producido un error en la impresión.');
        // }
      });

      M.proxy(true);
    });
  }

  downloadClient() {
    const queueEl = innerQueueElement(
      this.html_,
      this.elementTitle_,
      this.elementQueueContainer_,
    );

    const base64image = getBase64ImageClient(this.elementCanvas_, this.elementFormatSelect_.value);
    removeLoadQueueElement(queueEl);
    queueEl.addEventListener('click', evt => this.downloadPrint(evt, base64image));
  }

  getSourceAsDOM(url) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
    const parser = new DOMParser();
    const parser2 = parser.parseFromString(xmlhttp.responseText, 'text/html');
    return parser2;
  }

  /**
    * Gets capabilities
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
  getCapabilities() {
    if (M.utils.isNullOrEmpty(this.capabilitiesPromise_)) {
      this.capabilitiesPromise_ = new Promise((success, fail) => {
        const capabilitiesUrl = M.utils.concatUrlPaths([this.printTemplateUrl_, 'capabilities.json']);
        M.proxy(false);
        M.remote.get(capabilitiesUrl).then((response) => {
          let capabilities = {};
          try {
            capabilities = JSON.parse(response.text);
          } catch (err) {
            M.exception(err);
          }
          success(capabilities);
        });

        M.proxy(true);
      });
    }

    return this.capabilitiesPromise_;
  }

  /**
    * Converts decimal degrees coordinates to degrees, minutes, seconds
    * @public
    * @function
    * @param {String} coordinate - single coordinate (one of a pair)
    * @api
    */
  converterDecimalToDMS(coordinate) {
    let dms;
    let aux;
    const coord = coordinate.toString();
    const splittedCoord = coord.split('.');
    // Degrees
    dms = `${splittedCoord[0]}º `;
    // Minutes
    aux = `0.${splittedCoord[1]}`;
    aux *= 60;
    aux = aux.toString();
    aux = aux.split('.');
    dms = `${dms}${aux[0]}' `;
    // Seconds
    aux = `0.${aux[1]}`;
    aux *= 60;
    aux = aux.toString();
    aux = aux.split('.');
    dms = `${dms}${aux[0]}'' `;
    return dms;
  }

  /**
    * Converts original bbox coordinates to DMS coordinates.
    * @public
    * @function
    * @api
    * @param {Array<Object>} bbox - { x: {min, max}, y: {min, max} }
    */
  convertBboxToDMS(bbox) {
    const proj = this.map_.getProjection();
    let dmsBbox = bbox;
    if (proj.units === 'm') {
      const min = [bbox.x.min, bbox.y.min];
      const max = [bbox.x.max, bbox.y.max];
      const newMin = this.getImpl().reproject(proj.code, min);
      const newMax = this.getImpl().reproject(proj.code, max);
      dmsBbox = {
        x: {
          min: newMin[0],
          max: newMax[0],
        },
        y: {
          min: newMin[1],
          max: newMax[1],
        },
      };
    }

    dmsBbox = this.convertDecimalBoxToDMS(dmsBbox);
    return dmsBbox;
  }

  /**
    * Converts decimal coordinates Bbox to DMS coordinates Bbox.
    * @public
    * @function
    * @api
    * @param { Array < Object > } bbox - { x: { min, max }, y: { min, max } }
    */
  convertDecimalBoxToDMS(bbox) {
    return {
      x: {
        min: this.converterDecimalToDMS(bbox.x.min),
        max: this.converterDecimalToDMS(bbox.x.max),
      },
      y: {
        min: this.converterDecimalToDMS(bbox.y.min),
        max: this.converterDecimalToDMS(bbox.y.max),
      },
    };
  }

  /**
    * This function returns request JSON.
    *
    * @private
    * @function
    */
  getPrintData() {
    let projection;
    if (this.projection_ === 'EPSG:4326' || this.projection_ === 'EPSG:4258') {
      projection = this.map_.getProjection().code;
      this.projection_ = projection;
    } else {
      projection = this.projection_;
    }

    const bbox = this.map_.getBbox();
    const width = this.map_.getMapImpl().getSize()[0];
    const height = this.map_.getMapImpl().getSize()[1];
    const layout = 'plain';
    const dpi = this.elementDpi_.value;
    const outputFormat = 'jpg';
    const parameters = this.params_.parameters;
    const printData = M.utils.extend({
      layout,
      outputFormat,
      attributes: {
        map: {
          dpi,
          projection,
        },
      },
    }, this.params_.layout);

    return this.encodeLayers().then((encodedLayers) => {
      const returnData = encodedLayers;
      let encodedLayersModified = [];
      if (projection === 'EPSG:25830') {
        for (let i = 0; i < returnData.length; i += 1) {
          if (returnData[i].matrixSet != null) {
            const matrixSet = returnData[i].matrixSet.replace('GoogleMapsCompatible', 'EPSG:25830');
            returnData[i].matrixSet = matrixSet;
          }

          encodedLayersModified.push(returnData[i]);
        }
      } else {
        encodedLayersModified = encodedLayers;
      }

      printData.attributes.map.layers = encodedLayersModified;
      printData.attributes = Object.assign(printData.attributes, parameters);
      printData.attributes.map.projection = projection;
      printData.attributes.map.dpi = dpi;
      printData.attributes.map.width = width;
      printData.attributes.map.height = height;
      printData.attributes.map.bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
      if (this.map_.getProjection().code !== projection) {
        printData.attributes.map.bbox = this.getImpl().transformExt(
          printData.attributes.map.bbox, this.map_.getProjection().code,
          projection,
        );
      }

      return printData;
    });
  }

  /**
    * This function encodes layers.
    *
    * @private
    * @function
    */
  encodeLayers() {
    // Filters WMS and WMTS visible layers whose resolution is inside map resolutions range
    // and that doesn't have Cluster style.
    let layers = this.map_.getLayers().filter((layer) => {
      return (layer.isVisible() && layer.inRange() && layer.name !== 'cluster_cover' && layer.name !== 'selectLayer' && layer.name !== 'empty_layer' && ['WMS', 'WMTS', 'TMS', 'XYZ'].indexOf(layer.type) > -1);
    });

    if (this.map_.getZoom() === 20) {
      let contains = false;
      layers.forEach((l) => {
        if (l.url !== undefined && l.url === 'https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg') {
          contains = true;
        }
      });

      if (contains) {
        layers = layers.filter((l) => {
          return l.url !== 'https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg';
        });
      }
    } else if (this.map_.getZoom() < 20) {
      let contains = false;
      layers.forEach((l) => {
        if (l.url !== undefined && l.name !== undefined && l.url === 'https://www.ign.es/wmts/pnoa-ma?' && l.name === 'OI.OrthoimageCoverage') {
          contains = true;
        }
      });

      if (contains) {
        layers = layers.filter((l) => {
          return l.url !== 'https://www.ign.es/wmts/pnoa-ma?' && l.name !== 'OI.OrthoimageCoverage';
        });
      }
    }

    const encodedLayersModified = [];
    if (this.projection_.value === 'EPSG:3857') {
      for (let i = 0; i < layers.length; i += 1) {
        if (layers[i].matrixSet != null) {
          const matrixSet = layers[i].matrixSet.replace(layers[i].matrixSet, 'GoogleMapsCompatible');
          const optsMatrixSet = layers[i].options.matrixSet.replace(layers[i].matrixSet, 'GoogleMapsCompatible');
          layers[i].matrixSet = matrixSet;
          layers[i].options.matrixSet = optsMatrixSet;
        }

        encodedLayersModified.push(layers[i]);
      }

      layers = encodedLayersModified;
    } else {
      for (let i = 0; i < layers.length; i += 1) {
        if (layers[i].matrixSet != null) {
          const matrixSet = layers[i].matrixSet
            .replace(layers[i].matrixSet, this.projection_.value);
          const optsMatrixSet = layers[i].options.matrixSet
            .replace(layers[i].matrixSet, this.projection_.value);
          layers[i].matrixSet = matrixSet;
          layers[i].options.matrixSet = optsMatrixSet;
        }

        encodedLayersModified.push(layers[i]);
      }

      layers = encodedLayersModified;
    }

    let numLayersToProc = layers.length;
    const otherLayers = this.getImpl().getParametrizedLayers(this.map_, 'IMAGEN', layers);
    if (otherLayers.length > 0) {
      layers = layers.concat(otherLayers);
      numLayersToProc = layers.length;
    }

    layers = layers.sort((a, b) => {
      let res = 0;
      const zia = a.getZIndex() !== null ? a.getZIndex() : 0;
      const zib = b.getZIndex() !== null ? b.getZIndex() : 0;
      if (zia > zib) {
        res = 1;
      } else if (zia < zib) {
        res = -1;
      }

      return res;
    });

    return (new Promise((success, fail) => {
      const encodedLayers = [];
      layers.forEach((layer, index) => {
        this.getImpl().encodeLayer(layer).then((encodedLayer) => {
          if (!M.utils.isNullOrEmpty(encodedLayer)) {
            encodedLayers[index] = encodedLayer;
          }

          numLayersToProc -= 1;
          if (numLayersToProc === 0) {
            // Mapfish requires reverse order
            success(encodedLayers.reverse());
          }
        });
      });
    }));
  }


  /**
    * This function downloads printed map.
    *
    * @public
    * @function
    * @api stable
    */
  downloadPrint(evt, imgBase64) {
    // DEFAULTS PARAMS
    const FILE_EXTENSION_GEO = '.wld'; // .jgw
    const TYPE_SAVE = '.zip';

    // PARAMS
    const dpi = this.elementDpi_.value;
    const code = this.map_.getProjection().code;
    const addWLD = this.elementWld_.checked;

    // GET IMAGE
    const base64image = imgBase64 || getBase64Image(
      this.documentRead_.src,
      this.elementFormatSelect_.value,
    );

    base64image.then((resolve) => {
      // GET BBOX
      let bbox = [
        this.map_.getBbox().x.min,
        this.map_.getBbox().y.min,
        this.map_.getBbox().x.max,
        this.map_.getBbox().y.max,
      ];
      bbox = this.getImpl().transformExt(bbox, code, this.projection_);

      // GET TITLE
      const titulo = generateTitle(this.elementTitle_.value);

      // CONTENT ZIP
      const fileIMG = {
        name: titulo.concat(`.${this.elementFormatSelect_.value}`),
        data: resolve,
        base64: true,
      };

      const files = (addWLD) ? [{
        name: titulo.concat(FILE_EXTENSION_GEO),
        data: createWLD(bbox, dpi, this.map_.getMapImpl().getSize()),
        base64: false,
      },
      fileIMG,
      ] : [fileIMG];

      // CREATE ZIP
      createZipFile(files, TYPE_SAVE, titulo);
    });
  }

  /**
    *  Converts epsg code to projection name.
    * @public
    * @function
    * @param {String} projection - EPSG:xxxx
    * @api
    */
  turnProjIntoLegend(projection) {
    let projectionLegend;
    switch (projection) {
      case 'EPSG:4258':
        projectionLegend = 'ETRS89 (4258)';
        break;
      case 'EPSG:4326':
        projectionLegend = 'WGS84 (4326)';
        break;
      case 'EPSG:3857':
        projectionLegend = 'WGS84 (3857)';
        break;
      case 'EPSG:25831':
        projectionLegend = 'UTM zone 31N (25831)';
        break;
      case 'EPSG:25830':
        projectionLegend = 'UTM zone 30N (25830)';
        break;
      case 'EPSG:25829':
        projectionLegend = 'UTM zone 29N (25829)';
        break;
      case 'EPSG:25828':
        projectionLegend = 'UTM zone 28N (25828)';
        break;
      default:
        projectionLegend = '';
    }
    return projectionLegend;
  }

  /**
    * This function checks if an object is equal to this control.
    *
    * @function
    * @api stable
    */
  equals(obj) {
    let equals = false;
    if (obj instanceof GeorefimageControl) {
      equals = (this.name === obj.name);
    }

    return equals;
  }

  deactive() {
    this.template_.remove();

    // TO-DO [ ] ADD BUTTON REMOVE AND ALL EVENTS
    // TO-DO [ ] Deactive dowloand when change the contorl
  }
}

/**
  * Name for this controls
  * @const
  * @type {string}
  * @public
  * @api stable
  */
GeorefimageControl.NAME = 'georefimagecontrol';

/**
  * M.template for this controls
  * @const
  * @type {string}
  * @public
  * @api stable
  */
GeorefimageControl.TEMPLATE = 'georefimage.html';

/**
  * M.template for this controls
  * @const
  * @type {string}
  * @public
  * @api stable
  */
GeorefimageControl.LOADING_CLASS = 'printing';

/**
  * M.template for this controls
  * @const
  * @type {string}
  * @public
  * @api stable
  */
GeorefimageControl.DOWNLOAD_ATTR_NAME = 'data-donwload-url-print';

/**
  * M.template for this controls
  * @const
  * @type {string}
  * @public
  * @api stable
  */
GeorefimageControl.NO_TITLE = '(Sin titulo)';

