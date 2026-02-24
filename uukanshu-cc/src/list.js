load("config.js");

function execute(url, page) {
    var HOST = "https://www.uukanshu.cc";
    if (!page) page = "1";

    // URL pattern: /class_1_1.html -> /class_1_{page}.html
    var fullUrl = HOST + url.replace(/_\d+\.html$/, "_" + page + ".html");

    var response = fetch(fullUrl, { headers: HEADERS });
    if (response.ok) {
        var doc = response.html();
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

            // Cover from og:image on detail page - skip here
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

        // Next page
        var nextPage = null;
        var pageNum = parseInt(page);
        if (data.length > 0) {
            nextPage = (pageNum + 1).toString();
        }

        return Response.success(data, nextPage);
    }
    return Response.success([], null);
}
