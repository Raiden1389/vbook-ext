function execute(url) {
    var doc = Http.get(url).html();
    doc.select(".ad_content").remove();
    doc.select("script").remove();

    var htm = doc.select("#contentbox").html();
    if (!htm) htm = doc.select("#bookContent").html();
    if (!htm) htm = doc.select(".readcotent").html();

    if (htm) {
        htm = htm.replace(/[UＵ][UＵ]\s*看书/gi, "");
        htm = htm.replace(/uukanshu/gi, "");
        htm = htm.replace(/&nbsp;/g, "");
    }

    return Response.success(htm);
}
