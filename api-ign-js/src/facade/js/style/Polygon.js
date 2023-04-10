/**
 * @module M/style/Polygon
 */
import PolygonImpl from 'impl/style/Polygon';
import Simple from './Simple';
import { isNullOrEmpty, extendsObj } from '../util/Utils';

/**
 * @classdesc
 * Crea el estilo de un polígono.
 * @api
 * @extends {M.style.Simple}
 */
class Polygon extends Simple {
  /**
   * Constructor principal de la clase.
   * @constructor
   * @param {Object} optionsParam Opciones que se pasarán a la implementación.
   * - stroke: Borde del polígono.
   *    - width: Tamaño.
   *    - pattern (name, src, color, size, spacing, rotation, scale, offset)
   *    - linedash: Línea rayada.
   *    - linejoin: Línea unidas.
   *    - linecap: Límite de la línea.
   * - label
   *    - rotate: Rotación.
   *    - offset: Desplazamiento.
   *    - stroke (color, width, linecap, linejoin, linedash)
   * - fill: Relleno.
   *    - color: Color.
   *    - opacity: Opacidad.
   *    - pattern (name, src, color, size, spacing, rotation, scale, offset)
   * - renderer: Renderizado.
   *     - property: Propiedades.
   *     - stoke (color y width).
   * @api
   */
  constructor(optionsParam = {}) {
    let options = optionsParam;

    const impl = new PolygonImpl(options);

    super(options, impl);

    if (isNullOrEmpty(options)) {
      options = Polygon.DEFAULT_NULL;
    }
    options = extendsObj({}, options);
  }

  /**
   * Deserializa el método M.style.Simple.deserialize.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @function
   * @public
   * @return {Function} Devuelve la función M.style.Simple.deserialize.
   * @api
   */
  getDeserializedMethod_() {
    return "((serializedParameters) => M.style.Simple.deserialize(serializedParameters, 'M.style.Polygon'))";
  }
}

/**
 * Estilos por defecto.
 * @const
 * @type {object}
 * @public
 * @api
 */
Polygon.DEFAULT_NULL = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: '#3399CC',
    width: 1.5,
  },
};

export default Polygon;
