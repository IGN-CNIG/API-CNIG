# M.plugin.TOC

Permite dibujar geometrías y obtenerlas al terminar.

# Dependencias

- selectiondraw.ol.min.js
- selectiondraw.ol.min.css


```html
 <link href="../../plugins/selectiondraw/selectiondraw.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/selectiondraw/selectiondraw.ol.min.js"></script>
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