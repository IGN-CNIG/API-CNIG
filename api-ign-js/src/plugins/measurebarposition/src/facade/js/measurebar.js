/**
 * @module M/plugin/MeasureBar
 */
import MeasureLength from './measurelength';
import MeasureArea from './measurearea';
import MeasureClear from './measureclear';
import MeasurePosition from './measureposition';
import { getValue } from './i18n/language';
import '../assets/css/measurebar';

export default class MeasureBar extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
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
     *
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];


    /**
     * Position of plugin over map.
     *
     * @private
     * @type {String} 'TL', 'TR', 'BR', 'BL'
     */
    this.position_ = options.position;


    /**
     * Control MeasureLength
     * @private
     * @type {M.control.MeasureLength}
     */
    this.measureLength_ = null;

    /**
     * Control MeasureArea
     * @private
     * @type {M.control.MeasureArea}
     */
    this.measureArea_ = null;

    /**
     * Control MeasureClear
     * @private
     * @type {M.control.MeasureClear}
     */
    this.measureClear_ = null;

    /**
     * Control MeasurePosition
     * @private
     * @type {M.control.MeasurePosition}
     */
    this.measurePosition_ = null;
  }

  /**
   * @inheritdoc
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.map_ = map;

    this.measureLength_ = new MeasureLength();
    this.measureArea_ = new MeasureArea();
    this.measurePosition_ = new MeasurePosition();
    this.measureClear_ = new MeasureClear(
      this.measureLength_,
      this.measureArea_,
      this.measurePosition_,
    );

    this.controls_.push(
      this.measureLength_,
      this.measureArea_,
      this.measureClear_,
      this.measurePosition_,
    );

    this.panel_ = new M.ui.Panel('MeasureBar', {
      collapsible: true,
      position: M.ui.position[this.position_],
      className: 'm-panel-measurebar',
      collapsedButtonClass: 'measurebar-regla',
      tooltip: getValue('text.tooltip'),
    });

    this.panel_.addControls(this.controls_);

    this.map_.addPanels(this.panel_);
  }

  /**
   * Name of the plugin
   *
   * @getter
   * @function
   */
  get name() {
    return 'measurebar';
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position_}`;
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.map_.removeControls([
      this.measureLength_,
      this.measureArea_,
      this.measureClear_,
      this.measurePosition_,
    ]);
    this.map_ = null;
    this.measureLength_ = null;
    this.measureArea_ = null;
    this.measureClear_ = null;
    this.measurePosition_ = null;
  }

  /**
   * This function return the control of plugin
   *
   * @public
   * @function
   * @api stable
   */
  getControls() {
    const aControls = [];
    aControls.push(
      this.measureArea_,
      this.measureClear_,
      this.measureLength_,
      this.measurePosition_,
    );
    return aControls;
  }

  /**
   * This function compare if pluging recieved by param is instance of M.plugin.MeasureBar
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof MeasureBar) {
      return true;
    }
    return false;
  }
}
