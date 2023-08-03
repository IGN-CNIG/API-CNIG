/**
 * @module M/control/PrintViewManagementControl
 */

import template from '../../templates/printviewmanagement';
import PrintViewManagementImpl from '../../impl/ol/js/printviewmanagement';
import { getValue } from './i18n/language';
import ViewHistoryControl from './viewhistorycontrol';
import PredefinedZoomControl from './predefinedzoomcontrol';
import ZoomExtentControl from './zoomextentcontrol';

export default class PrintViewManagementControl extends M.Control {
  /**
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(isDraggable, predefinedzoom, zoomextent, viewhistory, zoompanel, order) {
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

    this.predefinedzoom_ = predefinedzoom;

    /**
     * Indicates if the control ZoomExtent is added to the plugin
     * @private
     * @type {Boolean}
     */
    this.zoomextent_ = zoomextent;

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
          predefinedzoom: this.predefinedzoom_,
          zoomextent: this.zoomextent_,
          viewhistory: this.viewhistory_,
          translations: {
            headertitle: getValue('tooltip'),
            predefinedzoom: getValue('service_epsg'),
            zoomextent: getValue('georeferenced_img'),
            viewhistory: getValue('map_printing'),
          },
        },
      });
      this.html = html;
      if (this.predefinedzoom_) {
        this.predefinedzoomControl = new PredefinedZoomControl(map, this.predefinedzoom_);
        if ('isDefault' in this.predefinedzoom_) {
          this.predefinedzoom_[0].center = this.getImpl().transformCenter(this.predefinedzoom_[0].center, 'EPSG:3857');
        }
        html.querySelector('#m-printviewmanagement-predefinedzoom').addEventListener('click', () => {
          this.deactive(html, 'predefinedzoom');
          this.predefinedzoomControl.active(html);
        });
        html.querySelector('#m-printviewmanagement-predefinedzoom').addEventListener('keydown', ({ key }) => {
          if (key === 'Enter') {
            this.deactive(html, 'predefinedzoom');
            this.predefinedzoomControl.active(html);
          }
        });
      }
      if (this.zoomextent_) {
        this.zoomextentControl = new ZoomExtentControl(map);
        html.querySelector('#m-printviewmanagement-zoomextent').addEventListener('click', () => {
          this.deactive(html, 'zoomextent');
          this.zoomextentControl.active(html);
        });
        html.querySelector('#m-printviewmanagement-zoomextent').addEventListener('keydown', ({ key }) => {
          if (key === 'Enter') {
            this.deactive(html, 'zoomextent');
            this.zoomextentControl.active(html);
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
    const active = html.querySelectorAll('#m-printviewmanagement-previews .activated')[0];
    if (active && !active.id.includes(control)) {
      if (active.id === 'm-printviewmanagement-zoomextent') {
        this.zoomextentControl.deactive();
      }
      active.classList.remove('activated');
      const container = document.querySelector('#div-contenedor-printviewmanagement');
      if (container && container.children.length > 2) {
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
    if (!M.utils.isNullOrEmpty(this.zoomextentControl)) {
      this.zoomextentControl.destroy();
    }
    if (!M.utils.isNullOrEmpty(this.viewhistoryControl)) {
      this.viewhistoryControl.destroy();
    }
  }
}
