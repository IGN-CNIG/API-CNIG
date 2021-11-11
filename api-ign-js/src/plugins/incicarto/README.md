<p align="center">
  <img src="https://www.ign.es/resources/viewer/images/logoApiCnig0.5.png" height="152" />
</p>
<h1 align="center"><strong>APICNIG</strong> <small>🔌 M.plugin.InciCarto</small></h1>

<p align="center">
  <a title="MIT License" href="LICENSE.md">
    <img src="https://img.shields.io/badge/license-EUPL-blue.svg">
  </a>
  <a title="Node version" href="#">
    <img src="https://img.shields.io/badge/node-v14.16-blue">
  </a>  
  <a title="NPM version" href="#">
    <img src="https://img.shields.io/badge/npm-v6.14-blue">
  </a>
  <a title="Language" href="https://www.w3schools.com/html/" target="_blank">
    <img src="https://img.shields.io/static/v1?label=Lang&message=HTML&color=maroon">
  </a>  
  <a title="Language" href="https://www.w3schools.com/js/" target="_blank">
    <img src="https://img.shields.io/static/v1?label=Lang&message=Javascript&color=maroon">
  </a>
  <a title="Language" href="https://www.w3schools.com/css/" target="_blank">
    <img src="https://img.shields.io/static/v1?label=Lang&message=CSS3&color=maroon">
  </a> 

  <br />
  <br />
</p>

Plugin que permite el dibujo y edición de geometrías sobre un mapa, así como su descarga.


# Dependencias

- incicarto.ol.min.js
- incicarto.ol.min.css


```html
 <link href="../../plugins/incicarto/incicarto.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/incicarto/incicarto.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **collapsed**. Indica si el plugin viene cerrado por defecto (true/false).
- **collapsible**. Indica si el plugin se puede cerrar (true/false).
- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left (default)
  - 'TR':top right
  - 'BL':bottom left
  - 'BR':bottom right

# Parámetros API REST

```javascript
URL_API?incicarto=position*collapsed*collapsible
````
Ejemplo:

```javascript
http://mapea-lite.desarrollo.guadaltel.es/api-core/?incicarto=BL*true*true
```

## 🔨 Puntos pendientes

* Documentación en el Readme.md.
* Conexión con INCICARTO.
* Montaje del prototipo en la galería de plugins
* App de ejemplo

