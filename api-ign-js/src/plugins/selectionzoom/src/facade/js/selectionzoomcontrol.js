/**
 * @module M/control/SelectionZoomControl
 */

// import template from 'templates/selectionzoom';
import template from '../../templates/selectionzoom';

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
export default class SelectionZoomControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(map, layerOpts, idLayer, visible, ids, titles, previews) {
    const impl = new M.impl.Control();
    super(impl, 'SelectionZoom');
    map.getBaseLayers().forEach((layer) => {
      layer.on(M.evt.LOAD, map.removeLayers(layer));
    });
    this.layers = [];

    if (layerOpts !== undefined) {
      // Array<Object> => Object: { id, title, preview, Array<MapeaLayer>}
      this.layers = layerOpts.slice(0, MAXIMUM_LAYERS);
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
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, { vars: { layers: this.layers } });
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
    this.visible = false;
    const isActivated = e.currentTarget.parentElement
      .querySelector(`#m-selectionzoom-lyr-${layersInfo.id}`)
      .classList.contains('activeSelectionZoomDiv');

    e.currentTarget.parentElement.querySelectorAll('div[id^="m-selectionzoom-lyr-"]').forEach((imgContainer) => {
      if (imgContainer.classList.contains('activeSelectionZoomDiv')) {
        imgContainer.classList.remove('activeSelectionZoomDiv');
      }
    });

    const currentBbox = this.map.getBbox();

    const nuevoBbox = {};
    nuevoBbox.x = {};
    nuevoBbox.y = {};

    if (!isActivated) {
      this.visible = true;
      this.activeLayer = i;
      if (currentBbox) {
        e.currentTarget.parentElement
          .querySelector(`#m-selectionzoom-lyr-${layersInfo.id}`).classList.add('activeSelectionZoomDiv');
      }

      if (layersInfo.id === 'peninsula' && currentBbox) {
        nuevoBbox.x.min = -1263221.2874767731;
        nuevoBbox.x.max = 302209.0518036366;

        nuevoBbox.y.min = 4300430.141912876;
        nuevoBbox.y.max = 5425583.198270669;

        this.map.setBbox(nuevoBbox);
      } else if (layersInfo.id === 'canarias') {
        nuevoBbox.x.min = -2146688.9523023404;
        nuevoBbox.x.max = -1363973.7826621355;

        nuevoBbox.y.min = 3036618.20442022;
        nuevoBbox.y.max = 3599194.732599117;

        this.map.setBbox(nuevoBbox);
      } else if (layersInfo.id === 'baleares') {
        nuevoBbox.x.min = -95431.5762524241;
        nuevoBbox.x.max = 687283.5933877807;

        nuevoBbox.y.min = 4508215.653914858;
        nuevoBbox.y.max = 5070792.182093754;

        this.map.setBbox(nuevoBbox);
      } else if (layersInfo.id === 'ceuta') {
        nuevoBbox.x.min = -599441.621163833;
        nuevoBbox.x.max = -587211.6966382049;

        nuevoBbox.y.min = 4281868.604025825;
        nuevoBbox.y.max = 4290658.862278621;

        this.map.setBbox(nuevoBbox);
      } else if (layersInfo.id === 'melilla') {
        nuevoBbox.x.min = -334079.3984852897;
        nuevoBbox.x.max = -321849.4739596615;

        nuevoBbox.y.min = 4199473.280981311;
        nuevoBbox.y.max = 4208263.539234106;

        this.map.setBbox(nuevoBbox);
      }
    } else {
      nuevoBbox.x.min = -3493496.3513105395;
      nuevoBbox.x.max = 2768225.0058110994;

      nuevoBbox.y.min = 2534802.7739878176;
      nuevoBbox.y.max = 7035414.999418995;

      this.map.setBbox(nuevoBbox);
    }

    this.fire('selectionzoom:activeChanges', [{ activeLayerId: this.activeLayer }]);
  }

  // /**
  //  * This function manages the click event when the app is in mobile resolution
  //  * @function
  //  * @public
  //  * @api
  //  */
  // handlerClickMobile(e) {
  //   this.removeLayers();
  //   this.activeLayer += 1;
  //   this.activeLayer = this.activeLayer % this.layers.length;
  //   const layersInfo = this.layers[this.activeLayer];
  //   const { layers, id, title } = layersInfo;

  //   layers.forEach((layer, index, array) => layer.setZIndex(index - array.length));

  //   e.currentTarget.parentElement.querySelectorAll('div[id^="m-selectionzoom-lyr-"]')
  // .forEach((imgContainer) => {
  //     if (imgContainer.classList.contains('activeSelectionZoomDiv')) {
  //       imgContainer.classList.remove('activeSelectionZoomDiv');
  //     }
  //   });
  //   e.currentTarget.innerHTML = title;
  //   e.currentTarget.parentElement
  //     .querySelector(`#m-selectionzoom-lyr-${id}`).classList.add('activeSelectionZoomDiv');
  //   this.map.addLayers(layers);
  //   this.fire('selectionzoom:activeChanges', [{ activeLayerId: this.activeLayer }]);
  // }

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
    html.querySelectorAll('div[id^="m-selectionzoom-lyr-"]')
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
    return control instanceof SelectionZoomControl;
  }
}
