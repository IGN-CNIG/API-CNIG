import ContactLink from 'facade/contactlink';

const map = M.map({
  container: 'mapjs',
});

const mp = new ContactLink({
  links: [{
      name: 'Centro de Descargas CNIG',
      url: 'http://centrodedescargas.cnig.es/CentroDescargas/index.jsp'
    },
    {
      name: 'Visualizador 3D',
      url: 'https://www.ign.es/3D-Stereo/'
    },
    {
      name: 'Comparador PNOA ',
      url: 'https://www.ign.es/web/comparador_pnoa/index.html'
    },
    {
      name: 'Fototeca',
      url: 'https://fototeca.cnig.es/'
    },
    {
      name: 'Twitter IGN',
      url: 'https://twitter.com/IGNSpain'
    },
    {
      name: 'Instagram IGN',
      url: 'https://www.instagram.com/ignspain/'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/IGNSpain/'
    },
    {
      name: 'Youtube',
      url: 'https://www.youtube.com/user/IGNSpain'
    },
    {
      name: 'Pinterest',
      url: 'https://www.pinterest.es/IGNSpain/'
    },
    {
      name: 'Contacto email IGN',
      url: 'ign@fomento.es'
    }
  ]
});

map.addPlugin(mp);
