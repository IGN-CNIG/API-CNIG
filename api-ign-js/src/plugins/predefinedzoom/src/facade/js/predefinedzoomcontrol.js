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
        const bbox = customZoom.bbox;
        const newBtn = document.createElement('button');
        newBtn.setAttribute('title', customZoom.name);
        newBtn.setAttribute('class', 'predefinedzoom-mundo2');
        newBtn.addEventListener('click', () => this.zoomToGivenBox(bbox));
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
