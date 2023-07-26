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
    this.firstRender_ = true;
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
      this.olMap = map.getMapImpl();
      this.olMap.on('rendercomplete', () => this.fistRenderComplete.bind(this));

      this.registerViewEvents_(this.olMap.getView());
      this.registerLayersEvents_(this.olMap.getLayers());
      this.olMap.on('change:view', () => this.onViewChange_.bind(this));
    }
  }

  fistRenderComplete() {
    if (this.firstRender_) {
      this.facadeControl.render();
      this.firstRender_ = false;
    } else {
      this.removeFistRenderComplete();
    }
  }

  removeFistRenderComplete() {
    this.olMap.un('rendercomplete', () => this.fistRenderComplete.bind(this));
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
      this.unregisterViewEvents_(this.olMap.getView());
      this.unregisterLayersEvents_(this.olMap.getLayers());
      this.olMap.un('change:view', () => this.onViewChange_.bind(this));
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
    this.registerViewEvents_(this.olMap.getView());
  }
}
