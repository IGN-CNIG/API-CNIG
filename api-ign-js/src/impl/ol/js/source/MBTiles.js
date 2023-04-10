/**
 * @module M/impl/source/MBTiles
 */
import XYZ from 'ol/source/XYZ';

/**
  * @classdesc
  * Fuente de la capa MBTiles para teselas que extiende de la fuente de capas para
  * datos con direcciones URL en formato XYZ.
  *
  * @api
  * @extends {ol.source.XYZ}
  */
class MBTiles extends XYZ {
  /**
    * Constructor principal de la clase.
    *
    * @constructor
    * @param {Object} opt Opciones proporcionadas por el usuario.
    * - attributions: Atribuciones.
    * - attributionsCollapsible: Indica si las atribuciones son plegables.
    * Por defecto es verdadero.
    * - cacheSize: Tamaño inicial de la caché de la tesela.
    * - crossOrigin: Atributo crossOrigin para imágenes cargadas.
    * - interpolate: Indica si utiliza valores interpolados al volver a
    * muestrear. Por defecto es verdadero.
    * - opaque: Indica si la capa es opaca. Por defecto es falso.
    * - projection: Proyección. Por defecto es 'EPSG:3857'.
    * - reprojectionErrorThreshold: Error de reproyección máximo permitido.
    * Por defecto es 0.5.
    * - maxZoom: Nivel máximo de zoom aplicable. No utilizar si se proporciona
    * el parámetro 'tileGrid'. Por defecto es 42.
    * - minZoom: Nivel mínimo de zoom aplicable. No utilizar si se proporciona
    * el parámetro 'tileGrid' Por defecto es 0.
    * - maxResolution: Máxima resolución.
    * - tileGrid: Rejilla de teselas.
    * - tileLoadFunction: Función opcional para cargar una tesela dada una url.
    * - tilePixelRatio: Proporción de píxeles utilizada por el servicio de
    * teselas. Por defecto es 1.
    * - tileSize: El tamaño de la tesela utilizado por su servicio. No utilizar
    * si se proporciona 'tileGrid'. Por defecto es [256, 256].
    * - gutter: El tamaño en píxeles del medianil alrededor de las imágenes de
    * las teselas que se ignorarán. Por defecto es 0.
    * - tileUrlFunction: Función opcional para obtener la url de la tesela dada
    * su coordenada y proyección. Es requerida si no se proporcionan los
    * parámetros 'url' o 'urls'.
    * - url: Plantilla de url.
    * - urls: Array de plantillas de url.
    * - wrapX: Indica si se envuelve el mundo horizontalmente. Por defecto
    * es verdadero.
    * - transition: Duración de la transición de opacidad para el renderizado.
    * Por defecto es 250.
    * - zDirection: Permite elegir si usar teselas con un nivel de zoom más alto o
    * más bajo entre niveles de zoom enteros. Por defecto es 0.
    * @api
    */
  constructor(opt) {
    const options = {
      ...opt,
      tileUrlFunction: MBTiles.tileUrlFunction,
    };
    super(options);
  }

  /**
    * Función por defecto para el parámetro
    * 'tileUrlFunction' para obtner la URL de la
    * tesela
    *
    * @function
    * @param {Object} c Objeto para obtener la url de la
    * tesela
    * @returns {String}
    * @public
    */
  static tileUrlFunction(c) {
    return '';
  }
}
export default MBTiles;
