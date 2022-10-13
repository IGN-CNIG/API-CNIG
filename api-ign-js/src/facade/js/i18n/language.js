/**
 * @module M/language
 */
import en from './en';
import es from './es';
import Exception from '../exception/exception';

import pluginsLanguage from './plugins';

/**
 * Default object with es and en internacionalization.
 *
 * @const
 * @type {object}
 */
const configuration = {
  translations: {
    en,
    es,
  },
  lang: 'es',
};

/**
 * This function sets a new language internacionalization.
 * @param {string} lang
 * @param {JSON} json
 * @public
 * @api
 */
export const addTranslation = (lang, json) => {
  configuration.translations[lang] = json;
};

/**
 * This function gets a language internacionalization.
 *
 * @param {string} lang
 * @return {JSON}
 * @public
 * @api
 */
export const getTranslation = (lang) => {
  if (lang === 'es') {
    configuration.translations[lang].attributions = pluginsLanguage.attributions.esAttributions;
    configuration.translations[lang].backimglayer = pluginsLanguage.backimglayer.esBackimglayer;
    configuration.translations[lang].beautytoc = pluginsLanguage.beautytoc.esBeautytoc;
    configuration.translations[lang].buffer = pluginsLanguage.buffer.esBuffer;
    configuration.translations[lang].calendar = pluginsLanguage.calendar.esCalendar;
    configuration.translations[lang].comparepanel = pluginsLanguage.comparepanel.esComparepanel;
    configuration.translations[lang].contactlink = pluginsLanguage.contactlink.esContactlink;
    configuration.translations[lang].fulltoc = pluginsLanguage.fulltoc.esFulltoc;
    configuration.translations[lang].geometrydraw = pluginsLanguage.geometrydraw.esGeometrydraw;
    configuration.translations[lang].georefimage = pluginsLanguage.georefimage.esGeorefimage;
    configuration.translations[lang].georefimage2 = pluginsLanguage.georefimage2.esGeorefimage2;
    configuration.translations[lang].iberpixcompare = pluginsLanguage.iberpixcompare
      .esIberpixcompare;
    configuration.translations[lang].ignsearch = pluginsLanguage.ignsearch.esIgnsearch;
    configuration.translations[lang].ignsearchlocator = pluginsLanguage.ignsearchlocator
      .esIgnsearchlocator;
    configuration.translations[lang].incicarto = pluginsLanguage.incicarto.esIncicarto;
    configuration.translations[lang].infocatastro = pluginsLanguage.infocatastro.esInfocatastro;
    configuration.translations[lang].infocoordinates = pluginsLanguage.infocoordinates
      .esInfocoordinates;
    configuration.translations[lang].information = pluginsLanguage.information.esInformation;
    configuration.translations[lang].lyrcompare = pluginsLanguage.lyrcompare.esLyrcompare;
    configuration.translations[lang].measurebar = pluginsLanguage.measurebar.esMeasurebar;
    configuration.translations[lang].mirrorpanel = pluginsLanguage.mirrorpanel.esMirrorpanel;
    configuration.translations[lang].mousesrs = pluginsLanguage.mousesrs.esMousesrs;
    configuration.translations[lang].popup = pluginsLanguage.popup.esPopup;
    configuration.translations[lang].predefinedzoom = pluginsLanguage.predefinedzoom
      .esPredefinedzoom;
    configuration.translations[lang].printermap = pluginsLanguage.printermap.esPrintermap;
    configuration.translations[lang].queryattributes = pluginsLanguage.queryattributes
      .esQueryattributes;
    // configuration.translations[lang].querydatabase = pluginsLanguage
    // .querydatabase.esQuerydatabase;
    configuration.translations[lang].rescale = pluginsLanguage.rescale.esRescale;
    configuration.translations[lang].selectiondraw = pluginsLanguage.selectiondraw.esSelectiondraw;
    configuration.translations[lang].selectionzoom = pluginsLanguage.selectionzoom.esSelectionzoom;
    configuration.translations[lang].sharemap = pluginsLanguage.sharemap.esSharemap;
    configuration.translations[lang].timeline = pluginsLanguage.timeline.esTimeline;
    configuration.translations[lang].toc = pluginsLanguage.toc.esToc;
    configuration.translations[lang].topographicprofile = pluginsLanguage.topographicprofile
      .esTopographicprofile;
    configuration.translations[lang].transparency = pluginsLanguage.transparency.esTransparency;
    configuration.translations[lang].vectors = pluginsLanguage.vectors.esVectors;
    configuration.translations[lang].viewhistory = pluginsLanguage.viewhistory.esViewhistory;
    configuration.translations[lang].xylocator = pluginsLanguage.xylocator.esXylocator;
    configuration.translations[lang].zoomextent = pluginsLanguage.zoomextent.esZoomextent;
    configuration.translations[lang].zoompanel = pluginsLanguage.zoompanel.esZoompanel;
    configuration.translations[lang].viewshed = pluginsLanguage.viewshed.esViewshed;
  } else if (lang === 'en') {
    configuration.translations[lang].attributions = pluginsLanguage.attributions.enAttributions;
    configuration.translations[lang].backimglayer = pluginsLanguage.backimglayer.enBackimglayer;
    configuration.translations[lang].beautytoc = pluginsLanguage.beautytoc.enBeautytoc;
    configuration.translations[lang].buffer = pluginsLanguage.buffer.enBuffer;
    configuration.translations[lang].calendar = pluginsLanguage.calendar.enCalendar;
    configuration.translations[lang].comparepanel = pluginsLanguage.comparepanel.enComparepanel;
    configuration.translations[lang].contactlink = pluginsLanguage.contactlink.enContactlink;
    configuration.translations[lang].fulltoc = pluginsLanguage.fulltoc.enFulltoc;
    configuration.translations[lang].geometrydraw = pluginsLanguage.geometrydraw.enGeometrydraw;
    configuration.translations[lang].georefimage = pluginsLanguage.georefimage.enGeorefimage;
    configuration.translations[lang].georefimage2 = pluginsLanguage.georefimage2.enGeorefimage2;
    configuration.translations[lang].iberpixcompare = pluginsLanguage.iberpixcompare
      .enIberpixcompare;
    configuration.translations[lang].ignsearch = pluginsLanguage.ignsearch.enIgnsearch;
    configuration.translations[lang].ignsearchlocator = pluginsLanguage.ignsearchlocator
      .enIgnsearchlocator;
    configuration.translations[lang].incicarto = pluginsLanguage.incicarto.enIncicarto;
    configuration.translations[lang].infocatastro = pluginsLanguage.infocatastro.enInfocatastro;
    configuration.translations[lang].infocoordinates = pluginsLanguage.infocoordinates
      .enInfocoordinates;
    configuration.translations[lang].information = pluginsLanguage.information.enInformation;
    configuration.translations[lang].lyrcompare = pluginsLanguage.lyrcompare.enLyrcompare;
    configuration.translations[lang].measurebar = pluginsLanguage.measurebar.enMeasurebar;
    configuration.translations[lang].mirrorpanel = pluginsLanguage.mirrorpanel.enMirrorpanel;
    configuration.translations[lang].mousesrs = pluginsLanguage.mousesrs.enMousesrs;
    configuration.translations[lang].popup = pluginsLanguage.popup.enPopup;
    configuration.translations[lang].predefinedzoom = pluginsLanguage.predefinedzoom
      .enPredefinedzoom;
    configuration.translations[lang].printermap = pluginsLanguage.printermap.enPrintermap;
    configuration.translations[lang].queryattributes = pluginsLanguage.queryattributes
      .enQueryattributes;
    // configuration.translations[lang].querydatabase = pluginsLanguage
    // .querydatabase.enQuerydatabase;
    configuration.translations[lang].rescale = pluginsLanguage.rescale.enRescale;
    configuration.translations[lang].selectiondraw = pluginsLanguage.selectiondraw.enSelectiondraw;
    configuration.translations[lang].selectionzoom = pluginsLanguage.selectionzoom.enSelectionzoom;
    configuration.translations[lang].sharemap = pluginsLanguage.sharemap.enSharemap;
    configuration.translations[lang].timeline = pluginsLanguage.timeline.enTimeline;
    configuration.translations[lang].toc = pluginsLanguage.toc.enToc;
    configuration.translations[lang].topographicprofile = pluginsLanguage.topographicprofile
      .enTopographicprofile;
    configuration.translations[lang].transparency = pluginsLanguage.transparency.enTransparency;
    configuration.translations[lang].vectors = pluginsLanguage.vectors.enVectors;
    configuration.translations[lang].viewhistory = pluginsLanguage.viewhistory.enViewhistory;
    configuration.translations[lang].xylocator = pluginsLanguage.xylocator.enXylocator;
    configuration.translations[lang].zoomextent = pluginsLanguage.zoomextent.enZoomextent;
    configuration.translations[lang].zoompanel = pluginsLanguage.zoompanel.enZoompanel;
    configuration.translations[lang].viewshed = pluginsLanguage.viewshed.enViewshed;
  }
  return configuration.translations[lang];
};

/**
 * This function gets a language value from key
 *
 * @public
 * @param {string}
 * @param {string}
 * @return {string}
 * @public
 * @api
 */
export const getValue = (key, lang = configuration.lang) => {
  return getTranslation(lang)[key];
};

/**
 * This function sets the language of the library
 *
 * @function
 * @public
 * @api
 */
export const setLang = (lang) => {
  if (!Object.keys(configuration.translations).includes(lang)) {
    Exception(getValue('exception').unsupported_lang);
  }
  configuration.lang = lang;
};

/**
 * This function gets the language of the library
 *
 * @function
 * @public
 * @api
 */
export const getLang = () => {
  return configuration.lang;
};
