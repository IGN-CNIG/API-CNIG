/**
 * @module M/impl/layer/TMS
 */
import MXYZ from './XYZ';
import * as LayerType from '../../../../facade/js/layer/Type';
import ImplMap from '../Map';

/**
 * @classdesc
 * @api
 */
class TMS extends MXYZ {
  /**
   * @classdesc
   * Main constructor of the class. Creates a TMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.layer.Vector}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  constructor(userParameters, options = {}, vendorOptions) {
    super(userParameters, options, vendorOptions);

    this.zIndex_ = ImplMap.Z_INDEX[LayerType.TMS];

    this.displayInLayerSwitcher = userParameters.displayInLayerSwitcher !== false;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof TMS) {
      equals = (this.name === obj.name);
    }
    return equals;
  }
}
export default TMS;
