# M.plugin.ContactLink

Provee de enlaces a sitios, redes sociales y correo institucionales.

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
- **descargascnig**. Indica la url al centro de descargas CNIG. 
- **pnoa**. Indica la url al comparador PNOA.
- **visualizador3d**. Indica la url al Visualizador3D.
- **fototeca**. Indica la url a Fototeca.
- **twitter**. Indica la url al Twitter del CNIG.
- **instagram**. Indica la url al Instagram del CNIG.
- **facebook**. Indica la url al Facebook del CNIG.
- **pinterest**. Indica la url al Pinterest del CNIG.
- **youtube**. Indica la url al Youtube del CNIG.
- **mail**. Indica la url para escribir correo al CNIG.
- **collapsible**. Indica si el plugin se puede collapsar en un botón (true/false).
- **collapsed**. Indica si el plugin viene colapsado de entrada (true/false).
- **tooltip**. Valor a usar para mostrar en el tooltip del plugin.

# Eventos

# Otros métodos

# Ejemplos de uso

## Ejemplo 1
Construcción del plugin solo con parámetro position:

```javascript
  const mp = new ContactLink({
  position: 'TR',  
});


   map.addPlugin(mp);
```

## Ejemplo 2
Construcción del plugin con todos los parámetros:

```javascript
  const mp = new ContactLink({
  position: 'TR', 
  descargascnig: 'http://centrodedescargas.cnig.es/CentroDescargas/index.jsp',
  pnoa: 'https://www.ign.es/web/comparador_pnoa/index.html',
  visualizador3d: 'https://www.ign.es/3D-Stereo/',
  fototeca: 'https://fototeca.cnig.es/',
  twitter: 'https://twitter.com/IGNSpain',
  instagram: 'https://www.instagram.com/ignspain/',
  facebook: 'https://www.facebook.com/IGNSpain/',
  pinterest: 'https://www.pinterest.es/IGNSpain/',
  youtube: 'https://www.youtube.com/user/IGNSpain',
  mail: 'mailto:ign@fomento.es', 
});


   map.addPlugin(mp);
```
