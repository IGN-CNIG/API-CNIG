/**
 * Esta clase contiene funciones de utilidad.
 * @module M/utils
 * @example import utils from 'M/utils';
 */
import { get as remoteGet } from 'M/util/Remote';
import chroma from 'chroma-js';
import Draggabilly from 'draggabilly';
import * as shp from 'shpjs';
import * as dynamicImage from 'assets/img/dynamic_legend';
import { getValue } from '../i18n/language';
import { INCHES_PER_UNIT, DOTS_PER_INCH } from '../units';
import * as WKT from '../geom/WKT';

/**
 * Devuelve verdadero si es valor que se le pasa por
 * parámetros es indefinido.
 * @function
 * @param {*} obj Valor que se quiere comprobar.
 * @returns {Boolean} Verdadero si es indefinido.
 * @api
 */
export const isUndefined = (obj) => {
  return (typeof obj === 'undefined');
};

/**
 * Devuelve verdadero si es valor que se le pasa por
 * parámetros es "boolean".
 * @function
 * @param {*} obj Valor que se quiere comprobar.
 * @returns {Boolean} Verdadero si es "boolean".
 * @api
 */
export const isBoolean = (obj) => {
  let isBooleanParam = false;
  if (obj !== null && !isUndefined(obj)) {
    isBooleanParam = (typeof obj === 'boolean');
  }
  return isBooleanParam;
};

/**
 * Devuelve verdadero si es valor que se le pasa por
 * parámetros es nulo.
 * @function
 * @param {*} obj Valor que se quiere comprobar.
 * @returns {Boolean} Verdadero si es nulo.
 * @api
 */
export const isNull = (obj) => {
  let isNullParam = false;

  if (!isBoolean(obj) && typeof obj !== 'number') {
    if (isUndefined(obj)) {
      isNullParam = true;
    } else if (!obj) {
      isNullParam = true;
    } else if (obj === null) {
      isNullParam = true;
    }
  }

  return isNullParam;
};

/**
 * Devuelve verdadero si es valor que se le pasa por
 * parámetros es "Array".
 * @function
 * @param {*} obj Valor que se quiere comprobar.
 * @returns {Boolean} Verdadero si es "Array".
 * @api
 */
export const isArray = (obj) => {
  let isArrayParam = false;
  if (!isNull(obj)) {
    isArrayParam = (Object.prototype.toString.call(obj) === Object.prototype.toString.call([]));
  }
  return isArrayParam;
};

/**
 * Devuelve verdadero si es valor que se le pasa por
 * parámetros es nulo o esta vacío.
 * @function
 * @param {*} obj Valor que se quiere comprobar.
 * @returns {Boolean} Verdadero si es nulo o vacío.
 * @api
 */
export const isNullOrEmpty = (obj) => {
  let nullOrEmpty = false;

  if (isNull(obj)) {
    nullOrEmpty = true;
  } else if (isArray(obj)) {
    nullOrEmpty = true;
    if (obj.length > 0) {
      nullOrEmpty = !obj.some(objElem => !isNullOrEmpty(objElem));
    }
  } else if (typeof obj === 'string' && obj.trim()
    .length === 0) {
    nullOrEmpty = true;
  }

  return nullOrEmpty;
};

/**
 * Devuelve verdadero si es valor que se le pasa por
 * parámetros es una función.
 * @function
 * @param {*} obj Valor que se quiere comprobar.
 * @returns {Boolean} Verdadero si es una función.
 * @api
 */
export const isFunction = (obj) => {
  let isFunctionParam = false;
  if (!isNull(obj)) {
    isFunctionParam = (typeof obj === 'function' && !isUndefined(obj.call));
  }
  return isFunctionParam;
};

/**
 * Devuelve verdadero si es valor que se le pasa por
 * parámetros es un objeto.
 * @function
 * @param {*} obj Valor que se quiere comprobar.
 * @returns {Boolean} Verdadero si es un objeto.
 * @api
 */
export const isObject = (obj) => {
  let isObjectParam = false;
  if (!isNull(obj)) {
    isObjectParam = (typeof obj === 'object' && !isUndefined(obj.toString));
  }
  return isObjectParam;
};

/**
 * Devuelve verdadero si es valor que se le pasa por
 * parámetros es una cadena.
 * @function
 * @param {*} obj Valor que se quiere comprobar.
 * @returns {Boolean} Verdadero si es una cadena.
 * @api
 */
export const isString = (obj) => {
  let isStringParam = false;
  if (!isNull(obj)) {
    isStringParam = (typeof obj === 'string');
  }
  return isStringParam;
};

/**
 * Devuelve verdadero si es valor que se le pasa por
 * parámetros es una URL.
 * @function
 * @param {*} obj Valor que se quiere comprobar.
 * @returns {Boolean} Verdadero si es una URL.
 * @api
 */
export const isUrl = (obj) => {
  let isUrlParam = false;
  if (!isNull(obj) && isString(obj)) {
    isUrlParam = /(https?:\/\/[^*]+)/.test(obj);
  }
  return isUrlParam;
};


/**
 * Devuelve un texto normalizado (sin espacios y en mayúsculas o minúsculas).
 * @function
 * @param {String} stringToNormalize Valor que se quiere normalizar.
 * @param {Boolean} upperCase Verdadero mayúsculas, falso minúsculas.
 * @returns {String} Texto normalizado.
 * @api
 */
export const normalize = (stringToNormalize, upperCase) => {
  let normalizedString = stringToNormalize;
  if (!isNullOrEmpty(normalizedString) && isString(normalizedString)) {
    normalizedString = normalizedString.trim();
    normalizedString = upperCase ?
      normalizedString.toUpperCase() :
      normalizedString.toLowerCase();
  }
  return normalizedString;
};

/**
 * Devuelve los parámetros de una URL.
 * @function
 * @param {String} paramName Nombre del parámetro.
 * @param {String} url URL.
 * @returns {String} Parámetros de una URL.
 * @api
 */
export const getParameterValue = (paramName, url) => {
  let parameterValue = null;

  const paramNameVar = paramName
    .replace(/[[]/, '\\[')
    .replace(/[\]]/, '\\]');

  let parameters = url;
  const idxQuery = parameters.indexOf('?');
  if (idxQuery !== -1) {
    parameters = parameters.substring(idxQuery);
    const regex = new RegExp(`[\\?&]${paramNameVar}=([^&#]*)`);
    parameterValue = regex.exec(parameters);
    if (parameterValue !== null) {
      parameterValue = decodeURIComponent(parameterValue[1].replace(/\+/g, ' '));
    }
  }

  return parameterValue;
};

/**
 * Añade parámetros a una URL.
 * @function
 * @param {String} params Parámetros.
 * @param {String} url URL.
 * @returns {String} URL con parámetros.
 * @api
 */
export const addParameters = (url, params) => {
  let requestUrl = url;
  if (requestUrl.indexOf('?') === -1) {
    requestUrl += '?';
  } else if (requestUrl.charAt(requestUrl.length - 1) !== '?') {
    requestUrl += '&';
  }

  let requestParams = '';
  if (isObject(params)) {
    const keys = Object.keys(params);
    keys.forEach((key) => {
      const value = params[key];
      requestParams += key;
      requestParams += '=';
      requestParams += encodeURIComponent(value);
      requestParams += '&';
    });
    // removes the last '&'
    requestParams = requestParams.substring(0, requestParams.length - 1);
  } else if (isString(params)) {
    requestParams = params;
  }
  requestUrl += requestParams;

  return requestUrl;
};

/**
 * Genera un valor aleatorio.
 * @function
 * @param {String} prefix Prefijo.
 * @param {String} sufix Sufijo.
 * @returns {String} Valor aleatorio.
 * @api
 */
export const generateRandom = (prefix, sufix) => {
  let random = '';

  // adds prefix
  if (!isNullOrEmpty(prefix)) {
    random = prefix;
  }

  // generates random
  random = random
    .concat(Math.random())
    .replace(/0\./, '');

  // adds sufix
  if (!isNullOrEmpty(sufix)) {
    random = random.concat(sufix);
  }

  return random;
};

/**
 * Devuelve los metadatos de una URL, capa WMS.
 * @function
 * @param {String} serverUrl URL.
 * @param {String} version Versión.
 * @returns {String} Devuelve los metadatos.
 * @api
 */
export const getWMSGetCapabilitiesUrl = (serverUrl, version) => {
  let wmsGetCapabilitiesUrl = serverUrl;

  // request
  wmsGetCapabilitiesUrl = addParameters(wmsGetCapabilitiesUrl, 'request=GetCapabilities');
  // service
  wmsGetCapabilitiesUrl = addParameters(wmsGetCapabilitiesUrl, 'service=WMS');

  // PATCH: En mapea 3 no se manda luego aquí tampoco. Hay servicios que dan error....
  //       version
  wmsGetCapabilitiesUrl = addParameters(wmsGetCapabilitiesUrl, {
    version,
  });

  return wmsGetCapabilitiesUrl;
};

/**
 * Devuelve los metadatos de una URL, capa WMTS.
 * @function
 * @param {String} serverUrl URL.
 * @param {String} version Versión.
 * @returns {String} Devuelve los metadatos.
 * @api
 */
export const getWMTSGetCapabilitiesUrl = (serverUrl, version) => {
  let wmtsGetCapabilitiesUrl = serverUrl;

  // request
  wmtsGetCapabilitiesUrl = addParameters(wmtsGetCapabilitiesUrl, 'request=GetCapabilities');
  // service
  wmtsGetCapabilitiesUrl = addParameters(wmtsGetCapabilitiesUrl, 'service=WMTS');
  // version
  if (!isNullOrEmpty(version)) {
    wmtsGetCapabilitiesUrl = addParameters(wmtsGetCapabilitiesUrl, {
      version,
    });
  }

  return wmtsGetCapabilitiesUrl;
};

/**
 * Esta función genera una resolución máxima y mínima.
 *
 * @function
 * @param {Number} minResolution Resolución mínima.
 * @param {Number} maxResolution Resolución máxima.
 * @param {Number} numZoomLevels Número de niveles de zoom.
 * @returns {Array<Number>} Resolución.
 * @api
 */
export const fillResolutions = (minResolutionParam, maxResolutionParam, numZoomLevels) => {
  let minResolution = minResolutionParam;
  let maxResolution = maxResolutionParam;
  const resolutions = new Array(numZoomLevels);

  minResolution = Number.parseFloat(minResolution);
  maxResolution = Number.parseFloat(maxResolution);

  // if maxResolution and minResolution are set, we calculate
  // the base for exponential scaling that starts at
  // maxResolution and ends at minResolution in numZoomLevels
  // steps.
  let base = 2;
  if (!Number.isNaN(minResolution)) {
    base = ((maxResolution / minResolution) ** (1 / (numZoomLevels - 1)));
  }
  for (let i = 0; i < numZoomLevels; i += 1) {
    resolutions[i] = maxResolution / (base ** i);
  }
  // sort resolutions array descendingly
  resolutions.sort((a, b) => {
    return (b - a);
  });
  return resolutions;
};

/**
 * Esta función calcula la resolución de una escala.
 *
 * @function
 * @param {Number} scale Escala.
 * @param {String} units Unidades.
 * @returns {Number} La resolución para la escala especificada.
 * @api
 */
export const getResolutionFromScale = (scale, unitsParam) => {
  let units = unitsParam;
  let resolution;
  if (!isNullOrEmpty(scale)) {
    if (isNull(units)) {
      units = 'degrees';
    }
    // normalize scale
    const normScale = (scale > 1.0) ?
      (1.0 / scale) :
      scale;
    resolution = 1 / (normScale * INCHES_PER_UNIT[units] * DOTS_PER_INCH);
  }
  return resolution;
};

/**
 *  Esta función genera la resolución máxima y mínima para una escala.
 *
 * @function
 * @param {Number} maxScale Escala máxima.
 * @param {Number} minScale Escala mínima.
 * @param {Number} zoomLevels Números de zoom.
 * @param {String} units Unidades.
 * @returns {Array<Number>} Resolución.
 * @api
 */
export const generateResolutionsFromScales = (maxScale, minScale, zoomLevels, units) => {
  const minResolution = getResolutionFromScale(maxScale, units);
  const maxResolution = getResolutionFromScale(minScale, units);

  return fillResolutions(minResolution, maxResolution, zoomLevels);
};

/**
 * Esta función genera la resolución máxima y mínima para una
 * extensión.
 *
 * @function
 * @param {Number} extentParam Extensión.
 * @param {Number} size Tamaño.
 * @param {Number} zoomLevels Niveles de zoom.
 * @param {String} units Unidades.
 * @returns {Array<Number>} Resolución.
 * @api
 */
export const generateResolutionsFromExtent = (extentParam, size, zoomLevels, units) => {
  let extent = extentParam;
  let [wExtent, hExtent] = [null, null];
  if (isArray(extent)) {
    wExtent = (extent[2] - extent[0]);
    hExtent = (extent[3] - extent[1]);
  } else if (isObject(extent)) {
    wExtent = (extent.x.max - extent.x.min);
    hExtent = (extent.y.max - extent.y.min);
  } else if (isString(extent)) {
    extent = extent.split(',');
    wExtent = (extent[2] - extent[0]);
    hExtent = (extent[3] - extent[1]);
  }
  const wResolution = wExtent / size[0];
  const hResolution = hExtent / size[1];

  const maxResolution = Math.max(wResolution, hResolution);

  const resolutions = fillResolutions(null, maxResolution, zoomLevels);

  return resolutions;
};

/**
 * Esta función calcula la escala partiendo de una resolución.
 *
 * @function
 * @param {Number} resolution Resolución.
 * @param {String} unitsParam Unidades.
 * @returns {Number} La escala para la resolución especificada.
 * @api
 */
export const getScaleFromResolution = (resolution, unitsParam) => {
  let units = unitsParam;
  if (isNullOrEmpty(units)) {
    units = 'degrees';
  }

  const scale = resolution * INCHES_PER_UNIT[units] * DOTS_PER_INCH;

  return scale;
};

/**
 * Esta función transforma una cadena de texto a
 * código HTML.
 * @function
 * @param {String} htmlTxt Cadena.
 * @api
 */
export const stringToHtml = (htmlTxt) => {
  let html;

  if (!isNullOrEmpty(htmlTxt)) {
    const div = document.createElement('div');
    div.innerHTML = htmlTxt;
    html = div.children[0];
  }

  return html;
};

/**
 * Esta función transforma código HTML a
 * cadena de texto.
 * @function
 * @param {HTMLElement} html Contenido HTML.
 * @api
 */
export const htmlToString = (html) => {
  let text;

  if (!isNullOrEmpty(html)) {
    const div = document.createElement('div');
    div.appendChild(html);
    text = div.innerHTML;
  }

  return text;
};

/**
 * Esta función formatea la cadena de texto.
 *
 * @function
 * @param {String} text Texto para dar formato a la cadena.
 * @returns {String} Texto formateado.
 * @api
 */
export const beautifyString = (text) => {
  let beautifyStringParam;

  // 1 to lower case
  beautifyStringParam = text.toLowerCase();

  // 2 trim
  beautifyStringParam = beautifyStringParam.trim(beautifyStringParam);

  // 3 first char to upper case
  beautifyStringParam = beautifyStringParam
    .charAt(0)
    .toUpperCase() + beautifyStringParam.slice(1);

  // 4 replaces '_' by spaces
  beautifyStringParam = beautifyStringParam.replace(/_/g, ' ');

  // 5 simplifies spaces
  beautifyStringParam = beautifyStringParam.replace(/\s+/, ' ');

  // 6 to camel case
  beautifyStringParam = beautifyStringParam.replace(/(\s\w)+/g, (match) => {
    return match.toUpperCase();
  });

  // 7 common words to lower case
  beautifyStringParam = beautifyStringParam.replace(/\s+(de|del|las?|el|los?|un|unas?|unos?|y|a|al|en)\s+/ig, (match) => {
    return match.toLowerCase();
  });

  return beautifyStringParam;
};

/**
 * Esta función formatea los atributos.
 *
 *
 * @function
 * @param {attributeName} String Atributo.
 * @returns {String} Atributo formateado.
 * @api
 */
export const beautifyAttribute = (attributeName) => {
  let beautifyStringParam = attributeName;

  if (beautifyStringParam) {
    // OpenLayers.String.trim
    beautifyStringParam = beautifyStringParam.trim();
    if (beautifyStringParam.length > 0) {
      let idxPoints = beautifyStringParam.indexOf(':');
      if (idxPoints !== -1) {
        idxPoints += 1;
        beautifyStringParam = beautifyStringParam.substring(idxPoints, beautifyStringParam.length);
      }
    }
  }
  return beautifyStringParam;
};

/**
 * Esta función formatea el nombre de los atributos.
 *
 * @function
 * @param {String} rawAttributeName Nombre del atributo.
 * @returns {String} Texto formateado.
 * @api
 */
export const beautifyAttributeName = (rawAttributeName) => {
  let attributeName = normalize(rawAttributeName);
  attributeName = attributeName.replace(/_(\w)/g, (match, group) => {
    return ' '.concat(group.toUpperCase());
  });
  attributeName = attributeName.replace(/^\w/, (match) => {
    return match.toUpperCase();
  });
  return attributeName;
};

/**
 * Devuelve una ruta.
 * @function
 * @param {String} paths Ruta.
 * @returns {String} Ruta formateada.
 * @api
 */
export const concatUrlPaths = (paths) => {
  let finalUrl = null;
  if (!isNullOrEmpty(paths)) {
    finalUrl = paths[0];
    finalUrl = finalUrl.replace(/\/+\s*$/, '');
    for (let i = 1, ilen = paths.length; i < ilen; i += 1) {
      const path = paths[i];
      if (path.indexOf('/') !== 0) {
        finalUrl = finalUrl.concat('/');
      }
      finalUrl = finalUrl.concat(path);
    }
  }
  return finalUrl;
};

/**
 * Comprueba que en un matriz contenga un determinado elemento.
 * @function
 * @param {Array} array Matriz.
 * @param {*} searchElement Elemento que se quiere buscar.
 * @param {Number} fromIndex Indice.
 * @returns {*} Elemento.
 * @api
 */
export const includes = (array, searchElement, fromIndex) => {
  const O = Object(array);
  const len = parseInt(O.length, 10) || 0;
  if (len === 0) {
    return false;
  }
  const n = parseInt(fromIndex, 10) || 0;
  let k;
  if (n >= 0) {
    k = n;
  } else {
    k = len + n;
    if (k < 0) {
      k = 0;
    }
  }
  let currentElement;
  while (k < len) {
    currentElement = O[k];
    if (searchElement === currentElement || Object.equals(searchElement, currentElement)) {
      return true;
    }
    k += 1;
  }
  return false;
};

/**
 * Extiende los prototipos de un objeto.
 * @function
 * @param {Object} targetParam Objeto.
 * @param {Object} source Donde se encuentra el prototipo.
 * @param {Boolean} override Anular, (verdadero o falso).
 * @returns {Object} Objeto extendido.
 * @api
 */
export const extend = (targetParam, source, override) => {
  const target = targetParam;
  Object.keys(source).forEach((key) => {
    if (isUndefined(target[key])) {
      target[key] = source[key];
    } else if (Object.getPrototypeOf(target[key]) === Object.prototype) {
      extend(target[key], source[key], override);
    } else if ((override === true)) {
      target[key] = source[key];
    }
  });

  return target;
};

/**
 * Remplaza los caracteres de tipo XSS.
 *
 * @function
 * @param {String} xssValue Valor XSS.
 * @returns {String} Valor remplazado.
 * @api
 */
export const escapeXSS = (xssValue) => {
  let validValue;

  // & --> &amp;
  validValue = xssValue.replace(/&/g, '&amp;');

  // < --> &lt;
  validValue = validValue.replace(/</g, '&lt;');

  // > --> &gt;
  validValue = validValue.replace(/>/g, '&gt;');

  // ' --> &quot;
  validValue = validValue.replace(/'/g, '&quot;');

  // ' --> &#x27;
  validValue = validValue.replace(/'/g, '&#x27;');

  // / --> &#x2F;
  validValue = validValue.replace(/\//g, '&#x2F;');

  return validValue;
};

/**
 * Remplaza el código de JavaScript.
 *
 * @function
 * @param {String} jsCode Código de JavaScript.
 * @returns {String} Valor remplazado.
 * @api
 */
export const escapeJSCode = (jsCode) => {
  let validValue;

  validValue = jsCode.replace(/(<\s*script[^>]*>)+[^<]*(<\s*\/\s*script[^>]*>)+/ig, '');
  validValue = validValue.replace(/(('|')\s*\+\s*)?\s*eval\s*\(.*\)\s*(\+\s*('|'))?/ig, '');

  return validValue;
};

/**
 * Esta función permite el desplazamiento con el modo táctil.
 *
 * @function
 * @param {HTMLElement} elem Elemento HTML.
 * @api
 */
export const enableTouchScroll = (elem) => {
  const elemParam = elem;
  if ('ontouchstart' in document) {
    let scrollStartPos = 0;

    elemParam.addEventListener('touchstart', (evt) => {
      scrollStartPos = elemParam.scrollTop + evt.touches[0].pageY;
    });

    elemParam.addEventListener('touchmove', (evt) => {
      elemParam.scrollTop = scrollStartPos - evt.touches[0].pageY;
    });
  }
};

/**
 * Esta función transforma el color RGB a hexadecimal.
 *
 * @function
 * @param {String} rgbColor Color RGB.
 * @returns {String} Color Hexadecimal.
 * @api
 */
export const rgbToHex = (rgbColor) => {
  let hexColor;
  try {
    hexColor = chroma(rgbColor)
      .hex();
  } catch (err) {
    throw err;
  }
  return hexColor;
};

/**
 * Esta función transforma el color RGBA a hexadecimal.
 *
 * @function
 * @param {String} rgbaColor Color RGBA.
 * @returns {String} Color Hexadecimal.
 * @api
 */
export const rgbaToHex = (rgbaColor) => {
  let hexColor;
  try {
    hexColor = chroma(rgbaColor)
      .hex();
  } catch (err) {
    throw err;
  }
  return hexColor;
};

/**
 * Esta función devuelve la opacidad de un color rbga.
 *
 * @function
 * @param {String} rgbaColor Color RGBA.
 * @returns {String} Opacidad.
 * @api
 */
export const getOpacityFromRgba = (rgbaColor) => {
  let opacity;

  const rgbaRegExp = /^rgba\s*\((\s*\d+\s*,){3}\s*([\d.]+)\s*\)$/;
  if (rgbaRegExp.test(rgbaColor)) {
    opacity = rgbaColor.replace(rgbaRegExp, '$2');
    try {
      opacity = parseFloat(opacity);
    } catch (err) {
      throw err;
    }
  }

  return opacity;
};

/**
 * Esta función comprueba que dos URL son iguales.
 *
 * @function
 * @param {String} url1 URL.
 * @param {String} url2 URL.
 * @returns {Boolean} Verdadero si son iguales.
 * @api
 */
export const sameUrl = (url1, url2) => {
  const url1Var = url1
    .replace(/^(.+)\/$/, '$1')
    .replace(/^(.+)\?$/, '$1');
  const url2Var = url2
    .replace(/^(.+)\/$/, '$1')
    .replace(/^(.+)\?$/, '$1');

  return url1Var.toLowerCase() === url2Var.toLowerCase();
};

/**
 * Esta función devuelve verdadero
 * si existe el tipo de geometría.
 *
 * @function
 * @param {String} type Tipo de geometría.
 * @returns {Boolean} Verdadero si existe.
 * @api
 */
export const isGeometryType = (type) => {
  const geometricTypes = [
    WKT.GEOMETRY.toLowerCase(),
    'GeometryPropertyType'.toLowerCase(),
    WKT.POINT.toLowerCase(),
    WKT.LINE_STRING.toLowerCase(),
    WKT.LINEAR_RING.toLowerCase(),
    WKT.POLYGON.toLowerCase(),
    WKT.MULTI_POINT.toLowerCase(),
    WKT.MULTI_LINE_STRING.toLowerCase(),
    WKT.MULTI_POLYGON.toLowerCase(),
    WKT.GEOMETRY_COLLECTION.toLowerCase(),
    WKT.CIRCLE.toLowerCase(),
    'pointpropertytype',
    'polygonpropertytype',
    'linestringpropertytype',
    'geometrypropertytype',
    'multisurfacepropertytype',
    'multilinestringpropertytype',
    'surfacepropertytype',
    'geometrypropertytype',
    'geometryarraypropertytype',
    'multigeometrypropertytype',
    'multipolygonpropertytype',
    'multipointpropertytype',
    'abstractgeometricaggregatetype',
    'pointarraypropertytype',
    'curvearraypropertytype',
    'solidpropertytype',
    'solidarraypropertytype',
  ];
  const typeVar = type.toLowerCase();
  return (geometricTypes.indexOf(typeVar) !== -1);
};

/**
 * Decodifica el HTML y devuelve su contenido.
 *
 * @function
 * @param {String} encodedHtml Texto codificado con entidades HTML.
 * @returns {String} Texto decodificado.
 * @api
 */
export const decodeHtml = (encodedHtml) => {
  const txtarea = document.createElement('textarea');
  txtarea.innerHTML = encodedHtml;
  return txtarea.value;
};

/**
 * Esta función devuelve el
 * contenido de un texto extraído del HTML.
 *
 * @function
 * @param {HTMLElement | String} html Cadena o elemento con etiquetas HTML.
 * @returns {String} Texto contenido por las etiquetas HTML.
 * @api
 */
export const getTextFromHtml = (html) => {
  let htmlText = html;
  if (!isString(html) && html.outerHTML) {
    htmlText = html.outerHTML;
  }
  const divElement = document.createElement('DIV');
  divElement.innerHTML = htmlText;
  return divElement.textContent || divElement.innerText || '';
};

/**
 * Esta función obtiene el inverso de un color. El inverso de un color
 * es la diferencia entre el valor hexadecimal de blanco (0xFFFFFF)
 * y el valor hexadecimal del color.
 * @function
 * @public
 * @param {string} color Color.
 * @return {string} Color inverso en formato hexadecimal.
 * @api
 */
export const inverseColor = (color) => {
  let inverseColorParam;
  if (isString(color)) {
    let hexColor = chroma(color)
      .hex();
    hexColor = hexColor.replace(/^#/, '0x');
    inverseColorParam = chroma(0xFFFFFF - hexColor)
      .hex();
  }

  return inverseColorParam;
};


/**
 * Esta función devuelve el color RGBA.
 * @function
 * @public
 * @param {string} color Color.
 * @param {number} opacity Opacidad.
 * @return {string}
 * @api
 */
export const getRgba = (color, opacity) => {
  return chroma(color)
    .alpha(opacity)
    .css();
};

/**
 * Esta función extiende un objeto.
 *
 * @public
 * @function
 * @param {Object} destParam Parámetro.
 * @param {Object} src Objeto con los índices.
 * @api
 */
export const extendsObj = (destParam = {}, src = {}) => {
  const dest = destParam;
  if (!isNullOrEmpty(src)) {
    Object.keys(src).forEach((key) => {
      let value = src[key];
      if (isArray(value)) {
        value = [...value];
      } else if (isObject(value)) {
        value = extendsObj({}, value);
      }
      if (isNullOrEmpty(dest[key])) {
        dest[key] = value;
      } else if (isObject(dest[key])) {
        extendsObj(dest[key], value);
      }
    });
  }
  return dest;
};

/**
 * Esta función devuelve una matriz con rupturas entre el principio y el final de una matriz.
 * @function
 * @public
 * @param {array} array Matriz.
 * @param {number} breaks Punto de ruptura.
 * @return {array} Intervalo.
 * @api
 */
export const generateIntervals = (array, breaks) => {
  let intervals = [...array];
  if (array.length < breaks) {
    const step = (array[0] + array[1]) / (breaks - 1);
    for (let i = 1; i < breaks - 1; i += 1) {
      intervals[i] = step * i;
    }
    intervals = [...intervals, array[1]];
  }
  return intervals;
};

/**
 * Esta función devuelve la diferencia en el orden de estilos.
 * @function
 * @public
 * @param {M.Style} style Estilo.
 * @param {M.Style} style2 Estilo.
 * @return {number} Orden de estilos, 0 si tienen el mismo.
 * @api
 */
export const styleComparator = (style, style2) => {
  return style.ORDER - style2.ORDER;
};

/**
 * Esta función devuelve el tamaño de una imagen.
 * @function
 * @public
 * @param {string} url URL.
 * @return {Array<number>} Promesa, array con el tamaño de la imagen.
 * @api
 */
export const getImageSize = (url) => {
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.src = url;
  });
};

/**
 * Esta función remplaza funciones en cadenas de texto.
 * @function
 * @public
 * @param {object} objParam Objeto con cadenas de texto.
 * @return {obj} Devuelve las funciones.
 * @api
 */
export const stringifyFunctions = (objParam) => {
  let obj;
  if (isArray(objParam)) {
    obj = [...objParam];
    obj = obj.map(stringifyFunctions);
  } else if (isObject(objParam)) {
    obj = extendsObj({}, objParam);
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      if (isFunction(val)) {
        obj[key] = `{{f}}${val.toString()}`;
      } else if (isObject(val)) {
        obj[key] = stringifyFunctions(val);
      }
    });
  } else if (isFunction(objParam)) {
    obj = `{{f}}${objParam.toString()}`;
  } else {
    obj = objParam;
  }
  return obj;
};

/**
 * Esta función crea funciones dentro de cadenas.
 * @function
 * @public
 * @param {String} objParam Cadena con la función.
 * @return {obj}
 * @api
 */
export const defineFunctionFromString = (objParam) => {
  let obj = objParam;
  if (/^\{\{f\}\}/.test(objParam)) {
    const functionStr = objParam.replace(/^\{\{f\}\}(.+)/, '$1');
    /* eslint-disable */
    obj = new Function('f', `return ${functionStr}`)();
  } else {
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      if (/^\{\{f\}\}/.test(val)) {
        const functionStr = val.replace(/^\{\{f\}\}(.+)/, '$1');
        /* eslint-disable */
        obj[key] = new Function('f', `return ${functionStr}`)();
        /* eslint-enable */
      } else if (isObject(val)) {
        defineFunctionFromString(val);
      }
    });
  }
  return obj;
};


/**
 * Esta función devuelve verdadero si algún valor de objeto es función o "{{*}}".
 * @function
 * @public
 * @param {object} obj Valor.
 * @return {bool} Verdadero si algún valor de objeto es función o "{{*}}".
 * @api
 */
export const isDynamic = (obj) => {
  let flag = false;
  if (!Array.isArray(obj) && typeof obj === 'object' && !isNullOrEmpty(obj)) {
    flag = Object.values(obj).some(val => isDynamic(val));
  } else if (typeof obj === 'function' || (typeof obj === 'string' && /\{\{.*\}\}/.test(obj))) {
    flag = true;
  }
  return flag;
};

/**
 * Este parámetro representa la imagen src de la leyenda dinámica.
 * @const
 * @type {string}
 */
let dynamicLegend = dynamicImage;

/**
 * Esta función establece la leyenda dinámica constante.
 * @function
 * @public
 * @param {String} legend URL.
 * @api
 */
export const setDynamicLegend = (legend) => {
  dynamicLegend = legend;
};

/**
 * Esta función dibuja en un "canvas" que es dinámico.
 * @function
 * @public
 * @param {HTMLCanvasElement} canvas "Canvas".
 * @return {String} Devuelve el valor de "dynamicLegend".
 * @api
 */
export const drawDynamicStyle = (canvas) => {
  return dynamicLegend;
};

/**
 * Esta función calcula la extensión envolvente
 * de los alcances proporcionados por el usuario.
 * @function
 * @public
 * @param {Array<Array<Number>>} extents Extensión.
 * @return {Array<Number>} Alcance.
 * @api
 */
export const getEnvolvedExtent = (extents) => {
  let envolvedExtent = null;

  if (!isNullOrEmpty(extents)) {
    envolvedExtent = [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ];
    extents.forEach((extent) => {
      if (!isNullOrEmpty(extent)) {
        envolvedExtent[0] = Math.min(envolvedExtent[0], extent[0]);
        envolvedExtent[1] = Math.min(envolvedExtent[1], extent[1]);
        envolvedExtent[2] = Math.max(envolvedExtent[2], extent[2]);
        envolvedExtent[3] = Math.max(envolvedExtent[3], extent[3]);
      }
    });
  }

  return envolvedExtent;
};


/**
 * Esta función transforma "bytes" a Base64.
 * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
 * @public
 * @function
 * @param {Array} bytes Matriz con "bytes".
 * @param {String} format Formato de la imagen, por defecto image/png.
 * @return {String} Base64.
 * @api
 */
export const bytesToBase64 = (bytes, format = 'image/png') => {
  const base64abc = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/',
  ];
  let result = '';
  let i;
  const l = bytes.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
    result += base64abc[bytes[i] & 0x3F];
  }
  if (i === l + 1) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 0x03) << 4];
    result += '==';
  }
  if (i === l) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[(bytes[i - 1] & 0x0F) << 2];
    result += '=';
  }
  return `data:${format};base64,${result}`;
};

/**
 * Esta función transforma datos a "unit8" .
 * @function
 * @param {File|ArrayBuffer|Response|Uint8Array} data Datos que se quieren transformar.
 * @return {Uint8Array} Matriz con datos "unit8".
 */
export const getUint8ArrayFromData = (data) => {
  return new Promise((resolve, reject) => {
    let uint8Array = new Uint8Array();
    if (data instanceof ArrayBuffer) {
      uint8Array = new Uint8Array(data);
      resolve(uint8Array);
    } else if (data instanceof File) {
      data.arrayBuffer().then((buffer) => {
        uint8Array = new Uint8Array(buffer);
        resolve(uint8Array);
      });
    } else if (data instanceof Response) {
      resolve(data.arrayBuffer().then(getUint8ArrayFromData));
    } else if (data instanceof Uint8Array) {
      resolve(data);
    } else {
      resolve(uint8Array);
    }
  });
};

/**
 * Esta función lee un JSON.
 * @param {Object} file JSON.
 * @return {Object} Devuelve el JSON leído, promesa.
 */
export const readJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onload = () => {
      const json = JSON.parse(reader.result);
      resolve(json);
    };
    try {
      reader.readAsText(file);
    } catch (e) {
      resolve(null);
    }
  });
};

/**
 * Esta función obtiene un color de escala de matriz en formato hexadecimal.
 * @function
 * @public
 * @param {String} colors Color.
 * @param {String} numberClasses Número del color.
 * @return {Array<string>} Color de escala de matriz en formato hexadecimal.
 * @api
 */
export const generateColorScale = (colors, numberClasses) => {
  return chroma.scale(colors).colors(numberClasses);
};

/**
 * Esta función modifica el archivo SVG de colores.
 * @function
 * @public
 * @param {String} url URL.
 * @param {Object} options Opciones.
 * @return {String} SVG base64.
 * @api
 */
export const modifySVG = (url, options) => {
  return remoteGet(url).then((response) => {
    let result = '';
    try {
      const tags = (options.icon.tag) ?
        options.icon.tag : ['path', 'circle', 'ellipse', 'line', 'polygon', 'polyline', 'rect', 'foreignObject'];

      const svg = Array.from(response.xml.getElementsByTagName('svg'))[0];
      const strokeMiddle = options.icon.stroke && options.icon.stroke.width ?
        options.icon.stroke.width : 1;
      let width = svg.getAttribute('width') ? svg.getAttribute('width').replace(/[^0-9.]/g, '') : null;
      let height = svg.getAttribute('height') ? svg.getAttribute('height').replace(/[^0-9.]/g, '') : null;
      if (svg.getAttribute('viewBox')) {
        const viewSplit = svg.getAttribute('viewBox').split(' ');
        if (!width) {
          svg.setAttribute('width', viewSplit[2]);
          width = viewSplit[2];
        }
        if (!height) {
          svg.setAttribute('height', viewSplit[3]);
          height = viewSplit[3];
        }
      }
      if (options.icon.stroke && strokeMiddle && width && height) {
        if (!svg.getAttribute('viewBox')) {
          svg.setAttribute('viewBox', `${-strokeMiddle} ${-strokeMiddle} ${Math.ceil(Number(width)) + (2 * strokeMiddle)} ${Number(height) + (2 * strokeMiddle)}`);
        } else {
          const viewSplit = svg.getAttribute('viewBox').split(' ');
          svg.setAttribute('viewBox', `${-strokeMiddle} ${-strokeMiddle} ${Math.ceil(Number(viewSplit[2])) + (2 * strokeMiddle)} ${Number(viewSplit[3]) + (2 * strokeMiddle)}`);
        }
      }

      tags.forEach((tag) => {
        Array.from(response.xml.getElementsByTagName(tag)).forEach((element) => {
          element.classList.remove(...element.classList);
          if (options.icon.fill && options.icon.fill.color) element.setAttribute('fill', options.icon.fill.color);
          if (options.icon.fill && options.icon.fill.opacity) element.setAttribute('fill-opacity', options.icon.fill.opacity);
          if (options.icon.stroke && options.icon.stroke.color) element.setAttribute('stroke', options.icon.stroke.color);
          if (options.icon.stroke && strokeMiddle) element.setAttribute('stroke-width', strokeMiddle);
        });
      });

      Array.from(response.xml.getElementsByTagName('g')).forEach((element) => {
        if (options.icon.stroke && strokeMiddle) {
          element.removeAttribute('clip-path');
        }
      });
      // eslint-disable-next-line
      result = 'data:image/svg+xml,'.concat(encodeURIComponent(new XMLSerializer().serializeToString(response.xml, 'text/xml')));
      /* eslint-disable no-empty */
    } catch (err) {}
    return result;
  });
};

/**
 * Esta función proporciona movimiento a un contendor HTML.
 * @function
 * @param {String} elmntID Identificador del elemento que se quiere mover.
 * @param {Object} buttonID Identificador del botón.
 * @api
 */
export const dragElement = (elmntID, buttonID) => {
  document.getElementById(buttonID).onmousedown = (eventMouseDown) => {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    const elmnt = document.getElementById(elmntID);
    const evtMouseDown = eventMouseDown || window.event;
    evtMouseDown.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = evtMouseDown.clientX;
    pos4 = evtMouseDown.clientY;
    document.onmouseup = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };
    // call a function whenever the cursor moves:
    document.onmousemove = (eventMouseMove) => {
      const evtMouseMove = eventMouseMove || window.event;
      evtMouseMove.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - evtMouseMove.clientX;
      pos2 = pos4 - evtMouseMove.clientY;
      pos3 = evtMouseMove.clientX;
      pos4 = evtMouseMove.clientY;

      // set the element's new position:
      if (!(elmnt.offsetTop - pos2 >= elmnt.parentElement.clientHeight - elmnt.clientHeight)) { elmnt.style.top = `${Math.abs(elmnt.offsetTop - pos2)}px`; }
      if (!(elmnt.offsetLeft - pos1 >= elmnt.parentElement.clientWidth - elmnt.clientWidth)) elmnt.style.left = `${Math.abs(elmnt.offsetLeft - pos1)}px`;
    };
  };
};

/**
 * Esta función codifica un objeto JSON en base64
 * @function
 * @param {Object} JSON
 * @api
 */
export const encodeBase64 = (json) => {
  const jsonStr = JSON.stringify(json);
  const jsonB64 = window.btoa(unescape(encodeURIComponent(jsonStr)));
  return jsonB64;
};

/**
 * Esta función decodifica un objeto en base64 a un
 * objeto JSON
 * @function
 * @param {string} base64
 * @api
 */
export const decodeBase64 = (base64) => {
  const json = JSON.parse(decodeURIComponent(escape(window.atob(base64.replace(' ', '+')))));
  return json;
};

/**
 * Esta función proporciona movimiento a un plugin.
 *
 * @function
 * @param {M.ui.Panel} panel Panel del "plugin"
 * @param {string} handleEl Elemento o selector en el que
 * comienza la interacción del arrastre
 * @api
 */
export const draggabillyPlugin = (panel, handleEl) => {
  const htmlPanel = panel.getTemplatePanel();
  let draggable = null;
  setTimeout(() => {
    draggable = new Draggabilly(htmlPanel, {
      containment: '.m-mapea-container',
      handle: handleEl,
    });

    if (!M.utils.isNull(draggable) && !panel.isCollapsed()) {
      draggable.enable();
    }

    const closeButton = htmlPanel.querySelector('.m-panel-btn');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        if (panel.isCollapsed()) {
          htmlPanel.style.removeProperty('left');
          htmlPanel.style.removeProperty('top');
          htmlPanel.style.position = 'relative';
          draggable.disable();
        } else {
          draggable.enable();
        }
      });
    }
  }, 1000);
};

/**
 * Esta función proporciona movimiento a un dialog.
 *
 * @function
 * @param {string} element Selector del elemento a mover
 * @param {string} handleEl Selemento del elemento iniciador del movimiento
 * @api
 */
export const draggabillyElement = (elem, handleEl) => {
  setTimeout(() => {
    const element = document.querySelector(elem);
    if (element !== null) {
      const draggable = new Draggabilly(element, {
        containment: 'body',
        handle: handleEl,
      });

      draggable.enable();
    }
  }, 50);
};

/**
 * Esta función devuelve las coordenadas de un elemento HTML
 * que se encuentra en el mapa (ol-overlay-container).
 *
 * @function
 * @param {String} className Clase del elemento HTML
 * @param {Array<Number>} position Coordenadas del elemento HTML
 * @api
 */
export const returnPositionHtmlElement = (className, map) => {
  const element = document.querySelector(`.${className}`);
  const bounding = element.getBoundingClientRect();
  // const position = [bounding.left + (bounding.width / 2), bounding.top + (bounding.height / 2)];
  // return map.getMapImpl().getCoordinateFromPixel(position);
  // ---
  const container = map.getMapImpl().getViewport().getBoundingClientRect();
  // eslint-disable-next-line no-mixed-operators
  const pixelX = bounding.left - container.left + bounding.width / 2;
  // eslint-disable-next-line no-mixed-operators
  const pixelY = bounding.top - container.top + bounding.height / 2;

  const position = map.getMapImpl().getCoordinateFromPixel([pixelX, pixelY]);

  return position;
};

/**
 * Esta funcion fusiona todos los canvas del mapa en uno solo
 * @param {M.map} map
 * @param {String} imageType
 * @returns {HTMLCanvasElement} canvas resultante
 */
export const joinCanvas = (map, imageType) => {
  const canvasList = map.getMapImpl().getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer');
  if (canvasList.length === 1) {
    return canvasList[0];
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const mapImpl = map.getMapImpl();
  const size = mapImpl.getSize();
  canvas.width = size[0];
  canvas.height = size[1];
  if (/jp.*g$/.test(imageType)) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  canvasList.forEach((c) => {
    if (c.width) {
      ctx.save();
      // opacity
      if (c.parentNode.style.opacity === '0') {
        return;
      }
      ctx.globalAlpha = parseFloat(c.parentNode.style.opacity) || 1;
      // Blend mode & filter
      ctx.globalCompositeOperation = c.parentNode.style.mixBlendMode;
      ctx.filter = c.parentNode.style.filter;
      // transform
      let tr = c.style.transform || c.style.webkitTransform;
      if (/^matrix/.test(tr)) {
        tr = tr.replace(/^matrix\(|\)$/g, '').split(',');
        tr.forEach((t, i) => {
          tr[i] = parseFloat(t);
        });
        ctx.transform(tr[0], tr[1], tr[2], tr[3], tr[4], tr[5]);
        ctx.drawImage(c, 0, 0);
      } else {
        ctx.drawImage(c, 0, 0, c.width, c.height);
      }
      ctx.restore();
    }
  });
  return canvas;
};

/**
 * Esta función devuelve una captura de pantalla del mapa
 * @function
 * @param {M.Map} map
 * @param {HTMLCanvasElement} canva
 * @api
 * @returns {String} Imagen en base64
 */
export const getImageMap = (map, type = 'image/jpeg', canva) => {
  const canvas = canva || joinCanvas(map, type);
  let img = null;
  if (canvas) {
    try {
      img = canvas.toDataURL(type);
    } catch (e) {
      throw e;
    }
  }
  return img;
};

/**
 * Esta función copia una imagen en el portapapeles
 * @function
 * @param {HTMLCanvasElement} canvas
 * @api
 */
export const copyImageClipBoard = (map, canva) => {
  const canvas = canva || map.getMapImpl().getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer')[0];
  if (canvas) {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          const item = new window.ClipboardItem({ 'image/png': blob });
          window.navigator.clipboard.write([item]).then(() => {
            // eslint-disable-next-line no-console
            console.log('Image copied to clipboard');
          }).catch((err) => {
            // eslint-disable-next-line no-console
            console.error('Error copying image to clipboard:', err);
          });
        }
      });
    } catch (e) {
      throw e;
    }
  }
};

/**
 * Esta función detecta en un texto los enlaces.
 * @returns {Array<String>} Matriz de enlaces.
 * @function
 * @api
 */
export const findUrls = (content) => {
  const regexURL = /(^|\s)(https?:\/\/[^\s<>"']+)/g;
  const urls = content.match(regexURL);
  return urls || [];
};

/**
 * Esta función transforma los enlaces a etiquetas HTML.
 * @param {String} text Texto para realizar la transformación.
 * @param {Object} pSizes Objeto con los tamaños definidos para cada tipo de contenido.
 * @function
 * @returns {String} Resultado de la transformación
 * @api
 */
export const transfomContent = (text, pSizes = {}) => {
  let content = text;
  const urls = findUrls(content);
  urls.forEach((url) => {
    const lastCharacter = url.slice(-1);
    const validCharacters = /^[a-zA-Z0-9]+$/;
    let aux = '';
    // eslint-disable-next-line no-param-reassign
    url = url.trim();
    if (!validCharacters.test(lastCharacter)) {
      aux = lastCharacter;
      // eslint-disable-next-line no-param-reassign
      url = url.slice(0, -1);
    }

    const sizes = {
      images: pSizes.images || ['120px', '75px'],
      videos: pSizes.videos || ['500px', '300px'],
      documents: pSizes.documents || ['500px', '300px'],
      audios: pSizes.audios || ['250px', '40px'],
    };

    const regexImg = /\.(jpg||jpeg|png|gif|svg)$/i;
    const regexDocument = /\.(pdf||txt|json|geojson)$/i;
    const regexVideo = /\.(mp4|mov|3gp)$/i;
    const regexAudio = /\.(mp3|ogg|ogv|wav)$/i;
    if (regexImg.test(url)) {
      content = content.replace(`${url}${aux}`, `</br><img src='${url}' style='max-width: ${sizes.images[0]}; max-height: ${sizes.images[1]};'/></br>${aux}`);
    } else if (regexDocument.test(url)) {
      content = content.replace(`${url}${aux}`, `</br><iframe src='${url}' width='${sizes.documents[0]}' height='${sizes.documents[1]}'></iframe></br>${aux}`);
    } else if (regexVideo.test(url)) {
      content = content.replace(`${url}${aux}`, `</br><video style='max-width: ${sizes.videos[0]}; max-height: ${sizes.videos[1]}' controls><source src='${url}'>
        <p>${getValue('exception').browser_video}</p></video></br>${aux}`);
    } else if (regexAudio.test(url)) {
      content = content.replace(`${url}${aux}`, `</br><audio style='max-width: ${sizes.audios[0]}; max-height: ${sizes.audios[1]}'controls><source src='${url}'>${getValue('exception').browser_audio}</audio></br>${aux}`);
    } else {
      content = content.replace(`${url}${aux}`, `<a href=${url}>${url}</a>${aux}`);
    }
  });
  return content;
};

/**
 * Converts Openlayers features to Mapea features.
 * @public
 * @function
 * @api
 * @param {Array<OL.Feature>} implFeatures
 * @returns {Array<M.Feature>}
 */
const featuresToFacade = (implFeatures) => {
  return implFeatures.map((feature) => {
    const newFeature = new M.Feature(feature.getId(), {
      geometry: {
        coordinates: feature.getGeometry().getCoordinates(),
        type: feature.getGeometry().getType(),
      },
    });
    return newFeature;
  });
};

/**
 * Loads GeoJSON layer
 * @public
 * @function
 * @param {*} source2 -
 */
const loadGeoJSONLayer = (source, projection) => {
  let features = new ol.format.GeoJSON()
    .readFeatures(source, { featureProjection: projection });

  features = featuresToFacade(features);
  features = features.filter((f) => {
    return f.getGeometry() !== null;
  });

  return features;
};

/**
 * Loads GeoJSON layer
 * @public
 * @function
 * @param {*} source-
 */
const loadAllInGeoJSONLayer = (sources, projection) => {
  let features = [];
  sources.forEach((source) => {
    const localFeatures = loadGeoJSONLayer(source, projection);
    if (localFeatures !== null && localFeatures !== undefined && localFeatures.length > 0) {
      features = features.concat(localFeatures);
    }
  });
  return features;
};

/**
 * Loads KML layer
 * @public
 * @function
 * @api
 * @param {*} source -
 * @param {*} extractStyles -
 */
const loadKMLLayer = (source, projection, extractStyles) => {
  let features = new ol.format.KML({ extractStyles })
    .readFeatures(source, { featureProjection: projection });
  features = featuresToFacade(features);
  return features;
};

/**
 * Loads GPX layer.
 * @public
 * @function
 * @api
 * @param {*} source -
 * @param {String} projection proyeccion del mapa
 */
const loadGPXLayer = (source, projection) => {
  let features = [];
  const origFeatures = new ol.format.GPX()
    .readFeatures(source, { featureProjection: projection });
  origFeatures.forEach((f) => {
    if (f.getGeometry().getType() === 'MultiLineString') {
      if (f.getGeometry().getLineStrings().length === 1) {
        const geom = f.getGeometry().getLineStrings()[0];
        f.setGeometry(geom);
      }
    }

    features.push(f);
  });
  features = featuresToFacade(features);
  return features;
};

/**
 * Parsea las superficies de un GML 3.2
 * @private
 * @function
 * @param {*} source-
 */
const parseSurfacesGml = (source) => {
  const surfaces = [];
  const xmlDoc = new DOMParser().parseFromString(source, 'text/xml');
  const surfaceNodes = xmlDoc.querySelectorAll('Surface');
  surfaceNodes.forEach((s) => {
    surfaces.push({ surface: s, id: '', sistema: '' });
  });
  return surfaces;
};

/**
 * Obtiene los nodos de los diferentes tipos de geometrias de un GML 3.2
 * @private
 * @function
 * @param {*} source
 * @returns {Array} array de geometrias
 */
const parseGeometriesGml = (source) => {
  const geometries = [];
  const xmlDoc = new DOMParser().parseFromString(source, 'text/xml');
  const points = xmlDoc.querySelectorAll('Point');
  const lines = xmlDoc.querySelectorAll('LineString');
  const polygons = xmlDoc.querySelectorAll('Polygon');

  points.forEach((p) => {
    geometries.push({
      surface: p,
      id: '',
      sistema: '',
      type: 'Point',
    });
  });

  lines.forEach((l) => {
    geometries.push({
      surface: l,
      id: '',
      sistema: '',
      type: 'LineString',
    });
  });

  polygons.forEach((p) => {
    geometries.push({
      surface: p,
      id: '',
      sistema: '',
      type: 'Polygon',
    });
  });
  return geometries;
};

/**
 * Obtiene el sistema de referencia de un GML 3.2
 * @private
 * @function
 * @param {*} superficies
 * @returns {Array} array de superficies
 */
const getEPSGFromGML32 = (superficies) => {
  superficies.map((superficie) => {
    const superficieAux = superficie;
    let coordSystem = superficie.surface.getAttribute('srsName');
    if (coordSystem.indexOf('EPSG::326') > -1) {
      const projectionNumber = parseInt(coordSystem.substring(coordSystem.indexOf('::') + 2, coordSystem.length), 10) - 6800;
      coordSystem = `EPSG::${projectionNumber}`;
    } else if (coordSystem.indexOf('::') === -1) {
      if (coordSystem.indexOf('opengis.net/def/crs')) {
        const projectionType = coordSystem.indexOf('258') === -1 ? coordSystem.indexOf('326') : coordSystem.indexOf('258');
        coordSystem = `EPSG::${coordSystem.substring(projectionType, coordSystem.length)}`;
      }
    } else {
      coordSystem = coordSystem.substring(coordSystem.indexOf('EPSG'), coordSystem.length);
    }
    superficieAux.sistema = coordSystem.replace('::', ':');
    return superficieAux;
  });
  return superficies;
};

/**
 * Obtiene las coordenadas de una lista de vertices de un GML 3.2
 * @private
 * @function
 * @param {String} posList cadena con lista e coordenadas
 * @param {String} srs sistema de coordenadas del GML
 * @param {String} projection proyección del mapa
 * @returns {Array} array de coordenadas
 */
const parseCoordinatesGML32 = (posList, srs, projection) => {
  const coords = [];
  for (let i = 0; i < posList.length; i += 2) {
    const coordsParse = [parseFloat(posList[i + 1]), parseFloat(posList[i])];
    coords.push(ol.proj.transform(coordsParse, srs, projection));
  }
  return coords;
};

/**
 * Obtiene las coordenadas de un poligono de un GML 3.2
 * @private
 * @function
 * @param {*} superficies
 * @param {String} projection proyección del mapa
 * @returns {Array} array de coordenadas
 */
const getGML32PolygonCoordinates = (superficie, projection) => {
  const exterior = superficie.surface.querySelector('exterior');
  const interior = superficie.surface.querySelectorAll('interior');
  const srs = superficie.sistema;
  const coordenadas = [];
  const coordsExterior = exterior.querySelector('posList').textContent.split(' ');
  coordenadas.push(parseCoordinatesGML32(coordsExterior, srs, projection));
  interior.forEach((i) => {
    const coordsInterior = i.querySelector('posList').textContent.split(' ');
    coordenadas.push(parseCoordinatesGML32(coordsInterior, srs, projection));
  });
  return coordenadas;
};

/**
 * Obtiene las coordenadas de una linea de un GML 3.2
 * @private
 * @function
 * @param {*} superficies
 * @param {String} projection proyección del mapa
 * @returns {Array} array de coordenadas
 */
const getGML32LineCoordinates = (superficie, projection) => {
  const srs = superficie.sistema;
  const coords = superficie.surface.querySelector('posList').textContent.split(' ');
  const coordenadas = parseCoordinatesGML32(coords, srs, projection);
  return coordenadas;
};

/**
 * Obtiene las coordenadas de un punto de un GML 3.2
 * @private
 * @function
 * @param {*} superficies
 * @param {String} projection proyección del mapa
 * @returns {Array} array de coordenadas
 */
const getGML32PointCoordinates = (superficie, projection) => {
  const srs = superficie.sistema;
  const coords = superficie.surface.querySelector('pos').textContent.split(' ');
  const coordenadas = parseCoordinatesGML32(coords, srs, projection)[0];
  return coordenadas;
};

/**
 * Obtiene las coordenadas de los features de un GML 3.2
 * @private
 * @function
 * @param {*} superficies
 * @param {String} projection proyección del mapa
 * @returns {Object}
 */
const getCoordinatesFromGML32 = (superficies, projection) => {
  const geometries = [];
  let contador = 1;
  superficies.forEach((superficie) => {
    let coordenadas = [];
    const idSuperficie = superficie.id !== '' ? superficie.id : `ID_${contador}`;
    const nombreSuperficie = superficie.id !== '' ? superficie.id : `nombre_${contador}`;
    if (superficie.type === 'Polygon') {
      coordenadas = getGML32PolygonCoordinates(superficie, projection);
    } else if (superficie.type === 'LineString') {
      coordenadas = getGML32LineCoordinates(superficie, projection);
    } else if (superficie.type === 'Point') {
      coordenadas = getGML32PointCoordinates(superficie, projection);
    }
    contador += 1;
    geometries.push({
      fichero: undefined,
      tipo: superficie.type,
      id: `${idSuperficie}`,
      coordenadas,
      nombre: `${nombreSuperficie}`,
      sistema: superficie.sistema,
    });
  });
  return geometries;
};

/**
 * Parsea un GML 3.2 y obtiene sus features
 * @private
 * @function
 * @param {*} source-
 * @param {String} projection proyección del mapa
 * @returns {Array} Features del GML
 */
const gmlParser = (source, projection) => {
  const features = [];
  let superficies = parseSurfacesGml(source);
  if (superficies.length === 0) {
    superficies = parseGeometriesGml(source);
  }

  superficies = getEPSGFromGML32(superficies);
  const geometrias = getCoordinatesFromGML32(superficies, projection);

  geometrias.forEach((geometria) => {
    let geom;
    if (geometria.tipo === 'Polygon') {
      geom = new ol.geom.Polygon(geometria.coordenadas);
    } else if (geometria.tipo === 'LineString') {
      geom = new ol.geom.LineString(geometria.coordenadas);
    } else if (geometria.tipo === 'Point') {
      geom = new ol.geom.Point(geometria.coordenadas);
    }
    const newOlFeature = new ol.Feature({
      geometry: geom,
    });
    newOlFeature.setId(`GML ${features.length + 1}`);
    features.push(newOlFeature);
  });

  return features;
};

/**
 * Obtiene los features de un GML
 * @public
 * @function
 * @param {*} source -
 * @param {String} projection proyección del mapa
 * @returns {Array} Features del GML
 */
const loadGMLLayer = (source, projection) => {
  let newSource = source;
  let srs = projection;
  if (newSource.indexOf('srsName="GCS_WGS_1984"') > -1) {
    newSource = newSource.replace(/srsName="GCS_WGS_1984"/gi, 'srsName="EPSG:4326"');
  }

  if (newSource.indexOf('cp:geometry') > -1) {
    newSource = newSource.replace(/cp:geometry/gi, 'ogr:geometryProperty');
  }

  if (newSource.indexOf('certificacion:the_geom') > -1) {
    newSource = newSource.replace(/certificacion:the_geom/gi, 'ogr:geometryProperty');
  }

  if (newSource.split('srsName="')[1].split('"')[0].indexOf('http') > -1) {
    try {
      srs = `EPSG:${newSource.split('srsName="')[1].split('#')[1].split('"')[0]}`;
    } catch (err) {
      srs = `EPSG:${newSource.split('srsName="')[1].split('/EPSG/')[1].split('/')[1]}`;
    }
  } else if (newSource.split('srsName="')[1].indexOf('crs:EPSG::') > -1) {
    srs = `EPSG:${newSource.split('srsName="')[1].split('::')[1].split('"')[0]}`;
  } else {
    srs = newSource.split('srsName="')[1].split('"')[0];
  }

  if (newSource.indexOf('<member>') > -1) {
    newSource = newSource.replace(/member/gi, 'gml:featureMember');
  } else if (newSource.indexOf('<wfs:member>') > -1) {
    newSource = newSource.replace(/wfs:member/gi, 'gml:featureMember');
  } else if (newSource.indexOf('<ogr:featureMember>') > -1) {
    newSource = newSource.replace(/ogr:featureMember/gi, 'gml:featureMember');
  }

  let features = new ol.format.WFS({ gmlFormat: new ol.format.GML2() }).readFeatures(newSource, {
    dataProjection: srs,
    featureProjection: projection,
  });

  features = features.map((f, index) => {
    const newF = f;
    if (!f.getGeometry()) {
      newF.setGeometry(f.get('geometry'));
    }

    return newF;
  });

  if (features.length === 0 || features[0].getGeometry() === undefined) {
    features = new ol.format.WFS({ gmlFormat: new ol.format.GML3() }).readFeatures(newSource, {
      dataProjection: srs,
      featureProjection: projection,
    });

    features = features.map((f, index) => {
      const newF = f;
      if (!f.getGeometry()) {
        newF.setGeometry(f.get('geometry'));
      }
      return newF;
    });
  }

  // En el caso de que no tenga geometrías, comprobamos si es GML 3.2,
  // si lo es tenemos que parsearlo a mano.
  if ((features.length === 0 || features[0].getGeometry() === undefined) &&
    newSource.indexOf('gml/3.2') > 0) {
    features = gmlParser(newSource, projection);
  }

  features = featuresToFacade(features);
  return features;
};

/**
 * Esta función ordena el bbox dependiendo del sistema de referencia.
 * @param {Object} bbox Bbox.
 * @param {String} epsg EPSG del bbox.
 * @function
 * @returns {Array} bbox.
 * @api
 */
export const ObjectToArrayExtent = (bbox, epsg) => {
  const { def } = M.impl.ol.js.projections.getSupportedProjs()
    .filter(proj => proj.codes.includes(epsg))[0];

  const typeCoordinates = def.includes('+proj=longlat');

  if (typeCoordinates) {
    return [bbox.y.min, bbox.x.min, bbox.y.max, bbox.x.max];
  }
  return [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
};

/**
 * Esta función añade al mapa una capa vector con los features
 * de un fichero
 * @param {M.map} map
 * @param {Object} source fichero a cargar
 * @param {String} layerName nombre del nuevo layer
 * @param {String} fileExt extension del fichero
 * @function
 * @api
 */
export const loadFeaturesFromSource = (map, source, layerName, fileExt) => {
  try {
    let features = [];
    const projection = map.getProjection().code;
    if (fileExt === 'zip') {
      // In case of shp group, this unites features
      const geojsonArray = [].concat(shp.parseZip(source));
      features = loadAllInGeoJSONLayer(geojsonArray, projection);
    } else if (fileExt === 'kml') {
      features = loadKMLLayer(source, projection, false);
    } else if (fileExt === 'gpx') {
      features = loadGPXLayer(source, projection);
    } else if (fileExt === 'geojson' || fileExt === 'json') {
      features = loadGeoJSONLayer(source, projection);
    } else if (fileExt === 'gml') {
      features = loadGMLLayer(source, projection);
    } else {
      M.dialog.error(getValue('exception').file_load);
      return;
    }
    if (features.length === 0) {
      M.dialog.info(getValue('exception').no_geoms);
    } else {
      const layer = new M.layer.Vector({ name: layerName, legend: layerName, extract: true });
      layer.addFeatures(features);
      map.addLayers(layer);
    }
  } catch (error) {
    console.log(error);
    M.dialog.error(getValue('exception').file_load_correct);
  }
};

/**
 * Esta función añade al mapa una capa vector con los features
 * de un fichero
 * @param {M.map} map
 * @param {Object} file fichero del que se obtienen los features
 * @function
 */
const loadFileLayer = (map, file) => {
  // eslint-disable-next-line no-bitwise
  const fileExt = file.name.slice((file.name.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
  const layerName = file.name.split('.').slice(0, -1).join('.');
  const fileReader = new window.FileReader();
  fileReader.addEventListener('load', (e) => {
    loadFeaturesFromSource(map, fileReader.result, layerName, fileExt);
  });

  if (fileExt === 'zip') {
    fileReader.readAsArrayBuffer(file);
  } else if (fileExt === 'kml' || fileExt === 'gpx' || fileExt === 'geojson' || fileExt === 'gml' || fileExt === 'json') {
    fileReader.readAsText(file);
  } else {
    M.dialog.error(getValue('exception').file_extension);
  }
};

/**
 * Esta función añade al mapa una capa vector con los features
 * de un fichero
 * @param {M.map} map
 * @param {Object} file fichero del que se obtienen los features
 * @function
 * @api
 */
export const addFileToMap = (map, file) => {
  if (!isNullOrEmpty(file)) {
    if (file.size > 20971520) {
      M.dialog.info(getValue('exception').file_size);
    } else {
      loadFileLayer(map, file);
    }
  }
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
