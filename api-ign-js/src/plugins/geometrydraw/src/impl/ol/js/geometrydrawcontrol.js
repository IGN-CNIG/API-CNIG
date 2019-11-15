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

  /* SELECTION METHODS */

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
        // TODO: opacity 0 on this.feature
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
   * Creates GML string with Open Layers features.
   * @public
   * @function
   * @api
   * @param {*} options - object with features, projection and metadata.
   */
  getGML(options) {
    const gmlFormat = new ol.format.GML3();
    const gmlFeatures = gmlFormat.writeFeatures(options.olFeatures, {
      featureProjection: options.epsg,
      featureNS: options.featureNS,
      featureType: options.featureType,
    });
    return gmlFeatures;
  }

  /**
   * Gets feature coordinates
   * @public
   * @function
   * @api
   * @param {*} olFeature - Open Layers feature
   */
  getFeatureCoordinates(olFeature) {
    return olFeature.getGeometry().getCoordinates();
  }

  /**
   * Gets feature length
   * @public
   * @function
   * @api
   * @param {*} olFeature - Open Layers feature
   */
  getFeatureLength(olFeature) {
    return olFeature.getGeometry().getLength();
  }

  /**
   * Gets feature area
   * @public
   * @function
   * @api
   * @param {*} olFeature - Open Layers feature
   */
  getFeatureArea(olFeature) {
    return olFeature.getGeometry().getArea();
  }

  loadGeoJSONLayer(layerName, source2) {
    // FIXME: delete layer attributes before loading
    let features = new ol.format.GeoJSON()
      .readFeatures(source2, { featureProjection: this.facadeMap_.getProjection().code });

    // FIXME: set style to features

    features.map((feature) => {
      return M.impl.Feature.olFeature2Facade(feature);
    });
    features = this.facadeControl.deleteFeatureAttributes(features);
    this.facadeControl.drawLayer.addFeatures(features);
    return features;
  }

  loadKMLLayer(layerName, source, extractStyles) {
    let features = new ol.format.KML({ extractStyles })
      .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });

    const simpleFeatures = [];

    features.map((feature) => {
      return M.impl.Feature.olFeature2Facade(feature);
    });

    features = this.facadeControl.deleteFeatureAttributes(features);
    // TODO: Turn multigeometries into simple geometries
    const geojsonLayer = {
      type: 'FeatureCollection',
      features: [],
    };
    // const newGeojsonLayer = this.facadeControl.turnMultiGeometriesSimple(geojsonLayer);
    features.forEach((feature) => {
      geojsonLayer.features.push(feature.getGeoJSON());
    });

    const simpleGeojsonLayer = this.facadeControl.turnMultiGeometriesSimple(geojsonLayer);

    simpleGeojsonLayer.features.forEach((jsonFeature) => {
      const f = new M.Feature(`myFeature${simpleGeojsonLayer.features.indexOf(jsonFeature)}`);
      simpleFeatures.push(f);
    });

    simpleFeatures.forEach((feature) => {
      this.facadeControl.setFeatureStyle(feature, feature.getGeometry().type);
    });

    this.facadeControl.drawLayer.addFeatures(simpleFeatures);
    return simpleFeatures;
  }

  loadGPXLayer(layerName, source) {
    // FIXME: delete layer attributes before loading
    let features = new ol.format.GPX()
      .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });
    // FIXME: add default style to features

    features.forEach((feature) => {
      const style1 = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#0000FF', width: 8 }),
        fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.2)' }),
      });
      const style2 = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 24,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 2,
          }),
          fill: new ol.style.Fill({
            color: '#7CFC00',
          }),
        }),
      });

      if (feature.getGeometry().getType() !== 'Point' && feature.getGeometry().getType() !== 'MultiPoint') {
        feature.setStyle(style1);
      } else {
        feature.setStyle(style2);
      }
    });

    features.map((feature) => {
      return M.impl.Feature.olFeature2Facade(feature);
    });

    features = this.facadeControl.deleteFeatureAttributes(features);
    this.facadeControl.drawLayer.addFeatures(features);
    return features;
  }

  centerFeatures(features) {
    if (!M.utils.isNullOrEmpty(features)) {
      const extent = M.impl.utils.getFeaturesExtent(features);
      this.facadeMap_.getMapImpl().getView().fit(extent, {
        duration: 500,
        minResolution: 1,
      });
    }
  }

  // FIXME: To delete if layer upload is working
  // convertToMFeature_(features) {
  //   if (features instanceof Array) {
  //     return features.map((olFeature) => {
  //       const feature = new M.Feature(olFeature.getId(), {
  //         geometry: {
  //           coordinates: olFeature.getGeometry().getCoordinates(),
  //           type: olFeature.getGeometry().getType(),
  //         },
  //         properties: olFeature.getProperties(),
  //       });
  //       feature.getImpl().getOLFeature().setStyle(olFeature.getStyle());
  //       return feature;
  //     });
  //   }
  //   return false;
  // }
}
