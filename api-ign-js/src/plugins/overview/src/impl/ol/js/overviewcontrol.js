/**
 * @module M/impl/control/OverviewControl
 */
export default class OverviewControl extends M.impl.Control {
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
   * Adds animation to zoom or center transition to new value on overview map.
   * @param {*} smallMapView - overview map impl view
   * @param {Array<Number>} newCenter - new center value for overview map
   * @param {Number} zoomChange - difference between previous and new zoom on main map
   */
  animateViewChange(smallMapView, newCenter, zoomChange) {
    smallMapView.animate({
      center: newCenter,
      zoom: smallMapView.getZoom() + zoomChange,
    });
  }
}
