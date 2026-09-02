
const fs = require("fs");
let index = fs.readFileSync("index.html", "utf8");

// Replace the inline style divs with class="topics-container"
index = index.replace(/<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">/g, `<div class="topics-container">`);

// Replace the uls inline styles with nothing since we handle it in CSS
index = index.replace(/<ul style="padding-left: 1.2rem; margin: 0.5rem 0;">/g, `<ul>`);

fs.writeFileSync("index.html", index);

let styles = fs.readFileSync("styles.css", "utf8");
if (!styles.includes(".topics-container")) {
    styles += `
/* Topic Container Styles */
.topics-container {
    text-align: left;
    font-size: 0.95rem;
    margin-top: 1.5rem;
    padding: 1.2rem;
    border-radius: 12px;
    background: var(--bg-container);
    box-shadow: 0 4px 20px rgba(98, 205, 215, 0.5); /* Cyan shadow */
}
.topics-container strong {
    color: #29386d; /* Blue */
    display: block;
    margin-bottom: 0.8rem;
    font-size: 1.1rem;
}
.topics-container ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
}
.topics-container li {
    margin-bottom: 0.5rem;
    color: #62cdd7; /* Cyan */
    font-weight: 600;
    display: flex;
    align-items: flex-start;
    gap: 8px;
}
`;
    fs.writeFileSync("styles.css", styles);
}
console.log("Done");

