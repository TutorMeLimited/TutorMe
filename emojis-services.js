
const fs = require("fs");
let index = fs.readFileSync("Our-services.html", "utf8");

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

fs.writeFileSync("Our-services.html", index);
console.log("Done");

