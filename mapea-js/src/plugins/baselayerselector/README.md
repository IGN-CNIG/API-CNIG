# M.plugin.BaseLayerSelector

Plugin que permite definir diferentes capas base para alternar en la visualización del mapa.

# Dependencias

- baselayerselector.ol.min.js
- baselayerselector.ol.min.css

```html
 <link href="../../plugins/baselayerselector/baselayerselector.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/baselayerselector/baselayerselector.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **layerOpts**: Array de capas que se usarán como opciones como capa base del mapa.
Cada entrada generará un botón sobre el mapa con el "title" definido y el enlace a la capa a usar

```javascript
 [{
                    id: 'mapa',
                    title: 'Mapa',
                    layer: new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/ign-base?',
                        name: 'IGNBaseTodo',
                        legend: 'base_layer',
                    }, {
                        format: 'image/jpeg',
                    }),
                },
                {
                    id: 'imagen',
                    title: 'Imagen',
                    layer: new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/pnoa-ma?',
                        name: 'OI.OrthoimageCoverage',
                        legend: 'orto_layer',
                    }, {
                        format: 'image/png',
                    }),
                },
            ],
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
  
   const mp = new M.plugin.BaseLayerSelector({
            position: 'TR',
            layerOpts: [{
                    id: 'mapa',
                    title: 'Mapa',
                    layer: new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/ign-base?',
                        name: 'IGNBaseTodo',
                        legend: 'base_layer',
                    }, {
                        format: 'image/jpeg',
                    }),
                },
                {
                    id: 'imagen',
                    title: 'Imagen',
                    layer: new M.layer.WMTS({
                        url: 'http://www.ign.es/wmts/pnoa-ma?',
                        name: 'OI.OrthoimageCoverage',
                        legend: 'orto_layer',
                    }, {
                        format: 'image/png',
                    }),
                },
            ],
        });

   map.addPlugin(mp);
```

