
const fs = require("fs");
let index = fs.readFileSync("index.html", "utf8");

index = index.replace(
    ".cards-marquee-track:hover {\n    animation-play-state: paused;\n}",
    ".cards-marquee-track:active {\n    animation-play-state: paused;\n}"
);

fs.writeFileSync("index.html", index);
console.log("Done");

