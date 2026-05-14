load("libs.js");

function execute(key, page) {
    var query = key ? String(key).trim() : "";
    if (!query) return Response.success([], null);

    var data = fetchBookList({ search: query, sortBy: "createdAt" }, page);
    if (!data || !data.data) return Response.success([], null);

    var books = [];
    for (var i = 0; i < data.data.length; i++) {
        books.push(toBookItem(data.data[i]));
    }

    var currentPage = parseInt(data.page || page || "1", 10);
    if (!currentPage || currentPage < 1) currentPage = 1;
    var next = currentPage < (data.totalPages || 0) ? String(currentPage + 1) : null;

    return Response.success(books, next);
}
