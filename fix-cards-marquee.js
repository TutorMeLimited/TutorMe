const fs = require("fs");
let index = fs.readFileSync("index.html", "utf8");

// 1. Remove the logo marquee (the emojis)
let oldMarqueeRegex = /<style>\s*\.marquee-container[\s\S]*?<\/style>\s*<div class="marquee-container">[\s\S]*?<\/div>\s*<\/div>\s*/;
index = index.replace(oldMarqueeRegex, "");

// 2. Extract the 5 subject cards
let subjectsSectionRegex = /<section class="subjects" id="subjects">\s*([\s\S]*?)\s*<\/section>/;
let subjectsMatch = index.match(subjectsSectionRegex);

if (subjectsMatch) {
    let cardsContent = subjectsMatch[1]; // This contains the 5 <div class="subject ..."> blocks
    
    // Clean up any wrapper that might be there (like `<div class="subjects">` if I left it)
    // Wait, in my HTML, `<section class="subjects" id="subjects">` IS the wrapper, and the cards are direct children.
    
    let marqueeStyles = `
<style>
.cards-marquee-container {
    width: 100%;
    overflow: hidden;
    padding: 2rem 0;
    /* Fade effect on left and right edges */
    -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
    mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
    display: flex;
}
.cards-marquee-track {
    display: flex;
    width: max-content;
    animation: scrollCards 35s linear infinite;
}
.cards-marquee-track:hover {
    animation-play-state: paused;
}
/* Ensure every card has exact same right margin for perfect math */
.cards-marquee-track .subject {
    margin-right: 2rem;
    flex-shrink: 0;
}
@keyframes scrollCards {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
</style>
`;

    let newSubjectsSection = `
<section class="subjects-wrapper" id="subjects" style="margin: 3rem 0;">
    ${marqueeStyles}
    <div class="cards-marquee-container">
        <div class="cards-marquee-track">
            <!-- First Set -->
            ${cardsContent}
            <!-- Duplicate Set for Seamless Looping -->
            ${cardsContent}
        </div>
    </div>
</section>
`;
    
    index = index.replace(subjectsSectionRegex, newSubjectsSection);
    fs.writeFileSync("index.html", index);
    console.log("Successfully replaced cards with marquee.");
} else {
    console.log("Could not find subjects section!");
}
