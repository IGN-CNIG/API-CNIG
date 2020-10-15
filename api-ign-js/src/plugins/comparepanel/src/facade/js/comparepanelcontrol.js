/**
 * @module M/control/ComparepanelControl
 */

import ComparepanelImplControl from 'impl/comparepanelcontrol';
import template from 'templates/comparepanel';
import { getValue } from './i18n/language';
import Mirrorpanel from './cpmirrorpanel';
import Timeline from './cptimeline';
import LyrCompare from './cplyrcompare';
import { getValue as getValueTranslate } from './i18n/language';

export default class ComparepanelControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(options) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(ComparepanelImplControl)) {
      M.exception(getValue('exception'));
    }
    // 2. implementation of this control
    const impl = new ComparepanelImplControl();
    super(impl, 'Comparepanel');
    /**
     * Template
     * @public
     * @type { HTMLElement }
     */
    this.template = null;

    this.baseLayers = options.baseLayers;

    this.layers = [];
    this.baseLayers.forEach(e => this.layers.push(e[2]));
    options.mirrorpanelParams.defaultBaseLyrs = this.layers;
    this.mirrorpanel = new Mirrorpanel(options.mirrorpanelParams);
    options.timelineParams.intervals = this.baseLayers;
    this.timeline = new Timeline(options.timelineParams);
    options.lyrcompareParams.layers = this.layers;
    this.lyrcompare = new LyrCompare(options.lyrcompareParams);
    this.plugins = [this.mirrorpanel, this.timeline, this.lyrcompare];
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
    this.map = map;
    return new Promise((success, fail) => {
      let options = {
        jsonp: true,
        vars: {
          translations: {
            tooltipLyr: getValueTranslate('tooltipLyr'),
            tooltipMirrorpanel: getValueTranslate('tooltipMirrorpanel'),
            tooltipTimeline: getValueTranslate('tooltipTimeline'),
          }
        }
      }
      this.template = M.template.compileSync(template, options);
      this.addComparators(map);
      success(this.template);
    });
  }

  addComparators(map) {
    this.plugins.forEach((p) => {
      map.addPlugin(p);
      let element = document.querySelector("." + p.panel_._className + " .m-panel-controls");
      element.classList.add('cp-' + p.name);
      document.querySelector("." + p.panel_._className).remove();
      this.template.querySelector('#m-cp-' + p.name).append(element);
    });
    this.addButtonEvents();
  }

  addButtonEvents() {
    this.plugins.forEach(p => {
      this.template.querySelector('#m-cp-' + p.name + ' .cp-button').addEventListener('click', (e) => {
        this.deactivateAndActivate(p);
      });
    });
  }

  deactivateAndActivate(plugin) {
    this.plugins.forEach(p => {
      if (p != plugin) {
        this.template.querySelector('#m-cp-' + p.name + ' .cp-' + p.name).classList.remove('hide-panel');
        this.template.querySelector('#m-cp-' + p.name + ' .cp-button').classList.remove('active');
      }
      p.deactivate();
    });
    this.template.querySelector('#m-cp-' + plugin.name + ' .cp-button').classList.toggle('active');
    this.template.querySelector('#m-cp-' + plugin.name + ' .cp-' + plugin.name).classList.toggle('hide-panel');
  }

  deactivate(){
    this.plugins.forEach(p => {
      p.deactivate();
    });
  }
  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   * @return {Boolean}
   */
  equals(control) {
    return control instanceof ComparepanelControl;
  }
}
