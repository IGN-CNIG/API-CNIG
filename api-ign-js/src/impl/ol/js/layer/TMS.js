/**
 * @module M/impl/layer/TMS
 */
import MXYZ from './XYZ';
import * as LayerType from '../../../../facade/js/layer/Type';
import ImplMap from '../Map';

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
 * @api
 * @extends {M.impl.layer.XYZ}
 */
class TMS extends MXYZ {
  /**
   * Constructor principal de la clase. Crea una capa TMS
   * con parámetros especificados por el usuario.
   *
   * @constructor
   * @implements {M.impl.layer.Vector}
   * @param {string|Mx.parameters.TMS} userParameters Parámetros que se pasarán
   * al padre (clase Vector).
   * - URL: Url del servicio XYZ.
   * - tileSize: Tamaño de la tesela, por defecto 256.
   * - visibility: Define si la capa es visible o no.
   * - minZoom: Limitar el zoom mínimo.
   * - maxZoom: Limitar el zoom máximo.
   * - tileGridMaxZoom: Zoom máximo de la tesela en forma de rejilla.
   * - displayInLayerSwitcher: Mostrar en el selector de capas.
   * @param {Mx.parameters.LayerOptions} options Opciones personalizadas para esta capa.
   * - opacity: Opacidad de capa, por defecto 1.
   * - visibility: Define si la capa es visible o no. Verdadero por defecto.
   * - displayInLayerSwitcher:  Indica si la capa se muestra en el selector de capas.
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
   * @api stable
   */
  constructor(userParameters, options = {}, vendorOptions) {
    super(userParameters, options, vendorOptions);

    /**
     * TMS zIndex_. Indice de la capa, (+40).
     */
    this.zIndex_ = ImplMap.Z_INDEX[LayerType.TMS];

    /**
     * TMS displayInLayerSwitcher. Indica si la capa se muestra en el selector de capas.
     */
    this.displayInLayerSwitcher = userParameters.displayInLayerSwitcher !== false;
  }

  /**
   * Este método comprueba si un objeto es igual
   * a esta capa.
   *
   * @function
   * @param {Object} obj Objeto a comparar.
   * @returns {Boolean} Verdadero es igual, falso si no.
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof TMS) {
      equals = (this.name === obj.name);
    }
    return equals;
  }
}
export default TMS;
