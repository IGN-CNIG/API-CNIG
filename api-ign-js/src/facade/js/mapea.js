/**
 * Este fichero es el punto de entrada de la API, sirve para inicializar las clases de la API-CNIG.
 * @module M
 */
import 'assets/css/fonts';
import 'assets/css/animations';
import 'impl/projections';
import MapImpl from 'impl/Map';
import Map from 'M/Map';
import WFS from 'M/layer/WFS';
import Point from 'M/style/Point';
import 'assets/css/ign';
import { isNullOrEmpty, isUndefined } from './util/Utils';
import Exception from './exception/exception';
import './util/Window';
import './util/polyfills';
import { getValue } from './i18n/language';

/**
 * Esta función establece las variables de configuración.
 *
 * @function
 * @param {String} configKey Clave de la variable de configuración.
 * @param {*} configValue Valor de la variable de configuración.
 * @api
 */
export const config = (configKey, configValue) => {
  config[configKey] = configValue;
};

/**
 * Esta función crea un nuevo mapa usando los parámetros
 * especificado por el usuario.
 *
 * @function
 * @param {string|Mx.parameters.Map} parameters Para construir el mapa.
 * @param {Mx.parameters.MapOptions} options Opciones personalizadas para construir el mapa.
 * @returns {M.Map}
 * @api
 */
export const map = (parameters, options) => {
  // checks if the user specified an implementation
  if (isNullOrEmpty(MapImpl)) {
    Exception(getValue('exception').no_impl);
  }
  return new Map(parameters, options);
};

/**
 * Indica si el proxy es habilitado para usar.
 * @const
 * @type {boolean}
 * @public
 * @api
 */
export let useproxy = true;

/**
 * Esta función habilita/deshabilita el proxy
 *
 * @public
 * @function
 * @param {boolean} enable Indica si se habilita/deshabilita el proxy.
 * @api
 */
export const proxy = (enable) => {
  if (typeof enable === 'boolean') {
    useproxy = enable;
  }
};

/**
 * Esta función almacena las capas rápidas.
 *
 * @private
 * @function
 * @returns {object} Devuelve objeto con la definición de capas rápidas.
 */
let quickLayers = () => {
  return {
    // WMTS
    MapaBase_CallejeroGris_WMTS: 'WMTS*https://www.ign.es/wmts/ign-base?*IGNBase-gris*GoogleMapsCompatible*IGNBaseGris*true*image/jpeg',
    OcupacionSuelo_LandCoverSurfaces_WMTS: 'WMTS*https://servicios.idee.es/wmts/ocupacion-suelo?*LC.LandCoverSurfaces*GoogleMapsCompatible*LandCoverSurfaces*true*image/png',
    MDT_ElevationGridCoverage_WMTS: 'WMTS*https://servicios.idee.es/wmts/mdt?*EL.ElevationGridCoverage*GoogleMapsCompatible*ElevationGridCoverage*true*image/jpeg',
    CartografiaRaster_MTN_WMTS: 'WMTS*https://www.ign.es/wmts/mapa-raster?*MTN*GoogleMapsCompatible*MTN*true*image/jpeg',
    PNOA_MA_OrthoimageCoverage_WMTS: 'WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*OrthoimageCoverage*true*image/jpeg',
    MapaLiDAR_GridCoverageDSM_WMTS: 'WMTS*https://wmts-mapa-lidar.idee.es/lidar?*EL.GridCoverageDSM*GoogleMapsCompatible*GridCoverageDSM*true*image/png',
    MTN_Historico_Catastrones_WMTS: 'WMTS*https://www.ign.es/wmts/primera-edicion-mtn?*Catastrones*GoogleMapsCompatible*catastrones*true*image/jpeg',
    Planos_Historicos_MadridMancelliMadrid_WMTS: 'WMTS*https://www.ign.es/wmts/planos?*MancelliMadrid*GoogleMapsCompatible*MancelliMadrid*true*image/png',
    // WMS
    NGBE_GeographicalNames_WMS: 'WMS*GeographicalNames*https://www.ign.es/wms-inspire/ngbe?*GN.GeographicalNames',
    UnidadesAdministrativas_AdministrativeUnit_WMS: 'WMS*UnidadesAdministrativas*https://www.ign.es/wms-inspire/unidades-administrativas?*AU.AdministrativeUnit',
    Hidrografia_HydroPointOfInterest_WMS: 'WMS*HydroPointOfInterest*https://servicios.idee.es/wms-inspire/hidrografia?*HY.PhysicalWaters.HydroPointOfInterest',
    Usos_Coberturas_HRLForestTCD2015_WMS: 'WMS*HRLForestTCD2015*https://servicios.idee.es/wms/copernicus-landservice-spain?*HRLForestTCD2015',
    Cuadriculas_GridETRS89_WMS: 'WMS*GridETRS89*https://www.ign.es/wms-inspire/cuadriculas?*Grid-ETRS89-lonlat-50k',
    CaminoSantiago_CaminoFrances_WMS: 'WMS*CaminoFrances*https://www.ign.es/wms-inspire/camino-santiago?*camino_frances',
    RedesGeodesicas_RedRegente_WMS: 'WMS*RedRegente*https://www.ign.es/wms-inspire/redes-geodesicas?*RED_REGENTE',
    Informacionsismica_Ultimos10dias_WMS: 'WMS*Ultimos10dias*https://www.ign.es/wms-inspire/geofisica?*Ultimos10dias',
    RedVigilanciaVolcanica_SIS_WMS: 'WMS*SIS*https://wms-volcanologia.ign.es/volcanologia?*sis',
    PNOA_Historico_PNOA2019_WMS: 'WMS*SIPNOA2019S*https://www.ign.es/wms/pnoa-historico?*PNOA2019',
    MinutasCartograficas_Minutas_WMS: 'WMS*Minutas*https://www.ign.es/wms/minutas-cartograficas?*Minutas',
    HojasKilometricas_ParcelasCatastrales_WMS: 'WMS*ParcelasCatastrales*https://www.ign.es/wms/hojas-kilometricas?*Parcelas_Catastrales',
    Fototeca_InfoVuelos_WMS: 'WMS*InfoVuelos*https://wms-fototeca.idee.es/fototeca?*infoVuelos',
    SatelitesHistoricos_SentinelInvierno23_WMS: 'WMS*SentinelInvierno23*https://wms-satelites-historicos.idee.es/satelites-historicos?*SENTINEL.2023invierno_432-1184',
    PNOA_Provisional_MosaicElement_WMS: 'WMS*MosaicElement*https://wms-pnoa.idee.es/pnoa-provisionales?*OI.MosaicElement',
    // TMS
    IGNBaseTodo_TMS: 'TMS*IGNBaseTodo*https://tms-ign-base.idee.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg',
    IGNBaseOrto_TMS: 'TMS*IGNBaseOrto*https://tms-ign-base.idee.es/1.0.0/IGNBaseOrto/{z}/{x}/{-y}.png',
    IGNBaseSimplificado_TMS: 'TMS*IGNBaseSimplificado*https://tms-ign-base.idee.es/1.0.0/IGNBaseSimplificado/{z}/{x}/{-y}.png',
    MapaRaster_TMS: 'TMS*MapaRaster*https://tms-mapa-raster.ign.es/1.0.0/mapa-raster/{z}/{x}/{-y}.jpeg',
    PNOA_MA_TMS: 'TMS*PNOA_MA*https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg',
    RelieveSombreado_TMS: 'TMS*RelieveSombreado*https://tms-relieve.idee.es/1.0.0/relieve/{z}/{x}/{-y}.jpeg',
    // MVT
    UnidadesAdministrativas_MVT: 'MVT*https://vt-unidades-administrativas.ign.es/1.0.0/uadministrativa/{z}/{x}/{y}.pbf*UnidadesAdministrativas',
    Senderos_MVT: 'MVT*https://vt-fedme.idee.es/vt.senderogr,vt.senderopr,vt.senderosl/{z}/{x}/{y}.pbf*Senderos',
    RedAlberguesJuveniles_MVT: 'MVT*https://vt-reaj.idee.es/vt.alberguesjuveniles/{z}/{x}/{y}.pbf*RedAlberguesJuveniles',
    ViasVerdes_MVT: 'MVT*https://vt-viasverdes.idee.es/vt.viasverdes/{z}/{x}/{y}.pbf*ViasVerdes',
    BTN_MVT: 'MVT*https://vt-btn.idee.es/1.0.0/btn/tile/{z}/{y}/{x}.pbf*BTN',
    // WFS
    RedesGeodesicas_Regente_WFS: new WFS({
      url: 'https://www.ign.es/wfs/redes-geodesicas?',
      legend: 'REGENTE',
      name: 'RED_REGENTE',
      geometry: 'POINT',
      extract: true,
    }, {
      style: new Point({
        radius: 2,
        fill: {
          color: 'black',
          opacity: 0.5,
        },
      }),
    }),
  };
};

/**
 * Esta función permite añadir capas rápidas.
 * @param {object} layers - Objecto con las capas rápidas.
 * @param {boolean} force - Elimina las capas rápidas existentes y
 * las sustitutuye por las especificadas en el parámetro layer.
 * @returns {object} - Objeto con las capas rápidas o la capa rápida especificada.
 * @public
 * @api
 */
export const addQuickLayers = (layers, force) => {
  if (force === true) {
    quickLayers = () => { return layers; };
  } else {
    const allLayers = Object.assign(quickLayers(), layers);
    quickLayers = () => { return allLayers; };
  }
  return quickLayers();
};

/**
 * Esta función devuelve un objeto con las capas rápidas.
 * @param {string} layer - Nombre de la capa rápida para filtrar el objeto.
 * @returns {string|M.layer} - Objeto con las capas rápidas o la capa rápida especificada.
 * @public
 * @api
 */
export const getQuickLayers = (layer) => {
  let layers = quickLayers();
  if (!isUndefined(layer)) {
    layers = quickLayers()[layer];
  }
  return layers;
};

/**
 * Este comentario no se verá, es necesario incluir
 * una exportación por defecto para que el compilador
 * muestre las funciones.
 *
 * Esto se produce por al archivo normaliza-exports.js
 * @api stable
 */
export default {};
