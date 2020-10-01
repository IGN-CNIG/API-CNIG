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
    let resolution;
    if (scale !== '0') {
      const view = this.facadeMap_.getMapImpl().getView();
      const closestZoom = this.getClosestResolution(scale);
      resolution = closestZoom.resolution;
      view.animate({
        center: view.getCenter(),
        resolution,
        duration: 500,
      });
      document.querySelector('#m-rescale-scaleinput').value = Math.trunc(closestZoom.scale);
    }
  }

  /**
   * This function sets a new scale to the map.
   * Developed for WGS 84 / Pseudo - Mercator 3857 projection.
   * @private
   * @function
   */
  setScale(scale) {
    const wmts3857scales = [
      559082264.0287178,
      279541132.0143589,
      139770566.0071794,
      69885283.00358972,
      34942641.50179486,
      17471320.75089743,
      8735660.375448715,
      4367830.187724357,
      2183915.093862179,
      1091957.546931089,
      545978.7734655447,
      272989.3867327723,
      136494.6933663862,
      68247.34668319309,
      34123.67334159654,
      17061.83667079827,
      8530.918335399136,
      4265.459167699568,
      2132.729583849784,
    ];
    const wmts3857resolutions = [
      156543.0339280410,
      78271.51696402048,
      39135.75848201023,
      19567.87924100512,
      9783.939620502561,
      4891.969810251280,
      2445.984905125640,
      1222.992452562820,
      611.4962262814100,
      305.7481131407048,
      152.8740565703525,
      76.43702828517624,
      38.21851414258813,
      19.10925707129406,
      9.554628535647032,
      4.777314267823516,
      2.388657133911758,
      1.194328566955879,
      0.5971642834779395,
    ];
    // Finds closest standard scale
    const newScale = wmts3857scales.reduce((prev, curr) => {
      return (Math.abs(curr - scale) < Math.abs(prev - scale) ? curr : prev);
    });
    const newResolution = wmts3857resolutions[wmts3857scales.indexOf(newScale)];
    const olMap = this.facadeMap_.getMapImpl();
    const olView = olMap.getView();
    olView.setResolution(newResolution);
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
      let scale = this.getWMTSScale(resolution);
      if (scale < originalScale) {
        const oldWins = Math.abs(originalScale - scale) > Math.abs(originalScale - lastZoom.scale);
        this.setScale(scale);
        scale = M.impl.utils.getWMTSScale(this.facadeMap_, true);
        newScale = oldWins ? lastZoom : { scale, resolution };
        zoom = maxZoom + 1;
      } else {
        lastZoom = { scale, resolution };
      }
    }

    return newScale;
  }

  /**
   * Gets view and size.
   * @public
   * @function
   * @api
   * @param {*} resolution -
   */
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

  /**
   * Gets WMTS scale.
   * @public
   * @function
   * @api
   * @param {*} resolution -
   */
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

  /**
   * Gets size from viewport.
   * @public
   * @function
   * @api
   */
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
