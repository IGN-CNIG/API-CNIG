import { modifySVG } from 'M/util/Utils';

/**
 * @module M/style/Feature
 */
import StyleBase from './Style';

/**
 * @classdesc
 * @api
 */
class Feature extends StyleBase {
  /**
   * @constructor
   * @api
   */
  constructor(options, impl) {
    super(options, impl);

    /**
     * Feature where the style is applied
     * @private
     * @type {M.Feature}
     */
    this.feature_ = null;
  }

  /**
   * This function apply style to feature
   *
   * @public
   * @param {M.Feature} feature - Feature to apply style
   * @function
   * @api
   */
  applyToFeature(feature) {
    this.feature_ = feature;
    let options = feature.getStyle().getOptions();
    if (options.point) {
      options = options.point;
    }
    if (options.icon && options.icon.src && typeof options.icon.src === 'string' && options.icon.src.endsWith('.svg') &&
      (options.icon.fill || options.icon.stroke)) {
      modifySVG(options.icon.src, options).then((resp) => {
        options.icon.src = resp;
        this.applyToFeature(this.feature_);
      });
    } else {
      this.getImpl().applyToFeature(feature);
    }
  }
}

export default Feature;
