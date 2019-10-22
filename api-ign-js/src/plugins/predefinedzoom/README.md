# M.plugin.PredefinedZoom


Centra el mapa en la/s vista/s indicada/s por parámetro.

# Dependencias

- predefinedzoom.ol.min.js
- predefinedzoom.ol.min.css


```html
 <link href="../../plugins/predefinedzoom/predefinedzoom.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/predefinedzoom/predefinedzoom.ol.min.js"></script>
```

# Parámetros

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left
  - 'TR':top right (default)
  - 'BL':bottom left
  - 'BR':bottom right
- **savedZooms**. Indica el zoom deseado en el que se centrará el mapa.

  
# Ejemplos de uso

```javascript
const mp = new M.plugin.PredefinedZoom();

map.addPlugin(mp);
```

```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.PredefinedZoom({
        position: 'TL',
        savedZooms: [{
            name: 'Zoom a la extensión del mapa',
            bbox: [-2392173.2372, 3033021.2824, 1966571.8637, 6806768.1648],
          },
        ],
      });

   map.addPlugin(mp);
```