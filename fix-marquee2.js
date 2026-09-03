
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");
let oneSet = fs.readFileSync("one-set.html", "utf8");

let newTrackContent = "\n<!-- First Set -->\n";
for(let i=0; i<4; i++) newTrackContent += oneSet + "\n";
newTrackContent += "\n<!-- Duplicate Set for Seamless Looping -->\n";
for(let i=0; i<4; i++) newTrackContent += oneSet + "\n";

// Find track start and end
let trackStartIdx = html.indexOf("<div class=\"cards-marquee-track\">") + "<div class=\"cards-marquee-track\">".length;
let trackEndIdx = html.indexOf("</div>\n    </div>\n    </section>", trackStartIdx);

let before = html.substring(0, trackStartIdx);
let after = html.substring(trackEndIdx);

fs.writeFileSync("index.html", before + newTrackContent + after);
console.log("Marquee fixed.");

