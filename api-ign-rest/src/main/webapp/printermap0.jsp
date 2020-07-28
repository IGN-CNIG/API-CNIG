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
    <link href="plugins/printermap/printermap.ol.min.css" rel="stylesheet" />
    <link href="plugins/sharemap/sharemap.ol.min.css" rel="stylesheet" />
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
        <select name="collapsedValue" id="selectCollapsed">
            <option value=true>true</option>
            <option value=false>false</option>
        </select>
        <label for="selectCollapsible">Selector collapsible</label>
        <select name="collapsibleValue" id="selectCollapsible">
            <option value=true>true</option>
            <option value=false>false</option>
        </select>
        <label for="inputServerUrl">Parámetro serverUrl</label>
        <input type="text" name="serverUrlValue" id="inputServerUrl" list="serverUrlValueSug">
        <datalist id="serverUrlValueSug">
            <option value="https://geoprint.desarrollo.guadaltel.es"></option>
        </datalist>
        <label for="inputPrintTemplateUrl">Parámetro printTemplateUrl</label>
        <input type="text" name="printTemplateUrlValue" id="inputPrintTemplateUrl" list="printTemplateUrlValueSug">
        <datalist id="printTemplateUrlValueSug">
            <option value="https://geoprint.desarrollo.guadaltel.es/print/CNIG"></option>
        </datalist>
        <label for="inputPrintStatusUrl">Parámetro printStatusUrlValue</label>
        <input type="text" name="printStatusUrlValue" id="inputPrintStatusUrl" list="printStatusUrlValueSug">
        <datalist id="printStatusUrlValueSug">
            <option value="https://geoprint.desarrollo.guadaltel.es/print/status"></option>
        </datalist>
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration.js"></script>
    <script type="text/javascript" src="plugins/printermap/printermap.ol.min.js"></script>
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
            center: [-467062.8225, 4683459.6216],
        });

        const layerinicial = new M.layer.WMS({
            url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
            name: 'AU.AdministrativeBoundary',
            legend: 'Limite administrativo',
            tiled: false,
        }, {});

        const campamentos = new M.layer.GeoJSON({
            name: 'Campamentos',
            url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&',
            extract: true,
        });
        map.addLayers([layerinicial, campamentos]);

        let mp;
        let posicion, collapsed, collapsible, serverUrl, printTemplateUrl, printStatusUrl;
        crearPlugin({
            position: posicion,
            collapsed: collapsed,
            collapsible: collapsible,
            serverUrl: serverUrl,
            printTemplateUrl: printTemplateUrl,
            printStatusUrl: printStatusUrl,
        });

        const selectPosicion = document.getElementById("selectPosicion");
        const selectCollapsed = document.getElementById("selectCollapsed");
        const selectCollapsible = document.getElementById("selectCollapsible");
        const inputServerUrl = document.getElementById("inputServerUrl");
        const inputPrintTemplateUrl = document.getElementById("inputPrintTemplateUrl");
        const inputPrintStatusUrl = document.getElementById("inputPrintStatusUrl");

        selectPosicion.addEventListener('change', cambiarTest);
        selectCollapsed.addEventListener('change', cambiarTest);
        selectCollapsible.addEventListener('change', cambiarTest);
        inputServerUrl.addEventListener('change', cambiarTest);
        inputPrintTemplateUrl.addEventListener('change', cambiarTest);
        inputPrintStatusUrl.addEventListener('change', cambiarTest);

        function cambiarTest() {
            let objeto = {}
            objeto.position = selectPosicion.options[selectPosicion.selectedIndex].value;
            objeto.collapsed = (selectCollapsed.options[selectCollapsed.selectedIndex].value == 'true');
            objeto.collapsible = (selectCollapsible.options[selectCollapsible.selectedIndex].value == 'true');
            serverUrl = inputServerUrl.value != "" ? objeto.serverUrl = inputServerUrl.value : "";
            printTemplateUrl = inputPrintTemplateUrl.value != "" ? objeto.printTemplateUrl = inputPrintTemplateUrl.value : "";
            printStatusUrl = inputPrintStatusUrl.value != "" ? objeto.printStatusUrl = inputPrintStatusUrl.value : "";
            map.removePlugins(mp);
            crearPlugin(objeto);
        }

        function crearPlugin(propiedades) {
            mp = new M.plugin.PrinterMap(propiedades);
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