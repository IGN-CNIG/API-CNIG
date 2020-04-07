/**
 * @module M/control/BackImgLayerControl
 */

// import template from 'templates/backimglayer';
import template from '../../templates/backimglayer';
import { getValue } from './i18n/language';

/**
 * This parameter indicates the maximum base layers of plugin
 *
 * @type {number}
 * @const
 * @private
 */
// const MAXIMUM_LAYERS = 5;

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
  constructor(map, layerOpts, idLayer, visible, ids, titles, previews, layers, numColumns) {
    const impl = new M.impl.Control();
    let numColumnsV;
    super(impl, 'BackImgLayer');
    map.getBaseLayers().forEach((layer) => {
      layer.on(M.evt.LOAD, map.removeLayers(layer));
    });
    this.layers = [];

    map._plugins.filter((element) => {
      /* eslint no-underscore-dangle: 0 */
      return (map._plugins[map._plugins.indexOf(element)].name === 'backimglayer');
    }).map((element) => {
      numColumnsV = numColumns;
      return numColumnsV;
    });


    if (layerOpts !== undefined) {
      const layerOptsModified = layerOpts;

      layerOpts.filter((element) => {
        /* eslint no-underscore-dangle: 0 */
        return (((layerOpts.indexOf(element)) !== 0) &&
          (layerOpts.indexOf(element) % (numColumnsV) === 0));
      }).map((element) => {
        const elementIndex = layerOpts.indexOf(element);

        const temp = Object.assign({}, element);
        temp.firstElement = true;
        layerOptsModified[elementIndex] = temp;
        return temp;
      });
      // Array<Object> => Object: { id, title, preview, Array<MapeaLayer>}
      this.layers = layerOptsModified.slice(0);
    } else {
      const idsArray = ids.split(',');
      const titlesArray = titles.split(',');
      const previewArray = previews.split(',');
      const layersArray = layers.split(',');
      layersArray.forEach((baseLayer, idx) => {
        let backgroundLayers = baseLayer.split('sumar');

        backgroundLayers = backgroundLayers.map((urlLayer) => {
          const stringLayer = urlLayer.replace(/asterisco/g, '*');
          const mapeaLayer = new M.layer.WMTS(stringLayer);
          return mapeaLayer;
        });

        const mapeaLyrsObject = {
          id: idsArray[idx],
          title: titlesArray[idx],
          preview: previewArray[idx],
          layers: backgroundLayers,
        };
        this.layers.push(mapeaLyrsObject);
      });
    }

    this.numeroColumnas = numColumns * 110;
    this.numeroColumnas += 'px';

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
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, {
        vars: {
          layers: this.layers,
          translations: {
            headertitle: getValue('tooltip'),
          },
        },
      });
      this.html = html;
      this.listen(html);
      this.on(M.evt.ADDED_TO_MAP, () => {
        const visible = this.visible;
        if (this.idLayer > -1) {
          this.activeLayer = this.idLayer;
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
    const callback = this.handlerClickDesktop.bind(this);

    document.getElementById('m-backimglayer-previews').style.width = this.numeroColumnas;
    // if (window.innerWidth <= M.config.MOBILE_WIDTH) {
    //   callback = this.handlerClickMobile.bind(this);
    // }
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
    this.removeLayers();
    this.visible = false;
    const { layers } = layersInfo;

    const isActivated = e.currentTarget.parentElement
      .querySelector(`#m-backimglayer-lyr-${layersInfo.id}`)
      .classList.contains('activeBackimglayerDiv');

    layers.forEach((layer, index, array) => layer.setZIndex(index - array.length));

    e.currentTarget.parentElement.querySelectorAll('div[id^="m-backimglayer-lyr-"]').forEach((imgContainer) => {
      if (imgContainer.classList.contains('activeBackimglayerDiv')) {
        imgContainer.classList.remove('activeBackimglayerDiv');
      }
    });
    if (!isActivated) {
      this.visible = true;
      this.activeLayer = i;
      e.currentTarget.parentElement
        .querySelector(`#m-backimglayer-lyr-${layersInfo.id}`).classList.add('activeBackimglayerDiv');
      this.map.addLayers(layers);
    }
    this.fire('backimglayer:activeChanges', [{ activeLayerId: this.activeLayer }]);
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
