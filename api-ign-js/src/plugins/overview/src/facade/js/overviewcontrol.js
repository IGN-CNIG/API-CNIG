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
  constructor(baseLayer, collapsed) {
    if (M.utils.isUndefined(OverviewImplControl)) {
      M.exception('La implementación usada no puede crear controles OverviewControl');
    }
    const impl = new OverviewImplControl();
    super(impl, 'Overview');

    /**
     * Base layer for overview map.
     * @private
     * @type {String}
     */
    this.baseLayer = baseLayer;

    /**
     * Indicates if plugin is collapsed on the beginning.
     * @private
     * @type {Boolean}
     */
    this.collapsed = collapsed;

    /**
     * Indicates if collapsed plugin button has already been opened (false) or not (true).
     * @private
     * @type {Boolean}
     */
    this.isFirstOpening = true;

    /**
     * Indicates if current zoom change is odd or even change in a series of changes.
     * So that small map only zooms once every two zoom changes.
     * @private
     * @type {Boolean}
     */
    // this.isOddViewChange = true;
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
    // loads map
    if (this.collapsed) {
      document.querySelector('.overview-panel.collapsed>.m-panel-btn.overview-mundo').addEventListener('click', this.openSmallMap.bind(this));
    } else {
      this.on(M.evt.ADDED_TO_PANEL, this.addMap.bind(this));
    }

    this.map.getMapImpl().on('moveend', this.moveMap.bind(this));
  }

  /**
   * Adds map on first open click.
   * @public
   * @function
   * @api
   */
  openSmallMap() {
    if (this.isFirstOpening) {
      this.addMap();
      this.isFirstOpening = false;
    }
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
    });

    this.smallMap.removeControls('panzoom');

    if (this.baseLayer !== undefined) {
      this.smallMap.getBaseLayers().forEach(layer => this.smallMap.removeLayers(layer));
      this.smallMap.addLayers(this.baseLayer);
    }
  }

  /**
   * Moves overview map on zoom, drag or pan of main map.
   * @public
   * @function
   * @api
   */
  moveMap() {
    const newZoom = this.map.getMapImpl().getView().getZoom();
    const newCenter = this.map.getMapImpl().getView().getCenter();

    if (newZoom !== this.oldZoom || newCenter !== this.oldCenter) {
      const zoomChange = newZoom - this.oldZoom;
      const smallMapView = this.smallMap.getMapImpl().getView();
      this.getImpl().animateViewChange(smallMapView, newCenter, zoomChange);
      this.oldZoom = newZoom;
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
