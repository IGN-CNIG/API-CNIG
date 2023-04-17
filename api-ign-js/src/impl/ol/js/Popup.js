/**
 * @module M/impl/Popup
 */
import OLOverlay from 'ol/Overlay';
import { enableTouchScroll, isFunction, isNullOrEmpty } from 'M/util/Utils';
import FacadePopup from 'M/Popup';
import FacadeWindow from 'M/util/Window';

/**
 * @classdesc
 * Implementación de la clase "Popup"
 *
 * @property {Boolean} panMapIfOutOfView Indica si el mapa se desplaza o no.
 * @property {Object} ani_opts Opciones de animación.
 * @property {M.Map} facadeMap_ Mapa.
 * @property {ol.Coordinate} cachedAniPixel_
 *
 * @api
 * @extends {ol.Overlay}
 */
class Popup extends OLOverlay {
  /**
   * Constructor principal de la clase "Popup".
   *
   * @constructor
   * @param {Object} options Opciones del "Popup".
   * - icon: Icono del "Popup".
   * - title: Título del "Popup".
   * - content: Contenido del "Popup".
   * - listeners: Función 'listener'.
   * - panMapIfOutOfView: Indica si el mapa se desplaza o no.
   * - ani_opts: Opciones de animación. Puede constar de las siguientes propiedades:
   *            - "duration": Duración de la animación en milisegundos.
   *
   *            - "easing": El método de aceleración a usar.
   *
   * @api
   */
  constructor(options = {}) {
    super({});

    /**
     * Indica si el mapa se desplaza o no.
     * @type {Boolean}
     */
    this.panMapIfOutOfView = options.panMapIfOutOfView;
    if (this.panMapIfOutOfView === undefined) {
      this.panMapIfOutOfView = false;
    }

    /**
     * Opciones de animación.
     * @type {Object}
     */
    this.ani_opts = options.ani_opts;
    if (this.ani_opts === undefined) {
      this.ani_opts = {
        duration: 250,
      };
    }

    /**
     * Fachada del mapa a implementar.
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    /**
     *
     * @private
     * @type {ol.Coordinate}
     */
    this.cachedAniPixel_ = null;
  }

  /**
   * Este método añade el HTML del "Popup" al mapa.
   *
   * @function
   * @param {M.Map} map Mapa.
   * @param {String} html Cadena de HTML para mostrar dentro del "Popup".
   * @public
   * @api
   */
  addTo(map, html) {
    this.facadeMap_ = map;

    // container
    this.container = html;

    this.content = this.getContentFromContainer(html);

    // Apply workaround to enable scrolling of content div on touch devices
    enableTouchScroll(this.content);

    this.setElement(this.container);

    map.getMapImpl().addOverlay(this);
  }

  /**
   * Este método muestra el "Popup".
   *
   * @function
   * @param {ol.Coordinate} coord Coordenadas donde situar el "Popup".
   * @param {function} callback Función 'callback' de llamada para ejecutar.
   * @public
   * @api
   * @memberof module:M/impl/Popup#
   */
  show(coord, callback) {
    this.setPosition(coord);
    if (this.panMapIfOutOfView) {
      this.panIntoView(coord);
    }
    this.content.scrollTop = 0;
    if (isFunction(callback)) {
      callback();
    }
    return this;
  }

  /**
   * Este método centra el "Popup".
   *
   * @function
   * @param {M.Popup.status} status Estado del "Popup".
   * @param {ol.Coordinate} coord Coordenadas donde situar el "Popup".
   * @public
   * @api
   */
  centerByStatus(status, coord) {
    const resolution = this.getMap().getView().getResolution();
    const newCoord = [].concat(coord);
    if (status === FacadePopup.status.COLLAPSED) {
      newCoord[1] -= 0.1 * FacadeWindow.HEIGHT * resolution;
    } else if (status === FacadePopup.status.DEFAULT) {
      newCoord[1] -= 0.275 * FacadeWindow.HEIGHT * resolution;
    } else { // FULL state no effects
      return;
    }

    const featureCenter = this.facadeMap_.getFeatureCenter();
    this.facadeMap_.setCenter({
      x: newCoord[0],
      y: newCoord[1],
    });
    // if the center was drawn then draw it again
    if (!isNullOrEmpty(featureCenter)) {
      this.facadeMap_.drawFeatures([featureCenter]);
    }
  }

  /**
   * Este método obtiene el HTML del contenedor "m-body".
   *
   * @function
   * @param {Object} html HTML.
   * @returns {Object} Elemento HTML.
   * @public
   * @api
   */
  getContentFromContainer(html) {
    return html.querySelector('div.m-body');
  }

  /**
   * Este método mueve el mapa para que el "Popup" sea completamente
   * visible en el actual 'viewport' (si es necesario).
   *
   * @function
   * @param {ol.Coordinate} coord Coordenadas del "Popup".
   * @returns {Object} Centro del mapa.
   * @public
   * @api
   */
  panIntoView(coord) {
    // it waits for the previous animation in order to execute this
    this.panIntoSynchronizedAnim_().then(() => {
      this.isAnimating_ = true;
      // if (FacadeWindow.WIDTH > 768) {
      const tabHeight = 30; // 30px for tabs
      const popupElement = this.element.querySelector('.m-popup');
      const popupWidth = popupElement.clientWidth + 20;
      const popupHeight = popupElement.clientHeight + 20 + tabHeight;
      const mapSize = this.getMap().getSize();

      const center = this.getMap().getView().getCenter();
      const tailHeight = 20;
      const tailOffsetLeft = 60;
      const tailOffsetRight = popupWidth - tailOffsetLeft;
      const popOffset = this.getOffset();
      const popPx = this.getMap().getPixelFromCoordinate(coord);

      if (!isNullOrEmpty(popPx)) {
        const fromLeft = (popPx[0] - tailOffsetLeft);
        const fromRight = mapSize[0] - (popPx[0] + tailOffsetRight);

        const fromTop = popPx[1] - (popupHeight + popOffset[1]);
        const fromBottom = mapSize[1] - (popPx[1] + tailHeight) - popOffset[1];

        const curPix = this.getMap().getPixelFromCoordinate(center);
        const newPx = curPix.slice();

        if (fromRight < 0) {
          newPx[0] -= fromRight;
        } else if (fromLeft < 0) {
          newPx[0] += fromLeft;
        }

        if (fromTop < 0) {
          newPx[1] += fromTop;
        } else if (fromBottom < 0) {
          newPx[1] -= fromBottom;
        }

        // if (this.ani && this.ani_opts) {
        if (!isNullOrEmpty(this.ani_opts) && isNullOrEmpty(this.ani_opts.source)) {
          this.ani_opts.source = center;
          this.getMap().getView().animate(this.ani_opts);
        }

        if (newPx[0] !== curPix[0] || newPx[1] !== curPix[1]) {
          this.getMap().getView().setCenter(this.getMap().getCoordinateFromPixel(newPx));
        }
      }
      // }
      // the animation ended
      this.isAnimating_ = false;
    });

    return this.getMap().getView().getCenter();
  }

  /**
   * Este método sincroniza las animaciones del "Popup".
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @function
   * @public
   * @api
   */
  panIntoSynchronizedAnim_() {
    return new Promise((success, fail) => {
      /* if the popup is animating then it waits for the animation
      in order to execute the next animation */
      if (this.isAnimating_ === true) {
        // gets the duration of the animation
        let aniDuration = 300;
        if (!isNullOrEmpty(this.ani_opts)) {
          aniDuration = this.ani_opts.duration;
        }
        setTimeout(success, aniDuration);
      } else {
        /* if there is not any animation then it starts
        a new one */
        success();
      }
    });
  }

  /**
   * Este método elimina el "Popup" del mapa.
   *
   * @function
   * @public
   * @api
   */
  hide() {
    this.facadeMap_.removePopup();
  }

  /**
   * Este método establece el texto del "Popup".
   *
   * @function
   * @param {Object} html Nuevo contenido para el "Popup".
   * @public
   * @api
   */
  setContainer(html) {
    this.setElement(html);
    this.content = this.getContentFromContainer(html);
    enableTouchScroll(this.content);
  }

  /**
   * Este método obtiene el contenido del "Popup".
   *
   * @function
   * @returns {String} Contenido del "Popup".
   * @public
   * @api
   */
  getContent() {
    return this.content;
  }
}
export default Popup;
