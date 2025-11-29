// build-tag-template.js (CommonJS)
const fs = require("fs");
const path = require("path");

console.log("Running build-tag-template.js");

const filePath = path.join(__dirname, "arena-data.json");

if (!fs.existsSync(filePath)) {
  console.error("ERROR: arena-data.json not found in", __dirname);
  process.exit(1);
}

let raw;
try {
  raw = fs.readFileSync(filePath, "utf8");
} catch (e) {
  console.error("ERROR reading arena-data.json:", e.message);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error("ERROR parsing arena-data.json:", e.message);
  process.exit(1);
}

if (!Array.isArray(data)) {
  console.error("ERROR: expected arena-data.json to be an array of items.");
  process.exit(1);
}

const template = data.map(item => ({
  id: item.id,
  title: item.title || "",
  tags: []
}));

const outPath = path.join(__dirname, "tag-template.json");
try {
  fs.writeFileSync(outPath, JSON.stringify(template, null, 2), "utf8");
  console.log("Success → created tag-template.json with", template.length, "entries.");
} catch (e) {
  console.error("ERROR writing tag-template.json:", e.message);
  process.exit(1);
}
