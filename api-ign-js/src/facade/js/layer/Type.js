/**
 * @module M/layer/type
 */
import { normalize, isString } from '../util/Utils';

/**
 * WMC type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const WMC = 'WMC';

/**
 * KML type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const KML = 'KML';

/**
 * WMS type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const WMS = 'WMS';

/**
 * WFS type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const WFS = 'WFS';

/**
 * WMTS type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const WMTS = 'WMTS';

/**
 * OSM type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const OSM = 'OSM';

/**
 * XYZ type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const XYZ = 'XYZ';

/**
 * TMS type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const TMS = 'TMS';

/**
 * GeoJSON type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const GeoJSON = 'GeoJSON';

/**
 * Vector type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const Vector = 'Vector';

/**
 * Vector Tile type
 * @const
 * @type {string}
 * @public
 * @api
 */
export const MVT = 'MVT';

/**
 * All layer types
 * @const
 * @type {object}
 *
 */
const layertypes = {
  WMC,
  KML,
  WMS,
  WFS,
  WMTS,
  OSM,
  GeoJSON,
  Vector,
  MVT,
  XYZ,
  TMS,
};

/**
 * Transforma el tipo de capa a un tipo de capa soportado por API-CNIG.
 * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
 *
 * @public
 * @function
 * @param {string} rawType Tipo de capa.
 * @returns {string} Tipo de capa soportado por API-CNIG.
 */
export const parse = (rawType) => {
  let type = normalize(rawType, true);
  if (type === 'WMS_FULL') {
    type = WMS;
  } else if (type === 'WFST') {
    type = WFS;
  } else {
    type = Object.keys(layertypes).find((knowType) => {
      const knowTypeVal = layertypes[knowType];
      return (isString(knowTypeVal) && (normalize(knowTypeVal, true) === type));
    });
  }
  return layertypes[type];
};

/**
 * Devuelve los tipos de capa soportados por API-CNIG.
 * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
 * @public
 * @function
 * @param {string} rawType Tipo de capa.
 */
export const know = (type) => {
  const knowTypes = [
    WMC,
    KML,
    WMS,
    WFS,
    WMTS,
    MVT,
    XYZ,
    TMS,
  ];
  return (knowTypes.indexOf(parse(type)) !== -1);
};

/**
 * Este comentario no se verá, es necesario incluir
 * una exportación por defecto para que el compilador
 * muestre las funciones.
 *
 * Esto se produce por al archivo normaliza-exports.js
 * @api stable
 */
export default {};
