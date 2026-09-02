
const fs = require("fs");
let styles = fs.readFileSync("styles.css", "utf8");

if (!styles.includes("ul + strong")) {
    styles += "\n.topics-container ul + strong { margin-top: 1.2rem; }\n";
    fs.writeFileSync("styles.css", styles);
}

