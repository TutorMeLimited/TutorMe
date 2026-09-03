
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Extract everything between <!-- First Set --> and <!-- Duplicate Set for Seamless Looping -->
let firstSetStart = html.indexOf("<!-- First Set -->") + "<!-- First Set -->".length;
let duplicateSetStart = html.indexOf("<!-- Duplicate Set for Seamless Looping -->");

if (firstSetStart !== -1 && duplicateSetStart !== -1) {
    let cardContent = html.substring(firstSetStart, duplicateSetStart).trim();
    
    // We want the total track to have many copies. Let us say we want 8 copies of cardContent.
    // That means the track will have 8 copies of the 3 cards = 24 cards.
    // 50% of 24 cards is 12 cards, which is more than enough to cover any monitor width.
    let newContent = "";
    for(let i=0; i<8; i++) {
        newContent += "\n" + cardContent + "\n";
    }

    // Replace the track content
    let trackStart = html.indexOf("<div class=\"cards-marquee-track\">") + "<div class=\"cards-marquee-track\">".length;
    let trackEnd = html.indexOf("</div>", trackStart); 
    // Wait, trackEnd is tricky because of nested divs.
    // The safest way is to replace between "<!-- First Set -->" and the end of the duplicate set.
    // Let us find the end of the track block.
}

