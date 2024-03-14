/**
 * @module M/plugin/VectorsManagement
 */
import '../assets/css/vectorsmanagement';
import VectorsManagementControl from './vectorsmanagementcontrol';

import { getValue } from './i18n/language';

import es from './i18n/es';
import en from './i18n/en';

export default class VectorsManagement extends M.Plugin {
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
    this.name = 'vectorsmanagement';

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
     * @private
     * @type {string}
     *
     * Indicates if the plugin is collapsed on entry (true/false).
     */
    this.collapsed = options.collapsed !== undefined ? options.collapsed : true;

    /**
     * @private
     * @type {string}
     *
     * Indicates if the plugin can be collapsed into a button (true/false).
     */
    this.collapsible = options.collapsible !== undefined ? options.collapsible : true;

    /**
     * @private
     * @type {boolean}
     *
     * Indicates if the selection control is active (true/false)
     */
    this.selection = options.selection !== undefined ? options.selection : true;

    /**
     * @private
     * @type {boolean}
     *
     * Indicates if the addlayer control is active (true/false)
     */
    this.addlayer = options.addlayer !== undefined ? options.addlayer : true;

    /**
     * @private
     * @type {boolean}
     *
     * Indicates if the analysis control is active (true/false)
     */
    this.analysis = this.selection && (options.analysis !== undefined ? options.analysis : true);

    /**
     * @private
     * @type {boolean}
     *
     * Indicates if the creation control is active (true/false)
     */
    this.creation = this.selection && (options.creation !== undefined ? options.creation : true);

    /**
     * @private
     * @type {boolean}
     *
     * Indicates if the download control is active (true/false)
     */
    this.download = this.selection && (options.download !== undefined ? options.download : true);

    /**
     * @private
     * @type {boolean}
     *
     * Indicates if the edition control is active (true/false)
     */
    this.edition = this.selection && (options.edition !== undefined ? options.edition : true);

    /**
     * @private
     * @type {boolean}
     *
     * Indicates if the help control is active (true/false)
     */
    this.help = (options.help !== undefined ? options.help : true);

    /**
     * @private
     * @type {boolean}
     *
     * Indicates if the style control is active (true/false)
     */
    this.style = this.selection && (options.style !== undefined ? options.style : true);

    // Tooltip
    this.tooltip_ = options.tooltip || getValue('tooltip');

    // Determina si el plugin es draggable o no
    this.isDraggable = !M.utils.isUndefined(options.isDraggable) ? options.isDraggable : false;
  }

  /**
   * Return plugin language
   *
   * @public
   * @function
   * @param {string} lang type language
   * @api stable
   */
  static getJSONTranslations(lang) {
    if (lang === 'en' || lang === 'es') {
      return (lang === 'en') ? en : es;
    }
    return M.language.getTranslation(lang).vectorsmanagement;
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
    this.controls_.push(new VectorsManagementControl({
      map,
      selection: this.selection,
      addlayer: this.addlayer,
      analysis: this.analysis,
      creation: this.creation,
      download: this.download,
      edition: this.edition,
      help: this.help,
      style: this.style,
      isDraggable: this.isDraggable,
    }));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('VectorsManagement', {
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      position: M.ui.position[this.position_],
      className: 'm-plugin-vectorsmanagement',
      tooltip: this.tooltip_,
      collapsedButtonClass: 'vectorsmanagement-icon-vectors',
    });

    this.controls_[0].on('vectorsmanagement:activeChanges', (data) => {
      this.layerId = data.activeLayerId;
    });

    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
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
    this.layerOpts = null;
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
    if (plugin instanceof VectorsManagement) {
      return true;
    }
    return false;
  }
}

