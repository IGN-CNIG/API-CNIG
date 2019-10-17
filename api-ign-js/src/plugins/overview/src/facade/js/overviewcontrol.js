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
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      this.addEvents();
      success(html);
    });
  }

  addEvents() {
    this.on(M.evt.ADDED_TO_PANEL, this.addMap.bind(this));
    this.map.getMapImpl().on('moveend', this.moveMap);
  }

  /**
   * Adds overview map to control.
   */
  addMap() {
    this.smallMap = M.map({
      container: 'smallmap',
      zoom: 0, // this.map.getZoom() >= 2 ? this.map.getZoom() - 2 : 0,
    });

    this.smallMap.removeControls('panzoom');
  }

  /*
   * Moves map on zoom, drag or pan
   */
  moveMap(e) {
    console.log(e);
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
