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
    <link type="text/css" rel="stylesheet" href="assets/css/apiign.ol.min.css">
    <link href="plugins/infocoordinates/infocoordinates.ol.min.css" rel="stylesheet" />
    <link href="plugins/sharemap/sharemap.ol.min.css" rel="stylesheet" />
    </link>
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

    <div>
        <label for="selectPosicion">Selector de posición del plugin</label>
        <select name="position" id="selectPosicion">
            <option value="TL">Arriba Izquierda (TL)</option>
            <option value="TR" selected="selected">Arriba Derecha (TR)</option>
            <option value="BR">Abajo Derecha (BR)</option>
            <option value="BL">Abajo Izquierda (BL)</option>
        </select>
        <label for="inputDecimalGEOcoord">Parámetro decimalGEOcoord</label>
        <input id="inputDecimalGEOcoord" type="number" value="4" min="0" max="10"></input>
        <label for="inputDecimalUTMcoord">Parámetro decimalUTMcoord</label>
        <input id="inputDecimalUTMcoord" type="number" value=2 min="0" max="5">
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>

    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration.js"></script>
    <script type="text/javascript" src="plugins/infocoordinates/infocoordinates.ol.min.js"></script>
    <script type="text/javascript" src="plugins/sharemap/sharemap.ol.min.js"></script>
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

        const map = M.map({
            container: 'mapjs',
            zoom: 5.5,
            maxZoom: 20,
            minZoom: 4,
            center: [-467062.8225, 4683459.6216],
        });

        let mp2 = new M.plugin.ShareMap({
            baseUrl: window.location.href.substring(0, window.location.href.indexOf('api-ign')) + "api-ign/",
            position: "TR",
        });

        map.addPlugin(mp2);

        const selectPosicion = document.getElementById("selectPosicion");
        const inputDecimalGEOcoord = document.getElementById("inputDecimalGEOcoord");
        const inputDecimalUTMcoord = document.getElementById("inputDecimalUTMcoord");

        let mp;
        let posicion = selectPosicion.value;
        let valueDecimalGEOcoord = inputDecimalGEOcoord.value;
        let valueDecimalUTMcoord = inputDecimalUTMcoord.value;

        crearPlugin({
            position: posicion,
            decimalGEOcoord: valueDecimalGEOcoord,
            decimalUTMcoord: valueDecimalUTMcoord
        });

        selectPosicion.addEventListener("change", cambiarTest);
        inputDecimalGEOcoord.addEventListener("change", cambiarTest);
        inputDecimalUTMcoord.addEventListener("change", cambiarTest);

        function cambiarTest() {
            let objeto = {}
            objeto.position = selectPosicion.options[selectPosicion.selectedIndex].value;
            objeto.decimalGEOcoord = inputDecimalGEOcoord.value;
            objeto.decimalUTMcoord = inputDecimalUTMcoord.value;
            map.removePlugins(mp);
            crearPlugin(objeto);
        }

        function crearPlugin(propiedades) {
            mp = new M.plugin.Infocoordinates(propiedades);
            map.addPlugin(mp);
        }

        const botonEliminar = document.getElementById("botonEliminar");
        botonEliminar.addEventListener("click", function() {
            map.removePlugins(mp);
        });
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
