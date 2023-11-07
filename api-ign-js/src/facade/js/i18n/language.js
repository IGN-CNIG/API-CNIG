/**
 * @module M/language
 */
import en from './en';
import es from './es';
import Exception from '../exception/exception';

import pluginsLanguage from './plugins';

/**
 * Opciones de idiomas por defecto, (español, "es.json" o inglés, "en.json").
 * @public
 * @const
 * @type {object}
 * @api
 */
export const configuration = {
  translations: {
    en,
    es,
  },
  lang: 'es',
};

/**
 * Esta función añade un nuevo idioma.
 * @public
 * @function
 * @param {string} lang Idioma.
 * @param {JSON} json Valores, traducción.
 * @api
 */
export const addTranslation = (lang, json) => {
  configuration.translations[lang] = json;
};

/**
 * Esta función te devuelve todas las traducciones disponibles
 * en la API-CORE.
 *
 * @public
 * @function
 *
 * @param {string} lang Idioma.
 * @return {JSON} JSON con todas las traducciones.
 *
 * @api
 */
export const getTranslation = (lang) => {
  if (lang === 'es') {
    configuration.translations[lang].mousesrs = pluginsLanguage.mousesrs.esMousesrs;
    configuration.translations[lang].ignsearchlocator = pluginsLanguage.ignsearchlocator.esIgnsearchlocator;
    configuration.translations[lang].infocoordinates = pluginsLanguage.infocoordinates.esInfocoordinates;
    configuration.translations[lang].measurebar = pluginsLanguage.measurebar.esMeasurebar;
    configuration.translations[lang].mousesrs = pluginsLanguage.mousesrs.esMousesrs;
    configuration.translations[lang].popup = pluginsLanguage.popup.esPopup;
    configuration.translations[lang].printermap = pluginsLanguage.printermap.esPrintermap;
    configuration.translations[lang].zoompanel = pluginsLanguage.zoompanel.esZoompanel;
  } else if (lang === 'en') {
    configuration.translations[lang].ignsearchlocator = pluginsLanguage.ignsearchlocator.enIgnsearchlocator;
    configuration.translations[lang].infocoordinates = pluginsLanguage.infocoordinates.enInfocoordinates;
    configuration.translations[lang].measurebar = pluginsLanguage.measurebar.enMeasurebar;
    configuration.translations[lang].mousesrs = pluginsLanguage.mousesrs.enMousesrs;
    configuration.translations[lang].popup = pluginsLanguage.popup.enPopup;
    configuration.translations[lang].printermap = pluginsLanguage.printermap.enPrintermap;
    configuration.translations[lang].zoompanel = pluginsLanguage.zoompanel.enZoompanel;
  }
  return configuration.translations[lang];
};

/**
 * Esta función te devuelve una traducción dependiendo
 * del valor que se le pase por parámetros.
 *
 * @public
 * @function
 *
 * @param {string} key Nombre del control, plugin, ...
 * @param {string} lang Idioma.
 * @return {JSON} JSON con la traducción.
 * @api
 */
export const getValue = (key, lang = configuration.lang) => {
  return getTranslation(lang)[key];
};

/**
 * Esta función modifica el idioma del API-CORE.
 * @public
 * @function
 * @param {string} lang Idioma.
 * @api
 */
export const setLang = (lang) => {
  if (!Object.keys(configuration.translations).includes(lang)) {
    Exception(getValue('exception').unsupported_lang);
  }
  configuration.lang = lang;
};

/**
 * Esta función devuelve el idioma de la API-CORE.
 *
 * @function
 * @public
 * @return {String} Devuelve el idioma especificado en el archivo "configuration.lang".
 * @api
 */
export const getLang = () => {
  return configuration.lang;
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
