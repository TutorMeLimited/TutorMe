
const fs = require("fs");

// 1. Update styles.css
let styles = fs.readFileSync("styles.css", "utf8");

// Remove old animation
styles = styles.replace(/\.subject img {[\s\S]*?floatIcon[\s\S]*?}/, "");
styles = styles.replace(/@keyframes floatIcon {[\s\S]*?}/, "");
styles = styles.replace(/\.subject:nth-child\(\d+\) img { animation-delay: [\d\.]+s; }\r?\n?/g, "");

// Add Swiper linear transition
if (!styles.includes(".swiper-wrapper")) {
    styles += "\n.swiper-wrapper { transition-timing-function: linear !important; }\n";
}
// Ensure subjects has no flex-wrap so Swiper controls it properly
styles = styles.replace("flex-wrap: wrap;", "/* flex-wrap: wrap; */");
styles = styles.replace(/gap: 2rem;/g, "/* gap: 2rem; handled by swiper */");

// Override .subject width so it looks good in slider
if (!styles.includes(".swiper-slide .subject")) {
    styles += "\n.swiper-slide .subject { width: 100%; height: 100%; box-sizing: border-box; }\n.swiper-slide { height: auto; }\n";
}

fs.writeFileSync("styles.css", styles);


// 2. Update index.html
let index = fs.readFileSync("index.html", "utf8");

if (!index.includes("swiper-bundle.min.css")) {
    index = index.replace("</head>", `    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />\n</head>`);
}

// Wrap subjects
// Find <section class="subjects" id="subjects">
// Replace inner divs with swiper markup
let subjectsRegex = /<section class="subjects" id="subjects">([\s\S]*?)<\/section>/;
let match = index.match(subjectsRegex);
if (match) {
    let innerHTML = match[1];
    
    // Check if not already swipered
    if (!innerHTML.includes("swiper-wrapper")) {
        // We have multiple <div class="subject ..."> elements
        // We will replace each <div class="subject with <div class="swiper-slide"><div class="subject
        // And the corresponding closing </div> with </div></div>
        
        let newInner = `<div class="swiper subjects-swiper"><div class="swiper-wrapper">\n` + innerHTML;
        
        // We can just add swiper-slide to the .subject class instead of wrapping!
        newInner = newInner.replace(/<div class="subject /g, `<div class="swiper-slide subject `);
        
        newInner += `\n</div></div>`;
        
        index = index.replace(subjectsRegex, `<section class="subjects" id="subjects">\n${newInner}\n</section>`);
    }
}

// Add Swiper init script
let script = `
<script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    new Swiper(".subjects-swiper", {
      loop: true,
      speed: 4500,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
        1400: { slidesPerView: 4, spaceBetween: 30 }
      }
    });
  });
</script>
</body>`;

if (!index.includes("swiper-bundle.min.js")) {
    index = index.replace("</body>", script);
}

fs.writeFileSync("index.html", index);
console.log("Done");

