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

    if (drawingLayer) {
      this.select = new ol.interaction.Select({
        wrapX: false,
        layers: [drawingLayer],
      });
      this.select.on('select', (e) => {
        if (e.target.getFeatures().getArray().length > 0) {
          facadeControl.feature = M.impl.Feature
            .olFeature2Facade(e.target.getFeatures().getArray()[0]);
          facadeControl.changeSquare();
          facadeControl.geometry = facadeControl.feature.getGeometry().type;
          document.querySelector('.m-geometrydraw').appendChild(facadeControl.drawingTools);
        }
      });
      olMap.addInteraction(this.select);

      this.edit = new ol.interaction.Modify({ features: this.select.getFeatures() });
      this.edit.on('modifyend', (evt) => {
        // eslint-disable-next-line no-underscore-dangle
        facadeControl.feature = M.impl.Feature.olFeature2Facade(evt.target.features_.getArray()[0]);
        facadeControl.changeSquare();
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

  /**
   * Sets OpenLayers style on Mapea feature
   * @public
   * @function
   * @param {*} Mfeature - Mapea feature
   * @param {*} OLstyle - Open Layers style
   * @api
   */
  setOLStyleToMFeature(Mfeature, OLstyle) {
    // eslint-disable-next-line no-underscore-dangle
    const olFeature = Mfeature.getImpl().olFeature_;
    olFeature.setStyle(OLstyle);
    return M.impl.Feature.olFeature2Facade(olFeature);
  }

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
