function execute(url) {
    var BASE = "https://www.uukanshu.cc";
    if (!url.startsWith("http")) url = BASE + url;

    var doc = null;
    try {
        var response = fetch(url);
        if (response.ok) {
            var html = response.text();
            if (html && html.length > 500) {
                doc = Html.parse(html);
            }
        }
    } catch (e) { }

    if (!doc) {
        var browser = Engine.newBrowser();
        doc = browser.launch(url, 15000);
        browser.close();
    }

    if (!doc) return Response.success("");

    doc.select(".ad_content").remove();
    doc.select("script").remove();
    doc.select("style").remove();

    var htm = doc.select("#read-content").html();
    if (!htm) htm = doc.select("#contentbox").html();
    if (!htm) htm = doc.select(".content").html();
    if (!htm) htm = "";

    htm = htm.replace(/UUkanshu\.com/gi, "");
    htm = htm.replace(/UU看書/gi, "");
    htm = htm.replace(/uukanshu/gi, "");
    htm = htm.replace(/&nbsp;/g, "");

    return Response.success(htm);
}
