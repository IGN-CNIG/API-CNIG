/**
 * @module M/control/BasicControl
 */

import BasicImplControl from 'impl/basiccontrol';
import template from 'templates/basic';
import { getValue } from './i18n/language';

export default class BasicControl extends M.Control {
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
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(BasicImplControl)) {
      M.exception(getValue('exceptions.impl'));
    }
    // 2. implementation of this control
    const impl = new BasicImplControl();
    super(impl, 'Basic');
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
          translations: {
            title: getValue('title'),
            text: getValue('text'),
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
    return control instanceof BasicControl;
  }
}
