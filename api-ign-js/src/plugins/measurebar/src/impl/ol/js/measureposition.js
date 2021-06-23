import { HELP_KEEP_MESSAGE } from '../../../facade/js/measureposition';

import Measure from './measurebase';
import FacadeMeasure from '../../../facade/js/measurebase';
import FacadeMeasureArea from '../../../facade/js/measurearea';
import FacadeMeasureLength from '../../../facade/js/measurelength';

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasurePosition
 * control
 *
 * @constructor
 * @extends {M.impl.control.Measure}
 * @api stable
 */
export default class MeasurePosition extends Measure {
  constructor() {
    super('LineString-Position-Option');

    /**
     * Help message
     * @private
     * @type {string}
     */
    this.helpMsg_ = FacadeMeasure.HELP_MESSAGE;

    /**
     * Help message
     * @private
     * @type {string}
     */
    this.helpMsgContinue_ = HELP_KEEP_MESSAGE;
  }

  /**
   * This function add tooltip with measure distance
   * @public
   * @param {ol.geom.SimpleGeometry} geometry - Object geometry
   * @return {string} output - Indicates the measure distance
   * @api stable
   */
  formatGeometry(geometry) {
    let length = null;
    const codeProj = this.facadeMap_.getProjection().code;
    const unitsProj = this.facadeMap_.getProjection().units;
    if (codeProj === 'EPSG:3857') {
      length = Math.round(ol.sphere.getLength(geometry) * 100) / 100;
    } else if (unitsProj === 'd') {
      const coordinates = geometry.getCoordinates();
      for (let i = 0, ii = coordinates.length - 1; i < ii; i += 1) {
        length += ol.sphere.getDistance(ol.proj.transform(coordinates[i], codeProj, 'EPSG:4326'), ol.proj.transform(coordinates[i + 1], codeProj, 'EPSG:4326'));
      }
    } else {
      length = Math.round(geometry.getLength() * 100) / 100;
    }
    let output;
    if (length > 1000) {
      output = `${this.formatNumber(Math.round(((length / 1000) * 100)) / 100)} km`;
    } else {
      output = `${this.formatNumber(Math.round(length * 100) / 100)} m`;
    }
    return output;
  }

  /**
   * This function returns coordinates to tooltip
   * @public
   * @param {ol.geom.SimpleGeometry} geometry - Object geometry
   * @return {array} coordinates to tooltip
   * @api stable
   */
  getTooltipCoordinate(geometry) {
    return geometry.getLastCoordinate();
  }

  activate() {
    const measure = this.facadeMap_.getControls().filter((control) => {
      return (control instanceof FacadeMeasureArea || control instanceof FacadeMeasureLength);
    });
    if (measure[0]) {
      measure[0].deactivate();
    }
    if (measure[1]) {
      measure[1].deactivate();
    }
    super.activate();
    document.querySelector('.m-control.m-measureposition-container').classList.add('activated');
  }

  /**
   * This function adds coordinates for MeasurePosition only,
   * requiered to start this functionality
   *
   * @public
   * @function
   * @param {array<number>} coord - Starting position
   */
  setCoordLocationStart(coord) {
    this.coordinatesPosition = coord;
  }

  /* eslint-disable newline-per-chained-call */
  formatNumber(number) {
    return `${number}`.replace(/\d(?=(\d{3})+\.)/g, '$&*').split('.').join(',').split('*').join('.');
  }
}
