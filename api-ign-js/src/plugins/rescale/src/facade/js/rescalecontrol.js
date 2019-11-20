/**
 * @module M/control/RescaleControl
 */

import RescaleImplControl from 'impl/rescalecontrol';
import template from 'templates/rescale';

// let typingTimer;

export default class RescaleControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    if (M.utils.isUndefined(RescaleImplControl)) {
      M.exception('La implementación usada no puede crear controles RescaleControl');
    }
    const impl = new RescaleImplControl();
    super(impl, 'Rescale');
    this.impl_ = impl;
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    this.map_ = map;
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      html.querySelector('#m-rescale-scaleinput').addEventListener('keyup', e => this.zoomToInputScale(e));
      success(html);
    });
  }

  /**
   * Zooms to written scale (aproximately).
   * @public
   * @function
   * @param {Event} e
   * @api
   */
  zoomToInputScale(e) {
    if (e.keyCode === 13) {
      const writtenScale = e.target.value.trim().replace(/ /g, '').replace(/\./g, '').replace(/,/g, '');
      const scaleRegExp = /^1:[1-9]\d*$/;
      const simpleScaleRegExp = /^[1-9]\d*$/;
      if (scaleRegExp.test(writtenScale)) {
        this.impl_.zoomToScale(parseInt(writtenScale.substring(2), 10));
      } else if (simpleScaleRegExp.test(writtenScale)) {
        this.impl_.zoomToScale(parseInt(writtenScale, 10));
      }
    }
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    super.activate();
    this.getImpl().activateClick(this.map_);
  }

  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    super.deactivate();
    this.getImpl().deactivateClick(this.map_);
  }


  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api stable
   */
  getActivationButton(html) {
    return html.querySelector('.m-rescale button');
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof RescaleControl;
  }
}
