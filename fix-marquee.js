
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Extract the 3 subjects block from line 130 to 187 approx
let firstSetStart = html.indexOf("<div class=\"subject chemistry\">");
let endPhysics = html.indexOf("</div>", html.indexOf("<div class=\"subject physics\">")) + 6; 
// Actually physics has nested divs. The safest is to use the exact known text.

