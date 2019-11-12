/**
 * @module M/plugin/IGNHelp
 */
import 'assets/css/ignhelp';
import IGNHelpControl from './ignhelpcontrol';

export default class IGNHelp extends M.Plugin {
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
  constructor(options) {
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
    this.controls_.push(new IGNHelpControl(this.helpLink_, this.contactEmail_));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelIGNHelp', {
      className: 'm-panel-ignhelp',
      collapsed: true,
      collapsedButtonClass: 'ignhelp-info',
      collapsible: true,
      position: M.ui.position[this.position_],
      tooltip: 'Más información',
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }
}
