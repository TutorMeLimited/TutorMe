
const fs = require("fs");
let index = fs.readFileSync("index.html", "utf8");

// Biology
index = index.replace(/<li>Cell Biology<\/li>/g, "<li>🧬 Cell Biology</li>");
index = index.replace(/<li>Organisation<\/li>/g, "<li>🔬 Organisation</li>");
index = index.replace(/<li>Infection and Response<\/li>/g, "<li>🦠 Infection and Response</li>");
index = index.replace(/<li>Bioenergetics<\/li>/g, "<li>🌱 Bioenergetics</li>");
index = index.replace(/<li>Homeostasis and Response<\/li>/g, "<li>🧠 Homeostasis and Response</li>");
index = index.replace(/<li>Inheritance and Variation<\/li>/g, "<li>🧬 Inheritance and Variation</li>");
index = index.replace(/<li>Ecology<\/li>/g, "<li>🌍 Ecology</li>");

// Chemistry
index = index.replace(/<li>Atomic Structure<\/li>/g, "<li>⚛️ Atomic Structure</li>");
index = index.replace(/<li>Bonding<\/li>/g, "<li>🔗 Bonding</li>");
index = index.replace(/<li>Quantitative Chemistry<\/li>/g, "<li>⚖️ Quantitative Chemistry</li>");
index = index.replace(/<li>Chemical Changes<\/li>/g, "<li>🧪 Chemical Changes</li>");
index = index.replace(/<li>Energy Changes<\/li>/g, "<li>⚡ Energy Changes</li>");
index = index.replace(/<li>Rate of Reaction<\/li>/g, "<li>⏱️ Rate of Reaction</li>");
index = index.replace(/<li>Organic Chemistry<\/li>/g, "<li>🛢️ Organic Chemistry</li>");
index = index.replace(/<li>Chemical Analysis<\/li>/g, "<li>🔎 Chemical Analysis</li>");
index = index.replace(/<li>Chemistry of the Atmosphere<\/li>/g, "<li>☁️ Chemistry of the Atmosphere</li>");
index = index.replace(/<li>Using Resources<\/li>/g, "<li>🌍 Using Resources</li>");

// Physics
index = index.replace(/<li>Energy<\/li>/g, "<li>⚡ Energy</li>");
index = index.replace(/<li>Electricity<\/li>/g, "<li>💡 Electricity</li>");
index = index.replace(/<li>Particle Model of Matter<\/li>/g, "<li>🧊 Particle Model of Matter</li>");
// Atomic structure already handled above for chemistry, it will match Physics too.
index = index.replace(/<li>Forces<\/li>/g, "<li>🚀 Forces</li>");
index = index.replace(/<li>Waves<\/li>/g, "<li>🌊 Waves</li>");
index = index.replace(/<li>Magnetism and Electromagnetism<\/li>/g, "<li>🧲 Magnetism and Electromagnetism</li>");
index = index.replace(/<li>Space Physics<\/li>/g, "<li>🌌 Space Physics</li>");

// Sociology
index = index.replace(/<li>Research Methods<\/li>/g, "<li>📊 Research Methods</li>");
index = index.replace(/<li>Families and Households<\/li>/g, "<li>👨‍👩‍👧‍👦 Families and Households</li>");
index = index.replace(/<li>Education<\/li>/g, "<li>🏫 Education</li>");
index = index.replace(/<li>Crime and Deviance<\/li>/g, "<li>🚓 Crime and Deviance</li>");
index = index.replace(/<li>Social Stratification<\/li>/g, "<li>📉 Social Stratification</li>");
index = index.replace(/<li>Theory and Methods<\/li>/g, "<li>📚 Theory and Methods</li>");
index = index.replace(/<li>Methods in Context<\/li>/g, "<li>📝 Methods in Context</li>");
index = index.replace(/<li>Beliefs in Society<\/li>/g, "<li>⛪ Beliefs in Society</li>");

// Psychology
// Research methods already handled above
index = index.replace(/<li>Approaches<\/li>/g, "<li>🧠 Approaches</li>");
index = index.replace(/<li>Biopsychology<\/li>/g, "<li>🧬 Biopsychology</li>");
index = index.replace(/<li>Social Influence<\/li>/g, "<li>👥 Social Influence</li>");
index = index.replace(/<li>Memory<\/li>/g, "<li>💭 Memory</li>");
index = index.replace(/<li>Attachment<\/li>/g, "<li>👶 Attachment</li>");
index = index.replace(/<li>Aggression<\/li>/g, "<li>😡 Aggression</li>");
index = index.replace(/<li>Issues and Debates<\/li>/g, "<li>🤔 Issues and Debates</li>");
index = index.replace(/<li>Clinical Psychology and Mental Health<\/li>/g, "<li>⚕️ Clinical Psychology and Mental Health</li>");

fs.writeFileSync("index.html", index);
console.log("Done adding emojis");

