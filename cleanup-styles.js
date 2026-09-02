const fs = require("fs");
let styles = fs.readFileSync("styles.css", "utf8");

// Put flex-wrap back
styles = styles.replace(/\/\* flex-wrap: wrap; \*\//g, "flex-wrap: wrap;");
styles = styles.replace(/\/\* gap: 2rem; handled by swiper \*\//g, "gap: 2rem;");

// Remove swiper overrides
styles = styles.replace(/\.swiper-wrapper { transition-timing-function: linear !important; }/g, "");
styles = styles.replace(/\.swiper-slide\.subject { width: 350px !important; box-sizing: border-box; }/g, "");

fs.writeFileSync("styles.css", styles);
