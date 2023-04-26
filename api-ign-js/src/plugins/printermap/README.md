<p align="center">
  <img src="https://www.ign.es/resources/viewer/images/logoApiCnig0.5.png" height="152" />
</p>
<h1 align="center"><strong>APICNIG</strong> <small>🔌 M.plugin.PrinterMap</small></h1>

# Descripción

Plugin de impresión a través del servicio Geoprint. Las capacidades del mismo definen las opciones de impresión disponibles: dpi, formatos y plantillas.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **printermap.ol.min.js**
- **printermap.ol.min.css**

```html
 <link href="https://componentes.cnig.es/api-core/plugins/printermap/printermap.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/printermap/printermap.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsed**: Valor booleano que indica si el plugin aparece colapsado o no.
  - true (por defecto).
  - false.
- **collapsible**: Valor booleano que indica si el plugin puede colapsarse o no.
  - true (por defecto).
  - false.
- **serverUrl**: URL del servidor Geoprint.
- **printTemplateUrl**: URL con las plantillas a utilizar.
- **printStatusUrl**: URL para consultar el estado de la impresión.
- **credits**: URL que indica el estado del servidor Geoprint.
- **georefActive**: Valor booleano que indica si abrir plugin con opciones de descarga de imagen georreferenciada o no.
- true (por defecto).
- false.
- **fototeca**: Valor booleano que indica si añadir por defecto un texto a la descripción específico de fototeca sin posibilidad de edición.
- true.
- false (por defecto).
- **logo**: URL de una imagen para añadir como logo en la esquina superior derecha.
- **headerLegend**: URL de una imagen para añadir como leyenda en la parte central de la cabecera.
- **filterTemplates**: Listado de nombres de plantillas que queremos tener disponibles, si no se manda el parámetro aparecerán todas por defecto.

# API-REST

```javascript
URL_API?printermap=position*collapsed*collapsible*serverUrl*printTemplateUrl*printTemplateGeoUrl*printStatusUrl
*georefActive*logo*fototeca
```

<table>
  <tr>
    <td>Parámetros</td>
    <td>Opciones/Descripción</td>
  </tr>
  <tr>
    <td>position</td>
    <td>TR/TL/BL/BR</td>
  </tr>
  <tr>
    <td>collapsed</td>
    <td>true/false</td>
  </tr>
  <tr>
    <td>collapsible</td>
    <td>true/false</td>
  <tr>
    <td>serverUrl</td>
    <td>URL del servidor Geoprint</td>
  <tr>
    <td>printTemplateUrl</td>
    <td>URL de las plantillas a utilizar</td>
  <tr>
    <td>printTemplateGeoUrl</td>
    <td>URL de las plantillas a utilizar para Geoprint</td>
  <tr>
    <td>printStatusUrl</td>
    <td>URL para consultar el estado de la impresión</td>
  </tr>
  <tr>
    <td>georefActive</td>
    <td>true/false</td>
  </tr>
  <tr>
    <td>logo</td>
    <td>URL de la imagen para el logo</td>
  </tr>
  <tr>
    <td>fototeca</td>
    <td>true/false</td>
  </tr>
</table>

### Ejemplos de uso API-REST

```
https://componentes.cnig.es/api-core/?printermap=TL*true*true*https%3A%2F%2Fgeoprint.desarrollo.guadaltel.es*https%3A%2F%2Fgeoprint.desarrollo.guadaltel.es%2Fprint%2FCNIG*https%3A%2F%2Fgeoprint.desarrollo.guadaltel.es%2Fprint%2FCNIG*https%3A%2F%2Fgeoprint.desarrollo.guadaltel.es%2Fprint%2Fstatus*true*https%3A%2F%2Fwww.ign.es%2Fresources%2Fviewer%2Fimages%2FlogoApiCnig0.5.png*false
```

```
https://componentes.cnig.es/api-core/?printermap=TL*true*true*https%3A%2F%2Fgeoprint.desarrollo.guadaltel.es*https%3A%2F%2Fgeoprint.desarrollo.guadaltel.es%2Fprint%2FCNIG**https%3A%2F%2Fgeoprint.desarrollo.guadaltel.es%2Fprint%2Fstatus*true**false
```

# Eventos

- **ADDED_TO_MAP**
  - Evento que se dispara cuando el control se añade al mapa.
  - Expone, como parámetro devuelto, el **PrinterMapControl**.

```javascript
pluginprintermap.on(M.evt.ADDED_TO_MAP, () => {
  window.alert('Añadido al mapa');
});
```

# Ejemplo de uso

```javascript
mapajs = M.map({
  container: "map"
});

mapajs.addPlugin(new M.plugin.PrinterMap({
  position: 'TR',
  collapsed: false,
  collapsible: false,
  serverUrl: 'https://componentes.cnig.es', 
  printTemplateUrl: 'https://componentes.cnig.es/geoprint/print/CNIG', 
  printStatusUrl: 'https://componentes.cnig.es/geoprint/print/CNIG/status',
}));
```

# 👨‍💻 Desarrollo

Para el stack de desarrollo de este componente se ha utilizado

* NodeJS Version: 14.16
* NPM Version: 6.14.11
* Entorno Windows.

## 📐 Configuración del stack de desarrollo / *Work setup*


### 🐑 Clonar el repositorio / *Cloning repository*

Para descargar el repositorio en otro equipo lo clonamos:

```bash
git clone [URL del repositorio]
```

### 1️⃣ Instalación de dependencias / *Install Dependencies*

```bash
npm i
```

### 2️⃣ Arranque del servidor de desarrollo / *Run Application*

```bash
npm run start
```

## 📂 Estructura del código / *Code scaffolding*

```any
/
├── src 📦                  # Código fuente
├── task 📁                 # EndPoints
├── test 📁                 # Testing
├── webpack-config 📁       # Webpack configs
└── ...
```
## 📌 Metodologías y pautas de desarrollo / *Methodologies and Guidelines*

Metodologías y herramientas usadas en el proyecto para garantizar el Quality Assurance Code (QAC)

* ESLint
  * [NPM ESLint](https://www.npmjs.com/package/eslint) \
  * [NPM ESLint | Airbnb](https://www.npmjs.com/package/eslint-config-airbnb)

## ⛽️ Revisión e instalación de dependencias / *Review and Update Dependencies*

Para la revisión y actualización de las dependencias de los paquetes npm es necesario instalar de manera global el paquete/ módulo "npm-check-updates".

```bash
# Install and Run
$npm i -g npm-check-updates
$ncu
```
