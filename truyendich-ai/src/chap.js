load("config.js");

function openWithBrowser(url) {
    var browser = Engine.newBrowser();
    try {
        return browser.launch(url, 20000);
    } finally {
        browser.close();
    }
}

function looksLikeChallenge(doc) {
    if (!doc) return true;
    let html = doc.html();
    if (!html) return true;
    if (html.indexOf("cdn-cgi/challenge-platform") !== -1) return true;
    if (html.indexOf("Checking your browser") !== -1) return true;
    if (html.indexOf("Just a moment") !== -1) return true;
    return false;
}

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
    let content = extractHtmlContent(doc);
    if (!cleanText(content) || looksLikeChallenge(doc)) {
        doc = openWithBrowser(url);
        content = extractHtmlContent(doc);
    }
    if (!doc) return null;
    if (!cleanText(content)) return null;
    return Response.success(content);
}
