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

- **links**. Parámetro obligatorio. Array de los enlaces que queremos que muestre el plugin. Cada uno tiene dos parámetros: name (nombre del sitio web) y url (url del sitio web)

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
  links: [{
      name: 'Centro de Descargas CNIG',
      url: 'http://centrodedescargas.cnig.es/CentroDescargas/index.jsp'
    },
    {
      name: 'Visualizador 3D',
      url: 'https://www.ign.es/3D-Stereo/'
    }
  ]
});


   map.addPlugin(mp);
```