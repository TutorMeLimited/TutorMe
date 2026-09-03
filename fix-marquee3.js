
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

let trackStart = html.indexOf("<div class=\"cards-marquee-track\">") + "<div class=\"cards-marquee-track\">".length;
let trackEnd = html.indexOf("        </div>\n    </div>\n    <section", trackStart);

let firstSetMatch = /<!-- First Set -->([\s\S]*?)<!-- Duplicate Set/.exec(html);

if (firstSetMatch) {
    let oneSet = firstSetMatch[1].trim();
    let newTrack = "\n<!-- First Set -->\n";
    for(let i=0; i<4; i++) newTrack += oneSet + "\n";
    newTrack += "\n<!-- Duplicate Set for Seamless Looping -->\n";
    for(let i=0; i<4; i++) newTrack += oneSet + "\n";

    html = html.substring(0, trackStart) + newTrack + html.substring(trackEnd);
    fs.writeFileSync("index.html", html);
    console.log("Marquee fixed with UTF-8 intact.");
} else {
    console.log("Could not find blocks.");
}

