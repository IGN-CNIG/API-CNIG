/**
 * @module M/impl/control/XYLocatorControl
 */
export default class XYLocatorControl extends M.impl.Control {
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api
   */
  addTo(map, html) {
    this.map = map;
    super.addTo(map, html);
  }

  /**
   * This function sets a new scale to the map.
   * @private
   * @function
   */
  setScale(scale) {
    const dpiToCM = M.units.DOTS_PER_INCH / 2.54;
    const resolution = (scale / dpiToCM) / 100;
    const olMap = this.facadeMap_.getMapImpl();
    const olView = olMap.getView();
    olView.setResolution(resolution);
  }

  /**
   * This function reprojects map on selected SRS.
   *
   * @function
   * @param {string} origin - EPSG:25830, EPSG:4326, ..., etc
   * @param {array<number>} coordinates
   * @api
   */
  reproject(origin, coordinates) {
    const originProj = ol.proj.get(origin);
    const destProj = ol.proj.get(this.map.getProjection().code);
    const coordinatesTransform = ol.proj.transform(coordinates, originProj, destProj);
    return coordinatesTransform;
  }
}
