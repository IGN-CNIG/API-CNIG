import Comparepanel from 'facade/comparepanel';

M.language.setLang('es');//Español

/*
const customBGLids = ['cartomtn','imagen','hibrido','mapa'];
const customBGLtitles = ['Carto','Imagen','Mixto','Mapa'];
const customBGLlayers = [
          'WMTS*https://www.ign.es/wmts/mapa-raster?*MTN*GoogleMapsCompatible*MTN*true*image/jpeg*false*false*true',        
          'WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*imagen*false*image/jpeg*false*false*true',
          'WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*imagen*true*image/jpeg*false*false*true' + '+' +
          'WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseOrto*GoogleMapsCompatible*Callejero*true*image/png*false*false*true',
          'WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*base*false*image/jpeg*false*false*true',        
        ];

const customBGLoptions = customBGLids.map((id, index) => {
  return {
    id,
    title: customBGLtitles[index],
    layers: customBGLlayers[index].split('+'),
  };
});

M.config('backgroundlayers', customBGLoptions);
*/
const map = M.map({
  container: 'mapjs',
  center: {
    x: -667143.31,
    y: 4493011.77,
    //x: -3.23232333,
    //y: 42.2365656,
    draw: false,
  },
  controls: ['scale','location'],
  projection: 'EPSG:3857*m',
  //projection: 'EPSG:4326*d',
  zoom: 6,
});

/**
 * Plugin Comparador
 */

//SIOSE
//const wmtsSIOSE = ['SIOSE', '2020', 'WMTS*https://servicios.idee.es/wmts/ocupacion-suelo?*LC.LandCoverSurfaces*SIOSE*false*image/jpeg*false*false*false'];

//const wmtsSIOSEsource = 'WMTS*https://servicios.idee.es/wmts/ocupacion-suelo?*LC.LandCoverSurfaces*GoogleMapsCompatible*SIOSE*false*image/png*false*false*true';
//const wmtsSIOSEsource = 'WMTS*https://servicios.idee.es/wmts/ocupacion-suelo?*LC.LandCoverSurfaces*GoogleMapsCompatible*SIOSE'
//["WMTS*https://servicios.idee.es/wmts/ocupacion-suelo?*LC.LandCoverSurfaces*EPSG:3857*SIGNA"]
// const wmtsSIOSEsource = new M.layer.WMTS({
//   url: "https://servicios.idee.es/wmts/ocupacion-suelo",
//   name: "LC.LandCoverSurfaces",
//   matrixSet: "GoogleMapsCompatible",
//   legend: "CORINE / SIOSE"
// }, {
//   format: 'image/jpeg'
// });
//const wmtsSIOSE = ['SIOSE', '2020', wmtsSIOSEsource];

/**
 * 
 * new M.layer.WMTS({
            url: 'https://www.ign.es/wmts/mapa-raster?',
            name: 'MTN',
            legend: 'Mapa',
            matrixSet: 'GoogleMapsCompatible',
            transparent: false,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            format: 'image/png',
          }),

 * 
 */





const objWMTSsiose = new M.layer.WMTS({
    url: "https://servicios.idee.es/wmts/ocupacion-suelo",
    name: "LC.LandCoverSurfaces",
    matrixSet: "GoogleMapsCompatible",
    legend: "CORINE / SIOSE",
    format: 'image/png'
  });

  const objWMTSMapa = new M.layer.WMTS({
    url: 'https://www.ign.es/wmts/mapa-raster',
    name: 'MTN',
    matrixSet: 'GoogleMapsCompatible',
    legend: 'Mapa MTN',
    format: 'image/jpeg'
  });

const mpBIL = new M.plugin.BackImgLayer({
    position: 'TR',
    collapsible: true,
    collapsed: true,
    layerId: 0,
    layerVisibility: true,
    columnsNumber: 3,
    layerOpts: [
      // LiDAR Híbrido
      {
        id: 'pnoa-hibido',
        title: 'PNOA Híbrido',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqhibrid.png',
        layers: [new M.layer.WMTS({
          url: 'https://www.ign.es/wmts/pnoa-ma?',
          name: 'OI.OrthoimageCoverage',
          legend: 'Imagen (PNOA)',
          matrixSet: 'EPSG:4326',
          transparent: true,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/jpeg',
        }),
        new M.layer.WMTS({
          url: 'https://www.ign.es/wmts/ign-base?',
          name: 'IGNBaseOrto',
          matrixSet: 'EPSG:4326',
          legend: 'Mapa IGN',
          transparent: false,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/png',
        })
        ],
      },
      // PNOA Híbrido
      {
        id: 'lidar-hibrido',
        title: 'LiDAR Híbrido',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqlidar.png',
        layers: [new M.layer.WMTS({
          url: 'https://wmts-mapa-lidar.idee.es/lidar?',
          name: 'EL.GridCoverageDSM',
          legend: 'Modelo Digital de Superficies LiDAR',
          matrixSet: 'EPSG:4326',
          transparent: true,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/png',
        }),
        new M.layer.WMTS({
          url: 'https://www.ign.es/wmts/ign-base?',
          name: 'IGNBaseOrto',
          matrixSet: 'EPSG:4326',
          legend: 'Mapa IGN',
          transparent: true,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/png',
        })
        ],
      },
      // Mapa base
      {
        id: 'mapa',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqmapa.png',
        title: 'Mapa',
        layers: [new M.layer.WMTS({
          url: 'https://www.ign.es/wmts/ign-base?',
          name: 'IGNBaseTodo',
          legend: 'Mapa IGN',
          matrixSet: 'EPSG:4326',
          transparent: false,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/jpeg',
        })],
      },
      //PNOA sin textos
      {
        id: 'imagen',
        title: 'Imagen',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqimagen.png',
        layers: [new M.layer.WMTS({
          url: 'https://www.ign.es/wmts/pnoa-ma?',
          name: 'OI.OrthoimageCoverage',
          legend: 'Imagen (PNOA)',
          matrixSet: 'EPSG:4326',
          transparent: false,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/jpeg',
        })],
      },
      // LiDAR sin textos
      {
        id: 'lidar',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqlidar.png',
        title: 'LIDAR',
        layers: [new M.layer.WMTS({
          url: 'https://wmts-mapa-lidar.idee.es/lidar?',
          name: 'EL.GridCoverageDSM',
          legend: 'Modelo Digital de Superficies LiDAR',
          matrixSet: 'EPSG:4326',
          transparent: false,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/png',
        })],
      },
      // SIOSE
      {
        id: 'MAPAMTN',
        preview: 'img/mtnactual.jpg',
        title: 'Mapa MTN',
        layers: [objWMTSMapa],
      },
    ],
  }
);


const getXYZLyrs = () => {
  return {
    position: 'BR',
    layerId: 0,
    layerVisibility: true,
    collapsed: true,
    collapsible: true,
    columnsNumber: 4,
    empty: false,
    layerOpts: [
      {
        id: 'mapa',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqmapa.png',
        title: 'Mapa IGN',
        layers: [
          new M.layer.XYZ({
            url: 'https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg',
            name: 'IGNBaseTodo',
            legend: 'Mapa IGN',
            projection: 'EPSG:3857',
            transparent: false,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            tileGridMaxZoom: 17,
          }),
        ],
      },
      {
        id: 'raster',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqlidar.png',
        title: 'Mapa Raster',
        layers: [
          new M.layer.XYZ({
            url: 'https://tms-mapa-raster.ign.es/1.0.0/mapa-raster/{z}/{x}/{-y}.jpeg',
            name: 'MTN',
            legend: 'Mapa Raster',
            projection: 'EPSG:3857',
            transparent: false,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            tileGridMaxZoom: 17,
          }),
        ],
      },
      {
        id: 'imagen',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqimagen.png',
        title: 'Ortoimagen',
        layers: [
          new M.layer.XYZ({
            url: 'https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg',
            name: 'PNOA-MA',
            legend: 'Ortoimagen',
            projection: 'EPSG:3857',
            transparent: false,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            tileGridMaxZoom: 19,
          }),
        ],
      },
    ],
  };
}


const getWMTSLyrs = () => {
  return {
    position: 'TR',
    layerId: 0,
    layerVisibility: true,
    collapsed: true,
    collapsible: true,
    columnsNumber: 4,
    layerOpts: [
      {
        id: 'mapa',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqmapa.png',
        title: 'Mapa IGN',
        layers: [
          new M.layer.WMTS({
            url: 'https://www.ign.es/wmts/ign-base?',
            name: 'IGNBaseTodo',
            legend: 'Mapa IGN',
            matrixSet: 'GoogleMapsCompatible',
            transparent: false,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            format: 'image/jpeg',
          }),
        ],
      },
      {
        id: 'imagen',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqimagen.png',
        title: 'Imagen PNOA',
        layers: [
          new M.layer.WMTS({
            url: 'https://www.ign.es/wmts/pnoa-ma?',
            name: 'OI.OrthoimageCoverage',
            legend: 'Imagen PNOA',
            matrixSet: 'GoogleMapsCompatible',
            transparent: false,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            format: 'image/jpeg',
          }),
        ],
      },
      /*{
        id: 'hibrido',
        title: 'PNOA Híbrido',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqhibrid.png',
        layers: [
          new M.layer.WMTS({
            url: 'http://www.ign.es/wmts/pnoa-ma?',
            name: 'OI.OrthoimageCoverage',
            matrixSet: 'GoogleMapsCompatible',
            legend: 'PNOA Híbrido Mapa',
            transparent: true,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            format: 'image/jpeg',
          }),
          new M.layer.WMTS({
            url: 'https://www.ign.es/wmts/ign-base?',
            name: 'IGNBaseOrto',
            matrixSet: 'GoogleMapsCompatible',
            legend: 'PNOA Híbrido Topo',
            transparent: true,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            format: 'image/png',
          })
        ],
      },*/
      {
        id: 'hibridolidar',
        title: 'Lídar Híbrido',
        preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqlidar.png',
        layers: [
          new M.layer.WMTS({
            url: 'https://wmts-mapa-lidar.idee.es/lidar?',
            name: 'EL.GridCoverageDSM',
            matrixSet: 'GoogleMapsCompatible',
            legend: 'Lidar Híbrido Mapa',
            transparent: true,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            format: 'image/png',
          }),
          new M.layer.WMTS({
            url: 'https://www.ign.es/wmts/ign-base?',
            name: 'IGNBaseOrto',
            matrixSet: 'GoogleMapsCompatible',
            legend: 'Lidar Híbrido Topo',
            transparent: true,
            displayInLayerSwitcher: false,
            queryable: false,
            visible: true,
            format: 'image/png',
          })
        ],
      },
    ],
  };
}

const backImgLayersConfig = getWMTSLyrs();

const mpBILBasico = new M.plugin.BackImgLayer(
  backImgLayersConfig
  );

map.addPlugin(mpBILBasico);

const PNOAlistBaseLayersByString = [
  // WMS PNOA Histórico
  ['Americano 1956-57', '1956', 'WMS*Americano 1956-1957*https://www.ign.es/wms/pnoa-historico*AMS_1956-1957'],
  ['Interministerial 1973-86', '1983', 'WMS*Interministerial 1973-1986*https://www.ign.es/wms/pnoa-historico*Interministerial_1973-1986'],
  ['Nacional 1981-86', '1986', 'WMS*Nacional 1981-1986*https://www.ign.es/wms/pnoa-historico*NACIONAL_1981-1986'],
  ['OLISTAT', '1998', 'WMS*OLISTAT*https://www.ign.es/wms/pnoa-historico*OLISTAT'],
  ['SIGPAC', '2003', 'WMS*SIGPAC*https://www.ign.es/wms/pnoa-historico*SIGPAC'],
  ['PNOA 2004', '2004', 'WMS*PNOA 2004*https://www.ign.es/wms/pnoa-historico*pnoa2004'],
  ['PNOA 2005', '2005', 'WMS*PNOA 2005*https://www.ign.es/wms/pnoa-historico*pnoa2005'],
  ['PNOA 2006', '2006', 'WMS*PNOA 2006*https://www.ign.es/wms/pnoa-historico*pnoa2006'],
  ['PNOA 2007', '2007', 'WMS*PNOA 2007*https://www.ign.es/wms/pnoa-historico*pnoa2007'],
  ['PNOA 2008', '2008', 'WMS*PNOA 2008*https://www.ign.es/wms/pnoa-historico*pnoa2008'],
  ['PNOA 2009', '2009', 'WMS*PNOA 2009*https://www.ign.es/wms/pnoa-historico*pnoa2009'],
  ['PNOA 2010', '2010', 'WMS*PNOA 2010*https://www.ign.es/wms/pnoa-historico*pnoa2010'],
  ['PNOA 2011', '2011', 'WMS*PNOA 2011*https://www.ign.es/wms/pnoa-historico*pnoa2011'],
  ['PNOA 2012', '2012', 'WMS*PNOA 2012*https://www.ign.es/wms/pnoa-historico*pnoa2012'],
  ['PNOA 2013', '2013', 'WMS*PNOA 2013*https://www.ign.es/wms/pnoa-historico*pnoa2013'],
  ['PNOA 2014', '2014', 'WMS*PNOA 2014*https://www.ign.es/wms/pnoa-historico*pnoa2014'],
  ['PNOA 2015', '2015', 'WMS*PNOA 2015*https://www.ign.es/wms/pnoa-historico*pnoa2015'],
  ['PNOA 2016', '2016', 'WMS*PNOA 2016*https://www.ign.es/wms/pnoa-historico*pnoa2016'],
  ['PNOA 2017', '2017', 'WMS*PNOA 2017*https://www.ign.es/wms/pnoa-historico*pnoa2017'],
  ['PNOA 2018', '2018', 'WMS*PNOA 2018*https://www.ign.es/wms/pnoa-historico*pnoa2018'],
  // WMS Varios
  // ['Ultimos10dias', '2016', 'WMS*Ultimos10dias*https://www.ign.es/wms-inspire/geofisica*Ultimos10dias'],
  // ['Ultimos365dias', '2018', 'WMS*Ultimos365dias*https://www.ign.es/wms-inspire/geofisica*Ultimos365dias'],
  // ['MTN', '2020', 'WMTS*MTN*https://www.ign.es/wmts/mapa-raster*MTN*GoogleMapsCompatible*image/jpeg'],
  // ['LIDAR', '2020', 'WMTS*LIDAR*https://wmts-mapa-lidar.idee.es/lidar*EL.GridCoverageDSM*GoogleMapsCompatible*image/png'],
  // ['MTN50-Minutas', '2020', 'WMTS*MTN50-Minutas*https://www.ign.es/wmts/primera-edicion-mtn*catastrones*GoogleMapsCompatible*image/jpeg'],
  // ['MTN50-1Edi', '2020', 'WMTS*MTN50-1Edi*https://www.ign.es/wmts/primera-edicion-mtn*mtn50-edicion1*GoogleMapsCompatible*image/jpeg'],
  // ['MTN25-1Edi', '2020', 'WMTS*MTN25-1Edi*https://www.ign.es/wmts/primera-edicion-mtn*mtn25-edicion1*GoogleMapsCompatible*image/jpeg'],
  // ['Waterbodies', '2015', 'WMS*Waterbodies*https://wms.mapama.gob.es/sig/Agua/Embalses/wms.aspx*HY.PhysicalWaters.Waterbodies'],
  // ['Ultimos30dias', '2017', 'WMS*Ultimos30dias*https://www.ign.es/wms-inspire/geofisica*Ultimos30dias'],
  // ['Curvas de nivel', '2020', 'WMS*Curvas de nivel*https://servicios.idee.es/wms-inspire/mdt*EL.ContourLine'],
  // ['MTN', '2020', 'WMS*MTN*https://www.ign.es/wms-inspire/mapa-raster*mtn_rasterizado'],                // CORS
  // ['SIOSE', '2020', 'WMS*SIOSE*https://servicios.idee.es/wms-inspire/ocupacion-suelo-historico*siose2005'], //CORS
  // ['MDT', '2020', 'WMS*MDT*https://servicios.idee.es/wms-inspire/mdt*EL.GridCoverage'],
  // ['MTN50-Minutas', '2020', 'WMS*MTN50-Minutas*https://www.ign.es/wms/primera-edicion-mtn*catastrones'], // CORS
  // ['MTN50-1Edi', '2020', 'WMS*MTN50-1Edi*https://www.ign.es/wms/primera-edicion-mtn*MTN50'],  // CORS
  // ['MTN25-1Edi', '2020', 'WMS*MTN25-1Edi*https://www.ign.es/wms/primera-edicion-mtn*MTN25'],  //CORS 
  // WMTS Varios
  // ['MDT-Relieve', '2020', 'WMTS*MDT Relieve*https://servicios.idee.es/wmts/mdt*Relieve*GoogleMapsCompatible*image/jpeg'],
  // ['SIOSE', '2020', 'WMTS*SIOSE*https://servicios.idee.es/wmts/ocupacion-suelo*LC.LandCoverSurfaces*GoogleMapsCompatible*image/png'],
  //['MDT-Elevaciones', '2020', 'WMTS*MDT-Elevaciones*https://servicios.idee.es/wmts/mdt*EL.GridCoverage*GoogleMapsCompatible*image/jpeg'],

];


const SENTINELlistBaseLayersByString = [
    ['Huellas Sentinel2', '2018', 'WMS*Huellas Sentinel2*https://wms-satelites-historicos.idee.es/satelites-historicos*teselas_sentinel2_espanna'],
    ['Invierno 2022 falso color natural', '2022', 'WMS*Invierno 2022 falso color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2022invierno_432-1184'],
    ['Invierno 2022 falso color infrarrojo', '2022', 'WMS*Invierno 2022 falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2022invierno_843'],
    ['Filomena', '2021', 'WMS*Filomena*https://wms-satelites-historicos.idee.es/satelites-historicos*Filomena'],
    ['Invierno 2021 falso color natural', '2021', 'WMS*Invierno 2021 falso color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2021invierno_432-1184'],
    ['Invierno 2021 falso color infrarrojo', '2021', 'WMS*Invierno 2021 falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2021invierno_843'],
    ['Verano 2021 falso color natural', '2021', 'WMS*Verano 2021 falso color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2021verano_432-1184'],
    ['Verano 2021 falso color infrarrojo', '2021', 'WMS*Verano 2021 falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2021verano_843'],
    ['Invierno 2020 falso color natural', '2020', 'WMS*Invierno 2020 falso color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2020invierno_432-1184'],
    ['Invierno 2020 falso color infrarrojo', '2020', 'WMS*Invierno 2020 falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2020invierno_843'],
    ['Verano 2020 falso color natural', '2020', 'WMS*Verano 2020 falso color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2020verano_432-1184'],
    ['Verano 2020 falso color infrarrojo', '2020', 'WMS*Verano 2020 falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2020verano_843'],
    ['Invierno 2019 falso color natural', '2019', 'WMS*Invierno 2019 falso color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2019invierno_432-1184'],
    ['Invierno 2019 falso color infrarrojo', '2019', 'WMS*Invierno 2019 falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2019invierno_843'],
    ['Verano 2019 falso color natural', '2019', 'WMS*Verano 2019 falso color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2019verano_432-1184'],
    ['Verano 2019 falso color infrarrojo', '2019', 'WMS*Verano 2019 falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2019verano_843'],
    ['Verano 2018 falso color natural', '2018', 'WMS*Verano 2018 falso color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2018verano_432-1184'],
    ['Verano 2018 falso color infrarrojo', '2018', 'WMS*Verano 2018 falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2018verano_843'],
    ['Huellas Spot5', '2005', 'WMS*Huellas Spot5*https://wms-satelites-historicos.idee.es/satelites-historicos*HuellasSpot5_espanna'],
    ['2014. Pseudocolor natural', '2014', 'WMS*2014. Pseudocolor natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SPOT.2014'],
    ['2013. Pseudocolor natural', '2013', 'WMS*2013. Pseudocolor natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SPOT.2013'],
    ['2012. Pseudocolor natural', '2012', 'WMS*2012. Pseudocolor natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SPOT.2012'],
    ['2011. Pseudocolor natural', '2011', 'WMS*2011. Pseudocolor natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SPOT.2011'],
    ['2009. Pseudocolor natural', '2009', 'WMS*2009. Pseudocolor natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SPOT.2009'],
    ['2008. Pseudocolor natural', '2008', 'WMS*2008. Pseudocolor natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SPOT.2008'],
    ['2005. Pseudocolor natural', '2005', 'WMS*2005. Pseudocolor natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SPOT.2005'],
    ['Huellas Landsat8', '1971', 'WMS*Huellas Landsat8*https://wms-satelites-historicos.idee.es/satelites-historicos*Landsat_huellas_espanna'],
    ['Landsat 8 2014. Color natural', '2014', 'WMS*Landsat 8 2014. Color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT8.2014_432'],
    ['Landsat 8 2014. Falso color infrarrojo', '2014', 'WMS*Landsat 8 2014. Falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT8.2014_654'],
    ['Landsat 5 TM 2006. Color natural', '2006', 'WMS*Landsat 5 TM 2006. Color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT5.2006_321-543'],
    ['Landsat 5 TM 2006. Falso color infrarrojo', '2006', 'WMS*Landsat 5 TM 2006. Falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT5.2006_432'],
    ['Landsat 5 TM 1996. Color natural', '1996', 'WMS*Landsat 5 TM 1996. Color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT5.1996_321-543'],
    ['Landsat 5 TM 1996. Falso color infrarrojo', '1996', 'WMS*Landsat 5 TM 1996. Falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT5.1996_432'],
    ['Landsat 5 TM 1991. Color natural', '1991', 'WMS*Landsat 5 TM 1991. Color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT5.1991_321-543'],
    ['Landsat 5 TM 1991. Falso color infrarrojo', '1991', 'WMS*Landsat 5 TM 1991. Falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT5.1991_432'],
    ['Landsat 5 TM 1986. Color natural', '1986', 'WMS*Landsat 5 TM 1986. Color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT5.1986_321-543'],
    ['Landsat 5 TM 1986. Falso color infrarrojo', '1986', 'WMS*Landsat 5 TM 1986. Falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT5.1986_432'],
    ['Landsat 1 1971-1975. Color natural', '1971', 'WMS*Landsat 1 1971-1975. Color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT1_544-574'],
    ['Landsat 1 1971-1975. Falso color infrarrojo', '1971', 'WMS*Landsat 1 1971-1975. Falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*LANDSAT1_654'],
    ['Fondo', '2001', 'WMS*Fondo*https://wms-satelites-historicos.idee.es/satelites-historicos*fondo'],
];/* 40 capas */


const mpTOC = new M.plugin.FullTOC({
  position: 'TR',
});

map.addPlugin(mpTOC);


const mpVector = new M.plugin.Vectors({
  position: 'TR',
  collapsed: true,
  collapsible: true,
});

map.addPlugin(mpVector);

const pluginComparepanel = new Comparepanel({
  position: 'TR',
  vertical: true,
  collapsed: false,
  collapsible: true,
  defaultCompareMode: 'mirror',// mirror - curtain - timeline - spyeye
  defaultCompareViz: 1,
  baseLayers: SENTINELlistBaseLayersByString,
  /*urlcoberturas: 'https://projects.develmap.com/apicnig/pnoahisto/coberturas.geojson',*/
  timelineParams: { 
    animation: true,
  },
  transparencyParams: { 
    radius: 100, 
  },
  lyrcompareParams: { 
      staticDivision: 2,
      defaultLyrA:0,
      defaultLyrB:1,
      defaultLyrC:2,
      defaultLyrD:3,
      opacityVal:100,
   },
  mirrorpanelParams: { 
      showCursors: true,
      reverseLayout:true,
      enabledPlugins: true,
      enabledKeyFunctions: true,
  }
});

map.addPlugin(pluginComparepanel);

