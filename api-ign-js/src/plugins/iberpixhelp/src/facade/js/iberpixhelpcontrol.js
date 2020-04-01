/**
 * @module M/control/IberpixHelpControl
 */

import IberpixHelpImplControl from 'impl/iberpixhelpcontrol';
import template from 'templates/iberpixhelp';

export default class IberpixHelpControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(helpLink) {
    if (M.utils.isUndefined(IberpixHelpImplControl)) {
      M.exception('La implementación usada no puede crear controles IberpixHelpControl');
    }
    const impl = new IberpixHelpImplControl();
    super(impl, 'IberpixHelp');

    /**
     * Help documentation link.
     * @private
     * @type {String}
     */
    this.helpLink_ = helpLink;
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
          helpLink: this.helpLink_,
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
    return control instanceof IberpixHelpControl;
  }
}
