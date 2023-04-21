<p align="center">
  <img src="https://www.ign.es/resources/viewer/images/logoApiCnig0.5.png" height="152" />
</p>
<h1 align="center"><strong>APICNIG</strong> <small>🔌 M.plugin.Popup</small></h1>

# Descripción

Plugin que muestra información sobre la página y manual de uso.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **popup.ol.min.js**
- **popup.ol.min.css**

```html
 <link href="https://componentes.cnig.es/api-core/plugins/popup/popup.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/popup/popup.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **position**:  Ubicación del plugin sobre el mapa.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda (por defecto).
  - 'BR': (bottom right) - Abajo a la derecha.
- **helpLink**: Enlace al manual de uso.
- **collapsed**. Indica si el plugin aparece abierto por defecto (true/false).
- **collapsible**. Indica si el plugin puede abrirse y cerrarse (true) o si permanece siempre abierto (false).
- **tootltip**. Tooltip que se muestra sobre el plugin.

# API-REST

```javascript
URL_API?popup=position*collapse*url_es*url_en
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
    <td>collapse</td>
    <td>true/false</td>
  </tr>
  <tr>
    <td>url_es</td>
    <td>URL del manual de uso en español</td>
  </tr>
  <tr>
    <td>url_en</td>
    <td>URL del manual de uso en inglés</td>
  </tr>
</table>


### Ejemplos de uso API-REST

```
https://componentes.cnig.es/api-core?popup=TR*true*https%3A%2F%2Fcomponentes.cnig.es%2FayudaIberpix%2Fes.html*https%3A%2F%2Fcomponentes.cnig.es%2FayudaIberpix%2Fen.html
```

```
https://componentes.cnig.es/api-core/?popup=TR***https%3A%2F%2Fcomponentes.cnig.es%2FayudaIberpix%2Fen.html
```

# Ejemplo de uso

```javascript
const map = M.map({
  container: 'map'
});


const mp = new M.plugin.Popup({
  position: 'TR',
  helpLink: {
    es: 'https://componentes.cnig.es/ayudaIberpix/es.html',
    en: 'https://componentes.cnig.es/ayudaIberpix/en.html',
  }
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
