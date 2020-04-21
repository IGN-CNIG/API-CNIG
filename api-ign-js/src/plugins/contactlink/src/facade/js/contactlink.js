/**
 * @module M/plugin/ContactLink
 */
import 'assets/css/contactlink';
import 'assets/css/fonts';
import ContactLinkControl from './contactlinkcontrol';
import api from '../../api';
import { getValue } from './i18n/language';


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
  constructor(options) {
    super();

    /**
     * Name plugin
     * @private
     * @type {String}
     */
    this.name_ = 'contactlink';

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
    this.className = 'm-plugin-contactlink';

    /**
     * Position of the Plugin
     * @public
     * Posible values: TR | TL | BL | BR
     * @type {String}
     */
    const positions = ['TR', 'TL', 'BL', 'BR'];
    this.position = positions.includes(options.position) ? options.position : 'TR';

    /**
     * Link to cnig downloads
     * @private
     * @type {String}
     */
    this.linksDescargasCnig = options.descargascnig || 'http://centrodedescargas.cnig.es/CentroDescargas/index.jsp';

    /**
     * Link to pnoa comparator
     * @private
     * @type {String}
     */
    this.linksPnoa = options.pnoa || 'https://www.ign.es/web/comparador_pnoa/index.html';

    /**
     * Link to 3d visualizer
     * @private
     * @type {String}
     */
    this.linksVisualizador3d = options.visualizador3d || 'https://www.ign.es/3D-Stereo/';

    /**
     * Link to fototeca
     * @private
     * @type {String}
     */
    this.linksFototeca = options.fototeca || 'https://fototeca.cnig.es/';

    /**
     * Link to twitter
     * @private
     * @type {String}
     */
    this.linksTwitter = options.twitter || 'https://twitter.com/IGNSpain';

    /**
     * Link to instagram
     * @private
     * @type {String}
     */
    this.linksInstagram = options.instagram || 'https://www.instagram.com/ignspain/';

    /**
     * Link to facebook
     * @private
     * @type {String}
     */
    this.linksFacebook = options.facebook || 'https://www.facebook.com/IGNSpain/';

    /**
     * Link to pinterest
     * @private
     * @type {String}
     */
    this.linksPinterest = options.pinterest || 'https://www.pinterest.es/IGNSpain/';

    /**
     * Link to cnig downloads
     * @private
     * @type {String}
     */
    this.linksYoutube = options.youtube || 'https://www.youtube.com/user/IGNSpain';

    /**
     * Link to mail
     * @private
     * @type {String}
     */
    this.linksMail = options.mail || 'mailto:ign@fomento.es';

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

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
    const pluginOnLeft = !!(['TL', 'BL'].includes(this.position));

    const values = {
      pluginOnLeft,

      descargascnig: this.linksDescargasCnig,

      pnoa: this.linksPnoa,

      visualizador3d: this.linksVisualizador3d,

      fototeca: this.linksFototeca,

      twitter: this.linksTwitter,

      instagram: this.linksInstagram,

      facebook: this.linksFacebook,

      pinterest: this.linksPinterest,

      youtube: this.linksYoutube,

      mail: this.linksMail,

    };

    this.control_ = new ContactLinkControl(values);
    this.controls_.push(this.control_);
    // this.controls_.push(new ContactLinkControl(values));
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelContactLink', {
      collapsible: true,
      position: M.ui.position[this.position],
      className: this.className,
      collapsedButtonClass: 'g-contactlink-link',
      tooltip: this.tooltip_,
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
   * Name of the plugin
   *
   * @getter
   * @function
   */
  get name() {
    return 'contactlink';
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
    this.links = null;
  }

  /**
   * Get the API REST Parameters of the plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position}*${this.linksDescargasCnig}*${this.linksPnoa}*${this.linksVisualizador3d}*${this.linksFototeca}*${this.linksTwitter}*${this.linksInstagram}*${this.linksFacebook}*${this.linksPinterest}*${this.linksYoutube}*${this.linksMail}`;
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
