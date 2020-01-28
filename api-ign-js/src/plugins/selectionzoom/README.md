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
  
   const mp = new M.plugin.SelectionZoom({
            position: 'TR',
            collapsible: true,
            collapsed: true,
            layerId: 0,
            layerVisibility: true,
            layerOpts: [{
                    id: 'peninsula',
                    preview: 'plugins/selectionzoom/images/espana.png',
                    title: 'Peninsula',
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
                    id: 'canarias',
                    title: 'Canarias',
                    preview: 'plugins/selectionzoom/images/canarias.png',
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
                    id: 'baleares',
                    title: 'Baleares',
                    preview: 'plugins/selectionzoom/images/baleares.png',
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
                    id: 'ceuta',
                    preview: 'plugins/selectionzoom/images/ceuta.png',
                    title: 'Ceuta',
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
                    id: 'melilla',
                    preview: 'plugins/selectionzoom/images/melilla.png',
                    title: 'Melilla',
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
            ],
        });

   map.addPlugin(mp);
```

