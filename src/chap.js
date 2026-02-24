load("config.js");

function execute(url) {
    url = url.replace("http://", "https://");

    var response = fetch(url, { headers: HEADERS });
    if (response.ok) {
        var doc = response.html();

        // Xóa quảng cáo/rác
        doc.select(".ad_content").remove();
        doc.select("script").remove();
        doc.select("ins").remove();

        // Nội dung chương — thử nhiều selector
        var content = doc.select("#contentbox").html();
        if (!content) content = doc.select("#bookContent").html();
        if (!content) content = doc.select(".readcotent").html();

        if (content) {
            // Clean watermarks & ads
            content = content
                .replace(/[UＵ][UＵ]\s*看书/gi, "")
                .replace(/www\.uukanshu\.(com|cc|net)/gi, "")
                .replace(/uukanshu\.(com|cc|net)/gi, "")
                .replace(/请收藏本站/g, "")
                .replace(/最新章节/g, "")
                .replace(/手机阅读/g, "")
                .replace(/&nbsp;/g, " ")
                .replace(/\(本章完\)/g, "")
                .replace(/（本章完）/g, "");

            return Response.success(content);
        }
    }
    return null;
}
