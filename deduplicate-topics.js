
const fs = require("fs");
let index = fs.readFileSync("index.html", "utf8");

// Deduplicate Biology
let dupBioRegex = /(<div class="subject biology">[\s\S]*?)<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">\s*<strong>GCSE Topics:<\/strong>\s*<ul style="padding-left: 1.2rem; margin: 0.5rem 0;">\s*<li>Cell Biology<\/li>[\s\S]*?<\/div>(\s*<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">)/g;
index = index.replace(dupBioRegex, "$1$2");

// Deduplicate Chemistry
let dupChemRegex = /(<div class="subject chemistry">[\s\S]*?)<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">\s*<strong>GCSE Topics:<\/strong>\s*<ul style="padding-left: 1.2rem; margin: 0.5rem 0;">\s*<li>Atomic Structure<\/li>[\s\S]*?<\/div>(\s*<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">)/g;
index = index.replace(dupChemRegex, "$1$2");

// Deduplicate Physics
let dupPhysRegex = /(<div class="subject physics">[\s\S]*?)<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">\s*<strong>GCSE Topics:<\/strong>\s*<ul style="padding-left: 1.2rem; margin: 0.5rem 0;">\s*<li>Energy<\/li>[\s\S]*?<\/div>(\s*<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">)/g;
index = index.replace(dupPhysRegex, "$1$2");

fs.writeFileSync("index.html", index);
console.log("Done");

