/**
 * @module M/parameter/osm
 * @example import osmParameter from 'M/parameter/osm';
 */
import { isNullOrEmpty, isString, normalize, isArray, isObject } from '../util/Utils';
import Exception from '../exception/exception';
import * as LayerType from '../layer/Type';

/**
 * Expresión regular para el parámetro de capa OSM.
 * @const
 * @type {RegExp}
 * @public
 * @api
 */
const OSM_REGEXP = /OSM\.*/;

/**
 * Esta función devuelve el valor del parámetro.
 * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
 * @function
 * @public
 * @param {string|object} parameter Parámetro.
 * @param {string} attr Atributo del parámetro.
 * @param {string} type Tipo de dato del parámetro.
 * @param {string} separator Separador de los valores del array.
 * @param {boolean} normalized Indica si el parámetro está normalizado.
 * @return {function} Devuelve el valor del parámetro.
 * @api
 */
const getParameter = ({
  parameter,
  attr,
  type,
  separator,
  normalized = false,
}) => (regexp, position) => {
  let value;
  const parserType = {
    boolean: param => /^1|(true)$/i.test(param),
    string: param => param,
    int: param => Number.parseInt(param, 10),
    float: param => Number.parseFloat(param, 10),
    array_number: param => param.split(separator || '')
      .map(elem => elem.trim())
      .map(n => Number.parseFloat(n)),
  };

  if (isString(parameter) && regexp.test(parameter)) {
    const params = parameter.split('*');
    const param = params[position];
    if (!isNullOrEmpty(param)) {
      value = parserType[type](param);
    }
  } else if (isObject(parameter)) {
    value = parameter[attr];
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isString(value)) {
    value = value.trim();
  }
  if (normalized === true) {
    value = normalize(value);
  }
  return value;
};

/**
 * Parametriza los parámetros, controlando el tipo, ...
 * de las capas OSM.
 *
 * @param {string|Mx.parameters.Layer} userParameters Parámetros.
 * @returns {Object} Capa.
 * @public
 * @function
 * @api
 */
const osm = (userParam) => {
  let userParameters = userParam;
  let layers = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    userParameters = {
      type: LayerType.OSM,
      name: 'osm',
    };
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((param) => {
    const type = LayerType.OSM;
    const transparent = getParameter({
      parameter: param,
      type: 'boolean',
      attr: 'transparent',
    })(OSM_REGEXP, 1);


    const legend = getParameter({
      parameter: param,
      type: 'string',
      name: 'legend',
    })(OSM_REGEXP, 2);

    const name = getParameter({
      parameter: param,
      type: 'string',
      name: 'name',
    })(OSM_REGEXP, 3);

    return {
      type,
      transparent,
      legend,
      name,
    };
  });

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

export default osm;
