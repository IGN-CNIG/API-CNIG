import { map as Mmap } from 'M/mapea';
import MapLibre from 'M/layer/MapLibre';

const mapa = Mmap({
  container: 'map',
  center: [-443273.10081370454, 4757481.749296248],
  zoom: 6,
});

const mapLibre = new MapLibre({
  name: 'Mapa Libre',
  extract: true,
  disableBackgroundColor: false,
  // visibility: true,
  style: 'https://vt-mapabase.idee.es/files/styles/mapaBase_scn_color1_CNIG.json',
  // style: 'https://demotiles.maplibre.org/style.json', // JSON, URL
  /*
  style: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap Contributors',
        maxzoom: 19,
      },
      // Use a different source for terrain and hillshade layers, to improve render quality
      terrainSource: {
        type: 'raster-dem',
        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
        tileSize: 256,
      },
      hillshadeSource: {
        type: 'raster-dem',
        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
        tileSize: 256,
      },
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
      },
      {
        id: 'hills',
        type: 'hillshade',
        source: 'hillshadeSource',
        layout: { visibility: 'visible' },
        paint: { 'hillshade-shadow-color': '#473B24' },
      },
    ],
    terrain: {
      source: 'terrainSource',
      exaggeration: 1,
    },
  },
*/
  // opacity: 0.2,
  legend: 'Mapa Libre',
}, {
  // minZoom: 5,
  // maxZoom: 7,
  // minScale: 2000000,
  // maxScale: 7000000,
  // minResolution: 705.5551745557614,
  // maxResolution: 2469.443110945165,
});

mapa.addLayers([mapLibre]);

/*
mapLibre.setPaintProperty('coastline', 'line-color', '#000');
mapLibre.setPaintProperty('coastline', 'line-width', 2);
mapLibre.setPaintProperty('countries-label', 'text-color', 'red');
*/

/*
const styles = [
  {
    id: 'coastline',
    paint: [
      {
        property: 'line-color',
        value: '#000',
      },
      {
        property: 'line-width',
        value: 2,
      },
    ],
  },
  {
    id: 'countries-label',
    paint: [
      {
        property: 'text-color',
        value: 'red',
      },
    ],
  },
]

mapLibre.setStyle(styles);
*/

mapLibre.setLayoutProperty('fondo', 'visibility', 'visible');

// mapLibre.setStyle('https://demotiles.maplibre.org/style.json');

window.mapLibre = mapLibre; // console.log(mapLibre);

window.mapa = mapa;
