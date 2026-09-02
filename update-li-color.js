
const fs = require("fs");
let styles = fs.readFileSync("styles.css", "utf8");

styles = styles.replace(/\.topics-container li \{\n    margin-bottom: 0\.5rem;\n    color: #62cdd7; \/\* Cyan \*\/\n/g, ".topics-container li {\n    margin-bottom: 0.5rem;\n    color: #29386d; /* Blue */\n");

// If regex fails due to line endings or exact match, let"s use a simpler replace
if (styles.indexOf("color: #62cdd7; /* Cyan */") !== -1 && styles.indexOf(".topics-container li") !== -1) {
    styles = styles.replace(/color: #62cdd7; \/\* Cyan \*\//, "color: #29386d; /* Blue */");
} else {
    // robust replace
    styles = styles.replace(/\.topics-container li \{[\s\S]*?color:[^;]+;[^\n]*/, function(match) {
        return match.replace(/color:[^;]+;/, "color: #29386d;");
    });
}

fs.writeFileSync("styles.css", styles);
console.log("Done");

