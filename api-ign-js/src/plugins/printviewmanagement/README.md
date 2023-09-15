<p align="center">
  <img src="https://www.ign.es/resources/viewer/images/logoApiCnig0.5.png" height="152" />
</p>
<h1 align="center"><strong>APICNIG</strong> <small>🔌 M.plugin.printviewmanagement</small></h1>

# Descripción

Plugin que permite utilizar diferentes herramientas de impresión. 
- Impresión de imagen con plantilla.
- Impresión de imagen (desde servidor o desde cliente).
- Impresión de imágenes de capas precargadas.
- Posibilidad de añadir fichero de georreferenciación (WLD).

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **printviewmanagement.ol.min.js**
- **printviewmanagement.ol.min.css**

```html
 <link href="https://componentes.cnig.es/api-core/plugins/printviewmanagement/printviewmanagement.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/printviewmanagement/printviewmanagement.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **position**:  Ubicación del plugin sobre el mapa.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsed**: Indica si el plugin viene colapsado de entrada (true/false). Por defecto: true.
- **collapsible**: Indica si el plugin puede abrirse y cerrarse (true) o si permanece siempre abierto (false). Por defecto: true.
- **tooltip**: Texto que se muestra al dejar el ratón encima del plugin. Por defecto: Impresión del mapa.
- **serverUrl**: URL del servidor Geoprint. Por defecto: https://componentes.cnig.es/geoprint.
- **printStatusUrl**: URL para consultar el estado de la impresión. Por defecto: https://componentes.cnig.es/geoprint/print/status.
- **georefImageEpsg**:  Indica si el control "Impresión de imágenes de capas precargadas" se añade al plugin (true/false). Por defecto: true.
  - **tooltip**: Texto que se muestra al dejar el ratón encima del plugin. Por defecto: Impresión del mapa.
  - **layers**: Array de objetos con información de las capas a imprimir. 
    - url: URL de la capa.
    - name: Nombre de la capa.
    - format: Formato de la capa.
    - legend: Leyenda de la capa.
    - EPSG: Opcional, por defecto 3857. 
  ```JavaScript
      layers: [
      {
        url: 'http://www.ign.es/wms-inspire/mapa-raster?',
        name: 'mtn_rasterizado',
        format: 'image/jpeg',
        legend: 'Mapa ETRS89 UTM',
        EPSG: 'EPSG:4326',
      },
      {
        url: 'http://www.ign.es/wms-inspire/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        format: 'image/jpeg',
        legend: 'Imagen (PNOA) ETRS89 UTM',
        // EPSG: 'EPSG:4258',
      },
    ],

  ```
- **georefImage**:  Indica si el control "Impresión de imagen (desde servidor o desde cliente)" se añade al plugin (true/false). Por defecto: true.
  - **tooltip**: Texto que se muestra al dejar el ratón encima del plugin. Por defecto: Impresión del mapa.
  - **printTemplateUrl**: URL con las plantillas.
  - **printSelector**: Añade los dos modos de impresión (true/false). Por defecto: true.
  - **printType**: Define el modo de impresión (client/server), es necesario que printSelector tenga valor false.
- **printermap**:  Indica si el control "Impresión de imagen con plantilla" se añade al plugin (true/false). Por defecto: true.
  - **tooltip**: Texto que se muestra al dejar el ratón encima del plugin. Por defecto: Impresión del mapa.
  - **printTemplateUrl**: URL con las plantillas a utilizar. Por defecto: https://componentes.cnig.es/geoprint/print/CNIG.
  - **fixedDescription**: Valor booleano que indica si añadir por defecto un texto a la descripción específico de fototeca sin posibilidad de edición (true/false). Por defecto: false.
  - **headerLegend**: URL de una imagen para añadir como leyenda en la parte central de la cabecera.
  - **filterTemplates**: Listado de nombres de plantillas que queremos tener disponibles, si no se manda el parámetro aparecerán todas por defecto.
  - **logo**: URL de una imagen para añadir como logo en la esquina superior derecha.

# API-REST - TODO

```javascript
URL_API?printviewmanagement=position*collapsed*collapsible*tooltip*isDraggable*predefinedZoom*zoomExtent*printermap*zoompanel
```

<table>
  <tr>
    <th>Parámetros</th>
    <th>Opciones/Descripción</th>
    <th>Disponibilidad</th>
  </tr>
  <tr>
    <td>position</td>
    <td>TR/TL/BR/BL</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>collapsible</td>
    <td>true/false</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>collapsed</td>
    <td>true/false</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>tooltip</td>
    <td>tooltip</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>isDraggable</td>
    <td>true/false</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>predefinedZoom (*)</td>
    <td>true/false</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>zoomExtent</td>
    <td>true/false</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>printermap</td>
    <td>true/false</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
  <tr>
    <td>zoompanel</td>
    <td>true/false</td>
    <td>Base64 ✔️ | Separador ✔️</td>
  </tr>
</table>
(*) Este parámetro podrá ser enviado por API-REST con los valores true o false. Si es true indicará al plugin que se añada el control con los valores por defecto. Para añadir los zooms deseados en los que se podrá centrar el mapa se deberá realizar mediante API-REST en base64.

### Ejemplos de uso API-REST

```
https://componentes.cnig.es/api-core?printviewmanagement=TL*true*true*tooltip
```

```
https://componentes.cnig.es/api-core?printviewmanagement=TL*true*true*tooltip*true*false*true*true*false
```

### Ejemplos de uso API-REST en base64

Para la codificación en base64 del objeto con los parámetros del plugin podemos hacer uso de la utilidad M.utils.encodeBase64.
Ejemplo:
```javascript
M.utils.encodeBase64(obj_params);
```

1) Ejemplo de constructor del plugin:

```javascript
{
  position:'TL',
  collapsible: true,
  collapsed: true,
  tooltip: 'Impresión del mapa',
  predefinedZoom: true,
  zoomExtent: false,
  printermap: true,
  zoompanel: true,
}
```
```
https://componentes.cnig.es/api-core?printviewmanagement=base64=eyJwb3NpdGlvbiI6IlRMIiwiY29sbGFwc2libGUiOnRydWUsImNvbGxhcHNlZCI6dHJ1ZSwidG9vbHRpcCI6Ikdlc3Rpw7NuIGRlIGxhIHZpc3RhIiwicHJlZGVmaW5lZFpvb20iOnRydWUsInpvb21FeHRlbnQiOmZhbHNlLCJ2aWV3aGlzdG9yeSI6dHJ1ZSwiem9vbXBhbmVsIjp0cnVlfQ==
```


2) Ejemplo de constructor del plugin:
```javascript
{
  position:'TL',
  tooltip: 'Impresión del mapa',
  predefinedZoom: [
    {name: 'zoom 1', center: [-428106.86611520057, 4334472.25393817], zoom: 4},
    {name: 'zoom 2', bbox: [-2392173.2372, 3033021.2824, 1966571.8637, 6806768.1648]}]
}
```
```
https://componentes.cnig.es/api-core?printviewmanagement=base64=eyJwb3NpdGlvbiI6IlRMIiwidG9vbHRpcCI6Ikdlc3Rpw7NuIGRlIGxhIHZpc3RhIiwicHJlZGVmaW5lZFpvb20iOlt7Im5hbWUiOiJ6b29tIDEiLCJjZW50ZXIiOlstNDI4MTA2Ljg2NjExNTIwMDU3LDQzMzQ0NzIuMjUzOTM4MTddLCJ6b29tIjo0fSx7Im5hbWUiOiJ6b29tIDIiLCJiYm94IjpbLTIzOTIxNzMuMjM3MiwzMDMzMDIxLjI4MjQsMTk2NjU3MS44NjM3LDY4MDY3NjguMTY0OF19XX0=
```

# Ejemplo de uso

```javascript
const map = M.map({
  container: 'map'
});

const mp = new M.plugin.PrintViewManagement({
  isDraggable: true,
  position: 'TL',
  collapsible: true,
  collapsed: true,
  tooltip: 'Imprimir',
  serverUrl: 'https://componentes.cnig.es/geoprint',
  printStatusUrl: 'https://componentes.cnig.es/geoprint/print/status',
  georefImageEpsg: {
    tooltip: 'Georeferenciar imagen',
    layers: [
      {
        url: 'http://www.ign.es/wms-inspire/mapa-raster?',
        name: 'mtn_rasterizado',
        format: 'image/jpeg',
        legend: 'Mapa ETRS89 UTM',
        EPSG: 'EPSG:4326',
      },
      {
        url: 'http://www.ign.es/wms-inspire/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        format: 'image/jpeg',
        legend: 'Imagen (PNOA) ETRS89 UTM',
        // EPSG: 'EPSG:4258',
      },
    ],
  },
  georefImage: {
    tooltip: 'Georeferenciar imagen',
    printTemplateUrl: 'https://componentes.cnig.es/geoprint/print/mapexport',
    printSelector: false,
    printType: 'client', // 'client' or 'server'
  },
  printermap: {
    printTemplateUrl: 'https://componentes.cnig.es/geoprint/print/CNIG',
    // fixedDescription: true,
    headerLegend: 'https://www.idee.es/csw-codsi-idee/images/cabecera-CODSI.png',
    filterTemplates: ['A3 Horizontal'],
    logo: 'https://www.idee.es/csw-codsi-idee/images/cabecera-CODSI.png',
  },
});

map.addPlugin(mp);

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
