/**
 * @module M/impl/control/QueryDatabaseControl
 */
export default class QueryDatabaseControl extends M.impl.Control {
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
    this.facadeMap = map;
    /**
     * OL vector source for draw interactions.
     * @private
     * @type {*} - OpenLayers vector source
     */
    this.vectorSource = undefined;
  }

  setSource() {
    this.vectorSource = this.newVectorSource(false);
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

  getPolygonFromExtent(extent) {
    const geom = ol.geom.Polygon.fromExtent(extent);
    const feature = new M.Feature('featurebbox.1', {
      geometry: {
        coordinates: geom.getCoordinates(),
        type: geom.getType(),
      },
      properties: [],
    });

    return feature;
  }

  getLayerExtent(layer) {
    return layer.getImpl().getOL3Layer().getSource().getExtent();
  }

  getGeomExtent(geom, coordinates) {
    let ext = null;
    if (geom === 'multipoint') {
      ext = new ol.geom.MultiPoint(coordinates).getExtent();
    } else if (geom === 'point') {
      ext = new ol.geom.Point(coordinates).getExtent();
    } else if (geom === 'multipolygon') {
      ext = new ol.geom.MultiPolygon(coordinates).getExtent();
    } else if (geom === 'polygon') {
      ext = new ol.geom.Polygon(coordinates).getExtent();
    } else if (geom === 'multilinestring') {
      ext = new ol.geom.MultiLineString(coordinates).getExtent();
    } else if (geom === 'linestring') {
      ext = new ol.geom.LineString(coordinates).getExtent();
    }

    return ext;
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
   * Given a coordinate set (x, y, altitude?), returns [x,y].
   * @public
   * @function
   * @api
   * @param {Array<Number>} coordinatesSet
   */
  getXY(coordinatesSet) {
    const coordinateCopy = [];
    for (let i = 0; i < coordinatesSet.length; i += 1) coordinateCopy.push(coordinatesSet[i]);
    while (coordinateCopy.length > 2) coordinateCopy.pop();
    return coordinateCopy;
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
