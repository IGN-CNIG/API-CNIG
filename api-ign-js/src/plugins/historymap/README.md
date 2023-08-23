# M.plugin.HistoryMap

Plugin que muestra una historia en forma de carrusel. Esta compuesta por diferentes steps en los cuales se ejecurán animaciones preconfiguradas.

# Dependencias

- historymap.ol.min.js
- historymap.ol.min.css

Es necesario descargar la librería TR3: https://github.com/accima/TR3-pack

```html
 <link href="../../plugins/historymap/historymap.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/historymap/historymap.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**.  Ubicación del plugin sobre el mapa.
  - 'TL':top left (default)
  - 'TR':top right 
- **collapsed**. Indica si el plugin aparece por defecto colapsado o no.
- **indexInContent**. Si este parámetro se incluye se genera un "capítulo 0" que contiene el índice. Este parámetro recibe un objeto donde se determina el título del índice, subtitulo y js.
```javascript
      indexInContent: {
        title: 'Índice',
        subtitle: 'Visualizador de Cervantes y el Madrid del siglo XVII',
        js: "",
      },
```
- **delay**. Valor tipo Number, determina el tiempo de cada step cuando se hace clic en el botón "play". Por defecto dura 2s (1000 = 1s).
- **content**.  Recibe un objeto con JSON, se define los idomas.
  
```javascript
   content: {
        es: HistoryMapJSON,
        en: HistoryMapJSON
      },
```

##### JSON Content HistoryMap
Cada JSON "HistoryMapJSON", contiene un JSON con la historia que se mostrará en el history map.

Para crear interacciones con el mapa es necesario llamar a map o mapjs y el uso de ";" es obligatorio para poder ejecutar el código JS.

```javascript
{
 "head": {"title": "HistoryMap"},
 "cap": [
  {
   "title": "Capítulo 1",
   "subtitle": "Subtítulo 1",
   "steps": [
      {
        "html": "[html]",
        "js": "[js]",
      },
      {
        "html": "[html]",
        "js": "[js]",
      }
    ]
  },
 {
   "title": "Capítulo 2",
   "subtitle": "Subtítulo 2",
   "steps": [
      {
        "html": "[html]",
        "js": "[js]",
      }
    ]
  }
 ]
}
```
# Ejemplo de uso
```javascript
import HistoryMapJSON2 from './HistoryMapJSON2';
import HistoryMapJSON1 from './HistoryMapJSON1';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',

});


const mp = new HistoryMap({
  collapsed: false,
  collapsible: true,
  position: 'TR',
  content: {
    es: HistoryMapJSON2,
    en: HistoryMapJSON1,
  },
  indexInContent: {
    title: 'Índice HistoryMap',
    subtitle: 'Visualizador de Cervantes y el Madrid del siglo XVII',
    js: "console.log('Visualizador de Cervantes');",
  },
  delay: 2000,
});

map.addPlugin(mp);
```
