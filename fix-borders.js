
const fs = require("fs");
let styles = fs.readFileSync("styles.css", "utf8");

// Change all subject top borders to use --biology (cyan)
styles = styles.replace(/\.subject\.sociology \{ border-top: 6px solid var\(--sociology\); \}/g, ".subject.sociology { border-top: 6px solid var(--biology); }");
styles = styles.replace(/\.subject\.psychology \{ border-top: 6px solid var\(--psychology\); \}/g, ".subject.psychology { border-top: 6px solid var(--biology); }");
styles = styles.replace(/\.subject\.chemistry \{ border-top: 6px solid var\(--chemistry\); \}/g, ".subject.chemistry { border-top: 6px solid var(--biology); }");
styles = styles.replace(/\.subject\.physics \{ border-top: 6px solid var\(--physics\); \}/g, ".subject.physics { border-top: 6px solid var(--biology); }");

// Also update the h3 headers inside them if they were mismatched?
// Wait, the user didn"t ask for h3 headers to be changed, they explicitly asked for "the band of colour on top".
// Let"s just do the borders for now.

// Remove the glowing box-shadow from topics-container since it was a misunderstanding
styles = styles.replace(/box-shadow: 0 4px 20px rgba\(98, 205, 215, 0\.5\); \/\* Cyan shadow \*\//g, "/* box-shadow removed per user request */");

fs.writeFileSync("styles.css", styles);
console.log("Done");

