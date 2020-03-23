import ContactLink from 'facade/contactlink';

const map = M.map({
  container: 'mapjs',
});

const mp = new ContactLink({
  position: 'TR',
  // links: [{
  //     name: 'Toogle',
  //     url: 'https://www.deepl.com/es/translator',
  //   },
  //   {
  //     name: 'Redmine',
  //     url: 'https://www.guadaltel.es/redmine/',
  //   },
  //   {
  //     name: 'css',
  //     url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
  //   }
  // ]
});

map.addPlugin(mp);

window.map = map;
