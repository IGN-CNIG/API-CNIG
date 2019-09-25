import MoveFeatureImpl from '../../impl/ol/js/moveFeature';
import movefeatureHTML from '../../templates/movefeature.html';

export default class MoveFeature extends M.Control {
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
    const impl = new MoveFeatureImpl(plugin.getFeature(), plugin);

    // calls the super constructor
    super(impl, MoveFeature.NAME);

    /**
     * Name of the control
     * @public
     * @type {String}
     */
    this.plugin = plugin;
    this.name = MoveFeature.NAME;
    this.feature = plugin.getFeature();
    this.select = null;

    if (M.utils.isUndefined(MoveFeatureImpl)) {
      M.exception('La implementación usada no puede crear controles PickFeature');
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
    return M.template.compileSync(movefeatureHTML, { jsonp: true });
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
    return element.querySelector('button#m-button-moveFeature');
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
    const equals = (obj instanceof MoveFeature);
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
MoveFeature.NAME = 'movefeature';

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
MoveFeature.TEMPLATE = 'movefeature.html';
