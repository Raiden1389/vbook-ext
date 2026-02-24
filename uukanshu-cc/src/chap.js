var UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

function execute(url) {
    var doc = fetch(url, { headers: { "User-Agent": UA } }).html();

    doc.select(".ad_content").remove();
    doc.select("script").remove();
    doc.select("style").remove();

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
