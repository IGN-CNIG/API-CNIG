import Vector from 'M/layer/Vector';
import Feature from 'M/feature/Feature';
import Generic from 'M/style/Generic';

export const vector_001 = new Vector({
    name: 'capaVectorial',
    legend: 'Capa Vector',
    // isBase: false,
    // isBase: true,
    // transparent: true,
    // transparent: false,
    // infoEventType: 'click'
    // infoEventType: 'hover',
    // maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
    // attribution: {
    //   name: 'Name Prueba Vector',
    //   description: 'Description Prueba',
    //   url: 'https://www.ign.es',
    //   contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    //   contentType: 'kml',
    // },
  },
  {
    // minZoom: 5,
    // maxZoom: 10.
    // visibility: false,
    // visibility: true,
    // displayInLayerSwitcher: false,
    // displayInLayerSwitcher: true,
    // opacity: 0,
    // opacity: 0.5,
    // opacity: 1,
    // predefinedStyles: [],
    // style: new Generic({
    //   point: {
    //     radius: 10,
    //     fill: {
    //       color: 'blue'
    //     }
    //   },
    //   polygon: {
    //     fill: {
    //       color: 'red'
    //     }
    //   },
    //   line: {
    //     stroke: {
    //       color: 'black'
    //     }
    //   }
    // }),
  }, 
  {
    // source: {},
  },
);

// ERROR: infoEventType en hover no cierra el popup al salir
// ERROR: No funciona opacity al 0

// Creamos feature
const polFeature = new Feature("featurePrueba001", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1985",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [263770.72265536943, 4085361.4590256726],
        [230910.00600234355, 4031901.3328427672],
        [288293.77947248437, 4017678.0840030923],
        [263770.72265536943, 4085361.4590256726]
      ]
    ]
  },
  "geometry_name": "geometry",
  "properties": {
    "cod_ine_municipio": "41091",
    "cod_ine_provincia": "-",
    "area": 1234,
    "perimetro": 345,
    "cod_ine_comunidad": "-",
    "nombre": "feature2",
    "nom_provincia": "Cádiz",
    "alias": "f2",
    "nom_ccaa": "Andalucía"
  }
});

const pointFeature = new Feature("featurePrueba002", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1986",
  "geometry": {
    "type": "Point",
    "coordinates": [-626051.84, 4365196.20],
    "geometry_name": "geometry",
    "properties": {
      "cod_ine_municipio": "41091",
      "cod_ine_provincia": "-",
      "area": 1234,
      "perimetro": 345,
      "cod_ine_comunidad": "-",
      "nombre": "feature2",
      "nom_provincia": "Cádiz",
      "alias": "f2",
      "nom_ccaa": "Andalucía"
    }
  }
});

const lineFeature = new Feature("featurePrueba003", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1987",
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [-232910.00600234355, 4033901.3328427672],
      [-290293.77947248437, 4019678.0840030923],
      [-290293.77947248437, 4033901.3328427672]
    ],
    "geometry_name": "geometry",
    "properties": {
      "cod_ine_municipio": "41091",
      "cod_ine_provincia": "-",
      "area": 1234,
      "perimetro": 345,
      "cod_ine_comunidad": "-",
      "nombre": "feature2",
      "nom_provincia": "Cádiz",
      "alias": "f2",
      "nom_ccaa": "Andalucía"
    }
  }
});

// coordenadas en 25830
// no se posiciona correctamente ya que no está en el sistema de referencia del mapa
// en coordRefSys muestra 3857
// no hace reproyección ya que las coordenadas deben estar en 3857 y el mapa está en 3857 (valores por defecto)
const feature1 = new Feature("featurePrueba001", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1985",
  "geometry": {
    "type": "Point",
    "coordinates": [
    558168.25229024,
    4116978.43564967
    ]
    },
  "geometry_name": "geometry",
  "properties": {
    "cod_ine_municipio": "41091",
  }
});

// coordenadas en 25830
// no se posiciona correctamente ya que no está en el sistema de referencia del mapa
// en coordRefSys muestra 3857
// no hace reproyección ya que las coordenadas deben estar en 3857 (valor por defecto) y el mapa está en 3857 (indicado en parámetro)
const feature2 = new Feature("featurePrueba001", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1985",
  "geometry": {
    "type": "Point",
    "coordinates": [
    558168.25229024,
    4116978.43564967
    ]
    },
  "geometry_name": "geometry",
  "properties": {
    "cod_ine_municipio": "41091",
  }
}, null, 'EPSG:3857');

// coordenadas en 25830
// no se posiciona correctamente ya que las coordenadas no están en 4326 (parámetro true)
// en coordRefSys muestra 3857
// La reproyección la hace a 3857 al indicar el parámetro
// hace reproyección ya que las coordenadas de 4326 y el mapa está en 3857 (indicado en parámetro)
const feature3 = new Feature("featurePrueba001", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1985",
  "geometry": {
    "type": "Point",
    "coordinates": [
    558168.25229024,
    4116978.43564967
    ]
    },
  "geometry_name": "geometry",
  "properties": {
    "cod_ine_municipio": "41091",
  }
}, null, 'EPSG:3857', true);

// coordenadas en 25830 indicadas en el parámetro coordRefSys
// se posiciona correctamente
// en coordRefSys muestra 3857
// La reproyección la hace a 3857 al indicar el parámetro
// hace reproyección ya que las coordenadas de 25830 y el mapa está en 3857 (indicado en parámetro)
const feature4 = new Feature("featurePrueba001", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1985",
  "coordRefSys": "http://www.opengis.net/def/crs/EPSG/0/25830",
  "geometry": {
    "type": "Point",
    "coordinates": [
    558168.25229024,
    4116978.43564967
    ]
    },
  "geometry_name": "geometry",
  "properties": {
    "cod_ine_municipio": "41091",
  }
}, null, 'EPSG:3857', false);

// coordenadas en 4326 (parámetro true)
// se posiciona correctamente
// en coordRefSys muestra 3857
// La reproyección la hace a 3857 al indicar el parámetro
// hace reproyección ya que las coordenadas de 4326 y el mapa está en 3857 (indicado en parámetro)
const feature5 = new Feature("featurePrueba001", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1985",
  "geometry": {
    "type": "Point",
    "coordinates": [-2.344553425820997, 37.19745701080536]
    },
  "geometry_name": "geometry",
  "properties": {
    "cod_ine_municipio": "41091",
  }
}, null, 'EPSG:3857', true);

// caso en que el mapa esté en 4326, se muestra correctamente 
// hay que especificar la proyección del mapa ya que si no devolvería 3857 y hay que especificar que cumple el estándar
const feature6 = new Feature("featurePrueba001", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1985",
  "geometry": {
    "type": "Point",
    "coordinates": [-2.344553425820997, 37.19745701080536]
    },
  "geometry_name": "geometry",
  "properties": {
    "cod_ine_municipio": "41091",
  }
}, null, 'EPSG:4326', true);

//caso común en la api
const feature7 = new Feature("featurePrueba001", {
  "type": "Feature",
  "id": "prueba_pol_wfst.1985",
  "geometry": {
    "type": "Point",
    "coordinates": [-386651.07, 4491775.92]
    },
  "geometry_name": "geometry",
  "properties": {
    "cod_ine_municipio": "41091",
  }
});

vector_001.addFeatures(feature7);

// lo añadimos a la capa
// vector_001.addFeatures([polFeature, pointFeature, lineFeature])

// -----
