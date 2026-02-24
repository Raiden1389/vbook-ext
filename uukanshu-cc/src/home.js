load("config.js");

function execute() {
    return Response.success([
        { title: "玄幻奇幻", input: "/class_1_1.html", script: "list.js" },
        { title: "武俠仙俠", input: "/class_2_1.html", script: "list.js" },
        { title: "現代都市", input: "/class_3_1.html", script: "list.js" },
        { title: "歷史軍事", input: "/class_4_1.html", script: "list.js" },
        { title: "科幻小說", input: "/class_5_1.html", script: "list.js" },
        { title: "遊戲競技", input: "/class_6_1.html", script: "list.js" },
        { title: "恐怖靈異", input: "/class_7_1.html", script: "list.js" },
        { title: "言情小說", input: "/class_8_1.html", script: "list.js" },
        { title: "動漫同人", input: "/class_9_1.html", script: "list.js" },
        { title: "其他類型", input: "/class_10_1.html", script: "list.js" }
    ]);
}
