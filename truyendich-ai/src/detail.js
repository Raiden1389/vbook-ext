load("config.js");

function execute(url) {
    url = normalizeUrl(url);
    let slug = getSlug(url);
    let preferredEdition = getEditionName(url);
    let book = fetchJson(apiNovelUrl(slug));
    let doc = fetchDocument(bookUrl(slug, preferredEdition));
    if (!book && !doc) return null;

    let edition = pickEdition(book, preferredEdition);
    let title = book && book.title ? cleanText(book.title) : cleanText(doc.select("h1").first().text());
    let author = book && book.author ? cleanText(book.author) : "";
    if (!author && doc) author = cleanText(doc.select("p.uppercase").last().text());

    let cover = book && book.image_url ? absoluteUrl(book.image_url) : "";
    if (!cover && doc) {
        let img = doc.select("img[alt]").first();
        cover = img ? absoluteUrl(img.attr("src")) : "";
    }

    let description = "";
    if (edition && edition.description) description = normalizeDescription(edition.description);
    if (!description && book && book.description) description = normalizeDescription(book.description);
    if (!description && doc) {
        let paragraphs = doc.select("section:contains(Giới thiệu truyện) p");
        if (paragraphs && paragraphs.size() > 0) {
            let parts = [];
            paragraphs.forEach(function (p) {
                let text = cleanText(p.text());
                if (text) parts.push("<p>" + escapeHtml(text) + "</p>");
            });
            description = parts.join("");
        }
    }

    let genres = [];
    let categories = normalizeCategories(book ? book.categories : null);
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        if (!category || !category.slug || !category.name) continue;
        genres.push({
            title: cleanText(category.name),
            input: "/the-loai/" + category.slug,
            script: "gen.js"
        });
    }

    let detail = [];
    if (author) detail.push("<b>Tác giả:</b> " + escapeHtml(author));
    if (book && book.latest_chapter_number) detail.push("<b>Số chương:</b> " + book.latest_chapter_number);
    if (book && book.updated_at) detail.push("<b>Cập nhật:</b> " + formatDate(book.updated_at));
    if (book && book.status) detail.push("<b>Trạng thái:</b> " + statusLabel(book.status));
    if (edition && edition.edition_name) {
        let label = edition.edition_name === "translate" ? "Dịch" : (edition.edition_name === "ai" ? "Dịch AI" : "Convert");
        detail.push("<b>Phiên bản:</b> " + label);
    }

    return Response.success({
        name: title,
        cover: cover,
        author: author,
        description: description,
        detail: detail.join("<br>"),
        host: BASE_URL,
        genres: genres,
        ongoing: !book || (book.status !== "completed")
    });
}
