load("config.js");

function fetchText(url) {
    let response = fetch(normalizeUrl(url));
    if (!response.ok) return "";
    return response.text();
}

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

function decodeJsonString(text) {
    try {
        return JSON.parse('"' + text + '"');
    } catch (e) {
        return "";
    }
}

function extractFromNextFlight(raw) {
    if (!raw) return "";
    let match = raw.match(/1c:T[0-9A-Fa-f]+,\"]\)<\/script><script>self\.__next_f\.push\(\[1,\"([\s\S]*?)\"\]\)<\/script>/);
    if (!match || !match[1]) return "";

    let text = decodeJsonString(match[1]);
    if (!cleanText(text)) return "";

    let parts = text.split(/\n+/);
    let html = [];
    for (let i = 0; i < parts.length; i++) {
        let line = cleanText(parts[i]);
        if (line) html.push("<p>" + escapeHtml(line) + "</p>");
    }
    return html.join("");
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
    let raw = fetchText(url);
    let content = extractFromNextFlight(raw);
    if (cleanText(content)) return Response.success(content);

    let doc = fetchDocument(url);
    content = extractHtmlContent(doc);
    if (!cleanText(content) || looksLikeChallenge(doc)) {
        doc = openWithBrowser(url);
        content = extractHtmlContent(doc);
    }
    if (!doc) return null;
    if (!cleanText(content)) return null;
    return Response.success(content);
}
