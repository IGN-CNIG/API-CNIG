/**
 * @module M/plugin/FullTOC
 */
import '../assets/css/fulltoc';
import '../assets/css/fonts';
import FullTOCControl from './fulltoccontrol';
import api from '../../api';
import { getValue } from './i18n/language';

export default class FullTOC extends M.Plugin {
  /**
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api
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
     * @private
     * @type {string}
     */
    this.position_ = options.position || 'TR';

    /**
     * This parameter set if the plugin is collapsed
     * @private
     * @type {boolean}
     */
    this.collapsed_ = options.collapsed !== undefined ? options.collapsed : true;

    /**
     * Name of the plugin
     * @private
     * @type {String}
     */
    this.name_ = 'fulltoc';

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     * WMS service protocol type
     * @type {Boolean}
     */
    this.http = true;
    if (options.http !== undefined && (options.http === false || options.http === 'false')) {
      this.http = false;
    }

    this.https = true;
    if (options.https !== undefined && (options.https === false || options.https === 'false')) {
      this.https = false;
    }

    /**
     * Precharged services
     * @private
     * @type {String}
     */
    this.precharged = options.precharged;
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
    this.control_ = new FullTOCControl(this.http, this.https, this.precharged);
    this.panel_ = new M.ui.Panel('panelFullTOC', {
      className: 'm-plugin-fulltoc',
      collapsed: this.collapsed_,
      collapsible: true,
      position: M.ui.position[this.position_],
      collapsedButtonClass: 'icon-capas',
      tooltip: getValue('tooltip'),
    });

    this.controls_.push(this.control_);
    this.control_.on(M.evt.ADDED_TO_MAP, () => {
      this.fire(M.evt.ADDED_TO_MAP);
    });

    this.map_.on(M.evt.COMPLETED, () => {
      if (this.map_ !== null) {
        if (this.control_ !== null) {
          this.control_.render();
        }

        this.map_.on(M.evt.ADDED_LAYER, () => {
          if (this.control_ !== null) {
            this.control_.render();
          }
        });

        this.map_.on(M.evt.REMOVED_LAYER, () => {
          if (this.control_ !== null) {
            this.control_.render();
          }
        });
      }
    });

    this.panel_.addControls(this.controls_);
    this.map_.addPanels(this.panel_);
  }

  /**
   * This function returns the position
   *
   * @public
   * @return {string}
   * @api
   */
  get position() {
    return this.position_;
  }

  /**
   * Name of the plugin
   *
   * @getter
   * @function
   */
  get name() {
    return this.name_;
  }

  /**
   * Collapsed parameter
   *
   * @getter
   * @function
   */
  get collapsed() {
    return this.panel_.isCollapsed();
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position}*${this.collapsed}`;
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
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    this.map_.removeControls([this.control_]);
    [this.control_, this.controls_, this.panel_] = [null, null, null];
  }
}
