/**
 * @module M/impl/loader/KML
 */
import MObject from 'M/Object';
import { get as getRemote } from 'M/util/Remote';
import { isNullOrEmpty } from 'M/util/Utils';
import FacadeFeature from 'M/feature/Feature';
import Exception from 'M/exception/exception';
import { getValue } from 'M/i18n/language';

/**
  * @classdesc
  * Implementación de la clase del "loader" para los objetos geográficos KML.
  *
  * @property {M.Map} map_ Mapa.
  * @property {M.impl.service.WFS} url_ URL del servicio WFS.
  * @property {M.impl.format.GeoJSON} format_ Formato.
  *
  * @api
  * @extends {M.Object}
  */
class KML extends MObject {
  /**
    * Constructor principal de la clase KML.
    *
    * @constructor
    * @param {M.Map} map Mapa
    * @param {M.impl.service.WFS} url URL del servicio WFS.
    * @param {M.impl.format.GeoJSON} format Formato.
    * @api
    */
  constructor(map, url, format) {
    super();
    /**
      * Mapa.
      * @private
      * @type {M.Map}
      */
    this.map_ = map;

    /**
      * URL del servicio WFS.
      * @private
      * @type {M.impl.service.WFS}
      */
    this.url_ = url;

    /**
      * Formato.
      * @private
      * @type {M.impl.format.GeoJSON}
      */
    this.format_ = format;
  }

  /**
    * Este método ejecutará la función "callback" a los objetos geográficos.
    *
    * @function
    * @param {function} callback Función "callback" de llamada para ejecutar
    * @returns {function} Método que ejecutará la función 'callback' a los objetos geográficos.
    * @public
    * @api
    */
  getLoaderFn(callback) {
    return ((extent, resolution, projection) => {
      this.loadInternal_(projection).then((response) => {
        callback(response);
      });
    });
  }

  /**
    * Este método obtiene los objetos geográficos a partir de los parámetros
    * especificados.
    * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
    * @function
    * @param {ol.proj.Projection} projection Proyección.
    * @returns {Promise} Promesa con la obtención de los objetos geográficos.
    * @public
    * @api
    */
  loadInternal_(projection) {
    return new Promise((success, fail) => {
      getRemote(this.url_).then((response) => {
        /*
           Fix: While the KML URL was being resolved the map projection
           might have been changed therefore the projection is readed again
         */
        const lastProjection = this.map_.getProjection().code;
        if (!isNullOrEmpty(response.text)) {
          const features = this.format_.readCustomFeatures(response.text, {
            featureProjection: lastProjection,
          });
          const screenOverlay = this.format_.getScreenOverlay();
          const mFeatures = features.map((olFeature) => {
            const feature = new FacadeFeature(olFeature.getId(), {
              geometry: {
                coordinates: olFeature.getGeometry().getCoordinates(),
                type: olFeature.getGeometry().getType(),
              },
              properties: olFeature.getProperties(),
            });
            feature.getImpl().getOLFeature().setStyle(olFeature.getStyle());
            return feature;
          });

          success({
            features: mFeatures,
            screenOverlay,
          });
        } else {
          Exception(getValue('exception').no_kml_response);
        }
      });
    });
  }
}

export default KML;
