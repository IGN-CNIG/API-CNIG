/**
 * @module M/control/PerfiltopograficoControl
 */

import PerfiltopograficoImplControl from 'impl/perfiltopograficocontrol';
import template from 'templates/perfiltopografico';
import { getValue } from './i18n/language';

export default class PerfiltopograficoControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(opts) {

    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(PerfiltopograficoImplControl)) {
      M.exception('La implementación usada no puede crear controles PerfiltopograficoControl');
    }
    // 2. implementation of this control
    const impl = new PerfiltopograficoImplControl(opts);
    super(impl, 'Perfiltopografico');

    [this.btnData_, this.btnRemove_, this.facadeMap_, this.html_, this.drawCtrl_, this.opts] = [null, null, null, null, null, impl, opts];
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
    if (!M.template.compileSync) { // JGL: retrocompatibilidad Mapea4
      M.template.compileSync = (string, options) => {
        let templateCompiled;
        let templateVars = {};
        let parseToHtml;
        if (!M.utils.isUndefined(options)) {
          templateVars = M.utils.extends(templateVars, options.vars);
          parseToHtml = options.parseToHtml;
        }
        const templateFn = Handlebars.compile(string);
        const htmlText = templateFn(templateVars);
        if (parseToHtml !== false) {
          templateCompiled = M.utils.stringToHtml(htmlText);
        } else {
          templateCompiled = htmlText;
        }
        return templateCompiled;
      };
    }
    this.facadeMap_ = map;
    document.querySelector("div.m-panel.m-perfilestopograficos>button.m-panel-btn").title = getValue('title');

    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      // Añadir código dependiente del DOM
      this.template_ = html;
      success(html);
    });
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
    return document.querySelector("div.m-panel.m-perfilestopograficos>button.m-panel-btn");
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
    return control instanceof PerfiltopograficoControl;
  }
}
