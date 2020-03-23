/**
 * @module M/plugin/Curtain
 */
import 'assets/css/curtain';
import CurtainControl from './curtaincontrol';
import api from '../../api';

export default class Curtain extends M.Plugin {
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
     * Name of this control
     * @public
     * @type {string}
     * @api stable
     */
    this.name = Curtain.NAME;

    /**
     * Layer 1
     * @public
     * Value: the layer on the left side
     * @type {layer}
     */
    if (options.layer1 === undefined) {
      M.dialog.error('No se ha especificado una capa válida sobre la que aplicar el efecto');
      this.layer1 = undefined;
    } else {
      this.layer1 = options.layer1;
    }

    /**
     * Layer 2
     * @public
     * Value: the layer on the right side
     * @type {layer}
     */
    if (options.layer2 === undefined) {
      M.dialog.error('No se ha especificado una capa válida sobre la que aplicar el efecto');
      this.layer2 = undefined;
    } else {
      this.layer2 = options.layer2;
    }

    /**
     * Orientation
     * @public
     * Value: orientation (vertical|horizontal)
     * @type {string}
     */
    if (options.orientation === null || options.orientation.lenght() === 0) {
      this.orientation = 'vertical';
    } else {
      this.orientation = options.orientation;
    }

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;
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
    this.controls_.push(new CurtainControl());
    this.map_ = map;
    // panel para agregar control - no obligatorio
    // this.panel_ = new M.ui.Panel('panelCurtain', {
    //   collapsible: true,
    //   position: M.ui.position.TR,
    //   collapsedButtonClass: 'g-cartografia-flecha-izquierda',
    // });
    // this.panel_.addControls(this.controls_);
    // map.addPanels(this.panel_);
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

/**
 * Name to identify this plugin
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Curtain.NAME = 'curtain';
