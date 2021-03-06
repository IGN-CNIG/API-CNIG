# M.plugin.TOC

Muestra un árbol de contenidos con las capas disponibles para mostrar.

## Api.json

INTEGRACIÓN DE PARÁMETROS EN API REST

OPCIONES:  
1. Nuevo parámetro en la API REST normalmente porque requiera parámetros de configuración.
Example: <url_mapea>?toc=[params]

2. Nuevo valor para el parámetro plugins, el plugin no requiere configuración
Example: <url_mapea>?plugins=toc

# Dependencias

- toc.ol.min.js
- toc.ol.min.css


```html
 <link href="../../plugins/toc/toc.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/toc/toc.ol.min.js"></script>
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
  
   const mp = new M.plugin.TOC({
        postition: 'TL',
      });

   map.addPlugin(mp);
```


### Plugin sin parámetros

```
{
   "url": {
      "name": "toc"
   },
   "constructor": "M.plugin.TOC"
}
```
### Plugin con parámetros

```
{
   "url": {
      "name": "toc",
      "separator": "*"
   },
   "constructor": "M.plugin.TOC",
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