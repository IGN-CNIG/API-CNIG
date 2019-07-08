/**
 * @module M/impl/control/AttributionsControl
 */
export default class AttributionsControl extends M.impl.Control {
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
    const olMap = map.getMapImpl();
    olMap.getInteractions().forEach((interaction) => {
      if (interaction instanceof ol.interaction.DoubleClickZoom) {
        this.dblClickInteraction_ = interaction;
      }
    });
    // super addTo - don't delete
    super.addTo(map, html);
  }
}
