/**
 * @module M/control/ZoomPanelControl
 */

import ZoomPanelImplControl from 'impl/zoompanelcontrol';
import template from 'templates/zoompanel';
import { getValue } from './i18n/language';

export default class ZoomPanelControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(options) {
    const impl = new ZoomPanelImplControl(options.projection);
    super(impl, 'ZoomPanel');

    this.facadeMap_ = null;

    this.completed_ = false;

    this.load_ = false;
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
    this.facadeMap_ = map;
    this.addOnLoadEvents();
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, {
        vars: {
          translations: {
            zoomin: getValue('zoomin'),
            zoomout: getValue('zoomout'),
            previouszoom: getValue('previouszoom'),
            nextzoom: getValue('nextzoom'),
            rectzoom: getValue('rectzoom'),
          },
        },
      });
      const zoomInBtn = html.querySelector('button#zoomIn');
      const zoomOutBtn = html.querySelector('button#zoomOut');
      html.querySelector('button#historyprevious').addEventListener('click', this.previousStep_.bind(this));
      html.querySelector('button#historynext').addEventListener('click', this.nextStep_.bind(this));

      zoomInBtn.addEventListener('click', () => {
        this.facadeMap_.setZoom(this.facadeMap_.getZoom() + 1);
        this.registerViewEvents_();
      });

      zoomOutBtn.addEventListener('click', () => {
        this.facadeMap_.setZoom(this.facadeMap_.getZoom() - 1);
        this.registerViewEvents_();
      });

      success(html);
    });
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api
   */
  activate() {
    super.activate();
    document.getElementById('zoomExtend').style.backgroundColor = '#71A7D3';
    document.getElementById('zoomExtend').style.color = 'white';
    this.getImpl().activateClick(this.map_);
    document.addEventListener('keydown', this.checkEscKey.bind(this));
  }

  checkEscKey(evt) {
    if (evt.key === 'Escape') {
      this.deactivate();
      document.removeEventListener('keydown', this.checkEscKey);
    }
  }

  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api
   */
  deactivate() {
    super.deactivate();
    document.getElementById('zoomExtend').style.backgroundColor = 'white';
    document.getElementById('zoomExtend').style.color = '#7A7A73';
    this.getImpl().deactivateClick(this.map_);
  }

  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api
   */
  getActivationButton(html) {
    return html.querySelector('button#zoomExtend');
  }

  /**
   * Adds event listeners to control and map
   * @public
   * @function
   * @api
   */
  addOnLoadEvents() {
    this.on(M.evt.ADDED_TO_MAP, () => {
      this.load_ = true;
      if (this.completed_ && this.load_) {
        this.registerViewEvents_();
      }
    });

    this.facadeMap_.on(M.evt.COMPLETED, () => {
      this.completed_ = true;
      if (this.completed_ && this.load_) {
        this.registerViewEvents_();
      }
    });
  }

  /**
   * This function registers view events on map
   *
   * @function
   * @private
   */
  registerViewEvents_() {
    this.getImpl().registerViewEvents();
  }

  /**
   * This function shows the next zoom change to the map
   *
   * @private
   * @function
   * @param {Event} evt - Event
   */
  nextStep_(evt) {
    evt.preventDefault();
    this.getImpl().nextStep();
  }

  /**
   * This function shows the previous zoom change to the map
   *
   * @private
   * @function
   * @param {Event} evt - Event
   */
  previousStep_(evt) {
    evt.preventDefault();
    this.getImpl().previousStep();
  }

  /**
   * @public
   * @function
   * @api
   */
  activateZoom(type, btn) {
    this.activeGeometry = type;
    this.getImpl().activate(type, btn);
  }

  /**
   * @public
   * @function
   * @api
   */
  deactivateZoom(listBtn) {
    this.activeGeometry = '';
    this.getImpl().deactivate(listBtn);
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
    return control instanceof ZoomPanelControl;
  }
}
