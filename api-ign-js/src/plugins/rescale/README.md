# M.plugin.Rescale


Hace zoom a la escala elegida.


# Dependencias

- rescale.ol.min.js
- rescale.ol.min.css


```html
 <link href="../../plugins/rescale/rescale.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/rescale/rescale.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsed**: Indica si el plugin viene colapsado por defecto (true/false). Por defecto: true.
- **collapsible**: Indica si se puede colapsar el plugin (true/false). Por defecto: true.
  
# Ejemplos de uso

```javascript
const mp = new M.plugin.Rescale();

map.addPlugin(mp);
```

```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.Rescale({
        position: 'TL',
      });

   map.addPlugin(mp);
```