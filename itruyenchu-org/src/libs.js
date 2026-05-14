var BASE_URL = "https://itruyenchu.org";
var API_BASE_URL = "https://api.ngoctieucac.link";

function absoluteUrl(url) {
    if (!url) return BASE_URL;
    if (url.indexOf("http") === 0) return url;
    if (url.charAt(0) !== "/") url = "/" + url;
    return BASE_URL + url;
}

function extractSlug(url) {
    var match = (url || "").match(/\/truyen\/([^\/?#]+)/);
    return match ? match[1] : "";
}

function decodeUnicode(str) {
    if (!str) return "";
    return str.replace(/\\u([0-9a-fA-F]{4})/g, function (_, code) {
        return String.fromCharCode(parseInt(code, 16));
    });
}

function stripTags(str) {
    if (!str) return "";
    return str.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function cleanText(str) {
    if (!str) return "";
    return decodeUnicode(str)
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\")
        .trim();
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
    return API_BASE_URL + "/books" + (query.length ? "?" + query.join("&") : "");
}

function fetchBookList(config, page) {
    var pageNumber = parseInt(page || "1", 10);
    if (!pageNumber || pageNumber < 1) pageNumber = 1;
    var params = {
        page: pageNumber,
        limit: config.limit || 24
    };

    if (config.sortBy) params.sort = config.sortBy;
    if (config.search) params.title = config.search;
    if (config.category) params.categories = config.category;

    return fetchJson(apiBooksUrl(params));
}

function toBookItem(item) {
    var slug = item && item.slug ? item.slug : "";
    var categories = item && item.categories ? item.categories.join(", ") : "";
    var chapterLabel = item && item.currentChapter ? "Ch. " + item.currentChapter : "";
    var desc = item && item.description ? stripTags(item.description) : "";
    var detail = chapterLabel;
    if (categories) detail = detail ? detail + " | " + categories : categories;
    if (desc) detail = detail ? detail + " | " + desc : desc;

    return {
        name: item && item.title ? item.title : "",
        link: slug ? BASE_URL + "/truyen/" + slug : "",
        cover: slug ? "https://assets.itruyenchu.org/book-cover/" + slug + "/banner-small.webp" : "",
        description: detail,
        host: BASE_URL
    };
}

function nextPageToken(json, page) {
    var currentPage = parseInt(json && json.page ? json.page : page || "1", 10);
    if (!currentPage || currentPage < 1) currentPage = 1;
    return json && json.totalPages && currentPage < parseInt(json.totalPages, 10)
        ? String(currentPage + 1)
        : null;
}

function extractJsonLd(doc) {
    var scripts = doc.select("script[type=application/ld+json]");
    if (!scripts || scripts.size() === 0) return null;

    for (var i = 0; i < scripts.size(); i++) {
        var raw = scripts.get(i).html();
        if (!raw) continue;
        try {
            return JSON.parse(raw);
        } catch (e) {}
    }

    return null;
}

function extractChapterPayload(raw) {
    if (!raw) return null;

    var match = raw.match(/\\"chapters\\":\[([\s\S]*?)\],\\"bookSlug\\":\\"([^\\"]+)\\"/);
    if (!match) {
        var normalized = raw
            .replace(/\\"/g, '"')
            .replace(/\\\\u/g, "\\u")
            .replace(/\\\\/g, "\\");
        match = normalized.match(/"chapters":\[([\s\S]*?)\],"bookSlug":"([^"]+)"/);
    }
    if (!match) return null;

    return {
        chaptersRaw: match[1],
        slug: match[2]
    };
}
