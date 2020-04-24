/**
 * @module M/plugin/SelectionZoom
 */
// import '/assets/css/selectionzoom';
import '../assets/css/selectionzoom';
import api from '../../api';
import SelectionZoomControl from './selectionzoomcontrol';
import { getValue } from './i18n/language';

export default class SelectionZoom extends M.Plugin {
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
    this.name = 'selectionzoom';

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
     * Layers id's separated by ','.
     * @public
     * @type {Array}
     */
    this.ids = options.ids || '';

    /**
     * Layers titles separated by ','.
     * @public
     * @type { Array }
     */
    this.titles = options.titles || '';

    /**
     * Layers preview urls separated by ','.
     * @public
     * @type { Array }
     */
    this.previews = options.previews || '';

    /**
     * Layers preview urls separated by ','.
     * @public
     * @type { Array }
     */
    this.zooms = options.zooms || '';

    /**
     * Layers preview urls separated by ','.
     * @public
     * @type { Array }
     */
    this.bboxs = options.bboxs || '';


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

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     *@private
     *@type { string }
     */
    this.tooltip_ = options.tooltip || getValue('tooltip');
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
    this.controls_.push(new SelectionZoomControl(
      map,
      this.layerId,
      this.layerVisibility,
      this.ids,
      this.titles,
      this.previews,
      this.bboxs,
      this.zooms,
    ));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelSelectionZoom', {
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      position: M.ui.position[this.position_],
      className: 'm-plugin-selectionzoom',
      tooltip: this.tooltip_,
      collapsedButtonClass: 'g-selectionzoom-selezoom',
    });

    this.controls_[0].on('selectionzoom:activeChanges', (data) => {
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
    return `${this.name}=${this.position_}*${this.collapsible}*${this.collapsed}*${this.layerId}
    *${this.layerVisibility}*${this.ids}`;
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
    let bboxs = '';
    let zooms = '';


    this.layerOpts.forEach((l) => {
      const backLayerIndex = this.layerOpts.indexOf(l);
      if (backLayerIndex !== 0) {
        ids += ',';
        titles += ',';
        previews += ',';
        bboxs += ',';
        zooms += ',';
      }

      ids += l.ids;
      titles += l.titles;
      previews += l.previews;
      bboxs += l.zooms;
      zooms += l.zooms;
    });

    return `${ids}s*${titles}*${previews}*${bboxs}*${zooms}`;
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

  /**
   * This function compare if pluging recieved by param is instance of   M.plugin.Printer
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof SelectionZoom) {
      return true;
    }
    return false;
  }
  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata() {
    return this.metadata_;
  }
}
