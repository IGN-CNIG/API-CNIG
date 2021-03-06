/**
 * @module M/Feature
 */
import FeatureImpl from 'impl/feature/Feature';
import Base from '../Base';
import { isNullOrEmpty } from '../util/Utils';
import GeoJSON from '../format/GeoJSON';
import * as dialog from '../dialog';
import StyleFeature from '../style/Feature';
import StylePoint from '../style/Point';
import * as EventType from '../event/eventtype';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * Main constructor of the class. Create a Feature
 * @api
 */
class Feature extends Base {
  /**
   * @constructor
   * @extends {M.facade.Base}
   * @param {string} id - id to feature
   * @param {Object} geojson - geojson to feature
   * @api
   */
  constructor(id, geojson, style) {
    /**
     * Implementation of feature
     * @public
     * @type {M.impl.Feature}
     */
    const impl = new FeatureImpl(id, geojson, style);

    super(impl);

    /**
     * Style of feature
     * @private
     * @type {M.style.Feature}
     */
    this.style_ = null;

    /** * GeoJSON format
     * @private
     * @type {M.format.GeoJSON}
     */
    this.formatGeoJSON_ = new GeoJSON();

    this.setStyle(style);
  }

  /**
   * This function set id
   *
   * @public
   * @function
   * @param {string} id - ID to feature
   * @api
   */
  setId(id) {
    this.getImpl().setId(id);
  }

  /**
   * This function return id feature
   *
   * @public
   * @function
   * @return {string} ID to feature
   * @api
   */
  getId() {
    return this.getImpl().getId();
  }

  /**
   * This function return geometry feature
   *
   * @public
   * @function
   * @return {object} Geometry feature
   * @api
   */
  getGeometry() {
    return this.getGeoJSON().geometry;
  }

  /**
   * This function set geometry feature
   *
   * @public
   * @function
   * @param {object} Geometry feature
   * @api
   */
  setGeometry(geometry) {
    this.getImpl().setGeometry(geometry);
  }

  /**
   * This function return geojson feature
   *
   * @public
   * @function
   * @return {Object} geojson feature
   * @api
   */
  getGeoJSON() {
    return this.formatGeoJSON_.write(this)[0];
  }

  /**
   * This function return attributes feature
   *
   * @public
   * @function
   * @return {Object} attributes feature
   * @api
   */
  getAttributes() {
    return this.getImpl().getAttributes();
  }

  /**
   * This function set attributes feature
   *
   * @public
   * @function
   * @param {Object} attributes - attributes to feature
   * @api
   */
  setAttributes(attributes) {
    if (typeof attributes === 'object') {
      this.getImpl().setAttributes(attributes);
    } else {
      dialog.info(getValue('feature').incorrect_attributes);
    }
  }

  /**
   * This function returns the value of the indicated attribute
   *
   * @public
   * @function
   * @param {string} attribute - Name attribute
   * @return  {string|number|object} returns the value of the indicated attribute
   * @api
   */
  getAttribute(attribute) {
    let attrValue;

    attrValue = this.getImpl().getAttribute(attribute);
    if (isNullOrEmpty(attrValue)) {
      // we look up the attribute by its path. Example: getAttribute('foo.bar.attr')
      // --> return feature.properties.foo.bar.attr value
      const attrPath = attribute.split('.');
      if (attrPath.length > 1) {
        attrValue = attrPath.reduce((obj, attr) => {
          let attrParam;
          if (!isNullOrEmpty(obj)) {
            if (obj instanceof Feature) {
              attrParam = obj.getAttribute(attr);
            } else {
              attrParam = obj[attr];
            }
          }
          return attrParam;
        }, this);
      }
    }
    return attrValue;
  }

  /**
   * This function set value the value of the indicated attribute
   *
   * @public
   * @function
   * @param {string} attribute - Name attribute
   * @return  {string|number|object} returns the value of the indicated attribute
   * @api
   */
  setAttribute(attribute, value) {
    return this.getImpl().setAttribute(attribute, value);
  }

  /**
   * This function set style feature
   *
   * @public
   * @function
   * @param {M.style.Feature}
   * @api
   */
  setStyle(style) {
    if (!isNullOrEmpty(style) && style instanceof StyleFeature) {
      this.style_ = style;
      this.style_.applyToFeature(this);
    } else if (isNullOrEmpty(style)) {
      this.style_ = null;
      this.getImpl().clearStyle();
    }
    this.fire(EventType.CHANGE_STYLE, [style, this]);
  }

  /**
   * This function return if two features are equals
   * @public
   * @function
   * @param {M.Feature} feature
   * @return {bool} returns the result of comparing two features
   */
  equals(feature) {
    return this.getId() === feature.getId();
  }

  /**
   * This function returns style feature
   *
   * @public
   * @function
   * @return {M.style.Feature} returns the style feature
   * @api
   */
  getStyle() {
    return this.style_;
  }

  /**
   * This function clear style feature
   *
   * @public
   * @function
   * @return {M.style.Feature} returns the style feature
   * @api
   */
  clearStyle() {
    this.setStyle(null);
  }

  /**
   * This function returns de centroid of feature
   *
   * @public
   * @function
   * @return {M.Feature}
   * @api
   */
  getCentroid() {
    const id = this.getId();
    const attributes = this.getAttributes();
    const style = new StylePoint({
      stroke: {
        color: '#67af13',
        width: 2,
      },
      radius: 8,
      fill: {
        color: '#67af13',
        opacity: 0.2,
      },
    });
    const centroid = this.getImpl().getCentroid();
    if (!isNullOrEmpty(centroid)) {
      centroid.id(`${id} centroid}`);
      centroid.attributes(attributes);
      centroid.style = style;
    }
    return centroid;
  }
}

export default Feature;
