import DeleteFeatureImpl from '../../impl/ol/js/deleteFeature';
import deletefeatureHTML from '../../templates/deletefeature.html';

export default class DeleteFeature extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a ModifyFeature
   * control to edit map features
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(plugin) {
    // implementation of this control
    const impl = new DeleteFeatureImpl(plugin);

    // calls the super constructor
    super(impl, DeleteFeature.NAME);

    /**
     * Name of the control
     * @public
     * @type {String}
     */
    this.layer = plugin.layer;
    this.plugin = plugin;
    this.name = DeleteFeature.NAME;
    this.feature = plugin.getFeature();
    this.select = null;

    if (M.utils.isUndefined(DeleteFeatureImpl)) {
      M.exception('La implementación usada no puede crear controles DeleteFeature');
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
    return M.template.compileSync(deletefeatureHTML, { jsonp: true });
  }

  activate() {
    super.activate();
    if (document.getElementById('styleToolsHTML') != null) {
      this.plugin.stylePlugin.destroyControl();
    }
    this.plugin.feature = null;
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
    return element.querySelector('button#m-button-deleteFeature');
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
    const equals = (obj instanceof DeleteFeature);
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
DeleteFeature.NAME = 'deletefeaturecustom';

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
DeleteFeature.TEMPLATE = 'deletefeature.html';
