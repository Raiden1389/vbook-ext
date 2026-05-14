load("config.js");

function execute(url) {
    url = normalizeUrl(url);
    var slug = getSlug(url);
    var doc = fetchDocument(url);
    if (!doc) {
        return Response.success({
            name: "",
            cover: "",
            author: "",
            description: "",
            detail: "",
            host: BASE_URL
        });
    }

    var jsonLd = extractJsonLd(doc) || {};
    var name = cleanText(doc.select("h1").text()) || jsonLd.name || "";
    var cover = doc.select("meta[property=og:image]").attr("content") || jsonLd.image || coverUrl(slug);
    var author = "";
    if (jsonLd.author && jsonLd.author.name) author = jsonLd.author.name;

    var description = jsonLd.description || "";
    description = responseContent(description) || "";
    var intro = doc.select("article p, .space-y-2 p, .h-72 p");
    if (intro && intro.size() > 0) {
        var parts = [];
        for (var k = 0; k < intro.size(); k++) {
            var text = cleanText(intro.get(k).text());
            if (text) parts.push("<p>" + text + "</p>");
        }
        if (parts.length > 0) description = parts.join("");
    }

    var tags = [];
    if (jsonLd.genre && jsonLd.genre.length) {
        for (var i = 0; i < jsonLd.genre.length; i++) {
            if (jsonLd.genre[i]) tags.push(jsonLd.genre[i]);
        }
    } else {
        var tagEls = doc.select("a[href*='/the-loai/']");
        for (var j = 0; j < tagEls.size(); j++) {
            var tagName = tagEls.get(j).text();
            if (tagName) tags.push(tagName);
        }
    }

    var detail = "";
    if (tags.length) detail += tags.join("<br>");
    var total = parseTotalChapters(doc, jsonLd);
    if (total) {
        detail += (detail ? "<br>" : "") + "Số chương: " + total;
    }
    if (jsonLd.dateModified) {
        detail += (detail ? "<br>" : "") + "Cập nhật: " + jsonLd.dateModified;
    }

    return Response.success({
        name: name,
        cover: cover,
        author: author,
        description: description,
        detail: detail,
        host: BASE_URL,
        url: url,
        ongoing: true
    });
}
