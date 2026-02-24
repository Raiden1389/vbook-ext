var UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

function execute(url) {
    var doc = fetch(url, { headers: { "User-Agent": UA } }).html();

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
