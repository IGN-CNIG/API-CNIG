/* eslint-disable max-len */
import { map as Mmap } from 'M/mapea';

// Capas Vectoriales
import Vector from 'M/layer/Vector';
import GeoJSON from 'M/layer/GeoJSON'; // SIN ".JS"
import WFS from 'M/layer/WFS';
import KML from 'M/layer/KML';
import MVT from 'M/layer/MVT'; // Mode 'feature' y 'render'
import OGCAPIFeatures from 'M/layer/OGCAPIFeatures';
import MBTilesVector from 'M/layer/MBTilesVector';
import GenericVector from 'M/layer/GenericVector';

// Capas Rasters
import TMS from 'M/layer/TMS';
import WMS from 'M/layer/WMS';
import WMTS from 'M/layer/WMTS';
import XYZ from 'M/layer/XYZ';
import OSM from 'M/layer/OSM';
import MBTiles from 'M/layer/MBTiles';
import GeoTIFF from 'M/layer/GeoTIFF'; // SIN ".JS", Nombrado como COG
import MapLibre from 'M/layer/MapLibre';
import GenericRaster from 'M/layer/GenericRaster';

const mapa = Mmap({
  container: 'map',
  center: [-443273.10081370454, 4757481.749296248],
  zoom: 6,
});
window.mapa = mapa;

// TODO: generar cada capa con "minZoom", "maxZoom" y "tileGridMaxZoom", en primer parámetro o segundo. Probar los "set" también de estos.
const prueba1 = { minZoom: 2, maxZoom: 10 };
const prueba2 = { minZoom: 4, maxZoom: 8 };
const tileGridMaxZoom = 6;

// TODO: mostrar lista de resultados de "mapa.getMinZoom(), mapa.getMaxZoom()" y compararlos con "mapa.impl_.getMinZoom(), mapa.impl_.getMaxZoom()"
