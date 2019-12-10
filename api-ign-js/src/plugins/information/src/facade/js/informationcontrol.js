/**
 * @module M/control/InformationControl
 */

import InformationImplControl from '../../impl/ol/js/informationcontrol';
import template from '../../templates/information';

export default class InformationControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(format, featureCount, buffer) {
    if (M.utils.isUndefined(InformationImplControl)) {
      M.exception('La implementación usada no puede crear controles InformationControl');
    }
    const impl = new InformationImplControl(format, featureCount, buffer);
    super(impl, 'Information');
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
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api
   */
  activate() {
    this.getImpl().activate();
  }
  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api
   */
  deactivate() {
    this.getImpl().deactivate();
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
    return html.querySelector('#m-information-btn');
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
    return control instanceof InformationControl;
  }
}
