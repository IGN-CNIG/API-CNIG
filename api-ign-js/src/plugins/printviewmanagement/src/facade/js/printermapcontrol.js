/**
 * @module M/control/PrinterMapControl
 */

import JsZip from 'jszip';
import { saveAs } from 'file-saver';
import PrinterMapControlImpl from '../../impl/ol/js/printermapcontrol';
import { reproject, transformExt } from '../../impl/ol/js/utils';
import printermapHTML from '../../templates/printermap';
import { getValue } from './i18n/language';

import { getBase64Image, removeLoadQueueElement, innerQueueElement } from './utils';

export default class PrinterMapControl extends M.Control {
  /**
    * @classdesc
    * Main constructor of the class.
    *
    * @constructor
    * @extends {M.Control}
    * @api stable
    */
  constructor(
    {
      serverUrl,
      printTemplateUrl,
      printStatusUrl,
      credits,
      logo,
      fixedDescription,
      headerLegend,
      filterTemplates,
      order,
      tooltip,
    }, map, statusProxy,
    useProxy,
  ) {
    const impl = new PrinterMapControlImpl(map);

    super(impl, PrinterMapControl.NAME);

    this.map_ = map;

    if (M.utils.isUndefined(PrinterMapControlImpl)) {
      M.exception(getValue('exception.impl'));
    }

    if (M.utils.isUndefined(PrinterMapControlImpl.prototype.encodeLayer)) {
      M.exception(getValue('exception.encode'));
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
    this.printTemplateUrl_ = printTemplateUrl || 'https://componentes.cnig.es/geoprint/print/CNIG';

    /**
      * Url for getting priting status
      * @private
      * @type {String}
      */
    this.printStatusUrl_ = printStatusUrl || 'https://componentes.cnig.es/geoprint/print/status';


    /**
      * Credits text for template
      * @private
      * @type {String}
      */
    this.credits_ = credits || '';

    /**
      * Active or disable fixedDescription fixed description
      * @private
      * @type {Boolean}
      */
    this.fixedDescription_ = fixedDescription !== undefined ? fixedDescription : false;

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
      * Max map dpi to print
      * @private
      * @type {HTMLElement}
      */
    this.dpiMax_ = null;

    this.dpiGeo_ = 120;

    /**
      * Keep view boolean
      * @private
      * @type {HTMLElement}
      */
    this.keepView_ = null;

    /**
      * Georref image boolean
      * @private
      * @type {HTMLElement}
      */
    this.georef_ = null;

    this.headerLegend_ = headerLegend || '';

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
        creditos: getValue('credits'),
      },
      parameters: {
        logo,
        headerLegend: this.headerLegend_,
      },
    };

    /**
      * Mapfish params for georef
      * @private
      * @type {String}
      */
    this.paramsGeo_ = {
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
      keepView: true,
      format: 'pdf',
      legend: 'false',
      layout: 'A4 horizontal',
    };

    this.layoutOptions_ = [];
    this.dpisOptions_ = [];
    // this.outputFormats_ = ['pdf', 'png' /*, 'jpg'*/];
    this.outputFormats_ = ['pdf', 'png'];
    this.documentRead_ = document.createElement('img');
    this.canvas_ = document.createElement('canvas');
    this.proyectionsDefect_ = ['EPSG:25828', 'EPSG:25829', 'EPSG:25830', 'EPSG:25831', 'EPSG:3857', 'EPSG:4326', 'EPSG:4258'];
    this.filterTemplates_ = filterTemplates || [];

    this.order = order >= -1 ? order : null;

    this.tooltip_ = tooltip || getValue('tooltip');

    this.statusProxy = statusProxy;
    this.useProxy = useProxy;
  }

  /**
    * This function checks when map printing is finished.
    * @param {String} url - Mapfish GET request url
    * @param {Function} callback - function that removes loading icon class.
    */
  getStatus(url, callback, queueEl) {
    M.proxy(this.useProxy);
    const param = new Date().getTime();
    M.remote.get(`${url}?timestamp=${param}`).then((response) => {
      if (response.code === 404) {
        throw new Error('Error 404');
      }

      const statusJson = JSON.parse(response.text);
      const { status } = statusJson;
      if (status === 'finished') {
        M.proxy(this.statusProxy);
        callback();
      } else if (status === 'error' || status === 'cancelled') {
        M.proxy(this.statusProxy);
        callback();
        if (statusJson.error.toLowerCase().indexOf('network is unreachable') > -1 || statusJson.error.toLowerCase().indexOf('illegalargument') > -1) {
          M.dialog.error(getValue('exception.tile'));
        } else {
          M.dialog.error(getValue('exception.error'));
        }

        // this.queueContainer_.lastChild.remove();
      } else {
        M.proxy(this.statusProxy);
        setTimeout(() => this.getStatus(url, callback), 1000);
      }
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err, 'method getStatus');
      callback(queueEl);
      queueEl.remove();
      M.dialog.error(getValue('exception.error_download_image'));
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
  active(html) {
    this.html_ = html;
    const button = this.html_.querySelector('#m-printviewmanagement-printermap');

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

        if (this.filterTemplates_.length > 0) {
          capabilities.layouts = capabilities.layouts.filter((l) => {
            return this.filterTemplates_.indexOf(l.name) > -1;
          });
        }

        // show only template names without 'jpg' on their names
        capabilities.layouts = capabilities.layouts.filter((l) => {
          return !l.name.endsWith('jpg');
        });

        capabilities.layouts.sort((a, b) => {
          let res = 0;
          if (a.name.indexOf('(Perfil') > -1 && b.name.indexOf('(Perfil') === -1) {
            res = 1;
          } else if (a.name.indexOf('(Perfil') === -1 && b.name.indexOf('(Perfil') > -1) {
            res = -1;
          } else if (a.name === b.name) {
            res = 0;
          } else {
            res = a.name > b.name ? 1 : -1;
          }

          return res;
        });

        this.layoutOptions_ = [].concat(capabilities.layouts.map((item) => {
          return item.name;
        }));

        capabilities.proyections = [];
        const proyectionsDefect = this.proyectionsDefect_;

        for (i = 0, ilen = proyectionsDefect.length; i < ilen; i += 1) {
          if (proyectionsDefect[i] !== null) {
            const proyection = proyectionsDefect[i];
            const object = { value: proyection };
            if (proyection === 'EPSG:4258') {
              object.default = true;
            }

            capabilities.proyections.push(object);
          }
        }

        capabilities.dpis = [];
        let attribute;
        // default dpi
        // recommended DPI list attribute search
        for (i = 0, ilen = capabilities.layouts[0].attributes.length; i < ilen; i += 1) {
          if (capabilities.layouts[0].attributes[i].clientInfo !== undefined) {
            attribute = capabilities.layouts[0].attributes[i];
            this.dpiMax_ = attribute.clientInfo.maxDPI;
          }
        }

        for (i = 1, ilen = attribute.clientInfo.dpiSuggestions.length; i < ilen; i += 1) {
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

        if (Array.isArray(capabilities.formats)) {
          this.outputFormats_ = capabilities.formats.filter((f) => {
            return f !== 'jpg';
          });
        }

        capabilities.format = this.outputFormats_.map((format) => {
          return {
            name: format,
            default: format === 'pdf',
          };
        });

        // keepView
        capabilities.keepView = this.options_.keepView;

        // fixedDescription
        capabilities.fixedDescription = this.fixedDescription_;

        // translations
        capabilities.translations = {
          tooltip: getValue('tooltip'),
          title: getValue('title'),
          description: getValue('description'),
          layout: getValue('layout'),
          format: getValue('format'),
          projection: getValue('projection'),
          delete: getValue('delete'),
          download: getValue('download'),
          fixeddescription: getValue('fixeddescription'),
          nameTitle: getValue('title_map'),
          maintain_view: getValue('maintain_view'),
        };

        const template = M.template.compileSync(printermapHTML, {
          jsonp: true,
          vars: capabilities,
        });

        this.accessibilityTab(template);

        this.selectElementHTML(template);

        this.template_ = template;
        success(template);
      });
    });
    promise.then((template) => {
      if (!button.classList.contains('activated')) {
        this.html_.querySelector('#m-printviewmanagement-controls').appendChild(template);
      } else {
        document.querySelector('.m-printermap-container').remove();
      }
      button.classList.toggle('activated');
    });
  }

  /**
    * This function adds event listeners.
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
  selectElementHTML(html) {
    // IDs
    const ID_TITLE = '#m-printermap-title';
    const ID_FORMAT = '#m-printermap-format';
    const ID_TEXT_AREA = '#m-printermap-description';
    const ID_LAYOUT = '#m-printermap-layout';
    const ID_DPI = '#m-printermap-dpi';

    // Elements
    this.elementTitle_ = html.querySelector(ID_TITLE);
    this.elementFormat_ = html.querySelector(ID_FORMAT);
    this.elementTextArea_ = html.querySelector(ID_TEXT_AREA);
    this.elementLayout_ = html.querySelector(ID_LAYOUT);
    this.elementDPI_ = html.querySelector(ID_DPI);
  }

  /**
    * This function prints on click
    *
    * @private
    * @function
    */
  printClick(evt) {
    evt.preventDefault();

    const getPrintData = this.getPrintData();
    const printUrl = this.printTemplateUrl_;

    let download;
    download = this.downloadPrint;


    getPrintData.then((printData) => {
      if (this.georef_) {
        download = this.downloadGeoPrint.bind(this, printData.attributes.map.bbox);
      }

      let url = M.utils.concatUrlPaths([printUrl, `report.${printData.outputFormat}`]);

      const queueEl = innerQueueElement(
        this.html_,
        this.elementTitle_,
        this.elementQueueContainer_,
      );

      url = M.utils.addParameters(url, 'mapeaop=geoprint');
      const profilControl = this.map_.getMapImpl().getControls().getArray().filter((c) => {
        return c.element !== undefined && c.element.classList !== undefined && c.element.classList.contains('ol-profil');
      });

      if ((this.georef_ === null || !this.georef_) && profilControl.length > 0) {
        // eslint-disable-next-line no-param-reassign
        printData.attributes.profil = profilControl[0].getImage();
      }

      // FIXME: delete proxy deactivation and uncomment if/else when proxy is fixed on Mapea
      M.proxy(this.useProxy);
      M.remote.post(url, printData).then((responseParam) => {
        let response = responseParam;
        const responseStatusURL = response.text && JSON.parse(response.text);
        const ref = responseStatusURL.ref;
        const statusURL = M.utils.concatUrlPaths([this.printStatusUrl_, `${ref}.json`]);
        this.getStatus(statusURL, () => removeLoadQueueElement(queueEl), queueEl);

        // if (response.error !== true) { // withoud proxy, response.error === true
        let downloadUrl;
        try {
          response = JSON.parse(response.text);
          const imageUrl = response.downloadURL.substring(response.downloadURL.indexOf('/print'), response.downloadURL.length);
          downloadUrl = M.utils.concatUrlPaths([this.serverUrl_, imageUrl]);
          this.documentRead_.src = downloadUrl;
        } catch (err) {
          M.exception(err);
        }

        queueEl.setAttribute(PrinterMapControl.DOWNLOAD_ATTR_NAME, downloadUrl);
        queueEl.addEventListener('click', download);
        queueEl.addEventListener('keydown', download);
        // } else {
        //   M.dialog.error('Se ha producido un error en la impresión.');
        // }
      });
      M.proxy(this.statusProxy);
    });
    if (!M.utils.isNullOrEmpty(this.getImpl().errors)) {
      M.toast.warning(getValue('exception.error_layers') + this.getImpl().errors.join(', '), null, 6000);
      this.getImpl().errors = [];
    }
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
        M.proxy(this.useProxy);
        M.remote.get(capabilitiesUrl).then((response) => {
          let capabilities = {};
          try {
            capabilities = JSON.parse(response.text);
          } catch (err) {
            M.exception(err);
          }
          success(capabilities);
        });

        M.proxy(this.statusProxy);
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
      const newMin = reproject(proj.code, min);
      const newMax = reproject(proj.code, max);
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
    const title = this.elementTitle_.value;
    let description = this.elementTextArea_.value;
    const credits = this.credits_;
    if (credits.length > 2) {
      if (description.length > 0) {
        description += ` - ${credits}`;
      } else {
        description += credits;
      }
    }

    const projection = this.map_.getProjection().code;
    const bbox = this.map_.getBbox();
    const dmsBbox = this.convertBboxToDMS(bbox);
    let layout = this.elementLayout_.value;
    const dpi = this.elementDPI_.value;

    const outputFormat = this.elementFormat_.value;
    const parameters = this.params_.parameters;

    const attributionContainer = document.querySelector('#m-attributions-container>div>a');
    const attribution = attributionContainer !== null ?
      `${getValue('base')}: ${attributionContainer.innerHTML}` : '';

    if (outputFormat === 'jpg') {
      layout += ' jpg';
    }

    const date = new Date();
    const currentDate = ''.concat(date.getDate(), '/', date.getMonth() + 1, '/', date.getFullYear());
    let fileTitle = title.replace(' ', '');
    if (fileTitle.length <= 8) {
      fileTitle = fileTitle.concat('${yyyyMMddhhmmss}');
      this.params_.layout.outputFilename = fileTitle;
    } else {
      fileTitle = fileTitle.substring(0, 7).concat('${yyyyMMddhhmmss}');
      this.params_.layout.outputFilename = fileTitle;
    }

    const printData = M.utils.extend({
      layout,
      outputFormat,
      attributes: {
        title,
        description,
        attributionInfo: attribution,
        refsrs: this.turnProjIntoLegend(projection),
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
      printData.attributes.map.layers = encodedLayers.filter(l => M.utils.isObject(l));
      printData.attributes = Object.assign(printData.attributes, parameters);
      if (projection !== 'EPSG:3857' && this.map_.getLayers().some(layer => (layer.type === M.layer.type.OSM || layer.type === M.layer.type.Mapbox))) {
        printData.attributes.map.projection = 'EPSG:3857';
      }

      printData.attributes.map.bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
      if (projection !== 'EPSG:3857' && this.map_.getLayers().some(layer => (layer.type === M.layer.type.OSM || layer.type === M.layer.type.Mapbox))) {
        printData.attributes.map.bbox = transformExt(printData.attributes.map.bbox, projection, 'EPSG:3857');
      }

      return printData;
    });
  }

  getDPI_() {
    if (!this.keepView_) {
      return this.dpi_.value;
    }
    return 120;
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
    const mapZoom = this.map_.getZoom();
    let layers = this.map_.getLayers().filter((layer) => {
      return (layer.isVisible() && layer.inRange() && layer.name !== 'cluster_cover' && layer.name !== 'selectLayer' && layer.name !== 'empty_layer' &&
      mapZoom > layer.getImpl().getMinZoom() && mapZoom <= layer.getImpl().getMaxZoom());
    });

    if (mapZoom === 20) {
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
    } else if (mapZoom < 20) {
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

    let numLayersToProc = layers.length;
    const otherLayers = this.getImpl().getParametrizedLayers('IMAGEN', layers);
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
  downloadPrint(event) {
    event.preventDefault();
    if (event.key === undefined || event.key === 'Enter' || event.key === ' ') {
      const downloadUrl = this.getAttribute(PrinterMapControl.DOWNLOAD_ATTR_NAME);
      if (!M.utils.isNullOrEmpty(downloadUrl)) {
        window.open(downloadUrl, '_blank');
      }
    }
  }

  /**
    * This function downloads geo printed map.
    *
    * @public
    * @function
    * @api stable
    */
  downloadGeoPrint(bbox, event) {
    const base64image = getBase64Image(this.documentRead_.src);
    base64image.then((resolve) => {
      const size = this.map_.getMapImpl().getSize();
      const Px = (((bbox[2] - bbox[0]) / size[0]) * (72 / this.dpiGeo_)).toString();
      const GiroA = (0).toString();
      const GiroB = (0).toString();
      const Py = (-((bbox[3] - bbox[1]) / size[1]) * (72 / this.dpiGeo_)).toString();
      const Cx = (bbox[0] + (Px / 2)).toString();
      const Cy = (bbox[3] + (Py / 2)).toString();
      const f = new Date();
      const titulo = 'mapa_'.concat(f.getFullYear(), '-', f.getMonth() + 1, '-', f.getDay() + 1, '_', f.getHours(), f.getMinutes(), f.getSeconds());
      const zip = new JsZip();
      zip.file(titulo.concat('.jgw'), Px.concat('\n', GiroA, '\n', GiroB, '\n', Py, '\n', Cx, '\n', Cy));
      zip.file(titulo.concat('.jpg'), resolve, { base64: true });
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, titulo.concat('.zip'));
      });
    }).catch((err) => {
      M.dialog.error(getValue('exception.imageError'));
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
        projectionLegend = 'EPSG:4258 (ETRS89)';
        break;
      case 'EPSG:4326':
        projectionLegend = 'EPSG:4326 (WGS84)';
        break;
      case 'EPSG:3857':
        projectionLegend = 'EPSG:3857 (WGS84)';
        break;
      case 'EPSG:25831':
        projectionLegend = `EPSG:25831 (UTM ${getValue('zone')} 31N)`;
        break;
      case 'EPSG:25830':
        projectionLegend = `EPSG:25830 (UTM ${getValue('zone')} 30N)`;
        break;
      case 'EPSG:25829':
        projectionLegend = `EPSG:25829 (UTM ${getValue('zone')} 29N)`;
        break;
      case 'EPSG:25828':
        projectionLegend = `EPSG:25828 (UTM ${getValue('zone')} 28N)`;
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
    if (obj instanceof PrinterMapControl) {
      equals = (this.name === obj.name);
    }
    return equals;
  }

  accessibilityTab(html) {
    html.querySelectorAll('[tabindex="0"]').forEach(el => el.setAttribute('tabindex', this.order));
  }

  deactive() {
    this.template_.remove();
    // TO-DO ADD BUTTON REMOVE AND ALL EVENTS
  }

  /**
   * This function destroys this control
   *
   * @public
   * @function
   * @api
   */
  destroy() {
  }
}

/**
  * Name for this controls
  * @const
  * @type {string}
  * @public
  * @api stable
  */
PrinterMapControl.NAME = 'printermapcontrol';

/**
  * M.template for this controls
  * @const
  * @type {string}
  * @public
  * @api stable
  */
PrinterMapControl.TEMPLATE = 'printermap.html';

/**
  * M.template for this controls
  * @const
  * @type {string}
  * @public
  * @api stable
  */
PrinterMapControl.LOADING_CLASS = 'printing';

/**
  * M.template for this controls
  * @const
  * @type {string}
  * @public
  * @api stable
  */
PrinterMapControl.DOWNLOAD_ATTR_NAME = 'data-donwload-url-print';

