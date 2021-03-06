/**
 * @module M/filter
 */
import FilterFunction from './Function';
import { isNullOrEmpty } from '../util/Utils';

/**
 * @classdesc
 * @api
 */
class Spatial extends FilterFunction {
  /**
   * Creates a Filter Spatial to filter features
   *
   * @param {function} Function - filter function
   * TODO @param {object} options
   * @api
   */
  constructor(FunctionParam, options) {
    const filterFunction = (feature, index) => {
      let geometry = null;
      if (!isNullOrEmpty(feature)) {
        geometry = feature.getGeometry();
      }
      return FunctionParam(geometry, index);
    };
    super(filterFunction, options);
  }
}

export default Spatial;
