import PickFeatureImpl from '../../impl/ol/js/pickfeature';
import pickfeatureHTML from '../../templates/pickfeature.html';

export default class PickFeature extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a ModifyFeature
   * control to edit map features
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {M.Control}
   * @api stable
   */
  constructor(plugin) {
    // implementation of this control
    const impl = new PickFeatureImpl();

    // calls the super constructor
    super(impl, PickFeature.NAME);

    /**
     * Name of the control
     * @public
     * @type {String}
     */
    this.plugin = plugin;
    this.name = PickFeature.NAME;
    this.feature = null;
    this.select = null;

    if (M.utils.isUndefined(PickFeatureImpl)) {
      M.exception('La implementación usada no puede crear controles PickFeature');
    }
  }

  /**
   * This function builds the query URL and show results
   *
   * @private
   * @function
   * @param {ol.MapBrowserPointerEvent} evt - Browser point event
   */

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
    return M.template.compileSync(pickfeatureHTML, { jsonp: true });
  }

  activate() {
    super.activate();
    this.getImpl().addOnClickEvent();
    this.getImpl().select.on('select', (e) => {
      if (e.target.getFeatures().getArray().length > 0) {
        this.plugin.setFeature(e.target.getFeatures());
      }
    });
  }

  deactivate() {
    super.deactivate();
    this.getImpl().deleteOnClickEvent();
    if (document.getElementById('styleToolsHTML') != null) {
      this.plugin.stylePlugin.destroyControl();
    }
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
    return element.querySelector('button#m-button-pickfeature');
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
    const equals = (obj instanceof PickFeature);
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
PickFeature.NAME = 'pickfeature';

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
PickFeature.TEMPLATE = 'pickfeature.html';
