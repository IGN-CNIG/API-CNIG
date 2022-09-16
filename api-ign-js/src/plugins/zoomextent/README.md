# M.plugin.ZoomExtent


Plugin que permite realizar zoom con una caja sobre el mapa.

# Dependencias

- zoomextent.ol.min.js
- zoomextent.ol.min.css


```html
 <link href="../../plugins/zoomextent/zoomextent.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/zoomextent/zoomextent.ol.min.js"></script>
```

# Parámetros

- El constructor se inicializa con un JSON de options con los siguientes atributos:


- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left (default)
  - 'TR':top right 
  - 'BL':bottom left 
  - 'BR':bottom right

# Eventos


# Otros métodos


# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.ZoomExtent({
        postition: 'TL',
      });

   map.addPlugin(mp);
```

