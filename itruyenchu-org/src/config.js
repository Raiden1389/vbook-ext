var BASE_URL = "https://itruyenchu.org";
var API_URL = "https://api.ngoctieucac.link";
var ASSET_URL = "https://assets.itruyenchu.org";

function normalizeUrl(url) {
    if (!url) return BASE_URL;
    if (url.indexOf("http") === 0) return url;
    if (url.charAt(0) === "/") return BASE_URL + url;
    return BASE_URL + "/" + url;
}

function cleanText(text) {
    return text ? (text + "").replace(/\s+/g, " ").trim() : "";
}

function stripHtml(html) {
    return html ? cleanText((html + "").replace(/<[^>]+>/g, " ")) : "";
}

function getSlug(url) {
    url = normalizeUrl(url);
    var match = url.match(/\/truyen\/([^\/?#]+)/);
    return match ? match[1] : "";
}

function getChapterNumber(url) {
    var match = (url || "").match(/\/chuong-(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
}

function bookUrl(slug) {
    return BASE_URL + "/truyen/" + slug;
}

function chapterUrl(slug, number) {
    return BASE_URL + "/truyen/" + slug + "/chuong-" + number;
}

function coverUrl(slug) {
    return ASSET_URL + "/book-cover/" + slug + "/banner-small.webp";
}

function fetchJson(url) {
    var response = fetch(url);
    if (!response || !response.ok) return null;
    try {
        return response.json();
    } catch (e) {
        try {
            return JSON.parse(response.text());
        } catch (e2) {
            return null;
        }
    }
}

function apiBooksUrl(params) {
    var query = [];
    for (var key in params) {
        if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
            query.push(key + "=" + encodeURIComponent(params[key]));
        }
    }
    return API_URL + "/books" + (query.length ? "?" + query.join("&") : "");
}

function bookDescription(book) {
    var parts = [];
    if (book.tacGia) parts.push("Tác giả: " + book.tacGia);
    if (book.currentChapter) parts.push("Số chương: " + book.currentChapter);
    if (book.isFree) parts.push("Miễn phí");
    return parts.join(" - ");
}

function mapApiBooks(json) {
    var books = json && json.data ? json.data : [];
    var data = [];
    for (var i = 0; i < books.length; i++) {
        var book = books[i];
        if (!book || !book.slug || !book.title) continue;
        data.push({
            name: book.title,
            link: bookUrl(book.slug),
            cover: book.bannerURL ? book.bannerURL : coverUrl(book.slug),
            description: bookDescription(book),
            host: BASE_URL
        });
    }
    return data;
}

function nextPage(json, page) {
    var current = page ? parseInt(page, 10) : 1;
    if (!current || current < 1) current = 1;
    if (json && json.totalPages && current < parseInt(json.totalPages, 10)) return "" + (current + 1);
    return null;
}

function fetchDocument(url) {
    var response = fetch(normalizeUrl(url));
    if (!response || !response.ok) return null;
    return response.html();
}

function parseBookSchema(doc) {
    var scripts = doc.select("script[type='application/ld+json']");
    if (!scripts || scripts.size() === 0) return null;
    for (var i = 0; i < scripts.size(); i++) {
        try {
            var json = JSON.parse(scripts.get(i).html());
            if (json && json["@type"] === "Book") return json;
        } catch (e) {}
    }
    return null;
}

function parseTotalChapters(doc, schema) {
    if (schema && schema.numberOfChapters) return parseInt(schema.numberOfChapters, 10);
    var html = doc ? doc.html() : "";
    var match = html.match(/(\d+)<!--\s*-->\s*chương/i);
    if (!match) match = html.match(/numberOfChapters"\s*:\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

function responseContent(text) {
    if (!text || !cleanText(text)) return null;
    var lines = (text + "").split(/\r?\n/);
    var html = [];
    for (var i = 0; i < lines.length; i++) {
        var line = cleanText(lines[i]);
        if (line) html.push("<p>" + line + "</p>");
    }
    return html.join("");
}
