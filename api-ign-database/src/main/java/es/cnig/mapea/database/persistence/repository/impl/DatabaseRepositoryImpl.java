package es.cnig.mapea.database.persistence.repository.impl;

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

import net.postgis.jdbc.geometry.Geometry;
import net.postgis.jdbc.geometry.GeometryBuilder;
import org.postgresql.util.PGobject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import es.cnig.mapea.database.persistence.domain.Columna;
import es.cnig.mapea.database.persistence.domain.DatosTabla;
import es.cnig.mapea.database.persistence.domain.Tabla;
import es.cnig.mapea.database.persistence.repository.DatabaseRepository;
import es.cnig.mapea.database.utils.CustomPagination;

public class DatabaseRepositoryImpl implements DatabaseRepository {
	
	private static final Logger log = LoggerFactory.getLogger(DatabaseRepositoryImpl.class);

	DataSource datasource;
	
	public DatabaseRepositoryImpl(DataSource datasource){
		this.datasource = datasource;
	}

	@Override
	public List<Tabla> getGeomTables(CustomPagination paginacion) {
		List<Tabla> result = new LinkedList<Tabla>();
		StringBuilder query = new StringBuilder("SELECT table_schema, table_name FROM information_schema.tables ");
		query.append("where table_name in ");
		query.append("(select f_table_name from geometry_columns)");
		Connection conn = null;
		try {
			conn = datasource.getConnection();
			int totalResultados = getTotalResultados(conn, query.toString());
			query.append(addPaginacion(paginacion));
			ResultSet rs = conn.prepareStatement(query.toString()).executeQuery();
			while(rs.next()){
				Tabla tabla = new Tabla();
				tabla.setSchema(rs.getString("table_schema"));
				tabla.setNombre(rs.getString("table_name"));
				result.add(tabla);
			}
			paginacion.setSize(totalResultados);
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			try {
				if(conn != null && !conn.isClosed()){
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
			paginacion.setSize(totalResultados);
		}catch(SQLException e){
			e.printStackTrace();
		}finally{
			try {
				if(conn != null && !conn.isClosed()){
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
		try{
			conn = datasource.getConnection();
			log.info("Obteniendo nombre columna geometrica");
			String geomColumn = getNombreColumnaGeom(schema, table, conn);
			log.info("Obteniendo el resto de nombres de columnas");
			String columnas = getColumnasNoGeometricas(conn, schema, table, geomColumn);
			StringBuilder query = new StringBuilder("SELECT "+ columnas);
			query.append(", ST_asText(st_force2d(" + geomColumn + ")) as geometry, ST_SRID(" + geomColumn + ") as srid");
			query.append(" FROM " + schema + "." + table);
			query.append(sqlFilter(filtros, geomColumn));
			if(geomColumn != null && !"".equals(geomColumn)){
				query.append(query.indexOf("WHERE") >= 0 ? " AND " : " WHERE ");
				query.append(geomColumn + " is not null ");
			}
			int totalResultados = getTotalResultados(conn, query.toString());
			query.append(addPaginacion(paginacion));
			log.info("Obteniendo datos");
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
			paginacion.setSize(totalResultados);
		}catch(SQLException e){
			e.printStackTrace();
		}finally{
			try {
				if(conn != null && !conn.isClosed()){
					conn.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return result;
	}
	
	private int getTotalResultados(Connection conn, String query){
		String countQuery = "Select count(*) " + query.substring(query.indexOf("FROM"));
		try{
			PreparedStatement ps = conn.prepareStatement(countQuery);
			ResultSet rs = ps.executeQuery();
			rs.next();
			return rs.getInt(1);
		}catch(SQLException e){
			e.printStackTrace();
		}
		return 0;
	}
	
	private String getNombreColumnaGeom(String schema, String tabla, Connection conn){
		StringBuilder sql = new StringBuilder("select f_geometry_column from geometry_columns");
		sql.append(" where f_table_schema = ? and f_table_name = ?");
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql.toString());
			ps.setString(1, schema);
			ps.setString(2, tabla);
			ResultSet rs = ps.executeQuery();
			rs.next();
			return rs.getString("f_geometry_column");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}
	
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
			return rs.getString("columnas");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	private String sqlFilter(Map<String, List<String>> filtros, String geomColumn){
		if(!filtros.isEmpty()){
			StringBuilder result = new StringBuilder(" WHERE ");
			Iterator<String> keyset = filtros.keySet().iterator();
			while(keyset.hasNext()){
				String key = keyset.next();
				String value = filtros.get(key).get(0);
				if("bbox".equals(key)){
					String[] splitGeom = value.split("srid");
					String geom = splitGeom[0].replace("$", " ");
					String srid = splitGeom[1];
					result.append("ST_Intersects("+geomColumn+", "
							+ "ST_Transform(ST_geomfromtext('"+geom+"', "+srid+"), ST_srid("+geomColumn+")))");
				}else{
					result.append(key + " ilike '%" + value + "%'");
				}
				result.append(" AND ");
			}
			return result.substring(0, result.lastIndexOf("AND"));
		}
		return "";
	}
	
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
}
