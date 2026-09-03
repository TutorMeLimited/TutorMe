
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");
html = html.replace(
    ".cards-marquee-track {\r\n    display: flex;\r\n    width: max-content;", 
    ".cards-marquee-track {\r\n    display: flex;\r\n    align-items: flex-start;\r\n    width: max-content;"
);
html = html.replace(
    ".cards-marquee-track {\n    display: flex;\n    width: max-content;", 
    ".cards-marquee-track {\n    display: flex;\n    align-items: flex-start;\n    width: max-content;"
);
fs.writeFileSync("index.html", html);
console.log("Style fixed.");

