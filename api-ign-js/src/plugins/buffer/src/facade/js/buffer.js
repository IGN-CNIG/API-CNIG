/**
 * @module M/plugin/Buffer
 */

import 'assets/css/fonts';
import 'assets/css/buffer';
import BufferControl from './buffercontrol';
import BufferLayer from './bufferLayer';
import api from '../../api';
import { getValue, addTranslation } from './i18n/language';

export default class Buffer extends M.Plugin {
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
     * Position of the Plugin
     * Posible values: TR | TL | BL | BR
     * @type {Enum}
     */
    this.position_ = options.position || 'TL';

    /**
     * Option to allow the plugin to be collapsed or not
     * @private
     * @type {Boolean}
     */
    this.collapsed_ = options.collapsed;
    if (this.collapsed_ === undefined) this.collapsed_ = true;

    /**
     * Option to allow the plugin to be collapsible or not
     * @private
     * @type {Boolean}
     */
    this.collapsible_ = options.collapsible;
    if (this.collapsible_ === undefined) this.collapsible_ = true;

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;
  }

  /**
   * change plugin language
   *
   * @public
   * @function
   * @param {string} lang type language
   * @api stable
   */
  addTranslationPlugin(lang) {
    addTranslation(lang, M.language.getTranslation(lang).buffer);
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
    this.map_ = map;
    this.featuresEdit = new ol.Collection();
    this.featureOverlay = new ol.layer.Vector({
      source: new ol.source.Vector({ name: 'bufferLayer', features: this.featuresEdit }),
      style: new ol.style.Style({
        fill: new ol.style.Fill({ color: 'rgba(255, 255, 0, 0.2)' }),
        stroke: new ol.style.Stroke({ color: '#71a7d3', width: 3 }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({ color: '#71a7d3' }),
        }),
      }),
    });
    this.featureOverlay.setMap(this.map_.getMapImpl());

    const layerAux = this.hasLayerBuffer_();
    if (layerAux == null) {
      this.bufferLayer = new BufferLayer(this.featureOverlay);
      this.map_.addLayers(this.bufferLayer);
    } else {
      this.bufferLayer = layerAux;
    }

    this.control_ = new BufferControl(this.featureOverlay, this.featuresEdit);

    this.panelTools_ = new M.ui.Panel('buffer', {
      collapsed: this.collapsed_,
      collapsible: this.collapsible_,
      className: 'm-buffer',
      collapsedButtonClass: 'icon-buffer',
      position: M.ui.position[this.position_],
      tooltip: getValue('tooltip'),
    });
    this.panelTools_.addControls(this.control_);
    this.map_.addPanels(this.panelTools_);
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.map_.removeControls(this.control_);
    if (this.bufferLayer.getImpl().getOL3Layer()) {
      this.bufferLayer.getImpl().getOL3Layer().getSource().clear(true);
    }
    this.control_.removeFeatures();
    this.map_ = null;
    this.control_ = null;
    this.panelTools_ = null;
    this.featuresEdit = null;
    this.featureOverlay = null;
  }

  /**
   * This function return the control of plugin
   *
   * @public
   * @function
   * @api stable
   */
  getControls() {
    const aControl = [];
    aControl.push(this.control_);
    return aControl;
  }

  /**
   * @getter
   * @public
   */
  get name() {
    return 'buffer';
  }

  /**
   * This functions returns the controls of the plugin.
   *
   * @public
   * @return {M.Control}
   * @api
   */
  get control() {
    return this.control_;
  }

  hasLayerBuffer_() {
    const layers = this.map_.getLayers();
    for (let i = 0; i < layers.length; i += 1) {
      const layerAux = layers[i];
      if (layerAux instanceof BufferLayer) {
        return layerAux;
      }
    }
    return null;
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name_}=${this.position_}*${this.collapsed_}*${this.collapsible_}`;
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
