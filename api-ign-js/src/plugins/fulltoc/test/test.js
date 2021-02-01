import FullTOC from 'facade/fulltoc';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  center: {
    x: -528863.345515127,
    y: 4514194.232367303,
  },
  zoom: 9,
});

const precharged = {
  groups: [
    {
      name: 'IGN',
      services: [
        {
          name: 'Camino de Santiago',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/camino-santiago?',
        },
        {
          name: 'Cuadrículas cartográficas',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/cuadriculas?',
          white_list: ['Grid-REGCAN95-lonlat-50k', 'Grid-ETRS89-lonlat-50k', 'Grid-ETRS89-lonlat-25k', 'Grid-REGCAN95-lonlat-25k'],
        },
        {
          name: 'Cuadrícula MTN25 Extendida',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/cuadriculas?',
          white_list: ['Grid-25k-extendida'],
        },
        /* Descomentar cuanto esté publicado con la URL nueva
        {
          name: 'Fototeca',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/cuadriculas?',
          white_list: ['Grid-REGCAN95-lonlat-50k', 'Grid-ETRS89-lonlat-50k', 'Grid-ETRS89-lonlat-25k', 'Grid-REGCAN95-lonlat-25k'],
        },
        */
        {
          name: 'Información sísmica y volcánica',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/geofisica?',
        },
        {
          name: 'Líneas Límite',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
          white_list: ['AU.AdministrativeBoundary'],
        },
        {
          name: 'Nombres Geográficos',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/ngbe?',
        },
        {
          name: 'Proyecto ELF España',
          type: 'WMS',
          url: 'http://elf.ign.es/wms/basemap?',
        },
        {
          name: 'Redes Geodésicas',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/redes-geodesicas?',
        },
        {
          name: 'Unidades Administrativas',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
          white_list: ['AU.AdministrativeUnit'],
        },
      ],
    },
    {
      name: 'IGN. Cartografía histórica',
      services: [
        {
          name: 'Planos de Madrid (1622 - 1960)',
          type: 'WMS',
          url: 'https://www.ign.es/wms/planos?',
        },
        {
          name: 'Hojas kilométricas (Madrid - 1860)',
          type: 'WMS',
          url: 'https://www.ign.es/wms/hojas-kilometricas?',
        },
        {
          name: 'Planimetrías',
          type: 'WMS',
          url: 'https://www.ign.es/wms/minutas-cartograficas?',
        },
        {
          name: 'Primera edición de los Mapas Topográficos Nacionales',
          type: 'WMS',
          url: '	https://www.ign.es/wms/primera-edicion-mtn?',
        },
      ],
    },
    {
      name: 'Capas de fondo',
      services: [
        {
          name: 'Mapa',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/mapa-raster?',
        },
        {
          name: 'Imagen',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/pnoa-ma?',
        },
        {
          name: 'Callejero',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/ign-base?',
        },
        {
          name: 'Relieve',
          type: 'WMTS',
          url: 'https://wmts-mapa-lidar.idee.es/lidar?',
        },
        {
          name: 'Ocupación del suelo',
          type: 'WMTS',
          url: 'https://servicios.idee.es/wmts/ocupacion-suelo?',
        },
        {
          name: 'Mapas Históricos',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/primera-edicion-mtn',
        }
      ],
    }
  ],
  services: [
    {
      name: 'Cartografía Militar',
      type: 'WMS',
      url: 'http://wms-defensa.idee.es/mapas',
    },
    {
      name: 'Catastro',
      type: 'WMS',
      url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx',
    },
    {
      name: 'Copernicus Land Monitoring Service',
      type: 'WMS',
      url: 'https://servicios.idee.es/wms/copernicus-landservice-spain?',
    },
    {
      name: 'Direcciones y Códigos Postales',
      type: 'WMS',
      url: 'https://www.cartociudad.es/wms-inspire/direcciones-ccpp?',
    },
    {
      name: 'Hidrografía',
      type: 'WMS',
      url: 'http://servicios.idee.es/wms-inspire/hidrografia?',
      white_list: ['HY.PhysicalWaters.Waterbodies', 'HY.PhysicalWaters.Wetland', 'HY.PhysicalWaters.Catchments'],
    },
    {
      name: 'Línea de Costa',
      type: 'WMS',
      url: 'http://ideihm.covam.es/ihm-inspire/wms-unidadesmaritimas?',
      white_list: ['HY.PhysicalWaters.Waterbodies', 'HY.PhysicalWaters.Wetland', 'HY.PhysicalWaters.Catchments'],
    },
    {
      name: 'Mapa Geológico Continuo de España a escala 1/50.000',
      type: 'WMS',
      url: 'http://mapas.igme.es/gis/services/Cartografia_Geologica/IGME_Geode_50/MapServer/WMSServer',
    },
    {
      name: 'Modelos Digitales del Terreno',
      type: 'WMS',
      url: 'https://servicios.idee.es/wms-inspire/mdt?',
    },
    {
      name: 'Ocupación de Suelo histórico',
      type: 'WMS',
      url: 'https://servicios.idee.es/wms-inspire/ocupacion-suelo-historico?',
    },
    {
      name: 'Ortofotos históricas',
      type: 'WMS',
      url: 'https://www.ign.es/wms/pnoa-historico?',
    },
    {
      name: 'Red de Transporte',
      type: 'WMS',
      url: 'https://servicios.idee.es/wms-inspire/transportes?',
    },
    {
      name: 'Red de transporte ferroviario - ADIF',
      type: 'WMS',
      url: 'http://ideadif.adif.es/services/wms?',
    },
  ],
};

/*{
  name: '',
  type: '',
  url: '',
  white_list: ['', ''],
}*/

const mp = new FullTOC({
  collapsed: true,
  position: 'TR',
  https: true,
  http: true,
  precharged,
  codsi: true,
});

window.mp = mp;
window.FullTOC = FullTOC;

map.addPlugin(mp);
const layerUA = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false,
}, {});
const layerinicial = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {
  visibility: false,
});

const ocupacionSuelo = new M.layer.WMTS({
  url: 'http://wmts-mapa-lidar.idee.es/lidar',
  name: 'EL.GridCoverageDSM',
  legend: 'Modelo Digital de Superficies LiDAR',
  matrixSet: 'GoogleMapsCompatible',
}, {
  visibility: false,
});

/*map.addLayers(layerUA);
map.addLayers(layerinicial);
map.addLayers(ocupacionSuelo);*/

window.map = map;
