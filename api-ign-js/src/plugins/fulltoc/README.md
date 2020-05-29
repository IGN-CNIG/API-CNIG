# M.plugin.FullTOC

Muestra un árbol de contenidos con las capas disponibles para mostrar.

## Api.json

INTEGRACIÓN DE PARÁMETROS EN MAPEA

OPCIONES:  
1. Nuevo parámetro en la API REST normalmente porque requiera parámetros de configuración.
Example: <url_mapea>?fulltoc=[params]

2. Nuevo valor para el parámetro plugins, el plugin no requiere configuración
Example: <url_mapea>?plugins=fulltoc

# Dependencias

- fulltoc.ol.min.js
- fulltoc.ol.min.css


```html
 <link href="../../plugins/fulltoc/fulltoc.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/fulltoc/fulltoc.ol.min.js"></script>
```

# Parámetros

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin sobre el mapa.
  - 'TL':top left
  - 'TR':top right (default)
  - 'BL':bottom left
  - 'BR':bottom right

# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.FullTOC({
        postition: 'TL',
      });

   map.addPlugin(mp);
```


### Plugin sin parámetros

```
{
   "url": {
      "name": "fulltoc"
   },
   "constructor": "M.plugin.FullTOC"
}
```
### Plugin con parámetros

```
{
   "url": {
      "name": "fulltoc",
      "separator": "*"
   },
   "constructor": "M.plugin.FullTOC",
   "parameters": [{
      "type": "object",
      "properties": [{
         "type": "simple",
         "name": "position",
         "position": 0,
         "possibleValues": ["TL", "TR", "BR", "BL"]
      }]
   }]
}
```
