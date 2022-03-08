package es.cnig.mapea.api;

  // Log4J
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HostConfiguration;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.io.IOUtils;

import es.cnig.mapea.bean.ProxyResponse;
import es.cnig.mapea.builder.JSBuilder;
import es.cnig.mapea.exception.InvalidResponseException;

/**
 * This class manages the request from Mapea and it acts as proxy to check
 * security and to skip the CORS limitation
 * 
 * @author Guadaltel S.A.
 */
@Path("/proxy")
@Produces("application/javascript")
public class Proxy {

	// Ticket
	private static final String AUTHORIZATION = "Authorization";
	public ServletContext context_ = null;
	private static ResourceBundle configProperties = ResourceBundle.getBundle("configuration");
	private static final String THEME_URL = configProperties.getString("mapea.theme.url");
	private static final String LEGEND_ERROR = "/img/legend-error.png";
	private static final int IMAGE_MAX_BYTE_SIZE = Integer.parseInt(configProperties.getString("max.image.size"));

  // Log4J
	private static final Log LOG = LogFactory.getLog(Proxy.class);

	/**
	 * Proxy to execute a request to specified URL using JSONP protocol to avoid the
	 * Cross-Domain restriction.
	 * 
	 * @param url        URL of the request
	 * @param op         type of mapea operation
	 * @param callbackFn function to execute as callback
	 * 
	 * @return the javascript code
	 */
	@GET
	public String proxy(@QueryParam("url") String url, @QueryParam("ticket") String ticket,
			@DefaultValue("GET") @QueryParam("method") String method, @QueryParam("callback") String callbackFn) {
		String response;
		ProxyResponse proxyResponse;
		try {
			this.checkRequest(url);
			if (method.equalsIgnoreCase("GET")) {
				proxyResponse = this.get(url, ticket);
			} else if (method.equalsIgnoreCase("POST")) {
				proxyResponse = this.post(url);
			} else {
				proxyResponse = this.error(url, "Method ".concat(method).concat(" not supported"));
			}
			this.checkResponse(proxyResponse, url);
		} catch (HttpException e) {
			// TODO Auto-generated catch block
			LOG.error(e);
			proxyResponse = this.error(url, e);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			LOG.error(e);
			proxyResponse = this.error(url, e);
		}
		response = JSBuilder.wrapCallback(proxyResponse.toJSON(), callbackFn);

		return response;
	}

	/**
	 * Proxy to execute a request to specified URL using JSONP protocol to avoid the
	 * Cross-Domain restriction.
	 * 
	 * @param url        URL of the request
	 * @param op         type of mapea operation
	 * @param callbackFn function to execute as callback
	 * 
	 * @return the javascript code
	 */
	@GET
	@Path("/image")
	public Response proxyImage(@QueryParam("url") String url) {
		Response response;
		byte[] data;
		ProxyResponse proxyResponse;

		try {
			this.checkRequest(url);
			proxyResponse = this.get(url, null);
			this.checkResponseImage(proxyResponse);
			data = proxyResponse.getData();
			Header[] headers = proxyResponse.getHeaders();
			String contentType = null;
			for (Header header : headers) {
				String headerName = header.getName();
				if (headerName.equalsIgnoreCase("content-type")) {
					contentType = header.getValue().toLowerCase();
					break;
				}
			}
			response = Response.ok(new ByteArrayInputStream(data), contentType).build();
		} catch (HttpException e) {
			LOG.error(e);
			response = Response.status(Status.BAD_REQUEST).build();
		} catch (IOException e) {
			LOG.error(e);
			response = Response.status(Status.BAD_REQUEST).build();
		} catch (InvalidResponseException e) {
			LOG.error(e);
			response = Response.ok(e.getLocalizedMessage()).status(Status.BAD_REQUEST).build();
		}

		return response;
	}

	/**
	 * Sends a GET operation request to the URL and gets its response.
	 * 
	 * @param url             URL of the request
	 * @param op              type of mapea operation
	 * @param ticketParameter user ticket
	 *
	 * @return the response of the request
	 */
	private ProxyResponse get(String url, String ticketParameter) throws HttpException, IOException {
		ProxyResponse response = new ProxyResponse();
		HttpClient client = new HttpClient();
		GetMethod httpget = new GetMethod(url);
		String proxyHost = configProperties.getString("proxy.host");
		String proxPort = configProperties.getString("proxy.port");
		if (proxyHost.length() > 0 && proxPort.length() > 0) {
			HostConfiguration configuration = client.getHostConfiguration();
			configuration.setProxy(proxyHost, Integer.parseInt(proxPort));
		}
		// sets ticket if the user specified one
		if (ticketParameter != null) {
		}

		client.executeMethod(httpget);

		int statusCode = httpget.getStatusCode();
		response.setStatusCode(statusCode);
		if (statusCode == HttpStatus.SC_OK) {
			String encoding = this.getResponseEncoding(httpget);
			if (encoding == null) {
				encoding = "UTF-8";
			}
			InputStream responseStream = httpget.getResponseBodyAsStream();
			byte[] data = IOUtils.toByteArray(responseStream);
			response.setData(data);
			String responseContent = new String(data, encoding);
			response.setContent(responseContent);
		}
		response.setHeaders(httpget.getResponseHeaders());
		return response;
	}

	/**
	 * Sends a POST operation request to the URL and gets its response.
	 * 
	 * @param url URL of the request
	 * @param op  type of mapea operation
	 *
	 * @return the response of the request
	 */
	private ProxyResponse post(String url) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * Checks if the request and the operation are valid.
	 * 
	 * @param url URL of the request
	 * @param op  type of mapea operation
	 */
	private void checkRequest(String url) {
		// TODO comprobar
	}

	/**
	 * Checks if the response is valid for tthe operation and the URL.
	 * 
	 * @param proxyResponse response got from the request
	 * @param url           URL of the request
	 * @param op            type of mapea operation
	 */
	private void checkResponse(ProxyResponse proxyResponse, String url) {
		// TODO Auto-generated method stub
	}

	/**
	 * Checks if the response image is valid .
	 * 
	 * @param proxyResponse response got from the request
	 * @throws InvalidResponseException
	 */
	private void checkResponseImage(ProxyResponse proxyResponse) throws InvalidResponseException {
		Header[] headers = proxyResponse.getHeaders();
		String contentType = null;
		Integer contentLength = null;

		for (Header header : headers) {
			String headerName = header.getName();
			if (headerName.equalsIgnoreCase("content-type")) {
				contentType = header.getValue().toLowerCase();
			}
			if (headerName.equalsIgnoreCase("content-length")) {
				contentLength = Integer.parseInt(header.getValue());
			}
		}

		if (contentType == null) {
			LOG.error("El content-type está vacío.");
			throw new InvalidResponseException("El content-type está vacío.");
		}

		if (!contentType.startsWith("image/")) {
			LOG.error("El recurso no es de tipo imagen.");
			throw new InvalidResponseException("El recurso no es de tipo imagen.");
		}

		if (contentLength == null) {
			LOG.error("El content-length está vacío.");
			throw new InvalidResponseException("El content-length está vacío.");
		}
		if (Proxy.IMAGE_MAX_BYTE_SIZE < contentLength) {
			LOG.error("El recurso excede el tamaño permitido");
			throw new InvalidResponseException("El recurso excede el tamaño permitido");
		}

	}

	/**
	 * Creates a response error using the specified message.
	 * 
	 * @param url     URL of the request
	 * @param message message of the error
	 */
	private ProxyResponse error(String url, String message) {
		ProxyResponse proxyResponse = new ProxyResponse();
		proxyResponse.setError(true);
		proxyResponse.setErrorMessage(message);
		LOG.error(message);
		return proxyResponse;
	}

	/**
	 * Creates a response error using the specified exception.
	 * 
	 * @param url       URL of the request
	 * @param exception Exception object
	 */
	private ProxyResponse error(String url, Exception exception) {
		LOG.error(exception.getLocalizedMessage());
		return error(url, exception.getLocalizedMessage());
	}

	/**
	 * Gets the encoding of a response
	 */
	private String getResponseEncoding(GetMethod httpget) {
		String regexp = ".*charset\\=([^;]+).*";
		Boolean isCharset = null;
		String encoding = null;
		Header[] headerResponse = httpget.getResponseHeaders("Content-Type");
		for (Header header : headerResponse) {
			String contentType = header.getValue();
			if (!contentType.isEmpty()) {
				isCharset = Pattern.matches(regexp, contentType);
				if (isCharset) {
					encoding = contentType.replaceAll(regexp, "$1");
					break;
				}
			}
		}
		return encoding;
	}
}
