/**
 * @module M/impl/layer/MBTiles
 */
import { isNullOrEmpty } from 'M/util/Utils';
import { get as getProj } from 'ol/proj';
import OLLayerTile from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import { getBottomLeft, getWidth } from 'ol/extent';
import MBTilesSource from '../source/MBTiles';
import ImplMap from '../Map';
import Layer from './Layer';
import TileProvider from '../../../../facade/js/provider/Tile';

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
  * @param {Array<Number>} zoomLevels Niveles de zoom
  * @returns {Array<Number>} Resoluciones obtenidas
  * @public
  * @api
  */
const generateResolutions = (extent, tileSize, zoomLevels) => {
  const width = getWidth(extent);
  const size = width / tileSize;
  const resolutions = new Array(zoomLevels);
  for (let z = 0; z < zoomLevels; z += 1) {
    resolutions[z] = size / (2 ** z);
  }
  return resolutions;
};

/**
  * @classdesc
  * Implementación de la capa MBTiles.
  *
  * @property {function} tileLoadFunction_ Función de carga de la tesela vectorial.
  * @property {string} url_ Url del fichero o servicio que genera el MBTilesVector.
  * @property {ArrayBuffer|Uint8Array|Response|File} source_ Fuente de la capa.
  * @property {number} tileSize_ Tamaño de la tesela vectorial.
  * @property {Mx.Extent} maxExtent_ La medida en que restringe la visualización
  * a una región específica.
  * @property {number} minZoomLevel_ Zoom mínimo aplicable a la capa.
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
    * - minZoomLevel: Zoom mínimo aplicable a la capa.
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
    * - minZoom: Zoom mínimo aplicable a la capa.
    * - maxZoom Zoom máximo aplicable a la capa.
    * - visibility: Define si la capa es visible o no. Verdadero por defecto.
    * - displayInLayerSwitcher: Indica si la capa se muestra en el selector de capas.
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
      * MBTiles tileLoadFunction: Función de carga de la tesela proporcionada por el usuario.
      * @private
      * @type {function}
      */
    this.tileLoadFunction_ = userParameters.tileLoadFunction || null;

    /**
      * MBTiles url: Url del fichero o servicio que genera el MBTiles.
      * @private
      * @type {string}
      */
    this.url_ = userParameters.url;

    /**
      * MBTiles source: Fuente de la capa.
      * @private
      * @type {ArrayBuffer|Uint8Array|Response|File}
      */
    this.source_ = userParameters.source;

    /**
      * MBTiles tileSize: Tamaño de la tesela.
      * @private
      * @type {number}
      */
    this.tileSize_ = typeof userParameters.tileSize === 'number' ? userParameters.tileSize : DEFAULT_TILE_SIZE;

    /**
      * MBTiles maxExtent: Máxima extensión de la capa
      * @private
      * @type {Mx.Extent}
      */
    this.maxExtent_ = userParameters.maxExtent || null;

    /**
      * MBTiles minZoomLevel: Zoom mínimo aplicable a la capa.
      * @private
      * @type {number}
      */
    this.minZoomLevel_ = typeof userParameters.minZoomLevel === 'number' ? userParameters.minZoomLevel : 0;

    /**
      * MBTiles maxZoomLevel: Zoom máximo aplicable a la capa.
      * @private
      * @type {number}
      */
    this.maxZoomLevel_ = typeof userParameters.maxZoomLevel === 'number' ? userParameters.maxZoomLevel : 0;

    /**
      * MBTiles opacity: Opacidad de la capa.
      * @private
      * @type {number}
      */
    this.opacity_ = typeof options.opacity === 'number' ? options.opacity : 1;

    /**
      * zIndex de la capa.
      * @private
      * @type {number}
      */
    this.zIndex_ = ImplMap.Z_INDEX.MBTiles;

    /**
      * MBTiles visibility: Visibilidad de la capa.
      * @public
      * @type {boolean}
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
    const projection = getProj('EPSG:3857');
    const extent = projection.getExtent();
    const resolutions = generateResolutions(extent, this.tileSize_, 16);

    this.ol3Layer = new OLLayerTile({
      visible: this.visibility,
      opacity: this.opacity_,
      zIndex: this.zIndex_,
      extent,
    });
    this.map.getMapImpl().addLayer(this.ol3Layer);
    if (!this.tileLoadFunction_) {
      this.fetchSource().then((tileProvider) => {
        this.tileProvider_ = tileProvider;
        const source = new MBTilesSource({
          projection,
          tileLoadFunction: tile => this.loadTileWithProvider(tile, tileProvider),
          tileGrid: new TileGrid({
            extent,
            origin: getBottomLeft(extent),
            resolutions,
          }),
        });
        this.ol3Layer.setSource(source);
      });
    } else {
      const source = new MBTilesSource({
        projection,
        tileLoadFunction: tile => this.loadTile(tile),
        tileGrid: new TileGrid({
          extent,
          origin: getBottomLeft(extent),
          resolutions,
        }),
      });
      this.ol3Layer.setSource(source);
    }
  }

  /**
    * Este método es la función personalizada de carga de la tesela.
    *
    * @function
    * @param {ol.Tile} tile Tesela vectorial.
    * @public
    * @api
    */
  loadTile(tile) {
    const imgTile = tile;
    const tileCoord = tile.getTileCoord();
    this.tileLoadFunction_(tileCoord[0], tileCoord[1], -tileCoord[2] - 1).then((tileSrc) => {
      if (tileSrc) {
        imgTile.getImage().src = tileSrc;
      } else {
        imgTile.getImage().src = imgTile.getImage().src;
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
    if (tileSrc) {
      imgTile.getImage().src = tileSrc;
    } else {
      imgTile.getImage().src = imgTile.getImage().src;
    }
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
        resolve(tileProvider);
      } else if (this.url_) {
        throw new Error('');
      } else {
        reject(new Error('No url or source was specified.'));
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
    // this.ol3Layer.setExtent(maxExtent);
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
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
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
    if (this.ol3Layer != null) {
      const properties = this.ol3Layer.getProperties();
      olLayer = new OLLayerTile(properties);
    }
    return olLayer;
  }
}
export default MBTiles;

