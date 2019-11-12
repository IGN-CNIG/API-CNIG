/**
 * @module M/control/IGNHelpControl
 */

import IGNHelpImplControl from 'impl/ignhelpcontrol';
import template from 'templates/ignhelp';

export default class IGNHelpControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(helpLink, contactEmail) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(IGNHelpImplControl)) {
      M.exception('La implementación usada no puede crear controles IGNHelpControl');
    }
    // 2. implementation of this control
    const impl = new IGNHelpImplControl();
    super(impl, 'IGNHelp');

    this.helpLink = helpLink;

    this.contactEmail = contactEmail;
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
          helpLink: this.helpLink,
          contactEmail: `mailto:${this.contactEmail}`,
        },
      });
      success(html);
    });
  }
}
