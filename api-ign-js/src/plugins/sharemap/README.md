# M.plugin.ShareMap

Plugin que permite copiar la url del mapa actual visualizado.
Exporta la información de todas las capas cargadas en el mapa.

# Dependencias

- sharemap.ol.min.js
- sharemap.ol.min.css


```html
 <link href="../../plugins/sharemap/sharemap.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/sharemap/sharemap.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **baseUrl**. Url sobre la que está montada la instancia de mapea del tipo https://componentes.cnig.es/api-core/
- **title**. Título para la cabecera de la ventana (Por defecto 'Compartir Mapa'
- **btn**. Título para el botón Aceptar (Por defecto 'Aceptar')
- **copyBtn**. Título para el botón copiar (Por defecto 'Copiar url')
- **tooltip**. Texto para el mensaje cuando se copia la cadena (Por defecto 'Copiado')
- **overwriteStyles**. Indica si se le quieren pasar estilos adicionales (Por defecto false)
- **styles**. Estilo a aplicar para sobreescribir
  - **Ejemplo**
```javascript
'styles': {
 *  'primaryColor': 'yellow',
 *  'secondaryColor': 'green'
 *  }
```

- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left (default)
  - 'TR':top right
  - 'BL':bottom left
  - 'BR':bottom right

- **text**. Texto del segundo título. 
- **copyBtnHtml**. Título para el segundo botón. 
- **minimize**. Genera URL minificada.
- **urlAPI**. URL API o URL Visor (API verdadero o predeterminado, visor falso).
- **shareLayers**. Selecciona la capa a compartir por el nombre, valor de tipo Array o Boolean (false). 
  - Por defecto: [ ].
  - ```Boolean```: Las capas que se comparten se seleccionan por el "displayInLayerSwitcher".
  - ```Array<String>```: Los valores serán los nombres de la capa.

# Parámetros API REST
```
URL_API?sharemap=baseUrl*position*title*tooltip*btn*copyBtn
````
Ejemplo:
```
https://componentes.cnig.es/api-core/?sharemap=https://componentes.cnig.es/api-core/*BL*Compartir URL*Copiado*Aceptar*Copiar
```
# Eventos

# Otros métodos


# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.ShareMap({
     baseUrl: 'https://componentes.cnig.es/api-core/',
      postition: 'TL',
   });

   map.addPlugin(mp);
```
