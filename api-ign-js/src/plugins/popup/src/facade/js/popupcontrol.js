/**
 * @module M/control/PopupControl
 */

import PopupImplControl from 'impl/popupcontrol';
/** import template from 'templates/popup';
import { getValue } from './i18n/language'; */


export default class PopupControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(url) {
    if (M.utils.isUndefined(PopupImplControl)) {
      M.exception('La implementación usada no puede crear controles PopupControl');
    }
    const impl = new PopupImplControl();
    super(impl, 'Popup');

    /**
     * Help documentation link.
     * @private
     * @type {String}
     */
    this.url_ = url;
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
    return M.remote.get(this.url_)
      .then((v) => {
        let html = v.text;
        html = html.substring(html.indexOf('<div id="popup-box">'), html.lastIndexOf('</div>'));
        const htmlObject = document.createElement('div');
        htmlObject.classList.add('m-control', 'm-container', 'm-popup');
        htmlObject.innerHTML = html;
        console.log(htmlObject);
        return htmlObject;
      });
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
    return control instanceof PopupControl;
  }
}
