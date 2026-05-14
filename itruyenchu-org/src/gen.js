load("libs.js");

function execute(input, page) {
    var currentPage = page ? parseInt(page, 10) : 1;
    if (!currentPage || currentPage < 1) currentPage = 1;

    var config = { limit: 24 };
    if (input === "latest") {
        config.sortBy = "createdAt";
    } else if (input === "trending_now") {
        config.sortBy = "totalViews";
    } else if (input && input.indexOf("/the-loai/") === 0) {
        config.category = input.split("/").pop();
    }

    var data = fetchBookList(config, page);
    if (!data || !data.data) return Response.success([], null);

    var books = [];
    for (var i = 0; i < data.data.length; i++) {
        books.push(toBookItem(data.data[i]));
    }

    return Response.success(books, nextPageToken(data, currentPage));
}
