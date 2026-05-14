load("config.js");

function execute(url) {
    url = normalizeUrl(url);
    var slug = getSlug(url);
    var doc = fetchDocument(url);
    if (!doc) return Response.success([]);
    var schema = parseBookSchema(doc);
    var total = parseTotalChapters(doc, schema);
    var data = [];

    if (!total) {
        var links = doc.select("a[href*='/chuong-']");
        for (var i = 0; i < links.size(); i++) {
            var href = links.get(i).attr("href");
            var name = cleanText(links.get(i).text());
            if (href && name) {
                data.push({
                    name: name,
                    url: normalizeUrl(href),
                    host: BASE_URL
                });
            }
        }
        return Response.success(data);
    }

    for (var j = 1; j <= total; j++) {
        data.push({
            name: "Chương " + j,
            url: chapterUrl(slug, j),
            host: BASE_URL
        });
    }

    return Response.success(data);
}
