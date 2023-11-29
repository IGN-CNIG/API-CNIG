/**
 * @module M/control/LocatorControl
 */

import template from '../../templates/locator';
import LocatorImpl from '../../impl/ol/js/locator';
import { getValue } from './i18n/language';
import IGNSearchLocatorControl from './ignsearchlocatorcontrol';

export default class LocatorControl extends M.Control {
  /**
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(
    isDraggable, zoom, pointStyle, searchOptions,
    order, useProxy, statusProxy, position,
  ) {
    if (M.utils.isUndefined(LocatorImpl)) {
      M.exception(getValue('exception.impl'));
    }

    const impl = new LocatorImpl();
    super(impl, 'Locator');

    /**
     * Indicates if the control ignsearchlocator is added to the plugin
     * @private
     * @type {Boolean|Object}
     */
    this.searchOptions_ = searchOptions;

    /**
     * Option to allow the plugin to be draggable or not
     * @private
     * @type {Boolean}
     */
    this.isDraggable_ = isDraggable;

    /**
     * Zoom
     * @private
     * @type {Number}
     */
    this.zoom_ = zoom;

    /**
     * Type of icon to display when a punctual type result is found
     * @private
     * @type {string}
     */
    this.pointStyle_ = pointStyle;

    /**
     * Order of plugin
     * @public
     * @type {Number}
     */
    this.order = order;

    /**
     * Indicates if you want to use proxy in requests
     * @private
     * @type {Number}
     */
    this.useProxy = useProxy;

    /**
     * Stores the proxy state at plugin load time
     * @private
     * @type {Boolean}
     */
    this.statusProxy = statusProxy;

    /**
     * Position of the plugin
     *
     * @private
     * @type {String} TL | TR | BL | BR | TC
     */
    this.position = position || 'TR';

    /**
     * Control activated
     * @public
     * @type {Control}
     */
    this.control = null;
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api
   */
  createView(map) {
    this.map_ = map;
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, {
        vars: {
          showTitle: this.position !== 'TC',
          byParcelCadastre: this.byParcelCadastre_,
          byPlaceAddressPostal: this.searchOptions_,
          translations: {
            headertitle: getValue('tooltip'),
            ignsearch: getValue('ignsearch'),
          },
        },
      });
      this.html = html;
      if (this.searchOptions_) {
        // ignsearchlocator
        this.ignsearchControl = new IGNSearchLocatorControl(
          this.map_,
          this.zoom_,
          this.pointStyle_,
          this.searchOptions_,
          this.useProxy,
          this.statusProxy,
          this.position,
        );
        this.on(M.evt.ADDED_TO_MAP, () => {
          this.ignsearchControl.initializateAddress(html);
          this.control = this.ignsearchControl;
          this.deactive(html, 'ignsearch');
          this.ignsearchControl.active(html);
          this.control = this.ignsearchControl;
        });
        this.ignsearchControl.on('ignsearchlocator:entityFound', (extent) => {
          this.fire('ignsearchlocator:entityFound', [extent]);
        });
      }
      if (this.isDraggable_) {
        M.utils.draggabillyPlugin(this.getPanel(), '#m-locator-title');
      }
      this.accessibilityTab(html);
      success(html);
    });
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api
   */
  equals(control) {
    return control instanceof LocatorControl;
  }

  /**
   * This function deactivates the activated control
   * before activating another
   *
   * @public
   * @function
   * @param {Node} html
   * @param {String} control
   * @api
   */
  deactive(html, control) {
    const active = html.querySelectorAll('#m-locator-previews .activated')[0];
    if (this.position === 'TC') {
      document.querySelector('.m-plugin-locator').classList.remove('m-plugin-locator-tc-withpanel');
      document.querySelector('.m-plugin-locator').classList.add('m-plugin-locator-tc');
    }
    if (active && !active.id.includes(control)) {
      this.control.clearResults();
      active.classList.remove('activated');
      const container = document.querySelector('#div-contenedor-locator');
      if (this.position === 'TC' && container && container.children.length > 1) {
        container.removeChild(container.children[1]);
      } else if (container && container.children.length > 2) {
        container.removeChild(container.children[2]);
      }
    }
  }

  /**
   * This function changes number of tabindex
   *
   * @public
   * @function
   * @param {Node} html
   * @api
   */
  accessibilityTab(html) {
    html.querySelectorAll('[tabindex="0"]').forEach(el => el.setAttribute('tabindex', this.order));
  }

  /**
   * This function destroys controls inside this control
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    if (!M.utils.isNullOrEmpty(this.ignsearchControl)) {
      this.ignsearchControl.destroy();
    }
  }
}
