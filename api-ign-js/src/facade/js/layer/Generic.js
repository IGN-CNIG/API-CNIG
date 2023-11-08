/**
 * @module M/layer/Generic
 */
import Utils from 'impl/util/Utils';
import GenericVector from './GenericVector';
import GenericRaster from './GenericRaster';

/**
 * @classdesc
 * Generic permite añadir cualquier tipo de capa definida con la librería base
 *
 * @api
 */
class Generic {
  constructor(userParameters, options, vendorOptions) {
    if (vendorOptions) {
      this.sourceType = Utils.getSourceType(vendorOptions);
    }

    if (this.sourceType === 'vector') {
      return new GenericVector(userParameters, options, vendorOptions);
    }

    if (this.sourceType === 'raster') {
      return new GenericRaster(userParameters, options, vendorOptions);
    }
  }
}

export default Generic;
