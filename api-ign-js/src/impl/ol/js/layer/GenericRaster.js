/**
 * @module M/impl/layer/GenericRaster
 */
import * as LayerType from 'M/layer/Type';
import {
  isNullOrEmpty,
  isNull,
  getResolutionFromScale,
  isUndefined,
  getWMSGetCapabilitiesUrl,
  getWMTSGetCapabilitiesUrl,
} from 'M/util/Utils';
import TileWMS from 'ol/source/TileWMS';
import ImageWMS from 'ol/source/ImageWMS';
import OLSourceWMTS from 'ol/source/WMTS';
import OLFormatWMTSCapabilities from 'ol/format/WMTSCapabilities';
import { get as getRemote } from 'M/util/Remote';

import LayerBase from './Layer';
import FormatWMS from '../format/WMS';
import GetCapabilities from '../util/WMSCapabilities';
import getLayerExtent from '../util/wmtscapabilities';
import Utils from '../util/Utils';

import ImplMap from '../Map';

/**
   * @classdesc
   * Generic permite añadir cualquier tipo de capa definida con la librería base.
   * @property {Object} options - Opciones de la capa
   * @property {Number} zIndex_ - Índice de la capa
   * @property {String} sldBody - Cuerpo del SLD
   * @property {String} format - Formato de la capa
   * @param {Object} options - Objeto de opciones
   * @param {Object} vendorOptions - Objeto de opciones del proveedor
   *
   * @api
   * @extends {M.impl.layer.Layer}
   */
class GenericRaster extends LayerBase {
  constructor(options = {}, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);
    this.options = options;

    /**
       * Layer map. La instancia del mapa.
       */
    this.map = null;

    /**
       * WMS zIndex_. Índice de la capa, (+40).
       */
    this.zIndex_ = ImplMap.Z_INDEX[LayerType.Generic];

    this.sldBody = options.sldBody;

    /**
       * WMS styles. Estilos de la capa.
       */
    this.styles = this.options.styles || '';

    this.style = vendorOptions.getStyle === undefined ? null : vendorOptions.getStyle().name;

    if (this.style !== 'createDefaultStyle' && vendorOptions.getStyle) {
      this.style = vendorOptions.getStyle();
    }

    /**
       * WMS format. Formato de la capa, por defecto image/png.
       */
    this.format = this.options.format;
  }

  /**
     * Este método agrega la capa al mapa.
     *
     * @public
     * @function
     * @param {M.impl.Map} map Mapa de la implementación.
     * @api stable
     */
  addTo(map) {
    this.map = map;

    Utils.addFacadeName(this.facadeLayer_, this.ol3Layer, 'Raster');

    if (this.facadeLayer_.legend === undefined) {
      Utils.addFacadeLegend(this.facadeLayer_, this.ol3Layer);
    }

    if (!isNullOrEmpty(this.visibility)) {
      this.ol3Layer.setVisible(this.visibility);
    }

    if (!isNullOrEmpty(this.maxZoom)) {
      this.ol3Layer.setMaxZoom(this.maxZoom);
    }

    if (!isNullOrEmpty(this.minZoom)) {
      this.ol3Layer.setMinZoom(this.minZoom);
    }

    if (!isNullOrEmpty(this.zIndex_)) {
      this.ol3Layer.setZIndex(this.zIndex_);
    }

    if (!isNullOrEmpty(this.visibility)) {
      this.ol3Layer.setVisible(this.visibility);
    }

    if (!isNullOrEmpty(this.sldBody)) {
      this.ol3Layer.getSource().updateParams({ SLD_BODY: this.sldBody });
    }

    if (!isNullOrEmpty(this.styles)) {
      this.ol3Layer.getSource().updateParams({ STYLES: this.styles });
    }

    if (!isNullOrEmpty(this.format)) {
      this.ol3Layer.getSource().updateParams({ FORMAT: this.format });
    }

    if (!isNullOrEmpty(this.version)) {
      this.ol3Layer.getSource().updateParams({ VERSION: this.version });
    }


    this.capabilities = this.getCapabilities(this.ol3Layer, map.getProjection());

    if (!isNullOrEmpty(this.maxExtent)) {
      this.ol3Layer.setExtent(this.maxExtent);
    } else if (
      this.ol3Layer.getSource() instanceof TileWMS ||
      this.ol3Layer.getSource() instanceof ImageWMS) {
      this.capabilities.then((capabilities) => {
        this.maxExtent = capabilities.getLayerExtent('Provincias');
        this.ol3Layer.setExtent(this.maxExtent);
        // eslint-disable-next-line no-underscore-dangle
        this.facadeLayer_.maxExtent_ = this.maxExtent;
      });
    } else if ((this.ol3Layer.getSource() instanceof OLSourceWMTS)) {
      const capabilities = this.getCapabilitiesWMTS_(this.ol3Layer);
      capabilities.then((c) => {
        this.maxExtent = this.getMaxExtentCapabilitiesWMTS_(c);
        this.ol3Layer.setExtent(this.maxExtent);
        // eslint-disable-next-line no-underscore-dangle
        this.facadeLayer_.maxExtent_ = this.maxExtent;
      });
    }

    if (!isUndefined(this.ol3Layer.getSource().getLegendUrl)) {
      this.legendUrl_ = this.ol3Layer.getSource().getLegendUrl();
    }
    this.ol3Layer.setOpacity(this.opacity_);
    this.ol3Layer.setVisible(this.visibility);

    // calculates the resolutions from scales
    if (!isNull(this.options) &&
        !isNull(this.options.minScale) && !isNull(this.options.maxScale)) {
      const units = this.map.getProjection().units;
      this.options.minResolution = getResolutionFromScale(this.options.minScale, units);
      this.options.maxResolution = getResolutionFromScale(this.options.maxScale, units);
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    } else if (!isNull(this.options) &&
        !isNull(this.options.minResolution) && !isNull(this.options.maxResolution)) {
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    }

    map.getMapImpl().addLayer(this.ol3Layer);
  }

  /**
   * Este método devuelve el capabilities de la capa.
   * @param {M.layer.WMS} layerOl Capa de la que se quiere obtener el capabilities.
   * @param {string} projection Proyección del mapa.
   * @return {Promise} Promesa con el capabilities de la capa.
   */
  getCapabilities(layerOl, projection) {
    const olSource = layerOl.getSource();
    if (olSource instanceof TileWMS || olSource instanceof ImageWMS) {
      return this.getCapabilitiesWMS_(layerOl, projection);
    }
    return null;
  }

  /**
   * Este método devuelve el capabilities de la capa.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @param {M.layer.WMS} layerOl Capa de la que se quiere obtener el capabilities.
   * @param {string} projection Proyección del mapa.
   * @return {Promise} Promesa con el capabilities de la capa.
   * @api
   */
  getCapabilitiesWMS_(layerOl, projection) {
    const olSource = layerOl.getSource();
    const projectionCode = (olSource.getProjection()) ?
      olSource.getProjection().getCode()
      : projection;

    const layerUrl = olSource.getUrl ? olSource.getUrl() : olSource.getUrls()[0];

    // serverUrl, version
    return new Promise((success, fail) => {
      const url = getWMSGetCapabilitiesUrl(layerUrl, '1.3.0');
      getRemote(url).then((response) => {
        const getCapabilitiesDocument = response.xml;
        const getCapabilitiesParser = new FormatWMS();
        const getCapabilities = getCapabilitiesParser.customRead(getCapabilitiesDocument);

        const getCapabilitiesUtils =
            new GetCapabilities(getCapabilities, layerUrl, projectionCode);
        success(getCapabilitiesUtils);
      });
    });
  }

  /**
   * Este método devuelve el capabilities de la capa.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @param {M.layer.WMS} layerOl Capa de la que se quiere obtener el capabilities.
   * @return {Promise} Promesa con el capabilities de la capa.
   * @api
   */
  getCapabilitiesWMTS_(layerOl) {
    const olSource = layerOl.getSource();

    const layerUrl = olSource.getUrls()[0];

    return new Promise((success, fail) => {
      const getCapabilitiesUrl = getWMTSGetCapabilitiesUrl(layerUrl);
      const parser = new OLFormatWMTSCapabilities();
      getRemote(getCapabilitiesUrl).then((response) => {
        let getCapabilitiesDocument = response.xml;
        const elementTag = getCapabilitiesDocument.getElementsByTagName('ows:Style');
        if (elementTag.length > 0) {
          const xmlToString = new XMLSerializer().serializeToString(getCapabilitiesDocument);
          const text = xmlToString.replaceAll('ows:Style', 'Style');
          getCapabilitiesDocument = new DOMParser().parseFromString(text, 'text/xml');
        }
        const parsedCapabilities = parser.read(getCapabilitiesDocument);
        try {
          parsedCapabilities.Contents.Layer.forEach((l) => {
            const name = l.Identifier;
            l.Style.forEach((s) => {
              const layerText = response.text.split('Layer>').filter(text => text.indexOf(`Identifier>${name}<`) > -1)[0];
              /* eslint-disable no-param-reassign */
              s.LegendURL = layerText.split('LegendURL')[1].split('xlink:href="')[1].split('"')[0];
            });
          });
          /* eslint-disable no-empty */
        } catch (err) {}
        success.call(this, parsedCapabilities);
      });
    });
  }

  /**
   * Este método devuelve el extent de la capa.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @param {Object} capabilities Capabilities de la capa.
   * @return {Array<number>} Extent de la capa.
   * @api
   */
  getMaxExtentCapabilitiesWMTS_(capabilities) {
    const contents = capabilities.Contents;
    const defaultExtent = this.map.getMaxExtent();

    if (!isNull(contents)) {
      return getLayerExtent(contents, this.name, this.map.getProjection().code, defaultExtent);
    }
    return defaultExtent;
  }

  /**
   * Este método destruye esta capa, limpiando el HTML
   * y anulando el registro de todos los eventos.
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
    }
    this.map = null;
  }

  /**
   * Este método devuelve si dos capas con iguales.
   * @param {Object} Capa con la que se quiere comparar.
   * @return {boolean} Devuelve true si las capas son iguales.
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof GenericRaster) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  }
}

export default GenericRaster;

