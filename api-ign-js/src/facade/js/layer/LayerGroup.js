/**
 * @module M/layer/LayerGroup
 */

import LayerGroupImpl from 'impl/layer/LayerGroup';
import LayerBase from './Layer';
import * as parameter from '../parameter/parameter';
import * as LayerType from './Type';

/**
 * @classdesc
 * Represents a group of layers, of any type. If a group is already added to a Map,
 * layers added to that group are automatically added to the map, and layers
 * removed from the group, are automatically removed from the map. Elements inside the group
 * are considered children of that group.
 * @constructor
 * @extends {M.facade.Base}
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @api
 */
class LayerGroup extends LayerBase {
  constructor(userParameters, options = {}, vendorOptions = {}) {
    const parameters = parameter.layer(userParameters, LayerType.LayerGroup);

    // ! Parámetros definifos en super en impl
    const opt = options;
    opt.visibility = userParameters.visibility;
    opt.maxExtent = userParameters.maxExtent;

    /**
     * Implementation of this layer
     * @public
     * @type {M.impl.layer.LayerGroup}
     */
    const impl = new LayerGroupImpl(parameters, opt, vendorOptions);
    super(parameters, impl);

    this.layers = parameters.layers;
  }

  /**
   * Sets the visibility for the LayerGroup and all of its layers.
   *
   * @function
   * @param {boolean} visibility Visibility to set
   * @api
   */
  setVisible(visibility) {
    this.getImpl().setVisible(visibility);
  }

  /**
   * Deletes children from the group
   *
   * @function
   * @param {Array<M.LayerBase|M.LayerGroup>}  children children to delete
   * @api
   */
  removeLayers(layers = []) {
    let arrLayers = layers;
    if (!Array.isArray(arrLayers)) {
      arrLayers = [arrLayers];
    }

    arrLayers.forEach((layer) => {
      if (!layer.getImpl().isWMSfull) {
        this.getImpl().removeLayer(layer);
      } else {
        layer.getImpl().getWMSFullLayers.then((layersWMSFull) => {
          layersWMSFull.forEach((l) => {
            this.getImpl().removeLayer(l);
          });
        });
      }
    });

    // ! Se actualiza this.layers
    this.layers = this.getLayers();
  }

  /**
   * Moves a child out of a group, to the root level
   * of the toc
   * @function
   * @param {M.LayerBase|M.LayerGroup} child
   * @api
   */
  ungroup(layers) {
    let arrLayers = layers;
    if (!Array.isArray(arrLayers)) {
      arrLayers = [arrLayers];
    }

    arrLayers.forEach((layer) => {
      this.getImpl().ungroup(layer);
    });

    // ! ¿? Se actualiza this.layers
  }

  /**
   * Adds children to the group
   *
   * @function
   * @param {Array<M.LayerBase|M.LayerGroup>}  children
   * @api
   */
  addLayers(layers = []) {
    let arrLayers = layers;
    if (!Array.isArray(arrLayers)) {
      arrLayers = [arrLayers];
    }

    arrLayers.forEach((layer) => {
      this.getImpl().addLayer(layer);
    });

    // ! Se actualiza this.layers
    this.layers = this.getLayers();
  }

  getLayers() {
    return this.getImpl().getLayers();
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
