# M.plugin.SelectorZoom

Plugin que permite la elección de cada de fondo mediante previsualización de las posibles capas.

# Dependencias

- selectorzoom.ol.min.js
- selectorzoom.ol.min.css

```html
 <link href="../../plugins/selectorzoom/selectorzoom.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/selectorzoom/selectorzoom.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:


- *position*.  Ubicación del plugin sobre el mapa (Default = 'BL')
  - 'BL' = Bottom left
  - 'BR' = Bottom right
- *collapsible*. Indica si el plugin se puede collapsar en un botón (true/false).
- *collapsed*. Indica si el plugin viene colapsado de entrada (true/false).
- *layerId*. Posición de la capa que se carga por defecto en el array de capas mandadas como parámetro.
- *layerVisibility*. Valor que indica si se muestra la capa cargada o no.
- *ids*. Identificador de la capa
- *titles*. Nombre identificativo de la capa que se mostrará sobre la previsualización.
- *previews*. Ruta a la imagen de previsualización que se muestra.
- *bboxs*. Bbox de la zona geografica a la que se hace zoom. El bbox debe recoger los datos en la misma proyección en la que se encuentra el mapa.
- *zooms*. Zoom que toma la capa en la zona geográfica elegida.


# Ejemplo de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.SelectionZoom({
    position: 'TL',
    collapsible: true,
    collapsed: true,
    layerId: 0,
    layerVisibility: true,
    ids: 'peninsula,canarias',
    titles: 'Peninsula,Canarias',
    previews: '../src/facade/assets/images/espana.png,../src/facade/assets/images/canarias.png',
    bboxs: '-1200091.444315327, 365338.89496508264, 4348955.797933925, 5441088.058207252, -2170190.6639824593, -1387475.4943422542, 3091778.038884449, 3637844.1689537475 ,
    zooms: '7,8',
    });

   map.addPlugin(mp);
```

