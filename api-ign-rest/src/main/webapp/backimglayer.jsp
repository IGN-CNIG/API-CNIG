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
    <link href="plugins/backimglayer/backimglayer.ol.min.css" rel="stylesheet" />
    </link>
    <style type="text/css">
        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
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
            <option value="TR">Arriba Derecha (TR)</option>
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
        <input type="text" id="ncolumn" name="ncolumn">

    </div>

    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign-1.2.0.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration-1.2.0.js"></script>
    <script type="text/javascript" src="plugins/backimglayer/backimglayer.ol.min.js"></script>
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
            center: [-467062.8225, 4683459.6216],
        });

        let mp, posicion = 'TL',
            collapsed = true,
            collapsible = true,
            columnas = true;
        crearPlugin(collapsed, collapsible, posicion, columnas);

        const selectPosicion = document.getElementById("selectPosicion");
        const selectCollapsed = document.getElementById("selectCollapsed");
        const selectCollapsible = document.getElementById("selectCollapsible");
        const ncolumn = document.getElementById("ncolumn");


        selectPosicion.addEventListener('change', function() {
            collapsed = (selectCollapsed.options[selectCollapsed.selectedIndex].value == 'true');
            collapsible = (selectCollapsible.options[selectCollapsible.selectedIndex].value == 'true');
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
            columnas = ncolumn.value;

            map.removePlugins(mp);
            crearPlugin(collapsed, collapsible, posicion, columnas);
        })

        selectCollapsed.addEventListener('change', function() {
            collapsed = (selectCollapsed.options[selectCollapsed.selectedIndex].value == 'true');
            collapsible = (selectCollapsible.options[selectCollapsible.selectedIndex].value == 'true');
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
            columnas = ncolumn.value;

            map.removePlugins(mp);
            crearPlugin(collapsed, collapsible, posicion, columnas);
        })

        selectCollapsible.addEventListener('change', function() {
            collapsed = (selectCollapsed.options[selectCollapsed.selectedIndex].value == 'true');
            collapsible = (selectCollapsible.options[selectCollapsible.selectedIndex].value == 'true');
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
            columnas = ncolumn.value;
            map.removePlugins(mp);
            crearPlugin(collapsed, collapsible, posicion, columnas);
        })

        ncolumn.addEventListener('change', function() {
            collapsed = (selectCollapsed.options[selectCollapsed.selectedIndex].value == 'true');
            collapsible = (selectCollapsible.options[selectCollapsible.selectedIndex].value == 'true');
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
            columnas = ncolumn.value;
            map.removePlugins(mp);
            crearPlugin(collapsed, collapsible, posicion, columnas);
        })

        function crearPlugin(collapsed, collapsible, posicion, columnas) {

            mp = new M.plugin.BackImgLayer({
                position: posicion,
                collapsible: collapsible,
                collapsed: collapsed,
                columnsNumber: columnas,
                layerOpts: [{
                        id: 'mapa',
                        preview: 'plugins/backimglayer/images/svqmapa.png',
                        title: 'Mapa',
                        layers: [new M.layer.WMTS({
                            url: 'http://www.ign.es/wmts/ign-base?',
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
                            url: 'http://www.ign.es/wmts/pnoa-ma?',
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
                                url: 'http://www.ign.es/wmts/pnoa-ma?',
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
                                url: 'http://www.ign.es/wmts/ign-base?',
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
                ],
            });

            map.addPlugin(mp);
        }
    </script>
</body>

</html>