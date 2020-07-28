/**
 * IGN API
 * Version 3.0.0
 * Date 27-07-2020
 */

const backgroundlayersIds = 'mapa,imagen,hibrido'.split(',');
const backgroundlayersTitles = 'Mapa,Imagen,H&iacute;brido'.split(',');
const backgroundlayersLayers = 'WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*base*false*image/jpeg*false*false*true,WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*imagen*false*image/jpeg*false*false*true,WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*imagen*true*image/jpeg*false*false*true+WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseOrto*GoogleMapsCompatible*Callejero*true*image/png*false*false*true'.split(',');
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
  M.config('MOBILE_WIDTH', '768');

  /**
   * The Mapea URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('MAPEA_URL', 'https://api-ign-lite.desarrollo.guadaltel.es/api-core');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_URL', location.protocol + '//api-ign-lite.desarrollo.guadaltel.es/api-core/api/proxy');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_POST_URL', location.protocol + '//api-ign-lite.desarrollo.guadaltel.es/api-core/proxyPost');

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
  M.config('THEME_URL', location.protocol + '//api-ign-lite.desarrollo.guadaltel.es/api-core/assets/');

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
   * WMTS configuration
   *
   * @private
   * @type {object}
   */
  M.config('wmts', {
    base: 'WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible**false',
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
    url: 'https://api-ign-lite.desarrollo.guadaltel.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    type: 'kml',
  });

  /**
   * BackgroundLayers Control
   *
   * @private
   * @type {object}
   */
  M.config('backgroundlayers', backgroundlayersOpts);
})(window.M);
