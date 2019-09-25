// import EditionTools from
/**
 * @namespace M.impl.control
 */
export default class DrawFeatureImpl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a ModifyFeature
   * control
   *
   * @constructor
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor(geometry, vectorLayer, vectorSource, plugin) {
    super();

    this.vectorLayer = vectorLayer;
    this.geometry = geometry;
    this.vectorSource = vectorSource;
    this.plugin = plugin;

    /**
     * Interaction modify
     * @public
     * @type {ol.interaction.Select}
     * @api stable
     */
    this.draw = null;
    this.currentFeature_ = null;
    this.feature = null;
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
    this.vectorLayer.clear();
    this.geometry = null;
    this.currentFeature_ = null;
    this.draw = null;
  }
  /**
   * This function adds the event singleclick to the specified map
   *
   * @private
   * @function
   */
  addOnClickEvent() {
    const olMap = this.facadeMap_.getMapImpl();
    if (this.geometry != 'Text') {
      this.draw = new ol.interaction.Draw({
        source: this.vectorSource,
        type: this.geometry,
      });
      this.draw.on('drawend', (event) => {
        this.feature = event.feature;
        this.feature.setId('draw-' + this.plugin.numberOfDrawFeatures);
        this.feature.set('name', this.feature.getId());
        this.plugin.numberOfDrawFeatures += 1;
        const featureMapea = this.convertToMFeature_(this.feature);
        this.plugin.setFeature2(featureMapea.getImpl().getOLFeature());
      });
    } else {
      this.draw = new ol.interaction.Draw({ source: this.vectorSource, type: 'Point' });
      this.draw.on('drawend', (event) => {
        const feature = event.feature;
        this.setContent_(feature);
      });
    }
    olMap.addInteraction(this.draw);
  }

  setContent_(feature) {
    feature.setStyle(new ol.style.Style({
      text: new ol.style.Text({
        text: 'Texto',
        font: '12px Arial',
        fill: new ol.style.Fill({ color: '#000000' }),
      }),
      stroke: new ol.style.Stroke({ color: 'rgba(213, 0, 110, 0)', width: 0 }),
      fill: new ol.style.Fill({ color: 'rgba(213, 0, 110, 0)' }),
    }));
    this.feature = feature;
    this.feature.setId('draw-' + this.plugin.numberOfDrawFeatures);
    this.plugin.numberOfDrawFeatures += 1;
    this.feature.set('name', this.feature.getId());
    const featureMapea = this.convertToMFeature_(this.feature);
    this.plugin.setFeature2(featureMapea.getImpl().getOLFeature());
  }

  deleteOnClickEvent() {
    this.facadeMap_.getMapImpl().removeInteraction(this.draw);
  }

  convertToMFeature_(olFeature) {
    const feature = new M.Feature(olFeature.getId(), {
      geometry: {
        coordinates: olFeature.getGeometry().getCoordinates(),
        type: olFeature.getGeometry().getType(),
      },
      properties: olFeature.getProperties(),
    });
    feature.getImpl().getOLFeature().setStyle(olFeature.getStyle());
    this.facadeMap_.getLayers()[this.facadeMap_.getLayers().length - 1].addFeatures(feature);
    return feature;
  }
}
