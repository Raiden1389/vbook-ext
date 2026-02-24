load("config.js");

function execute(key, page) {
    var HOST = "https://www.uukanshu.cc";
    if (!page) page = "1";

    // Search uses POST
    var searchUrl = HOST + "/search";
    var response = Http.post(searchUrl)
        .headers(HEADERS)
        .params({ "searchkey": key, "searchtype": "all" })
        .html();

    if (!response) return Response.success([], null);

    var doc = response;
    var data = [];

    var items = doc.select(".item");
    for (var i = 0; i < items.size(); i++) {
        var e = items.get(i);

        var nameEl = e.select("a").first();
        var name = nameEl ? nameEl.text() : "";
        var link = nameEl ? nameEl.attr("href") : "";

        if (link && link.startsWith("/")) {
            link = HOST + link;
        }

        var cover = "";
        var desc = "";
        var descEl = e.select("dd").last();
        if (descEl) desc = descEl.text();

        if (name && link) {
            data.push({
                name: name,
                link: link,
                cover: cover,
                description: desc,
                host: HOST
            });
        }
    }

    return Response.success(data, null);
}
