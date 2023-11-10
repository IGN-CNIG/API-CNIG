/**
 * @module M/impl/layer/Generic
 */
import { isNullOrEmpty } from 'M/util/Utils';

import GenericRaster from './GenericRaster';
import GenericVector from './GenericVector';

/**
 * @classdesc
 * Generic permite añadir cualquier tipo de capa definida con la librería base
 *
 * @api
 */
class Generic {
  constructor(options = {}, vendorOptions, type) {
    const opt = options;

    let GenericObjet = {};

    // Extiende de Vector o Raster
    if (type === 'vector') {
      GenericObjet = new GenericVector(opt, vendorOptions);
    }

    if (type === 'raster') {
      GenericObjet = new GenericRaster(opt, vendorOptions);
    }

    // Atributos comunes
    GenericObjet.ol3Layer = vendorOptions;
    GenericObjet.numZoomLevels = opt.numZoomLevels || '';
    GenericObjet.maxExtent = opt.maxExtent || [];
    GenericObjet.ids = opt.ids;
    GenericObjet.version = opt.version;
    GenericObjet.legend = opt.legend;

    // Métodos comunes
    GenericObjet.setURLService = this.setURLService;
    GenericObjet.getURLService = this.getURLService;
    GenericObjet.setFacadeObj = this.setFacadeObj;
    GenericObjet.getMaxResolution = this.getMaxResolution;
    GenericObjet.getMinResolution = this.getMinResolution;
    GenericObjet.refresh = this.refresh;
    GenericObjet.getLegendURL = this.getLegendURL;
    GenericObjet.setLegendURL = this.setLegendURL;
    GenericObjet.getMaxExtent = this.getMaxExtent;
    GenericObjet.setMaxExtent = this.setMaxExtent;
    GenericObjet.isQueryable = this.isQueryable;
    GenericObjet.setVersion = this.setVersion;

    return GenericObjet;
  }


  /**
    * Este método modifica la URL del servicio.
    *
    * @function
    * @param {String} URL del servicio.
    * @api
    */
  setURLService(url) {
    if (!isNullOrEmpty(this.ol3Layer) && !isNullOrEmpty(this.ol3Layer.getSource) &&
           !isNullOrEmpty(this.ol3Layer.getSource()) && !isNullOrEmpty(url)) {
      this.ol3Layer.getSource().setUrl(url);
    }
  }

  /**
     * Este método obtiene la URL del servicio.
     *
     * @function
     * @returns {String} URL del servicio
     * @api
     */
  getURLService() {
    let url = '';
    if (!isNullOrEmpty(this.ol3Layer) && !isNullOrEmpty(this.ol3Layer.getSource) &&
            !isNullOrEmpty(this.ol3Layer.getSource())) {
      const source = this.ol3Layer.getSource();
      if (!isNullOrEmpty(source.getUrl)) {
        url = this.ol3Layer.getSource().getUrl();
      } else if (!isNullOrEmpty(source.getUrls)) {
        url = this.ol3Layer.getSource().getUrls();
      }
    }
    return url;
  }

  /**
    * Este método establece la clase de la fachada
    * de MBTiles.
    *
    * @function
    * @param {Object} obj Objeto a establecer como fachada.
    * @public
    * @api
    */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
  }

  /**
    * Este método obtiene la resolución máxima para
    * este WMS.
    *
    *
    * @public
    * @function
    * @return {Number} Resolución Máxima.
    * @api stable
    */
  getMaxResolution() {
    return this.ol3Layer.getMaxResolution();
  }


  /**
     * Este método obtiene la resolución mínima.
     *
     * @public
     * @function
     * @return {Number} Resolución mínima.
     * @api stable
     */
  getMinResolution() {
    return this.ol3Layer.getMinResolution();
  }

  /**
    * Este método actualiza la capa.
    * @function
    * @api stable
    */
  refresh() {
    this.ol3Layer.getSource().refresh();
  }

  /**
    * Devuelve la URL de la leyenda.
    *
    * @public
    * @function
    * @returns {String} URL de la leyenda.
    * @api stable
    */
  getLegendURL() {
    return this.legendUrl_;
  }

  setLegendURL(newLegend) {
    if (!isNullOrEmpty(newLegend)) {
      this.legendUrl_ = newLegend;
    }
  }

  getMaxExtent() {
    return this.ol3Layer.getExtent();
  }

  setMaxExtent(extent) {
    return this.ol3Layer.setExtent(extent);
  }

  /**
     * Este método indica si la capa es consultable.
     *
     * @function
     * @returns {Boolean} Verdadero es consultable, falso si no.
     * @api stable
     * @expose
     */
  isQueryable() {
    return (this.options.queryable !== false);
  }

  setVersion(newVersion) {
    this.version = newVersion;
    this.ol3Layer.getSource().updateParams({ VERSION: newVersion });
  }
}

export default Generic;
