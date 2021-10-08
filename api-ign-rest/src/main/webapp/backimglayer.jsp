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
    <link href="plugins/backimglayer/backimglayer.ol.min.css" rel="stylesheet" />
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

        <label for="ncolumn">Número de columnas:</label>
        <input type="text" id="ncolumn" name="ncolumn" value="2">
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>

    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration.js"></script>
    <script type="text/javascript" src="plugins/backimglayer/backimglayer.ol.min.js"></script>
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

        let mp, posicion, collapsed, collapsible, columnas = 2;
        crearPlugin({
            collapsed: collapsed,
            collapsible: collapsible,
            position: posicion,
            columnsNumber: columnas
        });

        const selectPosicion = document.getElementById("selectPosicion");
        const selectCollapsed = document.getElementById("selectCollapsed");
        const selectCollapsible = document.getElementById("selectCollapsible");
        const ncolumn = document.getElementById("ncolumn");

        selectPosicion.addEventListener('change', cambiarTest);
        selectCollapsed.addEventListener('change', cambiarTest);
        selectCollapsible.addEventListener('change', cambiarTest);
        ncolumn.addEventListener('change', cambiarTest);

        function cambiarTest() {
            let objeto = {}
            objeto.collapsed = (selectCollapsed.options[selectCollapsed.selectedIndex].value == 'true');
            objeto.collapsible = (selectCollapsible.options[selectCollapsible.selectedIndex].value == 'true');
            objeto.position = selectPosicion.options[selectPosicion.selectedIndex].value;
            objeto.columnsNumber = ncolumn.value || 2;

            map.removePlugins(mp);
            crearPlugin(objeto);
        }

        function crearPlugin(propiedades) {
            propiedades.layerOpts = [{
                    id: 'mapa',
                    preview: 'plugins/backimglayer/images/svqmapa.png',
                    title: 'Mapa',
                    layers: [new M.layer.WMTS({
                        url: 'https://www.ign.es/wmts/ign-base?',
                        name: 'IGNBaseTodo',
                        legend: 'Mapa IGN',
                        matrixSet: 'GoogleMapsCompatible',
                        transparent: false,
                        displayInLayerSwitcher: false,
                        queryable: false,
                        visible: true,
                        format: 'image/jpeg',
                    })],
                },
                {
                    id: 'imagen',
                    title: 'Imagen',
                    preview: 'plugins/backimglayer/images/svqimagen.png',
                    layers: [new M.layer.WMTS({
                        url: 'https://www.ign.es/wmts/pnoa-ma?',
                        name: 'OI.OrthoimageCoverage',
                        legend: 'Imagen (PNOA)',
                        matrixSet: 'GoogleMapsCompatible',
                        transparent: false,
                        displayInLayerSwitcher: false,
                        queryable: false,
                        visible: true,
                        format: 'image/jpeg',
                    })],
                },
                {
                    id: 'hibrido',
                    title: 'Híbrido',
                    preview: 'plugins/backimglayer/images/svqhibrid.png',
                    layers: [new M.layer.WMTS({
                            url: 'https://www.ign.es/wmts/pnoa-ma?',
                            name: 'OI.OrthoimageCoverage',
                            legend: 'Imagen (PNOA)',
                            matrixSet: 'GoogleMapsCompatible',
                            transparent: true,
                            displayInLayerSwitcher: false,
                            queryable: false,
                            visible: true,
                            format: 'image/jpeg',
                        }),
                        new M.layer.WMTS({
                            url: 'https://www.ign.es/wmts/ign-base?',
                            name: 'IGNBaseOrto',
                            matrixSet: 'GoogleMapsCompatible',
                            legend: 'Mapa IGN',
                            transparent: false,
                            displayInLayerSwitcher: false,
                            queryable: false,
                            visible: true,
                            format: 'image/png',
                        })
                    ],
                },
                {
                    id: 'lidar',
                    preview: 'plugins/backimglayer/images/svqlidar.png',
                    title: 'LIDAR',
                    layers: [new M.layer.WMTS({
                        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
                        name: 'EL.GridCoverageDSM',
                        legend: 'Modelo Digital de Superficies LiDAR',
                        matrixSet: 'GoogleMapsCompatible',
                        transparent: false,
                        displayInLayerSwitcher: false,
                        queryable: false,
                        visible: true,
                        format: 'image/png',
                    })],
                }, {
                    id: 'lidar2',
                    preview: 'plugins/backimglayer/images/svqlidar.png',
                    title: 'LIDAR2',
                    layers: [new M.layer.WMTS({
                        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
                        name: 'EL.GridCoverageDSM',
                        legend: 'Modelo Digital de Superficies LiDAR',
                        matrixSet: 'GoogleMapsCompatible',
                        transparent: false,
                        displayInLayerSwitcher: false,
                        queryable: false,
                        visible: true,
                        format: 'image/png',
                    })],
                },
                {
                    id: 'lidar3',
                    preview: 'plugins/backimglayer/images/svqlidar.png',
                    title: 'LIDAR3',
                    layers: [new M.layer.WMTS({
                        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
                        name: 'EL.GridCoverageDSM',
                        legend: 'Modelo Digital de Superficies LiDAR',
                        matrixSet: 'GoogleMapsCompatible',
                        transparent: false,
                        displayInLayerSwitcher: false,
                        queryable: false,
                        visible: true,
                        format: 'image/png',
                    })],
                },
                {
                    id: 'lidar4',
                    preview: 'plugins/backimglayer/images/svqlidar.png',
                    title: 'LIDAR4',
                    layers: [new M.layer.WMTS({
                        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
                        name: 'EL.GridCoverageDSM',
                        legend: 'Modelo Digital de Superficies LiDAR',
                        matrixSet: 'GoogleMapsCompatible',
                        transparent: false,
                        displayInLayerSwitcher: false,
                        queryable: false,
                        visible: true,
                        format: 'image/png',
                    })],
                },
                {
                    id: 'lidar5',
                    preview: 'plugins/backimglayer/images/svqlidar.png',
                    title: 'LIDAR5',
                    layers: [new M.layer.WMTS({
                        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
                        name: 'EL.GridCoverageDSM',
                        legend: 'Modelo Digital de Superficies LiDAR',
                        matrixSet: 'GoogleMapsCompatible',
                        transparent: false,
                        displayInLayerSwitcher: false,
                        queryable: false,
                        visible: true,
                        format: 'image/png',
                    })],
                },
            ];
            mp = new M.plugin.BackImgLayer(propiedades);
            map.addPlugin(mp);
        }
        let mp2 = new M.plugin.ShareMap({
            baseUrl: window.location.href.substring(0, window.location.href.indexOf('api-ign')) + "api-ign/",
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
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-163660977-1"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-163660977-1');
</script>

</html>
