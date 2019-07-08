/**
 * @module M/control/BackgroundLayersSelector
 */

import template from 'templates/main';

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
 * Background layers selector Mapea control.
 * This control puts a set of layers in the background of the map.
 */
export default class BackgroundLayersSelector extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(layers) {
    const impl = new M.impl.Control();
    super(impl, 'BaseLayerSelector');

    this.layers = layers.slice(0, MAXIMUM_LAYERS);
    this.flattedLayers = this.layers.reduce((current, next) => current.concat(next.layers), []);
    this.activeLayer = -1;
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map - map to add the control
   * @api
   */
  createView(map) {
    this.map = map;
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, { vars: { layers: this.layers } });
      this.html = html;
      this.listen(html);
      html.querySelector('button').click();
      this.uniqueButton = this.html.querySelector('#m-baselayerselector-unique-btn');
      this.uniqueButton.innerText = this.layers[0].title;
      success(html);
    });
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control - control to compare
   * @api
   */
  equals(control) {
    return control instanceof BackgroundLayersSelector;
  }

  /**
   * This function adds layer bound to the button clicked
   * @public
   * @param {DOMEvent} e - click html event
   * @param {object} layersInfo - Layers options
   * @api
   */
  showBaseLayer(e, layersInfo, i) {
    let callback = this.handlerClickDesktop.bind(this);
    if (window.innerWidth <= M.config.MOBILE_WIDTH) {
      callback = this.handlerClickMobile.bind(this);
    }
    callback(e, layersInfo, i);
  }

  /**
   * This function manages the click event when the app is in desktop resolution
   *
   * @function
   */
  handlerClickDesktop(e, layersInfo, i) {
    this.removeLayers();
    const { layers, title } = layersInfo;
    const isActived = e.target.parentElement
      .querySelector(`#m-baselayerselector-${layersInfo.id}`)
      .classList.contains('activeBaseLayerButton');

    layers.forEach((layer, index, array) => layer.setZIndex(index - array.length));

    e.target.parentElement.querySelectorAll('button[id^="m-baselayerselector-"]').forEach((button) => {
      if (button.classList.contains('activeBaseLayerButton')) {
        button.classList.remove('activeBaseLayerButton');
      }
    });
    if (!isActived) {
      this.activeLayer = i;
      e.target.parentElement.querySelector('#m-baselayerselector-unique-btn').innerText = title;
      e.target.parentElement
        .querySelector(`#m-baselayerselector-${layersInfo.id}`).classList.add('activeBaseLayerButton');
      this.map.addLayers(layers);
    }
  }

  /**
   * This function manages the click event when the app is in mobile resolution
   * @function
   */
  handlerClickMobile(e) {
    this.removeLayers();
    this.activeLayer += 1;
    this.activeLayer = this.activeLayer % this.layers.length;
    const layersInfo = this.layers[this.activeLayer];
    const { layers, id, title } = layersInfo;

    layers.forEach((layer, index, array) => layer.setZIndex(index - array.length));

    e.target.parentElement.querySelectorAll('button[id^="m-baselayerselector-"]').forEach((button) => {
      if (button.classList.contains('activeBaseLayerButton')) {
        button.classList.remove('activeBaseLayerButton');
      }
    });
    e.target.innerText = title;
    e.target.parentElement
      .querySelector(`#m-baselayerselector-${id}`).classList.add('activeBaseLayerButton');
    this.map.addLayers(layers);
  }

  /**
   * This function removes this.layers from Map.
   * @function
   * @public
   * @api
   */
  removeLayers() {
    this.map.removeLayers(this.flattedLayers);
  }

  /**
   * This function add the events listener to each button of the html
   * @param {HTMLElement} html
   * @function
   * @public
   * @api
   */
  listen(html) {
    html.querySelectorAll('button.m-background-group-btn')
      .forEach((b, i) => b.addEventListener('click', e => this.showBaseLayer(e, this.layers[i], i)));
    html.querySelector('#m-baselayerselector-unique-btn').addEventListener('click', e => this.showBaseLayer(e));
  }
}
