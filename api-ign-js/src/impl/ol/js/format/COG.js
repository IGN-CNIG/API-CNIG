/**
 * @module M/impl/format/COG
 */
import GeoTIFF from 'ol/source/GeoTIFF';

/**
  * @classdesc
  * Implementación del formateador GML.
  *
  * @api
  * @extends {ol.source.GeoTIFF}
  */
class COG extends GeoTIFF {
  /**
    * Constructor principal de la clase. Formato de los objetos geográficos para
    * leer y escribir datos en formato GML.
    *
    * @constructor
    * @param {olx.format.GeoJSONOptions} options Opciones
    * @param {olx.format.GMLOptions} gmlFeatures GML (XML) con objetos geográficos.
    * @api
    */
  constructor(options = {}) {
    super(options);
  }

  /**
   * Este método devuelve los objetos geográficos en formato GML.
   * @public
   * @function
   * @param {Array<M.Feature>} gmlFeatures XML
   * @param {Mx.Projection} projection Proyección del GML.
   * @return {Array<M.Feature>} Devuelve los objetos geográficos en formato GML.
   * @api stable
   */
  read() {

  }
}

export default COG;
