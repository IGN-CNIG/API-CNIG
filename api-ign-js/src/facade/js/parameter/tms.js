/**
 * @module M/parameter/tms
 */
import { isNullOrEmpty, isString, normalize, isArray, isObject } from '../util/Utils';
import Exception from '../exception/exception';
import { TMS } from '../layer/Type';
import { getValue } from '../i18n/language';

const REGEXP_TMS = /TMS\*.*/;

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
 * Parses the specified user layer tms parameters to a object
 *
 * @function
 * @public
 * @api
 */
const tms = (userParameters) => {
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
    const type = TMS;
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
    let params;
    if (REGEXP_TMS.test(userParam) || isObject(userParam)) {
      params = {
        type,
        name: name(REGEXP_TMS, 3),
        url: url(REGEXP_TMS, 2),
        legend: legend(REGEXP_TMS, 1),
      };
    }
    return params;
  });
  if (!isArray(userParameters)) {
    layers = layers[0];
  }
  return layers;
};
export default tms;
