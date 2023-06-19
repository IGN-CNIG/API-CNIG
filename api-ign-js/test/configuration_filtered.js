const backgroundlayersIds = 'mapa,imagen,hibrido'.split(',');
const backgroundlayersTitles = 'Mapa,Imagen,Hibrido'.split(',');
const backgroundlayersLayers = 'TMS*IGNBaseTodo*https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg*true*false*17,TMS*PNOA-MA*https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg*true*false*19,TMS*PNOA-MA*https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg*true*false*19+TMS*IGNBaseOrto*https://tms-ign-base.idee.es/1.0.0/IGNBaseOrto/{z}/{x}/{-y}.png*true*false*17'.split(',');
const backgroundlayersOpts = backgroundlayersIds.map((id, index) => {
  return {
    id,
    title: backgroundlayersTitles[index],
    layers: backgroundlayersLayers[index].split('+'),
  };
});


const config = (configKey, configValue) => {
  config[configKey] = configValue;
};

if (!window.M) {
  const M = {};
  window.M = M;
}
M.config = config;

function fun(M_) {
  /**
   * Pixels width for mobile devices
   *
   * @private
   * @type {Number}
   */
  M_.config('MOBILE_WIDTH', 768);

  /**
   * The Mapea URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('MAPEA_URL', 'https://mapea-lite.desarrollo.guadaltel.es/api-core/');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('PROXY_URL', location.protocol + '//mapea-lite.desarrollo.guadaltel.es/api-core/api/proxy');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('PROXY_POST_URL', location.protocol + '//mapea-lite.desarrollo.guadaltel.es/api-core/proxyPost');

  /**
   * The path to the Mapea templates
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('TEMPLATES_PATH', '/files/templates/');

  /**
   * The path to the Mapea theme
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('THEME_URL', location.protocol + '//mapea-lite.desarrollo.guadaltel.es/api-core/assets/');

  /**
   * TODO
   * @type {object}
   * @public
   * @api stable
   */
  M_.config('tileMappgins', {
    /**
     * Predefined WMC URLs
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    tiledNames: 'base,SPOT_Andalucia,orto_2010-11_25830,CallejeroCompleto,orto_2010-11_23030'.split(','),

    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    tiledUrls: 'http://www.callejerodeandalucia.es/servicios/base/gwc/service/wms?,http://www.callejerodeandalucia.es/servicios/base/gwc/service/wms?,http://www.ideandalucia.es/geowebcache/service/wms?,http://www.juntadeandalucia.es/servicios/mapas/callejero/wms-tiled?,http://www.ideandalucia.es/geowebcache/service/wms?'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    names: 'CDAU_base,mosaico_spot_2005,orto_2010-11,CallejeroCompleto,orto_2010-11'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    urls: 'http://www.callejerodeandalucia.es/servicios/base/wms?,http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_SPOT_Andalucia_2005?,http://www.ideandalucia.es/wms/ortofoto2010?,http://www.juntadeandalucia.es/servicios/mapas/callejero/wms?,http://www.ideandalucia.es/wms/ortofoto2010?'.split(','),
  });

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('DEFAULT_PROJ', 'EPSG:3857*m');

  /**
   * Predefined WMC files. It is composed of URL,
   * predefined name and context name.
   * @type {object}
   * @public
   * @api stable
   */
  M_.config('panels', {
    /**
     * TODO
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    TOOLS: 'measurebar,getfeatureinfo'.split(','),
  });

  /**
   * WMTS configuration
   *
   * @private
   * @type {object}
   */
  M_.config('tms', {
    base: 'TMS*IGNBaseTodo*https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg*true*false*17',
  });

  /**
   * BackgroundLayers Control
   *
   * @private
   * @type {object}
   */
  M_.config('backgroundlayers', backgroundlayersOpts);

  /**
   * Attributions configuration
   *
   * @private
   * @type {object}
   */
  M_.config('attributions', {
    defaultAttribution: 'Instituto Geográfico Nacional',
    defaultURL: 'https://www.ign.es/',
    url: 'https://mapea-lite.desarrollo.guadaltel.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    type: 'kml',
  });


  /**
   * Controls configuration
   *
   * @private
   * @type {object}
   */
  M_.config('controls', {
    default: '',
  });

  /**
   * URL of sql wasm file
   * @private
   * @type {String}
   */
  M_.config('SQL_WASM_URL', '../../../../node_modules/sql.js/dist/');


    /**
   * Mueve el mapa cuando se hace clic sobre un objeto
   * geográfico, (extract = true) o no (extract = false)
   *
   * @private
   * @type {object}
   */
  M_.config('MOVE_MAP_EXTRACT', false);
}

fun(window.M);
