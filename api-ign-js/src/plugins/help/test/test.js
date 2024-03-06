import Help from 'facade/help';

/*
  Necesidades:
  - Parámetros básicos
    - Position: por defecto TR
    - Nota: collapsed, collapsible e isDraggable: no están implementados porque no tiene panel
    - Tooltip: por defecto Ayuda
  - Parámetros del plugin
    - Cabecera: puede recibir título e imágenes.
      header: {
        images: [...], Por defecto: [`${M.config.MAPEA_URL}img/logo_ge.svg`, `${M.config.MAPEA_URL}img/ign.svg`]
        title: '...' Por defecto: Ayuda API-CNIG
      }
    - Ayuda para mostrar (inicial):
      - Por defecto mostrará una introducción de la API-CNIG y la ayuda de los plugins que dispongan de ello
      - Si no se desea mostrar la introducción por defecto se usará el parámetro extendInitialExtraContents a false
      - Si se desea extender la información que se muestra ANTES de la ayuda de los plugins/controles usar el parámetro initialExtraContents.
        - extendInitialExtraContents tiene que tener valor true
        - initialExtraContents: [...] o si se quiere indicar varios idiomas {es: [...]}
        - initialExtraContents tendrá el formato: 
          { title: '...', content: '...', subContents : [{ title: '...', content: '...'}]}
          - El subContents es opcional
          - Formato recomendable para content es:
            <div><h2>Titulo</h2><div>HTML</div></div>
          - La información por defecto de la API se añadirá después de la indicada por el usuario
    - Ayuda plugins y controles
      - Siempre lo muestra
    - Ayuda para mostrar (final):
      - Independiente de los parámetros extendInitialExtraContents e initialExtraContents
      - Es igual que initialExtraContents pero llamándose finalExtraContents
  - Otras funcionalidades
      - Imprimir en PDF la ayuda
      - El buscar solo filtra la lista, no el contenido
      - Cuando búsca no es case sensitive
      - Si tiene anidación muestra el árbol
  Notas:
    - Con el tema de los idiomas:
      - La ayuda de los plugins se mostrará con el idioma que tenga el visualizador
      - El contenido extra por defecto igual
      - El contenido extra definido por el usuario:
        - Si el usuario indicó en el objeto el idioma que tiene el visualizar se mostrará
        - En caso contrario se obtendrá el idioma español
        - En caso de que no lo tenga especificado se mostrará el primero especificado por el usuario
    - El buscador requiere más tiempo, ya que en Iberpix está con REACT, no sería copiar y pegar la función. Además busca hasta en el contenido.
    - Por rest sin base64 sólo se podrá indicar los parámetros position, tooltip y extendInitialExtraContents, usando base64 todos los parámetros
*/


// M.language.setLang('en');
// Añadir buscador
// Añadir ocultar
// Locator tendría 3 subapartados
// Revisar el compartir este plugin

M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});


const mp = new Help({
  position: 'TL', // TR, BR, TL, BL
  // tooltip: 'Mi ayuda',
  // header: {
  //   images: [
  //     'https://www.gravatar.com/avatar/586252adace7084ee98aa8977fe5cc2b?rating=PG&size=128&default=wavatar',
  //     'https://www.gravatar.com/avatar/75df827b1b67c5f04f1715dd01016735?rating=PG&size=64x64&default=wavatar',
  //   ],
  //   title: 'Título definido por el usuario'
  // },
  // extendInitialExtraContents: false,
  // initialExtraContents: {es: [
  //   { title: 'Índice 1', content: '<div><h2>Título 1</h2><div><p>Contenido 1</p> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Tyto_alba_close_up.jpg/200px-Tyto_alba_close_up.jpg" width="300" height="400"></div></div>',
  //     subContents : [
  //       { title: 'Índice 2', content: '<div><h2>Título 2</h2><div><p>Contenido 2</p></div></div>'},
  //     ]
  //   },
  //   { title: 'Índice 3', content: '<div><h2>Título 3</h2><div><p>Contenido 3</p></div></div>'},
  //   { title: 'Índice 4', content: '<div><h2>Título 4</h2><div><p>Contenido 4</p></div></div>',
  //     subContents : [
  //       { title: 'Índice 5', content: '<div><h2>Título 5</h2><div><p>Contenido 5</p></div></div>',
  //         subContents : [{ title: 'Índice 6', content: '<div><h2>Título 6</h2><div><p>Contenido 6</p></div></div>',
  //       subContents : [{ title: 'Índice 6 esp', content: '<div><h2>Título 6 esp</h2><div><p>Contenido 6 esp</p></div></div>' }], },
  //     ]
  //       },
  //     ]
  //   },
  // ], en: [
  //   { title: 'Index 1', content: '<div><h2>Title 1</h2><div><p>Content 1</p> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Tyto_alba_close_up.jpg/200px-Tyto_alba_close_up.jpg" width="300" height="400"></div></div>',
  //     subContents : [
  //       { title: 'Index 2', content: '<div><h2>Title 2</h2><div><p>Content 2</p></div></div>'},
  //     ]
  //   },
  //   { title: 'Index 3', content: '<div><h2>Title 3</h2><div><p>Content 3</p></div></div>'},
  //   { title: 'Index 4', content: '<div><h2>Title 4</h2><div><p>Content 4</p></div></div>',
  //     subContents : [
  //       { title: 'Index 5', content: '<div><h2>Title 5</h2><div><p>Content 5</p></div></div>',
  //         subContents : [{ title: 'Index 6', content: '<div><h2>Title 6</h2><div><p>Content 6</p></div></div>',
  //       subContents : [{ title: 'Index 6 esp', content: '<div><h2>Title 6 esp</h2><div><p>Content 6 esp</p></div></div>' }], },
  //     ]
  //       },
  //     ]
  //   },
  // ]},
    initialExtraContents: [
    { title: 'Índice 1', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 1</h2><div><p>Contenido 1</p> <img style="margin-left: 20%;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Tyto_alba_close_up.jpg/200px-Tyto_alba_close_up.jpg" width="300" height="400"></div></div>',
      subContents : [
        { title: 'Índice 2', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 2</h2><div><p>Contenido 2</p></div></div>'},
      ]
    },
    { title: 'Índice 3', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 3</h2><div><p>Contenido 3</p></div></div>'},
    { title: 'Índice 4', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 4</h2><div><p>Contenido 4</p></div></div>',
      subContents : [
        { title: 'Índice 5', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 5</h2><div><p>Contenido 5</p></div></div>',
          subContents : [{ title: 'Índice 6', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 6</h2><div><p>Contenido 6</p></div></div>',
        subContents : [{ title: 'Índice 6 esp', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 6 esp</h2><div><p>Contenido 6 esp</p></div></div>' }], },
      ]
        },
      ]
    },
  ],
  // finalExtraContents: { es: [
  //   { title: 'Índice 7', content: '<div><h2>Título 7</h2><div><p>Contenido 7</p> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Tyto_alba_close_up.jpg/200px-Tyto_alba_close_up.jpg" width="300" height="400"></div></div>',
  //     subContents : [
  //       { title: 'Índice 8', content: '<div><h2>Título 8</h2><div><p>Contenido 8</p></div></div>'},
  //     ]
  //   },
  //   { title: 'Índice 9', content: '<div><h2>Título 9</h2><div><p>Contenido 9</p></div></div>'},
  //   { title: 'Índice 10', content: '<div><h2>Título 10</h2><div><p>Contenido 10</p></div></div>',
  //     subContents : [
  //       { title: 'Índice 11', content: '<div><h2>Título 11</h2><div><p>Contenido 11</p></div></div>',
  //         subContents : [{ title: 'Índice 12', content: '<div><h2>Título 10</h2><div><p>Contenido 12</p></div></div>' },
  //     ]
  //       },
  //     ]
  //   },
  // ], en: [
  //   { title: 'Index 7', content: '<div><h2>Title 7</h2><div><p>Content 7</p> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Tyto_alba_close_up.jpg/200px-Tyto_alba_close_up.jpg" width="300" height="400"></div></div>',
  //     subContents : [
  //       { title: 'Index 8', content: '<div><h2>Title 8</h2><div><p>Content 8</p></div></div>'},
  //     ]
  //   },
  //   { title: 'Index 9', content: '<div><h2>Title 9</h2><div><p>Content 9</p></div></div>'},
  //   { title: 'Index 10', content: '<div><h2>Title 10</h2><div><p>Content 10</p></div></div>',
  //     subContents : [
  //       { title: 'Index 11', content: '<div><h2>Title 11</h2><div><p>Content 11</p></div></div>',
  //         subContents : [{ title: 'Index 12', content: '<div><h2>Title 10</h2><div><p>Content 12</p></div></div>' },
  //     ]
  //       },
  //     ]
  //   },
  // ]},
  finalExtraContents: [
    { title: 'Índice 7', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 7</h2><div><p>Contenido 7</p> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Tyto_alba_close_up.jpg/200px-Tyto_alba_close_up.jpg" width="300" height="400"></div></div>',
      subContents : [
        { title: 'Índice 8', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 8</h2><div><p>Contenido 8</p></div></div>'},
      ]
    },
    { title: 'Índice 9', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 9</h2><div><p>Contenido 9</p></div></div>'},
    { title: 'Índice 10', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 10</h2><div><p>Contenido 10</p></div></div>',
      subContents : [
        { title: 'Índice 11', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 11</h2><div><p>Contenido 11</p></div></div>',
          subContents : [{ title: 'Índice 12', content: '<div><h2 style="text-align: center; color: #fff; background-color: #364b5f; padding: 8px 10px;">Título 10</h2><div><p>Contenido 12</p></div></div>' },
      ]
        },
      ]
    },
  ],
});

map.addPlugin(mp); 
window.map = map;

 