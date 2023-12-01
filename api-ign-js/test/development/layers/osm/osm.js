import OSM from 'M/layer/OSM';

export const osm = new OSM({
    name: 'OSM',
    legend: 'OSM',
    url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    matrixSet: 'EPSG:3857',
    // isBase: true,
    // transparent: false,
});