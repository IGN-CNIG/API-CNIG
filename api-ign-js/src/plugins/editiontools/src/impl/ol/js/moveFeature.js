/**
 * @namespace M.impl.control
 */
export default class MoveFeatureImpl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a ModifyFeature
   * control
   *
   * @constructor
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor(features, plugin) {
    super();

    this.features = features;
    /**
     * Interaction modify
     * @public
     * @type {ol.interaction.Select}
     * @api stable
     */
    this.plugin = plugin;
    this.modify = null;
    this.currentFeature_ = null;
  }

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.feature = null;
    this.currentFeature_ = null;
    this.modify = null;
  }
  /**
   * This function adds the event singleclick to the specified map
   *
   * @private
   * @function
   */
  addOnClickEvent() {
    const olMap = this.facadeMap_.getMapImpl();
    this.modify = new ol.interaction.Translate({
      features: this.features,
      layers: (layer) => {
        return (layer.get('vendor.mapaalacarta.selectable') != null && layer.get('vendor.mapaalacarta.selectable') == true);
      },
    });
    this.modify.on('translateend', (event) => {
      if (event.features.getArray().length > 0) {
        this.plugin.feature = event.features.getArray()[0];
        if (this.plugin.feature.getStyle() != null && this.plugin.feature.getStyle().length > 1) {
          this.plugin.feature.getStyle()[1].setGeometry(new ol.geom.Point(this.plugin.feature.getGeometry().getCoordinates()[this.plugin.feature.getGeometry().getCoordinates().length - 1]));
          this.plugin.feature.changed();
        }
        this.plugin.changeSquare(event.features.getArray()[0]);
      }
    });
    olMap.addInteraction(this.modify);
  }

  deleteOnClickEvent() {
    this.facadeMap_.getMapImpl().removeInteraction(this.modify);
  }
}
