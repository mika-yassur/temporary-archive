const axios = require("axios");
const fs = require("fs");

const CHANNEL_SLUG = "projecting-u7wxfxxcbrk";

async function fetchArena() {
  const url = `https://api.are.na/v2/channels/${CHANNEL_SLUG}?per=100`;

  try {
    const res = await axios.get(url);
    const blocks = res.data.contents;

    const simplified = blocks.map(b => ({
      id: b.id,
      type: b.class,         // "Link", "Image", "Text"
      title: b.title || "",
      url: b.source?.url || null,
      image: b.image?.large?.url || null
    }));

    fs.writeFileSync("arena-data.json", JSON.stringify(simplified, null, 2));
    console.log("Saved → arena-data.json");
  } catch (err) {
    console.error("Error fetching Are.na data:", err.message);
  }
}

fetchArena();
