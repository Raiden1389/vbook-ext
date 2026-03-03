function execute(url) {
    var BASE = "https://uukanshu.cc";
    if (!url.startsWith("http")) url = BASE + url;

    var response = fetch(url);
    var doc = response.html();

    if (!doc) return Response.success("");

    doc.select(".ad_content").remove();
    doc.select("script").remove();
    doc.select("style").remove();

    var htm = doc.select(".readcotent").html();
    if (!htm) htm = doc.select("#read-content").html();
    if (!htm) htm = doc.select("#contentbox").html();
    if (!htm) htm = doc.select(".content").html();
    if (!htm) htm = "";

    htm = htm.replace(/UUkanshu\.com/gi, "");
    htm = htm.replace(/UU看書/gi, "");
    htm = htm.replace(/uukanshu/gi, "");
    htm = htm.replace(/&nbsp;/g, "");

    return Response.success(htm);
}
