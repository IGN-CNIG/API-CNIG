
import Vector from 'M/layer/Vector';
import Feature from 'M/feature/Feature';

export const vector_001 = new Vector({
  name: 'capaVectorial',
  legend: 'Capa Vector',
  // isBase: true,
  // transparent: false,
  // attribution: {
  //   name: 'Name Prueba Vector',
  //   description: 'Description Prueba',
  //   url: 'https://www.ign.es',
  //   contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
  //   contentType: 'kml',
  // },
});

// Creamos feature
const feature = new Feature("featurePrueba002", {
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

// lo añadimos a la capa
vector_001.addFeatures([feature])

// -----