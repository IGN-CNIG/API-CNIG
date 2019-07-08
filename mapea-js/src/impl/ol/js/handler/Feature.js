/**
 * @module M/impl/handler/Feature
 */
import { isNullOrEmpty } from 'M/util/Utils';
import FeatureImpl from '../feature/Feature';

/**
 * function adds the event 'click'
 *
 * @private
 * @function
 * @export
 */
const getFacadeFeature = (feature, layer) => {
  let mFeature;
  const featureId = feature.getId();
  if (!isNullOrEmpty(featureId)) {
    mFeature = layer.getFeatureById(featureId);
  }
  if (isNullOrEmpty(mFeature)) {
    mFeature = FeatureImpl.olFeature2Facade(feature);
  }
  return mFeature;
};

/**
 * @classdesc
 * Main constructor of the class. Creates a KML layer
 * with parameters specified by the user
 */
class Feature {
  /**
   * @constructor
   * @param {ol.Map} options custom options for this layer
   * @api stable
   */
  constructor(options = {}) {
    /**
     * OpenLayers map
     * @private
     * @type {M.impl.Map}
     */
    this.map_ = null;

    /**
     * @private
     * @type {String}
     * @expose
     */
    this.defaultCursor_ = undefined;
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  addTo(map) {
    this.map_ = map;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getFeaturesByLayer(evt, layer) {
    const features = [];

    if (!isNullOrEmpty(layer) && layer.isVisible() &&
      !isNullOrEmpty(layer.getImpl().getOL3Layer())) {
      const olLayer = layer.getImpl().getOL3Layer();
      this.map_.getMapImpl().forEachFeatureAtPixel(evt.pixel, (feature, layerFrom) => {
        features.push(getFacadeFeature(feature, layer));
      }, {
        layerFilter: (l) => {
          let passFilter = false;

          passFilter = passFilter || l === olLayer;
          return passFilter;
        },
      });
    }
    return features;
  }

  /**
   * function adds the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  addCursorPointer() {
    const viewport = this.map_.getMapImpl().getViewport();
    if (viewport.style.cursor !== 'pointer') {
      this.defaultCursor_ = viewport.style.cursor;
    }
    viewport.style.cursor = 'pointer';
  }

  /**
   * function adds the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  removeCursorPointer() {
    this.map_.getMapImpl().getViewport().style.cursor = this.defaultCursor_;
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    // unlisten event
    this.map_.un('click', this.onMapClick_, this);
    this.map_ = null;
  }
}

export default Feature;
