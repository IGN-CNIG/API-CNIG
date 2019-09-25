import DrawFeatureImpl from '../../impl/ol/js/drawFeature';
import drawfeatureHTML from '../../templates/drawfeature.html';
import drawfeatureHTML2 from '../../templates/drawfeature2.html';
import drawfeatureHTML3 from '../../templates/drawfeature3.html';
import drawfeatureHTML5 from '../../templates/drawfeature5.html';

export default class DrawFeature extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a ModifyFeature
   * control to edit map features
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(plugin, geometry) {
    // implementation of this control
    const impl = new DrawFeatureImpl(geometry, plugin.vectorLayer, plugin.vectorSource, plugin);

    // calls the super constructor
    super(impl, DrawFeature.NAME);

    /**
     * Name of the control
     * @public
     * @type {String}
     */
    this.type = geometry;
    this.plugin = plugin;
    this.vectorLayer = plugin.vectorLayer;
    this.name = DrawFeature.NAME;
    this.feature = plugin.getFeature();
    this.select = null;

    if (M.utils.isUndefined(DrawFeatureImpl)) {
      M.exception('La implementación usada no puede crear controles DrawFeature');
    }
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the control
   * @returns {Promise} html response
   * @api stable
   */
  createView(map) {
    if (this.type === 'Point') {
      return M.template.compileSync(drawfeatureHTML, { jsonp: true });
    } else if (this.type === 'LineString') {
      return M.template.compileSync(drawfeatureHTML2, { jsonp: true });
    } else if (this.type === 'Polygon') {
      return M.template.compileSync(drawfeatureHTML3, { jsonp: true });
    }
    return M.template.compileSync(drawfeatureHTML5, { jsonp: true });
  }

  activate() {
    super.activate();
    this.getImpl().addOnClickEvent();
  }

  deactivate() {
    super.deactivate();
    this.getImpl().deleteOnClickEvent();
  }

  /**
   * This function returns the HTML button
   *
   * @public
   * @function
   * @param {HTMLElement} element - HTML control
   * @return {HTMLElement} return HTML button
   * @api stable
   * @export
   */
  getActivationButton(element) {
    if (this.type === 'Point') {
      return element.querySelector('button#m-button-drawFeature');
    } else if (this.type === 'LineString') {
      return element.querySelector('button#m-button-drawFeature2');
    } else if (this.type === 'Polygon') {
      return element.querySelector('button#m-button-drawFeature3');
    }
    return element.querySelector('button#m-button-drawFeature5');
  }

  /**
   * This function checks if an object is equals to this control
   *
   * @function
   * @api stable
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   */
  equals(obj) {
    const equals = (obj instanceof DrawFeature && obj.type === this.type);
    return equals;
  }
}

/**
 * Name for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
DrawFeature.NAME = 'drawfeatureasd';

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
DrawFeature.TEMPLATE = 'drawfeature.html';
