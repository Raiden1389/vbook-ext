function execute(url, page) {
    if (!page) page = '1';

    var BASE = "https://uukanshu.cc";
    var fullUrl = url.startsWith("http") ? url : BASE + url;
    fullUrl = fullUrl.replace(/_\d+\.html$/, "_" + page + ".html");

    var doc = fetch(fullUrl).html();

    if (!doc) return Response.success([], null);

    var el = doc.select(".bookbox");

    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var nameEl = e.select(".bookname a").first();
        var name = nameEl ? nameEl.text() : "";
        var link = nameEl ? nameEl.attr("href") : "";
        var authorEl = e.select(".author").first();
        var author = authorEl ? authorEl.text() : "";

        if (name && link) {
            if (!link.startsWith("http")) link = BASE + link;
            data.push({
                name: name,
                link: link,
                cover: "",
                description: author,
                host: BASE
            });
        }
    }

    var next = data.length > 0 ? (parseInt(page) + 1).toString() : null;
    return Response.success(data, next);
}
