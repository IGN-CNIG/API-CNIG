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
   */
  newVectorSource() {
    return new ol.source.Vector();
  }

  /**
   * Creates new OpenLayers vector source with
   * OpenLayers collections as features
   */
  newVectorSourceWithCollectionFeatures() {
    return new ol.source.Vector({ features: new ol.Collection([]) });
  }

  /**
   * Creates new OpenLayers draw interaction
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
   * @param {*} options - k
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

  newOLTextStyle(text, font, textFillColor, defaultColor, strokeWidth) {
    return new ol.style.Style({
      text: new ol.style.Text({
        text,
        font,
        fill: new ol.style.Fill({ color: textFillColor }),
      }),
      stroke: new ol.style.Stroke({ color: defaultColor, width: strokeWidth }),
      fill: new ol.style.Fill({ color: defaultColor }),
    });
  }

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

  newPolygonFeature(extent) {
    return new ol.Feature({ geometry: ol.geom.Polygon.fromExtent(extent) });
  }

  newSquareStyle(color, width) {
    return new ol.style.Style({ stroke: new ol.style.Stroke({ color, width }) });
  }

  cloneFeature(f) {
    return new ol.Feature(f);
  }
}
