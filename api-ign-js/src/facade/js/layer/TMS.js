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
 * https://tms-ign-base.idee.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg
 *
 * {z} especifica el nivel de zoom; {x} el número de columna; {y} el número de fila.
 *
 * @property {String} name Identificador de capa.
 * @property {transparent} transparent Falso si es una capa base, verdadero en caso contrario.
 * @property {String} type Tipo de la capa.
 * @property {String} url Url del servicio TMS.
 * @property {Number} minZoom Zoom mínimo.
 * @property {Number} maxZoom Zoom máximo.
 * @property {Number} tileGridMaxZoom Url del servicio TMS.
 * @property {Object} options Opciones de la capa.
 * @property {Number} zindex_ Indice de la capa, (+40).
 * @property {M.impl.layer.TMS} impl_ Implementación de la capa.
 * @property {Evt} eventsManager_ Manejador de eventos.
 * @property {M.map} map_ Mapa donde se añade la capa.
 * @property {Array<Number>} userMaxExtent Extensión máxima [x.min, y.min, x.max, y.max].
 * @property {String} legend Indica el nombre que queremos que aparezca en el
 * árbol de contenidos, si lo hay.
 * @property {Array<Number>} maxExtent_ Extensión máxima.
 * @property {Boolean} displayInLayerSwitcher Indica si la capa se muestra en el selector de capas.
 * @property {Boolean} isbase Define si la capa es base.
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
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - transparent (deprecated): Falso si es una capa base, verdadero en caso contrario.
   * - maxExtent: La medida en que restringe la visualización a una región específica,
   * [x.min, y.min, x.max, y.max].
   * - legend: Indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
   * - visibility: Define si la capa es visible o no. Verdadero por defecto.
   * - displayInLayerSwitcher:  Indica si la capa se muestra en el selector de capas.
   * - tileGridMaxZoom: Zoom máximo de cuadrícula de mosaico.
   * - isBase: Indica si la capa es base o no.
   * - tileSize: Tamaño de la tesela, por defecto 256.
   * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán a
   * la implementación de la capa.
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - opacity: Opacidad de capa, por defecto 1.
   * - displayInLayerSwitcher: Indica si la capa se muestra en el selector de capas.
   * - crossOrigin: Atributo crossOrigin para las imágenes cargadas.
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

    const optionsVars = options;

    if (typeof userParameters !== 'string') {
      optionsVars.maxExtent = userParameters.maxExtent;
    }

    if (!isNullOrEmpty(parameters.crossOrigin)) {
      optionsVars.crossOrigin = parameters.crossOrigin;
    }

    /**
     * Implementación.
     * @public
     * @implements {M.impl.layer.TMS}
     * @type {M.impl.layer.TMS}
     */
    const impl = new TMSImpl(parameters, optionsVars, vendorOptions);
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
