/**
 * @module M/i18n/plugins
 * @example import pluginsLanguage from 'M/i18n/plugins';
 */

// Mousesrs
import esMousesrs from '../../../plugins/mousesrs/src/facade/js/i18n/es';
import enMousesrs from '../../../plugins/mousesrs/src/facade/js/i18n/en';

/**
 * Este objeto devuelve un objeto JSON dinámico que contiene
 * los plugins disponibles que soportan traducciones.
 * @public
 * @const
 * @type {object}
 * @api
 */
const pluginsLanguage = {
  mousesrs: {
    esMousesrs,
    enMousesrs,
  },
};

export default pluginsLanguage;
