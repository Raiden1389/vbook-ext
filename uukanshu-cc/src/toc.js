load("config.js");

function execute(url) {
    var HOST = "https://www.uukanshu.cc";

    url = url.replace("http://", "https://").replace(/\/$/, "");

    var response = fetch(url, { headers: HEADERS });
    if (response.ok) {
        var doc = response.html();
        var list = [];

        // Chapters nằm trong <dl><dd><a>
        var el = doc.select("dl dd a");

        for (var i = 0; i < el.size(); i++) {
            var a = el.get(i);
            var name = a.text();
            var link = a.attr("href");

            // Kiểm tra null/rỗng
            if (link && link.length > 0) {
                if (link.startsWith("/")) {
                    link = HOST + link;
                }
                if (!name) name = "Chương " + (i + 1);

                list.push({
                    name: name,
                    url: link,
                    host: HOST
                });
            }
        }

        return Response.success(list);
    }
    return null;
}
