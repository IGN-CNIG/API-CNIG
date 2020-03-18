/**
 * @module M/plugin/BackImgLayer
 */
// import '/assets/css/backimglayer';
import '../assets/css/backimglayer';
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
     * Plugin name
     * @public
     * @type {String}
     */
    this.name = 'backimglayer';

    /**
     * Plugin parameters
     * @public
     * @type {object}
     */
    this.options = options;

    /**
     * Position of the plugin
     *
     * @private
     * @type {Enum} TL | TR | BL | BR
     */
    this.position_ = options.position || 'TR';

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
     * Layers to use as background. Each one has id, title, preview and layers attributes.
     * @private
     * @type {Object}
     */
    this.layerOpts = options.layerOpts || undefined;

    /**
     * Layers id's separated by ','.
     * @public
     * @type {String}
     */
    this.ids = options.ids || '';

    /**
     * Layers titles separated by ','.
     * @public
     * @type {String}
     */
    this.titles = options.titles || '';

    /**
     * Layers preview urls separated by ','.
     * @public
     * @type {String}
     */
    this.previews = options.previews || '';

    /**
     * Layers separated by ','.
     * Each base layer can contain more than one layer separated by 'sumar' (before: '+').
     * Each of these layers has different parameters separated by 'asterisco'(NOT * ).
     * @public
     * @type {String}
     */
    this.layers = options.layers || '';

    this.collapsed = options !== undefined ? options.collapsed : true;
    this.collapsible = options !== undefined ? options.collapsible : true;

    this.columnsNumber = options.columnsNumber != null ? options.columnsNumber : 2;
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
      this.ids,
      this.titles,
      this.previews,
      this.layers,
      this.columnsNumber,
    ));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelBackImgLayer', {
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      position: M.ui.position[this.position_],
      className: 'm-plugin-backimglayer',
      tooltip: 'Capas de fondo',
      collapsedButtonClass: 'backimglyr-simbolo-cuadros',
    });

    this.controls_[0].on('backimglayer:activeChanges', (data) => {
      this.layerId = data.activeLayerId;
    });

    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
   * Gets the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    const layers = this.layerOpts === undefined ?
      `${this.ids}*${this.titles}*${this.previews}*${this.layers}` :
      this.turnLayerOptsIntoUrl();
    return `${this.name}=${this.position_}*${this.collapsible}*${this.collapsed}*${this.layerId}*${this.layerVisibility}*${layers}`;
  }

  /**
   * Turns layerOpts parameter into piece of REST url.
   * @public
   * @function
   * @api
   */
  turnLayerOptsIntoUrl() {
    let ids = '';
    let titles = '';
    let previews = '';
    let layersUrl = '';

    this.layerOpts.forEach((l) => {
      const backLayerIndex = this.layerOpts.indexOf(l);
      if (backLayerIndex !== 0) {
        ids += ',';
        titles += ',';
        previews += ',';
        layersUrl += ',';
      }

      ids += l.id;
      titles += l.title;
      previews += l.preview;

      l.layers.forEach((layer) => {
        const isFirstLayer = l.layers.indexOf(layer) === 0;
        const visible = layer.options.visibility === undefined ? true : layer.options.visibility;

        if (!isFirstLayer) layersUrl += 'sumar';

        layersUrl += `${layer.options.type}`;
        layersUrl += `asterisco${layer.options.url}`;
        layersUrl += `asterisco${layer.options.name}`;
        layersUrl += `asterisco${layer.options.matrixSet}`;
        layersUrl += `asterisco${layer.options.legend}`;

        layersUrl += `asterisco${layer.options.transparent}`;

        layersUrl += `asterisco${layer.options.format}`;
        layersUrl += `asterisco${layer.options.displayInLayerSwitcher}`;
        layersUrl += `asterisco${layer.options.queryable}`;
        layersUrl += `asterisco${visible}`;
      });
    });

    return `${ids}*${titles}*${previews}*${layersUrl}`;
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.map_.removeControls(this.controls_);
    this.map_ = null;
    this.control_ = null;
    this.controls_ = null;
    this.panel_ = null;
    this.name = null;
  }
}
