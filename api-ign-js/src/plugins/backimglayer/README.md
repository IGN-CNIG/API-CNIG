# M.plugin.BackImgLayer

Plugin que permite la elección de cada de fondo mediante previsualización de las posibles capas.

# Dependencias

- backimglayer.ol.min.js
- backimglayer.ol.min.css

```html
 <link href="../../plugins/backimglayer/backimglayer.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/backimglayer/backimglayer.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- *position*.  Ubicación del plugin sobre el mapa (Default = 'TR')
  - 'TL' = Top left
  - 'TR' = Top right
  - 'BL' = Bottom left
  - 'BR' = Bottom right
- *collapsible*. Indica si el plugin se puede collapsar en un botón (true/false).
- *collapsed*. Indica si el plugin viene colapsado de entrada (true/false).
- *layerId*. Posición de la capa que se carga por defecto en el array de capas mandadas como parámetro.
- *columnsNumber*. Número de columnas que parametrizan la tabla de servicios mostrados.
- *layerVisibility*. Valor que indica si se muestra la capa cargada o no.
- *layerOpts*. Array con las capas que se quieren utilizar como opciones para capa de fondo.
   * *id*. Identificador de la capa
   * *preview*. Ruta a la imagen de previsualización que se muestra.
   * *title*. Nombre identificativo de la capa que se mostrará sobre la previsualización.
   * *layers*. Array con las capas de Mapea que se quieren cargar al seleccionar esta opción.
- *tooltip*. Valor a usar para mostrar en el tooltip del plugin.
- *empty*. Opción de ninguna capa.
- *previews*. URL de vista previa de capas separadas por ",".
- *titles*. Capas de títulos separados por ",".
- *ids*. ID de capas separadas por ",".

# Ejemplo de uso
```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.BackImgLayer({
            position: 'TR',
            collapsible: true,
            collapsed: true,
            layerId: 0,
            columnsNumber: 2,
            layerVisibility: true,
            layerOpts: [{
                    id: 'mapa',
                    preview: 'plugins/backimglayer/images/svqmapa.png', // ruta relativa, edite por la deseada
                    title: 'Mapa',
                    layers: [new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/ign-base?',
                        name: 'IGNBaseTodo',
                        legend: 'Mapa IGN',
                        matrixSet: 'GoogleMapsCompatible',
                        transparent: false,
                        displayInLayerSwitcher: false,
                        queryable: false,
                        visible: true,
                        format: 'image/jpeg',
                    })],
                },
                {
                    id: 'imagen',
                    title: 'Imagen',
                    preview: 'plugins/backimglayer/images/svqimagen.png', // ruta relativa, edite por la deseada
                    layers: [new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/pnoa-ma?',
                        name: 'OI.OrthoimageCoverage',
                        legend: 'Imagen (PNOA)',
                        matrixSet: 'GoogleMapsCompatible',
                        transparent: false,
                        displayInLayerSwitcher: false,
                        queryable: false,
                        visible: true,
                        format: 'image/jpeg',
                    })],
                },
                {
                    id: 'hibrido',
                    title: 'Híbrido',
                    preview: 'plugins/backimglayer/images/svqhibrid.png', // ruta relativa, edite por la deseada
                    layers: [new M.layer.WMTS({
                            url: 'http://www.ign.es/wmts/pnoa-ma?',
                            name: 'OI.OrthoimageCoverage',
                            legend: 'Imagen (PNOA)',
                            matrixSet: 'GoogleMapsCompatible',
                            transparent: true,
                            displayInLayerSwitcher: false,
                            queryable: false,
                            visible: true,
                            format: 'image/png',
                        }),
                        new M.layer.WMTS({
                            url: 'http://www.ign.es/wmts/ign-base?',
                            name: 'IGNBaseOrto',
                            matrixSet: 'GoogleMapsCompatible',
                            legend: 'Mapa IGN',
                            transparent: false,
                            displayInLayerSwitcher: false,
                            queryable: false,
                            visible: true,
                            format: 'image/png',
                        })
                    ],
                },
                {
                    id: 'lidar',
                    preview: 'plugins/backimglayer/images/svqlidar.png', // ruta relativa, edite por la deseada
                    title: 'LIDAR',
                    layers: [new M.layer.WMTS({
                        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
                        name: 'EL.GridCoverageDSM',
                        legend: 'Modelo Digital de Superficies LiDAR',
                        matrixSet: 'GoogleMapsCompatible',
                        transparent: false,
                        displayInLayerSwitcher: false,
                        queryable: false,
                        visible: true,
                        format: 'image/png',
                    })],
                },
            ],
        });

   map.addPlugin(mp);
```

