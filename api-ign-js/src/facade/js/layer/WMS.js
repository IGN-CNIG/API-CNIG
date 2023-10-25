/* eslint-disable no-console */
/**
 * @module M/layer/WMS
 */
import WMSImpl from 'impl/layer/WMS';

import { isNullOrEmpty, isUndefined, sameUrl, isString, normalize, isFunction } from '../util/Utils';
import Exception from '../exception/exception';
import LayerBase from './Layer';
import * as parameter from '../parameter/parameter';
import * as LayerType from './Type';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * WMS devuelve un mapa en formato imagen de un conjunto capas ráster o vectoriales.
 * Permitiendo las personalización de las capas mediante estilos. Se trata de un mapa dínamico.
 *
 * @property {String} legend Nombre asociado en el árbol de contenido, si usamos uno.
 * @property {String} version Versión WMS.
 * @property {Boolean} tiled Verdadero si queremos dividir la capa en mosaicos,
 * falso en caso contrario.
 * @property {Boolean} transparent 'Falso' si es una capa base, 'verdadero' en caso contrario.
 * @property {Object} capabilitiesMetadata Capacidades de metadatos WMS.
 * @property {Number} minZoom Limitar el zoom mínimo.
 * @property {Number} maxZoom Limitar el zoom máximo.
 * @property {Object} options Capa de opciones WMS.
 * @property {Boolean} useCapabilities Define si se utilizará el capabilities para generar la capa.
 *
 * @api
 * @extends {M.Layer}
 */
class WMS extends LayerBase {
  /**
   * Constructor principal de la clase. Crea una capa WMS
   * con parámetros especificados por el usuario.
   * @constructor
   * @param {string|Mx.parameters.WMS} userParameters Parámetros para la construcción de la capa.
   * - name: nombre de la capa en el servidor.
   * - url: url del servicio WFS.
   * - legend: Nombre asociado en el árbol de contenidos, si usamos uno.
   * - transparent: Falso si es una capa base, verdadero en caso contrario.
   * - tiled: Verdadero si queremos dividir la capa en tiles, falso en caso contrario.
   * - visibility: Verdadero si la capa es visible, falso si queremos que no lo sea.
   *   En este caso la capa sería detectado por los plugins de tablas de contenidos
   *   y aparecería como no visible.
   * - version: Versión WMS.
   * - type: Tipo de la capa.
   * - useCapabilities: Define si se utilizará el capabilities para generar la capa.
   * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán a
   * la implementación de la capa.
   * - visibility: Indica la visibilidad de la capa.
   * - singleTile: Indica si la tesela es única o no.
   * - numZoomLevels: Número de niveles de zoom.
   * - animated: Define si la capa está animada,
   * el valor predeterminado es falso.
   * - format: Formato de la capa, por defecto image/png.
   * - styles: Estilos de la capa.
   * - sldBody: Parámetros "ol.source.ImageWMS"
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - queryable: Indica si la capa es consultable.
   * - minScale: Escala mínima.
   * - maxScale: Escala máxima.
   * - minResolution: Resolución mínima.
   * - maxResolution: Resolución máxima.
   * - animated: Define si la capa está animada,
   * el valor predeterminado es falso.
   * - ratio: determina el tamaño de las solicitudes de las imágenes. 1 significa que tienen el
   * tamaño de la ventana, 2 significa que tienen el doble del tamaño de la ventana,
   * y así sucesivamente. Debe ser 1 o superior. Por defecto es 1.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * <pre><code>
   * import OLSourceTileWMS from 'ol/source/TileWMS';
   * {
   *  opacity: 0.1,
   *  source: new OLSourceTileWMS({
   *    attributions: 'wms',
   *    ...
   *  })
   * }
   * </code></pre>
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions = {}) {
    // checks if the implementation can create WMC layers
    if (isUndefined(WMSImpl)) {
      Exception(getValue('exception').wms_method);
    }
    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      Exception(getValue('exception').no_param);
    }
    // This Layer is of parameters.
    const parameters = parameter.layer(userParameters, LayerType.WMS);
    const optionsVar = {
      ...options,
      visibility: parameters.visibility,
      queryable: parameters.queryable,
      displayInLayerSwitcher: parameters.displayInLayerSwitcher,
      useCapabilities: parameters.useCapabilities,
    };
    const impl = new WMSImpl(optionsVar, vendorOptions);
    // calls the super constructor
    super(parameters, impl);

    /**
     * WMS legend: Nombre asociado en el árbol de contenido, si usamos uno.
     */
    this.legend = parameters.legend;

    /**
     * WMS version: Versión WMS.
     */
    this.version = parameters.version;

    /**
     * WMS tiled: Verdadero si queremos dividir la capa en mosaicos, falso en caso contrario.
     */
    if (!isNullOrEmpty(parameters.tiled)) {
      this.tiled = parameters.tiled;
    }


    /**
     * WMS transparent: Falso si es una capa base, verdadero en caso contrario.
     */
    this.transparent = parameters.transparent;

    /**
     * WMS capabilitiesMetadata: Capacidades de metadatos WMS.
     */
    if (!isNullOrEmpty(vendorOptions.capabilitiesMetadata)) {
      this.capabilitiesMetadata = vendorOptions.capabilitiesMetadata;
    }

    /**
     * WMS minZoom: Limitar el zoom mínimo.
     */
    this.minZoom = parameters.minZoom;

    /**
     * WMS maxZoom: Limitar el zoom máximo.
     */
    this.maxZoom = parameters.maxZoom;

    /**
     * WMS options: Opciones WMS.
     */
    this.options = optionsVar;

    /**
     * Obtener metadatos en forma de promesa.
     */
    this.getCapabilitiesPromise_ = null;

    /**
     * Define se se utilizará el capabilities para generar la capa.
     * Si es falso no se generará el OLTileGrid, por lo que
     * podrías experimentar problemas de alineación y visualización incorrecta.
     */
    this.useCapabilities = userParameters.useCapabilities !== false;

    this._updateNoCache();
  }

  /**
   * Devuelve el tipo de layer, WMS.
   *
   * @function
   * @getter
   * @returns {M.LayerType.WMS} Tipo WMS.
   * @api
   */
  get type() {
    return LayerType.WMS;
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
      !isNullOrEmpty(newType) && (newType !== LayerType.WMS)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.WMS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * Devuelve la leyenda de la capa.
   * La Leyenda indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
   *
   * @function
   * @getter
   * @return {M.layer.WMS.impl.legend} Leyenda de la capa.
   * @api
   */
  get legend() {
    return this.getImpl().legend;
  }

  /**
   * Sobrescribe la leyenda de la capa.
   * La Leyenda indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
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
   * Devuelve el valor de la propiedad "tiled".
   *
   * @function
   * @getter
   * @return {M.layer.WMS.impl.tiled} Valor de la tesela.
   * @api
   */
  get tiled() {
    return this.getImpl().tiled;
  }

  /**
   * Sobrescribe el valor de la propiedad "tiled".
   *
   * @function
   * @setter
   * @param {M.WMS.tiled} newTiled Nueva tesela.
   * @api
   */
  set tiled(newTiled) {
    if (!isNullOrEmpty(newTiled)) {
      if (isString(newTiled)) {
        this.getImpl().tiled = (normalize(newTiled) === 'true');
      } else {
        this.getImpl().tiled = newTiled;
      }
    } else {
      this.getImpl().tiled = true;
    }
  }

  /**
   * Devuelve la versión del servicio, por defecto es 1.3.0.
   *
   * @function
   * @getter
   * @return {M.layer.WMS.impl.version} Versión del servicio.
   * @api
   */
  get version() {
    return this.getImpl().version;
  }

  /**
   * Sobrescribe la versión del servicio, por defecto es 1.3.0.
   *
   * @function
   * @setter
   * @param {String} newVersion Nueva versión del servicio.
   * @api
   */
  set version(newVersion) {
    if (!isNullOrEmpty(newVersion)) {
      this.getImpl().version = newVersion;
    } else {
      this.getImpl().version = '1.3.0'; // default value
    }
  }

  /**
   * Devuelve las opciones de la capa.
   *
   * @function
   * @getter
   * @return {M.layer.WMTS.options} Devuelve las opciones de la
   * implementación.
   * @api
   */
  get options() {
    return this.getImpl().options;
  }

  /**
   * Sobrescribe las opciones de la capa.
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
   * Este método calcula la extensión máxima de esta capa.
   *
   * @function
   * @param {Function} callbackFn
   * @returns {M.WMS.maxExtent} Devuelve la extensión máxima.
   * @api
   */
  getMaxExtent(callbackFn) {
    let maxExtent;
    if (isNullOrEmpty(this.userMaxExtent)) {
      if (isNullOrEmpty(this.options.wmcMaxExtent)) {
        if (isNullOrEmpty(this.map_.userMaxExtent)) {
          // maxExtent provided by the service
          this.getCapabilities().then((capabilities) => {
            const capabilitiesMaxExtent = this.getImpl()
              .getExtentFromCapabilities(capabilities);
            if (isNullOrEmpty(capabilitiesMaxExtent)) {
              const projMaxExtent = this.map_.getProjection().getExtent();
              this.maxExtent_ = projMaxExtent;
            } else {
              this.maxExtent_ = capabilitiesMaxExtent;
            }
            // this allows get the async extent by the capabilites
            if (isFunction(callbackFn)) {
              callbackFn(this.maxExtent_);
            }
          });
        } else {
          this.maxExtent_ = this.map_.userMaxExtent;
        }
      } else {
        this.maxExtent_ = this.options.wmcMaxExtent;
      }
      maxExtent = this.maxExtent_;
    } else {
      maxExtent = this.userMaxExtent;
    }
    if (!isNullOrEmpty(maxExtent) && isFunction(callbackFn)) {
      callbackFn(maxExtent);
    }
    return maxExtent;
  }

  /**
   * Este método calcula la extensión máxima de esta capa.
   *
   * Versión asíncrona de getMaxExtent.
   * @function
   * @returns {M.WMS.maxExtent} Devuelve el maxExtent.
   * @api
   */
  calculateMaxExtent() {
    return new Promise(resolve => this.getMaxExtent(resolve));
  }

  /**
   * Este método calcula la extensión máxima de esta capa.
   *
   * Versión asíncrona de getMaxExtent.
   * @function
   * @returns {M.WMS.maxExtent} Devuelve el maxExtent.
   * @api
   */
  calculateMaxExtentWithCapabilities(capabilities) {
    // -- Prevent to calculate maxExtent if it is already calculated
    if (isNullOrEmpty(this.userMaxExtent) && this.userMaxExtent) return this.userMaxExtent;
    if (isNullOrEmpty(this.options.wmcMaxExtent) && this.options.wmcMaxExtent) {
      this.maxExtent_ = this.options.wmcMaxExtent;
      return this.maxExtent_;
    }
    if (isNullOrEmpty(this.map_.userMaxExtent) && this.map_.userMaxExtent) {
      this.maxExtent_ = this.map_.userMaxExtent;
      return this.maxExtent_;
    }

    // -- Use capabilities
    const capabilitiesMaxExtent = this.getImpl()
      .getExtentFromCapabilities(capabilities);
    if (isNullOrEmpty(capabilitiesMaxExtent)) {
      const projMaxExtent = this.map_.getProjection().getExtent();
      this.maxExtent_ = projMaxExtent;
      return this.maxExtent_;
    }
    return capabilitiesMaxExtent;
  }


  /**
   * Este método recupera una Promesa que será
   * resuelto cuando se recupera la solicitud GetCapabilities
   * por el servicio y analizado. Las capacidades se almacenan en caché
   * para evitar solicitudes múltiples.
   *
   * @function
   * @returns {M.WMS.capabilities} Devuelve el capabilities.
   * @api
   */
  getCapabilities() {
    if (isNullOrEmpty(this.getCapabilitiesPromise_)) {
      this.getCapabilitiesPromise_ = this.getImpl().getCapabilities();
    }
    return this.getCapabilitiesPromise_;
  }

  /**
   * Devuelve las URL de "tileMappins" (url del contexto, de la configuración).
   *
   * @function
   * @returns {M.config.tileMappgins.urls} Devuelve "noCacheURL".
   * @api
   */
  getNoCacheUrl() {
    return this._noCacheUrl;
  }

  /**
   * Devuelve el nombre del "tileMappins" (nombres del contexto, de la configuración).
   *
   * @function
   * @returns {M.config.tileMappgins.names} Devuelve "noCacheName".
   * @api
   */
  getNoCacheName() {
    return this._noCacheName;
  }

  /**
   * Actualización de capas WMS de resolución mínima y máxima.
   *
   * @public
   * @function
   * @param {String|Mx.Projection} projection Proyección del mapa.
   * @returns {M.WMS.impl.updateMinMaxResolution} Devuelve la resolucción
   * máxima y mínima.
   * @api
   */
  updateMinMaxResolution(projection) {
    return this.getImpl().updateMinMaxResolution(projection);
  }

  /**
   * Actualica los parámetros de NoCahe, "M.config.tileMappins".
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @function
   * @api
   */
  _updateNoCache() {
    const tiledIdx = M.config.tileMappgins.tiledNames.indexOf(this.name);
    if ((tiledIdx !== -1) && sameUrl(M.config.tileMappgins.tiledUrls[tiledIdx], this.url)) {
      this._noCacheUrl = M.config.tileMappgins.urls[tiledIdx];
      this._noCacheName = M.config.tileMappgins.names[tiledIdx];
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
    if (obj instanceof WMS) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  }
}

export default WMS;
