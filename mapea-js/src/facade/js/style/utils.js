import StylePoint from '../style/Point';
import StyleLine from '../style/Line';
import StylePolygon from '../style/Polygon';

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

/**
 * @public
 * @function
 * @api
 */
const Utils = {
  generateStyleLayer,
};

export default Utils;
