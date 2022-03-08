package es.cnig.mapea.database.utils;

public class CustomPagination {

	private int page;
	private int size;

	public CustomPagination(int page, int size) {
		this.page = page;
		this.size = size;
	}

	public CustomPagination() {
		this.page = 1;
		this.size = Constants.DEFAULT_PAGE_SIZE;
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
}
