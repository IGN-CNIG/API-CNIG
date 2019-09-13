/**
 * @module M/format/WKT
 */
import WKTImpl from 'impl/format/WKT';
import Base from '../Base';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * Main constructor of the class. Creates a layer
 * with parameters specified by the user
 * @api
 */
class WKT extends Base {
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
    super(impl);
    if (isUndefined(WKTImpl)) {
      Exception(getValue('exception').wkt_method);
    }
  }

  /**
   *
   * @public
   * @function
   * @api
   */
  read(wkt, options = {}) {
    const mFeature = this.getImpl().read(wkt, options);
    return mFeature;
  }

  /**
   *
   * @public
   * @function
   * @api
   */
  readCollection(wktCollection, options = {}) {
    const mFeature = this.getImpl().readCollection(wktCollection, options);
    return mFeature;
  }

  /**
   *
   * @public
   * @function
   * @api
   */
  write(feature, options = {}) {
    const wkt = this.getImpl().write(feature, options);
    return wkt;
  }

  /**
   *
   * @public
   * @function
   * @api
   */
  writeCollection(features, options = {}) {
    const wkt = this.getImpl().writeCollection(features, options);
    return wkt;
  }
}

export default WKT;
