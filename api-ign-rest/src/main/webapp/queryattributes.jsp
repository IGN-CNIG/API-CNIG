<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="es.cnig.mapea.plugins.PluginsManager"%>
<%@ page import="es.cnig.mapea.parameter.adapter.ParametersAdapterV3ToV4"%>
<%@ page import="java.util.Map"%>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="mapea" content="yes">
    <title>Visor base</title>
    <link type="text/css" rel="stylesheet" href="assets/css/apiign.ol.min.css" />
    <link href="plugins/queryattributes/queryattributes.ol.min.css" rel="stylesheet" />
    <style type="text/css">
        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: auto;
        }
    </style>
    <%
      Map<String, String[]> parameterMap = request.getParameterMap();
      PluginsManager.init (getServletContext());
      Map<String, String[]> adaptedParams = ParametersAdapterV3ToV4.adapt(parameterMap);
      String[] cssfiles = PluginsManager.getCSSFiles(adaptedParams);
      for (int i = 0; i < cssfiles.length; i++) {
         String cssfile = cssfiles[i];
   %>
    <link type="text/css" rel="stylesheet" href="plugins/<%=cssfile%>">
    </link>
    <%
      } %>
</head>

<body>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration.js"></script>
    <script type="text/javascript" src="plugins/queryattributes/queryattributes.ol.min.js"></script>

    <%
      String[] jsfiles = PluginsManager.getJSFiles(adaptedParams);
      for (int i = 0; i < jsfiles.length; i++) {
         String jsfile = jsfiles[i];
   %>
    <script type="text/javascript" src="plugins/<%=jsfile%>"></script>

    <%
      }
   %>
    <script type="text/javascript">
        const urlParams = new URLSearchParams(window.location.search);
        M.language.setLang(urlParams.get('language') || 'es');

        let map = M.map({
            container: 'mapjs',
            zoom: 8,
            center: [-503395.3366454871, 4896624.823755192],
        });

        const vertex = new M.layer.GeoJSON({
          name: 'vertices',
          url: 'https://srv-store2.gofile.io/download/taf7oR/4cc5c0549f8f4049929dfd733b7cd516/vertices.geojson',
        });

        const mp = new QueryAttributes({
          position: 'TL',
          collapsed: true,
          collapsible: true,
          configuration: {
            layer: 'vertices',
            initialSort: { name: 'codigoregi', dir: 'asc' },
            columns: [
              { name: 'id', alias: 'Identificador', visible: true, align: 'right', type: 'string' },
              { name: 'nombre', alias: 'Nombre Vértice', visible: true, align: 'left', type: 'string' },
              { name: 'xutmetrs89', alias: 'Coordenada X (UTM ETRS89)', visible: false, align: 'left', type: 'string' },
              { name: 'yutmetrs89', alias: 'Coordenada Y (UTM ETRS89)', visible: false, align: 'left', type: 'string' },
              { name: 'huso', alias: 'Huso UTM', visible: false, align: 'left', type: 'string' },
              { name: 'horto', alias: 'Altitud Ortométrica', visible: false, align: 'left', type: 'string' },
              { name: 'summary', alias: 'Descripción', visible: false, align: 'left', type: 'string' },
              { name: 'lat', alias: 'Latitud', visible: false, align: 'left', type: 'string' },
              { name: 'lng', alias: 'Longitud', visible: false, align: 'left', type: 'string' },
              { name: 'urlficha', alias: 'URL PDF Ficha', visible: false, align: 'left', type: 'url' },
              { name: 'urlcdd', alias: 'URL Centro Descargas', visible: false, align: 'left', type: 'url' },
              { name: 'hojamtn50', alias: 'Hoja MTN50', visible: false, align: 'left', type: 'string' },
              { name: 'imagemtn50', alias: 'Imagen Hoja MTN50', visible: false, align: 'left', type: 'image' },
              { name: 'description', alias: 'Descripción completa', visible: true, align: 'left', type: 'string' },
            ],
          }
        });

        M.proxy(false);
        map.addLayers(vertex);
        map.addPlugin(mp);
        setTimeout(() => {
          M.proxy(true);
        }, 5000);

    </script>
</body>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-163660977-1"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-163660977-1');
</script>

</html>
