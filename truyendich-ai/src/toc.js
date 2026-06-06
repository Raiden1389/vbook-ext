load("config.js");

function execute(url) {
    url = normalizeUrl(url);
    let slug = getSlug(url);
    let edition = getEditionName(url);
    let page = 1;
    let data = [];

    while (true) {
        let json = fetchJson(apiNovelChaptersUrl(slug, edition, page, CHAPTER_PAGE_SIZE));
        if (!json || !json.items || !json.items.length) break;

        for (let i = 0; i < json.items.length; i++) {
            let item = json.items[i];
            if (!item || !item.chapter_number) continue;
            data.push({
                name: cleanText(item.title || ("Chương " + item.chapter_number)),
                url: chapterUrl(slug, item.chapter_number, edition),
                host: BASE_URL
            });
        }

        if (!nextPageToken(json)) break;
        page++;
    }

    return Response.success(data);
}
