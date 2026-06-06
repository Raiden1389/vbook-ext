load("config.js");

function execute() {
    let genres = fetchJson(API_URL + "/categories");
    if (!genres) return null;

    let data = [];
    for (let i = 0; i < genres.length; i++) {
        let genre = genres[i];
        if (!genre || !genre.slug || !genre.name) continue;
        data.push({
            title: cleanText(genre.name),
            input: "/the-loai/" + genre.slug,
            script: "gen.js"
        });
    }
    return Response.success(data);
}
