load("libs.js");

function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "latest", script: "gen.js" },
        { title: "Đọc nhiều", input: "trending_now", script: "gen.js" },
        { title: "Tiên Hiệp", input: "/the-loai/tien-hiep", script: "gen.js" },
        { title: "Huyền Huyễn", input: "/the-loai/huyen-huyen", script: "gen.js" },
        { title: "Ngôn Tình", input: "/the-loai/ngon-tinh", script: "gen.js" },
        { title: "Đô Thị", input: "/the-loai/do-thi", script: "gen.js" },
        { title: "Linh Dị", input: "/the-loai/linh-di", script: "gen.js" },
        { title: "Hoàn Thành", input: "/the-loai/hoan-thanh", script: "gen.js" }
    ]);
}
