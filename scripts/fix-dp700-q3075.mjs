import fs from "node:fs";
const file = "data/uploaded-interactions.js";
const source = fs.readFileSync(file, "utf8");
const before = '"3075":{"correctLabels":[],"assets":["assets/question-screens/dp-700n3-q075.jpg"],"type":"letter-choice","selectN":2,"optionsOverride":[{"label":"A","text":"B."},{"label":"C","text":"D."}],"unscored":false}';
const after = before.replace('"unscored":false', '"unscored":true');
if (!source.includes(before)) throw new Error("Expected Q3075 record was not found");
fs.writeFileSync(file, source.replace(before, after));
console.log("Marked Q3075 as review-only.");
