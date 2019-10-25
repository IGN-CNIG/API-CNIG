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

  newDrawnPolygonFeature(vertices) {
    return new ol.Feature({ geometry: ol.geom.Polygon(vertices) });
  }

  // /**
  //  * Clones feature
  //  * @public
  //  * @function
  //  * @param {Object} f - OL feature
  //  * @api
  //  */
  // cloneFeature(f) {
  //   return new ol.Feature(f);
  // }

  /**
   * Turns OpenLayers feature into Mapea feature.
   * @param {OpenLayers Feature} olFeature - recently drawn feature
   */
  OLToMapeaFeature(olFeature) {
    const feature = new M.Feature(olFeature.getId(), {
      geometry: {
        coordinates: olFeature.getGeometry().getCoordinates(),
        type: olFeature.getGeometry().getType(),
      },
      properties: olFeature.getProperties(),
    });
    feature.getImpl().getOLFeature().setStyle(olFeature.getStyle());
    return feature;
  }

  /**
   * Sets vector source for layer
   * @param {*} layer - Mapea layer
   * @param {*} source - OL source
   */
  setOLSource(layer, source) {
    layer.getImpl().getOL3Layer().setSource(source);
  }

  /* SELECTION METHODS */

  activateSelection() {
    const olMap = this.facadeMap_.getMapImpl();
    const facadeControl = this.facadeControl;
    const drawingLayer = facadeControl.drawLayer.getImpl().getOL3Layer();

    if (drawingLayer) {
      this.select = new ol.interaction.Select({
        wrapX: false,
        layers: [drawingLayer],
      });
      this.select.on('select', (e) => {
        if (e.target.getFeatures().getArray().length > 0) {
          this.facadeControl.feature = this.OLToMapeaFeature(e.target.getFeatures().getArray()[0]);
          this.facadeControl.changeSquare();
          document.querySelector('.m-geometrydraw').appendChild(this.facadeControl.drawingTools);
        }
      });
      olMap.addInteraction(this.select);

      this.edit = new ol.interaction.Modify({ features: this.select.getFeatures() });
      this.edit.on('modifyend', (evt) => {
        // eslint-disable-next-line no-underscore-dangle
        this.facadeControl.feature = this.OLToMapeaFeature(evt.target.features_.getArray()[0]);

        if (this.facadeControl.feature.getStyle() !== null &&
          this.facadeControl.feature.getStyle().length > 1) {
          this.facadeControl.feature.getStyle()[1].setGeometry(new ol.geom.Point(this.facadeControl
            .feature.getGeometry().getCoordinates()[this.facadeControl
              .feature.getGeometry().getCoordinates().length - 1]));
          this.facadeControl.feature.changed();
        }

        // eslint-disable-next-line no-underscore-dangle
        this.facadeControl.changeSquare();
      });
      olMap.addInteraction(this.edit);
    }
  }

  deactivateSelection() {
    if (this.facadeControl.drawLayer) {
      if (document.querySelector('.m-geometrydraw #drawingtools')) {
        document.querySelector('.m-geometrydraw').removeChild(this.facadeControl.drawingTools);
      }
      this.facadeControl.feature = undefined;
      this.facadeControl.changeSquare();
      this.facadeMap_.getMapImpl().removeInteraction(this.edit);
      this.facadeMap_.getMapImpl().removeInteraction(this.select);
    }
  }

  /** ***************************************************************************** */
  /* STYLE METHODS => FIXME: This should be translated into Mapea styles on facade */
  /** *************************************************************************** */

  /**
   * Creates new OpenLayers style
   * @public
   * @function
   * @api
   * @param {Object} options - colors and measures for the style
   */
  newOLStyle(options) {
    return new ol.style.Style({
      fill: new ol.style.Fill({ color: options.fillColor }),
      stroke: new ol.style.Stroke({ color: options.strokeColor, width: options.strokeWidth }),
      image: new ol.style.Circle({
        radius: options.circleRadius,
        fill: new ol.style.Fill({ color: options.circleFill }),
      }),
    });
  }

  /**
   * Creates new style for text feature.
   * @public
   * @function
   * @api
   * @param {Object} options - style colors and measures
   */
  newOLTextStyle(options) {
    return new ol.style.Style({
      text: new ol.style.Text({
        text: options.text,
        font: options.font,
        fill: new ol.style.Fill({ color: options.textFillColor }),
      }),
      stroke: new ol.style.Stroke({ color: options.defaultColor, width: options.strokeWidth }),
      fill: new ol.style.Fill({ color: options.defaultColor }),
    });
  }

  /**
   * Creates regular polygon style
   * @public
   * @function
   * @api
   * @param {Object} options - style colors and measures
   */
  newRegularShapeStyle(options) {
    return new ol.style.Style({
      image: new ol.style.RegularShape({
        stroke: new ol.style.Stroke({ color: options.strokeColor, width: options.strokeWidth }),
        points: options.points,
        radius: options.radius,
        rotation: options.rotation,
      }),
    });
  }

  setOLStyleToMFeature(Mfeature, OLstyle) {
    // eslint-disable-next-line no-underscore-dangle
    const olFeature = Mfeature.getImpl().olFeature_;
    olFeature.setStyle(OLstyle);
    return this.OLToMapeaFeature(olFeature);
  }
}
