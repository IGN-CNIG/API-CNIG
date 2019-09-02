/**
 * @module M/plugin/BackImgLayer
 */
import 'assets/css/backimglayer';
import BackImgLayerControl from './backimglayercontrol';

export default class BackImgLayer extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor(options = {}) {
    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Position of the plugin
     *
     * @private
     * @type {Enum} TL | TR | BL | BR
     */
    this.position_ = options.position || 'TR';

    /**
     * Layers to use as background. Each one has id, title, preview and layers attributes.
     * @private
     * @type {Object}
     */
    this.layerOpts = options.layerOpts;

    /**
     * Position of current background layer on layers array.
     * @private
     * @type {Number}
     */
    this.layerId = options.layerId || 0;

    /**
     * Visibility of current background layer.
     * @private
     * @type {Boolean}
     */
    this.layerVisibility = options.layerVisibility || true;

    /**
     * @public
     * @type {object}
     */
    this.options = options;
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.controls_.push(new BackImgLayerControl(
      map,
      this.layerOpts,
      this.layerId,
      this.layerVisibility,
    ));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelBackImgLayer', {
      collapsible: true, // TODO: change back to true
      position: M.ui.position[this.position_],
      className: 'm-plugin-backimglayer',
      tooltip: 'Selección de capa de fondo',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
