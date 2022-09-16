/**
 * @module M/impl/format/WKT
 */
import MObject from 'M/Object';
import OLFormatWKT from 'ol/format/WKT';
import { get } from 'ol/proj';
import FeatureImpl from '../feature/Feature';
import GeoJSON from './GeoJSON';

/**
 * @const
 * @api
 */
const getOptsProjection = (options) => {
  const opts = {
    dataProjection: get(options.dataProjection),
    featureProjection: get(options.featureProjection),
  };
  return opts;
};

/**
 * @classdesc
 * @api
 */
class WKT extends MObject {
  /**
   * @classdesc
   * Feature format for reading and writing data in the GeoJSON format.
   *
   * @constructor
   * @api stable
   */
  constructor(options = {}) {
    super(options);
    this.gjFormat_ = new GeoJSON();
    this.formatter_ = new OLFormatWKT({
      splitCollection: true,
      ...options,
    });
  }

  /**
   * @public
   * @function
   * @api
   */
  getFormatter() {
    return this.formatter_;
  }

  /**
   *
   * @public
   * @function
   * @api
   */
  read(wkt, options = {}) {
    const opts = getOptsProjection(options);
    const { id } = options;
    const olFeature = this.formatter_.readFeatureFromText(wkt, opts);
    const mFeature = FeatureImpl.olFeature2Facade(olFeature);
    if (id != null) {
      mFeature.setId(id);
    }
    return mFeature;
  }

  /**
   *
   * @public
   * @function
   * @api
   */
  readCollection(wktCollection, options = {}) {
    const opts = getOptsProjection(options);
    const { ids } = options;
    const olFeatures = this.formatter_.readFeaturesFromText(wktCollection, opts);
    const mFeatures = olFeatures.map(f => FeatureImpl.olFeature2Facade(f));
    if (ids != null && ids.length === mFeatures.length) {
      mFeatures.forEach((mFeature, index) => mFeature.setId(ids[index]));
    }
    return mFeatures;
  }

  /**
   *
   * @public
   * @function
   * @api
   */
  write(feature, options = {}) {
    const opts = getOptsProjection(options);
    const olFeature = FeatureImpl.facade2OLFeature(feature);
    const wkt = this.formatter_.writeFeatureText(olFeature, opts);
    return wkt;
  }

  /**
  * Método auxiliar para las transformaciones y operaciones
  * geométricas que no se incorporaron en un principio en apiign
  * geometry: La geometría que se desea transformar.
  * return:La geometría transformada en formato WKT.
  */
  writeFeature(geometry) {
    const olGeometry = this.gjFormat_.readGeometryFromObject(geometry);
    if (olGeometry.getType().toLowerCase() === 'point') {
      const pointCoord = olGeometry.getCoordinates();
      olGeometry.setCoordinates([pointCoord[0], pointCoord[1]]);
    }
    const wktGeom = this.formatter_.writeGeometryText(olGeometry);
    return wktGeom;
  }


  /**
  *
  * @public
  * @function
  * @api
  */
  writeCollection(features, options = {}) {
    const opts = getOptsProjection(options);
    const olFeatures = features.map(f => FeatureImpl.facade2OLFeature(f));
    const wkt = this.formatter_.writeFeaturesText(olFeatures, opts);
    return wkt;
  }
}

export default WKT;
