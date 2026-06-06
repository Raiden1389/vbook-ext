function execute() {
    return Response.success([
        { title: "Truyện Hot", input: "/danh-sach/truyen-hot", script: "gen.js" },
        { title: "Truyện Mới", input: "/danh-sach/truyen-moi", script: "gen.js" },
        { title: "Truyện Full", input: "/danh-sach/truyen-full", script: "gen.js" },
        { title: "Truyện Dịch", input: "/danh-sach/truyen-dich", script: "gen.js" },
        { title: "Truyện Dịch AI", input: "/danh-sach/truyen-dich-ai", script: "gen.js" },
        { title: "Truyện Convert", input: "/danh-sach/truyen-convert", script: "gen.js" }
    ]);
}
