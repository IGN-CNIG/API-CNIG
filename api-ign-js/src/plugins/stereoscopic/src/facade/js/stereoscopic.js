/**
 * @module M/plugin/Stereoscopic
 */
import 'assets/css/stereoscopic';
import StereoscopicControl from './stereoscopiccontrol';
import api from '../../api.json';
import { getValue } from './i18n/language';

export default class Stereoscopic extends M.Plugin {
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
  constructor(parameters = {}) {
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
     * @private
     * @type {String}
     */
    this.position_ = parameters.position || 'TR';

    /**
     * Option to allow the plugin to be collapsed or not
     * @private
     * @type {Boolean}
     */
    this.collapsed_ = parameters.collapsed;
    if (this.collapsed_ === undefined) this.collapsed_ = true;

    /**
     * Option to allow the plugin to be collapsible or not
     * @private
     * @type {Boolean}
     */
    this.collapsible_ = parameters.collapsible;
    if (this.collapsible_ === undefined) this.collapsible_ = true;

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     * Activate OrbitControls
     * @private
     * @type {boolean}
     */
     this.orbitControls_ = (parameters.orbitControls) ? true : false;


    /**
     * Activate anaglyph default
     * @private
     * @type {boolean}
     */
     this.anaglyphActive_ = (parameters.anaglyphActive) ? true : false;
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
    const control = new StereoscopicControl(this.orbitControls_,  this.anaglyphActive_);
    this.controls_.push(control);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelStereoscopic', {
      collapsed: this.collapsed_,
      collapsible: this.collapsible_,
      className: 'm-plugin-stereoscopic',
      position: M.ui.position[this.position_],
      tooltip: getValue('generate_3d_view'),
      collapsedButtonClass: 'stereoscopic-plugin-3D',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);

    map.on(M.evt.COMPLETED, () => {
      let mapProperties = map.getLayers()[0].getImpl().getOL3Layer().getProperties();
      let mapSource = mapProperties.source;
      mapSource.crossOrigin = 'anonymous'
      mapProperties.source = mapSource;
      map.getLayers()[0].getImpl().getOL3Layer().setProperties(mapProperties);

      window.map = this.map_;
      control.addScript();
    })
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
