function execute(url, page) {
    if (!page) page = '1';

    var BASE = "https://www.uukanshu.cc";
    var fullUrl = url.startsWith("http") ? url : BASE + url;
    fullUrl = fullUrl.replace(/_\d+\.html$/, "_" + page + ".html");

    Console.log("gen.js fullUrl: " + fullUrl);

    // Try fetch first
    var doc = null;
    try {
        var response = fetch(fullUrl);
        if (response.ok) {
            var html = response.text();
            Console.log("gen.js html length: " + html.length);
            if (html.length > 1000 && html.indexOf("bookbox") > -1) {
                doc = Html.parse(html);
            }
        }
    } catch (e) {
        Console.log("gen.js fetch failed: " + e);
    }

    // Fallback to browser if fetch failed or blocked
    if (!doc) {
        Console.log("gen.js using browser fallback");
        var browser = Engine.newBrowser();
        doc = browser.launch(fullUrl, 15000);
        browser.close();
    }

    if (!doc) return Response.success([], null);

    var el = doc.select(".bookbox");
    Console.log("gen.js bookbox count: " + el.size());

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

    Console.log("gen.js results: " + data.length);
    var next = data.length > 0 ? (parseInt(page) + 1).toString() : null;
    return Response.success(data, next);
}
