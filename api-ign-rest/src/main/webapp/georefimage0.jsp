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
    <link href="plugins/georefimage/georefimage.ol.min.css" rel="stylesheet" />
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

        <label for="selectCollapsed">Selector collapsed</label>
        <select name="httpValue" id="selectCollapsed">
            <option value=true>true</option>
            <option value=false>false</option>
        </select>

        <label for="selectCollapsible">Selector collapsible</label>
        <select name="httpValue" id="selectCollapsible">
            <option value=true>true</option>
            <option value=false>false</option>
        </select>
        <label for="inputServerUrl">Parámetro inputServerUrl</label>
        <input type="text" value="" name="serverUrl" id="inputServerUrl" list="serverUrlSug">
        <datalist id="serverUrlSug">
            <option value="https://geoprint.desarrollo.guadaltel.es"></option>
        </datalist>
        <label for="inputPrintTemplateUrl">Parámetro inputPrintTemplateUrl</label>
        <input type="text" value="" name="printTemplateUrl" id="inputPrintTemplateUrl" list="printTemplateUrlSug">
        <datalist id="printTemplateUrlSug">
            <option value="https://geoprint.desarrollo.guadaltel.es/print/mapexport"></option>
        </datalist>
        <label for="inputPrintStatusUrl">Parámetro inputPrintStatusUrl</label>
        <input type="text" value="" name="printStatusUrl" id="inputPrintStatusUrl" list="printStatusUrlSug">
        <datalist id="printStatusUrlSug">
            <option value="https://geoprint.desarrollo.guadaltel.es/print/status"></option>
        </datalist>
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration.js"></script>
    <script type="text/javascript" src="plugins/georefimage/georefimage.ol.min.js"></script>
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
            zoom: 5,
            maxZoom: 20,
            minZoom: 4,
            center: [-467062.8225, 4783459.6216],
        });
        let mp;
        let position, collapsed, collapsible, serverUrl, printTemplateUrl, printStatusUrl;

        crearPlugin(position, collapsed, collapsible, serverUrl, printTemplateUrl, printStatusUrl);

        const selectPosicion = document.getElementById("selectPosicion");
        const selectCollapsed = document.getElementById("selectCollapsed");
        const selectCollapsible = document.getElementById("selectCollapsible");
        const inputServerUrl = document.getElementById("inputServerUrl");
        const inputPrintTemplateUrl = document.getElementById("inputPrintTemplateUrl");
        const inputPrintStatusUrl = document.getElementById("inputPrintStatusUrl");

        selectPosicion.addEventListener("change", cambiarTest);
        selectCollapsed.addEventListener("change", cambiarTest);
        selectCollapsible.addEventListener("change", cambiarTest);
        inputServerUrl.addEventListener("change", cambiarTest);
        inputPrintTemplateUrl.addEventListener("change", cambiarTest);
        inputPrintStatusUrl.addEventListener("change", cambiarTest);

        function cambiarTest() {
            position = selectPosicion.options[selectPosicion.selectedIndex].value;
            collapsed = (selectCollapsed.options[selectCollapsed.selectedIndex].value == 'true');
            collapsible = (selectCollapsible.options[selectCollapsible.selectedIndex].value == 'true');
            serverUrl = inputServerUrl.value;
            printTemplateUrl = inputPrintTemplateUrl.value;
            printStatusUrl = inputPrintStatusUrl.value;
            map.removePlugins(mp);
            crearPlugin(position, collapsed, collapsible, serverUrl, printTemplateUrl, printStatusUrl);
        }

        function crearPlugin(position, collapsed, collapsible, serverUrl, printTemplateUrl, printStatusUrl) {
            mp = new M.plugin.Georefimage({
                collapsed: collapsed,
                collapsible: collapsible,
                position: position,
                serverUrl: serverUrl,
                printTemplateUrl: printTemplateUrl,
                printStatusUrl: printStatusUrl
            });
            map.addPlugin(mp);
        }
        let mp2 = new M.plugin.ShareMap({
            baseUrl: window.location.href.substring(0, window.location.href.indexOf('api-core')) + "api-core/",
            position: "TR",
        });
        map.addPlugin(mp2);
        const botonEliminar = document.getElementById("botonEliminar");
        botonEliminar.addEventListener("click", function() {
            map.removePlugins(mp);
        });
    </script>
</body>

</html>