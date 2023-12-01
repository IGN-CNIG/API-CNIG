import WFS from 'M/layer/WFS';

export const wfs_001 = new WFS({
    url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
    namespace: "tematicos",
    name: "Provincias",
    legend: "Provincias",
    geometry: 'MPOLYGON',
    // ids:"3,4",
    // isBase: true,
    // transparent: false,
  });

