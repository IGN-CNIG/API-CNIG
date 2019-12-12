/**
 * @module M/control/BeautyTOCControl
 */

import BeautyTOCImplControl from '../../impl/ol/js/beautytoccontrol';
import template from '../../templates/beautytoc';

/**
 * @private
 * @function
 */
const listenAll = (html, selector, type, callback) => {
  const nodeList = html.querySelectorAll(selector);
  Array.prototype.forEach.call(nodeList, node => node.addEventListener(type, evt => callback(evt)));
};

export default class BeautyTOCControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor() {
    const impl = new BeautyTOCImplControl();
    super(impl, 'BeautyTOC');
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
    this.map_ = map;
    return new Promise((success, fail) => {
      const templateVars = this.getTemplateVariables();
      const html = M.template.compileSync(template, {
        vars: templateVars,
      });
      this.panel_ = html;
      success(html);
      listenAll(this.panel_, 'li', 'click', e => this.toogleVisible(e));
    });
  }

  /**
   * @function
   * @public
   * @api
   */
  getTemplateVariables() {
    const layers = this.map_.getWMS().concat(this.map_.getWMTS())
      .filter(layer => layer.transparent !== false && layer.displayInLayerSwitcher === true);
    const layersOpts = layers.map((layer) => {
      return {
        disabled: this.getLayerDisabled(layer),
        visible: (layer instanceof M.layer.WMTS ? layer.options.visibility === true :
          layer.isVisible()),
        id: layer.name,
        title: layer.legend || layer.name,
        type: layer.type,
        url: layer.url,
        isOrtofoto: layer.url === 'https://www.ign.es/wms/pnoa-historico?',
      };
    });
    return { layers: layersOpts };
  }

  getLayerDisabled(layer) {
    let res = false;
    if (this.getImpl().isLayerLoaded(layer)) {
      res = res || !layer.inRange() || !this.getImpl().isLayerAvailable(layer);
    }

    return res;
  }

  /**
   * @function
   * @public
   * @api
   */
  render() {
    const templateVars = this.getTemplateVariables();
    const html = M.template.compileSync(template, {
      vars: templateVars,
    });
    this.panel_.innerHTML = html.innerHTML;
    listenAll(this.panel_, 'li', 'click', e => this.toogleVisible(e));
  }

  /**
   * @function
   * @public
   * @api
   */
  toogleVisible(evt) {
    const layerName = evt.currentTarget.querySelector('.m-beautytoc-eye span').dataset.layerName;
    const layerFound = this.map_.getLayers({ name: layerName })[0];
    const visibility = layerFound instanceof M.layer.WMTS ? layerFound.options.visibility :
      layerFound.isVisible();
    layerFound.setVisible(!visibility);
    layerFound.options.visibility = !visibility;
    this.render();
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api
   */
  activate() {
    super.activate();
  }
  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api
   */
  deactivate() {
    super.deactivate();
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
    return html.querySelector('.m-beautytoc button');
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
    return control instanceof BeautyTOCControl;
  }
}
