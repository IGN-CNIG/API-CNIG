/**
 * @module M/plugin/FototecaHelp
 */
import 'assets/css/fototecahelp';
import FototecaHelpControl from './fototecahelpcontrol';
import api from '../../api';
import { getValue } from './i18n/language';

export default class FototecaHelp extends M.Plugin {
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
     * Plugin position on window.
     * @private
     * @type {String}
     */
    this.position_ = options.position || 'TR';

    /**
     * Link for 'more info' documentation.
     * @private
     * @type {String}
     */
    this.helpLink_ = options.helpLink || 'http://fototeca.cnig.es/help_es.pdf';

    /**
     * Contact email address.
     * @private
     * @type {String}
     */
    this.contactEmail_ = options.contactEmail || 'fototeca@cnig.es';

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     * Name of the plugin
     * @public
     * @type {String}
     */
    this.name = 'fototecahelp';

    /**
     * Plugin tooltip
     *
     * @private
     * @type {string}
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
    this.control_ = new FototecaHelpControl(this.helpLink_, this.contactEmail_);
    this.controls_.push(this.control_);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelFototecaHelp', {
      className: 'm-panel-fototecahelp',
      collapsed: true,
      collapsedButtonClass: 'icon-help',
      collapsible: true,
      position: M.ui.position[this.position_],
      tooltip: this.tooltip_,
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
    this.panel_.on(M.evt.SHOW, () => {
      window.addEventListener('click', (e) => {
        if (!document.getElementById('fototecahelpbox').parentNode.contains(e.target)) {
          this.panel_.collapse();
        }
      });
    });
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    this.map_.removeControls([this.control_]);
    [this.map_, this.control_, this.panel_] = [null, null, null];
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position_}*${this.helpLink_}*${this.contactEmail_}`;
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
