# M.plugin.BackgroundLayerSelector

Plugin que permite definir diferentes capas como capas de fondo en el mapa.

- **NOTA**: No confundir el uso de este plugin con el uso de capas base de mapea. Para hacer uso de Capas Base de Mapea se debe hacer uso del plugin BaseLayerSelector.

Edit



# Dependencias

- backgroundlayersselector.ol.min.js
- backgroundlayersselector.ol.min.css

```html
 <link href="../../plugins/backgroundlayersselector/backgroundlayersselector.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/backgroundlayersselector/backgroundlayersselector.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **layerOpts**: Array de capas que se usarán como opciones como capa base del mapa.
Cada entrada generará un botón sobre el mapa con el "title" definido y el enlace a la capa a usar

```javascript
 layerOpts: [{
      id: 'mapa',
      title: 'Mapa',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseTodo',
        legend: 'Mapa IGN',
      }, {
        format: 'image/jpeg',
      })]
    },
    {
      id: 'imagen',
      title: 'Imagen',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
      }, {
        format: 'image/png',
      })]
    },
    {
      id: 'imagen',
      title: 'Híbrido',
      layers: [ new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
      }, {
        format: 'image/png',
      }), new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        legend: 'Mapa IGN',
      }, {
        format: 'image/png',
      }), ],
    },
  ]
```

- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left (default)
  - 'TR':top right 
  - 'BL':bottom left 
  - 'BR':bottom right


# Eventos


# Otros métodos


# Ejemplo de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.BackgroundLayersSelector({
            position: 'TR',
            layerOpts: [{
                id: 'mapa',
                title: 'Mapa',
                layers: [new M.layer.WMTS({
                    url: 'http://www.ign.es/wmts/ign-base?',
                    name: 'IGNBaseTodo',
                    legend: 'Mapa IGN',
                }, {
                    format: 'image/jpeg',
                })]
                },
                {
                id: 'imagen',
                title: 'Imagen',
                layers: [new M.layer.WMTS({
                    url: 'http://www.ign.es/wmts/pnoa-ma?',
                    name: 'OI.OrthoimageCoverage',
                    legend: 'Imagen (PNOA)',
                }, {
                    format: 'image/png',
                })]
                },
                {
                id: 'hirbrido',
                title: 'Híbrido',
                layers: [ new M.layer.WMTS({
                    url: 'http://www.ign.es/wmts/pnoa-ma?',
                    name: 'OI.OrthoimageCoverage',
                    legend: 'Imagen (PNOA)',
                }, {
                    format: 'image/png',
                }), new M.layer.WMTS({
                    url: 'http://www.ign.es/wmts/ign-base?',
                    name: 'IGNBaseOrto',
                    legend: 'Mapa IGN',
                }, {
                    format: 'image/png',
                }), ],
             },
            ]
        });

   map.addPlugin(mp);
```

