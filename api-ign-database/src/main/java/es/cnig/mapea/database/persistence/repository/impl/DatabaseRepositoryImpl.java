package es.cnig.mapea.database.persistence.repository.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import es.cnig.mapea.database.persistence.domain.Columna;
import es.cnig.mapea.database.persistence.domain.DatosTabla;
import es.cnig.mapea.database.persistence.domain.Tabla;
import es.cnig.mapea.database.persistence.repository.DatabaseRepository;
import es.cnig.mapea.database.utils.Constants;
import es.cnig.mapea.database.utils.CustomPagination;

public class DatabaseRepositoryImpl implements DatabaseRepository {
	
	private static final Logger log = LoggerFactory.getLogger(DatabaseRepositoryImpl.class);
	
	private static final String kmlHeader = "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\""
			+ " xsi:schemaLocation=\"http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd\"><Document>";
	private static final String kmlFooter = "</Document></kml>";
	
	private static final String gmlHeader = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>"
				+"<sf:FeatureCollection xmlns=\"http://www.acme.com/namespaces/ns1\" xmlns:sf=\"http://www.opengis.net/ogcapi-features-1/1.0/sf\" xmlns:gml=\"http://www.opengis.net/gml/3.2\""
				+" xmlns:atom=\"http://www.w3.org/2005/Atom\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.acme.com/namespaces/ns1"
				+" http://www.opengis.net/ogcapi-features-1/1.0/sf http://www.w3.org/2005/Atom http://schemas.opengis.net/kml/2.3/atom-author-link.xsd"
				+" http://www.opengis.net/gml/3.2 http://schemas.opengis.net/gml/3.2.1/gml.xsd\">";

	DataSource datasource;
	
	public DatabaseRepositoryImpl(DataSource datasource){
		this.datasource = datasource;
	}

	@Override
	public List<Tabla> getGeomTables(CustomPagination paginacion) {
		List<Tabla> result = new LinkedList<Tabla>();
		StringBuilder query = new StringBuilder("SELECT table_schema, table_name FROM information_schema.tables ");
		query.append("where table_name in ");
		query.append("(select distinct(f_table_name) from geometry_columns)");
		Connection conn = null;
		try {
			conn = datasource.getConnection();
			int totalResultados = getTotalResultados(conn, query.toString());
			query.append(addPaginacion(paginacion));
			PreparedStatement ps = conn.prepareStatement(query.toString()); 
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				Tabla tabla = new Tabla();
				tabla.setSchema(rs.getString("table_schema"));
				tabla.setNombre(rs.getString("table_name"));
				result.add(tabla);
			}
			ps.close();
			paginacion.setSize(totalResultados);
		} catch (SQLException e) {
			e.printStackTrace();
			paginacion.setError(e.getMessage());
		}finally{
			try {
				if(conn != null){
					conn.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return result;
	}

	@Override
	public List<Columna> getTableColumns(String schema, String table, CustomPagination paginacion) {
		List<Columna> result = new LinkedList<Columna>();
		StringBuilder query = new StringBuilder("SELECT column_name, data_type FROM information_schema.columns ");
		query.append("WHERE table_schema = ? AND table_name = ?");
		Connection conn = null;
		try{
			conn = datasource.getConnection();
			int totalResultados = getTotalResultados(conn, query.toString().replace("schema = ?", "schema = '"+schema+"'").replace("name = ?", "name = '"+table+"'"));
			query.append(addPaginacion(paginacion));
			PreparedStatement ps = conn.prepareStatement(query.toString());
			ps.setString(1, schema);
			ps.setString(2, table);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				Columna col = new Columna();
				col.setNombre(rs.getString("column_name"));
				col.setTipoDato(rs.getString("data_type"));
				result.add(col);
			}
			ps.close();
			paginacion.setSize(totalResultados);
		}catch(SQLException e){
			e.printStackTrace();
			paginacion.setError(e.getMessage());
		}finally{
			try {
				if(conn != null){
					conn.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		return result;
	}
	
	@Override
	public List<DatosTabla> getCustomQueryData(String schema, String table, Map<String, List<String>> params, CustomPagination paginacion){

		List<DatosTabla> result = new LinkedList<DatosTabla>();
		Connection conn = null;
		String query = customQuery(params, schema, table);
		try{
			if(query != null && !"".equals(query)){
				conn = datasource.getConnection();
				int totalResultados = getTotalResultados(conn, query);
				PreparedStatement ps = conn.prepareStatement(query.toString());
				ResultSet rs = ps.executeQuery();
				ResultSetMetaData rsmd = rs.getMetaData();
				while(rs.next()){
					DatosTabla dt = new DatosTabla();
					for(int i = 1; i <= rsmd.getColumnCount(); i++){
						Object value = rs.getObject(i);
						dt.addToMap(rsmd.getColumnLabel(i), value);
					}
					result.add(dt);
				}
				ps.close();
				paginacion.setSize(totalResultados);
				paginacion.setPage(paginacion.getPage());
			}
		}catch(SQLException e){
			e.printStackTrace();
			paginacion.setError(e.getMessage());
		}finally{
			try {
				if(conn != null){
					conn.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return result;
	}

	@Override
	public List<DatosTabla> getFilteredData(String schema, String table, Map<String, List<String>> filtros,
			CustomPagination paginacion) {
		List<DatosTabla> result = new LinkedList<DatosTabla>();
		Connection conn = null;
		Integer zoom = 13;
		String aliasGeom = "geometry";
		try{
			if(filtros.containsKey("zoom")){
				zoom = Integer.parseInt(filtros.get("zoom").get(0));
				filtros.remove("zoom");
			}
			if(filtros.containsKey("aliasgeom")){
				aliasGeom = filtros.get("aliasgeom").get(0);
				filtros.remove("aliasgeom");
			}
			conn = datasource.getConnection();
			log.info("Obteniendo nombre columna geometrica");
			String geomColumn = getNombreColumnaGeom(schema, table, conn);
			Integer sridTable = getGeometrySrid(conn, schema, table, geomColumn); 
			log.info("Obteniendo el resto de nombres de columnas");
			String columnas = getColumnasNoGeometricas(conn, schema, table, geomColumn);
			StringBuilder query = new StringBuilder("SELECT "+ columnas);
			query.append(", ST_transform(" + geomColumn + ", 4326) as "+geomColumn+", 4326 as srid");
			query.append(" FROM " + schema + "." + table);
			query.append(sqlFilter(filtros, geomColumn, sridTable));
			if(geomColumn != null && !"".equals(geomColumn)){
				query.append(query.indexOf("WHERE") >= 0 ? " AND " : " WHERE ");
				query.append(geomColumn + " is not null ");
			}
			int totalResultados = getTotalResultados(conn, query.toString());
			int size = paginacion != null && paginacion.getSize() <= 4000 && paginacion.getSize() > 0 ?
					paginacion.getSize() : totalResultados;
			if(size <= 4000){
				query.append(addPaginacion(paginacion));
				log.info("Obteniendo datos");
				PreparedStatement ps = null;
				ps = switchFormat(conn, paginacion.getFormato().toLowerCase(), query.toString(), geomColumn, aliasGeom, columnas);
				ResultSet rs = ps.executeQuery();
				ResultSetMetaData rsmd = rs.getMetaData();
				while(rs.next()){
					DatosTabla dt = new DatosTabla();
					for(int i = 1; i <= rsmd.getColumnCount(); i++){
						if ("mvt".equals(rsmd.getColumnLabel(i))){
							try{
								InputStream binaryStream = rs.getBinaryStream(i);
								byte[] mvt = new byte[binaryStream.available()];
								binaryStream.read(mvt);
								binaryStream.close();
								File mvtFile = File.createTempFile("mvtTest", ".pbf");
								OutputStream os = new FileOutputStream(mvtFile);
								os.write(mvt);
								os.close();
								dt.addToMap("mvt", mvtFile.getAbsolutePath());
							}catch(Exception e){
								e.printStackTrace();
							}
						}else{
							Object value = rs.getObject(i);
							dt.addToMap(rsmd.getColumnLabel(i), value);
						}
					}
					result.add(dt);
				}
				ps.close();
			}else{
				result = getCluster(conn, geomColumn, schema, table, filtros, zoom, totalResultados, sridTable);
				paginacion.setPage(-999);
			}
			paginacion.setSize(totalResultados);
		}catch(SQLException e){
			e.printStackTrace();
			paginacion.setError(e.getMessage());
		}finally{
			try {
				if(conn != null){
					conn.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return result;
	}
	
	@Override
	public List<String> getDomainValues(String schema, String table, String columna){
		List<String> result = new LinkedList<String>();
		Connection conn = null;
		try{
			conn = datasource.getConnection();
			StringBuilder query = new StringBuilder("SELECT distinct(" + columna + ")");
			query.append(" FROM " + schema + "." + table);
			query.append(" ORDER BY " + columna);
			PreparedStatement ps = conn.prepareStatement(query.toString());
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				result.add(rs.getString(1));
			}
			ps.close();
		}catch(SQLException e){
			e.printStackTrace();
		}
		return result;
	}
	
	private List<DatosTabla> getCluster(Connection conn, String geomColumn, String schema, String table, Map<String, List<String>> filtros, Integer zoom, Integer totalElementos, int sridTable){
		List<DatosTabla> result = new LinkedList<DatosTabla>();
		String filtroBbox = "";
		if(filtros.containsKey("bbox")){
			filtroBbox = getBboxFilter(filtros.get("bbox").get(0), "center", sridTable);
			filtros.remove("bbox");
		}
		StringBuilder query = new StringBuilder("SELECT row_number() over() as id, st_astext(st_buffer(ST_Transform(center, 3857), (elementos_cluster / ?) * ?)) as geometry,");
		query.append(" elementos_cluster, 3857 AS srid from");
		query.append(" (SELECT COUNT(*) AS elementos_cluster,");
		query.append(" ST_Centroid(ST_Collect(" + geomColumn + ")) AS center");
		query.append(" FROM " + schema + "." + table);
		query.append(sqlFilter(filtros, geomColumn, sridTable));
		query.append(" GROUP BY ST_SnapToGrid(ST_Centroid(" + geomColumn + "),  ?) ORDER BY elementos_cluster DESC) cluster");
		if(!"".equals(filtroBbox)){
			query.append(" WHERE "+filtroBbox);
		}
		try{
			PreparedStatement ps = conn.prepareStatement(query.toString());
			ps.setDouble(1, totalElementos);
			ps.setDouble(2, getMetrosBufferByZoom(zoom));
			ps.setDouble(3, getRadiusByZoom(zoom));
			ResultSet rs = ps.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData();
			while(rs.next()){
				DatosTabla dt = new DatosTabla();
				for(int i = 1; i <= rsmd.getColumnCount(); i++){
					Object value = rs.getObject(i);
					dt.addToMap(rsmd.getColumnLabel(i), value);
				}
				result.add(dt);
			}
			ps.close();
		}catch(SQLException e){
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * Obtiene el radio del cluster en funcion del zoom del mapa
	 * @param zoom
	 * @return radio
	 */
	private double getRadiusByZoom(Integer zoom){
		double radio = 1;
		if(zoom > 7 && zoom < 10){
			radio = 0.5;
		}else if (zoom >= 10 && zoom < 12){
			radio = 0.25;
		}else if(zoom >= 12){
			radio = 0.15;
		}
		return radio;
	}
	
	private double getMetrosBufferByZoom(Integer zoom){
		double buffer = 1500000;//1000 km
		if(zoom > 7 && zoom < 10){
			buffer = 750000;//750 km
		}else if (zoom >= 10 && zoom < 12){
			buffer = 100000;//500 km
		}else if(zoom >= 12){
			buffer = 20000;//100 km
		}
		return buffer;
	}
	
	/**
	 * Realiza un count de los resultados de una consulta
	 * @param conn
	 * @param query
	 * @return count
	 */
	private int getTotalResultados(Connection conn, String query){
		String countQuery = "Select count(*) FROM (" + query + ") as query";
		try{
			PreparedStatement ps = conn.prepareStatement(countQuery);
			ResultSet rs = ps.executeQuery();
			rs.next();
			int count = rs.getInt(1);
			ps.close();
			return count;
		}catch(SQLException e){
			e.printStackTrace();
		}
		return 0;
	}
	
	private Integer getGeometrySrid(Connection conn, String schema, String table, String geomColumn){
		StringBuilder query = new StringBuilder("select distinct(ST_srid("+geomColumn+")) from "+schema+"."+table);
		query.append(" where " + geomColumn + " is not null");
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(query.toString());
			ResultSet rs = ps.executeQuery();
			rs.next();
			int srid = rs.getInt(1);
			return srid;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return Constants.DEFAUL_SRID;
	}
	
	/**
	 * Obtiene el nombre de la columna que contiene geometría de una tabla
	 * @param schema
	 * @param tabla
	 * @param conn
	 * @return nombre columna
	 */
	private String getNombreColumnaGeom(String schema, String tabla, Connection conn){
		StringBuilder sql = new StringBuilder("select f_geometry_column from geometry_columns");
		sql.append(" where f_table_schema = ? and f_table_name = ?");
		sql.append(" order by f_geometry_column asc limit 1");//se limita a 1 por si tiene varias columnas geometricas
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql.toString());
			ps.setString(1, schema);
			ps.setString(2, tabla);
			ResultSet rs = ps.executeQuery();
			rs.next();
			String geomColumn = rs.getString("f_geometry_column");
			return geomColumn;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * Obtiene los nombres de las columnas no geometricas de una tabla
	 * @param conn
	 * @param schema
	 * @param tabla
	 * @param geomColumn
	 * @return
	 */
	private String getColumnasNoGeometricas(Connection conn, String schema, String tabla, String geomColumn){
		StringBuilder sql = new StringBuilder("SELECT STRING_AGG(column_name, ', ') as columnas");
		sql.append(" FROM information_schema.columns");
		sql.append(" WHERE table_schema = ?");
		sql.append(" AND table_name = ?");
		sql.append(" AND column_name != ?");
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql.toString());
			ps.setString(1, schema);
			ps.setString(2, tabla);
			ps.setString(3, geomColumn);
			ResultSet rs = ps.executeQuery();
			rs.next();
			String columnas = rs.getString("columnas");
			return columnas;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	private String customQuery(Map<String, List<String>> params, String schema, String table){
		
			String paramValue = "*";
			StringBuilder result = new StringBuilder("SELECT ");
			if(params.containsKey("select")){
				paramValue = params.get("select").get(0); 
			}
			result.append(paramValue);
			result.append(" FROM " + schema + "." + table);
			if(params.containsKey("where")){
				paramValue = params.get("where").get(0);
				if(paramValue != null && !"".equals(paramValue)){
					result.append(" WHERE ");
					result.append(paramValue.replace("*", "%"));
				}
			}
			
			if(params.containsKey("groupby")){
				paramValue = params.get("groupby").get(0);
				if(paramValue != null && !"".equals(paramValue)){
					result.append(" GROUP BY ");
					result.append(paramValue);
					
					if(params.containsKey("having")){
						paramValue = params.get("having").get(0);
						if(paramValue != null && !"".equals(paramValue)){
							result.append(" HAVING ");
							result.append(paramValue);
						}
					}
				}
			}
			
			if(params.containsKey("orderby")){
				paramValue = params.get("orderby").get(0);
				if(paramValue != null && !"".equals(paramValue)){
					result.append(" ORDER BY ");
					result.append(paramValue);
				}
			}
			
			if(params.containsKey("limit")){
				paramValue = params.get("limit").get(0);
				if(paramValue != null && !"".equals(paramValue)){
					result.append(" LIMIT ");
					result.append(paramValue);
				}
			}
			
			if(params.containsKey("offset")){
				paramValue = params.get("offset").get(0);
				if(paramValue != null && !"".equals(paramValue)){
					result.append(" OFFSET ");
					result.append(paramValue);
				}
			}
			
			return result.toString();
	}
	
	/**
	 * Monta en where de una consulta
	 * @param filtros
	 * @param geomColumn
	 * @return
	 */
	private String sqlFilter(Map<String, List<String>> filtros, String geomColumn, int sridTable){
		if(!filtros.isEmpty()){
			StringBuilder result = new StringBuilder(" WHERE ");
			Iterator<String> keyset = filtros.keySet().iterator();
			while(keyset.hasNext()){
				String key = keyset.next();
				String value = filtros.get(key).get(0);
				if("bbox".equals(key)){
					result.append(getBboxFilter(value, geomColumn, sridTable));
				}else if("busquedaGeneral".equals(key)){
					result.append(getSqlBusquedaGeneral(value));
				}else{
					result.append(key + " ilike '%" + value + "%'");
				}
				result.append(" AND ");
			}
			return result.substring(0, result.lastIndexOf("AND"));
		}
		return "";
	}
	
	private String getBboxFilter(String bbox, String geomColumn, int sridTable){
		String[] splitGeom = bbox.split("srid");
		String geomValue = splitGeom[0].replace("$", " ");
		String srid = splitGeom[1];
		StringBuilder bboxFilter = new StringBuilder("ST_Intersects("+geomColumn+", ");
		bboxFilter.append("ST_Transform(ST_geomfromtext('"+geomValue+"', "+srid+"), "+sridTable+"))");
		return bboxFilter.toString();
	}
	
	private String getSqlBusquedaGeneral(String busqueda){
		//El parametro de busqueda general viene con una secuencia de columnas
		//en la que buscar y el valor con el formato columna;columna@valor
		if(busqueda != null && busqueda.contains("@")){
			StringBuilder filter = new StringBuilder("(");
			String[] splitBsq = busqueda.split("@");
			String[] columnas = splitBsq[0].split(";");
			String value = splitBsq[1].replace("*", "%");
			for(String columna : columnas){
				filter.append(columna + " ilike '%" + value + "%'");
				filter.append(" OR ");
			}
			return filter.substring(0, filter.lastIndexOf("OR")) + ")";
		}
		return "";
	}
	
	/**
	 * Añade la paginación a la consulta sql
	 * @param paginacion
	 * @return
	 */
	private String addPaginacion(CustomPagination paginacion){
		StringBuilder result = new StringBuilder("");
		if(paginacion.getSize() > 0){
			result.append(" limit " + paginacion.getSize());
			if(paginacion.getPage() > 0){
				int offset = (paginacion.getPage()*paginacion.getSize()+1) - (paginacion.getSize()+1);
				result.append(" offset " + offset);
			}
		}
		return result.toString();
	}
	
	private PreparedStatement switchFormat(Connection conn, String formato, String query, String geomColumn, String aliasGeom, String columnas){
		PreparedStatement ps = null;
		try{
			if("wkt".equals(formato)){
				ps = conn.prepareStatement(getWKT(query, geomColumn, aliasGeom));
			}else if("geojson".equals(formato)){
				ps = conn.prepareStatement(getGeoJson(query, geomColumn));
			}else if("kml".equals(formato)){
				ps = conn.prepareStatement(getKML(query, geomColumn, columnas));
			}else if("gml".equals(formato)){
				ps = conn.prepareStatement(getGML(query, geomColumn, columnas));
			}else if("mvt".equals(formato)){
				ps = conn.prepareStatement(getMVT(query, geomColumn));
			}else{
				ps = conn.prepareStatement(getWKT(query, geomColumn, aliasGeom));
			}
		}catch(SQLException e){
			e.printStackTrace();
		}
		return ps;
	}
	
	private String getWKT(String query, String geomColumn, String aliasGeom){
		return query.replace(", ST_transform("+geomColumn+", 4326) as "+geomColumn+",", ", ST_asText(st_force2d(ST_transform("+geomColumn+", 4326))) as " + aliasGeom + ",");
	}
	
	private String getGeoJson(String query, String geomColumn){
		StringBuilder result = new StringBuilder("SELECT jsonb_build_object(");
		result.append(" 'type', 'FeatureCollection',");
		result.append(" 'features', jsonb_agg(feature))::text as geojson");
		result.append(" FROM (SELECT jsonb_build_object(");
		result.append(" 'type', 'Feature',");
		result.append(" 'geometry', ST_AsGeoJSON(row." + geomColumn + ", 9, 0)::jsonb,");
		result.append(" 'properties', to_jsonb(row) - '" + geomColumn + "'");
		result.append(" ) AS feature");
		result.append(" FROM (");
		result.append(query);
		result.append(") AS row) AS features");
		return result.toString();
	}
	
	private String getKML(String query, String geomColumn, String columnas){
		StringBuilder result = new StringBuilder(" select '"+kmlHeader+"' || string_agg(feature, '') || '"+kmlFooter+"' as kml FROM");
		result.append(" (select '<Placemark>' || ST_asKML("+geomColumn+", 15) || "+getKMLAttributes(columnas)+" || '</Placemark>' as feature FROM");
		result.append("("+query+") as query) as features");
		
		return result.toString();
	}
	
	//Solo para postgresql >= 10.0
	private String getGML(String query, String geomColumn, String columnas){
		StringBuilder result = new StringBuilder("SELECT '"+gmlHeader+"' || string_agg(feature, '') || '</sf:FeatureCollection>' as gml FROM ");
		result.append("(select '<sf:featureMember><geometry>' || ST_asGML(3, "+geomColumn+", 15, 0, null, null) || '</geometry>' "+getGMLAttributes(columnas)+" || '</sf:featureMember>' as feature");
		result.append(" FROM (" + query + ") as query) as features");
		return result.toString();
	}
	
	//Solo para Postgis >= 3.0.0
	private String getMVT(String query, String geomColumn){
		StringBuilder result = new StringBuilder("WITH mvtgeom AS(");
		result.append("SELECT ST_AsMVTGeom("+geomColumn+", ST_TileEnvelope(2, 1, 1), 3857, 256, true) AS geom");
		result.append(" FROM ("+query.replace(", ST_transform("+geomColumn+", 4326) as "+geomColumn+",", ", ST_transform(" + geomColumn + ", 3857) as " + geomColumn + ",")+") as query");
		result.append(") SELECT ST_AsMVT(mvtgeom.*, 'cnig', 3857) as mvt FROM mvtgeom");
		return result.toString();
	}
	
	private String getGMLAttributes(String columnas){
		String[] cols = columnas.split(", ");
		StringBuilder result = new StringBuilder();
		for(String c : cols){
			result.append("|| '<" + c + ">' || " + c + " || '</" + c + ">'");
		}
		return result.toString();
	}
	
	private String getKMLAttributes(String columnas){
		String[] cols = columnas.split(", ");
		StringBuilder result = new StringBuilder("'<ExtendedData>'");
		for(String c : cols){
			result.append("|| '<Data name=\"" + c + "\">' || '<value>' || " + c + " || '</value></Data>'");
		}
		result.append(" || '</ExtendedData>'");
		return result.toString();
	} 
}
