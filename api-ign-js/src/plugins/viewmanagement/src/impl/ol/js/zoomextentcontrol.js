/**
 * @module M/impl/control/ZoomExtentControl
 */

export default class ZoomExtentControl extends M.impl.Control {
  /**
   * This function create DragZoom interaction
   *
   * @public
   * @function
   * @param {M.Map} map Map
   * @api
   */
  createInteraction(map) {
    this.dragZoom = new ol.interaction.DragZoom({
      condition: () => true,
    });
    this.dragZoom.setActive(false);
    map.getMapImpl().addInteraction(this.dragZoom);
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @param {M.Map} map Map
   * @api
   */
  activateClick(map) {
    this.dragZoom.setActive(true);
  }

  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @param {M.Map} map Map
   * @api
   */
  deactivateClick(map) {
    this.dragZoom.setActive(false);
  }
}
