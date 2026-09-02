
const fs = require("fs");
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

index = index.replace(/<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem;">/g, `<div style="text-align: left; font-size: 0.9rem; margin-top: 1rem; color: #000;">`);

// Now create the logo ticker!
let logoTicker = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
<style>
.logo-ticker {
    width: 100%;
    overflow: hidden;
    padding: 2rem 0;
    background: transparent;
}
.logo-ticker .swiper-wrapper {
    transition-timing-function: linear !important;
    align-items: center;
}
.logo-ticker .swiper-slide {
    width: auto !important;
    padding: 0 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.logo-ticker img {
    height: 80px;
    width: auto;
    object-fit: contain;
}
</style>

<div class="swiper logo-ticker">
    <div class="swiper-wrapper">
        <!-- Duplicate logos enough times for smooth loop -->
        <div class="swiper-slide"><img src="https://img.icons8.com/color/96/group-background-selected.png" alt="Sociology"/></div>
        <div class="swiper-slide"><img src="https://img.icons8.com/color/96/psychology.png" alt="Psychology"/></div>
        <div class="swiper-slide"><img src="https://img.icons8.com/color/96/test-tube.png" alt="Chemistry"/></div>
        <div class="swiper-slide"><img src="https://img.icons8.com/?size=100&id=9116&format=png&color=000000" alt="Biology"/></div>
        <div class="swiper-slide"><img src="https://img.icons8.com/color/96/physics.png" alt="Physics"/></div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    new Swiper(".logo-ticker", {
      loop: true,
      speed: 4000,
      slidesPerView: "auto",
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      }
    });
  });
</script>
`;

// Insert logo ticker before subjects section
index = index.replace(/(<section class="subjects" id="subjects">)/, logoTicker + "\n$1");

fs.writeFileSync("index.html", index);

