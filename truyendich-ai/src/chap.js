load("config.js");

function extractHtmlContent(doc) {
    let node = doc.select("#original-content-tab").first();
    if (!node) node = doc.select("section[itemprop=text]").first();
    if (!node) node = doc.select("section.prose-novel, section[itemprop=text], article section").first();
    if (!node) return "";

    let html = node.html();
    if (cleanText(html)) return html;

    let parts = [];
    node.select("p").forEach(function (p) {
        let text = cleanText(p.text());
        if (text) parts.push("<p>" + escapeHtml(text) + "</p>");
    });
    return parts.join("");
}

function execute(url) {
    let doc = fetchDocument(url);
    if (!doc) return null;

    let content = extractHtmlContent(doc);
    if (!cleanText(content)) return null;
    return Response.success(content);
}
