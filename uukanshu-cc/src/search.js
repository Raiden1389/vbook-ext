function execute(key, page) {
    var BASE = "https://uukanshu.cc";

    var response = fetch(BASE + "/search", {
        method: "POST",
        body: { "searchkey": key, "searchtype": "all" }
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

    return Response.success(data, null);
}
