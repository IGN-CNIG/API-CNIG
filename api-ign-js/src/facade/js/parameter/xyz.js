/**
 * @module M/parameter/xyz
 */
import { isNullOrEmpty, isString, normalize, isArray, isObject } from '../util/Utils';
import Exception from '../exception/exception';
import { XYZ } from '../layer/Type';
import { getValue } from '../i18n/language';

const REGEXP_XYZ = /XYZ\*.*/;

/**
 * @function
 * @private
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
 * Parses the specified user layer xyz parameters to a object
 *
 * @function
 * @public
 * @api
 */
const xyz = (userParameters) => {
  let layers = [];
  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    Exception(getValue('exception').no_param);
  }
  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }
  layers = userParametersArray.map((userParam) => {
    const type = XYZ;
    const name = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'name',
    });
    const url = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'url',
    });
    const legend = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'legend',
    });
    const displayInLayerSwitcher = getParameter({
      parameter: userParam,
      type: 'boolean',
      attr: 'displayInLayerSwitcher',
    });
    let params;
    if (REGEXP_XYZ.test(userParam) || isObject(userParam)) {
      params = {
        type,
        name: name(REGEXP_XYZ, 3),
        url: url(REGEXP_XYZ, 2),
        legend: legend(REGEXP_XYZ, 1),
        displayInLayerSwitcher: displayInLayerSwitcher(REGEXP_XYZ, 4),
      };
    }
    return params;
  });
  if (!isArray(userParameters)) {
    layers = layers[0];
  }
  return layers;
};
export default xyz;
