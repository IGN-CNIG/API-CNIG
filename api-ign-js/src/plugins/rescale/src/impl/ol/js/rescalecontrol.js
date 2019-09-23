/**
 * @module M/impl/control/RescaleControl
 */
export default class RescaleControl extends M.impl.Control {
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    super.addTo(map, html);
    this.facadeMap_ = map;
  }

  /**
   * This function zooms the map to the selected scale
   *
   * @public
   * @function
   * @api stable
   */
  zoomToScale(scale) {
    let closestScale = scale;
    let resolution;
    if (scale !== '0') {
      const mapImpl = this.facadeMap_.getMapImpl();
      const view = mapImpl.getView();
      closestScale = this.closestIGNScale(scale);
      resolution = this.scaleToResolution(closestScale);
      view.animate({
        center: view.getCenter(),
        resolution,
        duration: 500,
      });
    }
    // document.querySelector('#m-rescale-scaleinput').value = `1:${scale}`;
    document.querySelector('#m-rescale-scaleinput').value = closestScale;
  }

  /**
   * Finds IGN service closest scale to the requested one.
   * @public
   * @function
   * @api
   * @param {*} originalScale - Requested scale
   */
  closestIGNScale(originalScale) {
    const ignScales = [533, 1066, 2132, 4265, 8530, 17061, 34123,
      68247, 136494, 272989, 545978, 1091957, 2183915, 4367830, 8735660, 17471320, 34942641,
    ];
    const newScale = ignScales.reduce((prev, curr) => {
      return (Math.abs(curr - originalScale) < Math.abs(prev - originalScale) ? curr : prev);
    });
    return newScale;
  }

  /**
   * Convert from scale to resolution
   *
   * @private
   * @function
   * @api stable
   */
  scaleToResolution(scale) {
    const mapImpl = this.facadeMap_.getMapImpl();
    const view = mapImpl.getView();
    const units = view.getProjection().getUnits();
    const dpi = 25.4 / 0.35;
    const mpu = ol.proj.Units.METERS_PER_UNIT[units];
    return scale / (mpu * 39 * dpi);
  }

  /**
   * Convert from resolution to scale
   *
   * @private
   * @function
   * @api stable
   */
  resolutionToScale(resolution) {
    const mapImpl = this.facadeMap_.getMapImpl();
    const view = mapImpl.getView();
    const units = view.getProjection().getUnits();
    const dpi = 25.4 / 0.35;
    const mpu = ol.proj.Units.METERS_PER_UNIT[units];
    return resolution * (mpu * 39 * dpi);
  }
}
