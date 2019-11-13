/**
 * @module M/control/PrinterControl
 */

import PrinterControlImpl from '../../impl/ol/js/printercontrol';
import printerHTML from '../../templates/printer';

export default class PrinterControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class.
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    const impl = new PrinterControlImpl();

    super(impl, PrinterControl.NAME);

    if (M.utils.isUndefined(PrinterControlImpl)) {
      M.exception('La implementación usada no puede crear controles Printer');
    }

    if (M.utils.isUndefined(PrinterControlImpl.prototype.encodeLayer)) {
      M.exception('La implementación usada no posee el método encodeLayer');
    }

    /**
     * Mapfish server url
     * @private
     * @type {String}
     */
    this.serverUrl_ = 'https://geoprint.desarrollo.guadaltel.es';

    /**
     * Mapfish template url
     * @private
     * @type {String}
     */
    this.printTemplateUrl_ = 'https://geoprint.desarrollo.guadaltel.es/print/CNIG';


    /**
     * Url for getting priting status
     * @private
     * @type {String}
     */
    this.printStatusUrl_ = 'https://geoprint.desarrollo.guadaltel.es/print/status';

    /**
     * Map title
     * @private
     * @type {HTMLElement}
     */
    this.inputTitle_ = null;

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
        creditos: 'Impresión generada a través de Mapea',
      },
      parameters: {
        imageSpain: 'file://E01_logo_IGN_CNIG.png',
        imageCoordinates: 'file://E01_logo_IGN_CNIG.png',
      },
    };

    /**
     * Container of maps available for download
     * @private
     * @type {HTMLElement}
     */
    this.queueContainer_ = null;

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
      format: 'pdf',
      legend: 'false',
      layout: 'A4 horizontal',
    };

    this.layoutOptions_ = [];
    this.dpisOptions_ = [];
  }

  /**
   * This function checks when map printing is finished.
   * @param {String} url - Mapfish GET request url
   * @param {Function} callback - function that removes loading icon class.
   */
  getStatus(url, callback) {
    M.remote.get(url).then((response) => {
      const statusJson = JSON.parse(response.text);
      const { status } = statusJson;
      if (status === 'finished') {
        callback();
      } else if (status === 'error' || status === 'cancelled') {
        callback();
        if (statusJson.error.toLowerCase().indexOf('network is unreachable') > -1 || statusJson.error.toLowerCase().indexOf('illegalargument') > -1) {
          M.dialog.error('La petición de alguna tesela ha provocado un error en la impresión. <br/>Por favor, inténtelo de nuevo.');
        } else {
          M.dialog.error('Se ha producido un error en la impresión.');
        }

        this.queueContainer_.lastChild.remove();
      } else {
        setTimeout(() => this.getStatus(url, callback), 1000);
      }
    });
  }

  /**
   * This function creates the view to the specified map.
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stabletrue
   */
  createView(map) {
    const promise = new Promise((success, fail) => {
      this.getCapabilities().then((capabilitiesParam) => {
        const capabilities = capabilitiesParam;
        let i = 0;
        let ilen;

        // default layout
        for (i = 0, ilen = capabilities.layouts.length; i < ilen; i += 1) {
          const layout = capabilities.layouts[i];
          if (layout.name === this.options_.layout) {
            layout.default = true;
            break;
          }
        }

        // show only template names withoug 'jpg' on their names
        capabilities.layouts = capabilities.layouts.filter((l) => {
          return !l.name.endsWith('jpg');
        });

        this.layoutOptions_ = [].concat(capabilities.layouts.map((item) => {
          return item.name;
        }));

        capabilities.dpis = [];
        let attribute;
        // default dpi
        // recommended DPI list attribute search
        for (i = 0, ilen = capabilities.layouts[0].attributes.length; i < ilen; i += 1) {
          if (capabilities.layouts[0].attributes[i].clientInfo !== null) {
            attribute = capabilities.layouts[0].attributes[i];
          }
        }

        for (i = 0, ilen = attribute.clientInfo.dpiSuggestions.length; i < ilen; i += 1) {
          const dpi = attribute.clientInfo.dpiSuggestions[i];

          if (parseInt(dpi, 10) === this.options_.dpi) {
            dpi.default = true;
            break;
          }
          const object = { value: dpi };
          capabilities.dpis.push(object);
        }

        this.dpisOptions_ = [].concat(capabilities.dpis.map((item) => {
          return item.value;
        }));

        // Fix to show only pdf, png & jpeg formats
        capabilities.format = [{ name: 'pdf' }, { name: 'png' }, { name: 'jpg' }];

        // forceScale
        capabilities.forceScale = this.options_.forceScale;
        const html = M.template.compileSync(printerHTML, { jsonp: true, vars: capabilities });
        this.addEvents(html);
        success(html);
      });
    });
    return promise;
  }

  /**
   * This function adds event listeners.
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  addEvents(html) {
    this.element_ = html;

    this.inputTitle_ = this.element_.querySelector('.form div.title > input');

    this.areaDescription_ = this.element_.querySelector('.form div.description > textarea');

    const selectLayout = this.element_.querySelector('.form div.layout > select');
    selectLayout.addEventListener('change', (e) => {
      const layoutValue = selectLayout.value;
      this.setLayout({
        value: layoutValue,
        name: layoutValue,
      });
    });

    const layoutValue = selectLayout.value;
    this.setLayout({
      value: layoutValue,
      name: layoutValue,
    });

    const selectDpi = this.element_.querySelector('.form div.dpi > select');
    selectDpi.addEventListener('change', (e) => {
      const dpiValue = selectDpi.value;
      this.setDpi({
        value: dpiValue,
        name: dpiValue,
      });
    });

    const dpiValue = selectDpi.value;
    this.setDpi({
      value: dpiValue,
      name: dpiValue,
    });

    const selectFormat = this.element_.querySelector('.form div.format > select');
    selectFormat.addEventListener('change', (e) => {
      this.setFormat(selectFormat.value);
    });
    this.setFormat(selectFormat.value);

    const checkboxForceScale = this.element_.querySelector('.form div.forcescale > input');
    checkboxForceScale.addEventListener('click', (e) => {
      this.setForceScale(checkboxForceScale.checked);
    });
    this.setForceScale(checkboxForceScale.checked);

    const printBtn = this.element_.querySelector('.button > button.print');
    printBtn.addEventListener('click', this.printClick_.bind(this));

    const cleanBtn = this.element_.querySelector('.button > button.remove');
    cleanBtn.addEventListener('click', (event) => {
      event.preventDefault();

      // reset values
      this.inputTitle_.value = '';
      this.areaDescription_.value = '';
      selectLayout.value = this.layoutOptions_[0];
      selectDpi.value = this.dpisOptions_[0];
      selectFormat.value = this.options_.format;
      checkboxForceScale.checked = this.options_.forceScale;

      // Create events and init
      const changeEvent = document.createEvent('HTMLEvents');
      changeEvent.initEvent('change');
      const clickEvent = document.createEvent('HTMLEvents');
      // Fire listeners
      clickEvent.initEvent('click');
      selectLayout.dispatchEvent(changeEvent);
      selectDpi.dispatchEvent(changeEvent);
      selectFormat.dispatchEvent(changeEvent);
      checkboxForceScale.dispatchEvent(clickEvent);
      // clean queue

      Array.prototype.forEach.apply(this.queueContainer_.children, [(child) => {
        child.removeEventListener('click', this.downloadPrint);
      }, this]);

      this.queueContainer_.innerHTML = '';
    });

    this.queueContainer_ = this.element_.querySelector('.queue > ul.queue-container');
    M.utils.enableTouchScroll(this.queueContainer_);
  }

  /**
   * Sets layout
   *
   * @private
   * @function
   */
  setLayout(layout) {
    this.layout_ = layout;
  }

  /**
   * Sets format
   *
   * @private
   * @function
   */
  setFormat(format) {
    this.format_ = format;
  }

  /**
   * Sets dpi
   *
   * @private
   * @function
   */
  setDpi(dpi) {
    this.dpi_ = dpi;
  }

  /**
   * Sets force scale option
   *
   * @private
   * @function
   */
  setForceScale(forceScale) {
    this.forceScale_ = forceScale;
  }

  /**
   * This function prints on click
   *
   * @private
   * @function
   */
  printClick_(evt) {
    evt.preventDefault();

    this.getPrintData().then((printData) => {
      let printUrl = M.utils.concatUrlPaths([this.printTemplateUrl_, `report.${printData.outputFormat}`]);

      const queueEl = this.createQueueElement();
      this.queueContainer_.appendChild(queueEl);
      queueEl.classList.add(PrinterControl.LOADING_CLASS);
      printUrl = M.utils.addParameters(printUrl, 'mapeaop=geoprint');
      // FIXME: delete proxy deactivation and uncomment if/else when proxy is fixed on Mapea
      M.proxy(false);
      M.remote.post(printUrl, printData).then((responseParam) => {
        let response = responseParam;
        const responseStatusURL = JSON.parse(response.text);
        const ref = responseStatusURL.ref;
        const statusURL = M.utils.concatUrlPaths([this.printStatusUrl_, `${ref}.json`]);
        this.getStatus(statusURL, () => queueEl.classList.remove(PrinterControl.LOADING_CLASS));

        // if (response.error !== true) { // withoud proxy, response.error === true
        let downloadUrl;
        try {
          response = JSON.parse(response.text);
          downloadUrl = M.utils.concatUrlPaths([this.serverUrl_, response.downloadURL]);
        } catch (err) {
          M.exception(err);
        }
        queueEl.setAttribute(PrinterControl.DOWNLOAD_ATTR_NAME, downloadUrl);
        queueEl.addEventListener('click', this.downloadPrint);
        // } else {
        //   M.dialog.error('Se ha producido un error en la impresión.');
        // }
      });
      M.proxy(true);
    });
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
        M.remote.get(capabilitiesUrl).then((response) => {
          let capabilities = {};
          try {
            capabilities = JSON.parse(response.text);
          } catch (err) {
            M.exception(err);
          }
          success(capabilities);
        });
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
        x: { min: newMin[0], max: newMax[0] },
        y: { min: newMin[1], max: newMax[1] },
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
    const title = this.inputTitle_.value;
    const description = this.areaDescription_.value;
    const projection = this.map_.getProjection().code;
    const bbox = this.map_.getBbox();
    const dmsBbox = this.convertBboxToDMS(bbox);
    let layout = this.layout_.name; // "A3 landscape" (yaml template)
    const dpi = this.dpi_.value;
    const outputFormat = this.format_;
    // const scale = this.map_.getScale().toLocaleString('en').replace(/,/g, '.');
    const center = this.map_.getCenter();
    const parameters = this.params_.parameters;
    const attributionContainer = document.querySelector('#m-attributions-container>div>a');
    const attribution = attributionContainer !== null ?
      `Cartografía base: ${attributionContainer.innerHTML}` : '';

    if (outputFormat === 'jpg') {
      layout += ' jpg';
    }

    const date = new Date();
    const currentDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    const printData = M.utils.extend({
      layout,
      outputFormat,
      attributes: {
        title,
        description,
        attributionInfo: attribution,
        refsrs: this.turnProjIntoLegend(projection),
        // numscale: `1:${scale}`,
        printDate: currentDate,
        map: {
          dpi,
          projection,
          useAdjustBounds: true,
        },
        xCoordTopLeft: dmsBbox.y.max,
        yCoordTopLeft: dmsBbox.x.min,
        xCoordTopRight: dmsBbox.y.max,
        yCoordTopRight: dmsBbox.x.max,
        xCoordBotRight: dmsBbox.y.min,
        yCoordBotRight: dmsBbox.x.max,
        xCoordBotLeft: dmsBbox.y.min,
        yCoordBotLeft: dmsBbox.x.min,
      },
    }, this.params_.layout);

    return this.encodeLayers().then((encodedLayers) => {
      printData.attributes.map.layers = encodedLayers;
      printData.attributes = Object.assign(printData.attributes, parameters);

      if (projection.code !== 'EPSG:3857' && this.map_.getLayers().some(layer => (layer.type === M.layer.type.OSM || layer.type === M.layer.type.Mapbox))) {
        printData.attributes.map.projection = 'EPSG:3857';
      }

      if (!this.forceScale_) {
        printData.attributes.map.bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];

        if (projection.code !== 'EPSG:3857' && this.map_.getLayers().some(layer => (layer.type === M.layer.type.OSM || layer.type === M.layer.type.Mapbox))) {
          printData.attributes.map.bbox = this.getImpl().transformExt(printData.attributes.map.bbox, projection.code, 'EPSG:3857');
        }
      } else if (this.forceScale_) {
        printData.attributes.map.center = [center.x, center.y];
        printData.attributes.map.scale = this.map_.getScale();
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
    // Filters visible layers whose resolution is inside map resolutions range
    // and that doesn't have Cluster style.
    const layers = this.map_.getLayers().filter((layer) => {
      return (layer.isVisible() && layer.inRange() && layer.name !== 'cluster_cover');
    });

    let numLayersToProc = layers.length;

    return (new Promise((success, fail) => {
      let encodedLayers = [];
      const vectorLayers = [];
      const wmsLayers = [];
      const otherBaseLayers = [];
      layers.forEach((layer) => {
        this.getImpl().encodeLayer(layer).then((encodedLayer) => {
          // Vector layers must be added after non vector layers.
          if (!M.utils.isNullOrEmpty(encodedLayer)) {
            if (encodedLayer.type === 'Vector' || encodedLayer.type === 'KML') {
              vectorLayers.push(encodedLayer);
            } else if (encodedLayer.type === 'WMS') {
              wmsLayers.push(encodedLayer);
            } else {
              otherBaseLayers.push(encodedLayer);
            }
          }

          numLayersToProc -= 1;
          if (numLayersToProc === 0) {
            encodedLayers = encodedLayers.concat(otherBaseLayers)
              .concat(wmsLayers).concat(vectorLayers);
            // Mapfish requires reverse order
            success(encodedLayers.reverse());
          }
        });
      });
    }));
  }

  /**
   * This function creates list element.
   *
   * @public
   * @function
   * @api stable
   */
  createQueueElement() {
    const queueElem = document.createElement('li');
    let title = this.inputTitle_.value;
    if (M.utils.isNullOrEmpty(title)) {
      title = PrinterControl.NO_TITLE;
    }
    queueElem.innerHTML = title;
    return queueElem;
  }

  /**
   * This function downloads printed map.
   *
   * @public
   * @function
   * @api stable
   */
  downloadPrint(event) {
    event.preventDefault();

    const downloadUrl = this.getAttribute(PrinterControl.DOWNLOAD_ATTR_NAME);
    if (!M.utils.isNullOrEmpty(downloadUrl)) {
      window.open(downloadUrl, '_blank');
    }
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
    if (obj instanceof PrinterControl) {
      equals = (this.name === obj.name);
    }
    return equals;
  }
}

/**
 * Name for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
PrinterControl.NAME = 'printercontrol';

/**
 * M.template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
PrinterControl.TEMPLATE = 'printer.html';

/**
 * M.template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
PrinterControl.LOADING_CLASS = 'printing';

/**
 * M.template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
PrinterControl.DOWNLOAD_ATTR_NAME = 'data-donwload-url-print';

/**
 * M.template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
PrinterControl.NO_TITLE = '(Sin título)';
