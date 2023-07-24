/**
 * @module M/impl/control/LayerswitcherControl
 */
export default class LayerswitcherControl extends M.impl.Control {
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
    this.facadeMap_ = map;
    super.addTo(map, html);
  }

  /**
   * Registers events on map and layers to render the
   * fulltoc
   *
   * @public
   * @function
   * @api stable
   */
  registerEvents(map) {
    if (!M.utils.isNullOrEmpty(map)) {
      const olMap = map.getMapImpl();
      olMap.on('rendercomplete', () => {
        this.facadeControl.render();
      });
      this.registerViewEvents_(olMap.getView());
      this.registerLayersEvents_(olMap.getLayers());
      olMap.on('change:view', () => this.onViewChange_.bind(this));
    }
  }

  /**
   * Unegisters events for map and layers from the fulltoc
   *
   * @public
   * @function
   * @api stable
   */
  unregisterEvents() {
    if (!M.utils.isNullOrEmpty(this.facadeMap_)) {
      const olMap = this.facadeMap_.getMapImpl();
      this.unregisterViewEvents_(olMap.getView());
      this.unregisterLayersEvents_(olMap.getLayers());
      olMap.un('change:view', () => this.onViewChange_.bind(this));
    }
  }

  /**
   *
   */
  registerViewEvents_(view) {
    view.on('change:resolution', () => this.facadeControl.render());
  }

  /**
   *
   */
  registerLayersEvents_(layers) {
    layers.forEach(this.registerLayerEvents_.bind(this));
  }

  registerLayerEvents_(layer) {
    layer.on('change:visible', () => this.facadeControl.render());
    layer.on('change:extent', () => this.facadeControl.render());
  }

  unregisterViewEvents_(view) {
    view.un('change:resolution', () => this.facadeControl.render());
  }

  /**
   *
   */
  unregisterLayersEvents_(layers) {
    layers.forEach(this.unregisterLayerEvents_.bind(this));
  }

  /**
   *
   */
  unregisterLayerEvents_(layer) {
    layer.un('change:visible', () => this.facadeControl.render());
    layer.un('change:extent', () => this.facadeControl.render());
  }

  onViewChange_(evt) {
    // removes listener from previous view
    this.unregisterViewEvents_(evt.oldValue);

    // attaches listeners to the new view
    const olMap = this.facadeMap_.getMapImpl();
    this.registerViewEvents_(olMap.getView());
  }
}
