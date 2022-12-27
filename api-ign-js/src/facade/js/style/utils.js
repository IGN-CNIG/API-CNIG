import chroma from 'chroma-js';
import StylePoint from '../style/Point';
import StyleLine from '../style/Line';
import StylePolygon from '../style/Polygon';
import StyleGeneric from '../style/Generic';


/**
 * This function returns the appropiate style to geomtry layer
 * with parameter options.
 * @function
 * @private
 * @param {object} options - style options
 * @param {M.layer.Vector} layer -
 * @return {M.style.Simple}
 */
const generateStyleLayer = (options, layer) => {
  let style;
  switch (layer.getGeometryType()) {
    case 'Point':
    case 'MultiPoint':
      style = new StylePoint(options);
      break;
    case 'LineString':
    case 'MultiLineString':
      style = new StyleLine(options);
      break;
    case 'Polygon':
    case 'MultiPolygon':
      style = new StylePolygon(options);
      break;
    default:
      return null;
  }
  return style;
};

const generateRandomGenericStyle = (opts) => {
  const radius = opts.radius;
  const fillColor = chroma.random().hex();
  const strokeColor = opts.strokeColor;
  const strokeWidth = opts.strokeWidth;
  const options = {
    point: {
      radius,
      fill: {
        color: fillColor,
      },
      stroke: {
        color: strokeColor,
        width: strokeWidth,
      },
    },
    line: {
      fill: {
        color: fillColor,
      },
      stroke: {
        color: strokeColor,
        width: strokeWidth,
      },
    },
    polygon: {
      fill: {
        color: fillColor,
      },
      stroke: {
        color: strokeColor,
        width: strokeWidth,
      },
    },
  };
  return new StyleGeneric(options);
};

/**
 * @public
 * @function
 * @api
 */
const Utils = {
  generateStyleLayer,
  generateRandomGenericStyle,
};

export default Utils;
