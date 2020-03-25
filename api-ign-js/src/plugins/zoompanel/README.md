# M.plugin.ZoomPanel

Permite dibujar geometrías y obtenerlas al terminar.

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
  - 'TL':top left
  - 'TR':top right (default)
  - 'BL':bottom left 
  - 'BR':bottom right
  Por defecto TL
- **collapsed**: Indica si al iniciar el plugin este está abierto o cerrado. Las opciones son true or false. Por defecto false.
- **collapsible**: Indica si este plugin puede ser cerrado y/o abierto. Las opciones son true or false. Por defecto true.
**projection**: Indica la proyección en que seran devueltas las geometrías que se dibujen en el mapa. Por defecto, EPSG:4326

# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.ZoomPanel({
        position: 'TL',
        collapsible: true,
        collapsed: true,
        layerId: 0,
        layerVisibility: true,
        projection: 'EPSG:4326'
   });

   mp.on('finisihed:draw', (featureJSON) => {
      // lógica de negocio
      console.log(featureJSON);
   });
   // Al terminar de dibujar, el plugin ejecutará siempre el callback anterior, 
   // tomando como parámetro el feature dibujado como GeoJSON 
   // en la proyección que indiquemos en el constructor.

   map.addPlugin(mp);
```
