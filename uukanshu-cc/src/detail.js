function execute(url) {
    var doc = Http.get(url).html();

    var name = doc.select(".booktitle").text();
    if (!name) name = doc.select("h1").text();

    var cover = doc.select(".bookcover img").attr("src");
    if (cover && cover.startsWith("//")) cover = "https:" + cover;

    var authorEl = doc.select(".booktag a").first();
    var author = authorEl ? authorEl.text().replace("作者：", "") : "";

    var description = doc.select(".bookintro").text();
    if (!description) description = doc.select(".book-intro dd").text();

    return Response.success({
        name: name,
        cover: cover,
        author: author,
        description: description,
        detail: "",
        host: "https://www.uukanshu.cc"
    });
}
