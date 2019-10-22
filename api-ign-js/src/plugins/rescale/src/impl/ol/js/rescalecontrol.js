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
    // let closestScale = scale;
    let resolution;
    if (scale !== '0') {
      const view = this.facadeMap_.getMapImpl().getView();
      // closestScale = this.closestIGNScale(scale);
      // resolution = this.scaleToResolution(closestScale);
      const closestZoom = this.getClosestResolution(scale);
      resolution = closestZoom.resolution;
      view.animate({
        center: view.getCenter(),
        resolution,
        duration: 500,
      });
      // document.querySelector('#m-rescale-scaleinput').value = `1:${scale}`;
      document.querySelector('#m-rescale-scaleinput').value = Math.trunc(closestZoom.scale);
    }
  }

  /**
   * Gets inputed scale and returns base layer closest scale and resolution.
   * @public
   * @function
   * @param {Number} originalScale - requested scale
   * @api
   */
  getClosestResolution(originalScale) {
    const minZoom = this.facadeMap_.getMinZoom();
    const maxZoom = this.facadeMap_.getMaxZoom();
    let lastZoom = {};
    let newScale;

    for (let zoom = minZoom; zoom < maxZoom + 1; zoom += 1) {
      const resolution = this.facadeMap_.getMapImpl().getView().getResolutionForZoom(zoom);
      const scale = this.getWMTSScale(resolution);
      if (scale < originalScale) {
        const oldWins = Math.abs(originalScale - scale) > Math.abs(originalScale - lastZoom.scale);
        newScale = oldWins ? lastZoom : { scale, resolution };
        zoom = maxZoom + 1;
      } else {
        lastZoom = { scale, resolution };
      }
    }

    return newScale;
  }

  // /**
  //  * Finds IGN service closest scale to the requested one.
  //  * @public
  //  * @function
  //  * @api
  //  * @param {*} originalScale - Requested scale
  //  */
  // closestIGNScale(originalScale) {
  //   // EPSG:3857 scales used by IGN
  //   // const ignScales = [533, 1066, 2132, 4265, 8530, 17061, 34123,
  //   //   68247, 136494, 272989, 545978, 1091957, 2183915, 4367830, 8735660, 17471320, 34942641,
  //   // ];
  //   // const newScale = ignScales.reduce((prev, curr) => {
  //   //   return (Math.abs(curr - originalScale) < Math.abs(prev - originalScale) ? curr : prev);
  //   // });
  //   return newScale;
  // }

  getForViewAndSize(resolution) {
    const dx = (resolution * this.getSizeFromViewport()[0]) / 2;
    const dy = (resolution * this.getSizeFromViewport()[1]) / 2;
    const cosRotation = Math.cos(this.facadeMap_.getMapImpl().getView().getRotation());
    const sinRotation = Math.sin(this.facadeMap_.getMapImpl().getView().getRotation());
    const xCos = dx * cosRotation;
    const xSin = dx * sinRotation;
    const yCos = dy * cosRotation;
    const ySin = dy * sinRotation;
    const x = this.facadeMap_.getCenter().x;
    const y = this.facadeMap_.getCenter().y;
    const x0 = (x - xCos) + ySin;
    const x1 = (x - xCos) - ySin;
    const x2 = (x + xCos) - ySin;
    const x3 = (x + xCos) + ySin;
    const y0 = (y - xSin) - yCos;
    const y1 = (y - xSin) + yCos;
    const y2 = (y + xSin) + yCos;
    const y3 = (y + xSin) - yCos;
    return [
      Math.min(x0, x1, x2, x3), Math.min(y0, y1, y2, y3),
      Math.max(x0, x1, x2, x3), Math.max(y0, y1, y2, y3),
    ];
  }

  getWMTSScale(resolution) {
    const projection = this.facadeMap_.getProjection().code;
    const olProj = ol.proj.get(projection);
    const mpu = olProj.getMetersPerUnit(); // meters per unit in depending on the CRS;
    const size = this.facadeMap_.getMapImpl().getSize();
    const pix = size[0]; // Numero de pixeles en el mapa
    // Extension del mapa en grados (xmin, ymin, xmax, ymax)
    const pix2 = this.getForViewAndSize(resolution);
    // Extension angular del mapa (cuantos grados estan en el mapa)
    const ang = pix2[2] - pix2[0];
    // (numero de metros en el mapa / numero de pixeles) / metros por pixel
    const scale = (((mpu * ang) / pix) * 1000) / 0.28;
    return scale;
  }

  getSizeFromViewport() {
    const size = [100, 100];
    const selector = `.ol-viewport[data-view="${ol.util.getUid(this.facadeMap_.getMapImpl().getView())}"]`;
    const element = document.querySelector(selector);
    if (element) {
      const metrics = window.getComputedStyle(element);
      size[0] = parseInt(metrics.width, 10);
      size[1] = parseInt(metrics.height, 10);
    }
    return size;
  }
}
