/**
 * @module M/control/SelectionZoomControl
 */

// import template from 'templates/selectionzoom';
import template from '../../templates/selectionzoom';
import SelectionZoomImpl from '../../impl/ol/js/selectionzoomcontrol';


/**
 * This parameter indicates the maximum base layers of plugin
 *
 * @type {number}
 * @const
 * @private
 */
const MAXIMUM_LAYERS = 5;

/**
 * This parameter indicates the maximum base layers of plugin
 *
 * @type {array}
 * @private
 */
let bboxbase = null;

/**
 * This parameter indicates the maximum base layers of plugin
 *
 * @type {number}
 * @private
 */
let zoombase = null;

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
    const impl = new SelectionZoomImpl();
    super(impl, 'SelectionZoom');

    // map.getBaseLayers().forEach((layer) => {
    //   layer.on(M.evt.LOAD, map.removeLayers(layer));
    // });
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

    if (bboxbase === null) {
      bboxbase = [currentBbox.x.min, currentBbox.x.max, currentBbox.y.min, currentBbox.y.max];
      zoombase = this.map.getZoom();
    }

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

      let BboxTransformXminYmax = [layersInfo.bbox.x.min, layersInfo.bbox.y.max];
      let BboxTransformXmaxYmin = [layersInfo.bbox.x.max, layersInfo.bbox.y.min];
      BboxTransformXmaxYmin = this.getImpl().transform(
        BboxTransformXmaxYmin,
        this.map_.getProjection().code, 'EPSG:3857',
      );
      BboxTransformXminYmax = this.getImpl().transform(
        BboxTransformXminYmax,
        this.map_.getProjection().code, 'EPSG:3857',
      );

      nuevoBbox.x.min = BboxTransformXminYmax[0];
      nuevoBbox.x.max = BboxTransformXmaxYmin[0];

      nuevoBbox.y.min = BboxTransformXmaxYmin[1];
      nuevoBbox.y.max = BboxTransformXminYmax[1];

      this.map.setBbox(nuevoBbox);
      this.map.setZoom(layersInfo.zoom);
    } else {
      nuevoBbox.x.min = bboxbase[0];
      nuevoBbox.x.max = bboxbase[1];

      nuevoBbox.y.min = bboxbase[2];
      nuevoBbox.y.max = bboxbase[3];

      this.map.setBbox(nuevoBbox);
      this.map.setZoom(zoombase);
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
