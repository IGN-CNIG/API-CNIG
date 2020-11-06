/**
 * @module M/control/ComparepanelControl
 */

import ComparepanelImplControl from 'impl/comparepanelcontrol';
import template from 'templates/comparepanel';
import { getValue } from './i18n/language';
import Mirrorpanel from './cpmirrorpanel';
import Timeline from './cptimeline';
import LyrCompare from './cplyrcompare';
import Transparency from './cptransparency';

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
    this.position = options.position;
    this.layers = [];
    this.baseLayers.forEach(e => this.layers.push(e[2]));
    this.params = [options.mirrorpanelParams, options.timelineParams, options.lyrcompareParams, options.transparencyParams];
    this.params.forEach(p => {
      p.position = this.position;
    });

    options.mirrorpanelParams.defaultBaseLyrs = this.layers;
    options.timelineParams.intervals = this.baseLayers;         //e2m: TimeLine needs this.baseLayers with the time param
    options.lyrcompareParams.layers = this.layers;
    options.transparencyParams.layers = this.layers;

    this.mirrorpanel = new Mirrorpanel(options.mirrorpanelParams);
    this.timeline = new Timeline(options.timelineParams);
    this.lyrcompare = new LyrCompare(options.lyrcompareParams);
    this.transparency = new Transparency(options.transparencyParams);
    this.panels = [];
    this.plugins = [this.mirrorpanel, this.timeline, this.lyrcompare, this.transparency];
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
            tooltipLyr: getValue('tooltipLyr'),
            tooltipMirrorpanel: getValue('tooltipMirrorpanel'),
            tooltipTimeline: getValue('tooltipTimeline'),
            tooltipTransparency: getValue('tooltipTransparency'),
          }
        }
      };

      this.template = M.template.compileSync(template, options);
      success(this.template);
      this.addComparators(map);
    });
  }

  addComparators(map) {
    this.plugins.forEach((p) => {
      map.addPlugin(p);
      this.panels.push(p.panel_._element);
      let element = document.querySelector('.' + p.panel_._className + ' .m-panel-controls');
      element.classList.add('cp-' + p.name);
      document.querySelector('.' + p.panel_._className).remove();
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
    if (this.template.querySelector('#m-cp-' + plugin.name + ' .cp-button').classList.contains('active') && plugin.name === 'transparency') {
      plugin.activate();
    }

    this.template.querySelector('#m-cp-' + plugin.name + ' .cp-' + plugin.name).classList.toggle('hide-panel');
  }

  deactivate() {
    this.plugins.forEach((p, k) => {
      p.deactivate();
      document.querySelector('.m-plugin-comparepanel').parentElement.append(this.panels[k]);
    });

    this.map.removePlugins(this.plugins);
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
