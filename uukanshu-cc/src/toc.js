function execute(url) {
    var doc = Http.get(url).html();

    var el = doc.select("#list-chapterAll dd a");
    if (el.size() == 0) el = doc.select(".chapterlist dd a");
    if (el.size() == 0) el = doc.select("dd a");

    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.attr("href"),
            host: "https://www.uukanshu.cc"
        });
    }

    return Response.success(data);
}
