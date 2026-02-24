var UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

function execute(url) {
    var doc = fetch(url, { headers: { "User-Agent": UA } }).html();

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
