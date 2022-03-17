import OLMap from 'ol/Map';
import { get as getProj, transform } from 'ol/proj';
import OLProjection from 'ol/proj/Projection';
import OLInteraction from 'ol/interaction/Interaction';
import MObject from 'M/Object';
import FacadePanzoombar from 'M/control/Panzoombar';
import * as LayerType from 'M/layer/Type';
import 'impl-assets/css/ol';
import 'impl-assets/css/custom';
import Control from 'M/control/Control';
import FacadeWMS from 'M/layer/WMS';
import * as EventType from 'M/event/eventtype';
import LayerBase from 'M/layer/Layer';
import Exception from 'M/exception/exception';
import { getValue } from 'M/i18n/language';
import {
  isNullOrEmpty,
  isArray,
  isString,
  isObject,
  includes,
  getScaleFromResolution,
  // fillResolutions,
  // generateResolutionsFromExtent,
} from 'M/util/Utils';
import 'patches';
import ImplUtils from './util/Utils';
import View from './View';

/**
 * @module M/impl/Map
 */
class Map extends MObject {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Map
   * with the specified div
   *
   * @constructor
   * @extends {M.Object}
   * @param {Object} div
   * @param {Mx.parameters.MapOptions} options
   * @api stable
   */
  constructor(div, facadeMap, options = {}) {
    super();
    /**
     * Facade map to implement
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = facadeMap;

    /**
     * Layers added to the map
     * @private
     * @type {ol.Collection<M.Layer>}
     */
    this.layers_ = [];

    /**
     * Groups added to the map
     * @private
     * @type {Array<M.layer.Group>}
     */
    this.layerGroups_ = [];

    /**
     * Controls added to the map
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Flag to indicate if the initial zoom was calculated
     * @private
     * @type {Boolean}
     */
    this.initZoom_ = true;

    /**
     * Resolutions specified by the user
     * @private
     * @type {Array<Number>}
     */
    this.userResolutions_ = null;

    /**
     * Bbox specified by the user
     * @private
     * @type {Mx.Extent}
     */
    this.userBbox_ = null;

    /**
     * MaxExtent specified by the user
     * @private
     * @type {Mx.Extent}
     */
    this.maxExtentForResolutions_ = null;

    /**
     * calculated envolved maxExtent
     * @private
     * @type {Mx.Extent}
     */
    this.envolvedMaxExtent_ = null;

    /**
     * calculated resolutions
     * @private
     * @type {Boolean}
     */
    this._calculatedResolutions = false;

    /**
     * calculated resolution form envolved extent
     * @private
     * @type {Boolean}
     */
    this._resolutionsEnvolvedExtent = false;

    /**
     * calculated resolution form base layer
     * @private
     * @type {Boolean}
     */
    this._resolutionsBaseLayer = false;

    // gets the renderer
    // let renderer = ol.renderer.Type.CANVAS;
    // if (!isNullOrEmpty(this.options_.renderer)) {
    //   renderer = this.options_.renderer;
    // }

    /**
     * Implementation of this map
     * @private
     * @type {ol.Map}
     */
    this.map_ = new OLMap({
      controls: [],
      target: div.id,
      // renderer,
      view: new View(),
    });
    this.map_.getView().setConstrainResolution(true);
    this.facadeMap_.on(EventType.COMPLETED, () => {
      this.map_.updateSize();
    });
    this.map_.on('singleclick', this.onMapClick_.bind(this));
    this.map_.addInteraction(new OLInteraction({
      handleEvent: (e) => {
        if (e.type === 'pointermove') {
          this.onMapMove_(e);
        }
        return true;
      },
    }));
  }
  /**
   * This function gets the layers added to the map
   *
   * @public
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.Layer>} layers from the map
   * @api stable
   */
  getLayers(filters) {
    const kmlLayers = this.getKML(filters);
    const wmsLayers = this.getWMS(filters);
    const wfsLayers = this.getWFS(filters);
    const wmtsLayers = this.getWMTS(filters);
    const mvtLayers = this.getMVT(filters);
    const mbtilesLayers = this.getMBTiles(filters);
    const mbtilesVectorLayers = this.getMBTilesVector(filters);
    const xyzLayers = this.getXYZs(filters);
    const tmsLayers = this.getTMS(filters);
    const unknowLayers = this.getUnknowLayers_(filters);

    return kmlLayers.concat(wmsLayers).concat(wfsLayers)
      .concat(wmtsLayers)
      .concat(mvtLayers)
      .concat(mbtilesLayers)
      .concat(mbtilesVectorLayers)
      .concat(xyzLayers)
      .concat(tmsLayers)
      .concat(unknowLayers);
  }

  /**
   * This function gets the layers added to the map
   *
   * @public
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.Layer>} layers from the map
   * @api stable
   */
  getBaseLayers() {
    const baseLayers = this.getLayers().filter((layer) => {
      let isBaseLayer = false;
      if ((layer.type === LayerType.WMS) ||
        (layer.type === LayerType.WMTS)) {
        isBaseLayer = (layer.transparent !== true);
      }
      return isBaseLayer;
    });
    return baseLayers;
  }

  /**
   * This function adds layers specified by the user
   *
   * @public
   * @function
   * @param {Array<Object>} layers
   * @returns {Map}
   */
  addLayers(layers) {
    let layersRec = layers;

    if (isNullOrEmpty(layersRec)) {
      layersRec = [];
    }

    if (!isArray(layersRec)) {
      layersRec = [layersRec];
    }

    if (layersRec.length === 0) {
      return this;
    }

    layersRec.forEach((layer) => {
      if (layer.type === LayerType.WMS) {
        this.facadeMap_.addWMS(layer);
      } else if (layer.type === LayerType.WMTS) {
        this.facadeMap_.addWMTS(layer);
      } else if (layer.type === LayerType.KML) {
        this.facadeMap_.addKML(layer);
      } else if (layer.type === LayerType.WFS) {
        this.facadeMap_.addWFS(layer);
      } else if (layer.type === LayerType.MVT) {
        this.facadeMap_.addMVT(layer);
      } else if (layer.type === LayerType.MBTiles) {
        this.facadeMap_.addMBTiles(layer);
      } else if (layer.type === LayerType.MBTilesVector) {
        this.facadeMap_.addMBTilesVector(layer);
      } else if (layer.type === LayerType.XYZ) {
        this.facadeMap_.addXYZ(layer);
      } else if (layer.type === LayerType.TMS) {
        this.facadeMap_.addTMS(layer);
      } else if (!LayerType.know(layer.type)) {
        this.addUnknowLayers_([layer]);
      }
    });

    return this;
  }


  /**
   * This function removes the layers from the map
   *
   * @function
   * @param {Array<Object>} layers to remove
   * @returns {Map}
   * @api stable
   */
  removeLayers(layers) {
    // gets the layers with type defined and undefined
    const unknowLayers = layers.filter((layer) => {
      return !LayerType.know(layer.type);
    });
    const knowLayers = layers.filter((layer) => {
      return LayerType.know(layer.type);
    });

    if (knowLayers.length > 0) {
      this.removeKML(knowLayers);
      this.removeWMS(knowLayers);
      this.removeWFS(knowLayers);
      this.removeWMTS(knowLayers);
      this.removeMVT(knowLayers);
      this.removeMBTiles(knowLayers);
      this.removeXYZ(knowLayers);
      this.removeTMS(knowLayers);
    }

    if (unknowLayers.length > 0) {
      this.removeUnknowLayers_(unknowLayers);
    }

    return this;
  }

  /**
   * This function gets the KML layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.KML>} layers from the map
   * @api stable
   */
  getKML(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;

    // get all kmlLayers
    const kmlLayers = this.layers_.filter((layer) => {
      return (layer.type === LayerType.KML);
    });

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = kmlLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredKMLLayers = kmlLayers.filter((kmlLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(kmlLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === kmlLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === kmlLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === kmlLayer.name));
            }
            // extract
            if (!isNullOrEmpty(filterLayer.extract)) {
              layerMatched = (layerMatched && (filterLayer.extract === kmlLayer.extract));
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredKMLLayers);
      }, this);
    }
    return foundLayers;
  }

  /**
   * This function adds the KML layers to the map
   *
   * @function
   * @param {Array<M.layer.KML>} layers
   * @returns {Map}
   * @api stable
   */
  addKML(layers) {
    const existsBaseLayer = this.getBaseLayers().length > 0;

    layers.forEach((layer) => {
      // checks if layer is WMC and was added to the map
      if (layer.type === LayerType.KML) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          if (layer.getZIndex() == null) {
            const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.KML];
            layer.setZIndex(zIndex);
          }
          if (!existsBaseLayer) {
            this.updateResolutionsFromBaseLayer();
          }
        }
      }
    }, this);

    return this;
  }

  /**
   * This function removes the KML layers to the map
   *
   * @function
   * @param {Array<M.layer.KML>} layers
   * @returns {Map}
   * @api stable
   */
  removeKML(layers) {
    const kmlMapLayers = this.getKML(layers);
    kmlMapLayers.forEach((kmlLayer) => {
      this.layers_ = this.layers_.filter(layer => !kmlLayer.equals(layer));
      kmlLayer.getImpl().destroy();
    }, this);

    return this;
  }

  /**
   * This function gets the WMS layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<FacadeWMS>} layers from the map
   * @api stable
   */
  getWMS(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;

    // get all wmsLayers
    const wmsLayers = this.layers_.filter((layer) => {
      return (layer.type === LayerType.WMS);
    });

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wmsLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredWMSLayers = wmsLayers.filter((wmsLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wmsLayer)) {
            // if instanceof FacadeWMS check if it is the same
            if (filterLayer instanceof FacadeWMS) {
              layerMatched = (filterLayer === wmsLayer);
            } else {
              // type
              if (!isNullOrEmpty(filterLayer.type)) {
                layerMatched = (layerMatched && (filterLayer.type === wmsLayer.type));
              }
              // URL
              if (!isNullOrEmpty(filterLayer.url)) {
                layerMatched = (layerMatched && (filterLayer.url === wmsLayer.url));
              }
              // name
              if (!isNullOrEmpty(filterLayer.name)) {
                layerMatched = (layerMatched && (filterLayer.name === wmsLayer.name));
              }
              // legend
              if (!isNullOrEmpty(filterLayer.legend)) {
                layerMatched = (layerMatched && (filterLayer.legend === wmsLayer.legend));
              }
              // transparent
              if (!isNullOrEmpty(filterLayer.transparent)) {
                layerMatched = (layerMatched && (filterLayer.transparent === wmsLayer.transparent));
              }
              // tiled
              if (!isNullOrEmpty(filterLayer.tiled)) {
                layerMatched = (layerMatched && (filterLayer.tiled === wmsLayer.tiled));
              }
              // cql
              if (!isNullOrEmpty(filterLayer.cql)) {
                layerMatched = (layerMatched && (filterLayer.cql === wmsLayer.cql));
              }
              // version
              if (!isNullOrEmpty(filterLayer.version)) {
                layerMatched = (layerMatched && (filterLayer.version === wmsLayer.version));
              }
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredWMSLayers);
      }, this);
    }
    return foundLayers;
  }

  /**
   * This function adds the WMS layers to the map
   *
   * @function
   * @param {Array<FacadeWMS>} layers
   * @returns {Map}
   * @api stable
   */
  addWMS(layers) {
    // cehcks if exists a base layer
    const baseLayers = this.getBaseLayers();
    let existsBaseLayer = (baseLayers.length > 0);

    const addedLayers = [];
    layers.forEach((layer) => {
      // checks if layer is WMC and was added to the map
      if (layer.type === LayerType.WMS) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          addedLayers.push(layer);

          /* if the layer is a base layer then
          sets its visibility */
          if (layer.transparent !== true) {
            layer.setVisible(!existsBaseLayer);
            existsBaseLayer = true;
            layer.setZIndex(Map.Z_INDEX_BASELAYER);
          } else if (layer.getZIndex() == null) {
            const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.WMS];
            layer.setZIndex(zIndex);
          }
        }
      }
    });
    // calculate resolutions if layers were added and there is not any base layer
    // or if some base layer was added
    const calculateResolutions = (addedLayers.length > 0 && !existsBaseLayer) ||
      addedLayers.some(l => l.transparent !== true && l.isVisible());
    if (calculateResolutions) {
      this.updateResolutionsFromBaseLayer();
    }
    return this;
  }

  /**
   * This function removes the WMS layers to the map
   *
   * @function
   * @param {Array<FacadeWMS>} layers
   * @returns {Map}
   * @api stable
   */
  removeWMS(layers) {
    const wmsMapLayers = this.getWMS(layers);
    wmsMapLayers.forEach((wmsLayer) => {
      this.layers_ = this.layers_.filter(layer => !wmsLayer.equals(layer));
      wmsLayer.getImpl().destroy();
    });

    return this;
  }

  /**
   * This function gets the GeoJSON layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.WFS>} layers from the map
   * @api stable
   */
  getGeoJSON(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;

    // get all geojsonLayers
    const geojsonLayers = this.layers_.filter((layer) => {
      return (layer.type === LayerType.GeoJSON);
    });

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = geojsonLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredWFSLayers = geojsonLayers.filter((geojsonLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(geojsonLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === geojsonLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === geojsonLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === geojsonLayer.name));
            }
            // legend
            if (!isNullOrEmpty(filterLayer.legend)) {
              layerMatched = (layerMatched && (filterLayer.legend === geojsonLayer.legend));
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredWFSLayers);
      });
    }
    return foundLayers;
  }

  /**
   * This function gets the WFS layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.WFS>} layers from the map
   * @api stable
   */
  getWFS(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;

    // get all wfsLayers
    const wfsLayers = this.layers_.filter((layer) => {
      return (layer.type === LayerType.WFS);
    });

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wfsLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredWFSLayers = wfsLayers.filter((wfsLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wfsLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === wfsLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === wfsLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === wfsLayer.name));
            }
            // namespace
            if (!isNullOrEmpty(filterLayer.namespace)) {
              layerMatched = (layerMatched && (filterLayer.namespace === wfsLayer.namespace));
            }
            // legend
            if (!isNullOrEmpty(filterLayer.legend)) {
              layerMatched = (layerMatched && (filterLayer.legend === wfsLayer.legend));
            }
            // cql
            if (!isNullOrEmpty(filterLayer.cql)) {
              layerMatched = (layerMatched && (filterLayer.cql === wfsLayer.cql));
            }
            // geometry
            if (!isNullOrEmpty(filterLayer.geometry)) {
              layerMatched = (layerMatched && (filterLayer.geometry === wfsLayer.geometry));
            }
            // ids
            if (!isNullOrEmpty(filterLayer.ids)) {
              layerMatched = (layerMatched && (filterLayer.ids === wfsLayer.ids));
            }
            // version
            if (!isNullOrEmpty(filterLayer.version)) {
              layerMatched = (layerMatched && (filterLayer.version === wfsLayer.version));
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredWFSLayers);
      });
    }
    return foundLayers;
  }

  /**
   * This function adds the WFS layers to the map
   *
   * @function
   * @param {Array<M.layer.WFS>} layers
   * @returns {Map}
   * @api stable
   */
  addWFS(layers) {
    // checks if exists a base layer
    const baseLayers = this.getBaseLayers();
    const existsBaseLayer = (baseLayers.length > 0);

    layers.forEach((layer) => {
      // checks if layer is WFS and was added to the map
      if (layer.type === LayerType.WFS) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          layer.setZIndex(layer.getZIndex());
          if (layer.getZIndex() == null) {
            const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.WFS];
            layer.setZIndex(zIndex);
          }
          if (!existsBaseLayer) {
            this.updateResolutionsFromBaseLayer();
          }
        }
      }
    });

    return this;
  }

  /**
   * This function removes the WFS layers to the map
   *
   * @function
   * @param {Array<M.layer.WFS>} layers
   * @returns {Map}
   * @api stable
   */
  removeWFS(layers) {
    const wfsMapLayers = this.getWFS(layers);
    wfsMapLayers.forEach((wfsLayer) => {
      this.layers_ = this.layers_.filter(layer => !layer.equals(wfsLayer));
      wfsLayer.getImpl().destroy();
    });

    return this;
  }

  /**
   * This function gets the WMTS layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.WMTS>} layers from the map
   * @api stable
   */
  getWMTS(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;

    // get all wmtsLayers
    const wmtsLayers = this.layers_.filter((layer) => {
      return (layer.type === LayerType.WMTS);
    });

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wmtsLayers;
    } else {
      filters.forEach((filterLayer) => {
        // TODO ERROR DE RECURSIVIDAD: let l = map.getLayers(); map.getWMS(l);
        const filteredWMTSLayers = wmtsLayers.filter((wmtsLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wmtsLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === wmtsLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === wmtsLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === wmtsLayer.name));
            }
            // matrixSet
            if (!isNullOrEmpty(filterLayer.matrixSet)) {
              layerMatched = (layerMatched && (filterLayer.matrixSet === wmtsLayer.matrixSet));
            }
            // legend
            if (!isNullOrEmpty(filterLayer.legend)) {
              layerMatched = (layerMatched && (filterLayer.legend === wmtsLayer.legend));
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredWMTSLayers);
      });
    }
    return foundLayers;
  }

  /**
   * This function adds the WMTS layers to the map
   *
   * @function
   * @param {Array<M.layer.WMTS>} layers
   * @returns {Map}
   * @api stable
   */
  addWMTS(layers) {
    // cehcks if exists a base layer
    const baseLayers = this.getBaseLayers();
    let existsBaseLayer = (baseLayers.length > 0);

    layers.forEach((layer) => {
      // checks if layer is WMTS and was added to the map
      if (layer.type === LayerType.WMTS) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          /* if the layer is a base layer then
                 sets its visibility */
          if (layer.transparent !== true) {
            layer.setVisible(!existsBaseLayer);
            existsBaseLayer = true;
            if (layer.isVisible()) {
              this.updateResolutionsFromBaseLayer();
            }
            layer.setZIndex(Map.Z_INDEX_BASELAYER);
          } else {
            if (layer.getZIndex() == null) {
              const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.WMTS];
              layer.setZIndex(zIndex);
            }

            // recalculates resolution if there are not
            // any base layer
            if (!existsBaseLayer) {
              this.updateResolutionsFromBaseLayer();
            }
          }
        }
      }
    });
    return this;
  }

  /**
   * This function removes the WMTS layers to the map
   *
   * @function
   * @param {Array<M.layer.WMTS>} layers
   * @returns {Map}
   * @api stable
   */
  removeWMTS(layers) {
    const wmtsMapLayers = this.getWMTS(layers);
    wmtsMapLayers.forEach((wmtsLayer) => {
      this.layers_ = this.layers_.filter(layer => !layer.equals(wmtsLayer));
      wmtsLayer.getImpl().destroy();
    });

    return this;
  }

  /**
   * This function gets the MBtiles layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.MBtiles>} layers from the map
   * @api stable
   */
  getMBTiles(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;

    const allLayers = this.layers_;
    const mbtilesLayers = allLayers.filter((layer) => {
      return (layer.type === LayerType.MBTiles);
    });

    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = mbtilesLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredMBTilesLayers = mbtilesLayers.filter((mbtileLayer) => {
          let layerMatched = true;
          if (!foundLayers.includes(mbtileLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === mbtileLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === mbtileLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === mbtileLayer.name));
            }
            // legend
            if (!isNullOrEmpty(filterLayer.legend)) {
              layerMatched = (layerMatched && (filterLayer.legend === mbtileLayer.legend));
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredMBTilesLayers);
      });
    }
    return foundLayers;
  }

  /**
   * This function adds the MBtiles layers to the map
   *
   * @function
   * @param {Array<M.layer.MBtiles>} layers
   * @returns {Map}
   * @api stable
   */
  addMBTiles(layers) {
    const baseLayers = this.getBaseLayers();
    const existsBaseLayer = (baseLayers.length > 0);

    layers.forEach((layer) => {
      // checks if layer is WFS and was added to the map
      if (layer.type === LayerType.MBTiles) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          layer.setZIndex(layer.getZIndex());
          if (layer.getZIndex() == null) {
            const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.MBTiles];
            layer.setZIndex(zIndex);
          }
          if (!existsBaseLayer) {
            this.updateResolutionsFromBaseLayer();
          }
        }
      }
    });

    return this;
  }

  /**
   * This function removes the MBtiles layers to the map
   *
   * @function
   * @param {Array<M.layer.MBtiles>} layers
   * @returns {Map}
   * @api stable
   */
  removeMBTiles(layers) {
    const mbtilesMapLayers = this.getMBTiles(layers);
    mbtilesMapLayers.forEach((mbtilesLayer) => {
      this.layers_ = this.layers_.filter(layer => !layer.equals(mbtilesLayer));
      mbtilesLayer.getImpl().destroy();
      mbtilesLayer.fire(EventType.REMOVED_FROM_MAP, [mbtilesLayer]);
    });

    return this;
  }

  /**
   * This function gets the MBtiles layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.MBtiles>} layers from the map
   * @api stable
   */
  getMBTilesVector(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;
    const allLayers = this.layers_;
    const mbtilesLayers = allLayers.filter((layer) => {
      return (layer.type === LayerType.MBTilesVector);
    });
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }
    if (filters.length === 0) {
      foundLayers = mbtilesLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredMBTilesLayers = mbtilesLayers.filter((mbtileLayer) => {
          let layerMatched = true;
          if (!foundLayers.includes(mbtileLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === mbtileLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === mbtileLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === mbtileLayer.name));
            }
            // legend
            if (!isNullOrEmpty(filterLayer.legend)) {
              layerMatched = (layerMatched && (filterLayer.legend === mbtileLayer.legend));
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredMBTilesLayers);
      });
    }
    return foundLayers;
  }
  /**
   * This function adds the MBtiles layers to the map
   *
   * @function
   * @param {Array<M.layer.MBtiles>} layers
   * @returns {Map}
   * @api stable
   */
  addMBTilesVector(layers) {
    const baseLayers = this.getBaseLayers();
    const existsBaseLayer = (baseLayers.length > 0);
    layers.forEach((layer) => {
      // checks if layer is WFS and was added to the map
      if (layer.type === LayerType.MBTilesVector) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          layer.setZIndex(layer.getZIndex());
          if (layer.getZIndex() == null) {
            const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.MBTilesVector];
            layer.setZIndex(zIndex);
          }
          if (!existsBaseLayer) {
            this.updateResolutionsFromBaseLayer();
          }
        }
      }
    });
    return this;
  }
  /**
   * This function removes the MBtiles layers to the map
   *
   * @function
   * @param {Array<M.layer.MBtiles>} layers
   * @returns {Map}
   * @api stable
   */
  removeMBTilesVector(layers) {
    const mbtilesMapLayers = this.getMBTilesVector(layers);
    mbtilesMapLayers.forEach((mbtilesLayer) => {
      this.layers_ = this.layers_.filter(layer => !layer.equals(mbtilesLayer));
      mbtilesLayer.getImpl().destroy();
      mbtilesLayer.fire(EventType.REMOVED_FROM_MAP, [mbtilesLayer]);
    });
    return this;
  }

  /**
   * This function gets the WMS layers added to the map
   *
   * @private
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<FacadeWMS>} layers from the map
   */
  getUnknowLayers_(filters) {
    let foundLayers = [];
    let filtersVar = filters;

    // get all wmsLayers
    const unknowLayers = this.layers_.filter((layer) => {
      return !LayerType.know(layer.type);
    });

    // parse to Array
    if (isNullOrEmpty(filtersVar)) {
      filtersVar = [];
    }
    if (!isArray(filtersVar)) {
      filtersVar = [filtersVar];
    }

    if (filtersVar.length === 0) {
      foundLayers = unknowLayers;
    } else {
      filtersVar.forEach((filterLayer) => {
        const filteredUnknowLayers = unknowLayers.filter((unknowLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(unknowLayer)) {
            // if instanceof FacadeWMS check if it is the same
            if (filterLayer instanceof LayerBase) {
              layerMatched = filterLayer.equals(unknowLayer);
            } else {
              // type
              if (!isNullOrEmpty(filterLayer.type)) {
                layerMatched = (layerMatched && (filterLayer.type === unknowLayer.type));
              }
              // name
              if (!isNullOrEmpty(filterLayer.name)) {
                layerMatched = (layerMatched && (filterLayer.name === unknowLayer.name));
              }
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredUnknowLayers);
      });
    }
    return foundLayers;
  }

  /**
   * This function adds layers specified by the user
   *
   * @private
   * @function
   * @param {Array<Object>} layers
   * @returns {Map}
   */
  addUnknowLayers_(layers) {
    // cehcks if exists a base layer
    let existsBaseLayer = this.getBaseLayers().length > 0;

    // adds layers
    layers.forEach((layer) => {
      if (!includes(this.layers_, layer)) {
        layer.getImpl().addTo(this.facadeMap_);
        this.layers_.push(layer);

        /* if the layer is a base layer then
        sets its visibility */
        if (layer.transparent !== true) {
          layer.setVisible(!existsBaseLayer);
          existsBaseLayer = true;
          if (layer.isVisible()) {
            this.updateResolutionsFromBaseLayer();
          }
          layer.setZIndex(Map.Z_INDEX_BASELAYER);
        } else {
          layer.setZIndex(layer.getZIndex());
          if (layer.getZIndex() == null) {
            const zIndex = this.layers_.length + Map.Z_INDEX[layer.type];
            layer.setZIndex(zIndex);
          }
          // recalculates resolution if there are not
          // any base layer
          if (!existsBaseLayer) {
            this.updateResolutionsFromBaseLayer();
          }
        }
      }
    });

    return this;
  }

  /**
   * This function removes the layers from the map
   *
   * @private
   * @function
   * @param {Array<Object>} layers to remove
   * @returns {Map}
   */
  removeUnknowLayers_(layers) {
    // removes unknow layers
    layers.forEach((layer) => {
      if (includes(this.layers_, layer)) {
        this.layers_ = this.layers_.filter(layer2 => !layer2.equals(layer));
        layer.getImpl().destroy();
        if (layer.transparent !== true) {
          // it was base layer so sets the visibility of the first one
          const baseLayers = this.facadeMap_.getBaseLayers();
          if (baseLayers.length > 0) {
            baseLayers[0].setVisible(true);
          }
        }
      }
    });
  }

  /**
   * This function gets the vector tile layers
   *
   * @function
   * @public
   * @api
   */
  getMVT(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;

    const MVTLayers = this.layers_.filter((layer) => {
      return (layer.type === LayerType.MVT);
    });

    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = MVTLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredMVTLayers = MVTLayers.filter((mvtLayer) => {
          let layerMatched = true;
          if (!foundLayers.includes(mvtLayer)) {
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === mvtLayer.type));
            }
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === mvtLayer.url));
            }
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === mvtLayer.name));
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredMVTLayers);
      });
    }
    return foundLayers;
  }

  /**
   * This function removes the vector tile layers from map.
   *
   * @function
   * @public
   * @api
   */
  removeMVT(layers) {
    const mvtLayers = this.getMVT(layers);
    mvtLayers.forEach((mvtLayer) => {
      this.layers_ = this.layers_.filter(layer => !layer.equals(mvtLayer));
      mvtLayer.getImpl().destroy();
      mvtLayer.fire(EventType.REMOVED_FROM_MAP, [mvtLayer]);
    });

    return this;
  }

  /**
   * This function adds the vector tile layers
   *
   * @function
   * @public
   * @api
   */
  addMVT(layers) {
    const baseLayers = this.getBaseLayers();
    const existsBaseLayer = baseLayers.length > 0;

    layers.forEach((layer) => {
      // checks if layer is WFS and was added to the map
      if (layer.type === LayerType.MVT) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          layer.setZIndex(layer.getZIndex());
          if (layer.getZIndex() == null) {
            const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.MVT];
            layer.setZIndex(zIndex);
          }
          if (!existsBaseLayer) {
            this.updateResolutionsFromBaseLayer();
          }
        }
      }
    });

    return this;
  }

  /**
   * This function gets the XYZ layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.XYZ>} layers from the map
   * @api stable
   */
  getXYZs(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;
    const xyzLayers = this.layers_.filter(layer => layer.type === LayerType.XYZ);

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = xyzLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredXYZLayers = xyzLayers.filter((xyzLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(xyzLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === xyzLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === xyzLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === xyzLayer.name));
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredXYZLayers);
      });
    }
    return foundLayers;
  }

  /**
   * This function adds the XYZ layers to the map
   *
   * @function
   * @param {Array<M.layer.XYZ>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  addXYZ(layers) {
    layers.forEach((layer) => {
      // checks if layer is XYZ and was added to the map
      if (layer.type === LayerType.XYZ) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.XYZ];
          layer.getImpl().setZIndex(zIndex);
        }
      }
    });
    return this;
  }

  /**
   * This function removes the XYZ layers to the map
   *
   * @function
   * @param {Array<M.layer.XYZ>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  removeXYZ(layers) {
    const xyzMapLayers = this.getXYZs(layers);
    xyzMapLayers.forEach((xyzLayer) => {
      xyzLayer.getImpl().destroy();
      this.layers_ = this.layers_.filter(layer => !layer.equals(xyzLayer));
    });

    return this;
  }

  /**
   * This function gets the TMS layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.TMS>} layers from the map
   * @api stable
   */
  getTMS(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;
    const tmsLayers = this.layers_.filter(layer => layer.type === LayerType.TMS);

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = tmsLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredTMSLayers = tmsLayers.filter((tmsLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(tmsLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === tmsLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === tmsLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === tmsLayer.name));
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredTMSLayers);
      });
    }
    return foundLayers;
  }

  /**
   * This function adds the TMS layers to the map
   *
   * @function
   * @param {Array<M.layer.TMS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  addTMS(layers) {
    layers.forEach((layer) => {
      // checks if layer is TMS and was added to the map
      if (layer.type === LayerType.TMS) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.TMS];
          layer.getImpl().setZIndex(zIndex);
        }
      }
    });
    return this;
  }

  /**
   * This function removes the TMS layers to the map
   *
   * @function
   * @param {Array<M.layer.TMS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  removeTMS(layers) {
    const tmsMapLayers = this.getTMS(layers);
    tmsMapLayers.forEach((tmsLayer) => {
      tmsLayer.getImpl().destroy();
      this.layers_ = this.layers_.filter(layer => !layer.equals(tmsLayer));
    });

    return this;
  }


  /**
   * This function adds controls specified by the user
   *
   * @public
   * @function
   * @param {string|Array<String>} filters
   * @returns {Array<M.Control>}
   * @api stable
   */
  getControls(filters) {
    let filtersVar = filters;
    let foundControls = [];

    let panelControls = this.facadeMap_.getPanels().map(p => p.getControls());
    if (panelControls.length > 0) {
      panelControls = panelControls.reduce((acc, controls) => acc.concat(controls));
    }
    const controlsToSearch = this.controls_.concat(panelControls);
    // parse to Array
    if (isNullOrEmpty(filtersVar)) {
      filtersVar = [];
    }
    if (!isArray(filtersVar)) {
      filtersVar = [filtersVar];
    }
    if (filtersVar.length === 0) {
      foundControls = controlsToSearch;
    } else {
      filtersVar.forEach((filterControl) => {
        foundControls = foundControls.concat(controlsToSearch.filter((control) => {
          let controlMatched = false;

          if (!includes(foundControls, control)) {
            if (isString(filterControl)) {
              controlMatched = (filterControl === control.name);
            } else if (filterControl instanceof Control) {
              controlMatched = (filterControl === control);
            } else if (isObject(filterControl)) {
              controlMatched = (filterControl.name === control.name);
            }
          }
          return controlMatched;
        }));
      });
    }
    const nonRepeatFoundControls = [];
    foundControls.forEach((control) => {
      const controlNames = nonRepeatFoundControls.map(c => c.name);
      if (!controlNames.includes(control.name)) {
        nonRepeatFoundControls.push(control);
      }
    });
    return nonRepeatFoundControls;
  }

  /**
   * This function adds controls specified by the user
   *
   * @public
   * @function
   * @param {M.Control} controls
   * @returns {Map}
   * @api stable
   */
  addControls(controls) {
    controls.forEach((control) => {
      if (control instanceof FacadePanzoombar) {
        this.facadeMap_.addControls(M.config.controls.default.split(','));
      }
      if (!includes(this.controls_, control)) {
        this.controls_.push(control);
      }
    });

    return this;
  }

  /**
   * This function removes the controls from the map
   *
   * @function
   * @param {String|Array<String>} layers
   * @returns {Map}
   * @api stable
   */
  removeControls(controls) {
    const mapControls = this.getControls(controls);
    mapControls.forEach((control) => {
      control.destroy();
      this.controls_ = this.controls_.filter((control2) => {
        let equals = control2.constructor === control.constructor;
        if (!isNullOrEmpty(control2.equals)) {
          equals = !control2.equals(control);
        }
        return equals;
      });
    });
    return this;
  }

  /**
   * This function sets the maximum extent for this
   * map instance
   *
   * @public
   * @function
   * @param {Mx.Extent} maxExtent the extent max
   * @param {Boolean} zoomToExtent - Set bbox
   * @returns {Map}
   * @api stable
   */
  setMaxExtent(maxExtent, zoomToExtent) {
    let olExtent = maxExtent;

    if (!isNullOrEmpty(olExtent) && !isArray(olExtent) && isObject(olExtent)) {
      olExtent = [maxExtent.x.min, maxExtent.y.min, maxExtent.x.max, maxExtent.y.max];
    }

    const olMap = this.getMapImpl();
    const olView = olMap.getView();
    olView.set('extent', olExtent);
    this.updateResolutionsFromBaseLayer();

    if (!isNullOrEmpty(olExtent) && (zoomToExtent !== false)) {
      this.setBbox(olExtent);
    }

    return this;
  }

  /**
   * This function gets the maximum extent for this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Extent}
   * @api stable
   */
  getMaxExtent() {
    let extent;
    const olMap = this.getMapImpl();
    const olExtent = olMap.getView().get('extent');

    if (!isNullOrEmpty(olExtent)) {
      extent = {
        x: {
          min: olExtent[0],
          max: olExtent[2],
        },
        y: {
          min: olExtent[1],
          max: olExtent[3],
        },
      };
    } else {
      extent = this.envolvedMaxExtent_;
    }

    return extent;
  }

  /**
   * This function sets current extent (bbox) for this
   * map instance
   *
   * @public
   * @function
   * @param {Mx.Extent} bbox the bbox
   * @param {Object} vendorOpts vendor options
   * @returns {Map}
   * @api stable
   */
  setBbox(bbox, vendorOpts) {
    // checks if the param is null or empty
    if (isNullOrEmpty(bbox)) {
      Exception(getValue('exception').no_bbox);
    }

    this.userBbox_ = bbox;

    // set the extent by ol
    let extent;
    if (isArray(bbox)) {
      extent = bbox;
    } else if (isObject(bbox)) {
      extent = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
    }
    const olMap = this.getMapImpl();
    olMap.getView().fit(extent, vendorOpts);

    return this;
  }

  /**
   * This function gets the current extent (bbox) of this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Extent}
   * @api stable
   */
  getBbox() {
    let bbox = null;

    const olMap = this.getMapImpl();
    const view = olMap.getView();
    if (!isNullOrEmpty(view.getCenter())) {
      const olExtent = view.calculateExtent(olMap.getSize());

      if (!isNullOrEmpty(olExtent)) {
        bbox = {
          x: {
            min: olExtent[0],
            max: olExtent[2],
          },
          y: {
            min: olExtent[1],
            max: olExtent[3],
          },
        };
      }
    }
    return bbox;
  }

  /**
   * This function sets current zoom for this
   * map instance
   *
   * @public
   * @function
   * @param {Number} zoom the new zoom
   * @returns {Map}
   * @api stable
   */
  setZoom(zoom) {
    // checks if the param is null or empty
    if (isNullOrEmpty(zoom)) {
      Exception(getValue('exception').no_zoom);
    }

    // set the zoom by ol
    this.getMapImpl().getView().setUserZoom(zoom);

    return this;
  }

  /**
   * This function sets current zoom for this
   * map instance
   *
   * @public
   * @function
   * @param {Number} zoom the new zoom
   * @returns {Map}
   * @api stable
   */
  setMinZoom(zoom) {
    if (isNullOrEmpty(zoom)) {
      Exception(getValue('exception').no_zoom);
    }

    this.getMapImpl().getView().setMinZoom(zoom);
    return this;
  }

  /**
   * This function sets current zoom for this
   * map instance
   *
   * @public
   * @function
   * @param {Number} zoom the new zoom
   * @returns {Map}
   * @api stable
   */
  setMaxZoom(zoom) {
    if (isNullOrEmpty(zoom)) {
      Exception(getValue('exception').no_zoom);
    }

    this.getMapImpl().getView().setMaxZoom(zoom);
    return this;
  }

  /**
   * This function gets the current zoom of this
   * map instance
   *
   * @public
   * @function
   * @returns {Number}
   * @api stable
   */
  getZoom() {
    let zoom = null;
    const olView = this.getMapImpl().getView();
    const resolution = olView.getResolution();
    const resolutions = this.getResolutions();
    if (!isNullOrEmpty(resolutions)) {
      for (let i = 0, ilen = resolutions.length; i < ilen; i += 1) {
        if (resolutions[i] <= resolution) {
          zoom = i;
          break;
        }
      }
    } else if (!isNullOrEmpty(resolution)) {
      zoom = olView.getZoomForResolution(resolution);
    }
    return zoom;
  }

  /**
   * @public
   * @function
   * @api
   */
  getMinZoom() {
    let minZoom;
    if (this.getMapImpl() && this.getMapImpl().getView()) {
      minZoom = this.getMapImpl().getView().getMinZoom();
    }
    return minZoom;
  }

  /**
   * @public
   * @function
   * @api
   */
  getMaxZoom() {
    let maxZoom;
    if (this.getMapImpl() && this.getMapImpl().getView()) {
      maxZoom = this.getMapImpl().getView().getMaxZoom();
    }
    return maxZoom;
  }


  /**
   * This function sets current center for this
   * map instance
   *
   * @public
   * @function
   * @param {Object} center the new center
   * @returns {Map}
   * @api stable
   */
  setCenter(center) {
    // checks if the param is null or empty
    if (isNullOrEmpty(center)) {
      Exception(getValue('exception').no_center);
    }

    // set the zoom by ol
    const olCenter = [center.x, center.y];
    const olView = this.getMapImpl().getView();
    const srcCenter = olView.getCenter();
    if (!isNullOrEmpty(srcCenter)) {
      this.getMapImpl().getView().animate({ duration: 250, source: srcCenter });
    }
    olView.setCenter(olCenter);
    return this;
  }

  /**
   * This function gets the current center of this
   * map instance
   *
   * @public
   * @function
   * @returns {Object}
   * @api stable
   */
  getCenter() {
    let center = null;
    const olCenter = this.getMapImpl().getView().getCenter();
    if (!isNullOrEmpty(olCenter)) {
      center = {
        x: olCenter[0],
        y: olCenter[1],
      };
    }
    return center;
  }

  /**
   * This function gets the current resolutions of this
   * map instance
   *
   * @public
   * @function
   * @returns {Array<Number>}
   * @api stable
   */
  getResolutions() {
    const olMap = this.getMapImpl();
    const resolutions = olMap.getView().getResolutions();

    return resolutions;
  }

  /**
   * This function sets current resolutions for this
   * map instance
   *
   * @public
   * @function
   * @param {Array<Number>} resolutions the resolutions
   * @returns {Map}
   * @api stable
   */
  setResolutions(resolutions, optional) {
    // checks if the param is null or empty
    if (isNullOrEmpty(resolutions)) {
      Exception(getValue('exception').no_resolutions);
    }

    if (isNullOrEmpty(optional)) {
      this.userResolutions_ = resolutions;
    }

    // gets the projection
    const projection = getProj(this.getProjection().code);

    // sets the resolutions
    const olMap = this.getMapImpl();
    const oldViewProperties = olMap.getView().getProperties();
    const oldZoom = olMap.getView().getUserZoom();
    const minZoom = olMap.getView().getMinZoom();
    const maxZoom = olMap.getView().getMaxZoom();
    const size = olMap.getSize();

    const newView = new View({ projection });
    newView.setProperties(oldViewProperties);
    newView.setResolutions(resolutions);
    newView.setUserZoom(oldZoom);
    newView.setMinZoom(minZoom);
    newView.setMaxZoom(maxZoom);
    newView.setConstrainResolution(true);
    // calculates the new resolution
    let newResolution;
    if (!isNullOrEmpty(oldZoom)) {
      newResolution = resolutions[oldZoom];
    } else {
      const bbox = this.facadeMap_.getBbox();
      if (!isNullOrEmpty(bbox)) {
        const oldResolution = newView.getResolutionForExtent([
          bbox.x.min,
          bbox.y.min,
          bbox.x.max,
          bbox.y.max,
        ], size);
        const restDiff = resolutions.map(r => Math.abs(r - oldResolution));
        const newResolutionIdx = restDiff.indexOf(Math.min(...restDiff));
        newResolution = resolutions[newResolutionIdx];
      }
    }
    newView.setResolution(newResolution);

    olMap.setView(newView);

    // sets the resolutions for each layer
    const layers = this.getWMS();
    layers.forEach((layer) => {
      layer.getImpl().setResolutions(resolutions);
    });

    return this;
  }

  /**
   * This function gets current scale for this
   * map instance
   *
   * @public
   * @function
   * @returns {number}
   * @api stable
   */
  getScale() {
    const olMap = this.getMapImpl();

    const resolution = olMap.getView().getResolution();
    const units = this.getProjection().units;

    let scale = getScaleFromResolution(resolution, units);

    if (!isNullOrEmpty(scale)) {
      if (scale >= 1000 && scale <= 950000) {
        scale = Math.round(scale / 1000) * 1000;
      } else if (scale >= 950000) {
        scale = Math.round(scale / 1000000) * 1000000;
      } else {
        scale = Math.round(scale);
      }
    }

    return scale;
  }

  /**
   * This function gets current scale for this
   * map instance
   *
   * @public
   * @function
   * @returns {number}
   * @api stable
   */
  getExactScale() {
    const olMap = this.getMapImpl();

    const resolution = olMap.getView().getResolution();
    const units = this.getProjection().units;

    const scale = getScaleFromResolution(resolution, units);

    return Math.trunc(scale);
  }

  /**
   * This function sets current projection for this
   * map instance
   *
   * @public
   * @function
   * @param {Mx.Projection} bbox the bbox
   * @returns {Map}
   * @api stable
   */
  setProjection(projection) {
    // checks if the param is null or empty
    if (isNullOrEmpty(projection)) {
      Exception(getValue('exception').no_projection);
    }

    // gets the current view and modifies its projection
    let olProjection = getProj(projection.code);
    if (isNullOrEmpty(olProjection)) {
      olProjection = new OLProjection(projection);
    }

    // gets previous data
    const olPrevProjection = getProj(this.getProjection().code);
    // let prevBbox = this.facadeMap_.getBbox();
    // const prevZoom = this.facadeMap_.getZoom();
    let prevMaxExtent = this.facadeMap_.getMaxExtent();
    const resolutions = this.facadeMap_.getResolutions();

    const olMap = this.getMapImpl();
    const oldViewProperties = olMap.getView().getProperties();
    const resolution = olMap.getView().getResolution();
    const userZoom = olMap.getView().getUserZoom();
    const minZoom = olMap.getView().getMinZoom();
    const maxZoom = olMap.getView().getMaxZoom();

    // sets the new view
    const newView = new View({ projection: olProjection });
    newView.setProperties(oldViewProperties);
    if (!isNullOrEmpty(resolutions)) {
      newView.setResolutions(resolutions);
    }
    if (!isNullOrEmpty(resolution)) {
      newView.setResolution(resolution);
    }
    newView.setUserZoom(userZoom);
    newView.setMinZoom(minZoom);
    newView.setMaxZoom(maxZoom);
    newView.setConstrainResolution(true);
    olMap.setView(newView);

    // updates min, max resolutions of all WMS layers
    this.facadeMap_.getWMS().forEach((layer) => {
      layer.updateMinMaxResolution(projection);
    });

    // recalculates maxExtent
    if (!isNullOrEmpty(prevMaxExtent)) {
      if (!isArray(prevMaxExtent)) {
        prevMaxExtent = [
          prevMaxExtent.x.min, prevMaxExtent.y.min,
          prevMaxExtent.x.max, prevMaxExtent.y.max,
        ];
      }
      this.setMaxExtent(ImplUtils
        .transformExtent(prevMaxExtent, olPrevProjection, olProjection), false);
    }

    // recalculates resolutions
    this.updateResolutionsFromBaseLayer();

    // reprojects popup
    const popup = this.facadeMap_.getPopup();
    if (!isNullOrEmpty(popup)) {
      let coord = popup.getCoordinate();
      if (!isNullOrEmpty(coord)) {
        coord = transform(coord, olPrevProjection, olProjection);
        popup.setCoordinate(coord);
      }
    }

    // reprojects label
    const label = this.facadeMap_.getLabel();
    if (!isNullOrEmpty(label)) {
      let coord = label.getCoordinate();
      if (!isNullOrEmpty(coord)) {
        coord = transform(coord, olPrevProjection, olProjection);
        label.setCoordinate(coord);
      }
    }

    this.fire(EventType.CHANGE);

    return this;
  }

  /**
   * This function gets the current projection of this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Projection}
   * @api stable
   */
  getProjection() {
    const olMap = this.getMapImpl();
    const olProjection = olMap.getView().getProjection();

    let projection = null;

    if (!isNullOrEmpty(olProjection)) {
      projection = {
        code: olProjection.getCode(),
        units: olProjection.getUnits(),
        getExtent: () => olProjection.getExtent(),
      };
    }
    return projection;
  }

  getMapImpl() {
    return this.map_;
  }

  /**
   * This function adds a popup and removes the previous
   * showed
   *
   * @public
   * @param {M.impl.Popup} popup to add
   * @returns {ol.Map}
   * @function
   * @api stable
   */
  removePopup(popup) {
    if (!isNullOrEmpty(popup)) {
      const olPopup = popup.getImpl();
      const olMap = this.getMapImpl();
      olMap.removeOverlay(olPopup);
    }
    return this;
  }

  /**
   * This function destroys this map, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.layers_.length = 0;
    this.controls_.length = 0;

    this.popup_ = null;
    this.options_ = null;

    this.map_.setTarget(null);
    this.map_ = null;
  }

  /**
   * Updates the resolutions for this map calculated
   * from base layers
   *
   * @public
   * @function
   * @returns {M.Map}
   * @api stable
   */
  updateResolutionsFromBaseLayer() {
    // FIXME:
    // let resolutions = [];

    // // zoom levels
    // let zoomLevels = 20;

    // // units
    // const units = this.getProjection().units;

    // // size
    // const size = this.getMapImpl().getSize();

    // const baseLayer = this.getBaseLayers().filter((bl) => {
    //   return bl.isVisible();
    // })[0];

    // // gets min/max resolutions from base layer
    // let maxResolution = null;
    // let minResolution = null;
    // if (!isNullOrEmpty(baseLayer)) {
    //   minResolution = baseLayer.getImpl().getMinResolution();
    //   maxResolution = baseLayer.getImpl().getMaxResolution();
    //   zoomLevels = baseLayer.getImpl().getNumZoomLevels();
    // }

    // if (this.userResolutions_ === null) {
    //   if (!isNullOrEmpty(minResolution) && !isNullOrEmpty(maxResolution)) {
    //     resolutions = fillResolutions(minResolution, maxResolution, zoomLevels);
    //     this.setResolutions(resolutions, true);

    //     this._resolutionsBaseLayer = true;

    //     // checks if it was the first time to
    //     // calculate resolutions in that case
    //     // fires the completed event
    //     if (this._calculatedResolutions === false) {
    //       this._calculatedResolutions = true;
    //       this.fire(EventType.COMPLETED);
    //     }
    //   } else {
    //     this.facadeMap_.calculateMaxExtent().then((extent) => {
    //       if (!this._resolutionsBaseLayer && (this.userResolutions_ === null)) {
    //         resolutions = generateResolutionsFromExtent(extent, size, zoomLevels, units);
    //         this.setResolutions(resolutions, true);

    //         this._resolutionsEnvolvedExtent = true;

    //         // checks if it was the first time to
    //         // calculate resolutions in that case
    //         // fires the completed event
    //         if (this._calculatedResolutions === false) {
    //           this._calculatedResolutions = true;
    //           this.fire(EventType.COMPLETED);
    //         }
    //       }
    //     }).catch((error) => {
    //       throw error;
    //     });
    //   }
    // }
    this.fire(EventType.COMPLETED);
    this.refresh();
  }

  /**
   * This function adds a popup and removes the previous
   * showed
   *
   * @public
   * @param {M.impl.Popup} popup to add
   * @returns {ol.Map}
   * @function
   * @api stable
   */
  addLabel(label) {
    this.label = label;
    label.show(this.facadeMap_);
    return this;
  }

  /**
   * This function adds a popup and removes the previous
   * showed
   *
   * @public
   * @param {M.impl.Popup} popup to add
   * @returns {ol.Map}
   * @function
   * @api stable
   */
  getLabel() {
    return this.label;
  }

  /**
   * This function provides ol3 map used by this instance
   *
   * @public
   * @returns {ol.Map}
   * @function
   * @api stable
   */
  removeLabel() {
    if (!isNullOrEmpty(this.label)) {
      const popup = this.label.getPopup();
      this.removePopup(popup);
      this.label = null;
    }
  }

  /**
   * This function refresh the state of this map instance,
   * this is, all its layers.
   *
   * @function
   * @api stable
   * @returns {Map} the instance
   */
  refresh() {
    this.map_.updateSize();
    return this;
  }

  /**
   * This function provides the core map used by the
   * implementation
   *
   * @function
   * @api stable
   * @returns {Object} core map used by the implementation
   */
  getContainer() {
    return this.map_.getOverlayContainerStopEvent();
  }

  /**
   * This function sets the facade map to implement
   *
   * @public
   * @function
   * @api stable
   */
  setFacadeMap(facadeMap) {
    this.facadeMap_ = facadeMap;
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  onMapClick_(evt) {
    const pixel = evt.pixel;
    const coord = this.map_.getCoordinateFromPixel(pixel);

    // hides the label if it was added
    const label = this.facadeMap_.getLabel();
    if (!isNullOrEmpty(label)) {
      label.hide();
    }

    this.facadeMap_.fire(EventType.CLICK, [{
      pixel,
      coord,
      vendor: evt,
    }]);
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  onMapMove_(evt) {
    const pixel = evt.pixel;
    const coord = this.map_.getCoordinateFromPixel(pixel);

    this.facadeMap_.fire(EventType.MOVE, [{
      pixel,
      coord,
      vendor: evt,
    }]);
  }
}
/**
 * Z-INDEX for the layers
 * @const
 * @type {Object}
 * @public
 * @api stable
 */
Map.Z_INDEX = {};
Map.Z_INDEX_BASELAYER = 0;
Map.Z_INDEX[LayerType.OSM] = 5;
Map.Z_INDEX[LayerType.WMS] = 10;
Map.Z_INDEX[LayerType.WMTS] = 10;
Map.Z_INDEX[LayerType.KML] = 10;
Map.Z_INDEX[LayerType.WFS] = 10;
Map.Z_INDEX[LayerType.MVT] = 10;
Map.Z_INDEX[LayerType.Vector] = 10;
Map.Z_INDEX[LayerType.GeoJSON] = 10;
Map.Z_INDEX[LayerType.MBTiles] = 10;
Map.Z_INDEX[LayerType.MBTilesVector] = 10;
Map.Z_INDEX[LayerType.XYZ] = 10;
Map.Z_INDEX[LayerType.TMS] = 10;

export default Map;
