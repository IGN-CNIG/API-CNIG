/**
 * @module M/control/GeorefImageEpsgControl
 */

import JsZip from 'jszip';
import { saveAs } from 'file-saver';
import Georefimage2ControlImpl from '../../impl/ol/js/georefimageepsgcontrol';
import georefimage2HTML from '../../templates/georefimageepsg';
import { getValue } from './i18n/language';

export default class GeorefImageEpsgControl extends M.Control {
  /**
    * @classdesc
    * Main constructor of the class.
    *
    * @constructor
    * @extends {M.Control}
    * @api stable
    */
  constructor({ order, layers }, map) {
    const impl = new Georefimage2ControlImpl(map);
    super(impl, 'georefimage2control');
    this.map_ = map;
    if (M.utils.isUndefined(Georefimage2ControlImpl)) {
      M.exception(getValue('exception.impl'));
    }

    if (M.utils.isUndefined(Georefimage2ControlImpl.prototype.encodeLayer)) {
      M.exception(getValue('exception.encode_method'));
    }


    this.layers_ = layers || [];

    /**
      * Layout
      * @private
      * @type {HTMLElement}
      */
    this.layout_ = 'A4 horizontal jpg';

    /**
      * Map format to print
      * @private
      * @type {HTMLElement}
      */
    this.format_ = 'jpg';

    /**
      * Map dpi to print
      * @private
      * @type {HTMLElement}
      */
    this.dpi_ = 72;

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
        clientLogo: '',
        creditos: getValue('printInfo'),
      },
      parameters: {},
    };

    /**
      * Mapfish options params
      * @private
      * @type {String}
      */
    this.options_ = {
      legend: 'false',
      forceScale: false,
      dpi: this.dpi_,
      format: this.format_,
      layout: this.layout_,
    };

    this.documentRead_ = document.createElement('img');
    this.canvas_ = document.createElement('canvas');
    this.canceled = false;

    this.order = order >= -1 ? order : null;
  }

  active(html) {
    this.html_ = html;
    const button = this.html_.querySelector('#m-printviewmanagement-georefImageEpsg');


    const template = new Promise((resolve, reject) => {
      this.template_ = M.template.compileSync(georefimage2HTML, {
        jsonp: true,
        vars: {
          translations: {
            referenced: getValue('referenced'),
            downImg: getValue('downImg'),
            map: getValue('map'),
            pnoa: getValue('pnoa'),
            screen: getValue('screen'),
          },
          layers: this.layers_,
        },
      });
      resolve(this.template_);
    });


    template.then((t) => {
      if (!button.classList.contains('activated')) {
        this.html_.querySelector('#m-printviewmanagement-controls').appendChild(t);
      } else {
        document.querySelector('.m-georefimageepsg-container').remove();
      }
      button.classList.toggle('activated');
    });


    // this.accessibilityTab(html);
    // this.element_ = html;
    const printBtn = this.template_.querySelector('#m-georefimageepsg-down');
    printBtn.addEventListener('click', this.printClick_.bind(this));
  }

  /**
    * This function prints on click
    *
    * @private
    * @function
    */
  printClick_(evt) {
    evt.preventDefault();
    this.canceled = false;

    // get value select option id m-georefimageepsg-select
    const value = this.template_.querySelector('#m-georefimageepsg-select').value;
    const {
      url, name, format,
    } = this.layers_.filter(({ name: layerName }) => layerName === value)[0];
    let urlLayer = url;

    const projection = this.getUTMZoneProjection();
    const size = this.map_.getMapImpl().getSize();

    const v = this.map_.getMapImpl().getView();
    let ext = v.calculateExtent(size);
    ext = ol.proj.transformExtent(ext, 'EPSG:3857', projection);
    const f = (ext[2] - ext[0]) / size[0];
    ext[3] = ext[1] + (f * size[1]);
    const bbox = ext;


    urlLayer += `SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&SRS=${projection}&CRS=${projection}&WIDTH=${size[0]}&HEIGHT=${size[1]}`;
    urlLayer += `&BBOX=${bbox}&FORMAT=${format}&TRANSPARENT=true&STYLES=default`;
    urlLayer += `&LAYERS=${name}`;


    this.downloadPrint(urlLayer, bbox);
  }

  getUTMZoneProjection() {
    let res = this.map_.getProjection().code;
    const mapCenter = [this.map_.getCenter().x, this.map_.getCenter().y];
    const center = this.getImpl().reproject(this.map_.getProjection().code, mapCenter);
    if (center[0] < -12 && center[0] >= -20) {
      res = 'EPSG:25828';
    } else if (center[0] < -6 && center[0] >= -12) {
      res = 'EPSG:25829';
    } else if (center[0] < 0 && center[0] >= -6) {
      res = 'EPSG:25830';
    } else if (center[0] <= 6 && center[0] >= 0) {
      res = 'EPSG:25831';
    }

    return res;
  }

  /**
    * This function downloads printed map.
    *
    * @public
    * @function
    * @api stable
    */
  downloadPrint(url, bbox) {
    const imageUrl = url !== null ? url : this.documentRead_.src;
    const dpi = this.dpi_;
    const base64image = this.getBase64Image(imageUrl);
    if (!this.canceled) {
      base64image.then((resolve) => {
        if (!this.canceled) {
          const size = this.map_.getMapImpl().getSize();
          const Px = (((bbox[2] - bbox[0]) / size[0]) * (72 / dpi)).toString();
          const GiroA = (0).toString();
          const GiroB = (0).toString();
          const Py = (-((bbox[3] - bbox[1]) / size[1]) * (72 / dpi)).toString();
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
        }
      }).catch((err) => {
        M.dialog.error(getValue('exception.imageError'));
      });
    }
  }

  getBase64Image(imgUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossorigin', 'anonymous');
      img.src = imgUrl;
      img.onload = function can() {
        this.canvas_ = document.createElement('canvas');
        this.canvas_.width = img.width;
        this.canvas_.height = img.height;
        const ctx = this.canvas_.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = this.canvas_.toDataURL('image/jpeg', 1.0);
        resolve(dataURL.replace(/^data:image\/(png|jpeg);base64,/, ''));
      };

      img.onerror = function rej() {
        Promise.reject(new Error(getValue('exception.loaderror')));
        M.dialog.error(getValue('exception.imageError'));
      };
    });
  }

  /**
    * This function checks if an object is equal to this control.
    *
    * @function
    * @api stable
    */
  equals(obj) {
    let equals = false;
    if (obj instanceof GeorefImageEpsgControl) {
      equals = (this.name === obj.name);
    }

    return equals;
  }

  accessibilityTab(html) {
    html.querySelectorAll('[tabindex="0"]').forEach(el => el.setAttribute('tabindex', this.order));
  }
}
