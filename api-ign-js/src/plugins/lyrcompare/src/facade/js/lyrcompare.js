/**
 * @module M/plugin/LyrCompare
 */
import 'assets/css/lyrcompare';
import LyrCompareControl from './lyrcomparecontrol';
import api from '../../api';
import { getValue } from './i18n/language'; //e2m: Multilanguage support
// import { isArray } from '../../../../../facade/js/util/Utils';

export default class LyrCompare extends M.Plugin {
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
     * Name plugin
     * @private
     * @type {String}
     */
    this.name_ = 'lyrcompare';

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
     * Class name of the html view Plugin
     * @public
     * @type {string}
     */
    this.className = 'm-plugin-lyrcompare';

    /**
     * Position of the Plugin
     * @public
     * Posible values: TR | TL | BL | BR
     * @type {String}
     */
    const positions = ['TR', 'TL', 'BL', 'BR'];
    this.position = positions.includes(options.position) ? options.position : 'TR';

    /**
     * Layer names that will have effects
     * @public
     * Value: the names separated with coma
     * @type {string}
     */

    this.layers = [];
    if (options.layers === undefined) {
      M.dialog.error('No se ha especificado una capa válida sobre la que aplicar el efecto');
    } else {
      if (Array.isArray(options.layers)) {
        this.layers = options.layers;
      } else {
        this.layers = options.layers.split(",");
      }
    }

    /**
     * Collapsed attribute
     * @public
     * @type {boolean}
     */
    this.collapsed = options.collapsed || true;

    /**
     * Collapsible attribute
     * @public
     * @type {boolean}
     */
    this.collapsible = options.collapsible || true;

    /**
     * Transparent effect staticDivision
     * Value: number in range 0 - 1
     * @type {number}
     * @public
     */
    if (options.staticDivision === undefined) {
      this.staticDivision = 1; //default: static
    } else {
      this.staticDivision = parseInt(options.staticDivision);
    }

    /**
     * Opacity level
     * Value: number in range 0 - 1
     * @type {number}
     * @public
     */
    if (options.opacityVal === undefined) {
      this.opacityVal = 100; //default: 100%
    } else {
      this.opacityVal = parseInt(options.opacityVal);
      if (this.opacityVal <= 0) {
        this.opacityVal = 0;
      } else if (this.opacityVal >= 100) {
        this.opacityVal = 100;
      }
    }

    /**
     * Comparison Mode
     * Value: number in range 0 - 1
     * @type {number}
     * @public
     */
    if (options.comparisonMode === undefined) {
      this.comparisonMode = 0; //default: 100%
    } else {
      this.comparisonMode = parseInt(options.comparisonMode);
      if (this.comparisonMode <= 0) {
        this.comparisonMode = 0;
      } else if (this.comparisonMode > 3) {
        this.comparisonMode = 0;
      }
    }

    /**
     * Default Layer A
     * Value: number in range 0 - 1
     * @type {number}
     * @public
     */
    if (options.defaultLyrA === undefined) {
      this.defaultLyrA = 0; //default: 100%
    } else {
      this.defaultLyrA = parseInt(options.defaultLyrA) - 1;
      if (this.defaultLyrA < 0) {
        this.defaultLyrA = 0;
      } else if (this.defaultLyrA > this.layers.length - 1) {
        M.dialog.error("Error defaultLyrA. Sólo existen " + this.layers.length + " capas disponibles");
      }
    }

    /**
     * Default Layer B
     * Value: number in range 0 - 1
     * @type {number}
     * @public
     */
    if (options.defaultLyrB === undefined) {
      this.defaultLyrB = this.defaultLyrA !== 0 ? 0 : 1;
    } else {
      this.defaultLyrB = parseInt(options.defaultLyrB) - 1;
      if (this.defaultLyrB < 0) {
        this.defaultLyrB = this.defaultLyrA !== 0 ? 0 : 1;
      } else if (this.defaultLyrB > this.layers.length - 1) {
        M.dialog.error("Error defaultLyrB. Sólo existen " + this.layers.length + " capas disponibles");
      }
    }
    if (this.defaultLyrA === this.defaultLyrB) {
      M.dialog.error("Las capas por defecto no pueden ser la misma B");
    }

    /**
     * Default Layer C
     * Value: number in range 0 - 1
     * @type {number}
     * @public
     */
    if (options.defaultLyrC === undefined) {
      this.defaultLyrC = 2;
    } else {
      this.defaultLyrC = parseInt(options.defaultLyrC) - 1;
      if (this.defaultLyrC < 0) {
        this.defaultLyrC = 2;
      } else if (this.defaultLyrC > this.layers.length - 1) {
        M.dialog.error("Error defaultLyrC. Sólo existen " + this.layers.length + " capas disponibles");
      }
    }
    if ((this.defaultLyrA === this.defaultLyrC) || (this.defaultLyrB === this.defaultLyrC)) {
      M.dialog.error("Las capas por defecto no pueden ser la misma C");
    }

    /**
     * Default Layer D
     * Value: number in range 0 - 1
     * @type {number}
     * @public
     */
    if (options.defaultLyrD === undefined) {
      this.defaultLyrD = 3;
    } else {
      this.defaultLyrD = parseInt(options.defaultLyrD) - 1;
      if (this.defaultLyrD < 0) {
        this.defaultLyrD = 3;
      } else if (this.defaultLyrD > this.layers.length - 1) {
        M.dialog.error("Error defaultLyrD. Sólo existen " + this.layers.length + " capas disponibles");
      }
    }
    if ((this.defaultLyrA === this.defaultLyrD) || (this.defaultLyrB === this.defaultLyrD) || (this.defaultLyrC === this.defaultLyrD)) {
      M.dialog.error("Las capas por defecto no pueden ser la misma D");
    }


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

    const values = {
      layers: this.layers,
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      staticDivision: this.staticDivision,
      opacityVal: this.opacityVal,
      comparisonMode: this.comparisonMode,
      defaultLyrA: this.defaultLyrA,
      defaultLyrB: this.defaultLyrB,
      defaultLyrC: this.defaultLyrC,
      defaultLyrD: this.defaultLyrD,
    };

    //

    this.control_ = new LyrCompareControl(values);
    this.controls_.push(this.control_);
    this.map_ = map; //panelLyrCompare
    this.panel_ = new M.ui.Panel('panel_selection_raw', {
      collapsible: this.collapsible,
      collapsed: this.collapsed,
      position: M.ui.position[this.position],
      className: this.className,
      collapsedButtonClass: 'lyrcompare-icon',
      tooltip: this.tooltip_,
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
    this.map_.removeControls([this.control_]);
    [this.control_, this.panel_, this.map_, this.layers, this.collapsible, this.collapsed, this.staticDivision, this.opacityVal, this.comparisonMode, this.defaultLyrA, this.defaultLyrB, this.defaultLyrC, this.defaultLyrD] = [null, null, null, null, null, null, null, null, null, null, null, null];
  }

  /**
   * This function gets name plugin
   * @getter
   * @public
   * @returns {string}
   * @api stable
   */
  get name() {
    return this.name_;
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @getter
   * @api stable
   * @return {Object}
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
    return `${this.name}=${this.position}*!${this.layers.join(',')}*!${this.collapsible}*!${this.collapsed}*!${this.staticDivision}*!${this.opacityVal}*!${this.comparisonMode}*!${this.defaultLyrA}*!${this.defaultLyrB}*!${this.defaultLyrC}*!${this.defaultLyrD}`;
  }

  /**
   * Activate plugin
   *
   * @function
   * @public
   * @api
   */
  activate() {
    this.control_.activate();
  }

  /**
   * Desactivate plugin
   *
   * @function
   * @public
   * @api
   */
  deactivate() {
    this.control_.deactivate();
  }

  /**
   * This
   function compare
   *
   * @public
   * @function
   * @param {M.plugin} plugin to compare
   * @api stable
   */
  equals(plugin) {
    if (plugin instanceof LyrCompare) {
      return true;
    }
    return false;
  }
}
