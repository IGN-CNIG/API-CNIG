/**
 * @module M/impl/layer/XYZ
 */
import { isNullOrEmpty } from 'M/util/Utils';
import OLTileLayer from 'ol/layer/Tile';
import { get as getProj } from 'ol/proj';
import XYZSource from 'ol/source/XYZ';
import * as LayerType from '../../../../facade/js/layer/Type';
import ImplMap from '../Map';

/**
 * @classdesc
 * @api
 */
class XYZ extends OLTileLayer {
  /**
   * @classdesc
   * Main constructor of the class. Creates a XYZ layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.layer.Vector}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  constructor(userParameters, options = {}, vendorOptions) {
    super(options, vendorOptions);

    /**
     * The source url of the xyz layer
     * @private
     * @type {String}
     * @expose
     */
    this.url = userParameters.url;

    /**
     * Tile size (default value 256)
     * @private
     * @type {number}
     */
    this.tileSize_ = typeof userParameters.tileSize === 'number' ? userParameters.tileSize : 256;

    /**
     * Layer opacity
     * @private
     * @type {number}
     */
    this.opacity_ = typeof options.opacity === 'number' ? options.opacity : 1;

    this.zIndex_ = ImplMap.Z_INDEX[LayerType.XYZ];

    this.visibility = userParameters.visibility === false ? userParameters.visibility : true;
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api
   */
  setVisible(visibility) {
    this.visibility = visibility;
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @api
   */
  addTo(map) {
    this.map = map;
    const projection = getProj('EPSG:3857');
    const extent = projection.getExtent();

    this.ol3Layer = new OLTileLayer({
      visible: this.visibility,
      opacity: this.opacity_,
      zIndex: this.zIndex_,
      extent,
    });
    this.map.getMapImpl().addLayer(this.ol3Layer);
    const source = new XYZSource({
      projection: this.map.getProjection().code,
      url: this.url,
      minZoom: this.map.getMinZoom(),
      maxZoom: this.map.getMaxZoom(),
      tileSize: this.getTileSize(),
    });
    this.ol3Layer.setSource(source);
  }


  /**
   * This function return the tile size of the layer
   *
   * @public
   * @function
   * @api
   */
  getTileSize() {
    return this.tileSize_;
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    this.map = null;
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
    if (obj instanceof XYZ) {
      equals = (this.name === obj.name);
    }
    return equals;
  }
}
export default XYZ;
