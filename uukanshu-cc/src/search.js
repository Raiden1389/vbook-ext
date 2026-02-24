function execute(key, page) {
    var doc = fetch("https://www.uukanshu.cc/search", {
        method: "POST",
        body: { "searchkey": key, "searchtype": "all" }
    }).html();

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

    return Response.success(data, null);
}
