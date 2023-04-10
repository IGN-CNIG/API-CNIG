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

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left
  - 'TR':top right (default)
  - 'BL':bottom left
  - 'BR':bottom right
- **collapsed**. Indica si el plugin viene colapsado por defecto.
- **collapsible**. Indica si se puede colapsar el plugin.
  
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