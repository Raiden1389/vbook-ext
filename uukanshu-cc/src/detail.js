function execute(url) {
    var BASE = "https://uukanshu.cc";
    if (!url.startsWith("http")) url = BASE + url;

    var doc = fetch(url + "/").html();
    if (!doc) return Response.success({ name: "", cover: "", author: "", description: "", detail: "", host: BASE });

    var info = doc.select(".bookinfo");
    var name = info.select("h1.booktitle").text() || doc.select(".booktitle").text() || doc.select("h1").text() || "";
    var cover = info.select(".thumbnail").first().attr("src") || doc.select(".bookcover img").attr("src") || "";
    if (cover && cover.startsWith("//")) cover = "https:" + cover;

    var authorEl = info.select(".booktag a.red").first() || doc.select(".booktag a").first();
    var author = authorEl ? authorEl.text().replace("作者：", "") : "";

    var description = info.select(".bookintro").text() || doc.select(".bookintro").text() || "";

    return Response.success({
        name: name,
        cover: cover,
        author: author,
        description: description,
        detail: "",
        host: BASE
    });
}
