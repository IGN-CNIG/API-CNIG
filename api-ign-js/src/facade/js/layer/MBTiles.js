/**
 * @module M/layer/MBTiles
 */
import MBTilesImpl from 'impl/layer/MBTiles';
import LayerBase from './Layer';
import * as LayerType from './Type';
import { isNullOrEmpty, isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import { getValue } from '../i18n/language';
import * as parameter from '../parameter/parameter';

/**
 * @classdesc
 * MBtiles es un formato que permite agrupar múltiples capas, tanto
 * vectoriales como raster, en un contenedor SQLite.
 *
 * @property {string} url Url del archivo o servicio que genera el MBTiles.
 * @property {ArrayBuffer|Uint8Array|Response|File} source Respuesta de la petición a
 * un servicio que genera el MBTiles.
 * @property {string} name Nombre de la capa, identificador.
 * @property {string} legend Leyenda de la capa.
 * @property {object} options Opciones MBTiles.
 *
 * @api
 * @extends {M.Layer}
 */
class MBTiles extends LayerBase {
  /**
   * Constructor principal de la clase. Crea una capa MBTiles
   * con parámetros especificados por el usuario.
   *
   * @constructor
   * @param {string|Mx.parameters.MBTiles} userParameters Parámetros para
   * la construcción de la capa,
   * estos parámetros los proporciona el usuario.
   * - name: Nombre de la capa en la leyenda.
   * - url: Url del fichero o servicio que genera el MBTiles.
   * - type: Tipo de la capa.
   * - maxZoomLevel: Zoom máximo aplicable a la capa.
   * - transparent: Falso si es una capa base, verdadero en caso contrario.
   * - maxExtent: La medida en que restringe la visualización a una región específica.
   * - legend: Indica el nombre que aparece en el árbol de contenidos, si lo hay.
   * - tileLoadFunction: Función de carga de la tesela proporcionada por el usuario.
   * - source: Fuente de la capa.
   * - tileSize: Tamaño de la tesela, por defecto 256.
   * - visibility: Define si la capa es visible o no. Verdadero por defecto.
   * - opacity: Opacidad de capa, por defecto 1.
   * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán a la implementación.
   * Están proporcionados por el usuario.
   * - displayInLayerSwitcher: Indica si la capa se muestra en el selector de capas.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * <pre><code>
   * import OLTileGrid from 'ol/tilegrid/TileGrid';
   * import MBTilesSource from 'M/source/MBTiles';
   * {
   *  source: new MBTilesSource({
   *    tileGrid: new OLTileGrid({
   *      extent: ...,
   *      ...
   *    })
   *  })
   * }
   * </code></pre>
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions = {}) {
    // checks if the implementation can create MBTiles
    if (isUndefined(MBTilesImpl)) {
      Exception(getValue('exception').mbtiles_method);
    }

    const parameters = parameter.layer(userParameters, LayerType.MBTiles);

    /**
     * Implementación
     * @public
     * @implements {M.impl.layer.MBTiles}
     * @type {M.impl.layer.MBTilesVector}
     */
    const impl = new MBTilesImpl(parameters, options, vendorOptions);

    // calls the super constructor
    super(parameters, impl);

    /**
     * MBTiles name: Nombre de la capa.
     */
    this.name = parameters.name;

    /**
     * MBTiles legend: Indica el nombre que aparece en el árbol
     * de contenidos, si lo hay.
     */
    this.legend = parameters.legend;

    /**
     * MBTiles source: Respuesta de la petición a un servicio que
     * genera el MBTiles.
     */
    this.source = parameters.source;

    /**
     * MBTiles url: Url del archivo o servicio que genera
     * el MBTiles.
     */
    this.url = parameters.url;

    /**
     * MBTiles options: Opciones que se mandan a la implementación.
     */
    this.options = options;
  }

  /**
   * Devuelve la leyenda de la capa.
   * La leyenda indica el nombre que aparece en el árbol de
   * contenidos, si lo hay.
   *
   * @function
   * @getter
   * @return {M.layer.MBTiles.impl.legend} Leyenda de la capa.
   * @api
   */
  get legend() {
    return this.getImpl().legend;
  }

  /**
   * Sobrescribe la leyenda de la capa.
   * La leyenda indica el nombre que aparece en el árbol de
   * contenidos, si lo hay.
   *
   * @function
   * @setter
   * @param {String} newLegend Nueva leyenda.
   * @api
   */
  set legend(newLegend) {
    if (isNullOrEmpty(newLegend)) {
      this.getImpl().legend = this.name;
    } else {
      this.getImpl().legend = newLegend;
    }
  }

  /**
   * Devuelve el tipo de capa, en este caso MBTiles.
   *
   * @function
   * @getter
   * @return {String} Tipo de capa, MBTiles.
   * @api
   */
  get type() {
    return LayerType.MBTiles;
  }

  /**
   * Sobrescribe el tipo de capa.
   *
   * @function
   * @setter
   * @param {String} newType Nuevo tipo de capa.
   * @api
   */
  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.MBTiles)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.MBTiles).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * Este método comprueba si un objeto es igual
   * a esta capa.
   *
   * @function
   * @param {Object} obj Objeto a comparar.
   * @returns {Boolean} Valor verdadero es igual, falso no lo es.
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof MBTiles) {
      equals = (this.url === obj.url);
      equals = equals && (this.source === obj.source);
      equals = equals && (this.legend === obj.legend);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  }
}
export default MBTiles;
