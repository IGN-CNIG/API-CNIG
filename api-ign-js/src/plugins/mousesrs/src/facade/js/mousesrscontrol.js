/**
 * @module M/control/MouseSRSControl
 */

import MouseSRSImplControl from '../../impl/ol/js/mousesrscontrol';
import template from '../../templates/mousesrs';
import { getValue } from './i18n/language';

export default class MouseSRSControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(srs, label, precision, geoDD, utmDD, tooltip) {
    if (M.utils.isUndefined(MouseSRSImplControl)) {
      M.exception(getValue('exception.impl'));
    }
    const impl = new MouseSRSImplControl(srs, label, precision, geoDD, utmDD, tooltip);
    super(impl, 'MouseSRS');
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
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, {
        vars: {
          translations: {
            tooltip: getValue('tooltip'),
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
   * @api
   */
  equals(control) {
    return control instanceof MouseSRSControl;
  }

  destroy() {
    this.getImpl().destroy();
  }
}
