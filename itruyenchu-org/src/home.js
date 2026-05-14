load("libs.js");

function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "{\"sortBy\":\"createdAt\"}", script: "gen.js" },
        { title: "Đọc nhiều", input: "{\"sortBy\":\"totalViews\"}", script: "gen.js" },
        { title: "Đọc tuần", input: "{\"sortBy\":\"weekViews\"}", script: "gen.js" },
        { title: "Hoàn thành", input: "{\"categories\":[\"hoan-thanh\"],\"sortBy\":\"createdAt\"}", script: "gen.js" },
        { title: "Tiên hiệp", input: "{\"categories\":[\"tien-hiep\"],\"sortBy\":\"createdAt\"}", script: "gen.js" },
        { title: "Huyền huyễn", input: "{\"categories\":[\"huyen-huyen\"],\"sortBy\":\"createdAt\"}", script: "gen.js" },
        { title: "Ngôn tình", input: "{\"categories\":[\"ngon-tinh\"],\"sortBy\":\"createdAt\"}", script: "gen.js" },
        { title: "Đô thị", input: "{\"categories\":[\"do-thi\"],\"sortBy\":\"createdAt\"}", script: "gen.js" }
    ]);
}
