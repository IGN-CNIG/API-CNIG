/**
 * @module M/Tile
 */
import sqljs from 'sql.js';
import { inflate } from 'pako';
import { isNullOrEmpty, bytesToBase64, getUint8ArrayFromData } from '../util/Utils';

/**
 * @classdesc
 * Esta clase genera una Tesela.
 *
 * @property {Object} tiles_ Tesela.
 * @property {Object} db_ Base de datos.
 *
 * @api
 */
class Tile {
  /**
   * Constructor principal de la clase Tesela.
   *
   * @constructor
   * @param {Array} data Uint8Array que representa un archivo de base de datos.
   *
   * @api
   */
  constructor(data) {
    /**
     * Tesela
     */

    this.tiles_ = {};
    /**
     * Base de datos
     */
    this.db_ = null;

    this.init(data);
  }

  /**
   * Este método crea la base de datos a partir de un fichero Uint8Array.
   *
   * @function
   * @param {Array} data Uint8Array que representa un archivo de base de datos.
   * @api
   * @public
   */
  init(data) {
    this.initPromise_ = new Promise((resolve, reject) => {
      sqljs({
        locateFile: file => `${M.config.SQL_WASM_URL}${file}`,
      }).then((SQL) => {
        getUint8ArrayFromData(data).then((uint8Array) => {
          this.db_ = new SQL.Database(uint8Array);
          resolve(this.db_);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Este método ejecuta una consulta SQL.
   *
   * @function
   * @param {String} query Consulta SQL.
   * @return {Object} Resultado de ejecutar la consulta SQL.
   * @api
   * @public
   */
  executeQuery(query) {
    return this.initPromise_.then((db) => {
      return db.exec(query)[0];
    });
  }

  /**
   * Este método obtiene un Tesela que coincida con las coordenadas dadas como parámetros.
   *
   * @function
   * @param {Array} tileCoord Array de coordenadas.
   * @return {Object} Tesela.
   * @api
   * @public
   */
  getTile(tileCoord) {
    const SELECT_SQL = 'select tile_data from tiles where zoom_level={z} and tile_column={x} and tile_row={y}';
    const PREPARED = SELECT_SQL.replace('{z}', tileCoord[0]).replace('{x}', tileCoord[1]).replace('{y}', tileCoord[2]);
    let byteTile = this.tiles_[tileCoord] || null;
    let tile = null;
    if (this.db_ && !byteTile) {
      const select = this.db_.exec(PREPARED)[0];
      if (!isNullOrEmpty(select)) {
        byteTile = select.values[0][0];
        tile = bytesToBase64(byteTile);
      }
    }
    this.setTile(tileCoord, tile);
    return tile;
  }

  /**
   * Este método obtiene un Tesela Vectorial que coincida con las coordenadas dadas como parámetros.
   *
   * @function
   * @param {Array} tileCoord Array de coordenadas.
   * @return {Object} Tesela Vectorial.
   * @api
   * @public
   */
  getVectorTile(tileCoord) {
    const SELECT_SQL = 'select tile_data from tiles where zoom_level={z} and tile_column={x} and tile_row={y}';
    const PREPARED = SELECT_SQL.replace('{z}', tileCoord[0]).replace('{x}', tileCoord[1]).replace('{y}', tileCoord[2]);
    let vectorTile;
    let cacheVectorTile = this.tiles_[tileCoord] || null;
    if (!cacheVectorTile) {
      cacheVectorTile = this.executeQuery(PREPARED).then((result) => {
        if (!isNullOrEmpty(result)) {
          vectorTile = result.values[0][0];
          vectorTile = inflate(vectorTile);
        }
        this.setTile(tileCoord, vectorTile);
        return vectorTile;
      });
    } else {
      cacheVectorTile = new Promise(resolve => resolve(cacheVectorTile));
    }
    return cacheVectorTile;
  }

  /**
   * Este método sobreescribe el tesela.
   *
   * @function
   * @param {Array} tileCoord Array de coordenadas.
   * @param {Object} tile Tesela.
   * @api
   * @public
   */
  setTile(tileCoord, tile) {
    this.tiles_[tileCoord] = tile;
  }

  /**
   * Este método obtiene la extensión del Tesela.
   * @function
   * @return {Array} Extensión.
   * @api
   * @public
   */
  getExtent() {
    let extent = null;
    const SELECT_SQL = 'select value from metadata where name="bounds"';
    return this.executeQuery(SELECT_SQL).then((result) => {
      if (result) {
        const value = result.values[0][0];
        extent = value.split(',').map(Number.parseFloat);
      }
      return extent;
    });
  }

  /**
   * Este método obtiene el tipo de formato.
   *
   * @function
   * @public
   * @return {String} Devuelve tipo de formato. Por defecto devuelve "png".
   * @api stable
   */
  getFormat() {
    let format = 'png';
    const SELECT_SQL = 'select value from metadata where name="format"';
    return this.executeQuery(SELECT_SQL).then((result) => {
      if (result) {
        format = result.values[0][0];
      }
      return format;
    });
  }
}

export default Tile;
