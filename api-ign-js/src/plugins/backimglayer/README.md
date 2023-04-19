# M.plugin.BackImgLayer

Plugin que permite la elección de la capa de fondo mediante la previsualización de las posibles capas.

# Dependencias
Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **backimglayer.ol.min.js**
- **backimglayer.ol.min.css**

```html
 <link href="https://componentes.cnig.es/api-core/plugins/backimglayer/backimglayer.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/backimglayer/backimglayer.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:


- **position**:  Ubicación del plugin sobre el mapa.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsible**: Indica si el plugin se puede collapsar en un botón (true/false). Por defecto: true.
- **collapsed**: Indica si el plugin viene colapsado de entrada (true/false). Por defecto: true.
- **layerId**: Índice de la capa que se quiera cargar por defecto.
- **columnsNumber**: Número de columnas que parametrizan la tabla de capas de fondo disponibles.
- **layerVisibility**: Valor que indica si se muestra la capa cargada o no.
- **layerOpts**: Array con las capas que se quieren utilizar como opciones para capa de fondo.
    - **id**: Identificador de la capa.
    - **preview**: Ruta a la imagen de previsualización que se muestra.
    - **title**: Nombre identificativo de la capa que se mostrará sobre la previsualización.
    - **layers**: Array con las capas que se quieren cargar al seleccionar esta opción.
- **empty**: Habilita la posibilidad de mostrar el mapa sin las capas cargadas en el plugin.
- **tooltip**: Información emergente para mostrar en el tooltip del plugin. Por defecto: "Capas de fondo".


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

