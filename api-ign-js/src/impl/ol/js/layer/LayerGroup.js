/**
 * @module M/impl/layer/LayerGroup
 */
import * as EventType from 'M/event/eventtype';
import { isNullOrEmpty } from 'M/util/Utils';
import { Group } from 'ol/layer';
import { Collection } from 'ol';

import Layer from './Layer';

/**
 * @classdesc
 * @api
 */

class LayerGroup extends Layer {
  constructor(userParameters, options = {}, vendorOptions = {}) {
    super(options, vendorOptions);

    this.options_ = options;
    this.layersParams_ = userParameters.layers || [];

    this.layersCollection = new Collection();
    this.layers = [];
    this.rootGroup = null;
  }

  /**
   * Este método agrega la capa al mapa.
   *
   * @public
   * @function
   * @param {M.impl.Map} map Mapa de la implementación.
   * @api stable
   */
  addTo(map, addLayer = true) {
    this.map = map;

    this.ol3Layer = new Group(this.getParamsGroup_());
    this.ol3Layer.setLayers(this.layersCollection);

    this.fire(EventType.ADDED_TO_MAP);

    if (addLayer) {
      this.map.getMapImpl().addLayer(this.ol3Layer);
    }

    this.layersParams_.forEach((layer) => {
      if (typeof layer === 'string') {
        const layerAPI = this.map.getLayerByString(layer);
        this.addLayer(layerAPI);
      } else {
        this.addLayer(layer);
      }
    });

    this.ol3Layer.on('change:zIndex', () => {
      this.layers.forEach((layer, i) => {
        layer.setZIndex(this.ol3Layer.getZIndex() - i - 1);
      });
    });
  }

  getParamsGroup_() {
    return {
      opacity: this.opacity,
      visible: this.visibility,
      extent: this.userMaxExtent,
      // ! Valores de Options (Segundo Objeto)
      minResolution: this.options_.minResolution,
      maxResolution: this.options_.maxResolution,
      minZoom: this.options_.minZoom,
      maxZoom: this.options_.maxZoom,
    };
  }

  setOLLayerToLayer_(layer) {
    layer.setMap(this.map);
    layer.getImpl().addTo(this.map, false);
  }

  /**
   * Este método establece la visibilidad de la capa.
   *
   * @function
   * @param {boolean} visibility Verdadero para capa visible, falso no lo es.
   * @public
   * @api
   */
  setVisible(visibility) {
    // ! [] REFACTORIZACION AÑADIR A LAYERS ¿?¿?¿???
    this.visibility = visibility;
    // if this layer is base then it hides all base layers
    if ((visibility === true) && (this.transparent !== true)) {
      // hides all base layers
      this.map.getBaseLayers().forEach((layer) => {
        if (!layer.equals(this.facadeLayer_) && layer.isVisible()) {
          layer.setVisible(false);
        }
      });

      // set this layer visible
      if (!isNullOrEmpty(this.ol3Layer)) {
        this.ol3Layer.setVisible(visibility);
      }

      // updates resolutions and keep the bbox
      this.map.getImpl().updateResolutionsFromBaseLayer();
    } else if (!isNullOrEmpty(this.ol3Layer)) {
      this.ol3Layer.setVisible(visibility);
    }
  }

  addLayer(layer) {
    // ! Si esta añadida al mapa la tengo que eliminar
    // ! VER LO QUE HACE OL

    if (!this.layers.includes(layer)) {
      this.setOLLayerToLayer_(layer);
      const impl = layer.getImpl();

      this.addRootLayerGroup(impl);
      this.layers.push(layer);

      this.layersCollection.push(impl.getOL3Layer());
    }
  }

  addRootLayerGroup(layerGroup) {
    const layerGroupImpl = layerGroup;
    if (layerGroup instanceof LayerGroup) {
      layerGroupImpl.rootGroup = this;
    }
  }

  removeLayer(layer) {
    this.removeLayers_(layer);
    this.layersCollection.remove(layer.getImpl().getOL3Layer());
  }

  removeLayers_(layer) {
    // ? Elimina las capas de this.layers para poder devolverlas
    // ? en el getLayers
    const id = layer.getImpl().ol3Layer.ol_uid;
    this.layers = this.layers.filter((l) => l.getImpl().ol3Layer.ol_uid !== id);
  }

  ungroup(layer) {
    if (layer.getImpl().rootGroup === null) {
      return;
    }

    this.removeLayers_(layer);

    const layerOl = layer.getImpl().ol3Layer;
    const remove = this.layersCollection.remove(layerOl);

    if (this.rootGroup !== null) {
      this.setRootGroup_(layer);
      this.rootGroup.layers.push(layer);
      this.rootGroup.layersCollection.push(remove);
    } else {
      this.setRootGroup_(layer);
      // eslint-disable-next-line no-underscore-dangle
      this.map.getImpl().layers_.push(layer);
      this.map.getMapImpl().addLayer(remove);
    }
  }

  setRootGroup_(layer) {
    const facadeLayer = layer;

    if (facadeLayer.getImpl() instanceof LayerGroup) {
      facadeLayer.getImpl().rootGroup = this.rootGroup;
    }
  }

  getLayers() {
    // ? TODO ¿?
    // ? Se ordena por zIndex, reverse por -1 en zIndex
    return this.layers.reverse();
  }

  destroy() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;

      // eslint-disable-next-line no-underscore-dangle
      this.map.getImpl().layers_ = this.map.getImpl().layers_.filter((l) => this.name !== l.name);
    }
    this.map = null;
  }

  equals(obj) {
    let equals = false;
    if (obj instanceof LayerGroup) {
      equals = equals && (this.name === obj.name);
    }

    return equals;
  }
}

export default LayerGroup;
