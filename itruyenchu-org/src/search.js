load("config.js");

function execute(key, page) {
    var query = key ? cleanText(key) : "";
    if (!query) return Response.success([], null);
    var current = page ? parseInt(page, 10) : 1;
    if (!current || current < 1) current = 1;
    var json = fetchJson(apiBooksUrl({ title: query, page: current, limit: 24 }));
    if (!json) return Response.success([], null);
    return Response.success(mapApiBooks(json), nextPage(json, current));
}
