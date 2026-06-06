/* =============================================
   LISTINGS.JS — Client-side filtering & sorting
   ============================================= */

const LISTINGS_DATA = [
  { id:1,  price:285000, priceDisplay:'$285,000',       label:'For Sale',  type:'sale',   title:'Modern 3-Bed Family Home',          loc:'Greenwood Heights', beds:3, baths:2, area:1450, lister:'Owner', img:1  },
  { id:2,  price:1850,   priceDisplay:'$1,850/mo',       label:'For Rent',  type:'rent',   title:'Bright City Centre Apartment',      loc:'Downtown Core',    beds:2, baths:1, area:820,  lister:'Agent', img:2  },
  { id:3,  price:620,    priceDisplay:'$620/mo',          label:'Shared',    type:'shared', title:'Cosy Room in Shared House',         loc:'Riverside Quarter', beds:1, baths:1, area:220,  lister:'Owner', img:3  },
  { id:4,  price:95,     priceDisplay:'$95/night',        label:'Short-Term',type:'short',  title:'Stylish Studio with Balcony',       loc:'Marina District',  beds:1, baths:1, area:480,  lister:'Owner', img:4  },
  { id:5,  price:540000, priceDisplay:'$540,000',         label:'For Sale',  type:'sale',   title:'Spacious 5-Bed Villa with Pool',   loc:'Oak Hill Estate',  beds:5, baths:4, area:3200, lister:'Agent', img:5  },
  { id:6,  price:1200,   priceDisplay:'$1,200/mo',        label:'For Rent',  type:'rent',   title:'2-Bed Townhouse Near Park',         loc:'Northgate',        beds:2, baths:2, area:1050, lister:'Agent', img:6  },
  { id:7,  price:420000, priceDisplay:'$420,000',         label:'For Sale',  type:'sale',   title:'Contemporary Semi-Detached House', loc:'Elmwood Park',     beds:4, baths:3, area:2100, lister:'Owner', img:7  },
  { id:8,  price:750,    priceDisplay:'$750/mo',           label:'For Rent',  type:'rent',   title:'Charming 1-Bed Garden Flat',        loc:'South End',        beds:1, baths:1, area:550,  lister:'Owner', img:8  },
  { id:9,  price:850,    priceDisplay:'$850/mo',           label:'Shared',    type:'shared', title:'Double Room in Modern Flat Share',  loc:'University Quarter',beds:1,baths:1, area:190,  lister:'Owner', img:9  },
  { id:10, price:130,    priceDisplay:'$130/night',        label:'Short-Term',type:'short',  title:'Luxury Penthouse Weekend Escape',   loc:'City Skyline',     beds:2, baths:2, area:900,  lister:'Agent', img:10 },
  { id:11, price:195000, priceDisplay:'$195,000',         label:'For Sale',  type:'sale',   title:'First-Time Buyer Starter Home',    loc:'Willowbrook',      beds:2, baths:1, area:880,  lister:'Agent', img:11 },
  { id:12, price:2400,   priceDisplay:'$2,400/mo',        label:'For Rent',  type:'rent',   title:'Executive 3-Bed with Parking',     loc:'Business Bay',     beds:3, baths:2, area:1600, lister:'Agent', img:12 },
  { id:13, price:380000, priceDisplay:'$380,000',         label:'For Sale',  type:'sale',   title:'Victorian Terrace with Garden',    loc:'Heritage Lane',    beds:3, baths:2, area:1700, lister:'Owner', img:13 },
  { id:14, price:500,    priceDisplay:'$500/mo',           label:'Shared',    type:'shared', title:'Single Room, Bills Included',       loc:'East Village',     beds:1, baths:1, area:160,  lister:'Owner', img:14 },
  { id:15, price:75,     priceDisplay:'$75/night',         label:'Short-Term',type:'short',  title:'Cosy Cottage by the Canal',         loc:'Waterside',        beds:2, baths:1, area:650,  lister:'Owner', img:15 },
  { id:16, price:690000, priceDisplay:'$690,000',         label:'For Sale',  type:'sale',   title:'Architect-Designed Eco House',     loc:'Green Meadows',    beds:4, baths:3, area:2600, lister:'Agent', img:16 },
];

const PAGE_SIZE = 9;
let currentPage = 1;
let filteredData = [...LISTINGS_DATA];

const typeClass   = { sale:'sale', rent:'rent', shared:'shared', short:'short' };
const listerClass = { Owner:'badge--owner', Agent:'badge--agent' };
const listerMod   = { Owner:'owner', Agent:'agent' };
const listerIcon  = { Owner:'fa-user', Agent:'fa-briefcase' };

function getFilters() {
  return {
    type:     document.getElementById('f-type')?.value     || '',
    minPrice: parseInt(document.getElementById('f-min-price')?.value) || 0,
    maxPrice: parseInt(document.getElementById('f-max-price')?.value) || Infinity,
    beds:     parseInt(document.getElementById('f-beds')?.value) || 0,
    baths:    parseInt(document.getElementById('f-baths')?.value) || 0,
    sort:     document.getElementById('f-sort')?.value     || 'newest',
    q:        (document.getElementById('search-q')?.value || '').toLowerCase().trim(),
  };
}

function applyFilters() {
  const f = getFilters();
  filteredData = LISTINGS_DATA.filter(p => {
    if (f.type && p.type !== f.type) return false;
    if (p.price < f.minPrice) return false;
    if (p.price > f.maxPrice) return false;
    if (f.beds  && p.beds  < f.beds)  return false;
    if (f.baths && p.baths < f.baths) return false;
    if (f.q && !p.title.toLowerCase().includes(f.q) && !p.loc.toLowerCase().includes(f.q)) return false;
    return true;
  });

  switch (f.sort) {
    case 'price-asc':  filteredData.sort((a,b) => a.price - b.price); break;
    case 'price-desc': filteredData.sort((a,b) => b.price - a.price); break;
    default: filteredData.sort((a,b) => b.id - a.id); // newest first
  }

  currentPage = 1;
  renderResults();
  renderActiveChips(f);
}

function renderResults() {
  const grid = document.getElementById('results-grid');
  const count = document.getElementById('results-count');
  if (!grid) return;

  const total = filteredData.length;
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filteredData.slice(start, start + PAGE_SIZE);

  if (count) count.innerHTML = `<strong>${total}</strong> properties found`;

  if (total === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state__icon"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></div>
        <h3 class="empty-state__title">No results found</h3>
        <p class="empty-state__text">Try adjusting your filters or searching a different location.</p>
        <button class="btn btn--primary" onclick="clearAllFilters()">Clear Filters</button>
      </div>`;
    document.getElementById('pagination')?.replaceChildren();
    return;
  }

  grid.innerHTML = page.map(p => `
    <article class="card-listing" onclick="window.location='listing-detail.html'">
      <div class="card-listing__img-wrap">
        <img src="https://picsum.photos/seed/prop${p.img}/800/600" alt="${p.title}" class="card-listing__img" loading="lazy" width="800" height="600">
        <div class="card-listing__badges">
          <span class="badge badge--${typeClass[p.type]}">${p.label}</span>
        </div>
        <span class="card-listing__lister card-listing__lister--${listerMod[p.lister]}"><i class="fa-solid ${listerIcon[p.lister]}" aria-hidden="true"></i>${p.lister}</span>
        <button class="card-listing__fav" aria-label="Save to favourites">
          <i class="fa-regular fa-heart" aria-hidden="true"></i>
        </button>
      </div>
      <div class="card-listing__body">
        <div class="card-listing__price">${p.priceDisplay}</div>
        <h3 class="card-listing__title">${p.title}</h3>
        <p class="card-listing__location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${p.loc}</p>
        <div class="card-listing__meta">
          <span class="card-listing__meta-item"><i class="fa-solid fa-bed" aria-hidden="true"></i><span><strong>${p.beds}</strong> bed${p.beds>1?'s':''}</span></span>
          <span class="card-listing__meta-item"><i class="fa-solid fa-bath" aria-hidden="true"></i><span><strong>${p.baths}</strong> bath</span></span>
          <span class="card-listing__meta-item"><i class="fa-solid fa-ruler-combined" aria-hidden="true"></i><span><strong>${p.area.toLocaleString()}</strong> ft²</span></span>
        </div>
      </div>
    </article>`).join('');

  // Re-init fav buttons
  if (typeof initFavButtons === 'function') initFavButtons();

  renderPagination(total);
}

function renderPagination(total) {
  const pag = document.getElementById('pagination');
  if (!pag) return;
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) { pag.innerHTML = ''; return; }

  let html = `<button class="pagination__btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''} aria-label="Previous page"><i class="fa-solid fa-chevron-left"></i></button>`;

  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - currentPage) <= 1) {
      html += `<button class="pagination__btn ${i===currentPage?'is-active':''}" onclick="goPage(${i})" aria-label="Page ${i}" aria-current="${i===currentPage?'page':false}">${i}</button>`;
    } else if (Math.abs(i - currentPage) === 2) {
      html += `<span class="pagination__btn" aria-hidden="true" style="pointer-events:none">…</span>`;
    }
  }

  html += `<button class="pagination__btn" onclick="goPage(${currentPage+1})" ${currentPage===pages?'disabled':''} aria-label="Next page"><i class="fa-solid fa-chevron-right"></i></button>`;
  pag.innerHTML = html;
}

function goPage(n) {
  const pages = Math.ceil(filteredData.length / PAGE_SIZE);
  if (n < 1 || n > pages) return;
  currentPage = n;
  renderResults();
  document.getElementById('results-grid')?.scrollIntoView({ behavior:'smooth', block:'start' });
}

function renderActiveChips(f) {
  const wrap = document.getElementById('active-chips');
  if (!wrap) return;
  const chips = [];
  const labels = { sale:'Buy', rent:'Rent', shared:'Shared', short:'Short-Term' };
  if (f.type)                chips.push({ label: labels[f.type] || f.type, key:'type' });
  if (f.minPrice > 0)        chips.push({ label:`Min $${f.minPrice.toLocaleString()}`, key:'minPrice' });
  if (f.maxPrice < Infinity) chips.push({ label:`Max $${f.maxPrice.toLocaleString()}`, key:'maxPrice' });
  if (f.beds > 0)            chips.push({ label:`${f.beds}+ beds`, key:'beds' });
  if (f.baths > 0)           chips.push({ label:`${f.baths}+ baths`, key:'baths' });
  if (f.q)                   chips.push({ label:`"${f.q}"`, key:'q' });

  wrap.innerHTML = chips.map(c => `
    <span class="chip">${c.label}
      <button class="chip__remove" onclick="removeChip('${c.key}')" aria-label="Remove ${c.label} filter">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </span>`).join('');
}

function removeChip(key) {
  const map = { type:'f-type', minPrice:'f-min-price', maxPrice:'f-max-price', beds:'f-beds', baths:'f-baths', q:'search-q' };
  const el = document.getElementById(map[key]);
  if (el) { el.value = ''; if (key==='maxPrice') el.value=''; }
  applyFilters();
}

function clearAllFilters() {
  ['f-type','f-min-price','f-max-price','f-beds','f-baths','search-q'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  applyFilters();
}

function initFilters() {
  // Wire up all filter inputs
  ['f-type','f-beds','f-baths','f-sort'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', applyFilters);
  });

  ['f-min-price','f-max-price','search-q'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      clearTimeout(window._filterTimer);
      window._filterTimer = setTimeout(applyFilters, 300);
    });
  });

  // Price range sliders
  const sliderMin = document.getElementById('slider-min');
  const sliderMax = document.getElementById('slider-max');
  if (sliderMin) {
    sliderMin.addEventListener('input', () => {
      document.getElementById('f-min-price').value = sliderMin.value;
      applyFilters();
    });
  }
  if (sliderMax) {
    sliderMax.addEventListener('input', () => {
      document.getElementById('f-max-price').value = sliderMax.value;
      applyFilters();
    });
  }

  // Save search toast
  document.getElementById('save-search-btn')?.addEventListener('click', () => {
    showToast('Search saved! You\'ll get alerts for new matches.', 'success');
  });

  // Mobile filter drawer
  const openBtn  = document.getElementById('open-filters');
  const closeBtn = document.getElementById('close-filters');
  const drawer   = document.getElementById('filter-drawer');
  openBtn?.addEventListener('click', () => drawer?.classList.add('is-open'));
  closeBtn?.addEventListener('click', () => drawer?.classList.remove('is-open'));
  drawer?.addEventListener('click', e => { if (e.target === drawer) drawer.classList.remove('is-open'); });

  // View toggle grid/list
  document.querySelectorAll('.view-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-toggle__btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  // Read URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('type')) {
    const el = document.getElementById('f-type');
    if (el) el.value = params.get('type');
  }
  if (params.get('q')) {
    const el = document.getElementById('search-q');
    if (el) el.value = params.get('q');
  }

  applyFilters();
}

document.addEventListener('DOMContentLoaded', initFilters);
