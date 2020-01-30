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

      if (layersInfo.id === 'peninsula') {
        nuevoBbox.x.min = -1200091.444315327;
        nuevoBbox.x.max = 365338.89496508264;

        nuevoBbox.y.min = 4348955.797933925;
        nuevoBbox.y.max = 5441088.058072522;

        this.map.setBbox(nuevoBbox);
        this.map.setZoom(7);
      } else if (layersInfo.id === 'canarias') {
        nuevoBbox.x.min = -2170190.6639824593;
        nuevoBbox.x.max = -1387475.4943422542;

        nuevoBbox.y.min = 3091778.038884449;
        nuevoBbox.y.max = 3637844.1689537475;

        this.map.setBbox(nuevoBbox);
        this.map.setZoom(8);
      } else if (layersInfo.id === 'baleares') {
        nuevoBbox.x.min = 115720.89020469127;
        nuevoBbox.x.max = 507078.4750247937;

        nuevoBbox.y.min = 4658411.436032817;
        nuevoBbox.y.max = 4931444.501067467;

        this.map.setBbox(nuevoBbox);
        this.map.setZoom(9);
      } else if (layersInfo.id === 'ceuta') {
        nuevoBbox.x.min = -599755.2558583047;
        nuevoBbox.x.max = -587525.3313326766;

        nuevoBbox.y.min = 4281734.817081453;
        nuevoBbox.y.max = 4290267.100363785;

        this.map.setBbox(nuevoBbox);
      } else if (layersInfo.id === 'melilla') {
        nuevoBbox.x.min = -334717.4178261766;
        nuevoBbox.x.max = -322487.4933005484;

        nuevoBbox.y.min = 4199504.016876071;
        nuevoBbox.y.max = 4208036.300158403;

        this.map.setBbox(nuevoBbox);
        this.map.setZoom(14);
      }
    } else {
      nuevoBbox.x.min = -3597923.5010608193;
      nuevoBbox.x.max = 2663797.8560608197;

      nuevoBbox.y.min = 2499195.1013228036;
      nuevoBbox.y.max = 6867724.141877197;

      this.map.setBbox(nuevoBbox);
      this.map.setZoom(5);
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
