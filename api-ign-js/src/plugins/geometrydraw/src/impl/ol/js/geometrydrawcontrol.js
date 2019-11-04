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
          const MFeatures = this.facadeControl.drawLayer.getFeatures();
          const olFeature = e.target.getFeatures().getArray()[0];

          facadeControl.feature = MFeatures.filter(f => f.getImpl().getOLFeature() ===
            olFeature)[0] || undefined;

          document.querySelector('.m-geometrydraw').appendChild(facadeControl.drawingTools);
          document.querySelector('.m-geometrydraw>#drawingtools>button').style.display = 'block';
          facadeControl.updateInputValues();
          facadeControl.changeSquare();
          facadeControl.showFeatureInfo();
        }
      });
      olMap.addInteraction(this.select);

      this.edit = new ol.interaction.Modify({ features: this.select.getFeatures() });
      this.edit.on('modifyend', (evt) => {
        // eslint-disable-next-line no-underscore-dangle
        facadeControl.feature = M.impl.Feature.olFeature2Facade(evt.target.features_.getArray()[0]);
        facadeControl.changeSquare();
        facadeControl.showFeatureInfo();
      });
      olMap.addInteraction(this.edit);
    }
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

  deactivateSelection() {
    if (this.facadeControl.drawLayer) {
      if (document.querySelector('.m-geometrydraw #drawingtools')) {
        document.querySelector('.m-geometrydraw>#drawingtools>button').style.display = 'none';
        document.querySelector('.m-geometrydraw').removeChild(this.facadeControl.drawingTools);
      }
      this.facadeControl.feature = undefined;
      this.facadeControl.geometry = undefined;
      this.facadeControl.changeSquare();
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

  /** ***************************************************************************** */
  /* STYLE METHODS => FIXME: This should be translated into Mapea styles on facade */
  /** *************************************************************************** */

  // /**
  //  * Creates new style for text feature.
  //  * @public
  //  * @function
  //  * @api
  //  * @param {Object} options - style colors and measures
  //  */
  // newOLTextStyle(options) {
  //   return new ol.style.Style({
  //     text: new ol.style.Text({
  //       text: options.text,
  //       font: options.font,
  //       fill: new ol.style.Fill({ color: options.textFillColor }),
  //     }),
  //     stroke: new ol.style.Stroke({ color: options.defaultColor, width: options.strokeWidth }),
  //     fill: new ol.style.Fill({ color: options.defaultColor }),
  //   });
  // }
}
