/**
 * @module M/layer/KML
 */
import KMLImpl from 'impl/layer/KML';
import LayerVector from './Vector';
import { isNullOrEmpty, isUndefined, normalize, isString } from '../util/Utils';
import Exception from '../exception/exception';
import * as LayerType from './Type';
import * as parameter from '../parameter/parameter';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * KML (Keyhole Markup Language).
 *
 * @property {Boolean} extract Opcional. Activa la consulta haciendo clic en el objeto geográfico,
 * por defecto falso.
 * @property {Object} options Parámetros de la capa.
 * @property {String} label Etiqueta de la capa.
 *
 * @api
 * @extends {M.layer.Vector}
 */
class KML extends LayerVector {
  /**
   * Constructor principal de la clase. Crea una capa KML
   * con parámetros especificados por el usuario.
   *
   * @constructor
   * @param {string|Mx.parameters.KML} userParameters Parámetros especificados por el usuario.
   * - url: Url del fichero o servicio -> https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml
   * - name: Nombre de la capa que aparecerá en la leyenda -> Delegaciones IGN
   * - extract: Opcional, activa la consulta por click en el objeto geográfico, por defecto falso.
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - type: Tipo de la capa.
   * - maxExtent: La medida en que restringe la visualización a una región específica.
   * - legend: Indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
   * - label: Define si se muestra la etiqueta o no. Por defecto mostrará la etiqueta.
   * - layers: Permite filtrar el fichero KML por nombre de carpetas.
   * @param {Mx.parameters.LayerOptions} options Parámetros que se pasarán a la implementación.
   * - visibility: Define si la capa es visible o no.
   * - style: Define el estilo de la capa.
   * - minZoom. Zoom mínimo aplicable a la capa.
   * - maxZoom. Zoom máximo aplicable a la capa.
   * - displayInLayerSwitcher. Indica si la capa se muestra en el selector de capas.
   * - opacity. Opacidad de capa, por defecto 1.
   * - scaleLabel. Escala de la etiqueta.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * <pre><code>
   * import OLSourceVector from 'ol/source/Vector';
   * {
   *  opacity: 0.1,
   *  source: new OLSourceVector({
   *    attributions: 'kml',
   *    ...
   *  })
   * }
   * </code></pre>
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions = {}) {
    const parameters = parameter.layer(userParameters, LayerType.KML);
    const optionsVar = options;
    optionsVar.label = parameters.label;
    optionsVar.visibility = parameters.visibility;
    optionsVar.layers = userParameters.layers || undefined;

    /**
     * Implementación de la capa.
     * @public
     * @implements {M.layer.KML}
     * @type {M.layer.KML}
     */
    const impl = new KMLImpl(optionsVar, vendorOptions);

    // calls the super constructor
    super(parameters, options, undefined, impl);

    // checks if the implementation can create KML layers
    if (isUndefined(KMLImpl)) {
      Exception(getValue('exception').kmllayer_method);
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      Exception(getValue('exception').no_param);
    }

    /**
     * KML extract: Activa la consulta al hacer clic sobre un objeto geográfico,
     * por defecto falso.
     */
    this.extract = parameters.extract;

    /**
     * KML options: Optiones que se mandan a la implementación.
     */
    this.options = options;

    /**
     * KML label. Etiqueta de la capa KML.
     */
    this.label = parameters.label;

    /**
     * KML layers: Permite filtrar el fichero KML por nombre de carpetas.
     * @type {Array<String>}
     */
    this.layers = optionsVar.layers;
  }

  /**
   * Devuelve el tipo de capa, KML.
   * @function
   * @getter
   * @returns {M.LayerType.KML} Tipo de capa.
   * @api
   */
  get type() {
    return LayerType.KML;
  }

  /**
   * Sobrescribe el tipo de la capa.
   *
   * @function
   * @setter
   * @param {String} newType Nuevo tipo.
   * @api
   */
  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.KML)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.KML).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * Devuelve el valor de la propiedad "extract". La propiedad "extract" tiene la
   * siguiente función: Activa la consulta al hacer clic en la característica, por defecto falso.
   *
   * @function
   * @getter
   * @returns {M.LayerType.KML} Valor de la propiedad "extract".
   * @api
   */
  get extract() {
    return this.getImpl().extract;
  }

  /**
   * Sobrescribe el valor de la propiedad "extract". La propiedad "extract" tiene la
   * siguiente función: Activa la consulta al hacer clic en la característica, por defecto falso.
   *
   * @function
   * @setter
   * @param {Boolean} newExtract Nuevo valor para sobreescribir la propiedad "extract".
   * @api
   */
  set extract(newExtract) {
    if (!isNullOrEmpty(newExtract)) {
      if (isString(newExtract)) {
        this.getImpl().extract = (normalize(newExtract) === 'true');
      } else {
        this.getImpl().extract = newExtract;
      }
    } else {
      this.getImpl().extract = false;
    }
  }

  /**
   * Devuelve las opciones que se mandan a la implementación.
   * @function
   * @getter
   * @returns {M.layer.KML.impl.options} Opciones de la capa KML.
   * @api
   */
  get options() {
    return this.getImpl().options;
  }

  /**
   * Sobrescribe las opciones de la capa KML.
   *
   * @function
   * @setter
   * @param {Object} newOptions Nuevas opciones.
   * @api
   */
  set options(newOptions) {
    this.getImpl().options = newOptions;
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

    if (obj instanceof KML) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.extract === obj.extract);
    }

    return equals;
  }
}

export default KML;
