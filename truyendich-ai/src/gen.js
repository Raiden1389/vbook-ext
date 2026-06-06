load("config.js");

function execute(input, page) {
    let current = page ? parseInt(page, 10) : 1;
    let url = "";
    let normalized = trimSlash(input || "");

    if (normalized.indexOf("the-loai/") === 0) {
        url = apiCategoryListUrl(getSlug(normalized), current, PAGE_SIZE);
    } else if (normalized.indexOf("danh-sach/") === 0) {
        url = apiNamedListUrl(getListType(normalized), current, PAGE_SIZE);
    } else {
        return null;
    }

    let json = fetchJson(url);
    if (!json) return null;
    return Response.success(mapBooksResponse(json), nextPageToken(json));
}
