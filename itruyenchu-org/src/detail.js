load("libs.js");

function execute(url) {
    url = absoluteUrl(url);

    var response = fetch(url);
    var doc = response.html();
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
    var name = doc.select("h1").text() || jsonLd.name || "";
    var cover = doc.select("meta[property=og:image]").attr("content") || jsonLd.image || "";
    var author = "";
    if (jsonLd.author && jsonLd.author.name) author = jsonLd.author.name;

    var description = jsonLd.description || "";
    description = cleanText(description);

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
    if (jsonLd.numberOfChapters) {
        detail += (detail ? "<br>" : "") + "Số chương: " + jsonLd.numberOfChapters;
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
        url: url
    });
}
