/**
 * @module M/impl/layer/GenericRaster
 */
import * as LayerType from 'M/layer/Type';
import {
  isNullOrEmpty,
  isNull,
  getResolutionFromScale,
  isUndefined,
} from 'M/util/Utils';
import LayerBase from './Layer';
import ImplMap from '../Map';

/**
   * @classdesc
   * La API-CNIG permite visualizar la capa de Open Street Map.
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

    if (!isNullOrEmpty(this.maxExtent)) {
      this.ol3Layer.setExtent(this.maxExtent);
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

