/**
 * @module M/plugin/QueryAttributes
 */
import 'assets/css/queryattributes';
import 'assets/css/fonts';
import QueryAttributesControl from './queryattributescontrol';
import api from '../../api';
import { getValue } from './i18n/language';

export default class QueryAttributes extends M.Plugin {
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
     * Position of the plugin on browser window
     * @private
     * @type {Enum}
     * Possible values: 'TL', 'TR', 'BR', 'BL'
     */
    this.position_ = options.position || 'TL';

    /**
     * Option to allow the plugin to be collapsed or not
     * @private
     * @type {Boolean}
     */
    this.collapsed_ = options.collapsed;
    if (this.collapsed_ === undefined) this.collapsed_ = true;

    /**
     * Option to allow the plugin to be collapsible or not
     * @private
     * @type {Boolean}
     */
    this.collapsible_ = options.collapsible;
    if (this.collapsible_ === undefined) this.collapsible_ = true;

    this.configuration_ = options.configuration || {};

    this.filters_ = options.filters;
    if (this.filters_ === undefined) this.filters_ = true;

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
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelQueryAttributes', {
      className: 'm-queryattributes',
      collapsed: this.collapsed_,
      collapsible: this.collapsible_,
      position: M.ui.position[this.position_],
      collapsedButtonClass: 'icon-tabla',
      tooltip: getValue('tooltip'),
    });

    this.control_ = new QueryAttributesControl(this.configuration_, this.filters_, this.collapsed_, this.position_);
    this.controls_.push(this.control_);
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
    this.control_.initPanelAttributes();

    // e2m: Lo meto en el control
    // if (this.collapsed_) {
    //   this.addOpenEvent();
    // } else {
    //   this.addCloseEvent();
    //    const container = this.map_.getContainer().parentElement.parentElement;
    //    container.style.width = 'calc(100% - 530px)';
    //    container.style.position = 'fixed';
    //    if (this.position_ === 'TL') {
    //      container.style.left = '530px';
    //    } else {
    //      container.style.right = '530px';
    //    }
    //    this.map_.refresh();
    // }
  }

  // e2m: Lo meto en el control
  /* eslint max-len: ["error", { "code": 150 }] */
  // addOpenEvent()  {
  //   const elem = document.querySelector('.m-panel.m-queryattributes.collapsed .m-panel-btn.icon-tabla');
  //   console.log("openPanel");
  //   if (elem !== null) {
  //     console.log("openPanel evtClick");
  //     elem.addEventListener('click', () => {
  //       const container = this.map_.getContainer().parentElement.parentElement;
  //       container.style.width = 'calc(100% - 530px)';
  //       container.style.position = 'fixed';
  //       if (this.position_ === 'TL') {
  //         container.style.left = '530px';
  //       } else {
  //         container.style.right = '530px';
  //       }
  //       this.map_.refresh();
  //       this.addCloseEvent();
  //     });
  //   }
  // }

  // e2m: Lo meto en el control
  // addCloseEvent() {
  //   const elem = document.querySelector('.m-panel.m-queryattributes.opened .m-panel-btn');
  //   console.log("closePanel");
  //   if (elem !== null) {
  //     console.log("closePanel evtClick");
  //     elem.addEventListener('click', () => {
  //       const container = this.map_.getContainer().parentElement.parentElement;
  //       container.style.width = '100%';
  //       container.style.position = '';
  //       if (this.position_ === 'TL') {
  //         container.style.left = 'unset';
  //       } else {
  //         container.style.right = 'unset';
  //       }
  //       this.map_.refresh();
  //       this.addOpenEvent();
  //     });
  //   }
  // }

  /**
   * Destroys plugin
   * @public
   * @function
   * @api
   */
  destroy() {
    this.map_.removeControls(this.controls_);
    [this.map_, this.control_, this.controls_, this.panel_] = [null, null, null, null];
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
   * @getter
   * @public
   */
  get name() {
    return 'queryattributes';
  }
}
