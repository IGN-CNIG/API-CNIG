/**
 * @module M/control/PrintViewManagementControl
 */

import template from '../../templates/printviewmanagement';
import PrintViewManagementImpl from '../../impl/ol/js/printviewmanagement';
import { getValue } from './i18n/language';
import ViewHistoryControl from './viewhistorycontrol';
import GeorefImageEpsgControl from './georefimageepsgcontrol';
import GeorefimageControl from './georefimagecontrol';

export default class PrintViewManagementControl extends M.Control {
  /**
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(isDraggable, georefImageEpsg, georefImage, viewhistory, zoompanel, order, map) {
    if (M.utils.isUndefined(PrintViewManagementImpl)) {
      M.exception(getValue('exception.impl'));
    }

    const impl = new PrintViewManagementImpl();
    super(impl, 'PrintViewManagement');
    /**
     * Indicates if the control PredefinedZoom is added to the plugin
     * @private
     * @type {Boolean|Array<Object>}
     */

    this.georefImageEpsg_ = georefImageEpsg;

    /**
     * Indicates if the control georefImage is added to the plugin
     * @private
     * @type {Boolean}
     */
    this.georefImage_ = georefImage;

    /**
     * Indicates if the control ViewHistory is added to the plugin
     * @private
     * @type {Boolean}
     */
    this.viewhistory_ = viewhistory;

    /**
     * Indicates if the control ZoomPanel is added to the plugin
     * @private
     * @type {Boolean}
     */
    this.zoompanel_ = zoompanel;

    /**
     * Option to allow the plugin to be draggable or not
     * @private
     * @type {Boolean}
     */
    this.isDraggable_ = isDraggable;

    /**
     * Order of plugin
     * @public
     * @type {Number}
     */
    this.order = order;

    /**
      @private *
      @type { string }
      * @type { string }
      */
    this.tooltipGeorefImageEpsg_ = georefImageEpsg.tooltip || getValue('tooltip_georefimageepsg');

    this.map_ = map;

    this.active_ = null;
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
          georefImageEpsg: this.georefImageEpsg_,
          georefImage: this.georefImage_,
          viewhistory: this.viewhistory_,
          translations: {
            headertitle: getValue('tooltip'),
            tooltipGeorefImageEpsg: this.tooltipGeorefImageEpsg_,
            georefImage: getValue('georeferenced_img'),
            viewhistory: getValue('map_printing'),
          },
        },
      });
      this.html = html;
      if (this.georefImageEpsg_) {
        this.addGeorefImageEpsgControl(html);
      }
      if (this.georefImage_) {
        this.georefImageControl = new GeorefimageControl(map);
        html.querySelector('#m-printviewmanagement-georefImage').addEventListener('click', () => {
          this.deactive(html, 'georefImage');
          this.georefImageControl.active(html);
        });
        html.querySelector('#m-printviewmanagement-georefImage').addEventListener('keydown', ({ key }) => {
          if (key === 'Enter') {
            this.deactive(html, 'georefImage');
            this.georefImageControl.active(html);
          }
        });
      }
      if (this.viewhistory_) {
        this.viewhistoryControl = new ViewHistoryControl(map);
        html.querySelector('#m-printviewmanagement-viewhistory').addEventListener('click', () => {
          this.deactive(html, 'viewhistory');
          this.viewhistoryControl.active(html);
        });
        html.querySelector('#m-printviewmanagement-viewhistory').addEventListener('keydown', ({ key }) => {
          if (key === 'Enter') {
            this.deactive(html, 'viewhistory');
            this.viewhistoryControl.active(html);
          }
        });
      }
      if (this.isDraggable_) {
        M.utils.draggabillyPlugin(this.getPanel(), '#m-printviewmanagement-title');
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
    return control instanceof PrintViewManagementImpl;
  }

  addGeorefImageEpsgControl(html) {
    this.georefImageEpsgControl = new GeorefImageEpsgControl(this.georefImageEpsg_, this.map_);
    html.querySelector('#m-printviewmanagement-georefImageEpsg').addEventListener('click', () => {
      this.deactive(html, 'georefImageEpsg');
      this.georefImageEpsgControl.active(html);
    });
    html.querySelector('#m-printviewmanagement-georefImageEpsg').addEventListener('keydown', ({ key }) => {
      if (key === 'Enter') {
        this.deactive(html, 'georefImageEpsg');
        this.georefImageEpsgControl.active(html);
      }
    });
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
    if (html.querySelectorAll('#m-printviewmanagement-previews .activated').length === 0) {
      return;
    }
    const active = html.querySelectorAll('#m-printviewmanagement-previews .activated')[0];
    if (active && active.id !== `m-printviewmanagement-${control}`) {
      console.log('active', active.id);
      this.active_ = active;
      if (active.id === 'm-printviewmanagement-georefImage') {
        this.georefImageControl.deactive();
      }

      if (active.id === 'm-printviewmanagement-georefImageEpsg') {
        this.georefImageEpsgControl.deactive();
      }

      active.classList.remove('activated');
      // const container = document.querySelector('#div-contenedor-printviewmanagement');
      // if (container && container.children.length > 2) {
      //   container.removeChild(container.children[2]);
      // }
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
    if (!M.utils.isNullOrEmpty(this.georefImageControl)) {
      this.georefImageControl.destroy();
    }
    if (!M.utils.isNullOrEmpty(this.viewhistoryControl)) {
      this.viewhistoryControl.destroy();
    }
  }
}
