/**
 * @module M/control/TimelineControl
 */

import TimelineImplControl from 'impl/cptimelinecontrol';
import template from 'templates/cptimeline';
import { getValue } from './i18n/language';

export default class TimelineControl extends M.Control {
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
    if (M.utils.isUndefined(TimelineImplControl)) {
      M.exception(getValue('exception'));
    }

    // 2. implementation of this control
    const impl = new TimelineImplControl();
    super(impl, 'Timeline');
    this.running = false;
    this.animation = options.animation;
    this.speed = options.speed;
    this.intervals = options.intervals;

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
    this.map = map;
    return new Promise((success, fail) => {
      let intervals = [];
      this.intervals.forEach((interval, k) => {
        const layer = this.transformToLayers(interval[2]);
        const copy = this.getMapLayer(layer);
        if (copy !== undefined) {
          this.map.removeLayers(copy);
        }

        this.map.addLayers(layer);
        let iv = {
          number: k,
          name: interval[0],
          tag: interval[1],
          service: layer
        };

        intervals.push(iv);
      });

      this.intervals = intervals;
      this.template = M.template.compileSync(template, {
        vars: {
          translations: {
            titleTimeline: getValue('titleTimeline'),
            play: getValue('play'),
          },
        },
      });

      this.intervals.forEach((interval, k) => {
        let tag = document.createElement('div');
        if (k != 0 && k != this.intervals.length - 1 && k != parseInt(this.intervals.length / 2)) {
          tag.dataset.tag = '';
        } else {
          tag.dataset.tag = interval.tag;
        }

        this.template.querySelector('.slider-tags').append(tag);
      });

      this.template.querySelector('.div-m-timeline-panel').style.setProperty('--num', this.intervals.length);
      const slider = this.template.querySelector('#input-slider');
      slider.setAttribute('max', intervals.length - 1);
      slider.addEventListener('input', (e) => this.changeSlider(slider));
      slider.addEventListener('change', (e) => {
        document.querySelector('.m-timeline-button button').classList.add('cp-control-siguiente');
        document.querySelector('.m-timeline-button button').classList.remove('cp-control-pausa');
        document.querySelector('.div-m-timeline-slider').style.setProperty('--opacity', '0');
        clearTimeout(this.running);
        this.running = false;
      });

      const play = this.template.querySelector('#m-timeline-play');
      play.addEventListener('click', (e) => this.playTimeline(false));
      success(this.template);
    });
  }

  /**
   * Transform StringLayers to Mapea M.Layer
   *
   * WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*EPSG:25830*PNOA
   * WMS*IGN*http://www.ign.es/wms-inspire/ign-base*IGNBaseTodo
   *
   * @public
   * @function
   * @api stable
   * @param {string}
   * @return
   */
  transformToLayers(layer) {
    let newLayer = null;
    if (!(layer instanceof Object)) {
      if (layer.indexOf('*') >= 0) {
        const urlLayer = layer.split('*');
        if (urlLayer[0].toUpperCase() === 'WMS') {
          newLayer = new M.layer.WMS({
            url: urlLayer[2],
            name: urlLayer[3]
          });
        } else if (urlLayer[0].toUpperCase() === 'WMTS') {
          newLayer = new M.layer.WMTS({
            url: urlLayer[2],
            name: urlLayer[3],
            legend: urlLayer[1],
            matrixSet: urlLayer[4],
            format: urlLayer[5],
          });
        }
      } else {
        const layerByName = this.map.getLayers().filter(l => layer.includes(l.name))[0];
        newLayer = this.isValidLayer(layerByName) ? layerByName : null;
      }
    } else if (layer instanceof Object) {
      const layerByObject = this.map.getLayers().filter(l => layer.name.includes(l.name))[0];
      newLayer = this.isValidLayer(layerByObject) ? layerByObject : null;
    }

    if (newLayer !== null) {
      newLayer.displayInLayerSwitcher = false;
      newLayer.setVisible(false);
      return newLayer
    } else {
      this.map.removeLayers(layer);
    }
  }

  /** This function change layers and show layer name when slider moves
   *
   * @public
   * @function
   * @api stable
   * @return
   */
  changeSlider(elem) {
    document.querySelector('.div-m-timeline-slider').style.setProperty('--opacity', '0');
    const left = (((elem.value - elem.min) / (elem.max - elem.min)) * ((256 - 5) - 5)) + 5;
    document.querySelector('.div-m-timeline-slider').style.setProperty('--left', left + 'px');
    if(this.animation || this.intervals[0].name !== ''){
      document.querySelector('.m-timeline-names').style.display = 'block';
    }

    if (this.animation) {
      document.querySelector('.m-timeline-button').style.display = 'block';
    }

    let step = parseFloat(elem.value);
    this.intervals.forEach((interval) => {
      this.getMapLayer(interval.service).setVisible(false);
      document.querySelector('.m-timeline-names').innerHTML = '';
    });

    if (step % 1 === 0) {
      document.querySelector('.div-m-timeline-slider').style.setProperty('--left', left + 20 + 'px');
      this.getMapLayer(this.intervals[step].service).setVisible(true);
      document.querySelector('.m-timeline-names').innerHTML = this.intervals[step].name;
      document.querySelector('.div-m-timeline-panel').style.setProperty('--valor', '"' + this.intervals[step].tag + '"')
      if (this.intervals[step].tag !== '') {
        document.querySelector('.div-m-timeline-slider').style.setProperty('--opacity', '1');
      } else {
        document.querySelector('.div-m-timeline-slider').style.setProperty('--opacity', '0');
      }
    } else {
      this.getMapLayer(this.intervals[parseInt(step)].service).setVisible(true);
      this.getMapLayer(this.intervals[parseInt(step) + 1].service).setVisible(true);
      if (this.intervals[parseInt(step)].tag !== '' && this.intervals[parseInt(step) + 1].tag !== '') {
        document.querySelector('.div-m-timeline-slider').style.setProperty('--left', left + 'px');
        document.querySelector('.div-m-timeline-slider').style.setProperty('--opacity', '1');
        document.querySelector('.div-m-timeline-panel').style.setProperty('--valor', '"' + this.intervals[parseInt(step)].tag + ' - ' + this.intervals[parseInt(step) + 1].tag + '"');
        document.querySelector('.m-timeline-names').innerHTML = this.intervals[parseInt(step)].name + ' y ' + this.intervals[parseInt(step) + 1].name;
      } else if (this.intervals[parseInt(step)].tag === '' && this.intervals[parseInt(step) + 1].tag === '') {
        document.querySelector('.div-m-timeline-slider').style.setProperty('--opacity', '0');
      } else {
        document.querySelector('.div-m-timeline-slider').style.setProperty('--left', left + 20 + 'px');
        document.querySelector('.div-m-timeline-slider').style.setProperty('--opacity', '10');
        document.querySelector('.m-timeline-names').innerHTML = this.intervals[parseInt(step)].name + this.intervals[parseInt(step) + 1].name;
        document.querySelector('.div-m-timeline-panel').style.setProperty('--valor', '"' + this.intervals[parseInt(step)].tag + this.intervals[parseInt(step) + 1].tag + '"');
      }
    }
  }

  /** This function search a layer in the map
   *
   * @public
   * @function
   * @api stable
   * @return
   */
  getMapLayer(layerSearch) {
    return this.map.getLayers().filter(layer => layer.getImpl().legend === layerSearch.getImpl().legend)[0];
  }

  /** This function make the play animation
   *
   * @public
   * @function
   * @api stable
   * @return
   */
  playTimeline(next) {
    const start = 0;
    const end = this.intervals.length - 1;
    const slider = document.querySelector('#input-slider');
    let step = parseInt(slider.value);
    if (this.running) {
      document.querySelector('.m-timeline-button button').classList.add('cp-control-siguiente');
      document.querySelector('.m-timeline-button button').classList.remove('cp-control-pausa');
      clearTimeout(this.running);
    }

    if (!next) {
      if (step > start && step < end && this.running) {
        this.running = false;
        return;
      }
      if (step > end) {
        step = start;
      }
    }

    if (step >= end) {
      slider.value = 0;
      this.changeSlider(slider);
      return;
    }

    if (step < start) {
      step = start;
    }

    slider.value = parseFloat(slider.value) + 1;
    this.changeSlider(slider);
    this.running = setTimeout((e) => this.playTimeline(true), this.speed * 1000);
  }

  /**
   * This function remove the timeline layers
   *
   * @public
   * @function
   * @api stable
   */
  removeTimelineLayers() {
    clearInterval(this.running);
    this.intervals.forEach((interval) => {
      this.map.removeLayers(this.getMapLayer(interval.service));
    })
  }

  /**
   * Activate plugin
   *
   * @function
   * @public
   * @api
   */
  activate() {
    clearInterval(this.running);
    this.running = false;
    document.querySelector('.m-timeline-button button').classList.add('cp-control-siguiente');
    document.querySelector('.m-timeline-button button').classList.remove('cp-control-pausa');
  }

  /**
   * Desactivate plugin
   *
   * @function
   * @public
   * @api
   */
  deactivate() {
    clearInterval(this.running);
    this.running = false;
    this.intervals.forEach((interval) => {
      this.getMapLayer(interval.service).setVisible(false);
    })
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
    return control instanceof TimelineControl;
  }
}
