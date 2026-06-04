// Article data for the Dimension blog redesign.
const posts = [
  {
    title: "Trash Warrior has rebranded into Dimension",
    excerpt:
      "The San Francisco-based waste management platform secures $8M in funding to expand its technology and services, serving clients like Amazon, Instacart and Hilton.",
    category: "company",
    label: "Company News",
    date: "2024-02-20",
    read: 4,
    g1: "#0f5132",
    g2: "#2f9e6f",
  },
  {
    title: "The Role of Waste Management in Tackling the Impacts of Plastic",
    excerpt:
      "From Bakelite in 1907 to today's packaging, clothing and carpet fibers — plastic is everywhere. Here's how modern waste management can blunt its environmental impact.",
    category: "sustainability",
    label: "Sustainability",
    date: "2024-01-30",
    read: 7,
    g1: "#155e75",
    g2: "#22a3c4",
  },
  {
    title: "Glossary of Waste and Recycling Terms",
    excerpt:
      "Waste management has its own vocabulary. We break down the essential terms every business should know to stay compliant and reduce landfill.",
    category: "guides",
    label: "Guide",
    date: "2024-01-12",
    read: 6,
    g1: "#3f6212",
    g2: "#84cc16",
  },
  {
    title: "The Importance of Waste Compliance for Businesses",
    excerpt:
      "Adhering to waste regulations improves brand image and employee morale while preventing costly fines. Learn how diversion boosts efficiency.",
    category: "business",
    label: "Business",
    date: "2023-12-08",
    read: 5,
    g1: "#0f5132",
    g2: "#3aa76d",
  },
  {
    title: "What Size of Dumpster Should I Choose?",
    excerpt:
      "Choosing the right bin is about more than picking the biggest one. Understand your home or business needs first with this practical sizing guide.",
    category: "guides",
    label: "Guide",
    date: "2023-11-22",
    read: 5,
    g1: "#7c5e10",
    g2: "#c9a86a",
  },
  {
    title: "Nine Amazing Facts About Plastic Recycling",
    excerpt:
      "Once hailed as the original wonder material, plastic powered the post-war economy. Here are nine facts that reframe how we think about recycling it.",
    category: "recycling",
    label: "Recycling",
    date: "2023-11-05",
    read: 4,
    g1: "#1d4ed8",
    g2: "#38bdf8",
  },
  {
    title: "The Circular Economy — What It Means and Why It Matters",
    excerpt:
      "A workable alternative to unrestricted consumption: conservation, repair, salvage and recycling combined into a durable, less demanding model.",
    category: "sustainability",
    label: "Sustainability",
    date: "2023-10-18",
    read: 8,
    g1: "#166534",
    g2: "#4ade80",
  },
  {
    title: "Prospects of Recycling — For 2020 and the Years to Come",
    excerpt:
      "World waste production keeps rising alongside consumerism. We look at where recycling is headed and what it will take to bend the curve.",
    category: "recycling",
    label: "Recycling",
    date: "2023-09-30",
    read: 6,
    g1: "#155e75",
    g2: "#2dd4bf",
  },
  {
    title: "Improving Commercial Waste Management for Your Business",
    excerpt:
      "Discover how waste management software revolutionizes operations and how Dimension provides tailored, sustainable solutions for your company.",
    category: "business",
    label: "Business",
    date: "2023-09-10",
    read: 5,
    g1: "#0f5132",
    g2: "#2f9e6f",
  },
  {
    title: "COVID-19's Effect on Waste Management",
    excerpt:
      "Border closures, remote work and a surge in PPE reshaped the waste stream overnight. We unpack the lasting effects on the industry.",
    category: "company",
    label: "Industry",
    date: "2023-08-15",
    read: 5,
    g1: "#7c2d12",
    g2: "#fb923c",
  },
  {
    title: "Composting Food Waste — Helpful Tips You Need to Know",
    excerpt:
      "The US generates around 40 million tons of food waste a year. Composting is one of the most productive ways to tackle it — here's how to start.",
    category: "guides",
    label: "Guide",
    date: "2023-07-28",
    read: 6,
    g1: "#3f6212",
    g2: "#a3e635",
  },
  {
    title: "Creative Gifts Improvised From Waste",
    excerpt:
      "Whether you care about ocean plastic or believe in the circular economy, it might be time to think outside the (gift) box with upcycled presents.",
    category: "sustainability",
    label: "Sustainability",
    date: "2023-07-02",
    read: 4,
    g1: "#9333ea",
    g2: "#d8b4fe",
  },
  {
    title: "15 Routines Your Business Can Employ to Reduce Waste",
    excerpt:
      "Trash and trade are a package deal in any company. These fifteen habits help cut Municipal Solid Waste and preserve the planet at the same time.",
    category: "business",
    label: "Business",
    date: "2023-06-14",
    read: 7,
    g1: "#0f5132",
    g2: "#34d399",
  },
];

const grid = document.getElementById("postGrid");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const chips = document.getElementById("chips");
const searchInput = document.getElementById("searchInput");

let activeFilter = "all";
let searchTerm = "";

const fmtDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function cardTemplate(p) {
  return `
    <article class="card reveal" data-category="${p.category}">
      <div class="card-media" style="--g1:${p.g1};--g2:${p.g2}">
        <span class="tag">${p.label}</span>
      </div>
      <div class="card-body">
        <h3><a href="#">${p.title}</a></h3>
        <p>${p.excerpt}</p>
        <div class="post-meta">
          <time datetime="${p.date}">${fmtDate(p.date)}</time>
          <span class="dot" aria-hidden="true">•</span>
          <span>${p.read} min read</span>
        </div>
      </div>
    </article>`;
}

function render() {
  const term = searchTerm.trim().toLowerCase();
  const filtered = posts.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.category === activeFilter;
    const matchesSearch =
      !term ||
      p.title.toLowerCase().includes(term) ||
      p.excerpt.toLowerCase().includes(term) ||
      p.label.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  grid.innerHTML = filtered.map(cardTemplate).join("");
  emptyState.hidden = filtered.length !== 0;
  resultCount.textContent = `${filtered.length} article${filtered.length === 1 ? "" : "s"}`;

  observeReveals();
}

// Filter chips
chips.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  chips.querySelectorAll(".chip").forEach((c) => {
    const on = c === btn;
    c.classList.toggle("is-active", on);
    c.setAttribute("aria-selected", String(on));
  });
  render();
});

// Search
searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value;
  render();
});
document.getElementById("searchForm").addEventListener("submit", (e) => e.preventDefault());

// Newsletter (demo, no backend)
const newsletter = document.getElementById("newsletterForm");
newsletter.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = newsletter.querySelector("button");
  btn.textContent = "Subscribed ✓";
  btn.disabled = true;
  newsletter.querySelector("input").value = "";
  setTimeout(() => {
    btn.textContent = "Subscribe";
    btn.disabled = false;
  }, 2500);
});

// Sticky header shadow
const header = document.getElementById("siteHeader");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile nav
const navToggle = document.getElementById("navToggle");
navToggle.addEventListener("click", () => {
  const open = header.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

// Reveal on scroll
let io;
function observeReveals() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    return;
  }
  io = io || new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
}

render();
observeReveals();
