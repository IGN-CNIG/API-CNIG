# M.plugin.ZoomPanel

Ofrece diferentes herramientas de zoom.

# Dependencias

- zoompanel.ol.min.js
- zoompanel.ol.min.css


```html
 <link href="../../plugins/zoompanel/zoompanel.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/zoompanel/zoompanel.ol.min.js"></script>
```

# Parámetros

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin sobre el mapa.
  - 'TL':top left (default)
  - 'TR':top right 
  - 'BL':bottom left 
  - 'BR':bottom right 
- **collapsed**: Indica si al iniciar el plugin este está abierto o cerrado. Las opciones son true or false. Por defecto false.
- **collapsible**: Indica si este plugin puede ser cerrado y/o abierto. Las opciones son true or false. Por defecto true.
- **projection**: Indica la proyección en que seran devueltas las geometrías que se dibujen en el mapa. Por defecto, EPSG:4326

# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.ZoomPanel({
        position: 'TL',
        collapsed: true,
        collapsible: true,        
        layerId: 0,
        layerVisibility: true,
        projection: 'EPSG:4326'
   });   

   map.addPlugin(mp);
```
