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
    this.firstRender_ = true;
    super.addTo(map, html);
  }

  /**
   * Registra los eventos del mapa y capas para renderizar el control
   *
   * @param {M.Map} map mapa al que añadir el control
   * @public
   * @function
   */
  registerEvents(map) {
    if (!M.utils.isNullOrEmpty(map)) {
      this.olMap = map.getMapImpl();
      // la primera vez que se renderiza el mapa se renderiza el control
      this.olMap.on('rendercomplete', () => this.fistRenderComplete_.bind(this));
      // registra eventos de la vista
      this.registerViewEvents_(this.olMap.getView());
      // registra eventos de las capas
      this.registerLayersEvents_(this.olMap.getLayers());
    }
  }

  /**
   * Renderiza el plugin la primera vez que renderiza el mapa
   *
   * @private
   * @function
   */
  fistRenderComplete_() {
    if (this.firstRender_) {
      this.facadeControl.render();
      this.firstRender_ = false;
    } else {
      this.removeFistRenderComplete();
    }
  }

  /**
   * Elimina el evento de rendercomplete
   *
   * @private
   * @function
   */
  removeFistRenderComplete() {
    this.olMap.un('rendercomplete', () => this.fistRenderComplete_.bind(this));
  }

  /**
   * Elimina los eventos de vista y capas
   *
   * @public
   * @function
   */
  unregisterEvents() {
    if (!M.utils.isNullOrEmpty(this.facadeMap_)) {
      this.unregisterViewEvents_(this.olMap.getView());
      this.unregisterLayersEvents_(this.olMap.getLayers());
      this.olMap.un('change:view', () => this.onViewChange_.bind(this));
    }
  }

  /**
   * Registra eventos de la vista
   *
   * @private
   * @function
   */
  registerViewEvents_(view) {
    view.on('change:resolution', () => this.facadeControl.render());
    this.olMap.on('change:view', () => this.onViewChange_.bind(this));
  }

  /**
   * Registra eventos de las capas
   *
   * @private
   * @function
   */
  registerLayersEvents_(layers) {
    layers.forEach(this.registerLayerEvents_.bind(this));
  }

  /**
   * Registra eventos de la capa
   *
   * @private
   * @function
   */
  registerLayerEvents_(layer) {
    layer.on('change:visible', () => this.facadeControl.render());
    layer.on('change:extent', () => this.facadeControl.render());
  }

  /**
   * Elimina eventos de la vista
   *
   * @private
   * @function
   */
  unregisterViewEvents_(view) {
    view.un('change:resolution', () => this.facadeControl.render());
  }

  /**
   * Elimina eventos de las capas
   *
   * @private
   * @function
   */
  unregisterLayersEvents_(layers) {
    layers.forEach(this.unregisterLayerEvents_.bind(this));
  }

  /**
   * Elimina eventos de la capa
   *
   * @private
   * @function
   */
  unregisterLayerEvents_(layer) {
    layer.un('change:visible', () => this.facadeControl.render());
    layer.un('change:extent', () => this.facadeControl.render());
  }

  /**
   * Cuando la vista cambia
   *
   * @private
   * @function
   */
  onViewChange_(evt) {
    // removes listener from previous view
    this.unregisterViewEvents_(evt.oldValue);

    // attaches listeners to the new view
    this.registerViewEvents_(this.olMap.getView());
  }
}
