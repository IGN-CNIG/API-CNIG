import QueryDatabase from 'facade/querydatabase';


M.language.setLang('es'); //Español
//M.language.setLang('en'); //Inglés

const map = M.map({
  container: 'mapjs',
  controls: ['panzoom','panzoombar', 'scale*true', 'scaleline'],
  zoom: 10 ,  //6
  maxZoom: 20,
  minZoom: 4,
  projection: "EPSG:3857*m",
  center: {
      x: -409000, //-712300,
      y: 4930000, //4310700,
      draw: false  //Dibuja un punto en el lugar de la coordenada
  },
  zoom: 7,
});
M.config('MAPEA_URL', 'http://localhost:8080/api-core');
M.config('PROXY_URL', 'http://localhost:8080/api-core/api/proxy');

let stylesDefault = {
  point: new M.style.Point({
    fill: {
      color: 'orange',
      opacity: 0.5
    },
    stroke: {
      color: 'orange',
    }
  }),
  line: new M.style.Line({
    fill: {
      color: 'red',
      opacity: 0.5
    },
    stroke: {
      color: 'red',
      width: 4
    }
  }),
  polygon: new M.style.Polygon({
    fill: {
      color: 'pink',
      opacity: 0.5
    },
    stroke: {
      color: 'pink',
      width: 3 
    }
  })
};

let stylesSelect = {
  point: new M.style.Point({
    fill: {
      color: 'red',
      opacity: 1
    },
    stroke: {
      color: 'red',
    }
  }),
  line: new M.style.Line({
    fill: {
      color: 'blue',
      opacity: 1
    },
    stroke: {
      color: 'blue',
      width: 4
    }
  }),
  polygon: new M.style.Polygon({
    fill: {
      color: 'orange',
      opacity: 0.5
    },
    stroke: {
      color: 'orange',
      width: 3 
    }
  })
};

let styles = {
  default: stylesDefault,
  select: stylesSelect
}

const mp = new QueryDatabase({
  position: 'TL',
  collapsed: true,
  collapsible: true,
  connection: {
    host: 'pgdesa96a.guadaltel.es',
    port: 5432,
    name: 'pgdesa96a',
    user: 'nomenclator',
    password: 'ren5ob_Quedd',
    schema: 'nomenclator',
    table: 'nombresgeograficostodos',
    attributes: ['identidad', 'etiqueta', 'tipo', 'codigo_ngbe', 'fuente'],
    filters: ['etiqueta', 'tipo'],
  },
  styles: styles
});



map.addPlugin(mp);


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

window.map = map;

