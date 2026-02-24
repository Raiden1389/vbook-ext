function execute(url, page) {
    if (!page) page = '1';
    var fullUrl = "https://www.uukanshu.cc" + url.replace(/_\d+\.html$/, "_" + page + ".html");

    var doc = Http.get(fullUrl).html();
    var el = doc.select(".item");
    var data = [];

    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var nameEl = e.select("a").first();
        data.push({
            name: nameEl ? nameEl.text() : "",
            link: nameEl ? nameEl.attr("href") : "",
            cover: "",
            description: e.select("dd").last() ? e.select("dd").last().text() : "",
            host: "https://www.uukanshu.cc"
        });
    }

    var next = data.length > 0 ? (parseInt(page) + 1).toString() : null;
    return Response.success(data, next);
}
