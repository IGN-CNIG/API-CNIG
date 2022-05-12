package es.cnig.mapea.database.utils;

public class CustomPagination {

	private int page;
	private int size;
	private String error;
	private String formato;

	public CustomPagination(int page, int size, String error, String formato) {
		this.page = page;
		this.size = size;
		this.error = error;
		this.formato = formato;
	}

	public CustomPagination() {
		this.page = 1;
		this.size = Constants.DEFAULT_PAGE_SIZE;
		this.error = "";
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public int getSize() {
		return size;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public String getFormato() {
		return formato;
	}

	public void setFormato(String formato) {
		this.formato = formato;
	}
	
}
