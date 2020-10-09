/**
 * @module M/control/InformationControl
 */

import InformationImplControl from '../../impl/ol/js/informationcontrol';
import template from '../../templates/information';
import { getValue } from './i18n/language';

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
  constructor(format, featureCount, buffer, tooltip) {
    if (M.utils.isUndefined(InformationImplControl)) {
      M.exception('');
    }
    const impl = new InformationImplControl(format, featureCount, buffer);
    super(impl, 'Information');
    this.tooltip = tooltip;
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
            tooltip: this.tooltip || getValue('tooltip'),
          },
        },
      });
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
    this.invokeEscKey();
    this.getImpl().activate();
    document.addEventListener('keydown', this.checkEscKey.bind(this));
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
    document.removeEventListener('keydown', this.checkEscKey.bind(this));
  }

  checkEscKey(evt) {
    const contains = document.querySelector('.m-control.m-container.m-information-container').classList.contains('activated');
    if (evt.key === 'Escape' && contains) {
      document.removeEventListener('keydown', this.checkEscKey.bind(this));
      document.querySelector('#m-information-btn').click();
    }
  }

  invokeEscKey() {
    try {
      const keyboardEvent = document.createEvent('KeyboardEvent');
      const initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';
      keyboardEvent[initMethod]('keydown', true, true, window, false, false, false, false, 27, 0);
      document.dispatchEvent(keyboardEvent);
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err);
    }
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
