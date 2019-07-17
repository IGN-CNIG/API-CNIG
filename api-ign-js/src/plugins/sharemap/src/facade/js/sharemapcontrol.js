/**
 * @module M/control/ShareMapControl
 */
import template from 'templates/sharemap';
import modal from 'templates/modal';
import createStyle from 'facade/styles';

/**
 * This function adds the animation shade class.
 *
 * @function
 * @private
 */
const beginShade = (element) => {
  element.classList.add('m-plugin-sharemap-shade');
};

/**
 * This function removes the html element from DOM.
 *
 * @function
 * @private
 */
const removeElement = (element) => {
  const parent = element.parentElement;
  parent.removeChild(element);
};

/**
 * This function copies the textr input in clipboard
 *
 * @function
 * @private
 */
const copyURL = (input) => {
  const inputVar = input;
  inputVar.disabled = false;
  inputVar.select();
  document.execCommand('copy');
  inputVar.disabled = true;
  document.getSelection().removeAllRanges();
};

/**
 * @classdesc
 * ShareMap mapea control.
 * This control allows current map state sharing via URL.
 */
export default class ShareMapControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(options) {
    const impl = new M.impl.Control();
    super(impl, 'sharemap');

    /**
     * Base url of the shared map
     *
     * @private
     * @type {URLLike}
     */
    this.baseUrl_ = options.baseUrl;

    /**
     * Title of the modal
     *
     * @private
     * @type {string}
     */
    this.title_ = options.title;

    /**
     * Text of the button
     *
     * @private
     * @type {string}
     */
    this.btn_ = options.btn;

    /**
     * Text of the copy button
     *
     * @private
     * @type {string}
     */
    this.copyBtn_ = options.copyBtn;

    /**
     * Primary color of the html view  (hexadecimal format).
     *
     * @private
     * @type {string}
     */
    this.primaryColor_ = options.primaryColor || '#71a7d3';

    /**
     * Secondary color of the html view  (hexadecimal format).
     *
     * @private
     * @type {string}
     */
    this.secondaryColor_ = options.secondaryColor || '#fff';

    /**
     * Classes jss
     *
     * @private
     * @type {object}
     */
    this.classes_ = createStyle({
      primaryColor: this.primaryColor_,
      secondaryColor: this.secondaryColor_,
    });

    /**
     * Styles in js will be overwritten
     *
     * @private
     * @type {bool}
     */
    this.overwriteStyles_ = options.overwriteStyles || false;

    /**
     * Tooltip information for copy action
     *
     * @private
     * @type {string}
     */
    this.tooltip_ = options.tooltip || '¡Copiado!';
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
    this.map_ = map;
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      const button = html.querySelector('button');

      if (this.overwriteStyles_ === false) {
        button.classList.add(this.classes_.button);
      }

      this.addEvents(html);
      success(html);
    });
  }

  /**
   * This function adds the event to the view html
   *
   * @public
   * @param html - HTML template of the view
   * @api
   */
  addEvents(html) {
    html.querySelector('#m-sharemap-geturl').addEventListener('click', () => {
      this.activateModal();
    });
  }

  /**
   * This function adds modal view to html
   *
   * @public
   * @param html - HTML template of the view
   * @api
   */
  activateModal() {
    const dialog = M.template.compileSync(modal, {
      vars: {
        title: this.title_,
        btn: this.btn_,
        copyBtn: this.copyBtn_,
        tooltip: this.tooltip_,
      },
    });

    const content = dialog.querySelector('#m-plugin-sharemap-content');
    const message = dialog.querySelector('#m-plugin-sharemap-message');
    const button = dialog.querySelector('#m-plugin-sharemap-button');
    const title = dialog.querySelector('#m-plugin-sharemap-title');
    const okButton = dialog.querySelector('#m-plugin-sharemap-button > button');
    const copyButton = dialog.querySelector('#m-plugin-sharemap-copybutton');
    const input = message.querySelector('input');

    if (this.overwriteStyles_ === false) {
      content.classList.add(this.classes_.content);
      message.classList.add(this.classes_.message);
      button.classList.add(this.classes_.modalButton);
      title.classList.add(this.classes_.title);
    }

    const mapeaContainer = document.querySelector('div.m-mapea-container');
    okButton.addEventListener('click', () => removeElement(dialog));

    copyButton.addEventListener('click', () => {
      copyURL(input);
      beginShade(message.querySelector('#m-plugin-sharemap-tooltip'));
    });

    this.buildURL(dialog).then(() => mapeaContainer.appendChild(dialog));
  }

  /**
   * This method builds the url to sharing.
   *
   * @public
   * @function
   */
  buildURL(html) {
    const input = html.querySelector('input');
    return this.getControls().then((controls) => {
      const { x, y } = this.map_.getCenter();
      const { code, units } = this.map_.getProjection();
      let shareURL = `${this.baseUrl_}?controls=${controls}&center=${x},${y}&zoom=${this.map_.getZoom()}`;
      shareURL = shareURL.concat(`&projection=${code}*${units}`);
      shareURL = this.getLayers().length > 0 ? shareURL.concat(`&layers=${this.getLayers()}`) :
        shareURL.concat('');
      shareURL = shareURL.concat(`&${this.getPlugins()}`);
      input.value = shareURL;
    });
  }

  /**
   * This methods gets the controls url parameters
   *
   * @public
   * @function
   */
  getControls() {
    const url = this.baseUrl_.match(/(.*[A-Za-z-0-9])/)[0];
    const controls = this.map_.getControls().map(control => control.name);
    return new Promise((resolve) => {
      M.remote.get(`${url}/api/actions/controls`).then((response) => {
        const allowedControls = JSON.parse(response.text);
        const resolvedControls = controls.filter(control => allowedControls.includes(control));
        if (resolvedControls.includes('mouse')) {
          const mouseControl = this.map_.getControls().find(c => c.name === 'mouse');
          const { showProj } = mouseControl.getImpl();
          const index = resolvedControls.indexOf('mouse');
          resolvedControls[index] = showProj === true ? 'mouse*true' : 'mouse';
        }
        if (resolvedControls.includes('scale')) {
          const scaleControl = this.map_.getControls().find(c => c.name === 'scale');
          const { exactScale } = scaleControl.getImpl();
          const index = resolvedControls.indexOf('scale');
          resolvedControls[index] = exactScale === true ? 'scale*true' : 'scale';
        }
        resolve(resolvedControls);
      });
    });
  }

  /**
   * This method gets the layers parameters
   *
   * @public
   * @function
   */
  getLayers() {
    const layers = this.map_.getLayers().filter(layer => layer.name !== '__draw__' && layer.isVisible());
    return layers.map(layer => this.layerToParam(layer)).filter(param => param != null);
  }

  /**
   * This function gets the url param from layer
   *
   * @public
   * @function
   */
  layerToParam(layer) {
    let param;
    if (layer.name === 'osm') {
      param = layer.name;
    } else if (/mapbox/.test(layer.name)) {
      param = `MAPBOX.${layer.name}`;
    } else if (layer.type === 'WMS') {
      param = this.getWMS(layer);
    } else if (layer.type === 'WMTS') {
      param = this.getWMTS(layer);
    } else if (layer.type === 'KML') {
      param = this.getKML(layer);
    } else if (layer.type === 'WFS') {
      param = this.getWFS(layer);
    } else if (layer.type === 'GeoJSON') {
      param = this.getGeoJSON(layer);
    }
    return param;
  }

  /**
   * This methods gets the kml url parameters
   *
   * @public
   * @function
   */
  getKML(layer) {
    return `KML*${layer.name}*${layer.url}*${layer.extract}*${layer.label}`;
  }

  /**
   * This method gets the geojson url parameter
   *
   * @public
   * @function
   */
  getGeoJSON(layer) {
    const style = layer.getStyle().serialize();
    return layer.url ? `GeoJSON*${layer.name}*${window.encodeURIComponent(layer.url)}*${layer.extract}*${style}` : null;
  }

  /**
   * This method gets the wms url parameter
   *
   * @public
   * @function
   */
  getWMS(layer) {
    return `WMS*${layer.legend || layer.name}*${layer.url}*${layer.name}*${layer.transparent}*${layer.tiled}`;
  }

  /**
   * This method gets the wfs url parameter
   *
   * @public
   * @function
   */
  getWFS(layer) {
    const style = layer.getStyle().serialize();
    return `WFS*${layer.legend || layer.name}*${layer.url}*${layer.namespace}:${layer.name}:*${layer.geometry || ''}*${layer.ids || ''}*${layer.cql || ''}*${style || ''}`;
  }

  /**
   * This method gets the wmts url parameter
   *
   * @public
   * @function
   */
  getWMTS(layer) {
    const { code } = this.map_.getProjection();
    return `WMTS*${layer.url}*${layer.name}*${layer.matrixSet || code}*${layer.getLegend()}*${layer.transparent}`;
  }

  /**
   * This method gets the plugins url parameter
   */
  getPlugins() {
    return this.map_.getPlugins().map((plugin) => {
      let newCurrent = '';
      if (M.utils.isFunction(plugin.getAPIRest)) {
        newCurrent = plugin.getAPIRest();
      }
      return newCurrent;
    }).join('&');
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof ShareMapControl;
  }
}
