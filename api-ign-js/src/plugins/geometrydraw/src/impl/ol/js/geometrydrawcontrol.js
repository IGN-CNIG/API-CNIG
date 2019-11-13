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

          if (facadeControl.geometry === 'Point' &&
            facadeControl.feature.getStyle().get('fill.opacity') === 0) {
            document.querySelector('.m-geometrydraw').appendChild(facadeControl.textDrawTemplate);
            document.querySelector('.m-geometrydraw>#textdrawtools button').style.display = 'block';
            // document.querySelector('.m-geometrydraw>#textdrawtools>button')
            // .style.display = 'block';
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
        // eslint-disable-next-line no-underscore-dangle
        // facadeControl.feature = M.impl.Feature
        // .olFeature2Facade(evt.target.features_.getArray()[0]);
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

      if (this.facadeControl.geometry === 'Point' &&
        this.facadeControl.feature &&
        this.facadeControl.feature.getStyle().get('fill.opacity') === 0) {
        const newFont = `${this.facadeControl.fontSize}px ${this.facadeControl.fontFamily}`;
        this.facadeControl.feature.getStyle().set('label.font', newFont);
      }

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
    let features = new ol.format.GeoJSON()
      .readFeatures(source2, { featureProjection: this.facadeMap_.getProjection().code });
    features.forEach((feature) => {
      const style1 = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#0000FF', width: 8 }),
        fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.2)' }),
      });
      const style2 = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
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
    features = this.convertToMFeature_(features);
    this.facadeControl.drawLayer.addFeatures(features);
    // this.createLayer_(layerName, features);
    return features;
  }

  loadKMLLayer(layerName, source, extractStyles) {
    let features = new ol.format.KML({ extractStyles })
      .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });
    features.forEach((feature) => {
      const style1 = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#0000FF', width: 8 }),
        fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.2)' }),
      });
      const style2 = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
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
    features = this.convertToMFeature_(features);
    this.facadeControl.drawLayer.addFeatures(features);
    // this.createLayer_(layerName, features);
    return features;
  }

  loadGPXLayer(layerName, source) {
    let features = new ol.format.GPX()
      .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });
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
    features = this.convertToMFeature_(features);
    this.facadeControl.drawLayer.addFeatures(features);
    // this.createLayer_(layerName, features);
    return features;
  }

  // createLayer_(layerName, features) {
  //   const layer = new M.layer.Vector({
  //     name: layerName,
  //   }, { displayInLayerSwitcher: true });
  //   layer.addFeatures(features);
  //   this.facadeMap_.addLayers(layer);
  //   layer.getImpl().getOL3Layer().set('vendor.mapaalacarta.selectable', true);
  // }

  centerFeatures(features) {
    if (!M.utils.isNullOrEmpty(features)) {
      const extent = M.impl.utils.getFeaturesExtent(features);
      this.facadeMap_.getMapImpl().getView().fit(extent, {
        duration: 500,
        minResolution: 1,
      });
    }
  }

  convertToMFeature_(features) {
    if (features instanceof Array) {
      return features.map((olFeature) => {
        const feature = new M.Feature(olFeature.getId(), {
          geometry: {
            coordinates: olFeature.getGeometry().getCoordinates(),
            type: olFeature.getGeometry().getType(),
          },
          properties: olFeature.getProperties(),
        });
        feature.getImpl().getOLFeature().setStyle(olFeature.getStyle());
        return feature;
      });
    }
    return false;
  }
}
