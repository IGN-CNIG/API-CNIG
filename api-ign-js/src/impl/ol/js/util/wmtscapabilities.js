/* eslint-disable no-console */
/**
 * @module M/impl/util/wmtscapabilities
 */
import WMTS from 'M/layer/WMTS';
import { isNullOrEmpty, isArray, isObject } from 'M/util/Utils';
import { get as getProj } from 'ol/proj';
import ImplUtils from './Utils';


/**
 * TODO
 * @function
 */
const getExtentRecursive = (layer, layerName, code) => {
  let extent = null;
  if (!isNullOrEmpty(layer)) {
    if (isArray(layer)) {
      for (let i = 0; i < layer.length && extent === null; i += 1) {
        extent = getExtentRecursive(layer[i], layerName, code);
      }
    } else if (isObject(layer)) {
      // base case
      if (isNullOrEmpty(layerName) || (layer.Identifier === layerName)) {
        extent = layer.WGS84BoundingBox;
        const extentProj = getProj('EPSG:4326');
        const oldProj = getProj(code);
        extent = ImplUtils.transformExtent(extent, extentProj, oldProj);
      }
    }
  }
  return extent;
};

const getLayersRecursive = (layer, urlService, EPSGcode, capabilities) => {
  let layers = [];

  if (!isNullOrEmpty(layer.Layer)) {
    layers = getLayersRecursive(layer.Layer);
  } else if (isArray(layer)) {
    layer.forEach((layerElem) => {
      layers = layers.concat(getLayersRecursive(layerElem, urlService, EPSGcode, capabilities));
    });
  } else {
    const listMatrixSetCapabilities = layer.TileMatrixSetLink;
    let EPSGcodeToMatrixSet = EPSGcode;

    if (EPSGcode === 'EPSG:3857') {
      if (!listMatrixSetCapabilities.includes('EPSG:3857')) {
        EPSGcodeToMatrixSet = 'GoogleMapsCompatible';
      }
    }

    layers.push(new WMTS({
      url: urlService,
      name: layer.Identifier,
      matrixSet: EPSGcodeToMatrixSet,
      legend: !isNullOrEmpty(layer.Title) ? layer.Title : '',
    }, {}, {
      capabilitiesMetadata: {
        abstract: !isNullOrEmpty(layer.Abstract) ? layer.Abstract : '',
        attribution: !isNullOrEmpty(capabilities.ServiceProvider) ? capabilities.ServiceProvider : '',
        style: !isNullOrEmpty(layer.Style) ? layer.Style : '',
      },
    }));
  }
  return layers;
};

/**
 * TODO
 *
 * @public
 * @function
 * @api
 */
export const getLayers = (capabilities, url, EPSGcode) => {
  return getLayersRecursive(capabilities.Contents.Layer, url, EPSGcode, capabilities);
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
const getLayerExtent = (parsedCapabilities, name, code) => {
  return getExtentRecursive(parsedCapabilities.Layer, name, code);
};

export default getLayerExtent;
