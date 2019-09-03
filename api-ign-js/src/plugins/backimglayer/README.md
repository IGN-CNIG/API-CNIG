# M.plugin.BackImgLayer

Plugin que permite la elección de cada de fondo mediante previsualización de las posibles capas.

# Dependencias

- backimglayer.ol.min.js
- backimglayer.ol.min.css

```html
 <link href="../../plugins/attribution/backimglayer.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/backimglayer/backimglayer.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:


- *position*.  Ubicación del plugin sobre el mapa (Default = 'BL')
  - 'BL' = Bottom left
  - 'BR' = Bottom right
- *layerId*. Posición de la capa que se carga por defecto en el array de capas mandadas como parámetro.
- *layerVisibility*. Valor que indica si se muestra la capa cargada o no.
- *layerOpts*. Array con las capas que se quieren utilizar como opciones para capa de fondo.
   * *id*. Identificador de la capa
   * *preview*. Ruta a la imagen de previsualización que se muestra.
   * *title*. Nombre identificativo de la capa que se mostrará sobre la previsualización.
   * *layers*. Array con las capas de Mapea que se quieren cargar al seleccionar esta opción.


# Ejemplo de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.BackImgLayer({
      position: 'TR',
      layerId: 0,
      layerVisibility: true,
      layerOpts: [{
            id: 'mapa',
            preview: '../src/facade/assets/images/svqmapa.png',
            title: 'Mapa',
            layers: [new M.layer.WMTS({
            url: 'http://www.ign.es/wmts/ign-base?',
            name: 'IGNBaseTodo',
            legend: 'Mapa IGN',
            matrixSet: 'GoogleMapsCompatible',
            }, {
            format: 'image/jpeg',
            })],
         },
         {
            id: 'imagen',
            title: 'Imagen',
            preview: '../src/facade/assets/images/svqimagen.png',
            layers: [new M.layer.WMTS({
            url: 'http://www.ign.es/wmts/pnoa-ma?',
            name: 'OI.OrthoimageCoverage',
            legend: 'Imagen (PNOA)',
            matrixSet: 'GoogleMapsCompatible',
            }, {
            format: 'image/png',
            })],
         },
         {
            id: 'hibrido',
            title: 'Híbrido',
            preview: '../src/facade/assets/images/svqhibrid.png',
            layers: [new M.layer.WMTS({
            url: 'http://www.ign.es/wmts/pnoa-ma?',
            name: 'OI.OrthoimageCoverage',
            legend: 'Imagen (PNOA)',
            matrixSet: 'GoogleMapsCompatible',
            }, {
            format: 'image/png',
            }), new M.layer.WMTS({
            url: 'http://www.ign.es/wmts/ign-base?',
            name: 'IGNBaseOrto',
            matrixSet: 'GoogleMapsCompatible',
            legend: 'Mapa IGN',
            }, {
            format: 'image/png',
            })],
         },
         {
            id: 'lidar',
            preview: '../src/facade/assets/images/svqlidar.png',
            title: 'LIDAR',
            layers: [new M.layer.WMTS({
            url: 'https://wmts-mapa-lidar.idee.es/lidar?',
            name: 'EL.GridCoverageDSM',
            legend: 'Modelo Digital de Superficies LiDAR',
            matrixSet: 'GoogleMapsCompatible',
            }, {
            format: 'image/png',
            })],
         },
      ],
});

   map.addPlugin(mp);
```

