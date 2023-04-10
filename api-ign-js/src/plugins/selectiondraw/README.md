# M.plugin.SelectionDraw

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

- **position**: Indica la posición donde se mostrará el plugin sobre el mapa.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsed**: Indica si al iniciar el plugin este está abierto o cerrado. Las opciones son true or false. Por defecto: false.
- **collapsible**: Indica si este plugin puede ser cerrado y/o abierto. Las opciones son true or false. Por defecto: true.
- **projection**: Indica la proyección en que seran devueltas las geometrías que se dibujen en el mapa. Por defecto, EPSG:4326.

# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.SelectionDraw({
        projection: 'EPSG:4326',
        position: 'TL',
        collapsed: false,
        collapsible: true,
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
