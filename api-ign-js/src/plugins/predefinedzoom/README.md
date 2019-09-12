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


## Api.json

### Plugin sin parámetros

```
{
   "url": {
      "name": "predefinedzoom"
   },
   "constructor": "M.plugin.PredefinedZoom"
}
```
### Plugin con parámetros

```
{
  "url": {
    "name": "predefinedzoom",
    "separator": "*"
  },
  "constructor": "M.plugin.PredefinedZoom",
  "parameters": [{
    "type": "simple",
    "name": "position",
    "position": 0
  }, {
    "type": "array",
    "name": "savedZooms",
    "position": 1
  }],
  "files": {
    "ol": {
      "scripts": "predefinedzoom.ol.min.js",
      "styles": "predefinedzoom.ol.min.css"
    }
  },
  "metadata": {
    "name": "predefinedzoom",
    "description": "Zooms to predefined map views",
    "text": "Zooms to predefined map views (given Bbox)",
    "version": "1.0.0",
    "date": "",
    "author": "",
    "org": "",
    "tags": "mapea,plugin",
    "icon": "./facade/assets/icons/icons.svg"
  }
}
```