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
      name: 'Hidrografía',
      services: [
        {
          name: 'IDEE Hidrografía',
          type: 'WMS',
          url: 'http://servicios.idee.es/wms-inspire/hidrografia?',
          white_list: ['HY.PhysicalWaters.Waterbodies', 'HY.PhysicalWaters.Wetland', 'HY.PhysicalWaters.Catchments'],
        },
      ],
    },
    {
      name: 'PNOA',
      services: [
        {
          name: 'PNOA Actual',
          type: 'WMTS',
          url: 'http://www.ign.es/wmts/pnoa-ma?',
        },
        {
          name: 'PNOA Histórico',
          type: 'WMS',
          url: 'http://www.ign.es/wms/pnoa-historico?',
        },
      ],
    },
    {
      name: 'Transporte',
      services: [
        {
          name: 'IDEE - Red de transporte',
          type: 'WMS',
          url: 'http://servicios.idee.es/wms-inspire/transportes?',
        },
        {
          name: 'ADIF - Red de transporte ferroviario',
          type: 'WMS',
          url: 'http://ideadif.adif.es/services/wms?',
        },
      ],
    },
    {
      name: 'Otros servicios',
      services: [
        {
          name: 'Camino de Santiago',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/camino-santiago',
        },
        {
          name: 'Redes Geodésicas',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/redes-geodesicas',
        },
        {
          name: 'Planimetrías',
          type: 'WMS',
          url: 'https://www.ign.es/wms/minutas-cartograficas',
        },
      ],
    },
  ],
  services: [
    {
      name: 'Catastro',
      type: 'WMS',
      url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx',
    },
    {
      name: 'Cuadrículas Cartográficas',
      type: 'WMS',
      url: 'http://www.ign.es/wms-inspire/cuadriculas',
    },
    {
      name: 'Elevación',
      type: 'WMS',
      url: 'https://servicios.idee.es/wms-inspire/mdt',
    },
    {
      name: 'Límites Administrativos',
      type: 'WMS',
      url: 'http://www.ign.es/wms-inspire/unidades-administrativas',
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
  collapsed: false,
  position: 'TR',
  https: true,
  http: true,
  precharged,
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
