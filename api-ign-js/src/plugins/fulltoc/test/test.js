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
      name: 'Nombres Geográficos',
      services: [
        {
          name: 'Nomenclátor Geográfico de Aragón',
          type: 'WMS',
          url: 'https://idearagon.aragon.es/inspireIdearagon/services/wmsGN',
          white_list: ['GN.GeographicalNames'],
        },
        {
          name: 'Nombres geográficos de Catalunya',
          type: 'WMS',
          url: 'https://geoserveis.ide.cat/servei/catalunya/inspire-noms-geografics/wms',
          white_list: ['GN.GeographicalNames'],
        },
        {
          name: 'Nombres geográficos de Gipuzkoa (Euskadi)',
          type: 'WMS',
          url: 'http://b5m.gipuzkoa.eus/inspire/wms/gipuzkoa_wms',
          white_list: ['ad.Address'],
        },
        {
          name: 'Nomenclator Geográfico Básico de España (IGN)',
          type: 'WMS',
          url: 'http://www.ign.es/wms-inspire/ngbe',
        },
        {
          name: 'Nomenclàtor Toponímic Valencià',
          type: 'WMS',
          url: 'http://catalogo.icv.gva.es/inspireICV/services/wmsGN',
          white_list: ['GN.GeographicalNames'],
        },
      ],
    },
    {
      name: 'Unidades Administrativas',
      services: [
        {
          name: 'Unidades administrativas de Araba (Euskadi)',
          type: 'WMS',
          url: 'http://geo.araba.eus/WMS_INSPIRE_AU',
        },
        {
          name: 'Unidades administrativas de Gipuzkoa (Euskadi)',
          type: 'WMS',
          url: 'http://b5m.gipuzkoa.eus/inspire/wms/gipuzkoa_wms',
          white_list: ['au.AdministrativeUnit'],
        },
        {
          name: 'Unidades administrativas de Cataluña',
          type: 'WMS',
          url: 'https://geoserveis.ide.cat/servei/catalunya/inspire-unitats-administratives/wms',
          white_list: ['AU.AdministrativeBoundary', 'AU.AdministrativeUnit'],
        },
        {
          name: 'Unidades administrativas de España (IGN)',
          type: 'WMS',
          url: 'http://www.ign.es/wms-inspire/unidades-administrativas',
        },
        {
          name: 'Unidades marítimas del Instituto Hidrográfico de la Marina',
          type: 'WMS',
          url: 'http://ideihm.covam.es/ihm-inspire/wms-unidadesmaritimas',
          white_list: ['AU.Baseline', 'AU.MaritimeBoundary'],
        },
      ],
    },
    {
      name: 'Parcelas Catastrales',
      services: [
        {
          name: 'Parcelas catastrales de la C.F. de Navarra',
          type: 'WMS',
          url: 'https://inspire.navarra.es/services/CP/wms?',
          white_list: ['CP.CadastralParcel'],
        },
        {
          name: 'Parcelas catastrales de la D.G de Catastro',
          type: 'WMS',
          url: 'http://ovc.catastro.meh.es/cartografia/INSPIRE/spadgcwms.aspx',
          white_list: ['CP.CadastralParcel', 'CP.CadastralZoning'],
        },
        {
          name: 'Parcelas catastrales de Araba (Euskadi)',
          type: 'WMS',
          url: 'http://geo.araba.eus/WMS_INSPIRE_CP',
          white_list: ['CP.CadastralParcel'],
        },
        {
          name: 'Parcelas catastrales de Bizkaia (Euskadi)',
          type: 'WMS',
          url: 'http://arcgis.bizkaia.eus/inspire/rest/services/Catastro/Annex1/MapServer/exts/InspireView/service',
          white_list: ['CP.CadastralZoning', 'CP.CadastralParcel'],
        },
        {
          name: 'Parcelas catastrales de Gipuzkoa  (Euskadi)',
          type: 'WMS',
          url: 'http://b5m.gipuzkoa.eus/inspire/wms/gipuzkoa_wms',
          white_list: ['cp.CadastralZoning', 'cp.CadastralParcel'],
        },
      ],
    },
    {
      name: 'Direcciones',
      services: [
        {
          name: 'Direcciones de Catalunya',
          type: 'WMS',
          url: 'https://geoserveis.ide.cat/servei/catalunya/inspire-adreces/wms',
          white_list: ['AD.Address'],
        },
        {
          name: 'Direcciones de la C.F. de Navarra',
          type: 'WMS',
          url: 'https://inspire.navarra.es/services/AD/wms',
        },
        {
          name: 'Direciones de la D.G. de Catastro',
          type: 'WMS',
          url: 'http://ovc.catastro.meh.es/cartografia/INSPIRE/spadgcwms.aspx',
          white_list: ['AD.Address'],
        },
        {
          name: 'Dircciones de Gipuzkoa (Euskadi)',
          type: 'WMS',
          url: 'http://b5m.gipuzkoa.eus/inspire/wms/gipuzkoa_wms',
          white_list: ['ad.Address'],
        },
        {
          name: 'Direcciones (IDEE)',
          type: 'WMS',
          url: 'http://www.cartociudad.es/wms-inspire/direcciones-ccpp',
        },
      ],
    },
    {
      name: 'Hidrografía',
      services: [
        {
          name: 'Hidrografía de España (IDEE)',
          type: 'WMS',
          url: 'http://servicios.idee.es/wms-inspire/hidrografia',
        },
        {
          name: 'Ríos (MITECO)',
          type: 'WMS',
          url: 'https://wms.mapama.gob.es/sig/Agua/RiosPfafs/wms.aspx',
          white_list: ['HY.PhysicalWaters.Waterbodies'],
        },
        {
          name: 'Subcuencas de Ríos (MITECO)',
          type: 'WMS',
          url: 'https://wms.mapama.gob.es/sig/Agua/SubcuencasCompPfafs/wms.aspx',
          white_list: ['HY.PhysicalWaters.Catchments'],
        },
        {
          name: 'Inverntario de presas (MITECO)',
          type: 'WMS',
          url: 'https://wms.mapama.gob.es/sig/Agua/Presas/wms.aspx',
          white_list: ['HY.PhysicalWaters.ManMadeObject'],
        },
      ],
    },
    {
      name: 'Transporte',
      services: [
        {
          name: 'Redes de Transporte de España (IDEE)',
          type: 'WMS',
          url: 'http://servicios.idee.es/wms-inspire/transportes',
        },
        {
          name: 'Red de Transporte Ferroviario de Adif',
          type: 'WMS',
          url: 'http://ideadif.adif.es/services/wms',
        },
        {
          name: 'Puertos del Estado',
          type: 'WMS',
          url: 'https://geoserver.puertos.es/wms-inspire/puertos',
          white_list: ['TN.WaterTransportNetwork.FairwayArea', 'TN.WaterTransportNetwork.PortArea'],
        },
      ],
    },
    {
      name: 'Lugares Protegidos',
      services: [
        {
          name: 'Lugares protegidos ENPE de Cataluña',
          type: 'WMS',
          url: 'https://geoserveis.ide.cat/servei/catalunya/inspire-espais-naturals-proteccio-especial/wms',
          white_list: ['PS.ProtectedSite'],
        },
        {
          name: 'Lugares protegidos ZEC de Cataluña',
          type: 'WMS',
          url: 'https://geoserveis.ide.cat/servei/catalunya/inspire-zones-especial-conservacio/wms',
          white_list: ['PS.ProtectedSite'],
        },
        {
          name: 'Lugares protegidos PEIN de Cataluña',
          type: 'WMS',
          url: 'https://geoserveis.ide.cat/servei/catalunya/inspire-pla-espais-interes-natural/wms',
          white_list: ['PS.ProtectedSite'],
        },
        {
          name: 'Lugares protegidos ZEPA de Cataluña',
          type: 'WMS',
          url: 'https://geoserveis.ide.cat/servei/catalunya/inspire-zones-especial-proteccio-aus/wms',
          white_list: ['PS.ProtectedSite'],
        },
        {
          name: 'Bienes de Interés Cultural  de Extremadura',
          type: 'WMS',
          url: 'http://www.ideextremadura.com/CICTEX/patrimonioCultural',
        },
        {
          name: 'Espacios Naturales Protegidos (MITECO)',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Biodiversidad/ENP/wms.aspx',
        },
        {
          name: 'Humedales Ramsar (MITECO)',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Biodiversidad/RAMSAR/wms.aspx',
        },
        {
          name: 'Lugares de Importancia Comunitaria (MITECO)',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Biodiversidad/LICS/wms.aspx',
        },
        {
          name: 'Red Natura 2000 (MITECO)',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Biodiversidad/RedNatura/wms.aspx',
        },
        {
          name: 'Red OSPAR de áreas marinas protegidas (MITECO)',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Biodiversidad/OSPAR/wms.aspx',
        },
        {
          name: 'Reservas de la Biosfera',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Biodiversidad/MAB/wms.aspx',
        },
        {
          name: 'Zona de Especial Protección para las Aves (MITECO)',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Biodiversidad/ZEPA/wms.aspx',
        },
        {
          name: 'Zonas Especialmente Protegidas de Importancia para el Mediterráneo (MITECO)',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Biodiversidad/ZEPIM/wms.aspx',
        },
      ],
    },
    {
      name: 'Cubierta Terrestre',
      services: [
        {
          name: 'Cubierta terrestre de Cataluña',
          type: 'WMS',
          url: 'https://geoserveis.ide.cat/servei/catalunya/inspire-coberta-terrestre-sigpac/wms',
          white_list: ['LC.LandCoverSurfaces'],
        },
        {
          name: 'Atlas de los Paisajes de España (MITECO)',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Biodiversidad/Paisaje/wms.aspx',
        },
        {
          name: 'Inventario Español de Zonas Húmedas (MITECO)',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Biodiversidad/IEZH/wms.aspx',
        },
        {
          name: 'Mapa de cultivos 2000 - 2010 (MAPA)',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Agricultura/MapaCultivos2000-2010/wms.aspx',
        },
        {
          name: 'Mapa Forestal de España (MITECO)',
          type: 'WMS',
          url: 'http://wms.mapama.es/sig/Biodiversidad/MFE/wms.aspx',
        },
        {
          name: 'Recintos del sistema de información geográfica de parcelas agrícolas (SIGPAC) (MAPA)',
          type: 'WMS',
          url: 'http://wms.mapama.es/wms/wms.aspx',
          white_list: ['ARBOLES', 'RECINTO', 'PARCELA'],
        },
        {
          name: 'Ocupación del Suelo en España (IDEE)',
          type: 'WMS',
          url: 'http://www.ign.es/wms-inspire/ocupacion-suelo',
          white_list: ['LC.LandCoverSurfaces'],
        },
      ],
    },
    {
      name: 'Usos del suelo',
      services: [
        {
          name: 'Ocupación del Suelo en España (IDEE)',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/ocupacion-suelo',
          white_list: ['LU.ExistingLandUse'],
        },
      ],
    },
    {
      name: 'Elevaciones',
      services: [
        {
          name: 'Modelo de Elevaciones del Terreno de Cataluña',
          type: 'WMS',
          url: 'https://geoserveis.ide.cat/servei/catalunya/inspire-elevacions/wms',
          white_list: ['EL.ElevationGridCoverage'],
        },
        {
          name: 'Modelo Digital del Terreno (IDEE)',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/mdt',
          white_list: ['EL.SpotElevation', 'EL.ContourLine', 'EL.GridCoverage'],
        },
        {
          name: 'Isóbatas del Instituto Español de Oceanografía',
          type: 'WMS',
          url: 'http://barreto.md.ieo.es/arcgis/services/visorBase/isobatas_maestras/MapServer/WmsServer',
        },
        {
          name: 'MDT en las áreas de riesgo potencial significativo de inundación (ARPSIs) (MITECO)',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/riesgos-naturales/inundaciones?',
          white_list: ['EL.GridCoverage'],
        },
      ],
    },
    {
      name: 'Geología',
      services: [
        {
          name: 'Mapa Geológico de la Península Ibérica, Baleares y Canarias 1:1M, 1995 (IGME)',
          type: 'WMS',
          url: 'http://mapas.igme.es/gis/services/Cartografia_Geologica/IGME_Geologico_1M/MapServer/WMSServer',
        },
        {
          name: 'Mapa Hidrogeológico de España a escala 1:200.000 (IGME)',
          type: 'WMS',
          url: 'http://mapas.igme.es/gis/services/Cartografia_Tematica/IGME_Hidrogeologico_200/MapServer/WMSServer',
        },
      ],
    },
    {
      name: 'Ortoimágenes',
      services: [
        {
          name: 'Ortofotografía de Euskadi',
          type: 'WMS',
          url: 'http://www.geo.euskadi.eus/WMS_ORTOARGAZKIAK',
        },
        {
          name: 'Ortofoto de Cataluña',
          type: 'WMS',
          url: 'https://geoserveis.ide.cat/servei/catalunya/inspire-ortoimatges/wms',
          white_list: ['OI.OrthoimageCoverage'],
        },
        {
          name: 'PNOA Máxima Actualidad (IDEE)',
          type: 'WMTS',
          url: 'http://www.ign.es/wmts/pnoa-ma?',
        },
      ],
    },
    {
      name: 'Edificios',
      services: [
        {
          name: 'Edificios de la D.G. de Catastro',
          type: 'WMS',
          url: 'http://ovc.catastro.meh.es/cartografia/INSPIRE/spadgcwms.aspx',
          white_list: ['BU.Building'],
        },
        {
          name: 'Edificios de Araba (Euskadi)',
          type: 'WMS',
          url: 'http://geo.araba.eus/WMS_INSPIRE_BU',
          white_list: ['BU.Building'],
        },
        {
          name: 'Edificios de Gipuzkoa (Euskadi)',
          type: 'WMS',
          url: 'http://b5m.gipuzkoa.eus/inspire/wms/gipuzkoa_wms',
          white_list: ['bu.building'],
        },
      ],
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
  // codsi: true,
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
