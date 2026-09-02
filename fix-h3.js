
const fs = require("fs");
let index = fs.readFileSync("index.html", "utf8");

// We need to wrap the subject names and levels in spans
// Example: <h3>Sociology (A-Level & GCSE)</h3>
index = index.replace(/<h3>(.*?) \((.*?)\)<\/h3>/g, "<h3><span class=\"topic-name\">$1</span> <span class=\"topic-level\">($2)</span></h3>");
fs.writeFileSync("index.html", index);

let styles = fs.readFileSync("styles.css", "utf8");
// Remove old h3 color mappings
styles = styles.replace(/\.subject\.\w+\s*h3\s*\{[^}]+\}/g, "");

// Add span styles
if (!styles.includes(".topic-name")) {
    styles += `
.subject h3 .topic-name { color: var(--biology); } /* Cyan */
.subject h3 .topic-level { color: var(--sociology); } /* Blue */
`;
    fs.writeFileSync("styles.css", styles);
}
console.log("Done");

