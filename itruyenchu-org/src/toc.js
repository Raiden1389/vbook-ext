load("libs.js");

function execute(url) {
    url = absoluteUrl(url);
    var bookPage = fetch(url).text();
    var firstChapter = bookPage.match(/href="(\/truyen\/[^"]+\/chuong-\d+)"/);
    var chapterUrl = firstChapter ? absoluteUrl(firstChapter[1]) : url;

    var raw = fetch(chapterUrl).text();
    var payload = extractChapterPayload(raw);
    if (!payload) return Response.success([]);

    var slug = payload.slug || extractSlug(url) || extractSlug(chapterUrl);
    var matcher = /\{\\"title\\":\\"(.*?)\\",\\"chapterNumber\\":(\d+)\}/g;
    var data = [];
    var match;

    while ((match = matcher.exec(payload.chaptersRaw)) !== null) {
        var title = cleanText(match[1]);
        var chapterNumber = match[2];
        data.push({
            name: "Chương " + chapterNumber + (title ? ": " + title : ""),
            url: BASE_URL + "/truyen/" + slug + "/chuong-" + chapterNumber,
            host: BASE_URL
        });
    }

    if (data.length === 0) {
        matcher = /\{"title":"(.*?)","chapterNumber":(\d+)\}/g;
        while ((match = matcher.exec(payload.chaptersRaw)) !== null) {
            var fallbackTitle = cleanText(match[1]);
            var fallbackNumber = match[2];
            data.push({
                name: "Chương " + fallbackNumber + (fallbackTitle ? ": " + fallbackTitle : ""),
                url: BASE_URL + "/truyen/" + slug + "/chuong-" + fallbackNumber,
                host: BASE_URL
            });
        }
    }

    return Response.success(data);
}
