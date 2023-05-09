/**
 * @module M/impl/layer/MBTiles
 */
import { isNullOrEmpty } from 'M/util/Utils';
import { get as getProj, transformExtent } from 'ol/proj';
import OLLayerTile from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import { getBottomLeft, getWidth } from 'ol/extent';
import { XYZ } from 'ol/source';
import ImplMap from '../Map';
import Layer from './Layer';
import TileProvider, { DEFAULT_WHITE_TILE } from '../../../../facade/js/provider/Tile';

/**
 * Tamaño de la tesela de MBTiles por defecto
 *
 * @const
 * @public
 * @type {number}
 */
const DEFAULT_TILE_SIZE = 256;

/**
 * Este método calcula las resoluciones a partir de los
 * parámetros especificados
 *
 * @function
 * @param {Mx.Extent} extent Extensión
 * @param {number} tileSize Tamaño de la tesela vectorial
 * @param { Number } maxZoomLevel Nivel máximo de zoom
 * @returns {Array<Number>} Resoluciones obtenidas
 * @public
 * @api
 */
const generateResolutions = (extent, tileSize, maxZoomLevel) => {
  const width = getWidth(extent);
  const size = width / tileSize;
  const resolutions = new Array(maxZoomLevel + 1);
  for (let z = 0; z < maxZoomLevel + 1; z += 1) {
    resolutions[z] = size / (2 ** z);
  }
  return resolutions;
};

/**
 * @classdesc
 * Implementación de la capa MBTiles.
 *
 * @property {function} tileLoadFunction_ Función de carga de la tesela vectorial.
 * @property {string} url_ URL del fichero o servicio que genera el MBTiles.
 * @property {Response} source_ Fuente de la capa.
 * @property {number} tileSize_ Tamaño de la tesela vectorial.
 * @property {Mx.Extent} maxExtent_ La medida en que restringe la visualización
 * a una región específica.
 * @property {number} maxZoomLevel_ Zoom máximo aplicable a la capa.
 * @property {number} opacity_ Opacidad de capa.
 * @property {number} zIndex_ zIndex de la capa.
 * @property {boolean} visibility Define si la capa es visible o no.
 *
 * @api
 * @extends {M.impl.Layer}
 */
class MBTiles extends Layer {
  /**
   * Constructor principal de la clase. Crea una capa de implementación MBTiles
   * con parámetros especificados por el usuario.
   *
   * @constructor
   * @param {String|Mx.parameters.MBTiles} userParameters Parámetros para
   * la construcción de la capa.
   * - name: Nombre de la capa en la leyenda.
   * - url: Url del fichero o servicio que genera el MBTiles.
   * - maxZoomLevel: Zoom máximo aplicable a la capa.
   * - type: Tipo de la capa.
   * - transparent: Falso si es una capa base, verdadero en caso contrario.
   * - maxExtent: La medida en que restringe la visualización a una región específica.
   * - legend: Indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
   * - tileLoadFunction: Función de carga de la tesela proporcionada por el usuario.
   * - source: Fuente de la capa.
   * - tileSize: Tamaño de la tesela, por defecto 256.
   * - visibility: Define si la capa es visible o no. Verdadero por defecto.
   * @param {Mx.parameters.LayerOptions} options Opciones personalizadas para esta capa.
   * - opacity: Opacidad de capa, por defecto 1.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * <pre><code>
   * import OLTileGrid from 'ol/tilegrid/TileGrid';
   * import MBTilesSource from 'M/source/MBTiles';
   * {
   *  source: new MBTilesSource({
   *    tileGrid: new OLTileGrid({
   *      extent: ...,
   *      ...
   *    })
   *  })
   * }
   * </code></pre>
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);

    /**
     * User tile load function
     * @public
     * @type {function}
     */
    this.tileLoadFunction = userParameters.tileLoadFunction || null;

    /**
     * MBTiles url
     * @private
     * @type {string}
     */
    this.url_ = userParameters.url;

    /**
     * MBTiles source
     * @type {ArrayBuffer|Uint8Array|Response|File}
     */
    this.source_ = userParameters.source;

    /**
     * Layer extent
     * @private
     * @type {Mx.Extent}
     */
    this.maxExtent_ = userParameters.maxExtent || null;

    /**
     * Layer opacity
     * @private
     * @type {number}
     */
    this.opacity_ = typeof userParameters.opacity === 'number' ? userParameters.opacity : 1;

    /**
     * Z-index of the layer
     * @private
     * @type {number}
     */
    this.zIndex_ = ImplMap.Z_INDEX.MBTiles;

    /**
     * Zoom levels of the layer
     * @private
     * @type {number}
     */
    this.maxZoomLevel_ = userParameters.maxZoomLevel || null;

    /**
     * Visibility parameter
     * @private
     * @type {bool}
     */
    this.visibility = userParameters.visibility === false ? userParameters.visibility : true;
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
      if (!isNullOrEmpty(this.olLayer)) {
        this.olLayer.setVisible(visibility);
      }

      // updates resolutions and keep the bbox
      this.map.getImpl().updateResolutionsFromBaseLayer();
    } else if (!isNullOrEmpty(this.olLayer)) {
      this.olLayer.setVisible(visibility);
    }
  }

  /**
   * Esta función devuelve el extent de la capa
   * @function
   * @return {Promise<array<number>>}
   * @api
   */
  getExtentFromProvider() {
    return new Promise((resolve) => {
      this.fetchSource().then((tileProvider) => {
        tileProvider.getExtent().then((extent) => {
          const { code } = this.map.getProjection();
          let reprojectedExtent;
          if (extent) {
            reprojectedExtent = transformExtent(extent, 'EPSG:4326', code);
          }
          resolve(reprojectedExtent);
        });
      });
    });
  }

  /**
   * Esta función devuelve el nivel máximo de zoom
   * @function
   * @return {Number}
   * @api
   */
  getMaxZoomLevel() {
    return this.maxZoomLevel_;
  }

  /**
   * Este método establece el objeto de mapa de la capa.
   *
   * @function
   * @public
   * @param {M.Map} map Mapa.
   * @api
   */
  addTo(map) {
    this.map = map;
    const { code } = this.map.getProjection();
    const projection = getProj(code);
    const extent = projection.getExtent();

    if (!this.tileLoadFunction) {
      this.fetchSource().then((tileProvider) => {
        tileProvider.getMaxZoomLevel().then((maxZoomLevel) => {
          if (!this.maxZoomLevel_) {
            this.maxZoomLevel_ = maxZoomLevel;
          }
          const resolutions = generateResolutions(extent, DEFAULT_TILE_SIZE, this.maxZoomLevel_);
          this.getExtentFromProvider().then((reprojectedExtent) => {
            this.olLayer = this.createLayer({
              tileProvider,
              resolutions,
              extent: reprojectedExtent || extent,
              sourceExtent: extent,
              projection,
            });
            this.map.getMapImpl().addLayer(this.olLayer);
          });
        });
      });
    } else {
      const resolutions = generateResolutions(extent, DEFAULT_TILE_SIZE, this.maxZoomLevel_ || 16);
      this.olLayer = this.createLayer({
        resolutions,
        extent,
        sourceExtent: extent,
        projection,
      });
      this.map.getMapImpl().addLayer(this.olLayer);
    }
  }

  /**
   * Esta función crea la implementación de la capa
   *
   * @function
   * @public
   * @param {Object} opts Opciones
   * @return {ol/layer/Tile}
   * @api
   */
  createLayer(opts) {
    let tileLoadFn = this.loadTileWithProvider;
    if (this.tileLoadFunction) {
      tileLoadFn = this.loadTile;
    }
    const layer = new OLLayerTile({
      visible: this.visibility,
      opacity: this.opacity_,
      zIndex: this.zIndex_,
      extent: this.maxExtent_ || opts.sourceExtent,
      source: new XYZ({
        url: '{z},{x},{y}',
        projection: opts.projection,
        tileLoadFunction: tile => tileLoadFn(tile, opts.tileProvider, this),
        tileGrid: new TileGrid({
          extent: opts.sourceExtent,
          origin: getBottomLeft(opts.sourceExtent),
          resolutions: opts.resolutions,
        }),
      }),
    });
    return layer;
  }

  /**
   * Este método es la función personalizada de carga de la tesela.
   *
   * @function
   * @param {ol/Tile} tile Tesela vectorial.
   * @param {M/provider/Tile } target Tesela Proveedora.
   * @public
   * @api
   */
  // no quitar opts
  loadTile(tile, opts, target) {
    const imgTile = tile;
    const tileCoord = tile.getTileCoord();
    target.tileLoadFunction(tileCoord[0], tileCoord[1], -tileCoord[2] - 1).then((tileSrc) => {
      if (tileSrc) {
        imgTile.getImage().src = tileSrc;
      } else {
        imgTile.getImage().src = DEFAULT_WHITE_TILE;
      }
    });
  }

  /**
   * Este método es la función personalizada de carga de la tesela.
   *
   * @function
   * @param {ol.Tile} tile Tesela.
   * @param {M.provider.Tile} tileProvider Proveedor de la tesela.
   * @public
   * @api
   */
  loadTileWithProvider(tile, tileProvider) {
    const imgTile = tile;
    const tileCoord = tile.getTileCoord();
    const tileSrc = tileProvider.getTile([tileCoord[0], tileCoord[1], -tileCoord[2] - 1]);
    imgTile.getImage().src = tileSrc;
  }

  /**
   * Este método busca la fuente de la capa.
   *
   * @function
   * @returns {Object} Promesa con el resultado de la
   * búsqueda de la fuente.
   * @public
   * @api
   */
  fetchSource() {
    return new Promise((resolve, reject) => {
      if (this.tileProvider_) {
        resolve(this.tileProvider_);
      } else if (this.source_) {
        const tileProvider = new TileProvider(this.source_);
        this.tileProvider_ = tileProvider;
        resolve(tileProvider);
      } else if (this.url_) {
        window.fetch(this.url_).then((response) => {
          this.source = response;
          const tileProvider = new TileProvider(response);
          this.tileProvider_ = tileProvider;
          resolve(tileProvider);
        });
      } else {
        reject(new Error('No source was specified.'));
      }
    });
  }

  /**
   * Este método establece la clase de la fachada
   * de MBTiles.
   *
   * @function
   * @param {Object} Objeto a establecer como fachada.
   * @public
   * @api
   */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
  }

  /**
   * Este método establece la máxima extensión de la capa.
   *
   * @function
   * @param {Mx.Extent} maxExtent Máxima extensión.
   * @public
   * @api
   */
  setMaxExtent(maxExtent) {
    this.olLayer.setExtent(maxExtent);
  }

  /**
   * Este método obtiene la mínima resolución de la capa.
   *
   * @function
   * @public
   * @api
   * @returns {number} Mínima resolución.
   */
  getMinResolution() {}

  /**
   * Este método obtiene la máxima resolución de la capa.
   *
   * @function
   * @public
   * @api
   * @returns {number} Máxima resolución.
   */
  getMaxResolution() {}

  /**
   * Este método destruye esta capa, limpiando
   * el HTML y desregistrando todos los eventos.
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.olLayer)) {
      olMap.removeLayer(this.olLayer);
      this.olLayer = null;
    }
    this.map = null;
  }

  /**
   * Este método comprueba si un objeto es igual
   * a esta capa.
   *
   * @function
   * @param {Object} obj Objeto a comparar.
   * @returns {Boolean} Valor verdadero es igual, falso no lo es.
   * @public
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof MBTiles) {
      equals = (this.name === obj.name);
    }
    return equals;
  }

  /**
   * Este método devuelve una copia de la capa de esta instancia.
   *
   * @function
   * @returns {ol.layer.Tile} Copia de la capa.
   * @public
   * @api
   */
  cloneOLLayer() {
    let olLayer = null;
    if (this.olLayer != null) {
      const properties = this.olLayer.getProperties();
      olLayer = new OLLayerTile(properties);
    }
    return olLayer;
  }
}
export default MBTiles;
