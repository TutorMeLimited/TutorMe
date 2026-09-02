const fs = require("fs");
let index = fs.readFileSync("index.html", "utf8");

// Remove the old swiper logo ticker entirely
let tickerRegex = /<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/npm\/swiper@10\/swiper-bundle\.min\.css" \/>[\s\S]*?<script>\s*document\.addEventListener\("DOMContentLoaded"[\s\S]*?<\/script>\s*/;
index = index.replace(tickerRegex, "");

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
