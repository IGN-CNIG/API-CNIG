/**
 * @module M/control/BackImgLayerControl
 */

// import template from 'templates/backimglayer';
import template from '../../templates/backimglayer';

/**
 * This parameter indicates the maximum base layers of plugin
 *
 * @type {number}
 * @const
 * @private
 */
const MAXIMUM_LAYERS = 5;

/**
 * @classdesc
 * Background layers selector Mapea control.
 * This control puts a set of layers in the background of the map.
 */
export default class BackImgLayerControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(map, layerOpts, idLayer, visible, ids, titles, previews, layers) {
    const impl = new M.impl.Control();
    super(impl, 'BackImgLayer');
    map.getBaseLayers().forEach((layer) => {
      layer.on(M.evt.LOAD, map.removeLayers(layer));
    });
    this.layers = [];

    if (layerOpts !== undefined) {
      // Array<Object> => Object: { id, title, preview, Array<MapeaLayer>}
      this.layers = layerOpts.slice(0, MAXIMUM_LAYERS);
    } else {
      const idsArray = ids.split(',');
      const titlesArray = titles.split(',');
      const previewArray = previews.split(',');
      const layersArray = layers.split(',');
      layersArray.forEach((baseLayer, idx) => {
        let siblingLayers = [];
        const backgroundLayers = baseLayer.split('+');
        backgroundLayers.forEach((urlLayer) => {
          const layer = urlLayer.replace(/asterisco/g, '*');
          siblingLayers.push(layer); // Array<String>
        });
        // turns it into Array <Mapea layer>
        siblingLayers = siblingLayers.map((sibling) => {
          const mapeaLayer = new M.layer.WMTS(sibling);
          console.log(mapeaLayer);
          console.log(typeof mapeaLayer);
          return mapeaLayer;
        });
        const mapeaLyrsObject = {
          id: idsArray[idx],
          title: titlesArray[idx],
          preview: previewArray[idx],
          layers: siblingLayers,
        };
        this.layers.push(mapeaLyrsObject);
      });
    }
    this.flattedLayers = this.layers.reduce((current, next) => current.concat(next.layers), []);
    this.activeLayer = -1;
    /* this.idLayer saves active layer position on layers array */
    this.idLayer = idLayer === null ? 0 : idLayer;
    this.visible = visible === null ? true : visible;
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    this.map = map;
    this.mapea4compatibility();
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, { vars: { layers: this.layers } });
      this.html = html;
      this.listen(html);
      // this.uniqueButton = this.html.querySelector('#m-backimglayer-unique-btn');
      // this.uniqueButton.innerHTML = this.layers[0].title;
      this.on(M.evt.ADDED_TO_MAP, () => {
        const visible = this.visible;
        if (this.idLayer > -1) {
          this.activeLayer = this.idLayer;
          console.log('createView this.layers[this.activeLayer]:');
          console.log(this.layers[this.activeLayer]);
          this.showBaseLayer({
            currentTarget: {
              parentElement: html,
            },
          }, this.layers[this.activeLayer], this.activeLayer);
        }
        if (visible === false) {
          this.map.removeLayers(this.map.getBaseLayers());
        }
      });
      success(html);
    });
  }

  /**
   * This function adds layer bound to the button clicked
   * @public
   * @param {DOMEvent} e - click html event
   * @param {object} layersInfo - Layers options
   * @api
   */
  showBaseLayer(e, layersInfo, i) {
    console.log('showBaseLayer layersInfo:');
    let callback = this.handlerClickDesktop.bind(this);
    if (window.innerWidth <= M.config.MOBILE_WIDTH) {
      callback = this.handlerClickMobile.bind(this);
    }
    callback(e, layersInfo, i);
  }

  /**
   * This function manages the click event when the app is in desktop resolution
   *
   * @function
   * @public
   * @api
   * @param {Event} e
   * @param {} layersInfo
   * @param {} i
   */
  handlerClickDesktop(e, layersInfo, i) {
    console.log('handlerClickDesktop layersInfo:');
    console.log(layersInfo);
    this.removeLayers();
    this.visible = false;
    // const { layers, title } = layersInfo;
    const { layers } = layersInfo;
    const isActived = e.currentTarget.parentElement
      .querySelector(`#m-backimglayer-lyr-${layersInfo.id}`)
      .classList.contains('activeBackimglayerDiv');
    layers.forEach((layer, index, array) => layer.setZIndex(index - array.length));

    e.currentTarget.parentElement.querySelectorAll('div[id^="m-backimglayer-lyr-"]').forEach((imgContainer) => {
      if (imgContainer.classList.contains('activeBackimglayerDiv')) {
        imgContainer.classList.remove('activeBackimglayerDiv');
      }
    });
    if (!isActived) {
      this.visible = true;
      this.activeLayer = i;
      // e.currentTarget.parentElement
      // .querySelector('#m-backimglayer-unique-btn').innerText = title;
      e.currentTarget.parentElement
        .querySelector(`#m-backimglayer-lyr-${layersInfo.id}`).classList.add('activeBackimglayerDiv');
      this.map.addLayers(layers);
    }
  }

  /**
   * This function manages the click event when the app is in mobile resolution
   * @function
   * @public
   * @api
   */
  handlerClickMobile(e) {
    this.removeLayers();
    this.activeLayer += 1;
    this.activeLayer = this.activeLayer % this.layers.length;
    const layersInfo = this.layers[this.activeLayer];
    const { layers, id, title } = layersInfo;

    layers.forEach((layer, index, array) => layer.setZIndex(index - array.length));

    e.currentTarget.parentElement.querySelectorAll('div[id^="m-backimglayer-lyr-"]').forEach((imgContainer) => {
      if (imgContainer.classList.contains('activeBackimglayerDiv')) {
        imgContainer.classList.remove('activeBackimglayerDiv');
      }
    });
    e.currentTarget.innerHTML = title;
    e.currentTarget.parentElement
      .querySelector(`#m-backimglayer-lyr-${id}`).classList.add('activeBackimglayerDiv');
    this.map.addLayers(layers);
  }

  /**
   * This function removes this.layers from Map.
   * @function
   * @public
   * @api
   */
  removeLayers() {
    this.map.removeLayers(this.flattedLayers);
    this.map.removeLayers(this.map.getBaseLayers());
  }

  /**
   * This function add the events listener to each button of the html
   * @param {HTMLElement} html
   * @function
   * @public
   * @api
   */
  listen(html) {
    html.querySelectorAll('div[id^="m-backimglayer-lyr-"]')
      .forEach((b, i) => b.addEventListener('click', e => this.showBaseLayer(e, this.layers[i], i)));
    // html.querySelector('#m-backimglayer-unique-btn')
    // .addEventListener('click', e => this.showBaseLayer(e));
  }

  /**
   * Makes control compatible with Mapea 4.
   * @function
   * @public
   * @api
   */
  mapea4compatibility() {
    if (!M.template.compileSync) { // JGL: retrocompatibilidad Mapea4
      M.template.compileSync = (string, options) => {
        let templateCompiled;
        let templateVars = {};
        let parseToHtml;
        if (!M.utils.isUndefined(options)) {
          templateVars = M.utils.extendsObj(templateVars, options.vars);
          parseToHtml = options.parseToHtml;
        }
        const templateFn = Handlebars.compile(string);
        const htmlText = templateFn(templateVars);
        if (parseToHtml !== false) {
          templateCompiled = M.utils.stringToHtml(htmlText);
        } else {
          templateCompiled = htmlText;
        }
        return templateCompiled;
      };
    }
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
    return control instanceof BackImgLayerControl;
  }
}
