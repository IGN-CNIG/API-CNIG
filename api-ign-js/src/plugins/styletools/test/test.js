import StyleTools from 'facade/styletools';

const map = M.map({ container: 'mapjs' });

const mp = new StyleTools();
const provincias = new M.layer.GeoJSON({ name: 'Provincias', url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json', extract: false });
const lineas = new M.layer.GeoJSON({ name: 'Provincias', url: 'https://gischgdes.chguadalquivir.es/geoserver/chg/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=chg:act2009&maxFeatures=50&outputFormat=application/json', extract: false });
const puntos = new M.layer.GeoJSON({ name: 'Provincias', url: 'https://gischgdes.chguadalquivir.es/geoserver/chg/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=chg:vertidos_no_autorizados&maxFeatures=50&outputFormat=application/json', extract: false });

map.addLayers(provincias);
map.addLayers(lineas);
map.addLayers(puntos);
map.addControls(['mouse']);
map.addPlugin(mp);
