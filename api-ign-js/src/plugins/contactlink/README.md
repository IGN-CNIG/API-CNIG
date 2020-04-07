# M.plugin.ContactLink

Plugin que muestra una serie de enlaces establecidos por el usuario.

# Dependencias

- contactlink.ol.min.js
- contactlink.ol.min.css


```html
 <link href="../../plugins/contactlink/contactlink.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/contactlink/contactlink.ol.min.js"></script>
```

# Parámetros

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin.
  - 'TL':top left
  - 'TR':top right (default)
  - 'BL':bottom left
  - 'BR':bottom right

# Eventos

# Otros métodos

# Ejemplos de uso

## Ejemplo 1
Construcción del plugin con dos enlaces: Centro de Descargas CNIG y Visualizador 3D:

```javascript
  const mp = new ContactLink({
  position: 'TR',  
});


   map.addPlugin(mp);
```