/**
 * @module M/i18n/plugins
 * @example import pluginsLanguage from 'M/i18n/plugins';
 */

// Ignsearchlocator
import esIgnsearchlocator from '../../../plugins/ignsearchlocator/src/facade/js/i18n/es';
import enIgnsearchlocator from '../../../plugins/ignsearchlocator/src/facade/js/i18n/en';

// Infocoordinates
import esInfocoordinates from '../../../plugins/infocoordinates/src/facade/js/i18n/es';
import enInfocoordinates from '../../../plugins/infocoordinates/src/facade/js/i18n/en';

// Measurebar
import esMeasurebar from '../../../plugins/measurebar/src/facade/js/i18n/es';
import enMeasurebar from '../../../plugins/measurebar/src/facade/js/i18n/en';

// Mousesrs
import esMousesrs from '../../../plugins/mousesrs/src/facade/js/i18n/es';
import enMousesrs from '../../../plugins/mousesrs/src/facade/js/i18n/en';

// Popup
import esPopup from '../../../plugins/popup/src/facade/js/i18n/es';
import enPopup from '../../../plugins/popup/src/facade/js/i18n/en';

// Printermap
import esPrintermap from '../../../plugins/printermap/src/facade/js/i18n/es';
import enPrintermap from '../../../plugins/printermap/src/facade/js/i18n/en';

// Zoompanel
import esZoompanel from '../../../plugins/zoompanel/src/facade/js/i18n/es';
import enZoompanel from '../../../plugins/zoompanel/src/facade/js/i18n/en';

/**
 * Este objeto devuelve un objeto JSON dinámico que contiene
 * los plugins disponibles que soportan traducciones.
 * @public
 * @const
 * @type {object}
 * @api
 */
const pluginsLanguage = {
  ignsearchlocator: {
    esIgnsearchlocator,
    enIgnsearchlocator,
  },
  infocoordinates: {
    esInfocoordinates,
    enInfocoordinates,
  },
  measurebar: {
    esMeasurebar,
    enMeasurebar,
  },
  mousesrs: {
    esMousesrs,
    enMousesrs,
  },
  popup: {
    esPopup,
    enPopup,
  },
  printermap: {
    esPrintermap,
    enPrintermap,
  },
  zoompanel: {
    esZoompanel,
    enZoompanel,
  },
};

export default pluginsLanguage;
