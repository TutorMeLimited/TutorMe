
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Update hero text
html = html.replace(
    "<p>Boost confidence and results in <b>Sociology</b>, <b>Psychology</b> (A-Level & GCSE) and <b>Chemistry</b>, <b>Biology</b>, <b>Physics</b> (GCSE).</p>",
    "<p>Boost confidence and results in <b>Biology</b>, <b>Chemistry</b>, and <b>Physics</b> (GCSE).</p>"
);

// Remove sociology and psychology subjects using a regex that matches the div and all its contents
// We use a non-greedy match to grab the entire <div class="subject sociology"> ... </div> block.
// Since nested divs exist (topics-container), we have to be extremely careful.
// Let us write a helper function to extract a balanced div.

function removeDivByClass(content, className) {
    let searchStr = `<div class="${className}">`;
    let count = 0;
    while (content.includes(searchStr)) {
        let startIndex = content.indexOf(searchStr);
        let currentIdx = startIndex + searchStr.length;
        let openDivs = 1;

        while (openDivs > 0 && currentIdx < content.length) {
            let nextOpen = content.indexOf("<div", currentIdx);
            let nextClose = content.indexOf("</div", currentIdx);

            if (nextClose === -1) break; // Error parsing

            if (nextOpen !== -1 && nextOpen < nextClose) {
                openDivs++;
                currentIdx = nextOpen + 4;
            } else {
                openDivs--;
                currentIdx = nextClose + 6; // length of "</div>"
            }
        }
        
        let before = content.substring(0, startIndex);
        let after = content.substring(currentIdx);
        content = before + after;
        count++;
    }
    console.log(`Removed ${count} instances of ${className}`);
    return content;
}

html = removeDivByClass(html, "subject sociology");
html = removeDivByClass(html, "subject psychology");

fs.writeFileSync("index.html", html);
console.log("Subjects removed.");

