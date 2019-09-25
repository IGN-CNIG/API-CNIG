/**
 * @namespace M.impl.control
 */
export default class EditFeatureImpl extends M.impl.Control {
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
    this.select = null;
    this.edit = null;
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
    this.edit = null;
  }
  /**
   * This function adds the event singleclick to the specified map
   *
   * @private
   * @function
   */
  addOnClickEvent() {
    const olMap = this.facadeMap_.getMapImpl();
    this.select = new ol.interaction.Select({
      wrapX: false,
      layers: (layer) => {
        return (layer.get('vendor.mapaalacarta.selectable') != null && layer.get('vendor.mapaalacarta.selectable') == true);
      },
    });
    this.select.on('select', (e) => {
      if (e.target.getFeatures().getArray().length > 0) {
        this.plugin.feature = e.target.getFeatures().getArray()[0];
        this.plugin.changeSquare(e.target.getFeatures().getArray()[0]);
      }
    });
    olMap.addInteraction(this.select);
    this.edit = new ol.interaction.Modify({ features: this.select.getFeatures() });
    this.edit.on('modifyend', (evt) => {
      this.plugin.feature = evt.target.features_.getArray()[0];
      if (this.plugin.feature.getStyle() != null && this.plugin.feature.getStyle().length > 1) {
        this.plugin.feature.getStyle()[1].setGeometry(new ol.geom.Point(this.plugin.feature.getGeometry().getCoordinates()[this.plugin.feature.getGeometry().getCoordinates().length - 1]));
        this.plugin.feature.changed();
      }
      this.plugin.changeSquare(evt.target.features_.getArray()[0]);
    });
    olMap.addInteraction(this.edit);
  }

  deleteOnClickEvent() {
    this.facadeMap_.getMapImpl().removeInteraction(this.edit);
    this.facadeMap_.getMapImpl().removeInteraction(this.select);
  }
}
