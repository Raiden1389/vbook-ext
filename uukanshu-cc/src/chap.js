function execute(url) {
    var doc = Http.get(url).html();

    doc.select(".ad_content").remove();
    doc.select("script").remove();
    doc.select("style").remove();
    doc.select(".read_btn").remove();
    doc.select(".chapter_Turnpage").remove();
    doc.select(".read-title").remove();

    var htm = doc.select("#read-content").html();
    if (!htm) htm = doc.select("#contentbox").html();
    if (!htm) htm = doc.select(".content").html();

    if (htm) {
        htm = htm.replace(/UUkanshu\.com/gi, "");
        htm = htm.replace(/UU看書/gi, "");
        htm = htm.replace(/uukanshu/gi, "");
        htm = htm.replace(/&nbsp;/g, "");
    }

    return Response.success(htm);
}
