const fs = require("fs");
let index = fs.readFileSync("index.html", "utf8");

// Remove ANY existing swiper ticker or marquee
let oldTicker1 = /<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/npm\/swiper@10\/swiper-bundle\.min\.css" \/>[\s\S]*?<script>\s*document\.addEventListener\("DOMContentLoaded"[\s\S]*?<\/script>\s*/;
index = index.replace(oldTicker1, "");

let oldTicker2 = /<style>\s*\.marquee-container[\s\S]*?<\/style>\s*<div class="marquee-container">[\s\S]*?<\/div>\s*<\/div>\s*/;
index = index.replace(oldTicker2, "");

// Make sure topics are appended (if not already there)
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
if (!index.includes("Quantitative Chemistry")) {
    index = index.replace(/(<div class="subject chemistry">[\s\S]*?<\/p>)/, "$1" + chemTopics);
}

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
if (!index.includes("Infection and Response")) {
    index = index.replace(/(<div class="subject biology">[\s\S]*?<\/p>)/, "$1" + bioTopics);
}

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
if (!index.includes("Particle Model of Matter")) {
    index = index.replace(/(<div class="subject physics">[\s\S]*?<\/p>)/, "$1" + physicsTopics);
}

index = index.replace(/<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem;">/g, `<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">`);

// Build the pure CSS marquee
let marqueeHTML = `
<style>
.marquee-container {
    width: 100%;
    overflow: hidden;
    padding: 2rem 0;
    margin-bottom: 2rem;
    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
    display: flex;
    background: transparent;
}
.marquee-track {
    display: flex;
    width: max-content;
    animation: scrollMarquee 25s linear infinite;
}
.marquee-track:hover {
    animation-play-state: paused;
}
.marquee-track img {
    height: 80px;
    width: auto;
    object-fit: contain;
    margin: 0 80px;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
    transition: transform 0.3s;
}
.marquee-track img:hover {
    transform: scale(1.1);
}
@keyframes scrollMarquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
</style>

<div class="marquee-container">
    <div class="marquee-track">
        <!-- Original Set (10 items) -->
        <img src="https://img.icons8.com/color/96/group-background-selected.png" alt="Sociology"/>
        <img src="https://img.icons8.com/color/96/psychology.png" alt="Psychology"/>
        <img src="https://img.icons8.com/color/96/test-tube.png" alt="Chemistry"/>
        <img src="https://img.icons8.com/?size=100&id=9116&format=png&color=000000" alt="Biology"/>
        <img src="https://img.icons8.com/color/96/physics.png" alt="Physics"/>
        <img src="https://img.icons8.com/color/96/group-background-selected.png" alt="Sociology"/>
        <img src="https://img.icons8.com/color/96/psychology.png" alt="Psychology"/>
        <img src="https://img.icons8.com/color/96/test-tube.png" alt="Chemistry"/>
        <img src="https://img.icons8.com/?size=100&id=9116&format=png&color=000000" alt="Biology"/>
        <img src="https://img.icons8.com/color/96/physics.png" alt="Physics"/>
        
        <!-- Duplicated Set (10 items) for perfect loop -->
        <img src="https://img.icons8.com/color/96/group-background-selected.png" alt="Sociology"/>
        <img src="https://img.icons8.com/color/96/psychology.png" alt="Psychology"/>
        <img src="https://img.icons8.com/color/96/test-tube.png" alt="Chemistry"/>
        <img src="https://img.icons8.com/?size=100&id=9116&format=png&color=000000" alt="Biology"/>
        <img src="https://img.icons8.com/color/96/physics.png" alt="Physics"/>
        <img src="https://img.icons8.com/color/96/group-background-selected.png" alt="Sociology"/>
        <img src="https://img.icons8.com/color/96/psychology.png" alt="Psychology"/>
        <img src="https://img.icons8.com/color/96/test-tube.png" alt="Chemistry"/>
        <img src="https://img.icons8.com/?size=100&id=9116&format=png&color=000000" alt="Biology"/>
        <img src="https://img.icons8.com/color/96/physics.png" alt="Physics"/>
    </div>
</div>
`;

index = index.replace(/(<section class="subjects" id="subjects">)/, marqueeHTML + "\n$1");

fs.writeFileSync("index.html", index);
console.log("Done");
