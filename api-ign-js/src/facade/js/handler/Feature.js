/**
 * @module M/handler/Feature
 */
import HandlerImpl from 'impl/handler/Feature';
import { isFunction, includes } from '../util/Utils';
import Exception from '../exception/exception';
import Base from '../Base';
import FacadeFeature from '../feature/Feature';
import * as EventType from '../event/eventtype';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * Clase para manipular los objetos geográficos.
 * @api
 */
class Features extends Base {
  /**
   * Constructor principal de la clase.
   * @constructor
   * @param {Object} options Opciones.
   * - ranges: Rango.
   * - hoverInteraction: Interacción al realizar "hover".
   * - maxFeaturesToSelect: Máximo número de objetos geográficos seleccionados.
   * - distance: Distancia.
   * @param {Object} impl "HandlerImpl", por defecto se le pasa las opciones a la
   * implementación.
   * @extends {M.facade.Base}
   * @api
   */
  constructor(options = {}, impl = new HandlerImpl(options)) {
    // calls the super constructor
    super(impl);

    /**
     * @private
     * @type {M.Map}
     * @expose
     */
    this.map_ = null;

    /**
     * @private
     * @type {Array<M.layer.Vector>}
     * @expose
     */
    this.layers_ = [];

    /**
     * @private
     * @type {boolean}
     * @expose
     */
    this.activated_ = false;

    /**
     * @private
     * @type {Object}
     * @expose
     */
    this.prevSelectedFeatures_ = {};

    /**
     * @private
     * @type {Object}
     * @expose
     */
    this.prevHoverFeatures_ = {};

    // checks if the implementation has all methods
    if (!isFunction(impl.addTo)) {
      Exception(getValue('exception').addto_method);
    }
    if (!isFunction(impl.getFeaturesByLayer)) {
      Exception(getValue('exception').getfeaturesbylayer_method);
    }
  }
  /**
   * Este método añade eventos al mapa.
   *
   * @public
   * @function
   * @param {M.Map} map mapa.
   * @api
   * @export
   */
  addTo(map) {
    this.map_ = map;
    this.map_.on(EventType.MOVE_MOUSE, this.moveOverMap_.bind(this));
    this.map_.on(EventType.CLICK, this.clickOnMap_.bind(this));
    this.getImpl().addTo(this.map_);
    this.fire(EventType.ADDED_TO_MAP);
  }

  /**
   * Evento que se activa cuando se hace clic sobre el mapa.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @param {Object} evt Evento.
   * @function
   * @api
   */
  clickOnMap_(evt) {
    if (this.activated_ === true) {
      const impl = this.getImpl();
      // TODO [FIX] Think a better solution for removePopup on unselect features
      this.map_.removePopup();

      this.layers_.forEach((layer, i) => {
        const clickedFeatures = impl.getFeaturesByLayer(evt, layer);
        const prevFeatures = [...(this.prevSelectedFeatures_[layer.name])];
        // no features selected then unselect prev selected features
        if (prevFeatures[0] === clickedFeatures[0] && i === 1 && clickedFeatures !== []) {
          this.selectFeatures(prevFeatures, layer, evt);
        }
        if (clickedFeatures.length === 0 && prevFeatures.length > 0) {
          this.unselectFeatures(prevFeatures, layer, evt);
        } else if (clickedFeatures.length > 0 && clickedFeatures[0] !== undefined) {
          const newFeatures = clickedFeatures.filter(f => !prevFeatures.some(pf => pf.equals(f)));

          const diffFeatures = prevFeatures.filter(f => !clickedFeatures.some(pf => pf.equals(f)));
          // unselect prev selected features which have not been selected this time
          if (diffFeatures.length > 0) {
            this.unselectFeatures(diffFeatures, layer, evt);
          }

          // select new selected features
          if (newFeatures.length > 0) {
            this.selectFeatures(newFeatures, layer, evt);
          }
        }
      });
    }
  }

  /**
   * Este evento se activa cuando se mueve por el mapa.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @param {Object} evt Evento.
   * @function
   * @api
   */
  moveOverMap_(evt) {
    if (this.activated_ === true) {
      const impl = this.getImpl();

      this.layers_.forEach((layer) => {
        const hoveredFeatures = impl.getFeaturesByLayer(evt, layer);
        const prevFeatures = [...this.prevHoverFeatures_[layer.name]];
        // no features selected then unselect prev selected features
        if (hoveredFeatures.length === 0 && prevFeatures.length > 0) {
          this.leaveFeatures_(prevFeatures, layer, evt);
        } else if (hoveredFeatures.length > 0) {
          const newFeatures = hoveredFeatures
            .filter(f => (f instanceof FacadeFeature) && !prevFeatures.some(pf => pf.equals(f)));
          const diffFeatures = prevFeatures.filter(f => !hoveredFeatures.some(pf => pf.equals(f)));
          // unselect prev selected features which have not been selected this time
          if (diffFeatures.length > 0) {
            this.leaveFeatures_(diffFeatures, layer, evt);
          }
          // select new selected features
          if (newFeatures.length > 0) {
            this.hoverFeatures_(newFeatures, layer, evt);
          }
        }
      });
    }
  }

  /**
   * Este método se encarga de seleccionar los objetos geográficos.
   *
   * @public
   * @function
   * @param {Object} features Objeto geográfico.
   * @param {Object} layer Capa.
   * @param {Object} evt Evento.
   * @api
   */
  selectFeatures(features, layer, evt) {
    this.prevSelectedFeatures_[layer.name] = this.prevSelectedFeatures_[layer.name]
      .concat(features);
    const layerImpl = layer.getImpl();
    if (isFunction(layerImpl.selectFeatures)) {
      layerImpl.selectFeatures(features, evt.coord, evt);
    }
    layer.fire(EventType.SELECT_FEATURES, [features, evt]);
  }

  /**
   * Este método se encarga de deseleccionar los objetos geográficos.
   *
   * @public
   * @function
   * @param {Object} features Objeto geográfico.
   * @param {Object} layer Capa.
   * @param {Object} evt Evento.
   * @api
   */
  unselectFeatures(features, layer, evt) {
    /* FIXME abelcruz Cambiado por problemas al usar selectFeatures() con features de OL.
    Ver ejemplo cluster-ext-interaction */
    this.prevSelectedFeatures_[layer.name] = this.prevSelectedFeatures_[layer.name]
      .filter(pf => !features.some(f => f.equals(pf)));
    // this.prevSelectedFeatures_[layer.name] = this.prevSelectedFeatures_[layer.name]
    //   .filter(pf => !features.some(f => f.ol_uid === pf.ol_uid));

    const layerImpl = layer.getImpl();
    if (isFunction(layerImpl.unselectFeatures)) {
      layerImpl.unselectFeatures(features, evt.coord);
    }
    layer.fire(EventType.UNSELECT_FEATURES, [features, evt.coord]);
  }

  /**
   * Este método se encarga de activar el evento cuando se hace "hover" sobre
   * el objeto geográfico.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @function
   * @param {Object} features Objeto geográfico.
   * @param {Object} layer Capa.
   * @param {Object} evt Evento.
   * @api
   */
  hoverFeatures_(features, layer, evt) {
    this.prevHoverFeatures_[layer.name] = this.prevHoverFeatures_[layer.name].concat(features);
    layer.fire(EventType.HOVER_FEATURES, [features, evt]);
    this.getImpl().addCursorPointer(evt);
  }

  /**
   * Este método se encarga de activar el evento cuando se deshace el "hover" sobre
   * el objeto geográfico.
   *
   * @public
   * @function
   * @param {Object} features Objeto geográfico.
   * @param {Object} layer Capa.
   * @param {Object} evt Evento.
   * @api
   */
  leaveFeatures_(features, layer, evt) {
    this.prevHoverFeatures_[layer.name] =
      this.prevHoverFeatures_[layer.name].filter(pf => !features.some(f => f.equals(pf)));
    layer.fire(EventType.LEAVE_FEATURES, [features, evt.coord]);
    this.getImpl().removeCursorPointer(evt);
  }

  /**
   * Este método se encarga de activar el evento.
   *
   * @public
   * @function
   * @api
   * @export
   */
  activate() {
    if (this.activated_ === false) {
      this.activated_ = true;
      this.fire(EventType.ACTIVATED);
    }
  }

  /**
   * Este método se encarga de desactivar el evento.
   *
   * @public
   * @function
   * @api
   * @export
   */
  deactivate() {
    if (this.activated_ === true) {
      this.activated_ = false;
      this.fire(EventType.DEACTIVATED);
    }
  }

  /**
   * Este método se encarga de añadir a la capa.
   *
   * @public
   * @function
   * @param {M.layer} layer Capa.
   * @api
   * @export
   */
  addLayer(layer) {
    if (!includes(this.layers_, layer)) {
      this.layers_.push(layer);
      this.prevSelectedFeatures_[layer.name] = [];
      this.prevHoverFeatures_[layer.name] = [];
    }
  }

  /**
   * Este método se encarga de eliminar la capa.
   *
   * @public
   * @function
   * @param {M.layer} layer Capa.
   * @api
   * @export
   */
  removeLayer(layer) {
    this.layers_ = this.layers_.filter(layer2 => !layer2.equals(layer));
    this.prevSelectedFeatures_[layer.name] = null;
    this.prevHoverFeatures_[layer.name] = null;
    delete this.prevSelectedFeatures_[layer.name];
    delete this.prevHoverFeatures_[layer.name];
  }

  /**
   * Elimina los eventos.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @function
   * @api
   * @export
   */
  destroy() {
    // TODO
    // this.getImpl().destroy();
    // this.fire(M.evt.DESTROY);
  }

  /**
   * Elimina la selección de objetos geográficos.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @function
   * @api
   */
  clearSelectedFeatures() {
    Object.keys(this.prevSelectedFeatures_).forEach((key) => {
      this.prevSelectedFeatures_[key] = [];
    });
  }

  /**
   * Elimina el hover sobre objetos geográficos.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @function
   * @api
   */
  clearHoverFeatures() {
    Object.keys(this.prevHoverFeatures_).forEach((key) => { this.prevHoverFeatures_[key] = []; });
  }
}

export default Features;
