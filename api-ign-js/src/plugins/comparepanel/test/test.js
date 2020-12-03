import Comparepanel from 'facade/comparepanel';

M.language.setLang('es');//Español

/**
* Definimos las capas con notación MAPEA
*/

/**
 * Objeto mapa
 */

const map = M.map({
  container: 'mapjs',
  controls: ['location'],
  center: [-412300, 4926700],
  resolutions: [51444.18059766173, 25722.090298830866, 12861.045149415433,
    6430.522574707717, 3215.2612873538583, 1607.6306436769291, 803.8153218384646,
    401.9076609192323, 200.95383045961614, 100.47691522980807, 50.238457614904036,
    25.119228807452018, 12.559614403726009, 6.2798072018630045, 3.1399036009315022,
    1.5699518004657511, 0.7849759002328756, 0.3699518004657511, 0.18497590023287555,
  ],
  zoom: 14,
  //minZoom: 14,
});

/**
 * Plugin Comparador
 */

/*const pluginComparepanel = new Comparepanel({
  position: 'TR',
  vertical: true,
  collapsed: false,
  collapsible: false,
  baseLayers: [
    ['Americano 1956-1957', '1956', 'WMS*Americano 1956-1957*https://www.ign.es/wms/pnoa-historico*AMS_1956-1957'],
    ['Interministerial 1973-1986', '1983', 'WMS*Interministerial 1973-1986*https://www.ign.es/wms/pnoa-historico*Interministerial_1973-1986'],
    ['Nacional 1981-1986', '1986', 'WMS*Nacional 1981-1986*https://www.ign.es/wms/pnoa-historico*NACIONAL_1981-1986'],
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
    //['PNOA Actual', '2020', 'WMTS*MTN*http://www.ign.es/wmts/mapa-raster*MTN*GoogleMapsCompatible*image/jpeg'],
  ],
  timelineParams: { animation: true, },
  transparencyParams: { radius: 140, },
  lyrcompareParams: { staticDivision: 2, },
  mirrorpanelParams: { showCursors: true, }
});*/

const pluginComparepanel = new Comparepanel({
  position: 'TR',
  vertical: true,
  collapsible: false,
  baseLayers: [
    ['Plano de Mancelli, 1622', '1622', 'WMS*Mancelli 1622*https://www.ign.es/wms/planos*MancelliMadrid'],
    ['Plano de Texeira, 1656', '1656', 'WMS*Texeira 1656*https://www.ign.es/wms/planos*Texeira'],
    ['Plano de Nicolás Chalmandrier, 1761', '1761', 'WMS*Chalmandrier 1761*https://www.ign.es/wms/planos*ChalmadrierMadrid'],
    ['Plano de Espinosa de los Monteros, 1769', '1769', 'WMS*Espinosa de los Monteros 1769*https://www.ign.es/wms/planos*EspinosaMadrid'],
    ['Plano Geométrico de Madrid de Tomás López, 1785', '1785', 'WMS*Tomás López 1785*https://www.ign.es/wms/planos*GeometricoMadrid'],
    ['Plano de Madoz y Coello, 1848', '1848', 'WMS*Madoz y Coello 1848*https://www.ign.es/wms/planos*madozMadrid'],
    ['Plano de Facundo Cañada, 1900', '1900', 'WMS*Facundo Cañada 1900*https://www.ign.es/wms/planos*facundoMadrid'],
    ['Plano de Nuñez Granés, 1910', '1910', 'WMS*Nuñez Granés 1910*https://www.ign.es/wms/planos*nunezMadrid'],
    ['Plano parcelario, 1929', '1929', 'WMS*Parcelario 1929*https://www.ign.es/wms/planos*ayuntamientoMadrid'],
    ['Plano parcelario, 1940', '1940', 'WMS*Parcelario 1940*https://www.ign.es/wms/planos*parcelarioMadrid'],
  ],
  timelineParams: { animation: true },
  transparencyParams: { radius: 140 },
  lyrcompareParams: { staticDivision: 2 },
  mirrorpanelParams: { showCursors: true },
});

map.addPlugin(pluginComparepanel);

window.map = map;
