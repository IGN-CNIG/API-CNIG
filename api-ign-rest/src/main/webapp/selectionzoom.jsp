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
    <link type="text/css" rel="stylesheet" href="assets/css/apiign-1.2.0.ol.min.css">
    <link href="plugins/ignsearch/ignsearch.ol.min.css" rel="stylesheet" />
    <link href="plugins/attributions/attributions.ol.min.css" rel="stylesheet" />
    <link href="plugins/xylocator/xylocator.ol.min.css" rel="stylesheet" />
    <link href="plugins/sharemap/sharemap.ol.min.css" rel="stylesheet" />
    <link href="plugins/mousesrs/mousesrs.ol.min.css" rel="stylesheet" />
    <link href="plugins/zoomextent/zoomextent.ol.min.css" rel="stylesheet" />
    <link href="plugins/toc/toc.ol.min.css" rel="stylesheet" />
    <link href="plugins/backimglayer/backimglayer.ol.min.css" rel="stylesheet" />
    <link href="plugins/selectionzoom/selectionzoom.ol.min.css" rel="stylesheet" />
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
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign-1.2.0.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration-1.2.0.js"></script>
    <script type="text/javascript" src="plugins/ignsearch/ignsearch.ol.min.js"></script>
    <script type="text/javascript" src="plugins/attributions/attributions.ol.min.js"></script>
    <script type="text/javascript" src="plugins/xylocator/xylocator.ol.min.js"></script>
    <script type="text/javascript" src="plugins/sharemap/sharemap.ol.min.js"></script>
    <script type="text/javascript" src="plugins/zoomextent/zoomextent.ol.min.js"></script>
    <script type="text/javascript" src="plugins/mousesrs/mousesrs.ol.min.js"></script>
    <script type="text/javascript" src="plugins/toc/toc.ol.min.js"></script>
    <script type="text/javascript" src="plugins/backimglayer/backimglayer.ol.min.js"></script>
    <script type="text/javascript" src="plugins/selectionzoom/selectionzoom.ol.min.js"></script>
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
            controls: ['panzoom', 'scale*true', 'scaleline', 'rotate', 'location', 'getfeatureinfo'],
            zoom: 5,
            maxZoom: 20,
            minZoom: 4,
            center: [-467062.8225, 4683459.6216],
        });

        const layerinicial = new M.layer.WMS({
            url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
            name: 'AU.AdministrativeBoundary',
            legend: 'Limite administrativo',
            tiled: false,
        }, {});

        const layerUA = new M.layer.WMS({
            url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
            name: 'AU.AdministrativeUnit',
            legend: 'Unidad administrativa',
            tiled: false
        }, {});

        map.addLayers([layerinicial, layerUA]);

        const mp = new M.plugin.IGNSearch({
            servicesToSearch: 'gn',
            maxResults: 10,
            noProcess: 'poblacion',
            countryCode: 'es',
            isCollapsed: false,
            position: 'TL',
            reverse: true,

            urlCandidates: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/candidatesJsonp',
            urlFind: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/findJsonp',
            urlReverse: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/reverseGeocode',
        });
        const mp2 = new M.plugin.Attributions({
            mode: 1,
            scale: 10000,
        });

        const mp3 = new M.plugin.ShareMap({
            baseUrl: 'https://componentes.ign.es/api-core/',
            position: 'BR',
        });
        const mp4 = new M.plugin.XYLocator({
            position: 'TL',
        });
        const mp6 = new M.plugin.ZoomExtent();
        const mp7 = new M.plugin.MouseSRS({
            srs: 'EPSG:4326',
            label: 'WGS84',
            precision: 6,
            geoDecimalDigits: 4,
            utmDecimalDigits: 2,
        });

        const mp8 = new M.plugin.TOC({
            collapsed: true,
        });

        const mp9 = new M.plugin.BackImgLayer({
            position: 'TR',
            collapsible: true,
            collapsed: true,
            layerId: 0,
            layerVisibility: true,
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
                },
            ],
        });

        const mp10 = new M.plugin.SelectionZoom({
            position: 'TL',
            collapsible: true,
            collapsed: true,
            layerId: 0,
            layerVisibility: true,
            ids: 'peninsula,canarias,baleares,ceuta,melilla',
            titles: 'Peninsula,Canarias,Baleares,Ceuta,Melilla',
            previews: 'plugins/selectionzoom/images/espana.png,plugins/selectionzoom/images/canarias.png,plugins/selectionzoom/images/baleares.png,plugins/selectionzoom/images/ceuta.png,plugins/selectionzoom/images/melilla.png',
            bboxs: '-1200091.444315327, 365338.89496508264, 4348955.797933925, 5441088.058207252, -2170190.6639824593, -1387475.4943422542, 3091778.038884449, 3637844.1689537475 , 115720.89020469127, 507078.4750247937, 4658411.436032817, 4931444.501067467,-599755.2558583047, -587525.3313326766, 4281734.817081453, 4290267.100363785, -334717.4178261766, -322487.4933005484, 4199504.016876071, 4208036.300158403',
            zooms: '7,8,9,14,14',
        });

        map.addPlugin(mp);
        map.addPlugin(mp2);
        map.addPlugin(mp3);
        map.addPlugin(mp4);
        map.addPlugin(mp6);
        map.addPlugin(mp7);
        map.addPlugin(mp8);
        map.addPlugin(mp9);
        map.addPlugin(mp10);
    </script>
</body>

</html>