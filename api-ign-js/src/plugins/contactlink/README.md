<p align="center">
  <img src="https://www.ign.es/resources/viewer/images/logoApiCnig0.5.png" height="152" />
</p>
<h1 align="center"><strong>APICNIG</strong> <small>🔌 M.plugin.ContactLink</small></h1>

# Descripción

Provee de enlaces a sitios, redes sociales y correo institucionales.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **contactlink.ol.min.js**
- **contactlink.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/contactlink/contactlink.ol.min.css" rel="stylesheet" />
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
- **collapsible**. Indica si el plugin se puede collapsar en un botón (true/false).
- **collapsed**. Indica si el plugin viene colapsado de entrada (true/false).
- **tooltip**. Valor a usar para mostrar en el tooltip del plugin.

# API-REST

```javascript
URL_API?contactlink=position*collapsible*collapsed*descargascnig*pnoa*visualizador3d*fototeca*twitter
*instagram*facebook*pinterest*youtube*mail
```

<table>
  <tr>
    <td>Parámetros</td>
    <td>Opciones/Descripción</td>
  </tr>
  <tr>
    <td>position</td>
    <td>TR/TL/BR/BL</td>
  </tr>
  <tr>
    <td>collapsible</td>
    <td>true/false</td>
  </tr>
  <tr>
    <td>collapsed</td>
    <td>true/false</td>
  </tr>
  <tr>
    <td>descargascnig</td>
    <td>URL del centro de descargas CNIG</td>
  </tr>
  <tr>
    <td>pnoa</td>
    <td>URL del comparador PNOA</td>
  </tr>
  <tr>
    <td>visualizador3d</td>
    <td>URL del Visualizador3D</td>
  </tr>
  <tr>
    <td>fototeca</td>
    <td>URL de Fototeca</td>
  </tr>
  <tr>
    <td>twitter</td>
    <td>URL del Twitter del CNIG</td>
  </tr>
  <tr>
    <td>instagram</td>
    <td>URL del Instagram del CNIG</td>
  </tr>
  <tr>
    <td>facebook</td>
    <td>URL del Facebook del CNIG</td>
  </tr>
  <tr>
    <td>pinterest</td>
    <td>URL del Pinterest del CNIG</td>
  </tr>
  <tr>
    <td>youtube</td>
    <td>URL del Youtube del CNIG</td>
  </tr>
  <tr>
    <td>mail</td>
    <td>URL del correo del CNIG</td>
  </tr>
</table>


### Ejemplos de uso API-REST

```
https://componentes.cnig.es/api-core/?contactlink=TR*true*true*http%3A%2F%2Fcentrodedescargas.cnig.es%2FCentroDescargas%2Findex.jsp*https%3A%2F%2Fwww.ign.es%2Fweb%2Fcomparador_pnoa%2Findex.html*https%3A%2F%2Fwww.ign.es%2F3D-Stereo%2F*https%3A%2F%2Ffototeca.cnig.es%2F*https%3A%2F%2Ftwitter.com%2FIGNSpain*https%3A%2F%2Fwww.instagram.com%2Fignspain%2F*https%3A%2F%2Fwww.facebook.com%2FIGNSpain%2F*https%3A%2F%2Fwww.pinterest.es%2FIGNSpain%2F*https%3A%2F%2Fwww.youtube.com%2Fuser%2FIGNSpain*mailto:ign@fomento.es
```

```
https://componentes.cnig.es/api-core/?contactlink=TR*true*true
```

# Ejemplo de uso

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
