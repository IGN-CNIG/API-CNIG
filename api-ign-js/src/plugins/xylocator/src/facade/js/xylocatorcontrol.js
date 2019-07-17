/**
 * @module M/control/XYLocatorControl
 */

import XYLocatorImplControl from 'impl/xylocatorcontrol';
import template from 'templates/xylocator';
import projections from 'templates/options';

/**
 * @classdesc
 * XYLocator Mapea control.
 * This control centers map on given coordinates.
 */
export default class XYLocatorControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(options) {
    if (M.utils.isUndefined(XYLocatorImplControl)) {
      M.exception('La implementación usada no puede crear controles XYLocatorControl');
    }
    const impl = new XYLocatorImplControl();
    super(impl, 'XYLocator');

    /**
     * Projections options
     *
     * @private
     * @type {Array<object>} - {code: ..., title: ..., units: m | d}
     */
    this.projections = options.projections;

    /**
     * Zoom scale
     *
     * @private
     * @type {number}
     */
    this.scale_ = Number.isFinite(options.scale) === true ? options.scale : 2000;
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api
   */
  createView(map) {
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      this.template_ = html;
      const compiledOptions =
        M.template.compileSync(projections, { vars: { projections: this.projections } });
      this.template_.querySelector('#m-xylocator-coordinatesSystem').appendChild(compiledOptions);
      this.template_.querySelector('button#m-xylocator-limpiar').addEventListener('click', () => this.clear_());
      this.template_.querySelector('select#m-xylocator-srs').addEventListener('change', evt => this.manageInputs_(evt));
      this.template_.querySelector('button#m-xylocator-loc').addEventListener('click', evt => this.calculate_(evt));
      this.map = map;
      success(html);
    });
  }

  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api
   */
  getActivationButton(html) {
    return html.querySelector('.m-xylocator button');
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api
   */
  equals(control) {
    return control instanceof XYLocatorControl;
  }

  /**
   * This function centers the map on given point
   *
   * @public
   * @function
   * @param coords - coordinates writen by user
   * @api
   */
  locator_(coords) {
    const x = coords[0];
    const y = coords[1];
    const xFloat = parseFloat(x);
    const yFloat = parseFloat(y);
    this.map.removeLayers(this.coordinatesLayer);
    if (!isNaN(xFloat) && !isNaN(yFloat)) {
      this.map_.setCenter(`${x},${y}*false`);
      this.getImpl().setScale(this.scale_);
      this.fire('xylocator:locationCentered', [{
        zoom: 10,
        scale: this.scale_,
        center: [x, y],
      }]);

      this.coordinatesLayer = new M.layer.Vector({
        name: 'Resultado búsquedas',
      }, {
        displayInLayerSwitcher: false,
      });

      const feature = new M.Feature('localizacion', {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [x, y],
        },
      });

      this.coordinatesLayer.addFeatures([feature]);
      this.coordinatesLayer.setStyle(this.point);
      this.map_.addLayers(this.coordinatesLayer);
    } else {
      M.dialog.error('Las coordenadas introducidas no son correctas.', 'Error');
    }
  }

  /**
   * This function changes input label depending on SRS
   *
   * @private
   * @function
   * @param {DOMEvent} evt - event
   */
  manageInputs_(evt) {
    const selectTarget = evt.target;
    const selectedOption = selectTarget.options[selectTarget.selectedIndex];

    if (selectedOption.getAttribute('data-units') === 'd') {
      const divToHidden = document.querySelector('div#m-xylocator-utm');
      divToHidden.style.display = 'none';
      const divToShow = document.querySelector('div#m-xylocator-latlon');
      divToShow.style.display = 'block';
    } else {
      const divToHidden = document.querySelector('div#m-xylocator-latlon');
      divToHidden.style.display = 'none';
      const divToShow = document.querySelector('div#m-xylocator-utm');
      divToShow.style.display = 'block';
    }
  }

  /**
   * This function transforms coordinates to map SRS
   *
   * @public
   * @function
   * @param {DOMEvent} evt - event
   * @api
   */
  calculate_(evt) {
    try {
      const selectTarget = document.querySelector('select#m-xylocator-srs');
      const selectedOption = selectTarget.options[selectTarget.selectedIndex];
      const origin = selectedOption.value;

      let x = -1;
      let y = -1;
      if (selectedOption.getAttribute('data-units') === 'd') {
        const xString = document.querySelector('div#m-xylocator-latlon input#LON').value;
        const yString = document.querySelector('div#m-xylocator-latlon input#LAT').value;
        try {
          const xArray = xString;
          const yArray = yString;
          x = parseFloat(xArray);
          y = parseFloat(yArray);
        } catch (ex) {
          M.dialog.error('Las coordenadas no son correctas', 'Error');
        }
      } else {
        const xString = document.querySelector('div#m-xylocator-utm input#UTM-X').value;
        const yString = document.querySelector('div#m-xylocator-utm input#UTM-Y').value;
        x = parseFloat(xString);
        y = parseFloat(yString);
      }
      const coordinatesTransform = this.getImpl().reproject(origin, [x, y]);
      this.locator_(coordinatesTransform);
    } catch (ex) {
      M.dialog.error('Error realizando la transformación.', 'Error');
      throw ex;
    }
  }

  /**
   * This function clears input values
   *
   * @private
   * @function
   */
  clear_() {
    this.template_.querySelector('input#UTM-X').value = '';
    this.template_.querySelector('input#UTM-Y').value = '';
    this.template_.querySelector('input#LON').value = '';
    this.template_.querySelector('input#LAT').value = '';
    this.map.removeLayers(this.coordinatesLayer);
  }

  /**
   * This function adds personal geometry styles to our class
   *
   * @public
   * @function
   * @api
   */
  createGeometryStyles() {
    this.point = new M.style.Point({
      radius: 5,
      icon: {
        form: 'none',
        class: 'g-cartografia-pin',
        radius: 12,
        rotation: 0,
        rotate: false,
        offset: [0, -12],
        color: '#f00',
        opacity: 1,
      },
    });

    this.simple = new M.style.Polygon({
      fill: {
        color: 'black',
        opacity: 0,
      },
    });
  }
}
