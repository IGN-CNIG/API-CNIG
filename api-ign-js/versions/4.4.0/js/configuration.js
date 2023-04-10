/**
 * IGN API
 * Version 4.4.0
 * Date 31-03-2023
 */

const backgroundlayersIds = 'mapa,imagen,hibrido'.split(',');
const backgroundlayersTitles = 'Callejero,Imagen,H&iacute;brido'.split(',');
const backgroundlayersLayers = 'TMS*IGNBaseTodo*https://tms-ign-base.idee.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg*true*false*17,TMS*PNOA-MA*https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg*true*false*19,TMS*PNOA-MA*https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg*true*false*19+TMS*IGNBaseOrto*https://tms-ign-base.idee.es/1.0.0/IGNBaseOrto/{z}/{x}/{-y}.png*true*false*17'.split(',');
const backgroundlayersOpts = backgroundlayersIds.map((id, index) => {
  return {
    id,
    title: backgroundlayersTitles[index],
    layers: backgroundlayersLayers[index].split('+'),
  };
});
const params = window.location.search.split('&');
let center = '';
let zoom = '';
let srs = '';
let layers = '';
params.forEach((param) => {
  if (param.indexOf('center') > -1) {
    const values = param.split('=')[1].split(',');
    center = [parseFloat(values[0]), parseFloat(values[1])];
  } else if (param.indexOf('zoom') > -1) {
    const value = param.split('=')[1];
    zoom = parseInt(value, 10);
  } else if (param.indexOf('srs') > -1) {
    const value = param.split('=')[1];
    srs = value;
  } else if (param.indexOf('layers') > -1) {
    const value = param.substring(param.indexOf('=') + 1, param.length);
    layers = value.split(',');
  }
});

(function(M) {
  /**
   * Pixels width for mobile devices
   *
   * @private
   * @type {Number}
   */
  M.config('MOBILE_WIDTH', '768');

  /**
   * The Mapea URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('MAPEA_URL', 'http://10.67.33.46:9010/api-core/');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_URL', ((location.protocol !== 'file' && location.protocol !== 'file:') ? location.protocol : 'https:') + '//10.67.33.46:9010/api-core/api/proxy');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_POST_URL', ((location.protocol !== 'file' && location.protocol !== 'file:') ? location.protocol : 'https:') + '//10.67.33.46:9010/api-core/proxyPost');

  /**
   * The path to the Mapea templates
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('TEMPLATES_PATH', '/files/templates/');

  /**
   * The path to the Mapea theme
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('THEME_URL', ((location.protocol !== 'file' && location.protocol !== 'file:') ? location.protocol : 'https:') + '//10.67.33.46:9010/api-core/assets/');

  /**
   * The path to the Mapea theme
   * @const
   * @type {string}
   * @public
   * @api stable
   */

  /**
   * TODO
   * @type {object}
   * @public
   * @api stable
   */
  M.config('tileMappgins', {
    /**
     * Predefined WMC URLs
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'tiledNames': '${tile.mappings.tiledNames}'.split(','),

    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'tiledUrls': '${tile.mappings.tiledUrls}'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'names': '${tile.mappings.names}'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'urls': '${tile.mappings.urls}'.split(',')
  });

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('DEFAULT_PROJ', 'EPSG:3857*m');

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('GEOPRINT_URL', 'http://10.67.33.46:9009/geoprint');

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('GEOREFIMAGE_TEMPLATE', 'http://10.67.33.46:9009/geoprint' + '/print/mapexport');

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PRINTERMAP_TEMPLATE', 'http://10.67.33.46:9009/geoprint' + '/print/CNIG');

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('GEOPRINT_STATUS', 'http://10.67.33.46:9009/geoprint' + '/print/status');

  /**
   * TMS configuration
   *
   * @private
   * @type {object}
   */
  M.config('tms', {
    base: 'TMS*IGNBaseTodo*https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg*true*false*17',
  });

  /**
   * Controls configuration
   *
   * @private
   * @type {object}
   */
  M.config('controls', {
    default: '',
  });

  /**
   * Attributions configuration
   *
   * @private
   * @type {object}
   */
  M.config('attributions', {
    defaultAttribution: 'Instituto Geogr&aacute;fico Nacional',
    defaultURL: 'https://www.ign.es/',
    url: 'http://10.67.33.46:9010/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    type: 'kml',
  });

  /**
   * BackgroundLayers Control
   *
   * @private
   * @type {object}
   */
  M.config('backgroundlayers', backgroundlayersOpts);

  /**
   * URL of sql wasm file
   * @private
   * @type {String}
   */
  M.config('SQL_WASM_URL', ((location.protocol !== 'file' && location.protocol !== 'file:') ? location.protocol : 'https:') + 'http://10.67.33.46:9010/api-core/wasm/');

  /** IGNSearch List Control
   *
   * @private
   * @type {object}
   */
  M.config('IGNSEARCH_TYPES_CONFIGURATION', [
    'Estado',
    //'Comunidad aut\u00F3noma',
    //'Ciudad con estatuto de autonom\u00EDa',
    //'Provincia',
    //'Municipio',
    //'EATIM',
    'Isla administrativa',
    'Comarca administrativa',
    'Jurisdicci\u00F3n',
    //'Capital de Estado',
    //'Capital de comunidad aut\u00F3noma y ciudad con estatuto de autonom\u00EDa',
    //'Capital de provincia',
    //'Capital de municipio',
    //'Capital de EATIM',
    //'Entidad colectiva',
    //'Entidad menor de poblaci\u00F3n',
    //'Distrito municipal',
    //'Barrio',
    //'Entidad singular',
    //'Construcci\u00F3n/instalaci\u00F3n abierta',
    //'Edificaci\u00F3n',
    'V\u00E9rtice Geod\u00E9sico',
    //'Hitos de demarcaci\u00F3n territorial',
    //'Hitos en v\u00EDas de comunicaci\u00F3n',
    'Alineaci\u00F3n monta\u00F1osa',
    'Monta\u00F1a',
    'Paso de monta\u00F1a',
    'Llanura',
    'Depresi\u00F3n',
    'Vertientes',
    'Comarca geogr\u00E1fica',
    'Paraje',
    'Elemento puntual del paisaje',
    'Saliente costero',
    'Playa',
    'Isla',
    'Otro relieve costero',
    //'Parque Nacional y Natural',
    //'Espacio protegido restante',
    //'Aeropuerto',
    //'Aer\u00F3dromo',
    //'Pista de aviaci\u00F3n y helipuerto',
    //'Puerto de Estado',
    //'Instalaci\u00F3n portuaria',
    //'Carretera',
    //'Camino y v\u00EDa pecuaria',
    //'V\u00EDa urbana',
    //'Ferrocarril',
    'Curso natural de agua',
    'Masa de agua',
    'Curso artificial de agua',
    //'Embalse',
    'Hidr\u00F3nimo puntual',
    'Glaciares',
    'Mar',
    'Entrante costero y estrecho mar\u00EDtimo',
    'Relieve submarino',
  ]);

  /**
   * MAP Viewer - Center
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_CENTER', center);

  /**
   * MAP Viewer - Zoom
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_ZOOM', zoom);

  /**
   * MAP Viewer - SRS
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_SRS', srs);

  /**
   * MAP Viewer - Layers
   *
   * @private
   * @type {object}
   */
  M.config('MAP_VIEWER_LAYERS', layers);
})(window.M);
