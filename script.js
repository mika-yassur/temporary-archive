/*****************************************************
 * 1. LOAD + MERGE ARENA DATA WITH TAG TEMPLATE
 *****************************************************/
async function loadData() {
  // Load content items
  const items = await fetch("arena-data.json").then(r => r.json());

  // Load tag definitions (your partially-filled file)
  const tagTemplate = await fetch("tag-template.json").then(r => r.json());

  // Create lookup table: { itemID → [tags] }
  const tagMap = Object.fromEntries(
    tagTemplate.map(t => [t.id, t.tags])
  );

  // Merge tags onto items; items without tags get []
  const merged = items.map(item => ({
    ...item,
    tags: tagMap[item.id] || []
  }));

  return merged;
}


/*****************************************************
 * 2. BUILD TAG SIDEBAR (AUTO-GENERATED FROM TAGS)
 *****************************************************/
function buildTagSidebar(items) {
  const sidebar = document.getElementById("tag-sidebar");
  sidebar.innerHTML = "";

  // Collect all tags across all items
  const tagSet = new Set();
  items.forEach(item => item.tags.forEach(t => tagSet.add(t)));

  // Create a button for each tag
  [...tagSet].sort().forEach(tag => {
    const btn = document.createElement("button");
    btn.className = "tag-button";
    btn.textContent = tag;

    btn.onclick = () => activateTag(tag);
    sidebar.appendChild(btn);
  });
}


/*****************************************************
 * 3. TAG CLICK → SORT ITEMS (“JUMP TO TOP”)
 *****************************************************/
function activateTag(tag) {
  // Copy array so we don't mutate original
  const sorted = [...window.ALL_ITEMS].sort((a, b) => {
    const aHas = a.tags.includes(tag);
    const bHas = b.tags.includes(tag);

    if (aHas && !bHas) return -1; // a goes up
    if (!aHas && bHas) return 1;  // b goes up
    return 0;                     // keep relative order
  });

  // Rebuild layout with new order
  buildCollage(sorted);
}

/*****************************************************
 * 4. COLLAGE BUILDER (your original code, slightly tuned)
 *****************************************************/
function buildCollage(items) {
  const container = document.getElementById("collage");
  container.innerHTML = ""; // clear old layout

  let zCounter = 1;

  items.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "card";

    /***** POSITIONING — condensed vertical, scattered horizontal *****/
    const x = Math.random() * (window.innerWidth - 380);
    const y = (i * 180) + (Math.random() * 80);

    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
    card.style.zIndex = zCounter++;
    card.style.borderRadius = "0px"; // square corners


    /***** TITLE *****/
    const titleEl = document.createElement("div");
    titleEl.className = "card-title";
    titleEl.textContent = item.title || "(no title)";
    card.appendChild(titleEl);


    /***** IMAGE ITEMS *****/
    if (item.type === "Image" && item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.style.borderRadius = "0px";
      img.style.width = "100%";
      img.style.height = "auto";
      card.appendChild(img);
    }


/***** LINK ITEMS (iframe, with fallback) *****/
if (item.type === "Link" && item.url) {
  const iframe = document.createElement("iframe");
  iframe.src = item.url;
  iframe.style.borderRadius = "0px";
  iframe.style.width = "100%";
  iframe.style.height = "250px";

      // fallback for blocked iframe
      const fallback = document.createElement("div");
      fallback.textContent = "Preview unavailable";
      fallback.style.height = "250px";
      fallback.style.display = "flex";
      fallback.style.alignItems = "center";
      fallback.style.justifyContent = "center";
      fallback.style.color = "#555";
      fallback.style.fontStyle = "italic";
      fallback.style.background = "#eee";

      iframe.onerror = () => {
        iframe.remove();
        card.appendChild(fallback);
      };

      card.appendChild(iframe);
    }


    /***** DRAGGING *****/
    enableDragging(card, () => {
      card.style.zIndex = ++zCounter;
    });

    container.appendChild(card);
  });
}


/*****************************************************
 * 5. DRAGGING LOGIC (your original)
 *****************************************************/
function enableDragging(el, onActivate) {
  let offsetX = 0, offsetY = 0;
  let dragging = false;

  el.addEventListener("mousedown", (e) => {
    dragging = true;
    onActivate();
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
}


/*****************************************************
 * 6. INITIALIZATION
 *****************************************************/
loadData().then(items => {
  window.ALL_ITEMS = items;        // store globally
  buildTagSidebar(items);          // build tag UI
  buildCollage(items);             // draw collage
});