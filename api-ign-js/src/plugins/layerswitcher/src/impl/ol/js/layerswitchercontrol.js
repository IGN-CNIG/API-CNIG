/**
 * @module M/impl/control/LayerswitcherControl
 */
export default class LayerswitcherControl extends M.impl.Control {
  /**
   * Esta función añade el control al mapa
   *
   * @public
   * @function
   * @param {M.Map} map mapa al que añadir el control
   * @param {HTMLElement} html html del control
   * @api stable
   */
  addTo(map, html) {
    this.facadeMap_ = map;
    super.addTo(map, html);
  }

  /**
   * Registra evento rendercomplete del mapa para renderizar el control
   *
   * @param {M.Map} map mapa al que añadir el control
   * @public
   * @function
   */
  registerEvent(map) {
    this.facadeMap_ = map;
    this.fnRender = this.renderControl.bind(this);
    if (!M.utils.isNullOrEmpty(map)) {
      this.olMap = map.getMapImpl();
      this.olMap.on('rendercomplete', this.fnRender);
    }
  }

  /**
   * Renderiza el control
   *
   * @public
   * @function
   */
  renderControl() {
    this.facadeControl.render();
  }

  /**
   * Elimina evento rendercomplete del mapa
   *
   * @public
   * @function
   */
  removeRenderComplete() {
    if (!M.utils.isNullOrEmpty(this.olMap)) {
      this.olMap.un('rendercomplete', this.fnRender);
      this.fnRender = null;
    }
  }
}
