
const fs = require("fs");
let styles = fs.readFileSync("styles.css", "utf8");

styles = styles.replace("display: flex;", "");
styles = styles.replace("align-items: flex-start;", "");
styles = styles.replace("gap: 8px;", "line-height: 1.4;");

fs.writeFileSync("styles.css", styles);

