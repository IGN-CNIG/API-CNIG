// import EditionTools from
/**
 * @namespace M.impl.control
 */
export default class DeleteFeatureImpl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a ModifyFeature
   * control
   *
   * @constructor
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor() {
    super();
    this.select = null;
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
      layers: (layer) => {
        return (layer.get('vendor.mapaalacarta.selectable') != null && layer.get('vendor.mapaalacarta.selectable') == true);
      },
      filter(feature, layer) {
        layer.getSource().removeFeature(feature);
        return true;
      },
    });
    this.select.on('select', (e) => {
      this.facadeMap_.getLayers().filter((layer) => {
        return layer.getImpl().getOL3Layer() !== null && layer.getImpl().getOL3Layer().get('vendor.mapaalacarta.selectable') != null && layer.getImpl().getOL3Layer().get('vendor.mapaalacarta.selectable') == true;
      }).forEach((layer) => {
        layer.getFeatures().forEach((feature) => {
          if (feature.getId() === e.target.getFeatures().getArray()[0].getId()) {
            layer.removeFeatures(feature);
          }
        });
      });
      this.select.getFeatures().clear();
    });
    olMap.addInteraction(this.select);
  }

  deleteOnClickEvent() {
    this.facadeMap_.getMapImpl().removeInteraction(this.select);
  }
}
