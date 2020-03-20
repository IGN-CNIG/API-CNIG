/**
 * @module M/plugin/ContactLink
 */
import 'assets/css/contactlink';
import 'assets/css/fonts';
import ContactLinkControl from './contactlinkcontrol';
import api from '../../api';

export default class ContactLink extends M.Plugin {
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
    this.name_ = 'contactLink';

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
    this.className = 'm-plugin-contactLink';

    /**
     * Links
     * @public
     * Value: Access links
     * @type {string}
     */
    if (options.links === undefined) {
      M.dialog.error('No se han especificado enlaces para acceder');
      this.links = [];
    } else {
      if (Array.isArray(options.links)) {
        this.links = options.links;
      } else {
        this.links = options.links.split(",");
      }
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
    const values = {
      links: this.links,
    };
    this.controls_.push(new ContactLinkControl(values));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelContactLink', {
      collapsible: true,
      position: M.ui.position.TR,
      className: this.className,
      collapsedButtonClass: 'g-contactlink-link',
      tooltip: 'Enlaces',
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
}
