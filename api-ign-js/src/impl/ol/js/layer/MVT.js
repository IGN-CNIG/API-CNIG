/* eslint-disable no-underscore-dangle */
/**
 * @module M/impl/layer/MVT
 */
import OLSourceVectorTile from 'ol/source/VectorTile';
import OLLayerVectorTile from 'ol/layer/VectorTile';
import { compileSync as compileTemplate } from 'M/util/Template';
import geojsonPopupTemplate from 'templates/geojson_popup';
import Popup from 'M/Popup';
import { isNullOrEmpty, extend, beautifyAttributeName } from 'M/util/Utils';
import * as EventType from 'M/event/eventtype';
import TileEventType from 'ol/source/TileEventType';
import TileState from 'ol/TileState';
import MVTFormatter from 'ol/format/MVT';
import { get as getProj } from 'ol/proj';
import { fromKey } from 'ol/tilecoord';
import Feature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import { mode } from 'M/layer/MVT';
import Vector from './Vector';

/**
 * @classdesc
 * Main constructor of the class. Creates a KML layer
 * with parameters specified by the user
 *
 */
class MVT extends Vector {
  /**
   * @constructor
   * @api
   */
  constructor(parameters, options, vendorOptions) {
    super(options, vendorOptions);
    /**
     *
     * @private
     * @type {ol.format.MVT}
     */
    this.formater_ = null;

    /**
     * Popup showed
     * @private
     * @type {M.impl.Popup}
     */
    this.popup_ = null;

    /**
     *
     * @private
     * @type {Number}
     */
    this.lastZoom_ = -1;

    /**
     * Projection of the layer.
     *
     * @private
     * @type {ol.proj.Projection}
     */
    this.projection_ = parameters.projection || 'EPSG:3857';

    /**
     * Features of the openlayers source
     * @private
     * @type {ol.render.Feature | ol.Feature}
     */
    this.features_ = [];

    /**
     * Render mode of the layer. Possible values: 'render' | 'feature'.
     *
     * @private
     * @type {string}
     */
    this.mode_ = parameters.mode;

    /**
     * Loaded flag attribute
     *
     * @private
     * @type {bool}
     */
    this.loaded_ = false;

    this.opacity_ = parameters.opacity || 1;

    this.visibility_ = parameters.visibility !== false;

    this.layers_ = parameters.layers;

    this.extract = parameters.extract;
  }

  /**
   * This method adds the vector tile layer to the ol.Map
   *
   * @public
   * @function
   * @api
   */
  addTo(map) {
    this.map = map;
    this.fire(EventType.ADDED_TO_MAP);
    if (this.layers_ !== undefined) {
      this.formater_ = new MVTFormatter({
        layers: this.layers_,
        featureClass: this.mode_ === mode.FEATURE ? Feature : RenderFeature,
      });
    } else {
      this.formater_ = new MVTFormatter({
        featureClass: this.mode_ === mode.FEATURE ? Feature : RenderFeature,
      });
    }

    const extent = this.facadeVector_.getMaxExtent();
    const source = new OLSourceVectorTile({
      format: this.formater_,
      url: this.url,
      projection: this.projection_,
    });

    // register events in order to fire the LOAD event
    source.on(TileEventType.TILELOADERROR, evt => this.checkAllTilesLoaded_(evt));
    // source.on(TileEventType.TILELOADEND, evt => this.checkAllTilesLoaded_(evt));

    this.ol3Layer = new OLLayerVectorTile(extend({
      source,
      extent,
    }, this.vendorOptions_, true));

    this.setOpacity(this.opacity_);
    this.setVisible(this.visibility_);
    this.map.getMapImpl().addLayer(this.ol3Layer);

    // clear features when zoom changes
    this.map.on(EventType.CHANGE_ZOOM, () => {
      if (this.map) {
        const newZoom = this.map.getZoom();
        if (this.lastZoom_ !== newZoom) {
          this.features_.length = 0;
          this.lastZoom_ = newZoom;
        }
      }
    });

    this.map.on(EventType.MOVE, (e) => {
      if (this.map) {
        const selector = this.map.getContainer().parentElement.parentElement.id;
        document.getElementById(selector).style.cursor = 'inherit';
        this.map.getMapImpl().forEachFeatureAtPixel(e.pixel, (feature) => {
          if (feature) {
            document.getElementById(selector).style.cursor = 'pointer';
          }
        });
      }
    });

    setTimeout(() => {
      const filtered = this.map.getLayers().filter((l) => {
        const checkLayers = l.getImpl().layers_ !== undefined ?
          l.getImpl().layers_ === this.layers_ : true;
        return l.url === this.url && checkLayers;
      });

      if (filtered.length > 0) {
        if (filtered[0].getStyle() !== null) {
          filtered[0].setStyle(filtered[0].getStyle());
        }
      }
    }, 10);
  }

  selectFeatures(features, coord, evt) {
    const feature = features[0];
    if (this.extract === true) {
      this.unselectFeatures();
      if (!isNullOrEmpty(feature)) {
        const htmlAsText = compileTemplate(geojsonPopupTemplate, {
          vars: this.parseFeaturesForTemplate_(features),
          parseToHtml: false,
        });

        const featureTabOpts = {
          icon: 'g-cartografia-pin',
          title: this.name,
          content: htmlAsText,
        };

        let popup = this.map.getPopup();
        if (isNullOrEmpty(popup)) {
          popup = new Popup();
          popup.addTab(featureTabOpts);
          this.map.addPopup(popup, coord);
        } else {
          popup.addTab(featureTabOpts);
        }
      }
    }
  }

  parseFeaturesForTemplate_(features) {
    const featuresTemplate = {
      features: [],
    };

    features.forEach((feature) => {
      const properties = feature.getAttributes();
      const propertyKeys = Object.keys(properties);
      const attributes = [];
      propertyKeys.forEach((key) => {
        attributes.push({
          key: beautifyAttributeName(key),
          value: properties[key],
        });
      });

      const featureTemplate = {
        id: feature.getId(),
        attributes,
      };

      featuresTemplate.features.push(featureTemplate);
    });
    return featuresTemplate;
  }

  unselectFeatures() {
    if (!isNullOrEmpty(this.popup_)) {
      this.popup_.hide();
      this.popup_ = null;
    }
  }

  removePopup() {
    if (!isNullOrEmpty(this.popup_)) {
      if (this.popup_.getTabs().length > 1) {
        this.popup_.removeTab(this.tabPopup_);
      } else {
        this.map.removePopup();
      }
    }
  }

  /**
   * This function returns all features or discriminating by the filter
   *
   * @function
   * @public
   * @param {boolean} skipFilter - Indicates whether skyp filter
   * @param {M.Filter} filter - Filter to execute
   * @return {Array<M.Feature>} returns all features or discriminating by the filter
   * @api
   */
  getFeatures(skipFilter, filter) {
    let features = [];
    if (this.ol3Layer) {
      const olSource = this.ol3Layer.getSource();
      const tileCache = olSource.tileCache;
      if (tileCache.getCount() === 0) {
        return features;
      }
      const z = fromKey(tileCache.peekFirstKey())[0];
      tileCache.forEach((tile) => {
        if (tile.tileCoord[0] !== z || tile.getState() !== TileState.LOADED) {
          return;
        }
        const sourceTiles = tile.getSourceTiles();
        for (let i = 0, ii = sourceTiles.length; i < ii; i += 1) {
          const sourceTile = sourceTiles[i];
          const olFeatures = sourceTile.getFeatures();
          if (olFeatures) {
            features = features.concat(olFeatures);
          }
        }
      });
    }
    return features;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @private
   * @function
   * @param {ol/source/Tile.TileSourceEvent} evt
   */
  checkAllTilesLoaded_(evt) {
    const currTileCoord = evt.tile.getTileCoord();
    const olProjection = getProj(this.projection_);
    const tileCache = this.ol3Layer.getSource().getTileCacheForProjection(olProjection);
    const tileImages = tileCache.getValues();
    const loaded = tileImages.every((tile) => {
      const tileCoord = tile.getTileCoord();
      const tileState = tile.getState();
      const sameTile = (currTileCoord[0] === tileCoord[0] &&
        currTileCoord[1] === tileCoord[1] &&
        currTileCoord[2] === tileCoord[2]);
      const tileLoaded = sameTile || (tileState !== TileState.LOADING);
      return tileLoaded;
    });
    if (loaded && !this.loaded_) {
      this.loaded_ = true;
      this.facadeVector_.fire(EventType.LOAD);
    }
  }

  /**
   *
   * @function
   * @api stable
   */
  isLoaded() {
    return true;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof MVT) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.extract === obj.extract);
    }

    return equals;
  }
}

export default MVT;
