/**
 * @module M/Map
 */
import MapImpl from 'impl/Map';
import Base from './Base';
import { getQuickLayers } from './mapea';
import {
  isNullOrEmpty,
  isUndefined,
  isNull,
  isArray,
  isFunction,
  normalize,
  addParameters,
  concatUrlPaths,
  escapeJSCode,
  isString,
  isObject,
  getEnvolvedExtent,
} from './util/Utils';
import { getValue } from './i18n/language';
import Exception from './exception/exception';
import Label from './Label';
import Popup from './Popup';
import Parameters from './parameter/Parameters';
import * as parameter from './parameter/parameter';
import * as EventType from './event/eventtype';
import FeaturesHandler from './handler/Feature';
import Feature from './feature/Feature';
import * as Dialog from './dialog';
import Control from './control/Control';
import GetFeatureInfo from './control/GetFeatureInfo';
import Location from './control/Location';
import Scale from './control/Scale';
import Rotate from './control/Rotate';
import ScaleLine from './control/ScaleLine';
import Panzoom from './control/Panzoom';
import Panzoombar from './control/Panzoombar';
import BackgroundLayers from './control/BackgroundLayers';
import Layer from './layer/Layer';
import * as LayerType from './layer/Type';
import Vector from './layer/Vector';
import KML from './layer/KML';
import WFS from './layer/WFS';
import WMS from './layer/WMS';
import WMTS from './layer/WMTS';
import MVT from './layer/MVT';
import OGCAPIFeatures from './layer/OGCAPIFeatures';
import Panel from './ui/Panel';
import * as Position from './ui/position';
import GeoJSON from './layer/GeoJSON';
import StylePoint from './style/Point';
import MBTiles from './layer/MBTiles';
import MBTilesVector from './layer/MBTilesVector';
import XYZ from './layer/XYZ';
import TMS from './layer/TMS';
import OSM from './layer/OSM';

/**
 * @classdesc
 * Crea un mapa
 * con parámetros especificados por el usuario.
 *
 * @property {Boolean} _defaultProj Indica si la proyección utilizada
 * es por defecto.
 * @property {object} panel Objeto del panel.
 * @property {Array<Number>} userMaxExtent Extensión máxima proporcionada por el usuario.
 * @extends {M.facade.Base}
 * @api
 */
class Map extends Base {
  /**
   * Constructor principal de la clase.
   *
   * @constructor
   * @extends { M.facade.Base }
   * @param { string | Mx.parameters.Map } userParameters Parámetros.
   * @param { Mx.parameters.MapOptions } options Opciones personalizadas para la implementación
   * proporcionado por el usuario.
   * @api
   */
  constructor(userParameters, options = {}) {
    // parses parameters to build the new map
    const params = new Parameters(userParameters);

    // calls the super constructor
    super();
    const impl = new MapImpl(params.container, this, options);
    // impl.setFacadeMap(this);
    this.setImpl(impl);

    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      Exception(getValue('exception').no_param);
    }

    // checks if the implementation can create maps
    if (isUndefined(MapImpl)) {
      Exception(getValue('exception').constructor_impl);
    }

    /**
     * Map: Panel del mapa.
     */
    this._panels = [];

    /**
     * Map: Plugins incorporados al mapa.
     */
    this._plugins = [];

    /**
     * Map: Areas del contenedor.
     */
    this._areasContainer = null;

    /**
     * Map: "Popup".
     */
    this.popup_ = null;

    /**
     * Map: Indica si la proyección utilizada
     * es por defecto.
     */
    this._defaultProj = true;

    /**
     * Map: Panel del mapa.
     */
    this.panel = {
      LEFT: null,
      RIGHT: 'null',
    };

    /**
     * Map: Zoom del usuario.
     */
    this._userZoom = null;

    /**
     * Map: Centro del usuario.
     */
    this.userCenter_ = null;

    /**
     * Map: Centro inicial terminado.
     */
    this._finishedInitCenter = true;

    /**
     * Map: Extensión máxima terminada.
     */
    this._finishedMaxExtent = true;

    /**
     * Map: Mapa terminado implementación.
     */
    this._finishedMapImpl = false;

    /**
     * Map: Mapa terminado.
     */
    this._finishedMap = false;

    /**
     * Map: Centro de los objetos geográficos.
     */
    this.centerFeature_ = null;

    /**
     * Map: Capa "Draw".
     */
    this.drawLayer_ = null;

    /**
     * Map: Extensión máxima proporcionada por el usuario.
     */
    this.userMaxExtent = null;

    /**
     * Map: Colección de "capabilities".
     */
    this.collectionCapabilities = [];

    // adds class to the container
    params.container.classList.add('m-mapea-container');

    impl.on(EventType.COMPLETED, () => {
      this._finishedMapImpl = true;
      this._checkCompleted();
    });

    // creates main panels
    this.createMainPanels_();

    /**
     * Manejador de objetos geográficos.
     */
    this.featuresHandler_ = new FeaturesHandler();
    this.featuresHandler_.addTo(this);
    this.featuresHandler_.activate();

    this.drawLayer_ = new Vector({
      name: '__draw__',
    }, { displayInLayerSwitcher: false });

    this.drawLayer_.setStyle(new StylePoint(Map.DRAWLAYER_STYLE));

    this.drawLayer_.setZIndex(MapImpl.Z_INDEX[LayerType.WFS] + 999);
    this.addLayers(this.drawLayer_);

    // projection
    if (!isNullOrEmpty(params.projection)) {
      this.setProjection(params.projection);
    } else { // default projection
      this.setProjection(M.config.DEFAULT_PROJ, true);
    }

    // bbox
    if (!isNullOrEmpty(params.bbox)) {
      this.setBbox(params.bbox);
    }

    // resolutions
    if (!isNullOrEmpty(params.resolutions)) {
      this.setResolutions(params.resolutions);
    }

    // maxExtent
    if (!isNullOrEmpty(params.maxExtent)) {
      const zoomToMaxExtent = isNullOrEmpty(params.zoom) && isNullOrEmpty(params.bbox);
      this.setMaxExtent(params.maxExtent, zoomToMaxExtent);
    }

    // layers
    if (!isNullOrEmpty(params.layers)) {
      this.addLayers(params.layers);
    }

    // wms
    if (!isNullOrEmpty(params.wms)) {
      this.addWMS(params.wms);
    }

    // wmts
    if (!isNullOrEmpty(params.wmts)) {
      this.addWMTS(params.wmts);
    }

    // kml
    if (!isNullOrEmpty(params.kml)) {
      this.addKML(params.kml);
    }

    // controls
    if (!isNullOrEmpty(params.controls)) {
      this.addControls(params.controls);
    }

    // default WMTS
    if (isNullOrEmpty(params.layers) && !isArray(params.layers)) {
      this.addTMS(M.config.tms.base);
    }

    // center
    if (!isNullOrEmpty(params.center)) {
      this.setCenter(params.center);
    }

    // zoom
    if (!isNullOrEmpty(params.zoom)) {
      this.setZoom(params.zoom);
    } else if (isNullOrEmpty(params.bbox)) {
      this.setZoom(0);
    }

    // minZoom
    if (!isNullOrEmpty(params.minZoom)) {
      this.setMinZoom(params.minZoom);
    }

    // maxZoom
    if (!isNullOrEmpty(params.maxZoom)) {
      this.setMaxZoom(params.maxZoom);
    }

    // label
    if (!isNullOrEmpty(params.label)) {
      this.addLabel(params.label);
    }

    // ticket
    if (!isNullOrEmpty(params.ticket)) {
      this.setTicket(params.ticket);
    }

    // initial zoom
    if (isNullOrEmpty(params.bbox) && isNullOrEmpty(params.zoom) && isNullOrEmpty(params.center)) {
      this.zoomToMaxExtent(true);
    }

    // initial center
    if (isNullOrEmpty(params.center) && isNullOrEmpty(params.bbox)) {
      this._finishedInitCenter = false;
      this.getInitCenter_().then((initCenter) => {
        if (isNullOrEmpty(this.userCenter_)) {
          this.setCenter(initCenter);
        }
        this._finishedInitCenter = true;
        this._checkCompleted();
      });
    }
  }

  /**
   * Este método obtiene las capas agregadas al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Matriz de nombres de capas.
   * @returns {Array<Layer>} Devuelve una matriz de capas.
   * @api
   */
  getLayers(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getLayers)) {
      Exception(getValue('exception').getlayers_method);
    }
    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map(parameter.layer);
    }

    // gets the layers
    const layers = this.getImpl().getLayers(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * Este método obtiene las capas que no están en ningún grupo de capas.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Matriz de nombres de capas.
   * @returns {Array<Layer>} Devuelve una matriz de capas.
   * @api
   */
  getRootLayers(layersParamVar) {
    const layers = this.getLayers(layersParamVar).filter(l => isNullOrEmpty(l.group));

    return layers;
  }

  /**
   * Este método devuelve las capas base del mapa.
   *
   * @function
   * @returns {Array<Layer>} Matriz con las capas base.
   * @api
   */
  getBaseLayers() {
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getBaseLayers)) {
      Exception(getValue('exception').getbaselayers_method);
    }

    return this.getImpl().getBaseLayers().sort(Map.LAYER_SORT);
  }

  /**
   * Este método devuelve los manejadores de objetos geográficos.
   *
   * @function
   * @returns {M.handler.Feature} Devuelve los manejadores de objetos geográficos
   * @public
   * @api
   */
  getFeatureHandler() {
    return this.featuresHandler_;
  }

  /**
   * Este método agrega capas especificadas por el usuario.
   *
   * @function
   * @param {string|Object|Array<String>|Array<Object>} layersParam Colección u objeto de capa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addLayers(layersParameter) {
    let layersParam = layersParameter;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addLayers)) {
        Exception(getValue('exception').addlayers_method);
      }
      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as Layer objects to add
      const layers = layersParam.map((layerParam) => {
        let layer;

        if (isString(layerParam)) {
          const splt = layerParam.split('*');
          if (splt.length === 2 && splt[0] === 'QUICK') {
            const ly = getQuickLayers(splt[1]);
            if (!isUndefined(ly)) {
              // eslint-disable-next-line
              layerParam = ly;
            } else {
              // eslint-disable-next-line
              console.error(`No se encuentra definida ${splt[1]} como capa rápida`);
              return null;
            }
          }
        }

        if (layerParam instanceof Layer) {
          layer = layerParam;
        } else {
          // try {
          const parameterVariable = parameter.layer(layerParam);
          if (!isNullOrEmpty(parameterVariable.type)) {
            switch (parameterVariable.type) {
              case 'WFS':
                layer = new WFS(layerParam, { style: parameterVariable.style });
                break;
              case 'WMS':
                layer = new WMS(layerParam);
                break;
              case 'GeoJSON':
                layer = new GeoJSON(parameterVariable, { style: parameterVariable.style });
                break;
              case 'KML':
                layer = new KML(layerParam);
                break;
              case 'Vector':
                layer = new Vector(layerParam);
                break;
              case 'WMTS':
                layer = new WMTS(layerParam);
                break;
              case 'MVT':
                layer = new MVT(layerParam);
                break;
              case 'MBTiles':
                layer = new MBTiles(parameterVariable);
                break;
              case 'MBTilesVector':
                layer = new MBTilesVector(parameterVariable, { style: parameterVariable.style });
                break;
              case 'XYZ':
                layer = new XYZ(parameterVariable);
                break;
              case 'TMS':
                layer = new TMS(parameterVariable);
                break;
              case 'OSM':
                layer = new OSM(layerParam);
                break;
              case 'OGCAPIFeatures':
                layer = new OGCAPIFeatures(layerParam, { style: parameterVariable.style });
                break;
              default:
                Dialog.error(getValue('dialog').invalid_type_layer);
            }
          } else {
            Dialog.error(getValue('dialog').invalid_type_layer);
          }
          // }
          // catch (err) {
          //   Dialog.error('El formato de la capa (' + layerParam + ') no se reconoce');
          //   throw err;
          // }
        }

        // gets the capabilities of the layers
        this.collectorCapabilities_(layer);

        // KML and WFS layers handler its features
        if ((layer instanceof Vector)
          /* && !(layer instanceof KML) */
          &&
          !(layer instanceof WFS) &&
          !(layer instanceof OGCAPIFeatures)) {
          this.featuresHandler_.addLayer(layer);
        }

        layer.setMap(this);

        return layer;
      });

      // adds the layers
      this.getImpl().addLayers(layers.filter(element => element !== null));
      this.fire(EventType.ADDED_LAYER, [layers]);
    }
    return this;
  }

  /**
   * Este método almacena en this.collectionCapabilities
   * las "capabilities" de las capas. Esto se usará para
   * evitar llamadas innecesarias al servidor.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @function
   * @param {string|Object|Array<String>|Array<Object>} layers Colección u objeto de capa.
   * @api
   */
  collectorCapabilities_(layers) {
    let layersParam = layers;
    if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }
    if (layersParam[0].name === '__draw__') return;
    const urlCapabilities = [];

    layersParam.forEach((l) => {
      let type = '';
      let url = '';
      let useCapabilities = true;
      if (typeof l === 'string') {
        const [typeSplit] = l.split('*');
        const parameters = parameter.layer(l, LayerType[typeSplit]);
        type = parameters.type;
        url = parameters.url;
        useCapabilities = parameters.useCapabilities;
      } else if (typeof l === 'object') {
        type = l.type;
        url = l.url;
        useCapabilities = l.useCapabilities;
      }

      if (this.collectionCapabilities.filter(u => u.url === url).length > 0) return;

      if ((type === 'WMS' || type === 'WMTS') && useCapabilities) {
        if (urlCapabilities.filter(u => u.url === url).length === 0) {
          this.collectionCapabilities.push({
            type,
            url,
            capabilities: false,
          });
        }
      }
    });
  }

  /**
   * Este método elimina las capas especificadas del mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Matriz de capas de nombres que
   * desea eliminar.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  removeLayers(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeLayers)) {
        Exception(getValue('exception').removelayers_method);
      }

      // gets the layers to remove
      const layers = this.getLayers(layersParam);

      layers.forEach((layer) => {
        // KML and WFS layers handler its features
        if (layer instanceof Vector) {
          this.featuresHandler_.removeLayer(layer);
        }
      });

      // removes the layers
      this.getImpl().removeLayers(layers);
    }

    return this;
  }

  /**
   * Esta función agrega las capas KML al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Opcional.
   * - Matriz de capas de nombres, tipo KML.
   * @returns {Array<KML>} Matriz de capas, tipo KML.
   * @api
   */
  getKML(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getKML)) {
      Exception(getValue('exception').getkml_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.KML);
      });
    }

    // gets the layers
    const layers = this.getImpl().getKML(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * Este método agrega las capas KML al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.KML>} layersParam Colección u objeto de capa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addKML(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addKML)) {
        Exception(getValue('exception').addkml_method);
      }

      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as KML objects to add
      const kmlLayers = [];
      layersParam.forEach((layerParam) => {
        let kmlLayer;
        if (isObject(layerParam) && (layerParam instanceof KML)) {
          kmlLayer = layerParam;
        } else if (!(layerParam instanceof Layer)) {
          kmlLayer = new KML(layerParam, layerParam.options);
        }
        if (kmlLayer.extract === true) {
          this.featuresHandler_.addLayer(kmlLayer);
        }
        kmlLayers.push(kmlLayer);
      });

      // adds the layers
      this.getImpl().addKML(kmlLayers);
      this.fire(EventType.ADDED_LAYER, [kmlLayers]);
      this.fire(EventType.ADDED_KML, [kmlLayers]);
    }
    return this;
  }

  /**
   * Este método elimina las capas KML del mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.KML>} layersParam Matriz de capas de nombres que
   * desea eliminar.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  removeKML(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeKML)) {
        Exception(getValue('exception').removekml_method);
      }

      // gets the layers
      const kmlLayers = this.getKML(layersParam);
      if (kmlLayers.length > 0) {
        this.fire(EventType.REMOVED_LAYER, [kmlLayers]);
        kmlLayers.forEach((layer) => {
          this.featuresHandler_.removeLayer(layer);
        });
        // removes the layers
        this.getImpl().removeKML(kmlLayers);
      }
    }
    return this;
  }

  /**
   * Este método obtiene las capas WMS agregadas al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMC>} layersParam Opcional.
   * - Matriz de capas de nombres, tipo WMS.
   * @returns {Array<WMS>} Matriz de capas, tipo WMS.
   * @api
   */
  getWMS(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getWMS)) {
      Exception(getValue('exception').getwms_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.WMS);
      });
    }

    // gets the layers
    const layers = this.getImpl().getWMS(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * Este método agrega las capas WMS al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMS>} layersParam Colección u objeto de capa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addWMS(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addWMS)) {
        Exception(getValue('exception').addwms_method);
      }

      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      this.collectorCapabilities_(layersParam);

      // gets the parameters as WMS objects to add
      const wmsLayers = [];
      layersParam.forEach((layerParam) => {
        let wmsLayer = layerParam;
        if (!(layerParam instanceof WMS)) {
          wmsLayer = new WMS(layerParam, layerParam.options);
        }
        wmsLayer.setMap(this);
        wmsLayers.push(wmsLayer);
      });

      // adds the layers
      this.getImpl().addWMS(wmsLayers);
      this.fire(EventType.ADDED_LAYER, [wmsLayers]);
      this.fire(EventType.ADDED_WMS, [wmsLayers]);
    }
    return this;
  }

  /**
   * Este método elimina las capas WMS del mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMS>} layersParam Matriz de capas de nombres que
   * desea eliminar.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  removeWMS(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeWMS)) {
        Exception(getValue('exception').removewms_method);
      }

      // gets the layers
      const wmsLayers = this.getWMS(layersParam);
      if (wmsLayers.length > 0) {
        this.fire(EventType.REMOVED_LAYER, [wmsLayers]);
        // removes the layers
        this.getImpl().removeWMS(wmsLayers);
      }
    }
    return this;
  }

  /**
   * Este método agrega las capas WFS al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Opcional.
   * - Matriz de capas de nombres, tipo WFS.
   * @returns {Array<WFS>} Capas del mapa.
   * @api
   */
  getWFS(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getWFS)) {
      Exception(getValue('exception').getwfs_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.WFS);
      });
    }

    // gets the layers
    const layers = this.getImpl().getWFS(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * Este método agrega las capas de GeoJSON al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Opcional
   * - Matriz de capas de nombres, escriba GeoJSON.
   * @returns {Array<WFS>} Capas del mapa.
   * @api
   */
  getGeoJSON(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getGeoJSON)) {
      Exception(getValue('exception').getgeojson_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the layers
    const layers = this.getImpl().getGeoJSON(layersParam).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * Este método agrega las capas WFS al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WFS>} layersParam Colección u objeto de capa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addWFS(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addWFS)) {
        Exception(getValue('exception').addwfs_method);
      }

      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as WFS objects to add
      const wfsLayers = [];
      layersParam.forEach((layerParam) => {
        let wfsLayer;
        if (isObject(layerParam) && (layerParam instanceof WFS)) {
          wfsLayer = layerParam;
        } else if (!(layerParam instanceof Layer)) {
          try {
            wfsLayer = new WFS(layerParam, layerParam.options);
          } catch (err) {
            Dialog.error(err.toString());
            throw err;
          }
        }
        this.featuresHandler_.addLayer(wfsLayer);
        wfsLayers.push(wfsLayer);
      });

      // adds the layers
      this.getImpl().addWFS(wfsLayers);
      this.fire(EventType.ADDED_LAYER, [wfsLayers]);
      this.fire(EventType.ADDED_WFS, [wfsLayers]);
    }
    return this;
  }

  /**
   * Este método elimina las capas WFS del mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WFS>} layersParam Matriz de capas de nombres que
   * desea eliminar.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  removeWFS(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeWFS)) {
        Exception(getValue('exception').removewfs_method);
      }

      // gets the layers
      const wfsLayers = this.getWFS(layersParam);
      if (wfsLayers.length > 0) {
        this.fire(EventType.REMOVED_LAYER, [wfsLayers]);
        wfsLayers.forEach((layer) => {
          this.featuresHandler_.removeLayer(layer);
        });
        // removes the layers
        this.getImpl().removeWFS(wfsLayers);
      }
    }
    return this;
  }

  /**
   * Este método agrega las capas de OGCAPIFeatures al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Opcional
   * - Matriz de capas de nombres, escriba OGCAPIFeatures.
   * @returns {Array<OGCAPIFeatures>} Capas del mapa.
   * @api
   */
  getOGCAPIFeatures(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getOGCAPIFeatures)) {
      Exception(getValue('exception').getogcapif_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.OGCAPIFeatures);
      });
    }

    // gets the layers
    const layers = this.getImpl().getOGCAPIFeatures(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * Este método agrega las capas OGCAPIFeatures al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.OGCAPIFeatures>} layersParam Colección u objeto
   * de capa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addOGCAPIFeatures(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addOGCAPIFeatures)) {
        Exception(getValue('exception').addogcapif_method);
      }

      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as OGCAPIFeatures objects to add
      const ogcapifLayers = [];
      layersParam.forEach((layerParam) => {
        let ogcapifLayer;
        if (isObject(layerParam) && (layerParam instanceof OGCAPIFeatures)) {
          ogcapifLayer = layerParam;
        } else if (!(layerParam instanceof Layer)) {
          try {
            ogcapifLayer = new OGCAPIFeatures(layerParam, layerParam.options);
          } catch (err) {
            Dialog.error(err.toString());
            throw err;
          }
        }
        this.featuresHandler_.addLayer(ogcapifLayer);
        ogcapifLayers.push(ogcapifLayer);
      });

      // adds the layers
      this.getImpl().addOGCAPIFeatures(ogcapifLayers);
      this.fire(EventType.ADDED_LAYER, [ogcapifLayers]);
      this.fire(EventType.ADDED_OGCAPIFEATURES, [ogcapifLayers]);
    }
    return this;
  }

  /**
   * Este método elimina las capas OGCAPIFeatures del mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.OGCAPIFeatures>} layersParam Matriz de capas de
   * nombres que desea eliminar.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  removeOGCAPIFeatures(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeOGCAPIFeatures)) {
        Exception(getValue('exception').removeogcapif_method);
      }

      // gets the layers
      const ogcapifLayers = this.getOGCAPIFeatures(layersParam);
      if (ogcapifLayers.length > 0) {
        this.fire(EventType.REMOVED_LAYER, [ogcapifLayers]);
        ogcapifLayers.forEach((layer) => {
          this.featuresHandler_.removeLayer(layer);
        });
        // removes the layers
        this.getImpl().removeOGCAPIFeatures(ogcapifLayers);
      }
    }
    return this;
  }

  /**
   * Este método obtiene las capas WMTS agregadas al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam Opcional.
   * - Matriz de capas de nombres, tipo WMTS.
   * @returns {Array<WMTS>} Capas del mapa.
   * @api
   */
  getWMTS(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getWMTS)) {
      Exception(getValue('exception').getwmts_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.WMTS);
      });
    }

    // gets the layers
    const layers = this.getImpl().getWMTS(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * Este método agrega las capas WMTS al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam Colección u objeto de capa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addWMTS(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addWMTS)) {
        Exception(getValue('exception').addwmts_method);
      }

      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      this.collectorCapabilities_(layersParam);

      // gets the parameters as WMS objects to add
      const wmtsLayers = [];
      layersParam.forEach((layerParam) => {
        if (isObject(layerParam) && (layerParam instanceof WMTS)) {
          layerParam.setMap(this);
          wmtsLayers.push(layerParam);
        } else if (!(layerParam instanceof Layer)) {
          const wmtsLayer = new WMTS(layerParam, layerParam.options);
          wmtsLayer.setMap(this);
          wmtsLayers.push(wmtsLayer);
        }
      });

      // adds the layers
      this.getImpl().addWMTS(wmtsLayers);
      this.fire(EventType.ADDED_LAYER, [wmtsLayers]);
      this.fire(EventType.ADDED_WMTS, [wmtsLayers]);
    }
    return this;
  }

  /**
   * Este método elimina las capas WMTS del mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam Matriz de capas de nombres que
   * desea eliminar.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  removeWMTS(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeWMTS)) {
        Exception(getValue('exception').removewmts_method);
      }

      // gets the layers
      const wmtsLayers = this.getWMTS(layersParam);
      if (wmtsLayers.length > 0) {
        this.fire(EventType.REMOVED_LAYER, [wmtsLayers]);
        // removes the layers
        this.getImpl().removeWMTS(wmtsLayers);
      }
    }
    return this;
  }

  /**
   * Este método obtiene las capas MVT.
   *
   * @function
   * @public
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam Opcional.
   * - Matriz de capas de nombres, tipo MVT.
   * @returns {Array<WMTS>} Capas del mapa.
   * @api
   */
  getMVT(layersParamVar) {
    let layersParam = layersParamVar;
    if (isUndefined(MapImpl.prototype.getMVT)) {
      Exception('La implementación usada no posee el método getWFS');
    }

    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.MVT);
      });
    }

    const layers = this.getImpl().getMVT(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * Este método elimina las capas MVT del mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam Matriz de capas de nombres que
   * desea eliminar.
   * @returns {Map} Devuelve el estado del mapa.
   * @public
   * @api
   */
  removeMVT(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      if (isUndefined(MapImpl.prototype.removeMVT)) {
        Exception('La implementación usada no posee el método removeWFS');
      }
      const mvtLayers = this.getMVT(layersParam);
      if (mvtLayers.length > 0) {
        this.fire(EventType.REMOVED_LAYER, [mvtLayers]);
        mvtLayers.forEach((layer) => {
          this.featuresHandler_.removeLayer(layer);
        });
        this.getImpl().removeMVT(mvtLayers);
      }
    }
    return this;
  }

  /**
   * Este método agrega capas MVT.
   *
   * @function
   * @public
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam Colección u objeto de capa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addMVT(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      if (isUndefined(MapImpl.prototype.addMVT)) {
        Exception('La implementación usada no posee el método addWFS');
      }

      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      const mvtLayers = [];
      layersParam.forEach((layerParam) => {
        let vectorTile;
        if (isObject(layerParam) && (layerParam instanceof MVT)) {
          vectorTile = layerParam;
        } else if (!(layerParam instanceof Layer)) {
          try {
            vectorTile = new MVT(layerParam, layerParam.options);
          } catch (err) {
            Dialog.error(err.toString());
            throw err;
          }
        }
        // FIXME: Hay problemas majenando las features de los vector tiles
        // en openlayers
        // this.featuresHandler_.addLayer(vectorTile);
        mvtLayers.push(vectorTile);
      });

      this.getImpl().addMVT(mvtLayers);
      this.fire(EventType.ADDED_LAYER, [mvtLayers]);
      this.fire(EventType.ADDED_VECTOR_TILE, [mvtLayers]);
    }
    return this;
  }

  /**
   * Este método obtiene las capas MBTiles agregadas al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.MBTiles>} layersParam Opcional.
   * - Matriz de capas de nombres, tipo MBTiles.
   * @returns {Array<M.layer.MBTiles>} Capas del mapa.
   * @api
   */
  getMBTiles(layersParamVar) {
    let layersParam = layersParamVar;

    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.MBTiles);
      });
    }
    const layers = this.getImpl().getMBTiles(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * Este método agrega las capas de MBTiles al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.MBTiles>} layersParamVar Colección u
   * objeto de capa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addMBTiles(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      const mbtilesLayers = [];
      layersParam.forEach((layerParam) => {
        let mbtileslayer = layerParam;
        if (!(layerParam instanceof MBTiles)) {
          mbtileslayer = new MBTiles(layerParam, layerParam.options);
        }
        mbtileslayer.setMap(this);
        mbtilesLayers.push(mbtileslayer);
      });

      this.getImpl().addMBTiles(mbtilesLayers);
      this.fire(EventType.ADDED_LAYER, [mbtilesLayers]);
      this.fire(EventType.ADDED_MBTILES, [mbtilesLayers]);
    }
    return this;
  }

  /**
   * Este método elimina las capas de MBTiles del mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.MBTiles>} layersParam Matriz de capas de nombres que
   * desea eliminar.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  removeMBTiles(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      const mbtilesLayers = this.getMBTiles(layersParam);
      if (mbtilesLayers.length > 0) {
        this.fire(EventType.REMOVED_LAYER, [mbtilesLayers]);
        this.getImpl().removeMBTiles(mbtilesLayers);
      }
    }
    return this;
  }

  /**
   * Este método obtiene las capas MBTilesVector agregadas al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.MBTilesVector>} layersParamVar Opcional.
   * - Matriz de capas de nombres, tipo MBTilesVector.
   * @returns {Array<M.layer.MBTilesVector>} Capas del mapa.
   * @api
   */
  getMBTilesVector(layersParamVar) {
    let layersParam = layersParamVar;
    if (isUndefined(MapImpl.prototype.getMBTilesVector)) {
      Exception(getValue('exception').getmbtiles_method);
    }
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.MBTilesVector);
      });
    }
    const layers = this.getImpl().getMBTilesVector(filters).sort(Map.LAYER_SORT);
    return layers;
  }

  /**
   * Este método agrega las capas de MBTilesVector al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.MBTilesVector>} layersParamVar
   * Colección u objeto de capa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addMBTilesVector(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      if (isUndefined(MapImpl.prototype.addMBTilesVector)) {
        Exception(getValue('exception').addmbtiles_method);
      }
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }
      const mbtilesLayers = [];
      layersParam.forEach((layerParam) => {
        if (isObject(layerParam) &&
          (layerParam instanceof MBTilesVector)) {
          layerParam.setMap(this);
          mbtilesLayers.push(layerParam);
        }
      });
      this.getImpl().addMBTilesVector(mbtilesLayers);
      this.fire(EventType.ADDED_LAYER, [mbtilesLayers]);
      this.fire(EventType.ADDED_MBTILES_VECTOR, [mbtilesLayers]);
    }
    return this;
  }

  /**
   * Este método elimina las capas de MBTilesVector del mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.MBTilesVector>} layersParam Matriz de capas
   * de nombres que desea eliminar.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  removeMBTilesVector(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      if (isUndefined(MapImpl.prototype.removeMBTilesVector)) {
        Exception(getValue('exception').removembtiles_method);
      }
      const mbtilesLayers = this.getMBTilesVector(layersParam);
      if (mbtilesLayers.length > 0) {
        this.fire(EventType.REMOVED_LAYER, [mbtilesLayers]);
        this.getImpl().removeMBTilesVector(mbtilesLayers);
      }
    }
    return this;
  }

  /**
   * Este método devuelve las capas XYZ al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Opcional.
   * - Matriz de capas de nombres, tipo XYZ.
   * @returns {Array<M.layer.XYZ>} Capas del mapa.
   * @api
   */
  getXYZs(layersParamVar) {
    let layersParam = layersParamVar;
    if (isUndefined(MapImpl.prototype.getXYZs)) {
      Exception(getValue('exception').getxyzs_method);
    }

    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map(parameter.layer);
    }

    const layers = this.getImpl().getXYZs(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * Este método agrega las capas XYZ al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Colección u objeto de capa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addXYZ(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      if (isUndefined(MapImpl.prototype.addXYZ)) {
        Exception(getValue('exception').addxyz_method);
      }

      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      const xyzLayers = [];
      layersParam.forEach((layerParam) => {
        if (isObject(layerParam) && (layerParam instanceof XYZ)) {
          layerParam.setMap(this);
          xyzLayers.push(layerParam);
        } else if (!(layerParam instanceof Layer)) {
          const xyzLayer = new XYZ(layerParam, layerParam.options);
          xyzLayer.setMap(this);
          xyzLayers.push(xyzLayer);
        }
      });

      this.getImpl().addXYZ(xyzLayers);
      this.fire(EventType.ADDED_LAYER, [xyzLayers]);
      this.fire(EventType.ADDED_XYZ, [xyzLayers]);
    }
    return this;
  }

  /**
   * Este método elimina las capas XYZ del mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Matriz de capas de nombres que
   * desea eliminar.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  removeXYZ(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      if (isUndefined(MapImpl.prototype.removeXYZ)) {
        Exception(getValue('exception').removexyz_method);
      }

      const xyzLayers = this.getXYZs(layersParam);
      if (xyzLayers.length > 0) {
        this.fire(EventType.REMOVED_LAYER, [xyzLayers]);
        this.getImpl().removeXYZ(xyzLayers);
      }
    }
    return this;
  }


  /**
   * Este método devuelve las capas TMS al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Opcional.
   * - Matriz de capas de nombres, tipo TMS.
   * @returns {Array<M.layer.TMS>} Capas del mapa.
   * @api
   */
  getTMS(layersParamVar) {
    let layersParam = layersParamVar;
    if (isUndefined(MapImpl.prototype.getTMS)) {
      Exception(getValue('exception').gettms_method);
    }

    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map(parameter.layer);
    }

    const layers = this.getImpl().getTMS(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * Este método agrega las capas TMS al mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Colección u objeto de capa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addTMS(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      if (isUndefined(MapImpl.prototype.addTMS)) {
        Exception(getValue('exception').addtms_method);
      }

      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      const tmsLayers = [];
      layersParam.forEach((layerParam) => {
        if (isObject(layerParam) && (layerParam instanceof TMS)) {
          layerParam.setMap(this);
          tmsLayers.push(layerParam);
        } else if (!(layerParam instanceof Layer)) {
          const tmsLayer = new TMS(layerParam, layerParam.options);
          tmsLayer.setMap(this);
          tmsLayers.push(tmsLayer);
        }
      });

      this.getImpl().addTMS(tmsLayers);
      this.fire(EventType.ADDED_LAYER, [tmsLayers]);
      this.fire(EventType.ADDED_TMS, [tmsLayers]);
    }
    return this;
  }

  /**
   * Este método elimina las capas TMS del mapa.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Matriz de capas de nombres que
   * desea eliminar.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  removeTMS(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      if (isUndefined(MapImpl.prototype.removeTMS)) {
        Exception(getValue('exception').removetms_method);
      }

      const tmsLayers = this.getTMS(layersParam);
      if (tmsLayers.length > 0) {
        this.fire(EventType.REMOVED_LAYER, [tmsLayers]);
        this.getImpl().removeTMS(tmsLayers);
      }
    }
    return this;
  }

  /**
   * Este método agrega las capas rápidas al mapa.
   *
   * @function
   * @param {Array<string>|String} layersParam Colección de nombres de capas.
   * rápidas o nombre de una capa rápida.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addQuickLayers(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      const quickLayers = [];
      layersParam.forEach((layerParam) => {
        if (isString(layerParam)) {
          let value = layerParam;
          if (layerParam.indexOf('QUICK*') === -1) {
            value = `QUICK*${layerParam}`;
          }
          quickLayers.push(value);
        } else {
          quickLayers.push(layerParam);
        }
      });

      this.addLayers(quickLayers);

      this.fire(EventType.ADDED_QUICK_LAYERS, [quickLayers]);
    }
    return this;
  }

  /**
   * Este método devuelve los controles especificados por el usuario.
   *
   * @public
   * @function
   * @param {string|Array<String>} controlsParam Controles de nombre de colección.
   * @returns {Array<Control>} Matriz de retorno de controles.
   * @api
   */
  getControls(controlsParamVar) {
    let controlsParam = controlsParamVar;

    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getControls)) {
      Exception(getValue('exception').getcontrols_method);
    }

    // parses parameters to Array
    if (isNull(controlsParam)) {
      controlsParam = [];
    } else if (!isArray(controlsParam)) {
      controlsParam = [controlsParam];
    }

    // gets the controls
    const controls = this.getImpl().getControls(controlsParam);

    return controls;
  }

  /**
   * Este método agrega controles especificados por el usuario.
   *
   * @public
   * @function
   * @param {string|Object|Array<String>|Array<Object>} controlsParam
   * Colección o nombre de los controles.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addControls(controlsParamVar) {
    let controlsParam = controlsParamVar;
    if (!isNullOrEmpty(controlsParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addControls)) {
        Exception(getValue('exception').addcontrols_method);
      }

      // parses parameters to Array
      if (!isArray(controlsParam)) {
        controlsParam = [controlsParam];
      }

      // gets the parameters as Control to add them
      const controls = [];
      // for (let i = 0, ilen = controlsParam.length; i < ilen; i++) {
      controlsParam.forEach((controlParamVar) => {
        let controlParam = controlParamVar;
        let control;
        let panel;
        if (isString(controlParam)) {
          controlParam = normalize(controlParam).split('*');

          switch (controlParam[0]) {
            case Scale.NAME:
              const paramsScale = {};
              controlParam.forEach((p) => {
                if (p === 'true') paramsScale.exactScale = Boolean(p);
                // eslint-disable-next-line no-restricted-globals
                if (!isNaN(p)) paramsScale.order = Number(p);
              });
              control = new Scale(paramsScale);
              panel = this.getPanels('map-info')[0];
              if (isNullOrEmpty(panel)) {
                panel = new Panel('map-info', {
                  collapsible: false,
                  className: 'm-map-info',
                  position: Position.BR,
                  order: (paramsScale.order) ? paramsScale.order : null,
                });
                panel.on(EventType.ADDED_TO_MAP, (html) => {
                  if (this.getControls(['wmcselector', 'scale', 'scaleline']).length === 3) {
                    this.getControls(['scaleline'])[0].getImpl().getElement().classList.add('ol-scale-line-up');
                  }
                });
              }
              panel.addClassName('m-with-scale');
              break;
            case ScaleLine.NAME:
              control = new ScaleLine();
              panel = new Panel(ScaleLine.NAME, {
                collapsible: false,
                className: 'm-scaleline',
                position: Position.BL,
                tooltip: 'Línea de escala',
              });
              panel.on(EventType.ADDED_TO_MAP, (html) => {
                if (this.getControls(['wmcselector', 'scale', 'scaleline']).length === 3) {
                  this.getControls(['scaleline'])[0].getImpl().getElement().classList.add('ol-scale-line-up');
                }
              });
              break;
            case Panzoombar.NAME:
              control = new Panzoombar();
              panel = new Panel(Panzoombar.NAME, {
                collapsible: false,
                className: 'm-panzoombar',
                position: Position.TL,
                tooltip: 'Nivel de zoom',
              });
              break;
            case Panzoom.NAME:
              control = new Panzoom();
              panel = new Panel(Panzoom.NAME, {
                collapsible: false,
                className: 'm-panzoom',
                position: Position.TL,
              });
              break;
            case Location.NAME:
              control = new Location();
              panel = new Panel(Location.NAME, {
                collapsible: false,
                className: 'm-location',
                position: Position.BR,
              });
              break;
            case GetFeatureInfo.NAME:
              control = new GetFeatureInfo(true);
              break;
            case Rotate.NAME:
              control = new Rotate();
              panel = new Panel(Rotate.name, {
                collapsible: false,
                className: 'm-rotate',
                position: Position.TR,
              });
              break;
            case BackgroundLayers.NAME:
              control = new BackgroundLayers(this);
              panel = new Panel(BackgroundLayers.NAME, {
                collapsible: false,
                position: Position.TR,
                className: 'm-plugin-baselayer',
              });
              break;
            default:
              if (/backgroundlayers\*([0-9])+\*(true|false)/.test(controlParam)) {
                const idLayer = controlParam.match(/backgroundlayers\*([0-9])+\*(true|false)/)[1];
                const visible = controlParam.match(/backgroundlayers\*([0-9])+\*(true|false)/)[2] === 'true';
                control = new BackgroundLayers(this, Number.parseInt(idLayer, 10), visible);

                panel = new Panel(BackgroundLayers.NAME, {
                  collapsible: false,
                  position: Position.TR,
                  className: 'm-plugin-baselayer',
                });
              } else {
                const getControlsAvailable = concatUrlPaths([M.config.MAPEA_URL, '/api/actions/controls']);
                Dialog.error(`El control ${controlParam} no está definido. Consulte los controles disponibles <a href='${getControlsAvailable}' target="_blank">aquí</a>`);
              }
          }
        } else if (controlParam instanceof Control) {
          control = controlParam;
        } else {
          Exception('El control "'.concat(controlParam).concat('" no es un control válido.'));
        }

        if (!isNullOrEmpty(panel) && !panel.hasControl(control)) {
          panel.addControls(control);
          this.addPanels(panel);
        } else {
          control.addTo(this);
          controls.push(control);
        }
      });
      this.getImpl().addControls(controls);
    }
    return this;
  }

  /**
   * Este método elimina los controles especificados del mapa.
   *
   * @function
   * @param {string|Array<string>} controlsParam Colección o nombre de los controles
   * especificado por el usuario.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  removeControls(controlsParam) {
    // checks if the parameter is null or empty
    if (isNullOrEmpty(controlsParam)) {
      Exception(getValue('exception').remove_control);
    }

    // checks if the implementation can manage controls
    if (isUndefined(MapImpl.prototype.removeControls)) {
      Exception(getValue('exception').removecontrol_method);
    }

    // gets the contros to remove
    let controls = this.getControls(controlsParam);
    controls = [].concat(controls);
    if (controls.length > 0) {
      // removes controls from their panels
      controls.forEach((control) => {
        if (!isNullOrEmpty(control.getPanel())) {
          control.getPanel().removeControls(control);
        }
      });
      // removes the controls
      this.getImpl().removeControls(controls);
    }

    return this;
  }

  /**
   * Este método proporciona la extensión máxima para esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @returns {Mx.Extent} Devuelve la extensión máxima.
   * @api
   */
  getMaxExtent() {
    let maxExtent = this.userMaxExtent;
    if (isNullOrEmpty(maxExtent)) {
      maxExtent = this.getProjection().getExtent();
    }
    return maxExtent;
  }

  /**
   * Este método proporciona la extensión máxima para esta
   * instancia de mapa.
   * Versión asíncrona de "getMaxExtent".
   *
   * @public
   * @function
   * @returns {Promise} Devuelve la extensión máxima.
   * @api
   */
  calculateMaxExtent() {
    return new Promise((resolve) => {
      let maxExtent = this.userMaxExtent;
      if (isNullOrEmpty(maxExtent)) {
        const calculateExtents = this.getLayers().filter(layer => layer.name !== '__draw__').map(l => l.calculateMaxExtent());
        Promise.all(calculateExtents).then((extents) => {
          maxExtent = getEnvolvedExtent(extents);
          if (isNullOrEmpty(maxExtent)) {
            maxExtent = this.getProjection().getExtent();
          }
          // if the maxExtent is modified while are calculating maxExtent
          if (!isNullOrEmpty(this.userMaxExtent)) {
            maxExtent = this.userMaxExtent;
          }
          resolve(maxExtent);
        });
      } else {
        resolve(maxExtent);
      }
    });
  }


  /**
   * Este método establece la extensión máxima para esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @param {String|Array<String>|Array<Number>|Mx.Extent} maxExtentParam La extensión máxima.
   * @param {Boolean} zoomToExtent Establecer "bbox".
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  setMaxExtent(maxExtentParam, zoomToExtent = true) {
    // checks if the param is null or empty
    if (isNullOrEmpty(maxExtentParam)) {
      this.resetMaxExtent();
    }

    // checks if the implementation can set the maxExtent
    if (isUndefined(MapImpl.prototype.setMaxExtent)) {
      Exception(getValue('exception').setmaxextent_method);
    }

    // parses the parameter
    try {
      let maxExtent = parameter.maxExtent(maxExtentParam);
      if (!isArray(maxExtent) && isObject(maxExtent)) {
        maxExtent = [
          maxExtent.x.min,
          maxExtent.y.min,
          maxExtent.x.max,
          maxExtent.y.max,
        ];
      }
      this.userMaxExtent = maxExtent;
      this.getImpl().setMaxExtent(maxExtent, zoomToExtent);
    } catch (err) {
      Dialog.error(err.toString());
      throw err;
    }
    return this;
  }

  /**
   * Este método restablece la extensión máxima del Mapa.
   *
   * @public
   * @function
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  resetMaxExtent() {
    this.userMaxExtent = null;
    this.calculateMaxExtent().then((maxExtentParam) => {
      const maxExtent = parameter.maxExtent(maxExtentParam);
      this.getImpl().setMaxExtent(maxExtent, true);
    });
    return this;
  }

  /**
   * Este método proporciona la extensión actual ("bbox") de esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @returns {Mx.Extent} Regresa el "Bbox".
   * @api
   */
  getBbox() {
    // checks if the implementation can set the maxExtent
    if (isUndefined(MapImpl.prototype.getBbox)) {
      Exception(getValue('exception').getbbox_method);
    }

    const bbox = this.getImpl().getBbox();

    return bbox;
  }

  /**
   * Este método establece el "bbox" para esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @param {String|Array<String>|Array<Number>|Mx.Extent} bboxParam El "bbox".
   * @param {Object} vendorOpts Opciones de proveedores.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  setBbox(bboxParam, vendorOpts) {
    // checks if the param is null or empty
    if (isNullOrEmpty(bboxParam)) {
      Exception(getValue('exception').no_bbox);
    }

    // checks if the implementation can set the maxExtent
    if (isUndefined(MapImpl.prototype.setBbox)) {
      Exception(getValue('exception').setbbox_method);
    }

    try {
      // parses the parameter
      const bbox = parameter.maxExtent(bboxParam);
      this.getImpl().setBbox(bbox, vendorOpts);
    } catch (err) {
      Dialog.error(getValue('exception').incorrect_format_bbox);
      throw err;
    }
    return this;
  }

  /**
   * Este método proporciona el zoom actual de esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @returns {Number} Devuelve el zoom actual.
   * @api
   */
  getZoom() {
    // checks if the implementation can get the zoom
    if (isUndefined(MapImpl.prototype.getZoom)) {
      Exception(getValue('exception').getzoom_method);
    }

    const zoom = this.getImpl().getZoom();

    return zoom;
  }

  /**
   * Este método proporciona el zoom mínimo de esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @returns {Number} Devuelve el zoom mínimo actual.
   * @api
   */
  getMinZoom() {
    // checks if the implementation can get the zoom
    if (isUndefined(MapImpl.prototype.getMinZoom)) {
      Exception(getValue('exception').getzoom_method);
    }

    const zoom = this.getImpl().getMinZoom();

    return zoom;
  }

  /**
   * Este método proporciona el zoom máximo de esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @returns {Number} Devuelve el zoom máximo actual.
   * @api
   */
  getMaxZoom() {
    // checks if the implementation can get the zoom
    if (isUndefined(MapImpl.prototype.getMaxZoom)) {
      Exception(getValue('exception').getzoom_method);
    }

    const zoom = this.getImpl().getMaxZoom();

    return zoom;
  }

  /**
   * Este método establece el zoom para esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @param {String|Number} zoomParam El zoom.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  setZoom(zoomParam) {
    // checks if the param is null or empty
    if (isNullOrEmpty(zoomParam)) {
      Exception(getValue('exception').no_zoom);
    }

    // checks if the implementation can set the zoom
    if (isUndefined(MapImpl.prototype.setZoom)) {
      Exception(getValue('exception').setzoom_method);
    }

    try {
      // parses the parameter
      const zoom = parameter.zoom(zoomParam);
      this._userZoom = zoom;
      this.getImpl().setZoom(zoom);
    } catch (err) {
      Dialog.error(err.toString());
      throw err;
    }

    return this;
  }

  /**
   * Este método establece el zoom mínimo para esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @param {String|Number} zoomParam El zoom.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  setMinZoom(zoomParam) {
    if (isNullOrEmpty(zoomParam)) {
      Exception(getValue('exception').no_zoom);
    }

    if (isUndefined(MapImpl.prototype.setMinZoom)) {
      Exception(getValue('exception').setzoom_method);
    }

    const minZoom = parameter.minZoom(zoomParam);
    this.minZoom = minZoom;
    this.getImpl().setMinZoom(minZoom);
    return this;
  }

  /**
   * Este método establece el zoom máximo para esta
   * instancia del de mapa.
   *
   * @public
   * @function
   * @param {String|Number} zoomParam El zoom.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  setMaxZoom(zoomParam) {
    if (isNullOrEmpty(zoomParam)) {
      Exception(getValue('exception').no_zoom);
    }

    if (isUndefined(MapImpl.prototype.setMaxZoom)) {
      Exception(getValue('exception').setzoom_method);
    }

    const maxZoom = parameter.maxZoom(zoomParam);
    this.userMaxZoom_ = maxZoom;
    this.getImpl().setMaxZoom(maxZoom);
    return this;
  }

  /**
   * Este método proporciona el centro actual de esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @returns {Array<Number>} Las coordenadas del centro del mapa.
   * @api
   */
  getCenter() {
    // checks if the implementation can get the center
    if (isUndefined(MapImpl.prototype.getCenter)) {
      Exception(getValue('exception').getcenter_method);
    }

    const center = this.getImpl().getCenter();

    return center;
  }

  /**
   * Este método establece el centro para esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @param {String|Array<String>|Array<Number>|Mx.Center} centerParam El nuevo centro.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  setCenter(centerParam) {
    // checks if the param is null or empty
    if (isNullOrEmpty(centerParam)) {
      Exception(getValue('exception').no_center);
    }

    // checks if the implementation can set the center
    if (isUndefined(MapImpl.prototype.setCenter)) {
      Exception(getValue('exception').setcenter_method);
    }

    // parses the parameter
    // try {
    const center = parameter.center(centerParam);
    this.getImpl().setCenter(center);
    this.userCenter_ = center;
    if (center.draw === true) {
      this.drawLayer_.clear();

      this.centerFeature_ = new Feature('__mapeacenter__', {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [center.x, center.y],
        },
        properties: {
          vendor: {
            mapea: { // TODO mig
              click: (evt) => {
                const label = this.getLabel();
                if (!isNullOrEmpty(label)) {
                  label.show(this);
                }
              },
            },
          },
        },
      });
      this.drawFeatures([this.centerFeature_]);
    }
    // }
    // catch (err) {
    //   Dialog.error(err.toString());
    //   throw err;
    // }

    return this;
  }

  /**
   * Este método devuelve el centro de un elemento geográfico.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @returns {Array<Number>} Centro de un elemento geográfico.
   * @function
   * @api
   */
  getFeatureCenter() {
    return this.centerFeature_;
  }

  /**
   * Este método elimina el centro del mapa.
   *
   * @public
   * @function
   * @api
   */
  removeCenter() {
    this.removeFeatures(this.centerFeature_);
    this.centerFeature_ = null;
    this.zoomToMaxExtent();
  }

  /**
   * Este método proporciona las resoluciones de esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @returns {Array<Number>} Resoluciones de esta
   * instancia del mapa.
   * @api
   */
  getResolutions() {
    // checks if the implementation can set the maxExtent
    if (isUndefined(MapImpl.prototype.getResolutions)) {
      Exception(getValue('exception').getresolutions_method);
    }

    const resolutions = this.getImpl().getResolutions();

    return resolutions;
  }

  /**
   * Este método establece las resoluciones para esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @param {String|Array<String>|Array<Number>} resolutionsParam Las resoluciones.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  setResolutions(resolutionsParam) {
    // checks if the param is null or empty
    if (isNullOrEmpty(resolutionsParam)) {
      Exception(getValue('exception').no_resolutions);
    }

    // checks if the implementation can set the setResolutions
    if (isUndefined(MapImpl.prototype.setResolutions)) {
      Exception(getValue('exception').setresolutions_method);
    }

    // parses the parameter
    const resolutions = parameter.resolutions(resolutionsParam);

    this.getImpl().setResolutions(resolutions);

    return this;
  }

  /**
   * Este método proporciona la escala actual de esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @returns {Mx.Projection} Escala de devolución.
   * @api
   */
  getScale() {
    // checks if the implementation has the method
    if (isUndefined(MapImpl.prototype.getScale)) {
      Exception(getValue('exception').getscale_method);
    }

    const scale = this.getImpl().getScale();

    return scale;
  }

  /**
   * Este método proporciona la escala actual de esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @returns {Mx.Projection} Devuelve la escala.
   * @api
   */
  getExactScale() {
    // checks if the implementation has the method
    if (isUndefined(MapImpl.prototype.getExactScale)) {
      Exception('La implementación usada no posee el método getScale');
    }

    const scale = this.getImpl().getExactScale();

    return scale;
  }

  /**
   * Este método proporciona la proyección actual de esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @returns {Mx.Projection} Devuelve la proyección.
   * @api
   */
  getProjection() {
    // checks if the implementation has the method
    if (isUndefined(MapImpl.prototype.getProjection)) {
      Exception(getValue('exception').getprojection_method);
    }

    const projection = this.getImpl().getProjection();

    return projection;
  }

  /**
   * Este método establece la proyección para esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @param {String|Mx.Projection} projection EL "bbox".
   * @param {Boolean} asDefault Utiliza la proyección por defecto.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  setProjection(projectionParam, asDefault) {
    let projection = projectionParam;
    // checks if the param is null or empty
    if (isNullOrEmpty(projection)) {
      Exception(getValue('exception').no_projection);
    }

    // checks if the implementation can set the projection
    if (isUndefined(MapImpl.prototype.setProjection)) {
      Exception(getValue('exception').setprojection_method);
    }

    // parses the parameter
    try {
      const oldProj = this.getProjection();
      projection = parameter.projection(projection);
      this.getImpl().setProjection(projection);
      this._defaultProj = (this._defaultProj && (asDefault === true));
      this.fire(EventType.CHANGE_PROJ, [oldProj, projection]);
    } catch (err) {
      Dialog.error(err.toString());
      if (String(err).indexOf('El formato del parámetro projection no es correcto') >= 0) {
        this.setProjection(M.config.DEFAULT_PROJ, true);
      }
    }

    return this;
  }

  /**
   * Este método devuelve todos los complementos agregados al mapa.
   *
   * @public
   * @function
   * @param {Mx.Plugin} namesParam Nombre del plugin.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  getPlugins(namesParam) {
    let names = namesParam;
    // parses parameters to Array
    if (isNull(names)) {
      names = [];
    } else if (!isArray(names)) {
      names = [names];
    }

    let plugins = [];

    // parse to Array
    if (names.length === 0) {
      plugins = this._plugins;
    } else {
      names.forEach((name) => {
        plugins = plugins.concat(this._plugins.filter((plugin) => {
          return (name === plugin.name);
        }));
      });
    }
    return plugins;
  }

  /**
   * Este método agrega una instancia de un especificado
   * complemento desarrollado.
   *
   * @public
   * @function
   * @param {Mx.Plugin} plugin Agrega los plugins al mapa.
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  addPlugin(plugin) {
    // checks if the param is null or empty
    if (isNullOrEmpty(plugin)) {
      Exception(getValue('exception').no_plugins);
    }

    // checks if the plugin can be added to the map
    if (isUndefined(plugin.addTo)) {
      Exception(getValue('exception').no_add_plugin_to_map);
    }

    this._plugins.push(plugin);
    plugin.addTo(this);

    return this;
  }

  /**
   * Este método elimina los complementos especificados del mapa.
   *
   * @function
   * @param {Array<Plugin>} plugins Especificado por el usuario.
   * @returns {Map} Devolver estado del mapa.
   * @api
   */
  removePlugins(pluginsParam) {
    let plugins = pluginsParam;
    // checks if the parameter is null or empty
    if (isNullOrEmpty(plugins)) {
      Exception(getValue('exception').no_plugin_to_remove);
    }
    if (!isArray(plugins)) {
      plugins = [plugins];
    }

    plugins = [].concat(plugins);
    if (plugins.length > 0) {
      // removes controls from their panels
      plugins.forEach((plugin) => {
        plugin.destroy();
        this._plugins = this._plugins.filter(plugin2 => plugin.name !== plugin2.name);
      });
    }

    return this;
  }

  /**
   * Este método proporciona la promesa de un alcance envolvido de esta
   * instancia del mapa.
   *
   * @public
   * @function
   * @returns {Promise} Devuelve la extensión máxima, asíncrono.
   * @api
   */
  getEnvolvedExtent() {
    return new Promise((resolve) => {
      // 1 check the WMC extent
      const visibleBaseLayer = this.getBaseLayers().find(layer => layer.isVisible());
      if (!isNullOrEmpty(visibleBaseLayer)) {
        visibleBaseLayer.getMaxExtent(resolve);
      } else {
        const layers = this.getLayers().filter(layer => layer.name !== '__draw__');
        Promise.all(layers.map(layer => layer.calculateMaxExtent()))
          .then((extents) => {
            const extentsToCalculate =
              isNullOrEmpty(extents) ? [this.getProjection().getExtent()] : extents;
            const envolvedMaxExtent = getEnvolvedExtent(extentsToCalculate);
            resolve(envolvedMaxExtent);
          });
      }
    });
  }

  /**
   * Este método obtiene y amplía el mapa en el
   * extensión calculada.
   *
   * @public
   * @function
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  zoomToMaxExtent(keepUserZoom) {
    this.calculateMaxExtent().then((maxExtent) => {
      if (keepUserZoom !== true || isNullOrEmpty(this._userZoom)) {
        this.setBbox(maxExtent);
      }
      this._finishedMaxExtent = true;
      this._checkCompleted();
    });
    return this;
  }

  /**
   * Este método agrega un ticket para controlar capas seguras.
   *
   * @public
   * @function
   * @param {String} ticket Ticket del usuario.
   * @api
   */
  setTicket(ticket) {
    if (!isNullOrEmpty(ticket)) {
      if (M.config.PROXY_POST_URL.indexOf('ticket=') === -1) {
        M.config('PROXY_POST_URL', addParameters(M.config.PROXY_POST_URL, { ticket }));
      }
      if (M.config.PROXY_URL.indexOf('ticket=') === -1) {
        M.config('PROXY_URL', addParameters(M.config.PROXY_URL, { ticket }));
      }
    }

    return this;
  }

  /**
   * Este método devuelve el centro inicial del mapa.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @function
   * @returns {Array<Number>} Devuelve el centro, asíncrono.
   * @api
   */
  getInitCenter_() {
    return new Promise((success, fail) => {
      this.calculateMaxExtent().then((extent) => {
        let center;
        if (isArray(extent)) {
          center = {
            x: ((extent[0] + extent[2]) / 2),
            y: ((extent[1] + extent[3]) / 2),
          };
        } else {
          center = {
            x: ((extent.x.max + extent.x.min) / 2),
            y: ((extent.y.max + extent.y.min) / 2),
          };
        }
        success(center);
      });
    });
  }

  /**
   * Este método destruye el mapa, limpiando el HTML
   * y anular el registro de todos los eventos.
   *
   * @public
   * @function
   * @returns {Map} Devuelve el estado del mapa.
   * @api
   */
  destroy() {
    // checks if the implementation can provide the implementation map
    if (isUndefined(MapImpl.prototype.destroy)) {
      Exception(getValue('exception').destroy_method);
    }

    this.getImpl().destroy();

    return this;
  }

  /**
   * Añade la etiqueta.
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam Colecciones de etiquetas.
   * @api
   */
  addLabel(labelParam, coordParam) {
    const panMapIfOutOfView = labelParam.panMapIfOutOfView === undefined ?
      true :
      labelParam.panMapIfOutOfView;
    // checks if the param is null or empty
    if (isNullOrEmpty(labelParam)) {
      Exception(getValue('exception').no_projection);
    }

    // checks if the implementation can add labels
    if (isUndefined(MapImpl.prototype.addLabel)) {
      Exception(getValue('exception').addlabel_method);
    }

    let text = null;
    let coord = null;

    // object
    if (isObject(labelParam)) {
      text = escapeJSCode(labelParam.text);
      coord = labelParam.coord;
    } else {
      // string
      text = escapeJSCode(labelParam);
      coord = coordParam;
    }

    if (isNullOrEmpty(coord)) {
      coord = this.getCenter();
    } else {
      coord = parameter.center(coord);
    }

    if (isNullOrEmpty(coord)) {
      this.getInitCenter_().then((initCenter) => {
        const label = new Label(text, initCenter, panMapIfOutOfView);
        this.getImpl().addLabel(label);
      });
    } else {
      const label = new Label(text, coord, panMapIfOutOfView);
      this.getImpl().addLabel(label);
    }

    return this;
  }

  /**
   * Devuelve las etiquetas.
   *
   * @function
   * @returns {Array<object>} Devuelve las etiquetas.
   * @api
   */
  getLabel() {
    return this.getImpl().getLabel();
  }

  /**
   * Elimina las etiquetas.
   *
   * @function
   * @returns {Array<object>} Devuelve las etiquetas.
   * @api
   */
  removeLabel() {
    return this.getImpl().removeLabel();
  }

  /**
   * Dibujar puntos.
   *
   * @function
   * @param {Array<Mx.Point>|Mx.Point} points Colección de puntos.
   * @api
   */
  drawPoints(pointsVar) {
    let points = pointsVar;
    // checks if the param is null or empty
    if (isNullOrEmpty(points)) {
      Exception(getValue('exception').no_point);
    }

    if (!isArray(points)) {
      points = [points];
    }

    const features = points.map((point) => {
      const gj = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.x, point.y],
        },
        properties: {},
      };
      if (isFunction(point.click)) {
        gj.properties.vendor = {
          mapea: {
            click: point.click,
          },
        };
      }
      return new Feature(null, gj);
    });
    this.drawLayer_.addFeatures(features);
  }

  /**
   * Dibuja objetos geográficos.
   *
   * @function
   * @param {Array<Feature>|Feature} features Colección de objetos geográficos.
   * @api
   */
  drawFeatures(features) {
    this.drawLayer_.addFeatures(features);
    return this;
  }

  /**
   * Elimina los objetos geográficos.
   *
   * @function
   * @param {Array<Feature>|Feature} features Colección de objetos geográficos.
   * @api
   */
  removeFeatures(features) {
    this.drawLayer_.removeFeatures(features);
    return this;
  }

  /**
   * Añade los paneles.
   *
   * @function
   * @api
   * @returns {Map} Devuelve el estado del mapa.
   */
  addPanels(panelsVar) {
    let panels = panelsVar;
    if (!isNullOrEmpty(panels)) {
      if (!isArray(panels)) {
        panels = [panels];
      }
      panels.forEach((panel) => {
        const isIncluded = this._panels.some(panel2 => panel2.equals(panel));
        if ((panel instanceof Panel) && !isIncluded) {
          this._panels.push(panel);
          const queryArea = 'div.m-area'.concat(panel.position);
          const areaContainer = this._areasContainer.querySelector(queryArea);
          panel.addTo(this, areaContainer);
        }
      });
    }
    return this;
  }

  /**
   * Elimina un panel del mapa.
   *
   * @function
   * @api
   * @returns {Map} Devuelve el estado del mapa.
   */
  removePanel(panel) {
    if (panel.getControls().length > 0) {
      Exception(getValue('exception').remove_control_from_panel);
    }
    if (panel instanceof Panel) {
      panel.destroy();
      this._panels = this._panels.filter(panel2 => !panel2.equals(panel));
    }

    return this;
  }

  /**
   * Devuelve los paneles.
   *
   * @function
   * @api
   * @returns {array<Panel>} Colección de paneles.
   */
  getPanels(namesVar) {
    let names = namesVar;
    let panels = [];

    // parses parameters to Array
    if (isNullOrEmpty(names)) {
      panels = this._panels;
    } else {
      if (!isArray(names)) {
        names = [names];
      }
      names.forEach((name) => {
        const filteredPanels = this._panels.filter(panel => panel.name === name);
        filteredPanels.forEach((panel) => {
          if (!isNullOrEmpty(panel)) {
            panels.push(panel);
          }
        });
      });
    }

    return panels;
  }

  /**
   * Crea paneles.
   * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
   * @public
   * @function
   * @api
   */
  createMainPanels_() {
    // areas container
    this._areasContainer = document.createElement('div');
    this._areasContainer.classList.add('m-areas');

    // top-left area
    const tlArea = document.createElement('div');
    tlArea.classList.add('m-area');
    tlArea.classList.add('m-top');
    tlArea.classList.add('m-left');
    // top-right area
    const trArea = document.createElement('div');
    trArea.classList.add('m-area');
    trArea.classList.add('m-top');
    trArea.classList.add('m-right');

    // bottom-left area
    const blArea = document.createElement('div');
    blArea.classList.add('m-area');
    blArea.classList.add('m-bottom');
    blArea.classList.add('m-left');
    // bottom-right area
    const brArea = document.createElement('div');
    brArea.classList.add('m-area');
    brArea.classList.add('m-bottom');
    brArea.classList.add('m-right');

    this._areasContainer.appendChild(tlArea);
    this._areasContainer.appendChild(trArea);
    this._areasContainer.appendChild(blArea);
    this._areasContainer.appendChild(brArea);

    this.getContainer().appendChild(this._areasContainer);
  }

  /**
   * Este método proporciona el contenedor.
   *
   * @function
   * @api
   * @returns {Object} Devuelve el contenedor.
   */
  getContainer() { // checks if the implementation can provides the container
    if (isUndefined(MapImpl.prototype.getContainer)) {
      Exception(getValue('exception').getcontainer_method);
    }
    return this.getImpl().getContainer();
  }

  /**
   * Este método proporciona la implementación el mapa.
   *
   * @function
   * @api
   * @returns {Object} Implementación el mapa.
   */
  getMapImpl() {
    // checks if the implementation can add points
    if (isUndefined(MapImpl.prototype.getMapImpl)) {
      Exception(getValue('exception').getmapimpl_method);
    }
    return this.getImpl().getMapImpl();
  }

  /**
   * Devuelve "Popup".
   *
   * @function
   * @api
   * @returns {Popup} Devuelve "Popup".
   */
  getPopup() {
    return this.popup_;
  }

  /**
   * Elimina "Popup".
   *
   * @function
   * @api
   * @returns {Map} Devuelve el estado del mapa.
   */
  removePopup() {
    // checks if the implementation can add popups
    if (isUndefined(MapImpl.prototype.removePopup)) {
      Exception(getValue('exception').removepopup_method);
    }

    if (!isNullOrEmpty(this.popup_)) {
      this.getImpl().removePopup(this.popup_);
      this.popup_.destroy();
      this.popup_ = null;
    }

    return this;
  }

  /**
   * Añade el "Popup".
   *
   * @function
   * @api
   * @returns {Map} Devuelve el estado del mapa.
   */
  addPopup(popup, coordinate) {
    // checks if the param is null or empty
    if (isNullOrEmpty(popup)) {
      Exception(getValue('exception').no_popup);
    }

    if (!(popup instanceof Popup)) {
      Exception(getValue('exception').invalid_popup);
    }

    if (!isNullOrEmpty(this.popup_)) {
      this.removePopup();
    }
    this.popup_ = popup;
    this.popup_.addTo(this, coordinate);

    return this;
  }

  /**
   * Evento, compruebe que el mapa está cargado.
   *
   * @public
   * @function
   */
  _checkCompleted() {
    if (this._finishedInitCenter && this._finishedMaxExtent && this._finishedMapImpl) {
      this._finishedMap = true;
      this.fire(EventType.COMPLETED);
    }
  }

  /**
   * Establece la devolución de llamada cuando se carga la instancia.
   *
   * @public
   * @function
   * @param {M.evt} eventType Tipo de evento.
   * @param {Function} listener "Callback".
   * @param {Object} optThis Opciones de la instancia del mapa.
   * @api
   */
  on(eventType, listener, optThis) {
    super.on(eventType, listener, optThis);
    if ((eventType === EventType.COMPLETED) && (this._finishedMap === true)) {
      this.fire(EventType.COMPLETED);
    }
  }

  /**
   * Esta función actualiza el estado de la instancia del mapa.
   *
   * @function
   * @api
   * @returns {Map} Devuelve el estado del mapa.
   */
  refresh() {
    // checks if the implementation has refresh method
    if (!isUndefined(this.getImpl().refresh) && isFunction(this.getImpl().refresh)) {
      this.getImpl().refresh();
    }
    this.getLayers().forEach(layer => layer.refresh());
    return this;
  }

  /**
   * Devuelve la proyección por defecto.
   * @public
   * @function
   * @returns {Mx.Projection} Proyección por defecto.
   * @api
   */
  get defaultProj() {
    return this._defaultProj;
  }

  /**
   * Ordenar capas por zindex.
   * @public
   * @function
   * @param {M.layer} layer1 Capa.
   * @param {M.layer} layer2 Otra Capa.
   * @api
   */
  static LAYER_SORT(layer1, layer2) {
    if (!isNullOrEmpty(layer1) && !isNullOrEmpty(layer2)) {
      const z1 = layer1.getZIndex();
      const z2 = layer2.getZIndex();

      return (z1 - z2);
    }

    // equals
    return 0;
  }

  /**
   * Este método devuelve verdadero si el mapa y su implementación están completos.
   * @public
   * @returns {bool} Verdadero si termino.
   */
  isFinished() {
    return this._finishedMap;
  }

  /**
   * Devuelve las areas del contenedor.
   * @public
   * @returns {M.map.areaContainer} Devuelve las areas del contenedor.
   */
  get areasContainer() {
    return this._areasContainer;
  }
}

/**
 * Opciones de estilo de capa.
 *
 * @const
 * @type {object}
 * @public
 * @api
 */
Map.DRAWLAYER_STYLE = {
  fill: {
    color: '#009e00',
  },
  stroke: {
    color: '#fcfcfc',
    width: 2,
  },
  radius: 7,
};

export default Map;
