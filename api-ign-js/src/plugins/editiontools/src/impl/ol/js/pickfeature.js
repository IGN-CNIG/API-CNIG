// import EditionTools from
/**
 * @namespace M.impl.control
 */
export default class PickFeatureImpl extends M.impl.Control {
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

    this.feature = null;
    /**
     * Interaction modify
     * @public
     * @type {ol.interaction.Select}
     * @api stable
     */
    this.select = null;
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
    this.select = null;
  }

  /**
   * This function adds the event singleclick to the specified map
   *
   * @private
   * @function
   */
  //
  // let styleSelect = new ol.style.Style({
  //   stroke: new ol.style.Stroke({color: '#ff0000', width: 2})
  // });
  // this.select = new ol.interaction.Select({
  //   style: styleSelect,
  //   filter: function (feature, layer) {
  //     this.feature = feature;
  //     this.layer = layer;
  //   }
  // });

  addOnClickEvent() {
    const olMap = this.facadeMap_.getMapImpl();
    const highlightStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({ color: '#ff0000', width: 2 }),
      fill: new ol.style.Fill({ color: '#ff0000', opacity: 0.4 }),
      zIndex: 1,
    });
    this.select = new ol.interaction.Select({
      style: highlightStyle,
      layers: (layer) => {
        return (layer.get('vendor.mapaalacarta.selectable') != null && layer.get('vendor.mapaalacarta.selectable') == true);
      },
    });
    olMap.addInteraction(this.select);
  }

  deleteOnClickEvent() {
    this.facadeMap_.getMapImpl().removeInteraction(this.select);
  }
}
