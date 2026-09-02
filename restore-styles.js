
const fs = require("fs");
let styles = fs.readFileSync("styles.css", "utf8");

// Re-add the h3 colors
let subjectH3Colors = `
.subject.sociology h3 { color: var(--sociology); }
.subject.psychology h3 { color: var(--psychology); }
.subject.chemistry h3 { color: var(--chemistry); }
.subject.biology h3 { color: var(--biology); }
.subject.physics h3 { color: var(--physics); }
`;
if (!styles.includes(".subject.sociology h3")) {
    styles = styles.replace(".subject h3 {", subjectH3Colors + "\n.subject h3 {");
}

// Ensure subjects has no flex-wrap so Swiper controls it properly
styles = styles.replace("flex-wrap: wrap;", "/* flex-wrap: wrap; */");
styles = styles.replace(/gap: 2rem;/g, "/* gap: 2rem; handled by swiper */");

// Add Swiper linear transition and height fix
if (!styles.includes(".swiper-wrapper")) {
    styles += "\n.swiper-wrapper { transition-timing-function: linear !important; }\n";
    // FIX: do NOT use width: 100% on subject inside swiper. Just let Swiper handle width.
    styles += ".swiper-slide.subject { width: 350px !important; box-sizing: border-box; }\n";
}

fs.writeFileSync("styles.css", styles);

