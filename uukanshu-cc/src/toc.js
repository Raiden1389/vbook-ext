function execute(url) {
    var BASE = "https://uukanshu.cc";
    if (!url.startsWith("http")) url = BASE + url;

    var response = fetch(url + "/");
    var doc = response.html();

    if (!doc) return Response.success([]);

    var el = doc.select("#list-chapterAll div dd a");
    if (!el || el.size() == 0) el = doc.select("#list-chapterAll dd a");
    if (!el || el.size() == 0) el = doc.select(".chapterlist dd a");
    if (!el || el.size() == 0) el = doc.select("dd a");

    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var href = e.attr("href") || "";
        if (!href.startsWith("http")) href = BASE + href;
        data.push({
            name: e.text() || "",
            url: href,
            host: BASE
        });
    }

    return Response.success(data);
}
