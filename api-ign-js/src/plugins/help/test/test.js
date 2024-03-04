import Help from 'facade/help';

/*
  Necesidades:
  - Se podrá posicionar en TL, TR, BL y BR
  - Se podrá parametrizar el diseño de la cabecera:
    - Imágenes
    - Título
      header: {
        images: ['url1', 'url2'], => Por defecto: [`${M.config.MAPEA_URL}img/logo_ge.svg`, `${M.config.MAPEA_URL}img/ign.svg`]
        title: 'Texto' => Por defecto: Ayuda API-CNIG
      }
  - Formato del contenido de ayuda
    Contenido inicial extra. Parámetro initialExtraContents
      + Es un array de contenidos
        + Formato 1 { title: 'text', content: 'text' }
        + Formato 2 { title: 'text', content: 'text', subContents: [{ title: 'text', content: 'text' }, ...] }
    Contenido inicial por defecto
      + Se muestra por defecto
      + en caso de no querer mostrarla indicar el parámetro extendInitialExtraContents a false
      + En caso de que se muestre junto al contenido inicial se mostrará en última posición
    Herramientas
      PLugins y controles
    Contenido final extra
      + Es un array de contenidos
        + Formato 1 { title: 'text', content: 'text' }
        + Formato 2 { title: 'text', content: 'text', subContents: [{ title: 'text', content: 'text' }, ...] }
*/

// Probar idiomas
// M.language.setLang('en');
// Añadir buscador
// Locator tendría 3 subapartados
// Parametrizar título
// Probar idomas con las ayudas
// imprimir PDF
// Definir número de niveles

const map = M.map({
  container: 'mapjs',
});


const mp = new Help({
  header: {
    images: [
    'https://www.gravatar.com/avatar/586252adace7084ee98aa8977fe5cc2b?rating=PG&size=128&default=wavatar',
    'https://www.gravatar.com/avatar/75df827b1b67c5f04f1715dd01016735?rating=PG&size=64x64&default=wavatar',
    ],
    title: 'Título definido por el usuario'
  },
  position: 'TL',
  extendInitialExtraContents: false,
  initialExtraContents: [
    { title: 'Título 1 - índice', content: '<div><h2>Título 1 - título</h2><div><p>Título 1 - Contenido</p> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Tyto_alba_close_up.jpg/200px-Tyto_alba_close_up.jpg" width="500" height="600"></div></div>',
      subContents : [
        { title: 'Título 2 - sub - indice', content: '<div><h2>Título 2 - sub - título</h2><div><p>Título 2 - sub - Contenido</p></div></div>'},
      ]
    },
    { title: 'Título 3 - índice', content: '<div><h2>Título 3 - título</h2><div><p>Título 3 - Contenido</p></div></div>'},
    { title: 'Título 4 - índice', content: '<div><h2>Título 4 - título</h2><div><p>Título 4 - Contenido</p></div></div>',
      subContents : [
        { title: 'Título 5 - sub - indice', content: '<div><h2>Título 5 - sub - título</h2><div><p>Título 5 - sub - Contenido</p></div></div>',
          subContents : [{ title: 'Título 55 - sub - indice', content: '<div><h2>Título 55 - sub - título</h2><div><p>Título 55 - sub - Contenido</p></div></div>' },
      ]
        },
      ]
    },
  ],
  finalExtraContents: [
    { title: 'Título 6 - índice', content: '<div><h2>Título 6 - título</h2><div><p>Título 6 - Contenido</p></div></div>',
      subContents : [
        { title: 'Título 7 - sub - indice', content: '<div><h2>Título 7 - sub - título</h2><div><p>Título 7 - sub - Contenido</p></div></div>' },
      ]
    },
    { title: 'Título 8 - índice', content: '<div><h2>Título 8 - título</h2><div><p>Título 8 - Contenido</p></div></div>'},
    { title: 'Título 9 - índice', content: '<div><h2>Título 9 - título</h2><div><p>Título 9 - Contenido</p></div></div>',
      subContents : [
        { title: 'Título 10 - sub - indice', content: '<div><h2>Título 10 - sub - título</h2><div><p>Título 10 - sub - Contenido</p></div></div>' },
      ]
    },
  ]
});

map.addPlugin(mp); 
window.map = map;

 