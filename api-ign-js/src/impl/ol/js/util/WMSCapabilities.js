/**
 * @module M/impl/GetCapabilities
 */
import { isNullOrEmpty, isArray, isObject, isUndefined, isString } from 'M/util/Utils';
import WMS from 'M/layer/WMS';
import { get as getProjection } from 'ol/proj';
import ImplUtils from './Utils';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMS layer
 * with parameters specified by the user
 * @api
 */
class GetCapabilities {
  /**
   * @constructor
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  constructor(capabilities, serviceUrl, projection) {
    /**
     * The WMS layers capabilities
     * @private
     * @type {Object}
     */
    this.capabilities_ = capabilities;

    /**
     * The projectionz
     * @private
     * @type {Mx.Projection}
     */
    this.projection_ = projection;

    /**
     * The projection
     * @private
     * @type {Mx.Projection}
     */
    this.serviceUrl_ = serviceUrl;
  }

  /**
   * capabilities getter
   *
   * @function
   * @public
   * @api
   */
  get capabilities() {
    return this.capabilities_;
  }

  /**
   * projection getter
   *
   * @function
   * @public
   * @api
   */
  get projection() {
    return this.projection_;
  }

  /**
   * serviceUrl getter
   *
   * @function
   * @public
   * @api
   */
  get serviceUrl() {
    return this.serviceUrl_;
  }

  /**
   * This function calculates the extent for a specific layer
   * from its getCapabilities
   *
   * @public
   * @function
   * @param {Mx.GetCapabilities} capabilities
   * @param {String} layerName
   * @returns {Array<Number>} the extension
   * @api stable
   */
  getLayerExtent(layerName) {
    const layer = this.capabilities_.Capability.Layer;
    const extent = this.getExtentRecursive_(layer, layerName);
    return this.transformExtent(extent);
  }

  /**
   * This function calculates the extent for a specific layer
   * from its getCapabilities
   *
   * @private
   * @function
   * @param {Mx.GetCapabilities} capabilities
   * @param {String} layerName
   * @returns {Array<Number>} the extension
   */
  getExtentRecursive_(layer, layerName) {
    let extent = null;
    let i;
    if (!isNullOrEmpty(layer)) {
      // array
      if (isArray(layer)) {
        for (i = 0; i < layer.length && extent === null; i += 1) {
          extent = this.getExtentRecursive_(layer[i], layerName);
        }
      } else if (isObject(layer)) {
        // base case
        if (isNullOrEmpty(layerName) || (layer.Name === layerName)) {
          if (!isNullOrEmpty(layer.BoundingBox)) {
            const bboxSameProj = layer.BoundingBox.find(bbox => bbox.crs === this.projection_.code);
            if (!isNullOrEmpty(bboxSameProj)) {
              this.capabilitiesProj = bboxSameProj.crs;
              extent = bboxSameProj.extent;
            } else {
              const bbox = layer.BoundingBox[0];
              this.capabilitiesProj = bbox.crs;
              const projSrc = getProjection(bbox.crs);
              const projDest = getProjection(this.projection_.code);
              extent = ImplUtils.transformExtent(bbox.extent, projSrc, projDest);
            }
          } else if (!isNullOrEmpty(layer.LatLonBoundingBox)) {
            const bbox = layer.LatLonBoundingBox[0];
            this.capabilitiesProj = 'EPSG:4326';
            // if the layer has not the SRS then transformExtent
            // the latLonBoundingBox which is always present
            const projSrc = getProjection('EPSG:4326');
            const projDest = getProjection(this.projection_.code);
            extent = ImplUtils.transformExtent(bbox.extent, projSrc, projDest);
          }
        } else if (!isUndefined(layer.Layer)) {
          // recursive case
          extent = this.getExtentRecursive_(layer.Layer, layerName);
        }
      }
    }
    return extent;
  }

  /**
   * This function calculates the extent for a specific layer
   * from its getCapabilities
   *
   * @private
   * @function
   * @param {Mx.GetCapabilities} capabilities
   * @param {String} layerName
   * @returns {Array<Number>} the extension
   */
  getLayers() {
    const layer = this.capabilities_.Capability.Layer;
    const layers = this.getLayersRecursive_(layer);
    return layers;
  }

  /**
   * This function calculates the extent for a specific layer
   * from its getCapabilities
   *
   * @private
   * @function
   * @param {Mx.GetCapabilities} capabilities
   * @param {String} layerName
   * @returns {Array<Number>} the extension
   */
  getLayersRecursive_(layer) {
    let layers = [];
    if (!isNullOrEmpty(layer.Layer)) {
      layers = this.getLayersRecursive_(layer.Layer);
    } else if (isArray(layer)) {
      layer.forEach((layerElem) => {
        layers = layers.concat(this.getLayersRecursive_(layerElem));
      });
    } else { // base case
      let imageFormat = 'image/png';
      try {
        const formats = this.capabilities_.Capability.Request.GetMap.Format;
        if (formats.length === 1) {
          imageFormat = formats[0];
        }
        /* eslint-disable no-empty */
      } catch (err) {}

      layers.push(new WMS({
        url: this.serviceUrl_,
        name: layer.Name,
        legend: !isNullOrEmpty(layer.Title) ? layer.Title : '',
        format: imageFormat,
      }, {}, {
        capabilitiesMetadata: {
          abstract: !isNullOrEmpty(layer.Abstract) ? layer.Abstract : '',
          attribution: !isNullOrEmpty(layer.Attribution) ? layer.Attribution : '',
          metadataURL: !isNullOrEmpty(layer.MetadataURL) ? layer.MetadataURL : '',
          style: !isNullOrEmpty(layer.Style) ? layer.Style : '',
        },
      }));
    }
    return layers;
  }

  /**
   * PATCH
   *
   * Context: As stated on the OGC Web Map Services v1.3.0, the Layer bounding box declared
   * in the GetCapabilities should be defined using the coordinates order established in the CRS.
   * For example, in the case ofEPSG: 4326, the order of the bounding box
   * should be(min_lat, min_long, max_lat, max_long).This order should also be used on a
   * GetMap request. However, coming from WMS 1.1.0, the coordinate orders always were specified
   * in LongLat order.
   *
   * To maintain the compatibility for all the clients, OpenLayers automatically flips the order in
   * case ofusing a v1.3.0 service.This conflicts with our own development, given that we provide
   * the bounding box in the same order that is declared on the GetCapabilities, resulting in an
   * incorrect order for services that declared a CRS with the LatLong order
   *
   * @private
   * @function
   * @return {Array<Number>}
   */
  transformExtent(extent) {
    let transformExtent = extent;

    if (this.capabilities_.version === '1.3.0' && isString(this.capabilitiesProj)) {
      const axisOrientation = getProjection(this.capabilitiesProj).getAxisOrientation();
      if (Array.isArray(transformExtent) && axisOrientation.substr(0, 2) === 'ne') {
        transformExtent = [extent[1], extent[0], extent[3], extent[2]];
      }
    }
    return transformExtent;
  }
}

export default GetCapabilities;
