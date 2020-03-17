/**
 * @module M/control/CurtainControl
 */

import CurtainImplControl from 'impl/curtaincontrol';
import template from 'templates/curtain';

export default class CurtainControl extends M.Control {
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
    if (M.utils.isUndefined(CurtainImplControl)) {
      M.exception('La implementación usada no puede crear controles CurtainControl');
    }
    // 2. implementation of this control
    const impl = new CurtainImplControl();
    super(impl, 'Curtain');

    // captura de customevent lanzado desde impl con coords
    window.addEventListener('mapclicked', (e) => {
      this.map_.addLabel('Hola Mundo!', e.detail);
    });
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

    CurtainImplControl.ol_control_Swipe(options)

    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      // Añadir código dependiente del DOM
      success(html);
    });
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    // calls super to manage de/activation
    super.activate();
    const div = document.createElement('div');
    div.id = 'msgInfo';
    div.classList.add('info');
    div.innerHTML = 'Haz doble click sobre el mapa';
    this.map_.getContainer().appendChild(div);

    this.getImpl().activateClick(this.map_);
  }
  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    // calls super to manage de/activation
    super.deactivate();
    const div = document.getElementById('msgInfo');
    this.map_.getContainer().removeChild(div);

    this.getImpl().deactivateClick(this.map_);
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
    return html.querySelector('.m-curtain button');
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
    return control instanceof CurtainControl;
  }

  // Add your own functions
}
