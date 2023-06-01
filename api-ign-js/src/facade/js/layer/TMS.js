/**
 * @module M/layer/TMS
 */
import TMSImpl from 'impl/layer/TMS';
import LayerBase from './Layer';
import { isNullOrEmpty, isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import * as parameter from '../parameter/parameter';
import * as LayerType from './Type';
import { getValue } from '../i18n/language';
/**
 * @classdesc
 * Las capas TMS (Tile Map Service) son servicios de información geográfica en
 * forma de mosaicos muy similar a las capas XYZ. El protocolo TMS de OSGeo permite mosaicos
 * para usar índices numéricos y proporcionar metadatos para la configuración
 * e investigación. Las capas TMS tienen la siguiente estructura:
 *
 * https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg
 *
 * {z} especifica el nivel de zoom; {x} el número de columna; {y} el número de fila.
 *
 * @property {String} url Url del servicio TMS.
 * @property {String} name Identificador de capa.
 * @property {String} legend Indica el nombre que queremos que aparezca en el
 * árbol de contenidos, si lo hay.
 * @property {Number} minZoom Zoom mínimo.
 * @property {Number} maxZoom Zoom máximo.
 * @property {Number} tileGridMaxZoom Url del servicio TMS.
 * @property {Object} options Opciones de la capa.
 *
 * @api
 * @extends {M.layer}
 */
class TMS extends LayerBase {
  /**
   * Constructor principal de la clase. Crea una capa TMS
   * con parámetros especificados por el usuario.
   *
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.TMS} userParameters Parámetros para la construcción de la capa.
   * - name: Nombre de la capa en la leyenda.
   * - url: Urlque genera la capa TMS.
   * - extract: Opcional, activa la consulta por click en el objeto geográfico, por defecto falso.
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - type: Tipo de la capa.
   * - transparent: Falso si es una capa base, verdadero en caso contrario.
   * - maxExtent: La medida en que restringe la visualización a una región específica.
   * - legend: Indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
   * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán a
   * la implementación de la capa.
   * - opacity: Opacidad de capa, por defecto 1.
   * - visibility: Define si la capa es visible o no. Verdadero por defecto.
   * - displayInLayerSwitcher:  Indica si la capa se muestra en el selector de capas.
   * - opacity: Opacidad de capa, por defecto 1.
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * <pre><code>
   * import XYZSource from 'ol/source/XYZ';
   * {
   *  opacity: 0.1,
   *  source: new XYZSource({
   *    attributions: 'tms',
   *    ...
   *  })
   * }
   * </code></pre>
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions = {}) {
    // checks if the implementation can create TMS
    if (isUndefined(TMSImpl)) {
      Exception(getValue('exception').tms_method);
    }

    const parameters = parameter.layer(userParameters, LayerType.TMS);
    /**
     * Implementación.
     * @public
     * @implements {M.impl.layer.TMS}
     * @type {M.impl.layer.TMS}
     */
    const impl = new TMSImpl(parameters, options, vendorOptions);
    // calls the super constructor
    super(parameters, impl);

    /**
     * TMS url: URL del servicio TMS.
     * @public
     * @type {String}
     */
    this.url = parameters.url;

    /**
     * TMS name: Nombre de la capa.
     */
    this.name = parameters.name;

    /**
     * TMS legend. Indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
     */
    this.legend = parameters.legend;

    /**
     * TMS minzoom. Zoom mínimo.
     */
    this.minZoom = parameters.minZoom;


    /**
     * TMS maxzoom. Zoom máximo.
     */
    this.maxZoom = parameters.maxZoom;

    /**
     * TMS tileGridMaxZoom. Zoom máximo de cuadrícula de mosaico.
     */
    this.tileGridMaxZoom = parameters.tileGridMaxZoom;

    /**
     * TMS options. Opciones de capa.
     */
    this.options = options;
  }

  /**
   * Devuelve el tipo de capa, TMS.
   *
   * @function
   * @return {M.LayerType.TMS} Devuelve TMS.
   * @api
   */
  get type() {
    return LayerType.TMS;
  }

  /**
   *  Sobrescribe el tipo de capa.
   * @function
   * @param {String} newType Nuevo tipo.
   * @api
   */
  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.TMS)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.TMS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
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
    if (obj instanceof TMS) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  }
}
export default TMS;
