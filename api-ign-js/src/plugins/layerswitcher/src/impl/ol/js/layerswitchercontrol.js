/**
 * @module M/impl/control/LayerswitcherControl
 */
export default class LayerswitcherControl extends M.impl.Control {
  /**
   * Esta función añade el control al mapa
   *
   * @public
   * @function
   * @param {M.Map} map mapa al que añadir el control
   * @param {HTMLElement} html html del control
   * @api stable
   */
  addTo(map, html) {
    this.facadeMap_ = map;
    super.addTo(map, html);
  }

  /**
   * Registra evento rendercomplete del mapa para renderizar el control
   *
   * @param {M.Map} map mapa al que añadir el control
   * @public
   * @function
   */
  registerEvent(map) {
    this.facadeMap_ = map;
    this.fnRender = this.renderControl.bind(this);
    if (!M.utils.isNullOrEmpty(map)) {
      this.olMap = map.getMapImpl();
      this.olMap.on('rendercomplete', this.fnRender);
    }
  }

  /**
   * Renderiza el control
   *
   * @public
   * @function
   */
  renderControl() {
    this.facadeControl.render();
  }

  /**
   * Elimina evento rendercomplete del mapa
   *
   * @public
   * @function
   */
  removeRenderComplete() {
    if (!M.utils.isNullOrEmpty(this.olMap)) {
      this.olMap.un('rendercomplete', this.fnRender);
      this.fnRender = null;
    }
  }

  /**
   * Loads OGCAPIFeatures layer
   * @public
   * @function
   * @param {*} layerParameters -
   */
  loadOGCAPIFeaturesLayer(layerParameters) {
    const layer = new M.layer.OGCAPIFeatures(layerParameters);
    this.facadeMap_.addLayers(layer);
    layer.setZIndex(layer.getZIndex() + 8);
  }

  /**
   * Loads OGCAPIFeatures layer
   * @public
   * @function
   * @param {*} layerParameters -
   */
  getNumberFeaturesOGCAPIFeaturesLayer(layerParameters) {
    const layer = new M.layer.OGCAPIFeatures(layerParameters);
    const url = this.getFeatureUrl(layer);
    let numberFeatures;
    let jsonResponseOgc;
    return M.remote.get(url).then((response) => {
      jsonResponseOgc = JSON.parse(response.text);
      if (jsonResponseOgc !== null) {
        if (jsonResponseOgc.type === 'Feature') {
          numberFeatures = 1;
        } else {
          numberFeatures = jsonResponseOgc.features.length;
        }
      } else {
        numberFeatures = 0;
      }

      return numberFeatures;
    });
  }

  /**
   * Gets feature url of features
   * @public
   * @function
   * @api
   */
  getFeatureUrl(layer) {
    const getFeatureParams = {
      // service: 'OGCAPIFeatures',
      // request: 'GetFeature',
      // outputFormat: layer.getFeatureOutputFormat_,
      // describeOutputFormat: layer.getDescribeFeatureType_,
      // srsname: projection.getCode(),
    };
    let fUrl;
    /* eslint-disable no-param-reassign */
    if (!M.utils.isNullOrEmpty(layer.name)) {
      layer.url = `${layer.url}${layer.name}/items/`;
    }

    if (!M.utils.isNullOrEmpty(layer.format)) {
      getFeatureParams.f = layer.format;
    }

    if (!M.utils.isNullOrEmpty(layer.id)) {
      layer.url = `${layer.url}${layer.id}?`;
      /* eslint-disable-next-line max-len */
      fUrl = M.utils.addParameters(M.utils.addParameters(layer.url, getFeatureParams), layer.getFeatureVendor);
    } else {
      layer.url = `${layer.url}?`;

      if (!M.utils.isNullOrEmpty(layer.limit)) {
        getFeatureParams.limit = layer.limit;
      }

      if (!M.utils.isNullOrEmpty(layer.offset)) {
        getFeatureParams.offset = layer.offset;
      }

      if (!M.utils.isNullOrEmpty(layer.bbox)) {
        getFeatureParams.bbox = layer.bbox;
      }
      /* eslint-disable-next-line max-len */
      fUrl = M.utils.addParameters(M.utils.addParameters(layer.url, getFeatureParams), layer.getFeatureVendor);

      if (!M.utils.isNullOrEmpty(layer.conditional)) {
        let text = '';
        Object.keys(layer.conditional).forEach((key) => {
          const param = `&${key}=${layer.conditional[key]}&`;
          text += param;
        });
        getFeatureParams.conditional = text;
        fUrl += getFeatureParams.conditional;
      }
    }
    fUrl = fUrl.replaceAll(' ', '%20');
    return fUrl;
  }

  /**
   * Transforms x,y coordinates to 4326 on coordinates array.
   * @public
   * @function
   * @api
   * @param {String} codeProjection
   * @param {Array<Number>} oldCoordinates
   */
  getTransformedCoordinates(codeProjection, oldCoordinates) {
    const transformFunction = ol.proj.getTransform(codeProjection, 'EPSG:4326');
    return this.getFullCoordinates(
      oldCoordinates,
      transformFunction(this.getXY(oldCoordinates)),
    );
  }

  /**
   * Substitutes x, y coordinates on coordinate set (x, y, altitude...)
   * @public
   * @function
   * @api
   * @param {Array} oldCoordinates
   * @param {Array<Number>} newXY - [x,y]
   */
  getFullCoordinates(oldCoordinates, newXY) {
    const newCoordinates = oldCoordinates;
    newCoordinates[0] = newXY[0];
    newCoordinates[1] = newXY[1];
    return newCoordinates;
  }
}
