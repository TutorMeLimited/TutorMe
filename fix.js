
const fs = require("fs");

// 1. Update index.html
let index = fs.readFileSync("index.html", "utf8");

let chemTopics = `
            <div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">
                <strong>GCSE Topics:</strong>
                <ul style="padding-left: 1.2rem; margin: 0.5rem 0;">
                    <li>Atomic Structure</li>
                    <li>Bonding</li>
                    <li>Quantitative Chemistry</li>
                    <li>Chemical Changes</li>
                    <li>Energy Changes</li>
                    <li>Rate of Reaction</li>
                    <li>Organic Chemistry</li>
                    <li>Chemical Analysis</li>
                    <li>Chemistry of the Atmosphere</li>
                    <li>Using Resources</li>
                </ul>
            </div>`;
index = index.replace(/(<div class="subject chemistry">[\s\S]*?<\/p>)/, "$1" + chemTopics);

let bioTopics = `
            <div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">
                <strong>GCSE Topics:</strong>
                <ul style="padding-left: 1.2rem; margin: 0.5rem 0;">
                    <li>Cell Biology</li>
                    <li>Organisation</li>
                    <li>Infection and Response</li>
                    <li>Bioenergetics</li>
                    <li>Homeostasis and Response</li>
                    <li>Inheritance and Variation</li>
                    <li>Ecology</li>
                </ul>
            </div>`;
index = index.replace(/(<div class="subject biology">[\s\S]*?<\/p>)/, "$1" + bioTopics);

let physicsTopics = `
            <div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">
                <strong>GCSE Topics:</strong>
                <ul style="padding-left: 1.2rem; margin: 0.5rem 0;">
                    <li>Energy</li>
                    <li>Electricity</li>
                    <li>Particle Model of Matter</li>
                    <li>Atomic Structure</li>
                    <li>Forces</li>
                    <li>Waves</li>
                    <li>Magnetism and Electromagnetism</li>
                    <li>Space Physics</li>
                </ul>
            </div>`;
index = index.replace(/(<div class="subject physics">[\s\S]*?<\/p>)/, "$1" + physicsTopics);

// Make sure existing sociology and psychology topics are black
index = index.replace(/<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem;">/g, `<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">`);

fs.writeFileSync("index.html", index);


// 2. Update Our-services.html
let services = fs.readFileSync("Our-services.html", "utf8");

// Remove A-Level from Science/Bio/Chem/Physics
services = services.replace(/GCSE and A-Level Biology/g, "GCSE Biology");
services = services.replace(/GCSE and A-Level Chemistry/g, "GCSE Chemistry");
services = services.replace(/GCSE and A-Level Physics/g, "GCSE Physics");
services = services.replace(/GCSE and A-Level Science/g, "GCSE Science");

// Remove topics from Our-services.html
// They are formatted as <h3>... Topics Covered:</h3>\n<ul>...</ul>
services = services.replace(/<h3>Biology Topics Covered:<\/h3>[\s\S]*?<\/ul>/, "");
services = services.replace(/<h3>Chemistry Topics Covered:<\/h3>[\s\S]*?<\/ul>/, "");
services = services.replace(/<h3>Physics Topics Covered:<\/h3>[\s\S]*?<\/ul>/, "");

fs.writeFileSync("Our-services.html", services);


// 3. Update styles.css
let styles = fs.readFileSync("styles.css", "utf8");

// Add specific colors to subject h3
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

// Ensure the logo animation
let logoAnimation = `
.subject img {
    animation: floatIcon 3s ease-in-out infinite;
}

@keyframes floatIcon {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
}
`;
if (!styles.includes("floatIcon")) {
    styles += "\n" + logoAnimation;
}

fs.writeFileSync("styles.css", styles);

console.log("Done");

