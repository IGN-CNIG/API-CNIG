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
  setOLSource(layer, source) {
    layer.getImpl().getOL3Layer().setSource(source);
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
          const MFeatures = facadeControl.drawLayer.getFeatures();
          const olFeature = e.target.getFeatures().getArray()[0];

          facadeControl.feature = MFeatures.filter(f => f.getImpl().getOLFeature() ===
            olFeature)[0] || undefined;

          facadeControl.geometry = facadeControl.feature.getGeometry().type;

          if (document.querySelector('.m-geometrydraw #drawingtools') !== null) {
            document.querySelector('.m-geometrydraw').removeChild(facadeControl.drawingTools);
          } else if (document.querySelector('.m-geometrydraw #textdrawtools') !== null) {
            document.querySelector('.m-geometrydraw').removeChild(facadeControl.textDrawTemplate);
          }

          // if selected feature is a text feature
          if (facadeControl.geometry === 'Point' &&
            facadeControl.feature.getStyle().get('label') !== undefined) {
            document.querySelector('.m-geometrydraw').appendChild(facadeControl.textDrawTemplate);
            document.querySelector('.m-geometrydraw>#textdrawtools button').style.display = 'block';
          } else {
            document.querySelector('.m-geometrydraw').appendChild(facadeControl.drawingTools);
            document.querySelector('.m-geometrydraw>#drawingtools button').style.display = 'block';
          }

          facadeControl.updateInputValues();
          facadeControl.emphasizeSelectedFeature();
          facadeControl.showFeatureInfo();
        }
      });

      olMap.addInteraction(this.select);

      this.edit = new ol.interaction.Modify({ features: this.select.getFeatures() });
      this.edit.on('modifyend', (evt) => {
        facadeControl.emphasizeSelectedFeature();
        facadeControl.showFeatureInfo();
      });
      olMap.addInteraction(this.edit);
    }
  }

  /**
   * Deactivates selection mode.
   * @public
   * @function
   * @api
   */
  deactivateSelection() {
    if (this.facadeControl.drawLayer) {
      if (document.querySelector('.m-geometrydraw #drawingtools')) {
        document.querySelector('.m-geometrydraw>#drawingtools button').style.display = 'none';
        document.querySelector('.m-geometrydraw').removeChild(this.facadeControl.drawingTools);
      }
      if (document.querySelector('.m-geometrydraw #textdrawtools')) {
        document.querySelector('.m-geometrydraw>#textdrawtools button').style.display = 'none';
        document.querySelector('.m-geometrydraw').removeChild(this.facadeControl.textDrawTemplate);
      }

      this.facadeControl.hideTextPoint();
      this.facadeControl.feature = undefined;
      this.facadeControl.geometry = undefined;
      this.facadeControl.emphasizeSelectedFeature();
      this.facadeMap_.getMapImpl().removeInteraction(this.edit);
      this.facadeMap_.getMapImpl().removeInteraction(this.select);
    }
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

  /**
   * Loads GeoJSON layer
   * @public
   * @function
   * @param {*} source2 -
   */
  loadGeoJSONLayer(source2) {
    let features = new ol.format.GeoJSON()
      .readFeatures(source2, { featureProjection: this.facadeMap_.getProjection().code });

    features = features.map((feature) => {
      return M.impl.Feature.olFeature2Facade(feature);
    });

    features = this.facadeControl.deleteFeatureAttributes(features);

    for (let i = 0; i < features.length; i += 1) {
      this.facadeControl.setFeatureStyle(features[i], features[i].getGeometry().type);
    }

    this.facadeControl.drawLayer.addFeatures(features);
    return features;
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

    features = features.map((feature) => {
      return M.impl.Feature.olFeature2Facade(feature);
    });

    // Parses GeometryCollection KML
    features = this.facadeControl.geometryCollectionParse(features);

    // Avoids future conflicts if different layers are loaded
    features = this.facadeControl.deleteFeatureAttributes(features);

    // Sets features style
    for (let i = 0; i < features.length; i += 1) {
      this.facadeControl.setFeatureStyle(features[i], features[i].getGeometry().type);
    }

    this.facadeControl.drawLayer.addFeatures(features);
    return features;
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

    features = features.map((feature) => {
      return M.impl.Feature.olFeature2Facade(feature);
    });

    features = this.facadeControl.deleteFeatureAttributes(features);

    for (let i = 0; i < features.length; i += 1) {
      this.facadeControl.setFeatureStyle(features[i], features[i].getGeometry().type);
    }

    this.facadeControl.drawLayer.addFeatures(features);
    return features;
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
}
