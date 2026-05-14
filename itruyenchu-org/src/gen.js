load("config.js");

function execute(input, page) {
    var current = page ? parseInt(page, 10) : 1;
    if (!current || current < 1) current = 1;
    var params = { page: current, limit: 24 };
    if (input === "latest") {
        params.sort = "createdAt";
    } else if (input === "trending_now") {
        params.sort = "totalViews";
    } else if (input && input.indexOf("/the-loai/") !== -1) {
        var parts = input.split("/");
        params.categories = parts[parts.length - 1];
    }
    var json = fetchJson(apiBooksUrl(params));
    if (!json) return Response.success([], null);
    return Response.success(mapApiBooks(json), nextPage(json, current));
}
