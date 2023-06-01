/**
 * @module M/layer/XYZ
 */
import XYZImpl from 'impl/layer/XYZ';
import LayerBase from './Layer';
import { isNullOrEmpty, isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import * as parameter from '../parameter/parameter';
import * as LayerType from './Type';
import { getValue } from '../i18n/language';
/**
 * @classdesc
 * Las capas XYZ son servicios de información geográfica en forma de mosaicos.
 * Cada mosaico representa una combinación de tres parámetros.
 * Las capas XYZ tienen la siguiente estructura.
 *
 * https://www.ign.es/web/catalogo-cartoteca/resources/webmaps/data/cresques/{z}/{x}/{y}.jpg
 *
 * Donde {z} especifica el nivel de zoom, {x} el número de columna y {y} el número de fila.
 *
 * @property {String} url Url del servicio XYZ.
 * @property {String} name Identificador de capa.
 * @property {String} legend Nombre asociado en el árbol de contenido, si usamos uno.
 * @property {Number} minZoom Limitar el zoom mínimo.
 * @property {Number} maxZoom Limitar el zoom máximo.
 * @property {Number} tileGridMaxZoom Zoom máximo de la tesela en forma de rejilla.
 * @property {Object} options Opciones de capa XYZ.
 *
 * @api
 * @extends {M.layer}
 */
class XYZ extends LayerBase {
  /**
   * Constructor principal de la clase. Crea una capa XYZ
   * con parámetros especificados por el usuario.
   *
   * @constructor
   * @param {string|Mx.parameters.XYZ} userParameters Parámetros para la construcción de la capa.
   * - url: URL del servicio XYZ.
   * - name: Identificador de la capa.
   * - projection: La proyección destino de la capa.
   * - visibility: Indica si la capa estará por defecto visible o no.
   * - transparent: Falso si es una capa base, verdadero en caso contrario.
   * - type: Tipo de la capa.
   * @param {Mx.parameters.LayerOptions} options Parámetros opcionales para la capa.
   * - opacity: Opacidad de la capa.
   * - visibility: Define si la capa es visible o no. Verdadero por defecto.
   * - displayInLayerSwitcher: Indica si la capa se muestra en el selector de capas.
   * - opacity: Opacidad de capa, por defecto 1.
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * <pre><code>
   * import XYZSource from 'ol/source/XYZ';
   * {
   *  opacity: 0.1,
   *  source: new XYZSource({
   *    attributions: 'xyz',
   *    ...
   *  })
   * }
   * </code></pre>
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions = {}) {
    // checks if the implementation can create XYZ
    if (isUndefined(XYZImpl)) {
      Exception(getValue('exception').xyz_method);
    }

    const parameters = parameter.layer(userParameters, LayerType.XYZ);
    /**
     * Implementación de esta capa.
     * @public
     * @implements {M.impl.layer.XYZ}
     * @type {M.impl.layer.XYZ}
     */
    const impl = new XYZImpl(userParameters, options, vendorOptions);
    // calls the super constructor
    super(parameters, impl);
    /**
     * XYZ url: Url del servicio XYZ.
     */
    this.url = parameters.url;

    /**
     * XYZ name: Identificador de capa.
     */
    this.name = parameters.name;
    /**
     * XYZ legend: Nombre asociado en el árbol de contenido, si usamos uno.
     */
    this.legend = parameters.legend;

    /**
     * XYZ minZoom: Límite del zoom mínimo.
     */
    this.minZoom = parameters.minZoom;

    /**
     * XYZ maxZoom: Límite del zoom máximo.
     */

    this.maxZoom = parameters.maxZoom;

    /**
     * XYZ tileGridMaxZoom: Zoom máximo de la tesela en forma de rejilla.
     */
    this.tileGridMaxZoom = parameters.tileGridMaxZoom;

    /**
     * XYZ options: Opciones de la capa.
     */
    this.options = options;
  }

  /**
   * Devuelve el tipo de capa.
   *
   * @function
   * @getter
   * @return {M.LayerType.XYZ} Devuelve XYZ.
   * @api
   */
  get type() {
    return LayerType.XYZ;
  }

  /**
   * Sobrescribe el tipo de capa.
   *
   * @function
   * @setter
   * @param {String} newType Nuevo tipo.
   * @api
   */
  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.XYZ)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.XYZ).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
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
    if (obj instanceof XYZ) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  }
}

export default XYZ;
