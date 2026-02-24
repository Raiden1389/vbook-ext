function execute(key, page) {
    var doc = Http.post("https://www.uukanshu.cc/search")
        .params({ "searchkey": key, "searchtype": "all" })
        .html();

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

    return Response.success(data, null);
}
