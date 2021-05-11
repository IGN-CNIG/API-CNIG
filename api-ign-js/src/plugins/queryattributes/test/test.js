import QueryAttributes from 'facade/queryattributes';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  zoom: 8,
  center: [-503395.3366454871, 4896624.823755192],
});

const mp = new QueryAttributes({
  position: 'TL',
  collapsed: false,
  collapsible: true,
  filters: false,
  configuration: {
    layer: 'vertices',
    initialSort: { name: 'codigoregi', dir: 'asc' },
    columns: [
      { name: 'id', alias: 'Identificador', visible: true, align: 'right', type: 'string' },
      { name: 'nombre', alias: 'Nombre Vértice', visible: true, align: 'left', type: 'string' },
      { name: 'xutmetrs89', alias: 'Coordenada X (UTM ETRS89)', visible: false, align: 'left', type: 'string' },
      { name: 'yutmetrs89', alias: 'Coordenada Y (UTM ETRS89)', visible: false, align: 'left', type: 'string' },
      { name: 'huso', alias: 'Huso UTM', visible: false, align: 'left', type: 'string' },
      { name: 'horto', alias: 'Altitud Ortométrica', visible: false, align: 'left', type: 'string' },
      { name: 'summary', alias: 'Descripción', visible: false, align: 'left', type: 'string' },
      { name: 'lat', alias: 'Latitud', visible: false, align: 'left', type: 'string' },
      { name: 'lng', alias: 'Longitud', visible: false, align: 'left', type: 'string' },
      { name: 'urlficha', alias: 'URL PDF Ficha', visible: false, align: 'left', type: 'url' },
      { name: 'urlcdd', alias: 'URL Centro Descargas', visible: false, align: 'left', type: 'url' },
      { name: 'hojamtn50', alias: 'Hoja MTN50', visible: false, align: 'left', type: 'string' },
      { name: 'imagemtn50', alias: 'Imagen Hoja MTN50', visible: false, align: 'left', type: 'image' },
      { name: 'description', alias: 'Descripción completa', visible: true, align: 'left', type: 'string' },
    ],
  }
});

const campamentos = new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?",
  namespace: "sepim",
  name: "campamentos",
  legend: "Campamentos",
  geometry: 'POINT',
});

const vertex = new M.layer.GeoJSON({
  name: 'vertices',
  url: 'http://mapea-lite.desarrollo.guadaltel.es/api-core/data/vertices.geojson',
});

// map.addWFS(campamentos);
map.addLayers(vertex);
map.addPlugin(mp);

window.map = map;
