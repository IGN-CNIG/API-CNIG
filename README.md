# API CNIG

API CNIG es una herramienta que permite integrar de una forma muy sencilla un visualizador de mapas interactivo en cualquier página web y configurarlo consumiendo ficheros WMC, servicios WMS y WMTS, servicios WFS, ficheros KML, etc. Además, provee la capacidad de añadir una gran cantidad de herramientas y controles.

Para adaptarse a las necesidades de los usuarios y ser mucho más flexible, API CNIG cuenta con dos APIs. De esta manera, es el propio usuario el que selecciona la que más se adapta a las necesidades que necesite cubrir en cada momento:

 - A través de una API REST muy sencilla y documentada permite incluir un visualizador interactivo en cualquier página web sin necesidad de disponer de conocimientos específicos en programación ni en el ámbito de los SIG.
 - A través de una API JavaScript que permite crear desde visualizadores de mapas básico hasta otros de mayor complejidad.

## Componentes

La arquitectura de API CNIG está compuesta por los siguientes componentes:

- [api-ign-js](/api-ign-js) Librería JavaScript que provee una API para facilitar la creación de visores de mapas.
- [api-ign-parent](/api-ign-parent) Módulo padre que hace uso de maven para compilar y generar el war final de api-core.
- [api-ign-proxy](/api-ign-proxy) Proxy para realizar peticiones POST por si el [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) no está habilitado.
- [api-ign-rest](/api-ign-rest) Servicio Web con API RESTful que genera el código JS necesario para generar un visor con la configuración especificada por parámetros.

## Plugins

El API CNIG se puede extender en base al desarrollo de plugins.

Por defecto vienen incorporados los siguientes plugins:

- [attributions](/api-ign-js/src/plugins/attributions/README.md) Plugin para establecer atribuciones al mapa (archivo preconfigurado) y a la capas (vía servicios).
- [ignsearch](/api-ign-js/src/plugins/ignsearch/README.md) Plugin de búsqueda sobre servicio de búsquedas del IGN, permitiendo búsquedas de calles, topónimos y referencias catastrales. Permite incorporar opción de geocodificación inversa.
- [mousesrs](/api-ign-js/src/plugins/mousesrs/README.md) Plugin que permite mostrar información sobre coordenadas y sistema de referencia.
- [sharemap](/api-ign-js/src/plugins/sharemap/README.md) Plugin que permite compartir la visión actual del mapa.
- [toc](/api-ign-js/src/plugins/toc/README.md) Plugin que muestra un TOC sencillo con las capas del mapa (WMS,WMTS) que no están como capas base.
- [xylcocator](/api-ign-js/src/plugins/xylocator/README.md) Plugin que permite centrar el mapa en unas coodenadas dadas en un sistema de referencia determinado.
- [zoomextent](/api-ign-js/src/plugins/zoomextent/README.md) Plugin que permite realizar un zoom con recuadro sobre el mapa.


## Navegadores soportados

- EdgeHTML 12+
- Mozilla Firefox 45+
- Goole Chrome 49+

## Dispositivos móviles y SO soportados

- Android 6+
- iOS 9+
