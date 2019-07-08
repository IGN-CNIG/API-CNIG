/**
 * @module M/control/SRSselectorControl
 */
import template from 'templates/srsselector';
import options from 'templates/options';

/**
 * @classdesc
 * SRS selector Mapea control.
 * This plugin control reprojects the map.
 */
export default class SRSselectorControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(projections) {
    const impl = new M.impl.Control();
    super(impl, 'SRSselector');

    this.projections = projections.filter((projection) => {
      const supportedProjs = [
        'EPSG:4230',
        'EPSG:4258',
        'EPSG:4326',
        'EPSG:23028',
        'EPSG:23029',
        'EPSG:23030',
        'EPSG:23031',
        'EPSG:25828',
        'EPSG:25829',
        'EPSG:25830',
        'EPSG:25831',
        'EPSG:32628',
      ];
      return supportedProjs.includes(projection.code);
    });
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
      const compiledOptions =
        M.template.compileSync(options, { vars: { projections: this.projections } });
      html.appendChild(compiledOptions);
      html.querySelector('select#m-srsselector-srs').addEventListener('change', evt => this.changeSRS(evt));
      this.map = map;
      success(html);
    });
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api
   */
  activate() {
    super.activate();
  }

  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api
   */
  deactivate() {
    super.deactivate();
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
    return html.querySelector('.m-srsselector button');
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
    return control instanceof SRSselectorControl;
  }

  /**
   * @public
   * @function
   * @param {DOMEvent} e
   * @api
   */
  changeSRS(e) {
    const epsg = e.target.value;
    const units = e.target.selectedOptions[0].dataset.units;
    const selectedProjection = `${epsg}*${units}`;
    this.map.setProjection(selectedProjection);
  }
}
