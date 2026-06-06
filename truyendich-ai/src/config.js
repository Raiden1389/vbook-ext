var BASE_URL = "https://truyendich.ai";
var API_URL = BASE_URL + "/api";
var PAGE_SIZE = 24;
var CHAPTER_PAGE_SIZE = 200;

function normalizeUrl(url) {
    if (!url) return BASE_URL;
    if (url.indexOf("//") === 0) return "https:" + url;
    if (url.indexOf("/") === 0) return BASE_URL + url;
    if (url.indexOf("http") !== 0) return BASE_URL + "/" + url;
    return url.replace(/^https?:\/\/(www\.)?truyendich\.ai/i, BASE_URL);
}

function cleanText(text) {
    return text ? text.replace(/\s+/g, " ").trim() : "";
}

function trimSlash(text) {
    return (text || "").replace(/^\/+|\/+$/g, "");
}

function escapeHtml(text) {
    return (text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function absoluteUrl(url) {
    if (!url) return "";
    if (url.indexOf("//") === 0) return "https:" + url;
    if (url.indexOf("/") === 0) return BASE_URL + url;
    return url;
}

function fetchDocument(url) {
    let response = fetch(normalizeUrl(url));
    if (!response.ok) return null;
    return response.html();
}

function fetchJson(url) {
    let response = fetch(normalizeUrl(url), {
        headers: {
            "Accept": "application/json, text/plain, */*",
            "X-Requested-With": "XMLHttpRequest"
        }
    });
    if (!response.ok) return null;
    return response.json();
}

function getQueryParam(url, key) {
    let match = (url || "").match(new RegExp("[?&]" + key + "=([^&#]+)"));
    return match ? decodeURIComponent(match[1]) : "";
}

function getEditionName(url) {
    url = normalizeUrl(url).split("?")[0];
    if (/\/doc-truyen\/ai\//i.test(url)) return "ai";
    if (/\/doc-truyen\/cv\//i.test(url)) return "convert";
    return "translate";
}

function getEditionPrefix(edition) {
    if (edition === "ai") return "/ai";
    if (edition === "convert") return "/cv";
    return "";
}

function getSlug(url) {
    url = normalizeUrl(url).split("?")[0].replace(/\/$/, "");
    let match = url.match(/\/doc-truyen\/(?:ai\/|cv\/)?([^\/]+)/i);
    if (match) return match[1];
    match = url.match(/\/(?:the-loai|danh-sach)\/([^\/]+)/i);
    if (match) return match[1];
    let parts = url.split("/");
    return parts[parts.length - 1] || "";
}

function getChapterNumber(url) {
    let match = (url || "").match(/\/chuong-(\d+)/i);
    return match ? parseInt(match[1], 10) : 1;
}

function bookUrl(slug, edition) {
    return BASE_URL + "/doc-truyen" + getEditionPrefix(edition) + "/" + trimSlash(slug);
}

function chapterUrl(slug, chapterNumber, edition) {
    return bookUrl(slug, edition) + "/chuong-" + chapterNumber;
}

function apiNovelUrl(slug) {
    return API_URL + "/novels/" + encodeURIComponent(trimSlash(slug));
}

function apiNovelChaptersUrl(slug, edition, page, size) {
    let query = [
        "page=" + (page || 1),
        "size=" + (size || CHAPTER_PAGE_SIZE)
    ];
    if (edition) query.push("edition_type=" + encodeURIComponent(edition));
    return apiNovelUrl(slug) + "/chapters?" + query.join("&");
}

function apiCategoryListUrl(slug, page, size) {
    return API_URL + "/categories/" + encodeURIComponent(trimSlash(slug)) + "?page=" + (page || 1) + "&size=" + (size || PAGE_SIZE);
}

function apiNamedListUrl(slug, page, size) {
    return API_URL + "/lists/" + encodeURIComponent(trimSlash(slug)) + "?page=" + (page || 1) + "&size=" + (size || PAGE_SIZE);
}

function apiSearchUrl(keyword, page, size) {
    return API_URL + "/novels/search?q=" + encodeURIComponent(keyword || "") + "&page=" + (page || 1) + "&size=" + (size || 20);
}

function formatDate(input) {
    if (!input) return "";
    let text = ("" + input).replace("T", " ");
    let match = text.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return cleanText(input);
    return match[3] + "/" + match[2] + "/" + match[1];
}

function statusLabel(status) {
    status = (status || "").toLowerCase();
    if (status === "completed") return "Hoàn thành";
    if (status === "ongoing") return "Đang ra";
    if (status === "pending") return "Tạm ngưng";
    return cleanText(status);
}

function normalizeDescription(text) {
    if (!text) return "";
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    let parts = ("" + text).split(/\n+/);
    let html = [];
    for (let i = 0; i < parts.length; i++) {
        let line = cleanText(parts[i]);
        if (line) html.push("<p>" + escapeHtml(line) + "</p>");
    }
    return html.join("");
}

function pickEdition(book, preferred) {
    let editions = book && book.editions ? book.editions : [];
    let wanted = preferred || "translate";
    for (let i = 0; i < editions.length; i++) {
        if (editions[i] && editions[i].edition_name === wanted) return editions[i];
    }
    for (let j = 0; j < editions.length; j++) {
        if (editions[j] && editions[j].edition_name === "translate") return editions[j];
    }
    return editions.length ? editions[0] : null;
}

function normalizeCategories(categories) {
    if (!categories) return [];
    if (Object.prototype.toString.call(categories) === "[object Array]") return categories;
    return [categories];
}

function mapBookToCard(book) {
    if (!book || !book.slug || !book.title) return null;
    let preferredEdition = pickEdition(book, book.has_ai ? "translate" : "convert");
    let edition = preferredEdition ? preferredEdition.edition_name : (book.has_ai ? "translate" : "convert");
    let description = [];
    if (book.author) description.push("Tác giả: " + book.author);
    if (book.latest_chapter_number) description.push("Số chương: " + book.latest_chapter_number);
    if (book.view !== null && book.view !== undefined) description.push("Lượt xem: " + book.view);

    return {
        name: cleanText(book.title),
        link: bookUrl(book.slug, edition),
        cover: absoluteUrl(book.image_url),
        description: description.join(" - "),
        host: BASE_URL
    };
}

function mapBooksResponse(json) {
    let items = json && json.items ? json.items : [];
    let data = [];
    for (let i = 0; i < items.length; i++) {
        let book = mapBookToCard(items[i]);
        if (book) data.push(book);
    }
    return data;
}

function nextPageToken(json) {
    if (!json || !json.page || !json.size || !json.total) return null;
    let current = parseInt(json.page, 10);
    let size = parseInt(json.size, 10);
    let total = parseInt(json.total, 10);
    return current * size < total ? "" + (current + 1) : null;
}

function getListType(input) {
    let slug = trimSlash(input);
    if (slug.indexOf("danh-sach/") === 0) slug = slug.substring("danh-sach/".length);
    return slug;
}
