/**
 * @module M/control/PredefinedZoomControl
 */

import PredefinedZoomImplControl from 'impl/predefinedzoomcontrol';
import template from 'templates/predefinedzoom';

export default class PredefinedZoomControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(savedZooms) {
    if (M.utils.isUndefined(PredefinedZoomImplControl)) {
      M.exception('La implementación usada no puede crear controles PredefinedZoomControl');
    }
    const impl = new PredefinedZoomImplControl();
    super(impl, 'PredefinedZoom');

    this.savedZooms = savedZooms;
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
      const html = M.template.compileSync(template);
      this.savedZooms.forEach((customZoom) => {
        const newBtn = document.createElement('button');
        newBtn.setAttribute('class', 'icon-expand');
        newBtn.setAttribute('title', customZoom.name);
        if (customZoom.bbox !== undefined) {
          newBtn.addEventListener('click', () => this.zoomToGivenBox(customZoom.bbox));
        } else if (customZoom.center !== undefined && customZoom.zoom !== undefined) {
          newBtn.addEventListener('click', () => this.zoomToCenter(customZoom.center, customZoom.zoom));
        }

        html.appendChild(newBtn);
      });

      success(html);
    });
  }

  /**
   * Zooms to predefined Bbox.
   * @function
   * @public
   * @param {Event} e
   */
  zoomToGivenBox(bbox) {
    this.map.setBbox(bbox);
  }

  /**
   * Zooms to predefined center with a zoom level.
   * @function
   * @public
   * @param {Event} e
   */
  zoomToCenter(center, zoom) {
    this.map.setCenter(center);
    this.map.setZoom(zoom);
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
    return control instanceof PredefinedZoomControl;
  }
}
