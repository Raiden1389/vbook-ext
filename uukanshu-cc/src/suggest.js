function execute(input, page) {
    var BASE = "https://uukanshu.cc";

    var response = fetch(BASE + input);
    if (!response.ok) return Response.success([], null);

    var doc = response.html();
    var el = doc.select(".bookbox");
    var next = doc.select(".next").first().attr("href") || null;
    var books = [];

    for (var i = 0; i < el.size(); i++) {
        var book = el.get(i);
        var nameEl = book.select(".bookname").first();
        var linkEl = book.select(".del_but").first();
        books.push({
            name: nameEl ? nameEl.text() : "",
            link: linkEl ? linkEl.attr("href") : "",
            description: book.select(".update").text() || "",
            host: BASE
        });
    }

    return Response.success(books, next);
}
