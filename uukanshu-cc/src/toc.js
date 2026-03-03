function execute(url) {
    var BASE = "https://www.uukanshu.cc";
    // Site migrated /book/ID → /b/ID/
    url = url.replace(/\/book\/(\d+)/, "/b/$1/");
    if (!url.startsWith("http")) url = BASE + url;

    var doc = null;
    try {
        var response = fetch(url);
        if (response.ok) {
            var html = response.text();
            if (html && html.length > 500) {
                doc = Html.parse(html);
            }
        }
    } catch (e) { }

    if (!doc) {
        var browser = Engine.newBrowser();
        doc = browser.launch(url, 15000);
        browser.close();
    }

    if (!doc) return Response.success([]);

    var el = doc.select("#list-chapterAll dd a");
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
