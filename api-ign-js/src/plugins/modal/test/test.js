import Modal from 'facade/modal';

M.language.setLang('es');
// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});
window.map = map;

const mp = new Modal({
  collapsed: true,
  collapsible: true,
  position: 'TR', // 'TL' | 'TR' | 'BL' | 'BR'
  tooltip: 'Más información',
  // url_en: 'template_en', url_es: 'template_es',
  // url_en: 'https://www.ign.es/iberpix/ayuda/en.html', url_es: 'https://www.ign.es/iberpix/ayuda/es.html',
  helpLink: { en: 'https://www.ign.es/iberpix/ayuda/en.html', es: 'https://www.ign.es/iberpix/ayuda/es.html'},
  order: 1,
});

map.addPlugin(mp); window.mp = mp;

// Lista de errores encontrados

// 1 - ERROR Las imágenes o links de esta ayuda no funcionan porque intentan usar la URL presente en vez de la original.
// Se puede poner  para asegurarse que se aplican estas urls de forma básica dentro del "createView(map){...M.remote.get..." este código de aquí:
// html = html.replaceAll(/(src|href)="([^http].*)?"/g, (...matched) => { let count = this.url_.indexOf(matched[2].split('/').find(b => b !== '' && this.url_.indexOf(b) !== -1)) - 1; let between = ''; if (count < 0) { count = 0; } else { between = matched[2][0] === '/' ? '' : '/'; } return `${matched[1]}="${this.url_.substring(0, count)}${between}${matched[2]}"`; });
