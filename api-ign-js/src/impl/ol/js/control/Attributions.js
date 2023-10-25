/**
 * @module M/impl/control/Scale
 */
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import Control from './Control';

/**
 * @classdesc
 * Agregar escala numérica.
 * @api
 */
class Attributions extends Control {
  /**
   * Constructor principal de la clase.
   *
   * @constructor
   * @param {Object} options Opciones del control.
   * - Order: Orden que tendrá con respecto al
   * resto de plugins y controles por pantalla.
   * - exactScale: Escala exacta.
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(options = {}) {
    super();
    /**
     * Map of the plugin
     * @private
     * @type {M.Map}
     */
    this.map_ = null;
  }

  /**
   * Este método agrega el control al mapa.
   *
   * @public
   * @function
   * @param {M.Map} map Mapa.
   * @param {function} template Plantilla del control.
   * @api stable
   */
  addTo(map, element) {
    const olMap = map.getMapImpl();
    olMap.getInteractions().forEach((interaction) => {
      if (interaction instanceof DoubleClickZoom) {
        this.dblClickInteraction_ = interaction;
      }
    });

    super.addTo(map, element);
  }


  /**
   * Register events in ol.Map of M.Map
   * @public
   * @function
   */
  registerEvent(type, map, callback) {
    const olMap = map.getMapImpl();

    olMap.on(type, callback);
  }

  /**
   * Esta función destruye este control, limpiando el HTML y anula el registro de todos los eventos.
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    super.destroy();
  }
}

export default Attributions;
