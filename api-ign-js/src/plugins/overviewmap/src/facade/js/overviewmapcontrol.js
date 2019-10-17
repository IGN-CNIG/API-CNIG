/**
 * @module M/control/OverviewMapControl
 */

import OverviewMapImplControl from 'impl/overviewmapcontrol';
import template from 'templates/overviewmap';

export default class OverviewMapControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(options = {}, vendorOptions = {}) {
    if (M.utils.isUndefined(OverviewMapImplControl)) {
      M.exception('La implementación usada no puede crear controles OverviewMapControl');
    }
    const impl = new OverviewMapImplControl(options, vendorOptions);
    super(impl, 'OverviewMap');

    impl.facadeControl = this;
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
   * @api stable
   */
  equals(control) {
    return control instanceof OverviewMapControl;
  }
}
