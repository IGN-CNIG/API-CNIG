/**
 * @module M/control/Help
 */
import HelpImplControl from '../../impl/ol/js/helpcontrol';
import template from '../../templates/help';
import { getValue } from './i18n/language';

export default class HelpControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(map) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(HelpImplControl)) {
      M.exception(getValue('exception'));
    }

    // 2. implementation of this control
    const impl = new HelpImplControl();
    super(impl, 'Help');

    this.map_ = map;

    /**
     * Template
     * @public
     * @type { HTMLElement }
     */
    this.template = null;

    this.closeEventActive_ = false;
  }

  /**
   * This functions active control
   *
   * @public
   * @function
   * @param {Node} html
   * @api
   */
  active(html) {
    this.template = M.template.compileSync(template, {
      vars: {
        translations: {
          title: getValue('help_template.title'),
          addlayer_title: getValue('help_template.addlayer_title'),
          addlayer_content: getValue('help_template.addlayer_content'),
          selection_title: getValue('help_template.selection_title'),
          selection_content: getValue('help_template.selection_content'),
          creation_title: getValue('help_template.creation_title'),
          creation_content: getValue('help_template.creation_content'),
          edition_title: getValue('help_template.edition_title'),
          edition_content: getValue('help_template.edition_content'),
          style_title: getValue('help_template.style_title'),
          style_content: getValue('help_template.style_content'),
          analysis_title: getValue('help_template.analysis_title'),
          analysis_content: getValue('help_template.analysis_content'),
          download_title: getValue('help_template.download_title'),
          download_content: getValue('help_template.download_content'),
        },
      },
    });
    this.template.querySelector('#help-title').innerHTML = getValue('help_template.title');
    this.template.querySelector('#addlayer-title').innerHTML = getValue('help_template.addlayer_title');
    this.template.querySelector('#addlayer-content').innerHTML = getValue('help_template.addlayer_content');
    this.template.querySelector('#selection-title').innerHTML = getValue('help_template.selection_title');
    this.template.querySelector('#selection-content').innerHTML = getValue('help_template.selection_content');
    this.template.querySelector('#creation-title').innerHTML = getValue('help_template.creation_title');
    this.template.querySelector('#creation-content').innerHTML = getValue('help_template.creation_content');
    this.template.querySelector('#edition-title').innerHTML = getValue('help_template.edition_title');
    this.template.querySelector('#edition-content').innerHTML = getValue('help_template.edition_content');
    this.template.querySelector('#style-title').innerHTML = getValue('help_template.style_title');
    this.template.querySelector('#style-content').innerHTML = getValue('help_template.style_content');
    this.template.querySelector('#analysis-title').innerHTML = getValue('help_template.analysis_title');
    this.template.querySelector('#analysis-content').innerHTML = getValue('help_template.analysis_content');
    this.template.querySelector('#download-title').innerHTML = getValue('help_template.download_title');
    this.template.querySelector('#download-content').innerHTML = getValue('help_template.download_content');
    if (!this.closeEventActive_) {
      document.addEventListener('keydown', this.closeEvent.bind(this));
      this.closeEventActive_ = true;
    }
    this.template.querySelector('.m-panel-btn').addEventListener('click', this.deactivate.bind(this));
    html.querySelector('#m-vectorsmanagement-controls').appendChild(this.template);

    // document.body.appendChild(this.template);
  }


  /**
   * This function destroys this control
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    super.activate();
  }

  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.template.remove();
    const elem = document.querySelector('#m-vectorsmanagement-help');
    if (elem) {
      elem.classList.remove('activated');
    }
  }

  /**
   * Keydown event for close modal
   *
   * @public
   * @function
   * @api stable
   */
  closeEvent(evt) {
    if (evt.key === 'Escape') {
      const elem = document.querySelector('.m-control.m-container.m-modal');
      if (elem !== null) {
        this.deactivate();
      }
    }
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
    // eslint-disable-next-line no-undef
    return control instanceof HelpControl;
  }
}
