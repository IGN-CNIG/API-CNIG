const COLORES_PROVINCIA = {
  2:'olive',
  5:'green',
  6:'blue',
  9:'navy',
  10:'springgreeen',
  13:'lightsalmon',
  16:'steelblue',
  19:'orangered',
  28:'red',
  40:'plum',
  42:'lime',
  45:'gold',
  47:'emerald',
  50:'turquoise',
}

/**
 * Creamos el objeto Mapa.APICNIG
 */
const map = M.map({
  container: 'mapjs',
  controls: ['panzoom','panzoombar', 'scale*true', 'scaleline', 'rotate', 'location','backgroundlayers'], //getfeatureinfo: este control es un poco coñazo, siempre está buscando información al hacer clic en el mapa.
  // controls: ['panzoom', 'scale*true', 'scaleline', 'rotate', 'location', 'backgroundlayers', 'getfeatureinfo'],
  zoom: 10 ,  //6
  maxZoom: 20,
  minZoom: 4,
  projection: "EPSG:3857*m",
  center: {
      x: -409000, // -712300,
      y: 4930000, // 4310700,
      draw: false  // Dibuja un punto en el lugar de la coordenada
  },
});

/**
 * e2m:
 * Configuración del plugin
 */
 const mp = new M.plugin.QueryDatabase({
  position: 'TL',
  collapsed: true,
  collapsible: true,
  refreshBBOXFilterOnPanning: true
});

map.addPlugin(mp);

// Este plugin con la información de coordenadas nos ayudará
const plugMouse = new M.plugin.MouseSRS({
  tooltip: "Muestra coordenadas",
  srs: "EPSG:4326",
  label: "WGS84",
  precision: 4,
  geoDecimalDigits: 3,
  utmDecimalDigits: 2,
  activeZ: false
});
map.addPlugin(plugMouse);
