# M.plugin.ViewHistory

Plugin que permite navegar entre las vistas visitadas del mapa (hacia adelante y atrás).

# Dependencias

- viewhistory.ol.min.js
- viewhistory.ol.min.css


```html
 <link href="../../plugins/viewhistory/viewhistory.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/viewhistory/viewhistory.ol.min.js"></script>
```
# Eventos

# Otros métodos

# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });

   // crear el plugin
   const mp = new M.plugin.ViewHistory({
     position: 'TL'
   });

   // añadirlo al mapa
   map.addPlugin(mp);
});
```

```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.ViewHistory();

   map.addPlugin(mp);
```

## Api.json


### Plugin sin parámetros

```
{
   "url": {
      "name": "viewhistory"
   },
   "constructor": "M.plugin.ViewHistory"
}
```

### Plugin con parámetros

```
{
  "url": {
    "name": "viewhistory",
    "separator": "*"
  },
  "constructor": "M.plugin.ViewHistory",
  "parameters": [{
    "type": "object",
    "properties": [{
      "type": "enum",
      "name": "position",
      "position": 0,
      "possibleValues": ["TL", "TR", "BR", "BL"]
    }]
  }],
  "files": {
    "ol": {
      "scripts": [
        "viewhistory.ol.min.js"
      ],
      "styles": [
        "viewhistory.ol.min.css"
      ]
    }
  },
  "metadata": {
    "name": "ViewHistory",
    "description": "Shows map view history",
    "text": "Navigates among previous map views",
    "version": "1.0.0",
    "date": "",
    "author": "",
    "org": "",
    "tags": "mapea,plugin",
    "icon": "./facade/assets/icons/icons.svg"
  }
}
```

