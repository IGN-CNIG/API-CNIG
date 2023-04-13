# M.plugin.ContactLink

Provee de enlaces a sitios, redes sociales y correo institucionales.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **contactlink.ol.min.js**
- **contactlink.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core)/plugins/contactlink/contactlink.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/contactlink/contactlink.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **descargascnig**: Indica la url al centro de descargas CNIG. 
- **pnoa**: Indica la url al comparador PNOA.
- **visualizador3d**: Indica la url al Visualizador3D.
- **fototeca**: Indica la url a Fototeca.
- **twitter**: Indica la url al Twitter del CNIG.
- **instagram**: Indica la url al Instagram del CNIG.
- **facebook**: Indica la url al Facebook del CNIG.
- **pinterest**: Indica la url al Pinterest del CNIG.
- **youtube**: Indica la url al Youtube del CNIG.
- **mail**: Indica la url para escribir correo al CNIG.

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
