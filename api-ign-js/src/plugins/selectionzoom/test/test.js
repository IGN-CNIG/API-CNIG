import SelectionZoom from 'facade/selectionzoom';

M.language.setLang('es');
// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  zoom: 4,
  layers: [new M.layer.WMTS({
    url: 'http://www.ign.es/wmts/pnoa-ma?',
    name: 'OI.OrthoimageCoverage',
    legend: 'Imagen (PNOA)',
    matrixSet: 'GoogleMapsCompatible',
    transparent: true,
    displayInLayerSwitcher: false,
    queryable: false,
    visible: true,
    format: 'image/jpeg',
  })],
});
window.map = map;

const mp = new SelectionZoom({
  collapsible: false,
  collapsed: false,
  position: 'TR', // 'TL' | 'TR' | 'BR' | 'BL'
  tooltip: 'TOOLTIP TEST Vista predefinida',
  // Parámetro de opciones para configurar zonas
  options: [{
      id: 'peninsula', title: 'Peninsula', preview: '../src/facade/assets/images/espana.png',
      bbox: '-1200091.444315327, 4348955.797933925, 365338.89496508264, 5441088.058207252',
      // center:'-417376.27467512223, 4895021.928070588', zoom: 6,
    },
    {
      id: 'canarias', title: 'Canarias', preview: '../src/facade/assets/images/canarias.png',
      center: '-1844272.618465, 3228700.074766', zoom: 8,
      // bbox: '-2054015.8240795243,3014676.395567504,-1460864.4845865564,3606604.742607909', // Es decir xmin,ymin,xmax,ymax.
    },
    {
      id: 'baleares', title: 'Baleares', preview: '../src/facade/assets/images/baleares.png',
      bbox: '115720.89020469127,4658411.436032817,507078.4750247937,4931444.501067467',
      // center: '311399.6826147425, 4794927.968550142', zoom: 8,
    },
    {
      id: 'ceuta', title: 'Ceuta', preview: '../src/facade/assets/images/ceuta.png',
      bbox: '-599755.2558583047, 4281734.817081453, -587525.3313326766, 4290267.100363785', zoom: 8, // con zoom extra sobrante que no se usará
      // center: '-593640.2935954906, 4286000.958722619', zoom: 13,
    },
    {
      id: 'melilla', title: 'Melilla', preview: '../src/facade/assets/images/melilla.png',
      center: '-327838.4143151213, 4203788.135342773', zoom: 14, // Al no estar configurado uno de estos métodos daba error
      // bbox: '-331239.86207381164, 4199163.69513152, -324436.96655643097, 4208412.575554026', // Al no estar configurado uno de estos métodos daba error
    },
  ], // */
  /* / Parámetros por separado de las mismas zonas de arriba (DEPRECADO)
  ids: 'peninsula,canarias,baleares,ceuta,melilla',
  titles: 'Peninsula,Canarias,Baleares,Ceuta,Melilla',
  previews: '../src/facade/assets/images/espana.png,../src/facade/assets/images/canarias.png,../src/facade/assets/images/baleares.png,../src/facade/assets/images/ceuta.png,../src/facade/assets/images/melilla.png',
  zooms: '6,8,8,13,14', // Parecen ser obligatorios para bboxs
  bboxs: [ '-1200091.444315327, 365338.89496508264, 4348955.797933925, 5441088.058207252', '-2054015.8240795243, -1460864.4845865564, 3014676.395567504, 3606604.742607909', '115720.89020469127, 507078.4750247937, 4658411.436032817, 4931444.501067467', '-599755.2558583047, -587525.3313326766, 4281734.817081453, 4290267.100363785', '-331239.86207381164, -324436.96655643097, 4199163.69513152, 4208412.575554026'], // ORDENADO [0][2][1][3] comparado con la estructura de arriba. Es decir xmin,xmax,ymin,ymax.
  // bboxs:'-1200091.444315327, 365338.89496508264, 4348955.797933925, 5441088.058207252,-2054015.8240795243, -1460864.4845865564, 3014676.395567504, 3606604.742607909,115720.89020469127, 507078.4750247937, 4658411.436032817, 4931444.501067467,-599755.2558583047, -587525.3313326766, 4281734.817081453, 4290267.100363785,-331239.86207381164, -324436.96655643097, 4199163.69513152, 4208412.575554026', // Formato string
  // centers no existe para este tipo de parametrizado antiguo es solo parte del nuevo,
  // centers: ['-417376.27467512223, 4895021.928070588', '-1844272.618465, 3228700.074766', '311399.6826147425, 4794927.968550142','-593640.2935954906, 4286000.958722619','-327838.4143151213, 4203788.135342773'],
  // */
  order : 1
});
map.addPlugin(mp); window.mp = mp;

// Lista de errores encontrados

// 1 - ERROR Parámetro "position: 'BL'" tiene el botón de cerrado flotando por separado de la caja con los demás elementos.

// 2 - ERROR hay bastantes problemas con la función turnLayerOptsIntoUrl(), hay dos formatos de parámetros el nuevo y el antiguo deprecado, se podría tener esto en cuenta con la variable "newparameterization"
// No usa los nombres de parámetros apropiados, los de ahora son los plurales "ids"... del parámetro deprecado, pero en este caso no existe el layerOpts por lo que sufre error de null, si se cambian a singulares funcionará bien el parámetro nuevo.
// Parece que el configurado de "bboxs" usan "zooms" por error, que realmente tendría que ser "bboxs"(deprecado) o "bbox"(nuevo).
// El apartado de "const backLayerIndex = this.layerOpts.indexOf(l);" es sobrante ya que con añadir index al forEach "this.layerOpts.forEach((l, index) => {..." se puede obtener este index sin más operaciones.
// En el nuevo parametrizado no prevé el uso de "Center" además si se pone el bbox, se puede omitir zoom y center. Por lo que pueden haber situaciones que crean undefined porque estos parámetros no existen, por ejemplo en zooms(por cada zoom que falta) o en bbox(Esperada lista de 4 números expresado con un undefined). 

// 3 - ERROR la función getAPIRest() esta diseñada solo para el antiguo formato de parámetros. Es decir la presencia de "center" causa que no haga falta usar bbox por lo que termina vacío en este API, por lo que se pierde el orden que relaciona cada elemento, además el zoom es opcional si se pone bbox con el nuevo parametrizado (aquí además hay error por newLine que se apunto antes).
// Se podría incluir "newparameterization" y usar función "turnLayerOptsIntoUrl" si se arregla esta para su generado con nuevos parámetros.

// 4 - ERROR en Readme no se comenta el parametrizado deprecado ni la función getAPIRest.

// 5 - ERROR si se pone el "collapsible: false," entonces el panel no se tiene que cerrar, pero en el momento que se da click sobre una de estas opciones este se apaga.
// Es causado por "document.querySelector('.m-panel.m-plugin-selectionzoom.opened > button.m-panel-btn').click();" en "selectionzoom/src/facade/js/selectionzoomcontrol.js", aquí no se envía el collapsible por lo que se tendría que obtener para saber si usar o no este.

// 6 - ERROR el JSP de este plugin no tiene todos los parámetros para editar, en concreto "tooltip" y "options".
// Además se usa el antiguo formato deprecado de parametrizado de este plugin en vez del nuevo.
