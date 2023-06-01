/**
 * Este fichero es el punto de entrada de la API, sirve para inicializar las clases de la API-CNIG.
 * @module M
 */
import 'assets/css/fonts';
import 'assets/css/animations';
import 'impl/projections';
import MapImpl from 'impl/Map';
import Map from 'M/Map';
import 'assets/css/ign';
import { isNullOrEmpty } from './util/Utils';
import Exception from './exception/exception';
import './util/Window';
import './util/polyfills';
import { getValue } from './i18n/language';

/**
 * Esta función establece las variables de configuración.
 *
 * @function
 * @param {String} configKey Clave de la variable de configuración.
 * @param {*} configValue Valor de la variable de configuración.
 * @api
 */
export const config = (configKey, configValue) => {
  config[configKey] = configValue;
};

/**
 * Esta función crea un nuevo mapa usando los parámetros
 * especificado por el usuario.
 *
 * @function
 * @param {string|Mx.parameters.Map} parameters Para construir el mapa.
 * @param {Mx.parameters.MapOptions} options Opciones personalizadas para construir el mapa.
 * @returns {M.Map}
 * @api
 */
export const map = (parameters, options) => {
  // checks if the user specified an implementation
  if (isNullOrEmpty(MapImpl)) {
    Exception(getValue('exception').no_impl);
  }
  return new Map(parameters, options);
};

/**
 * Indica si el proxy es habilitado para usar.
 * @const
 * @type {boolean}
 * @public
 * @api
 */
export let useproxy = true;

/**
 * Esta función habilita/deshabilita el proxy
 *
 * @public
 * @function
 * @param {boolean} enable Indica si se habilita/deshabilita el proxy.
 * @api
 */
export const proxy = (enable) => {
  if (typeof enable === 'boolean') {
    useproxy = enable;
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
