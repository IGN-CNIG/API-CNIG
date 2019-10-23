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
  }

  /**
   * Creates new OpenLayers vector source
   * @public
   * @function
   * @api
   */
  newVectorSource() {
    return new ol.source.Vector();
  }

  /**
   * Creates new OpenLayers vector source with
   * OpenLayers collections as features
   * @public
   * @function
   * @api
   */
  newVectorSourceWithCollectionFeatures() {
    return new ol.source.Vector({ features: new ol.Collection([]) });
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
   * Creates new OpenLayers style for polygon
   * @public
   * @function
   * @api
   * @param {Object} options - colors and measures for the style
   */
  newPolygonStyle(options) {
    return new ol.style.Style({
      fill: new ol.style.Fill({ color: options.fillColor }),
      stroke: new ol.style.Stroke({ color: options.strokeColor, width: options.strokeWidth }),
    });
  }

  /**
   * Creates new style for circle points.
   * @public
   * @function
   * @api
   * @param {Object} options - colors and measures for the style
   */
  newOLCircleStyle(options) {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: options.radius,
        stroke: new ol.style.Stroke({
          color: options.strokeColor,
          width: options.strokeWidth,
        }),
        fill: new ol.style.Fill({
          color: options.fillColor,
        }),
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
   * @param {Object} options -
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

  /**
   * Creates OL style for simple line
   * (just color and width)
   * @public
   * @function
   * @api
   * @param {String} color - line color
   * @param {Number} width - line stroke width
   */
  newSimpleLineStyle(color, width) {
    return new ol.style.Style({ stroke: new ol.style.Stroke({ color, width }) });
  }

  /**
   * Clones feature
   * @public
   * @function
   * @param {Object} f - OL feature
   * @api
   */
  cloneFeature(f) {
    return new ol.Feature(f);
  }

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
}
