load("config.js");

function execute(url) {
    url = normalizeUrl(url);

    var doc = fetch(url).html();
    if (!doc) return Response.success("");

    doc.select("script").remove();
    doc.select("style").remove();

    var paragraphs = doc.select(".content p");
    if (!paragraphs || paragraphs.size() === 0) paragraphs = doc.select("p[data-line]");
    if (!paragraphs || paragraphs.size() === 0) return Response.success("");

    var html = "";
    for (var i = 0; i < paragraphs.size(); i++) {
        var text = paragraphs.get(i).text() || "";
        text = text.replace(/\s+/g, " ").trim();
        if (!text) continue;
        if (text.indexOf("Vui lòng đăng nhập để xem nội dung chương này.") >= 0) break;
        html += "<p>" + text + "</p>";
    }

    return Response.success(html);
}
