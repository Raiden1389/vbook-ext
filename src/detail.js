load("config.js");

function execute(url) {
    url = url.replace("http://", "https://").replace(/\/$/, "");

    var response = fetch(url, { headers: HEADERS });
    if (response.ok) {
        // UTF-8 — dùng html() mặc định
        var doc = response.html();

        // Lấy dữ liệu từ Meta Tag (ổn định, không phụ thuộc layout)
        var name = doc.select('meta[property="og:title"]').attr("content");
        var cover = doc.select('meta[property="og:image"]').attr("content");
        var author = doc.select('meta[property="og:novel:author"]').attr("content");
        var type = doc.select('meta[property="og:novel:category"]').attr("content");
        var status = doc.select('meta[property="og:novel:status"]').attr("content");
        var updateTime = doc.select('meta[property="og:novel:update_time"]').attr("content");
        var latestChap = doc.select('meta[property="og:novel:latest_chapter_name"]').attr("content");
        var description = doc.select('meta[property="og:description"]').attr("content");

        // Xử lý ảnh bìa thiếu protocol
        if (cover && cover.startsWith("//")) {
            cover = "https:" + cover;
        }

        // Fallback: nếu meta không có, lấy từ DOM
        if (!name) name = doc.select("h1").text();
        if (!author) author = doc.select('a.red[title^="作者"]').text();
        if (!description) description = doc.select(".book-intro").text();
        if (!cover) {
            cover = doc.select(".bookcover img").attr("src");
            if (cover && cover.startsWith("//")) cover = "https:" + cover;
        }

        // Đảm bảo không null
        if (!name) name = "";
        if (!author) author = "";
        if (!description) description = "";
        if (!cover) cover = "";

        var ongoing = status ? status.indexOf("連載") !== -1 : true;

        var detailInfo = "作者: " + author + "<br>類別: " + type + "<br>狀態: " + status + "<br>更新: " + updateTime + "<br>最新: " + latestChap;

        return Response.success({
            name: name,
            cover: cover,
            host: "https://www.uukanshu.cc",
            author: author,
            description: description,
            detail: detailInfo,
            ongoing: ongoing
        });
    }
    return null;
}
