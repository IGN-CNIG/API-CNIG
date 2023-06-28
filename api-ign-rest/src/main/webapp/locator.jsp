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
    <link href="plugins/locator/locator.ol.min.css" rel="stylesheet" />
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
            <option value="TC">Arriba Centro (TC)</option>
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
        <label for="inputTooltip">Tooltip</label>
        <input type="text" name="tooltip" id="inputTooltip">
        <label for="selectProxy">Proxy</label>
        <select name="proxyValue" id="selectProxy">
            <option value=true>true</option>
            <option value=false>false</option>
        </select>
        <label for="inputZoom">Zoom</label>
        <input type="text" name="zoom" id="inputZoom" value="16">
        <label for="selectPointStyle">Estilo del pin de búsqueda</label>
        <select name="pointStyle" id="selectPointStyle">
            <option value="pinAzul">Azul</option>
            <option value="pinRojo">Rojo</option>
            <option value="pinMorado">Morado</option>
        </select>
        <label for="selectIsdraggable">isDraggable</label>
        <select name="isdraggable" id="selectIsdraggable">
            <option value="true">true</option>
            <option value="false" selected="selected">false</option>
        </select>
        <label for="inputByParcelCadastre">byParcelCadastre</label>
        <select name="byParcelCadastre" id="inputByParcelCadastre">
            <option value="true" selected="selected">true</option>
            <option value="false">false</option>
        </select>
        <label for="inputByCoordinates">byCoordinates</label>
        <select name="byCoordinates" id="inputByCoordinates">
            <option value="true" selected="selected">true</option>
            <option value="false">false</option>
        </select>
        <label for="inputByPlaceAddressPostal">byPlaceAddressPostal</label>
        <select name="byPlaceAddressPostal" id="inputByPlaceAddressPostal">
            <option value="true" selected="selected">true</option>
            <option value="false">false</option>
        </select>
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration.js"></script>
    <script type="text/javascript" src="plugins/locator/locator.ol.min.js"></script>
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
        let posicion, collapsed = true,
            collapsible = true,
            tooltip, zoomL,
            pointStyle, isdraggable, byParcelCadastre, byCoordinates,
            byPlaceAddressPostal;
        crearPlugin({
            position: posicion,
            collapsed: collapsed,
            collapsible: collapsible,
            tooltip: tooltip,
            zoom: zoomL,
            pointStyle: pointStyle,
            isDraggable: isdraggable,
            byParcelCadastre: byParcelCadastre,
            byCoordinates: byCoordinates,
            byPlaceAddressPostal: byPlaceAddressPostal
        });
        const selectPosicion = document.getElementById("selectPosicion");
        const selectCollapsed = document.getElementById("selectCollapsed");
        const selectCollapsible = document.getElementById("selectCollapsible");
        const selectProxy = document.getElementById("selectProxy");
        const inputTooltip = document.getElementById("inputTooltip");
        const inputZoom = document.getElementById("inputZoom");
        const selectPointStyle = document.getElementById("selectPointStyle");
        const selectDraggable = document.getElementById("selectIsdraggable");
        const selectParcel = document.getElementById("inputByParcelCadastre");
        const selectCoordinates = document.getElementById("inputByCoordinates");
        const selectPlace = document.getElementById("inputByPlaceAddressPostal");
        selectPosicion.addEventListener('change', cambiarTest);
        selectCollapsed.addEventListener('change', cambiarTest);
        selectCollapsible.addEventListener('change', cambiarTest);
        selectProxy.addEventListener('change', cambiarTest);
        inputTooltip.addEventListener('change', cambiarTest);
        inputZoom.addEventListener('change', cambiarTest);
        selectPointStyle.addEventListener('change', cambiarTest);
        selectDraggable.addEventListener('change', cambiarTest);
        selectParcel.addEventListener('change', cambiarTest);
        selectCoordinates.addEventListener('change', cambiarTest);
        selectPlace.addEventListener('change', cambiarTest);

        function cambiarTest() {
            let objeto = {};
            objeto.position = selectPosicion.options[selectPosicion.selectedIndex].value;
            objeto.collapsed = (selectCollapsed.options[selectCollapsed.selectedIndex].value == 'true');
            objeto.collapsible = (selectCollapsible.options[selectCollapsible.selectedIndex].value == 'true');
            objeto.useProxy = (selectProxy.options[selectProxy.selectedIndex].value == 'true');
            inputTooltip.value !== "" ? objeto.tooltip = inputTooltip.value : objeto.tooltip = "";
            inputZoom.value !== "" ? objeto.zoom = inputZoom.value : objeto.zoom = "16";
            objeto.pointStyle = selectPointStyle.options[selectPointStyle.selectedIndex].value;
            objeto.isDraggable = (selectDraggable.options[selectDraggable.selectedIndex].value == 'true');
            objeto.byParcelCadastre = (selectParcel.options[selectParcel.selectedIndex].value == 'true');
            objeto.byCoordinates = (selectCoordinates.options[selectCoordinates.selectedIndex].value == 'true');
            objeto.byPlaceAddressPostal = (selectPlace.options[selectPlace.selectedIndex].value == 'true');
            map.removePlugins(mp);
            crearPlugin(objeto);
        }

        function crearPlugin(propiedades) {
            mp = new M.plugin.Locator(propiedades);
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

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CTLHMMB5YT"></script>
<script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-CTLHMMB5YT');
</script>

</html>