<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="es.juntadeandalucia.mapea.plugins.PluginsManager"%>
<%@ page import="es.juntadeandalucia.mapea.parameter.adapter.ParametersAdapterV3ToV4"%>
<%@ page import="java.util.Map"%>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="mapea" content="yes">
    <title>Visor base</title>
    <link type="text/css" rel="stylesheet" href="assets/css/apiign-1.2.0.ol.min.css">
    <link href="plugins/ignsearch/ignsearch.ol.min.css" rel="stylesheet" />
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
    <% } %>
</head>

<body>
    <div>
        <label for="selectServiceToSearch">Selector de servicio que se consulta del plugin</label>
        <select name="serviceToSearch" id="selectServiceToSearch">
            <option value="g">Consulta Geocoder</option>
            <option value="n">Consulta Topónimos</option>
            <option value="gn">Consulta Geocoder y Topónimos</option>
        </select>
        <label for="inputMaxResults">Parámetro maxResults</label>
        <input type="number" min="0" value="10" name="maxResults" id="inputMaxResults">
        <label for="selectNoProcess">Selector de noProcess del plugin</label>
        <select name="noProcess" id="selectNoProcess">
            <option value="municipio">Municipio</option>
            <option value="poblacion">Población</option>
            <option value="toponimo">Topónimo</option>
            <option value="municipio,poblacion">Municipio y Población</option>
        </select>
        <label for="selectCountryCode">Selector de idioma del plugin</label>
        <select name="countryCode" id="selectCountryCode">
            <option value="es">Español</option>
            <option value="en">Inglés</option>
        </select>
        <label for="selectPosicion">Selector de posición del plugin</label>
        <select name="position" id="selectPosicion">
            <option value="TL">Arriba Izquierda (TL)</option>
            <option value="TR">Arriba Derecha (TR)</option>
            <option value="BR">Abajo Derecha (BR)</option>
            <option value="BL">Abajo Izquierda (BL)</option>
        </select>
        <label for="selectCollapsed">Selector collapsed</label>
        <select name="collapsedValue" id="selectCollapsed">
            <option value=true>true</option>
            <option value=false>false</option>
        </select>
        <label for="selectReverse">Selector reverse</label>
        <select name="reverseValue" id="selectReverse">
            <option value=true>true</option>
            <option value=false>false</option>
        </select>
        <label for="inputUrlCandidates">Parámetro urlCandidates</label>
        <input type="text" value="https://www.cartociudad.es/geocoder/api/geocoder/candidatesJsonp" name="urlCandidates" id="inputUrlCandidates">
        <label for="inputUrlFind">Parámetro urlFind</label>
        <input type="text" value="https://www.cartociudad.es/geocoder/api/geocoder/findJsonp" name="urlFind" id="inputUrlFind">
        <label for="inputUrlReverse">Parámetro urlReverse</label>
        <input type="text" value="https://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode" name="urlReverse" id="inputUrlReverse">
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign-1.2.0.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration-1.2.0.js"></script>
    <script type="text/javascript" src="plugins/ignsearch/ignsearch.ol.min.js"></script>
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
    const map = M.map({
            container: 'mapjs',
            zoom: 5,
            maxZoom: 20,
            minZoom: 4,
            center: [-467062.8225, 4783459.6216],
        });
    
    let mp,mp2;

    let sToSearch = 'gn',
        mxResults = 10,
        collapsed = false,
        posicion = "TL",
        noProcess = "poblacion",
        countryCode = "es",
        reverse = "false",
        urlCandidates = "https://www.cartociudad.es/geocoder/api/geocoder/candidatesJsonp",
        urlFind = "https://www.cartociudad.es/geocoder/api/geocoder/findJsonp",
        urlReverse = "https://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode";
    crearPlugin(sToSearch, mxResults, noProcess, countryCode, collapsed, posicion, reverse ,urlCandidates, urlFind, urlReverse);

    const selectServiceToSearch = document.getElementById("selectServiceToSearch");
    const inputMaxResults = document.getElementById("inputMaxResults");
    const selectNoProcess = document.getElementById("selectNoProcess");
    const selectCountryCode = document.getElementById("selectCountryCode");
    const selectPosicion = document.getElementById("selectPosicion");
    const selectCollapsed = document.getElementById("selectCollapsed");
    const selectReverse = document.getElementById("selectReverse");
    const inputUrlCandidates = document.getElementById("inputUrlCandidates");
    const inputUrlFind = document.getElementById("inputUrlFind");
    const inputUrlReverse = document.getElementById("inputUrlReverse");

    selectServiceToSearch.addEventListener('change', cambiarTest);
    inputMaxResults.addEventListener('change', cambiarTest);
    selectNoProcess.addEventListener('change', cambiarTest);
    selectCountryCode.addEventListener('change', cambiarTest);
    selectPosicion.addEventListener('change', cambiarTest);
    selectCollapsed.addEventListener('change', cambiarTest);
    selectReverse.addEventListener('change', cambiarTest);
    inputUrlCandidates.addEventListener('change',cambiarTest); 
    inputUrlFind.addEventListener('change',cambiarTest); 
    inputUrlReverse.addEventListener('change',cambiarTest);

    function cambiarTest() {
        sToSearch = selectServiceToSearch.options[selectServiceToSearch.selectedIndex].value;
        mxResults = parseInt(inputMaxResults.value);
        noProcess = selectNoProcess.options[selectNoProcess.selectedIndex].value;
        countryCode = selectCountryCode.options[selectCountryCode.selectedIndex].value;
        posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
        collapsed = (selectCollapsed.options[selectCollapsed.selectedIndex].value == 'true');
        reverse = (selectReverse.options[selectReverse.selectedIndex].value == 'true');
        urlCandidates=inputUrlCandidates.value;
        urlFind=inputUrlFind.value;
        urlReverse=inputUrlReverse.value;
        map.removePlugins(mp);
        crearPlugin(sToSearch, mxResults, noProcess, countryCode, collapsed, posicion, reverse, urlCandidates, urlFind, urlReverse);
    }

    function crearPlugin(servicesToSearch, maxResults, noProcess, countryCode, isCollapsed, position, reverse, urlCandidates, urlFind, urlReverse) {
        mp = new M.plugin.IGNSearch({
            servicesToSearch: servicesToSearch,
            maxResults: maxResults,
            noProcess: noProcess,
            countryCode: countryCode,
            isCollapsed: isCollapsed,
            position: position,
            reverse: reverse,
            urlCandidates: urlCandidates,
            urlFind: urlFind,
            urlReverse: urlReverse
        });

        map.addPlugin(mp);
        mp2 = new M.plugin.ShareMap({
            baseUrl: window.location.href.substring(0,window.location.href.indexOf('api-core'))+"api-core/",
            position: "TR",
        });
        map.addPlugin(mp2);
    }
    const botonEliminar = document.getElementById("botonEliminar");
    botonEliminar.addEventListener("click",function(){
        map.removePlugins(mp);
    });
    </script>
</body>

</html>