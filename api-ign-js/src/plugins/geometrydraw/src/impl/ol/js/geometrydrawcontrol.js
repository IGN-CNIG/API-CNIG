/**
 * @module M/impl/control/GeometryDrawControl
 */
export default class GeometryDrawControl extends M.impl.Control {
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    super.addTo(map, html);
    this.facadeMap_ = map;
  }

  /**
   * Creates new OpenLayers vector source
   * @public
   * @function
   * @api
   * @param {Boolean} featuresIncluded - indicates if an OL collection of
   * features should be included in new source
   */
  newVectorSource(featuresIncluded) {
    return featuresIncluded ?
      new ol.source.Vector({ features: new ol.Collection([]) }) :
      new ol.source.Vector();
  }

  /**
   * Creates new OpenLayers draw interaction
   * @public
   * @function
   * @api
   * @param {OLVectorSource} vectorSource -
   * @param {String} geometry - type of geometry ['Point', 'LineString', 'Polygon']
   */
  newDrawInteraction(vectorSource, geometry) {
    return new ol.interaction.Draw({
      source: vectorSource,
      type: geometry,
    });
  }

  /**
   * Creates polygon feature from extent.
   * @public
   * @function
   * @api
   * @param {Array} extent - geometry extent
   */
  newPolygonFeature(extent) {
    return new ol.Feature({ geometry: ol.geom.Polygon.fromExtent(extent) });
  }

  /**
   * Creates polygon feature from vertices.
   * @public
   * @function
   * @api
   * @param {Array} extent - geometry extent
   */
  newDrawnPolygonFeature(vertices) {
    return new ol.Feature({ geometry: ol.geom.Polygon(vertices) });
  }

  /**
   * Sets vector source for layer
   * @public
   * @function
   * @param {M.Layer} layer - Mapea layer
   * @param {*} source - OL source
   * @api
   */
  setImplSource(layer, source) {
    layer.getImpl().getOL3Layer().setSource(source);
  }

  /**
   * Creates feature clone.
   * @public
   * @function
   * @api
   * @param {OL.Feature} olFeature
   */
  getImplFeatureClone(olFeature) {
    return olFeature.clone();
  }

  /**
   * Defines function to be executed on click on draw interaction.
   * Creates feature with drawing and adds it to map.
   * @public
   * @function
   * @api
   */
  addDrawEvent() {
    this.facadeControl.draw.on('drawend', (event) => {
      this.facadeControl.onDraw(event);
    });
  }

  /**
   * Activates selection mode.
   * @public
   * @function
   * @api
   */
  activateSelection() {
    const olMap = this.facadeMap_.getMapImpl();
    const facadeControl = this.facadeControl;
    const drawingLayer = facadeControl.drawLayer.getImpl().getOL3Layer();

    this.facadeControl.hideTextPoint();

    if (document.querySelector('.m-geometrydraw>#downloadFormat') !== null) {
      document.querySelector('.m-geometrydraw').removeChild(facadeControl.downloadingTemplate);
    }

    if (drawingLayer) {
      this.select = new ol.interaction.Select({
        wrapX: false,
        layers: [drawingLayer],
      });

      this.select.on('select', (e) => {
        if (e.target.getFeatures().getArray().length > 0) {
          this.facadeControl.onSelect(e);
        }
      });

      olMap.addInteraction(this.select);

      this.edit = new ol.interaction.Modify({ features: this.select.getFeatures() });
      this.edit.on('modifyend', (evt) => {
        this.facadeControl.onModify();
      });
      olMap.addInteraction(this.edit);
    }
  }

  /**
   * Loads GeoJSON layer
   * @public
   * @function
   * @param {*} source2 -
   */
  loadGeoJSONLayer(source2) {
    let features = new ol.format.GeoJSON()
      .readFeatures(source2, { featureProjection: this.facadeMap_.getProjection().code });

    features = this.featuresToFacade(features);
    return this.facadeControl.featuresLoader(features);
  }

  /**
   * Loads KML layer
   * @public
   * @function
   * @api
   * @param {*} source -
   * @param {*} extractStyles -
   */
  loadKMLLayer(source, extractStyles) {
    let features = new ol.format.KML({ extractStyles })
      .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });

    features = this.featuresToFacade(features);

    // Parses GeometryCollection KML
    features = this.facadeControl.geometryCollectionParse(features);

    return this.facadeControl.featuresLoader(features);
  }

  /**
   * Loads GPX layer.
   * @public
   * @function
   * @api
   * @param {*} source -
   */
  loadGPXLayer(source) {
    let features = new ol.format.GPX()
      .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });

    features = this.featuresToFacade(features);
    return this.facadeControl.featuresLoader(features);
  }

  /**
   * Converts Openlayers features to Mapea features.
   * @public
   * @function
   * @api
   * @param {Array<OL.Feature>} implFeatures
   * @returns {Array<M.Feature>}
   */
  featuresToFacade(implFeatures) {
    return implFeatures.map((feature) => {
      return M.impl.Feature.olFeature2Facade(feature);
    });
  }

  /**
   * Centers on features
   * @public
   * @function
   * @api
   * @param {*} features -
   */
  centerFeatures(features) {
    if (!M.utils.isNullOrEmpty(features)) {
      if ((features.length === 1) && (features[0].getGeometry().type === 'Point')) {
        const pointView = new ol.View({
          center: features[0].getGeometry().coordinates,
          zoom: 15,
        });
        this.facadeMap_.getMapImpl().setView(pointView);
      } else {
        const extent = M.impl.utils.getFeaturesExtent(features);
        this.facadeMap_.getMapImpl().getView().fit(extent, {
          duration: 500,
          minResolution: 1,
        });
      }
    }
  }

  /**
   * Gets extent of feature
   * @public
   * @function
   * @api
   * @param {M.Featuer} mapeaFeature
   */
  getFeatureExtent(mapeaFeature) {
    // eslint-disable-next-line no-underscore-dangle
    return mapeaFeature.getImpl().olFeature_.getGeometry().getExtent();
  }

  /**
   * Gets feature coordinates
   * @public
   * @function
   * @api
   * @param { OL.Feature } olFeature
   */
  getFeatureCoordinates(olFeature) {
    return olFeature.getGeometry().getCoordinates();
  }

  /**
   * Gets feature length
   * @public
   * @function
   * @api
   * @param {OL.Feature} olFeature
   */
  getFeatureLength(olFeature) {
    return olFeature.getGeometry().getLength();
  }

  /**
   * Gets feature area
   * @public
   * @function
   * @api
   * @param { OL.Feature } olFeature
   */
  getFeatureArea(olFeature) {
    return olFeature.getGeometry().getArea();
  }
}
