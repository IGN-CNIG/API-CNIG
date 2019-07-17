/**
 * @module M/control/MouseSRSControl
 */

import MouseSRSImplControl from 'impl/mousesrscontrol';
import template from 'templates/mousesrs';

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
  constructor(srs, label, precision) {
    if (M.utils.isUndefined(MouseSRSImplControl)) {
      M.exception('La implementación usada no puede crear controles MouseSRSControl');
    }
    const impl = new MouseSRSImplControl(srs, label, precision);
    super(impl, 'MouseSRS');

    /**
     * Coordinates spatial reference system
     *
     * @type { ProjectionLike } https://openlayers.org/en/latest/apidoc/module-ol_proj.html#~ProjectionLike
     * @private
     */
    this.srs_ = srs;

    /**
     * Label to show
     *
     * @type {string}
     * @private
     */
    this.label_ = label;
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
      const html = M.template.compileSync(template);
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
}
