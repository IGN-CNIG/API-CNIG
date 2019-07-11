/**
 * @module M/format/WKT
 */
import WKTImpl from 'impl/wkt_format';

/**
 * @classdesc
 * Main constructor of the class. Creates a layer
 * with parameters specified by the user
 * @api
 */
class WKT extends M.facade.Base {
  /**
   *
   * @constructor
   * @extends {M.facade.Base}
   * @param {string|Object} userParameters parameters
   * provided by the user
   * @api
   */
  constructor(options = {}) {
    const impl = new WKTImpl(options);
    // calls the super constructor
    super(impl);
    // checks if the implementation can create format GeoJSON
    if (M.utils.isUndefined(WKTImpl)) {
      M.exception(M.language.getValue('exception').wkt_method);
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {Array<M.Feature>} features features array to parsed
   * as a GeoJSON FeatureCollection
   * @return {Array<Object>}
   * @api
   */
  write(geomtry) {
    return this.getImpl().write(geomtry);
  }
}

export default WKT;
