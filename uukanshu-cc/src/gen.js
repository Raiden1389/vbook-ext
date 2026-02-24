function execute(url, page) {
    if (!page) page = '1';
    var fullUrl = "https://www.uukanshu.cc" + url.replace(/_\d+\.html$/, "_" + page + ".html");

    var response = fetch(fullUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        }
    });

    if (!response.ok) return Response.success([], null);

    var doc = response.html();
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
            data.push({
                name: name,
                link: link,
                cover: "",
                description: author,
                host: "https://www.uukanshu.cc"
            });
        }
    }

    var next = data.length > 0 ? (parseInt(page) + 1).toString() : null;
    return Response.success(data, next);
}
