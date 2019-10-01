import Printer from 'facade/printer';

const map = M.map({
  container: 'mapjs',
  wmcfiles: ['cdau'],
});

const mp = new Printer({
  url: 'https://geoprint.desarrollo.guadaltel.es/print/CNIG',
  params: {
    layout: {
      outputFilename: 'mapea_${yyyy-MM-dd_hhmmss}',
    },
    pages: {
      clientLogo: 'http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif',
      creditos: 'Impresión generada a través de Mapea',
    },
    parameters: {
      imageSpain: 'file://E01_logo_IGN_CNIG.png',
      imageCoordinates: 'file://E01_logo_IGN_CNIG.png',
    },
  },
}, {
  options: {
    legend: 'true',
  },
});

map.addPlugin(mp);

window.map = map;
