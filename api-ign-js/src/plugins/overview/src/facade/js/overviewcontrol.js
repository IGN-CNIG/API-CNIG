/**
 * @module M/control/OverviewControl
 */

import OverviewImplControl from 'impl/overviewcontrol';
import template from 'templates/overview';

export default class OverviewControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    if (M.utils.isUndefined(OverviewImplControl)) {
      M.exception('La implementación usada no puede crear controles OverviewControl');
    }
    const impl = new OverviewImplControl();
    super(impl, 'Overview');
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
    this.oldZoom = map.getMapImpl().getView().getZoom();
    this.oldCenter = map.getMapImpl().getView().getCenter();
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      this.addEvents();
      success(html);
    });
  }

  /**
   * Adds events
   * @public
   * @function
   * @api
   */
  addEvents() {
    this.on(M.evt.ADDED_TO_PANEL, this.addMap.bind(this));
    this.map.getMapImpl().on('moveend', this.moveMap.bind(this));
  }

  /**
   * Adds overview map to control.
   * @public
   * @function
   * @api
   */
  addMap() {
    this.smallMap = M.map({
      container: 'smallmap',
      zoom: 1,
      maxZoom: 14,
      minZoom: 1,
      center: [-467062.8225, 4683459.6216],
      // this.map.getZoom() >= 2 ? this.map.getZoom() - 2 : 0,
    });

    this.smallMap.removeControls('panzoom');
  }

  /**
   * Moves overview map on zoom, drag or pan
   * @public
   * @function
   * @api
   */
  moveMap() {
    const newZoom = this.map.getMapImpl().getView().getZoom();
    const newCenter = this.map.getMapImpl().getView().getCenter();

    if (newZoom !== this.oldZoom) {
      const zoomChange = newZoom - this.oldZoom;
      // FIXME: check new zoom doesn't exit zoom limits
      this.smallMap.setZoom(this.smallMap.getMapImpl().getView().getZoom() + zoomChange);
      this.oldZoom = newZoom;
    }

    if (newCenter !== this.oldCenter) {
      this.smallMap.setCenter(newCenter);
      this.oldCenter = newCenter;
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
    return control instanceof OverviewControl;
  }
}
