import { map as Mmap } from 'M/mapea';
import Generic from 'M/style/Generic';
import Choropleth from 'M/style/Choropleth';
import Proportional from 'M/style/Proportional';
import Category from 'M/style/Category';
import Chart from 'M/style/Chart';
import Heatmap from 'M/style/Heatmap';
import Cluster from 'M/style/Cluster';
import FlowLine from 'M/style/FlowLine';
import { schemes } from 'M/chart/types';
import { JENKS } from 'M/style/Quantification';
import { wfs_001, wfs_002, wfs_003, wfs_004 } from '../layers/wfs/wfs';
import { geojson_003 } from '../layers/geojson/geojson';

const mapa = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  // bbox: [-1494620.1256278034, 3657488.0149567816, 853525.3832928112, 4764296.184526134],
});

// COROPLETAS
/* const estilo = new Choropleth(
  'u_cod_prov',
  ['#000000', '#008000', '#FFFFFF'],
  JENKS(4)
);
window.layer = wfs_001; */
// //

// PROPORCIONAL
/* const estilo = new Proportional('tot_ibi', 5, 20,
  new Generic({ //estilo del punto
    point: {
      fill: {
        color: '#000000'
      },
      stroke: {
        color: '#FFFFFF',
        width: 2
      }
    }
  })
);
window.layer = wfs_003; */
// //

// CATEGORICO
/* const verde = new Generic({polygon: {fill: {color: 'green'}}});
const amarillo = new Generic({polygon: {fill: {color: 'pink'}}});
const rojo = new Generic({polygon: {fill: {color: 'red'}}});
const azul = new Generic({polygon: {fill: {color: 'grey'}}});
const naranja = new Generic({polygon: {fill: {color: 'orange'}}});
const marron = new Generic({polygon: {fill: {color: 'brown'}}});
const magenta = new Generic({polygon: {fill: {color: '#e814d9'}}});
const morado = new Generic({polygon: {fill: {color: '#b213dd'}}});

const estilo = new Category("provincia", {
  "Almería": marron,
  "Cádiz": amarillo,
  "Córdoba": magenta,
  "Granada": verde,
  "Jaén": naranja,
  "Málaga": azul,
  "Sevilla": rojo,
  "Huelva": morado
});
window.layer = wfs_003; */
// //

// / ESTADÍSTICOS
// Definimos un estilo estadístico de tipo tarta
/*
const estilo = new Chart({
  // Características generales de la gráfica
  type: 'pie',
  radius: 25,
  stroke: { color: 'black', width: 1 },
  scheme: schemes.Custom, // usaremos nuestros propios colores

  // Variables que queremos representar
  variables: [{
    attribute: 'es_0_15', // población entre 0 y 15 años
    legend: '0-15 años',
    fill: '#F2F2F2',
    label: {
      stroke: { color: 'white', width: 2 },
      radiusIncrement: 10,
      fill: 'black',
      text: '{{es_0_15}}',
      font: 'Comic Sans MS',
    },
  }, {
    attribute: 'es_16_45', // población entre 16 y 45 años
    legend: '16-45 años',
    fill: 'blue',
    label: {
      text(value, values, feature) {
        return value.toString();
      },
      radiusIncrement: 10,
      stroke: { color: '#fff', width: 2 },
      fill: 'blue',
      font: 'Comic Sans MS',
    },
  }, {
    attribute: 'es_45_65', // población entre 45 y 65 años
    legend: '45-65 años',
    fill: 'pink',
    label: {
      text: '{{es_45_65}}',
      stroke: { color: '#fff', width: 2 },
      fill: 'red',
      font: 'Comic Sans MS',
    },
  }, {
    attribute: 'es_65', // población mayor de 65 años
    legend: '65 años o más',
    fill: 'orange',
    label: {
      text: '{{es_65}}',
      stroke: { color: '#fff', width: 2 },
      fill: '#886A08',
      font: 'Comic Sans MS',
    },
  }],
});
window.layer = wfs_001;
*/
// //

// MAPA DE CALOR
/*
const estilo = new Heatmap('numero', {
  blur: 15,
  radius: 10,
  gradient: ['blue', 'cyan', 'green', 'yellow', 'orange', 'red'],
});
window.layer = wfs_002;
*/
//

// CLUSTER
/*
const clusterOptions = {
  ranges: [{
      min: 2,
      max: 4,
      style: new Generic({
        point: {
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#99ccff',
        },
        radius: 20
      }})
    }, {
      min: 5,
      max: 9,
      style: new Generic({
        point: {
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#3399ff',
        },
        radius: 30
      }})
    }
      // Se pueden definir más rangos
  ],
  animated: true,
  hoverInteraction: true,
  displayAmount: true,
  selectInteraction: true,
  distance: 80,
  label: {          
   font: 'bold 19px Comic Sans MS', 
   color: '#FFFFFF'
  }
};
const estilo = new Cluster(clusterOptions);
window.layer = wfs_004;
*/
//

// LINEA DE FLUJO
/*
const estilo = new FlowLine({
  color: 'blue',
  color2: 'pink',
  width: function (feature) {
            return feature.getAttribute('inicio') * 0.2;
        },
  width2: function (feature) {
            return feature.getAttribute('final') * 0.2;
        },
  arrow: -1,
  arrowColor: 'grey',
  lineCap: 'butt',
});
window.layer = geojson_003;
*/
//

// COMPOSICION

// Estilo genérico: puntos amarillos con borde rojo
const estilo_base = new Generic({
  point: {
    radius: 5,
    fill: {
      color: 'yellow',
      opacity: 0.5
    },
    stroke: {
      color: '#FF0000'
    }
  }
});

// Estilo cluster por defecto
const estilo_cluster = new Cluster();

// Cluster permite Composite, así que se le puede agregar el estilo base
const estilo = estilo_cluster.add(estilo_base);
window.layer = wfs_004;

//

window.layer.setStyle(estilo);
mapa.addLayers(window.layer);
window.mapa = mapa;
