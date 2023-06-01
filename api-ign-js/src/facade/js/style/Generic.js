/**
 * @module M/style/Generic
 */

import GenericStyleImpl from 'impl/style/Generic';
import Simple from './Simple';
import { isNullOrEmpty, extendsObj } from '../util/Utils';

/**
 * @classdesc
 * Crea un estilo genérico.
 * @api
 * @extends {M.style.Simple}
 */
class Generic extends Simple {
  /**
   * Constructor principal de la clase.
   * @constructor
   * @param {Object} optionsVar Opciones del estilo.
   * - Point. Punto.
   * - Polygon. Polígono.
   * - Line. Linea.
   * @api
   */
  constructor(optionsVar) {
    let options = optionsVar;
    if (isNullOrEmpty(options)) {
      options = Generic.DEFAULT_NULL;
    } else {
      options = extendsObj(options, Generic.DEFAULT);
    }
    options = extendsObj({}, options);

    const impl = new GenericStyleImpl(options);
    super(options, impl);
  }

  /**
   * Transforma el "canvas" a imagen.
   *
   * @function
   * @public
   * @returns {Object} Devuelve la imagen del "canvas".
   * @api
   */
  toImage() {
    return this.getImpl().toImage(this.canvas_);
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
    return "((serializedParameters) => M.style.Simple.deserialize(serializedParameters, 'M.style.Generic'))";
  }
}

/**
 * Radio por defecto, 5.
 * @const
 * @type {object}
 * @public
 * @api
 */
Generic.DEFAULT = {
  point: {
    radius: 5,
  },
};

/**
 * Valores por defecto de los parámetros.
 * @const
 * @type {object}
 * @public
 * @api
 */
Generic.PARAMS_DEFAULT_NULL = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: '#3399CC',
    width: 1.5,
  },
};

/**
 * Valor por defecto del estilo.
 * @const
 * @type {object}
 * @public
 * @api
 */
Generic.DEFAULT_NULL = {
  point: {
    ...Generic.PARAMS_DEFAULT_NULL,
    radius: 5,
  },
  line: {
    ...Generic.PARAMS_DEFAULT_NULL,
  },
  polygon: {
    ...Generic.PARAMS_DEFAULT_NULL,
  },
};

export default Generic;
