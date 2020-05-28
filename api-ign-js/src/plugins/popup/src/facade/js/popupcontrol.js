/**
 * @module M/control/PopupControl
 */

import PopupImplControl from 'impl/popupcontrol';
import template from 'templates/popup';
import { getValue } from './i18n/language';


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
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, {
        vars: {
          url: this.url_,
          translations: {
            ayuda: getValue('ayuda'),
            consulta: getValue('consulta'),
            aqui: getValue('aqui'),
            contacto: getValue('contacto'),
            localizacion: getValue('localizacion'),
            telefono: getValue('telefono'),
          },
        },
      });
      success(html);
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
