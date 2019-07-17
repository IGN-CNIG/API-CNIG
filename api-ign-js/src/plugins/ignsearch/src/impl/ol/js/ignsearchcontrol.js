/**
 * @module M/impl/control/IGNSearchControl
 */
export default class IGNSearchControl extends M.impl.Control {
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
   * This function reprojects given coordinates to given projection.
   * @private
   * @function
   * @param { Array <number> } coordinates - [x,y]
   * @param { string } source - 'EPSG:4326'
   * @param { string } destiny - 'EPSG:4326'
   */
  reproject(coordinates, source, destiny) {
    const transformFunc = ol.proj.getTransform(source, destiny);
    return transformFunc(coordinates);
  }
}
