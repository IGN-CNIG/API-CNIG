/**
 * IGN API
 * Version ${pom.version}
 * Date ${build.timestamp}
 */

const backgroundlayersIds = '${backgroundlayers.ids}'.split(',');
const backgroundlayersTitles = '${backgroundlayers.titles}'.split(',');
const backgroundlayersLayers = '${backgroundlayers.layers}'.split(',');
const backgroundlayersOpts = backgroundlayersIds.map((id, index) => {
  return {
    id,
    title: backgroundlayersTitles[index],
    layers: backgroundlayersLayers[index].split('+'),
  };
});

(function(M) {
  /**
   * Pixels width for mobile devices
   *
   * @private
   * @type {Number}
   */
  M.config('MOBILE_WIDTH', '${mobile.width}');

  /**
   * The Mapea URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('MAPEA_URL', '${mapea.url}');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_URL', location.protocol + '${mapea.proxy.url}');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_POST_URL', location.protocol + '${mapea.proxy_post.url}');

  /**
   * The path to the Mapea templates
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('TEMPLATES_PATH', '${mapea.templates.path}');

  /**
   * The path to the Mapea theme
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('THEME_URL', location.protocol + '${mapea.theme.url}');

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
  M.config('DEFAULT_PROJ', '${mapea.proj.default}');

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('GEOPRINT_URL', '${geoprint.url}');

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('GEOREFIMAGE_TEMPLATE', '${geoprint.url}' + '${georefimage.template}');

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PRINTERMAP_TEMPLATE', '${geoprint.url}' + '${printermap.template}');

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('GEOPRINT_STATUS', '${geoprint.url}' + '${geoprint.status}');

  /**
   * WMTS configuration
   *
   * @private
   * @type {object}
   */
  M.config('wmts', {
    base: '${wmts.base}',
  });

  /**
   * Controls configuration
   *
   * @private
   * @type {object}
   */
  M.config('controls', {
    default: '${controls.default}',
  });

  /**
   * Attributions configuration
   *
   * @private
   * @type {object}
   */
  M.config('attributions', {
    defaultAttribution: '${attributions.defaultAttribution}',
    defaultURL: '${attributions.defaultURL}',
    url: '${attributions.url}',
    type: '${attributions.type}',
  });

  /**
   * BackgroundLayers Control
   *
   * @private
   * @type {object}
   */
  M.config('backgroundlayers', backgroundlayersOpts);

  /**
   * IGNSearch List Control
   *
   * @private
   * @type {object}
   */
   M.config('IGNSEARCH_TYPES_CONFIGURATION', [
     // 'Comunidad autónoma',
     // 'Ciudad con estatuto de autonomía',
     // 'Provincia',
     // 'Municipio',
     // 'EATIM',
     'Isla administrativa',
     'Comarca administrativa',
     'Jurisdicción',
     // 'Capital de Estado',
     // 'Capital de comunidad autónoma y ciudad con estatuto de autonomí­a',
     // 'Capital de provincia',
     // 'Capital de municipio',
     // 'Capital de EATIM',
     // 'Entidad colectiva',
     // 'Entidad menor de población',
     'Distrito municipal',
     // 'Barrio',
     // 'Entidad singular',
     'Construcción/instalación abierta',
     'Edificación',
     'Vértice Geodésico',
     // 'Hitos de demarcación territorial',
     // 'Hitos en vías de comunicación',
     'Alineación montañosa',
     'Montaña',
     'Paso de montaña',
     'Llanura',
     'Depresión',
     'Vertientes',
     'Comarca geográfica',
     'Paraje',
     'Elemento puntual del paisaje',
     'Saliente costero',
     'Playa',
     'Isla',
     'Otro relieve costero',
     // 'Parque Nacional y Natural',
     'Espacio protegido restante',
     // 'Aeropuerto',
     // 'Aeródromo',
     // 'Pista de aviación y helipuerto',
     // 'Puerto de Estado',
     'Instalación portuaria',
     // 'Carretera',
     'Camino y ví­a pecuaria',
     // 'Ví­a urbana',
     // 'Ferrocarril',
     'Curso natural de agua',
     'Masa de agua',
     'Curso artificial de agua',
     'Embalse',
     'Hidrónimo puntual',
     'Glaciares',
     'Mar',
     'Entrante costero y estrecho marí­timo',
     'Relieve submarino',
   ]);
})(window.M);
