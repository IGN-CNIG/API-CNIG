/**
 * @module M/control/BaseLayerSelectorControl
 */

import template from 'templates/baselayerselector';

/**
 * This parameter indicates the maximum base layers of plugin
 *
 * @type {number}
 * @const
 * @private
 */
const MAXIMUM_LAYERS = 5;

/**
 * @classdesc
 * Base layer selector Mapea control.
 * This control selects the base layer of the map.
 */
export default class BaseLayerSelectorControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(layers) {
    const impl = new M.impl.Control();
    super(impl, 'BaseLayerSelector');

    this.layers = layers.slice(0, MAXIMUM_LAYERS);
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
    this.map = map;
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, { vars: { layers: this.layers } });
      this.layers.forEach((layerInfo) => {
        html.querySelector(`#m-baselayerselector-${layerInfo.id}`).addEventListener('click', () => {
          this.showBaseLayer(layerInfo, html);
        });
      });
      html.querySelector('button').click();
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
    return html.querySelector('.m-baselayerselector button');
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
    return control instanceof BaseLayerSelectorControl;
  }

  /**
   * This function removes the base layers of the map
   *
   * @public
   * @function
   * @api
   */
  removeBaseLayers() {
    this.map.removeLayers(this.map.getBaseLayers());
  }

  /**
   * This function adds layer bound to the button clicked
   *
   * @public
   * @param {*} layer bound to the button clicked
   * @api
   */
  showBaseLayer(layerInfo, html) {
    this.removeBaseLayers();
    const layer = layerInfo.layer;
    layer.transparent = false;
    this.map.addLayers(layer);
    html.querySelectorAll('button[id^="m-baselayerselector-"]').forEach((button) => {
      if (button.classList.contains('activeBaseLayerButton')) {
        button.classList.remove('activeBaseLayerButton');
      }
    });
    html.querySelector(`#m-baselayerselector-${layerInfo.id}`).classList.add('activeBaseLayerButton');
  }
}
