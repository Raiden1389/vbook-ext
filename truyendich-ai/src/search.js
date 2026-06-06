load("config.js");

function execute(key, page) {
    let current = page ? parseInt(page, 10) : 1;
    let json = fetchJson(apiSearchUrl(key || "", current, 20));
    if (!json) return null;
    return Response.success(mapBooksResponse(json), nextPageToken(json));
}
