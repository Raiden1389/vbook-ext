function execute(url) {
    var doc = Http.get(url).html();

    return Response.success({
        name: doc.select('meta[property="og:title"]').attr("content"),
        cover: doc.select('meta[property="og:image"]').attr("content"),
        author: doc.select('meta[property="og:novel:author"]').attr("content"),
        description: doc.select('meta[property="og:description"]').attr("content"),
        detail: doc.select('meta[property="og:novel:category"]').attr("content") + '<br>' + doc.select('meta[property="og:novel:status"]').attr("content"),
        host: "https://www.uukanshu.cc"
    });
}
