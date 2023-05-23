import ContactLink from 'facade/contactlink';

const map = M.map({
  container: 'mapjs',
  // controls: ['layerswitcher'],
});

// M.language.setLang('en');

const mp = new ContactLink({
  position: 'TL',
  descargascnig: 'http://centrodedescargas.cnig.es/CentroDescargas/index.jsp',
  pnoa: 'https://www.ign.es/web/comparador_pnoa/index.html',
  visualizador3d: 'https://visualizadores.ign.es/estereoscopico/',
  fototeca: 'https://fototeca.cnig.es/',
  twitter: 'https://twitter.com/IGNSpain',
  instagram: 'https://www.instagram.com/ignspain/',
  facebook: 'https://www.facebook.com/IGNSpain/',
  pinterest: 'https://www.pinterest.es/IGNSpain/',
  youtube: 'https://www.youtube.com/user/IGNSpain',
  mail: 'mailto:ign@fomento.es',
  tooltip: 'Contacta con nosotros',

});

/*const mvt = new M.layer.MVT({
  url: 'https://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/gwc/service/tms/1.0.0/Global:carloscastellano_rios____cc_20191104@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
  name: 'vectortile',
  projection: 'EPSG:3857',
});

map.addLayers(mvt)*/
map.addPlugin(mp);

window.map = map;
