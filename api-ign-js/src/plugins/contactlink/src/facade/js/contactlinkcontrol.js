/**
 * @module M/control/ContactLinkControl
 */

import ContactLinkImplControl from 'impl/contactlinkcontrol';
import template from 'templates/contactlink';

export default class ContactLinkControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(values) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(ContactLinkImplControl)) {
      M.exception('La implementación usada no puede crear controles ContactLinkControl');
    }
    // 2. implementation of this control
    const impl = new ContactLinkImplControl();
    super(impl, 'ContactLink');

    /**
     * Position plugin
     * @public
     * @type {String}
     */
    this.pluginOnLeft = values.pluginOnLeft;

    /**
     * Access links
     * @public
     * @public {Array}
     */
    this.links = values.links;

    /**
     * Template
     * @public
     * @type { HTMLElement }
     */
    this.template = null;
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

    if (this.pluginOnLeft) {
      document.querySelector('.m-panel.m-plugin-contactLink').querySelector('.m-panel-btn.g-contactlink-link').addEventListener('click', (evt) => {
        let buttonOpened = document.querySelector('.m-panel.m-plugin-contactLink.opened');
        if (buttonOpened !== null) {
          buttonOpened = buttonOpened.querySelector('.m-panel-btn.g-cartografia-flecha-izquierda');
        }
        if (buttonOpened && this.pluginOnLeft) {
          buttonOpened.classList.add('opened-left');
        }
      });
    }

    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, {
        vars: {
          links: this.links
        }
      });
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

  }
  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {

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
    return html.querySelector('.m-contactlink button');
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
    return control instanceof ContactLinkControl;
  }

  // Add your own functions
}
