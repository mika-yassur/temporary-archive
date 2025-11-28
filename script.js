async function loadArena() {
  const res = await fetch("arena-data.json");
  const items = await res.json();
  buildCollage(items);
}

function buildCollage(items) {
  const container = document.getElementById("collage");

  let zCounter = 1;

  items.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "card";

    // condensed vertical + controlled horizontal scatter
    const x = Math.random() * (window.innerWidth - 380); // smaller width spacing
    const y = (i * 180) + (Math.random() * 80);          // condensed vertical
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
    card.style.zIndex = zCounter++;

    // square corners
    card.style.borderRadius = "0px";

    // card title
    const titleEl = document.createElement("div");
    titleEl.className = "card-title";
    titleEl.textContent = item.title || "(no title)";
    card.appendChild(titleEl);

    // image block
    if (item.type === "Image" && item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.style.borderRadius = "0px";   // square
      img.style.width = "100%";         // fit card width
      img.style.height = "auto";        // maintain aspect ratio
      card.appendChild(img);
    }

    // link block (iframe)
    if (item.type === "Link" && item.url) {
      const iframe = document.createElement("iframe");
      iframe.src = item.url;
      iframe.style.borderRadius = "0px";  // square
      iframe.style.width = "100%";        // fit card width
      iframe.style.height = "250px";      // fixed height

      // fallback if iframe blocked
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

    enableDragging(card, () => {
      card.style.zIndex = ++zCounter; // bring to front
    });

    container.appendChild(card);
  });
}

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

loadArena();
