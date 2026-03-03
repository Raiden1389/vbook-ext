# 📖 VBook Plugin Development Guide

> **Tài liệu tham khảo cho ae Raiden** — Tổng hợp từ nghiên cứu plugin TuanHai03, Đường đen, và kinh nghiệm debug uukanshu.cc extension.
>
> Cập nhật: 2026-03-03

---

## 📁 Cấu Trúc Thư Mục

```
my-plugin/
├── plugin.json          # Metadata + khai báo scripts
├── icon.png             # Icon hiển thị trong VBook (PNG, ~128x128)
├── plugin.zip           # File zip chứa tất cả (build output)
└── src/
    ├── config.js        # [Optional] Remote config — BASE_URL
    ├── home.js          # Trang chủ — danh sách sections
    ├── genre.js         # Thể loại — danh sách categories
    ├── gen.js           # List books — render từ URL trả về
    ├── detail.js        # Chi tiết truyện
    ├── toc.js           # Mục lục chương
    ├── chap.js          # Nội dung chương
    ├── search.js        # Tìm kiếm
    ├── suggest.js       # [Optional] Gợi ý (cùng tác giả, liên quan)
    ├── rank.js          # [Optional] Bảng xếp hạng
    └── test.json        # [Optional] Test URLs cho từng script
```

---

## 📋 plugin.json — Cấu Hình Plugin

```json
{
  "metadata": {
    "name": "uukanshu_cc",
    "author": "Raiden",
    "version": 14,
    "source": "https://uukanshu.cc",
    "regexp": "(www\\.)?uukanshu\\.cc/book/\\d+",
    "description": "uukanshu.cc chinese novel",
    "locale": "zh_CN",
    "language": "javascript",
    "type": "chinese_novel"
  },
  "script": {
    "home": "home.js",
    "genre": "genre.js",
    "detail": "detail.js",
    "toc": "toc.js",
    "chap": "chap.js",
    "search": "search.js"
  },
  "config": {
    "thread_num": 1,
    "delay": 3000
  }
}
```

### Giải thích các field:

| Field | Mô tả |
|-------|--------|
| `name` | Tên unique cho plugin (dùng trong code) |
| `author` | Tên tác giả |
| `version` | Số version (integer), bump mỗi lần update |
| `source` | URL gốc của trang web nguồn |
| `regexp` | Regex match URL truyện — VBook dùng để detect plugin khi paste URL |
| `description` | Mô tả ngắn |
| `locale` | Ngôn ngữ: `zh_CN`, `vi_VN`, `en_US`, `ja_JP`... |
| `language` | Luôn là `"javascript"` |
| `type` | Loại nội dung: `"chinese_novel"`, `"novel"`, `"comic"` |
| `config.thread_num` | Số thread song song khi crawl (1 = an toàn nhất) |
| `config.delay` | Delay giữa các request (ms) — chống bị block |

### Repo plugin.json (outer — cho danh sách extension):

```json
{
  "metadata": {
    "author": "Raiden",
    "description": "Raiden VBook Extensions"
  },
  "data": [
    {
      "name": "uukanshu_cc",
      "author": "Raiden",
      "path": "https://raw.githubusercontent.com/USER/REPO/master/uukanshu-cc/plugin.zip",
      "version": 14,
      "source": "https://uukanshu.cc",
      "icon": "https://raw.githubusercontent.com/USER/REPO/master/uukanshu-cc/icon.png",
      "description": "uukanshu.cc chinese novel",
      "type": "chinese_novel",
      "locale": "zh_CN"
    }
  ]
}
```

> **Note:** VBook tải plugin.zip từ `path` URL. Khi update, phải bump `version` ở CẢ inner lẫn outer plugin.json.

---

## 🔧 VBook SDK — API & Functions

VBook cung cấp runtime với các global objects. **Đây KHÔNG phải browser JS** — là engine riêng.

### `fetch(url, options?)` — HTTP Request

```js
// GET đơn giản
var response = fetch("https://example.com/page");

// POST với body
var response = fetch("https://example.com/search", {
    method: "POST",
    headers: { "User-Agent": "..." },
    body: { "key": "value" }
});
```

**Response object:**

| Property/Method | Mô tả |
|-----------------|--------|
| `response.ok` | `true` nếu status 200-299 |
| `response.text()` | Trả về string (raw text) |
| `response.html()` | ⭐ **Parse HTML tự động, trả về Document object** |

> ⚠️ **QUAN TRỌNG:** Luôn dùng `response.html()` thay vì `response.text()` + `Html.parse()`.
> Method `.html()` xử lý charset (GBK, GB2312) tự động và ổn định hơn.

### `Html.parse(htmlString)` — Parse HTML thủ công

```js
var doc = Html.parse("<html><body>...</body></html>");
```

> Chỉ dùng khi đã có HTML string (ví dụ từ `response.text()`). Ưu tiên `response.html()`.

### `doc.select(cssSelector)` — CSS Selector (JSoup)

```js
var el = doc.select(".bookname a");        // Select elements
var text = doc.select("h1").text();         // Get text content
var href = doc.select("a").attr("href");    // Get attribute
var html = doc.select(".content").html();   // Get inner HTML
var first = doc.select("a").first();        // First element
var size = doc.select("li").size();         // Count elements
```

**Iteration:**
```js
var items = doc.select(".bookbox");
for (var i = 0; i < items.size(); i++) {
    var e = items.get(i);
    var name = e.select(".bookname").text();
}

// Hoặc dùng forEach (nếu VBook hỗ trợ):
items.forEach(function(e) {
    // ...
});
```

**DOM Manipulation:**
```js
doc.select("script").remove();           // Xóa elements
doc.select(".ad_content").remove();
```

### `Engine.newBrowser()` — Headless Browser (Fallback)

```js
var browser = Engine.newBrowser();
var doc = browser.launch(url, 15000);  // URL, timeout ms
browser.close();                        // PHẢI close!
```

> Dùng khi site cần JavaScript render hoặc vượt Cloudflare.
> Chậm hơn `fetch()` nhiều lần. Chỉ dùng làm fallback.

### `Response.success(data, nextPage?)` — Trả kết quả

```js
// Trả object (detail)
return Response.success({ name: "...", cover: "..." });

// Trả array (list books)
return Response.success(books, nextPageToken);

// Trả string (chapter content)
return Response.success(htmlContent);

// Trả array rỗng
return Response.success([]);
```

### `load(scriptName)` — Load script khác

```js
load("config.js");   // Load remote config
// Sau đó dùng BASE_URL từ config.js
```

### `Console.log(msg)` / `console.log(msg)` — Debug

```js
Console.log("debug: " + url);   // Cả 2 format đều OK
console.log(doc);
```

---

## 📝 Script Templates

### home.js — Trang chủ

Trả về danh sách sections hiển thị trên trang chủ plugin.

```js
function execute() {
    return Response.success([
        { title: "Section Name", input: "/path/to/page", script: "gen.js" },
        { title: "Bảng xếp hạng", input: "/top/allvisit", script: "gen.js" },
        { title: "Hoàn thành", input: "/quanben/", script: "rank.js" }
    ]);
}
```

| Field | Mô tả |
|-------|--------|
| `title` | Tên section hiển thị |
| `input` | URL path truyền cho script |
| `script` | Script xử lý render (thường là `gen.js`) |

---

### genre.js — Thể loại

**Cách 1: Static (hardcode):**
```js
function execute() {
    return Response.success([
        { title: "玄幻奇幻", input: "/class_1_1.html", script: "gen.js" },
        { title: "武俠仙俠", input: "/class_2_1.html", script: "gen.js" }
    ]);
}
```

**Cách 2: Dynamic (crawl từ site):**
```js
function execute(url, page) {
    var doc = fetch("https://example.com/genres").html();
    var items = doc.select(".genre-list li");
    var data = [];
    for (var i = 0; i < items.size(); i++) {
        var e = items.get(i);
        data.push({
            title: e.text(),
            script: "gen.js",
            input: e.select("a").first().attr("href")
        });
    }
    return Response.success(data);
}
```

---

### gen.js — Danh sách truyện (List Books)

Nhận `url` (path) và `page` (số trang), trả về danh sách books.

```js
function execute(url, page) {
    if (!page) page = '1';
    var BASE = "https://example.com";
    var fullUrl = url.startsWith("http") ? url : BASE + url;

    // Xử lý pagination
    fullUrl = fullUrl.replace(/_\d+\.html$/, "_" + page + ".html");

    var doc = fetch(fullUrl).html();
    if (!doc) return Response.success([], null);

    var el = doc.select(".bookbox");
    var data = [];

    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".bookname").text(),
            link: e.select(".bookname a").first().attr("href"),
            cover: "",    // URL ảnh bìa (optional)
            description: e.select(".author").text(),
            host: BASE
        });
    }

    var next = data.length > 0 ? (parseInt(page) + 1).toString() : null;
    return Response.success(data, next);
}
```

**Return format:** `Response.success(books[], nextPageToken)`

| Field | Mô tả |
|-------|--------|
| `name` | Tên truyện |
| `link` | URL trang detail |
| `cover` | URL ảnh bìa (để `""` nếu không có) |
| `description` | Mô tả ngắn (tác giả, thể loại...) |
| `host` | Base URL của site |

---

### detail.js — Chi tiết truyện ⭐

Nhận `url` truyện, trả về thông tin chi tiết.

```js
function execute(url) {
    var BASE = "https://example.com";
    if (!url.startsWith("http")) url = BASE + url;

    var doc = fetch(url + "/").html();    // ← Trailing slash quan trọng!
    if (!doc) return Response.success({
        name: "", cover: "", author: "", description: "", detail: "", host: BASE
    });

    var info = doc.select(".bookinfo");

    // Thể loại tags
    var tag = doc.select(".booktag a").text() || "";
    var booktag = doc.select(".booktag span");
    for (var i = 0; i < booktag.size(); i++) {
        tag += "<br>" + booktag.get(i).text();
    }
    var updateTime = doc.select(".booktime").text() || "";

    var author = info.select(".booktag a.red").first().text().replace("作者：", "");

    return Response.success({
        name: info.select("h1.booktitle").text(),
        cover: info.select(".thumbnail").first().attr("src"),
        author: author,
        description: info.select(".bookintro").text(),
        detail: tag + "<br>" + updateTime,    // Thể loại + thời gian
        host: BASE,
        url: url,
        suggests: [
            {
                title: "Cùng tác giả",
                input: "/modules/article/authorarticle.php?author=" + author,
                script: "suggest.js"
            }
        ]
    });
}
```

**Return format:** `Response.success(object)`

| Field | Mô tả |
|-------|--------|
| `name` | Tên truyện |
| `cover` | URL ảnh bìa |
| `author` | Tên tác giả |
| `description` | Giới thiệu truyện |
| `detail` | HTML string — thể loại, thời gian cập nhật, info thêm |
| `host` | Base URL |
| `url` | URL gốc |
| `suggests` | Array gợi ý — mỗi item có `title`, `input`, `script` |

---

### toc.js — Mục lục chương

Nhận `url` truyện, trả về danh sách chương.

```js
function execute(url) {
    var BASE = "https://example.com";
    if (!url.startsWith("http")) url = BASE + url;

    var doc = fetch(url + "/").html();    // Trailing slash!
    if (!doc) return Response.success([]);

    var el = doc.select("#list-chapterAll div dd a");
    // Fallback selectors:
    if (!el || el.size() == 0) el = doc.select("#list-chapterAll dd a");
    if (!el || el.size() == 0) el = doc.select(".chapterlist dd a");

    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.text(),
            url: e.attr("href"),
            host: BASE
        });
    }

    return Response.success(data);
}
```

**Return format:** `Response.success(chapters[])`

| Field | Mô tả |
|-------|--------|
| `name` | Tên chương |
| `url` | URL nội dung chương |
| `host` | Base URL |

---

### chap.js — Nội dung chương

Nhận `url` chương, trả về HTML content.

```js
function execute(url) {
    var BASE = "https://example.com";
    if (!url.startsWith("http")) url = BASE + url;

    var doc = fetch(url).html();    // Chương KHÔNG cần trailing slash
    if (!doc) return Response.success("");

    // Xóa quảng cáo và script
    doc.select(".ad_content").remove();
    doc.select("script").remove();
    doc.select("style").remove();

    // Lấy content — thử nhiều selector
    var htm = doc.select(".readcotent").html();     // Selector chính
    if (!htm) htm = doc.select("#read-content").html();
    if (!htm) htm = doc.select("#contentbox").html();
    if (!htm) htm = doc.select(".content").html();
    if (!htm) htm = "";

    // Clean watermarks
    htm = htm.replace(/UUkanshu\.com/gi, "");
    htm = htm.replace(/uukanshu/gi, "");
    htm = htm.replace(/&nbsp;/g, "");

    return Response.success(htm);
}
```

**Return format:** `Response.success(htmlString)`

> ⚠️ Trả về HTML string — VBook sẽ render hiển thị cho user.

---

### search.js — Tìm kiếm

```js
function execute(key, page) {
    var BASE = "https://example.com";

    var response = fetch(BASE + "/search", {
        method: "POST",
        body: { "searchkey": key, "searchtype": "all" }
    });

    if (!response.ok) return Response.success([], null);

    var doc = response.html();
    var el = doc.select(".bookbox");
    var data = [];

    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select(".bookname").text(),
            link: e.select(".bookname a").first().attr("href"),
            description: e.select(".author").text(),
            host: BASE
        });
    }

    return Response.success(data, null);
}
```

---

### suggest.js — Gợi ý (Optional)

```js
function execute(input, page) {
    var BASE = "https://example.com";

    var response = fetch(BASE + input);
    if (!response.ok) return Response.success([], null);

    var doc = response.html();
    var el = doc.select(".bookbox");
    var books = [];

    for (var i = 0; i < el.size(); i++) {
        var book = el.get(i);
        books.push({
            name: book.select(".bookname").text(),
            link: book.select(".del_but").first().attr("href"),
            description: book.select(".update").text(),
            host: BASE
        });
    }

    return Response.success(books, null);
}
```

---

### config.js — Remote Config (Optional)

Pattern TuanHai03 — lấy BASE_URL từ GitHub:

```js
let BASE_URL = JSON.parse(
    fetch('https://raw.githubusercontent.com/USER/REPO/main/Config_url').text()
)['SiteName'];

// Cho phép override từ VBook settings
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {}
```

**Config_url file trên GitHub:**
```json
{
  "69shu": "https://69shuba.cx",
  "Uukanshu": "https://uukanshu.cc"
}
```

> ✅ **Lợi ích:** Khi site đổi domain, chỉ cần update 1 file JSON trên GitHub — không cần build lại plugin.

---

### test.json — Test URLs (Optional)

Dùng để test từng script riêng lẻ trong VBook Dev Tools:

```json
{
  "detail.js": "https://uukanshu.cc/book/25128/",
  "toc.js": "https://uukanshu.cc/book/22031/",
  "chap.js": "https://uukanshu.cc/book/13997/8828594.html",
  "search.js": "呢喃詩章",
  "gen.js": "top/allvisit",
  "suggest.js": "https://uukanshu.cc/modules/article/authorarticle.php?author=木子心",
  "genre.js": "https://uukanshu.cc/class_1_1.html",
  "config.js": ""
}
```

---

## 🏗️ Build & Deploy

### Build plugin.zip

```python
# build.py
import zipfile, os

root = os.path.dirname(os.path.abspath(__file__))
ext = os.path.join(root, 'my-plugin')
output = os.path.join(ext, 'plugin.zip')

zf = zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED)

# plugin.json
info = zipfile.ZipInfo('plugin.json')
info.compress_type = 8
info.external_attr = 32
info.create_system = 0
with open(os.path.join(ext, 'plugin.json'), 'rb') as f:
    zf.writestr(info, f.read())

# icon.png
info = zipfile.ZipInfo('icon.png')
info.compress_type = 8
info.external_attr = 32
info.create_system = 0
with open(os.path.join(ext, 'icon.png'), 'rb') as f:
    zf.writestr(info, f.read())

# All src/*.js
src_dir = os.path.join(ext, 'src')
for f in sorted(os.listdir(src_dir)):
    if f.endswith('.js'):
        info = zipfile.ZipInfo('src/' + f)
        info.compress_type = 8
        info.external_attr = 32
        info.create_system = 0
        with open(os.path.join(src_dir, f), 'rb') as fp:
            zf.writestr(info, fp.read())

zf.close()
print(f'Done: {os.path.getsize(output)} bytes')
```

> ⚠️ **QUAN TRỌNG:**
> - `create_system = 0` → đảm bảo tương thích Android (không dùng Unix permissions)
> - `external_attr = 32` → file attribute bình thường
> - Zip structure: `plugin.json`, `icon.png`, `src/*.js` ở root level

### Deploy lên GitHub

```bash
# Build
python build.py

# Commit & push
git add -A
git commit -m "feat(v14): description of changes"
git push
```

VBook tải plugin từ raw GitHub URL:
```
https://raw.githubusercontent.com/USER/REPO/master/my-plugin/plugin.zip
```

---

## 🐛 Debug & Troubleshooting

### Lỗi hay gặp

| Lỗi | Nguyên nhân | Fix |
|-----|-------------|-----|
| **404 Not Found** | Thiếu trailing slash `/` | `fetch(url + "/")` |
| **404 Not Found** | Dùng `www.` nhưng site không dùng | Bỏ `www.` prefix |
| **Nội dung trống** | Dùng `response.text()` + `Html.parse()` | Đổi sang `response.html()` |
| **Ký tự lỗi (GBK)** | Charset không đúng | `response.html()` tự xử lý |
| **Cloudflare block** | Site có anti-bot | `Engine.newBrowser()` fallback |
| **Version không update** | Quên bump version | Bump CẢ inner + outer plugin.json |
| **CSS selector trống** | Site đổi giao diện | Inspect HTML, update selectors |

### Pattern "Try fetch, fallback browser":

```js
var doc = null;
try {
    doc = fetch(url).html();
} catch (e) {}

if (!doc) {
    var browser = Engine.newBrowser();
    doc = browser.launch(url, 15000);
    browser.close();
}
```

### Tham khảo repos mở:

| Repo | Đặc điểm |
|------|-----------|
| **TuanHai03/vbook-extensions** | Source mở, dễ đọc, có test.json |
| **duongden/vbook** | 25 plugins, nhiều site, nhưng source mã hoá |
| **longvuu/vbook-extensions** | Đơn giản, phù hợp mới bắt đầu |
| **hajljnopera/vbook-ext** | 69shu v11 |
| **B3x0m/vbook-ext** | uuxs, comic plugins |

### Trang danh sách extension:
```
https://xn--ngc-bmz.vn/i/vbook/extension_list.php
```

---

## 🎯 Best Practices (Rút từ kinh nghiệm)

1. **Luôn dùng `response.html()`** — không dùng `text()` + `Html.parse()`
2. **Trailing slash** — `fetch(url + "/")` cho detail và toc
3. **Không ép `www.`** — dùng domain chính xác của site
4. **Nhiều fallback selectors** — site có thể đổi giao diện
5. **Clean watermarks** — xóa tên site khỏi nội dung chương
6. **Xóa quảng cáo** — `.ad_content`, `script`, `style`
7. **Remote config** — lưu BASE_URL trên GitHub để dễ đổi domain
8. **Rate limiting** — set `config.delay` hợp lý (3000-7000ms)
9. **Test trước khi push** — dùng test.json verify từng script
10. **Version sync** — bump version ở CẢ inner + outer plugin.json

---

## 📥 VBook = Crawler + Reader + EPUB Exporter

VBook hoạt động như một **full crawler pipeline**, không chỉ đọc online:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Plugin      │    │ VBook Engine│    │  Local DB   │    │   Export    │
│  Scripts     │───▶│  Crawler    │───▶│  Cache      │───▶│   EPUB      │
│ (fetch HTML) │    │ (scheduler) │    │ (chapters)  │    │  (offline)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Workflow khi user bấm "Download":

1. **`toc.js`** → Lấy danh sách tất cả chapters
2. **VBook Engine** → Lần lượt gọi `chap.js` cho TỪNG chapter
   - Respect `config.thread_num` (số thread song song)
   - Respect `config.delay` (nghỉ giữa mỗi request)
3. **Cache** → Lưu content vào database local
4. **Export** → Đóng gói thành EPUB để đọc offline

### Config crawl speed (plugin.json):

```json
{
  "config": {
    "thread_num": 1,     // 1 = tuần tự, an toàn nhất
    "delay": 3000        // 3 giây giữa mỗi chapter
  }
}
```

| Config | Gợi ý | Khi nào |
|--------|-------|---------|
| `thread_num: 1, delay: 7000` | Rất chậm nhưng an toàn | Site hay block (69shuba) |
| `thread_num: 1, delay: 3000` | Cân bằng | Hầu hết site |
| `thread_num: 2, delay: 1000` | Nhanh | Site không block |
| `thread_num: 3, delay: 500` | Rất nhanh | Site ổn định, không anti-bot |

> ⚠️ Set quá nhanh → bị site block IP → 403 Forbidden → mất trắng.
> Đường đen set `delay: 7000` cho 69shu vì đã từng bị block.
