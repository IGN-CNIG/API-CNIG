/**
 * Mapea API
 * Version ${pom.version}
 * Date ${build.timestamp}
 */
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
})(window.M);
