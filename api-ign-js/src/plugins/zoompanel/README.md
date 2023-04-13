# M.plugin.ZoomPanel

Ofrece diferentes herramientas de zoom.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **zoompanel.ol.min.js**
- **zoompanel.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/zoompanel/zoompanel.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/zoompanel/zoompanel.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin sobre el mapa.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsed**: Indica si al iniciar el plugin este está abierto o cerrado. Las opciones son true or false. Por defecto true.
- **collapsible**: Indica si este plugin puede ser cerrado y/o abierto. Las opciones son true or false. Por defecto true.

# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.ZoomPanel({
        position: 'TL',
        collapsed: true,
        collapsible: true,              
   });   

   map.addPlugin(mp);
```
