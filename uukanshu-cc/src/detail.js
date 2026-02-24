function execute(url) {
    var BASE = "https://www.uukanshu.cc";
    url = url.replace("://uukanshu.cc", "://www.uukanshu.cc");
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

    if (!doc) return Response.success({ name: "", cover: "", author: "", description: "", detail: "", host: BASE });

    var name = doc.select(".booktitle").text() || doc.select("h1").text() || "";
    var cover = doc.select(".bookcover img").attr("src") || "";
    if (cover && cover.startsWith("//")) cover = "https:" + cover;

    var authorEl = doc.select(".booktag a").first();
    var author = authorEl ? authorEl.text().replace("作者：", "") : "";

    var description = doc.select(".bookintro").text() || doc.select(".book-intro dd").text() || "";

    return Response.success({
        name: name,
        cover: cover,
        author: author,
        description: description,
        detail: "",
        host: BASE
    });
}
