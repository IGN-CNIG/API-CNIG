/**
 * @module M/plugin/Topographicprofile
 */
import 'assets/css/topographicprofile';
import TopographicprofileControl from './topographicprofilecontrol';
import api from '../../api';
import { getValue } from './i18n/language';

export default class Topographicprofile extends M.Plugin {
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
  constructor(opts = {}) {
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
     * Position
     * @private
     * @type {Array<M.Control>}
     */
    this.position_ = opts.position ? opts.position : 'TR';


    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;



    this.facadeMap_ = null;
    this.panel_ = null;
    this.control_ = null;
    this.options_ = opts;
    this.options_.distance = opts.distance || 30;
    // this.options_.serviceURL = opts.serviceURL || ((M.config.GGIS_RESTAPI) ? M.config.GGIS_RESTAPI + "/services/elevation" : "http://ggiscloud.guadaltel.com/ggiscloud/restapi/services/elevation");
    //'http://idecan5.grafcan.es/ServicioWPS/mdt';
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
    this.controls_.push(new TopographicprofileControl(this.options_));
    this.map_ = map;
    // panel para agregar control - no obligatorio
    this.panel_ = new M.ui.Panel('panelTopographicprofile', {
      // 'collapsible': true,
      'className': 'm-topographicprofile',
      'collapsedButtonClass': 'g-grafica-puntos2',
      'position': M.ui.position[this.position_],
      'tooltip': getValue('tooltip')
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
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

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position_}`
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
    [this.map_, this.controls_, this.panel_] = [null, null, null];
  }

  get name() {
    return "topographicprofile";
  }
}
