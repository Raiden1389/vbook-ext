load("libs.js");

function execute(key, page) {
    var query = key ? String(key).trim() : "";
    if (!query) return Response.success([], null);

    var data = fetchBookList({ search: query, limit: 24 }, page);
    if (!data || !data.data) return Response.success([], null);

    var books = [];
    for (var i = 0; i < data.data.length; i++) {
        books.push(toBookItem(data.data[i]));
    }

    return Response.success(books, nextPageToken(data, page));
}
