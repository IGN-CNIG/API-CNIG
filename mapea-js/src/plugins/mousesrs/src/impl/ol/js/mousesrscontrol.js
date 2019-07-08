/**
 * @module M/impl/control/MouseSRSControl
 */
import ExtendedMouse from './extendedMouse';

export default class MouseSRSControl extends M.impl.Control {
  constructor(srs) {
    super();

    /**
     * Coordinates spatial reference system
     *
     * @type { ProjectionLike } https://openlayers.org/en/latest/apidoc/module-ol_proj.html#~ProjectionLike
     * @private
     */
    this.srs_ = srs;
  }

  /**
   * This function adds the control to the specified map
   *
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api
   */
  addTo(map, html) {
    this.facadeMap_ = map;
    this.mousePositionControl = new ExtendedMouse({
      coordinateFormat: ol.coordinate.createStringXY(2),
      projection: this.srs_,
      undefinedHTML: '',
      className: 'm-mouse-srs',
      target: html,
    });

    map.getMapImpl().addControl(this.mousePositionControl);

    super.addTo(map, html);
  }

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api
   * @export
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
  }
}
