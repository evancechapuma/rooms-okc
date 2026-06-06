/* =============================================
   POST-LISTING.JS — Multi-step form logic
   ============================================= */

let currentStep = 1;
const TOTAL_STEPS = 4;
const uploadedPhotos = [];

function updateStepper() {
  document.querySelectorAll('.step-item').forEach((item, i) => {
    const stepNum = i + 1;
    item.classList.toggle('is-active', stepNum === currentStep);
    item.classList.toggle('is-done',   stepNum < currentStep);
    item.querySelector('.step-item__circle').innerHTML = stepNum < currentStep
      ? '<i class="fa-solid fa-check" aria-hidden="true"></i>'
      : stepNum;
  });

  document.querySelectorAll('.step-connector').forEach((c, i) => {
    c.classList.toggle('is-done', i + 1 < currentStep);
  });

  document.querySelectorAll('.post-step').forEach((panel, i) => {
    panel.classList.toggle('is-active', i + 1 === currentStep);
    panel.setAttribute('aria-hidden', i + 1 !== currentStep ? 'true' : 'false');
  });

  document.getElementById('btn-back').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
  const nextBtn = document.getElementById('btn-next');
  if (currentStep === TOTAL_STEPS) {
    nextBtn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Publish Listing';
    nextBtn.classList.remove('btn--primary');
    nextBtn.classList.add('btn--accent');
  } else {
    nextBtn.innerHTML = 'Next <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
    nextBtn.classList.add('btn--primary');
    nextBtn.classList.remove('btn--accent');
  }

  updateReview();
}

function validateStep(step) {
  const errors = [];
  if (step === 1) {
    const cat = document.getElementById('s1-category').value;
    const title = document.getElementById('s1-title').value.trim();
    const address = document.getElementById('s1-address').value.trim();
    if (!cat)     errors.push(['s1-category', 'Please select a category.']);
    if (!title)   errors.push(['s1-title',    'Please enter a listing title.']);
    if (!address) errors.push(['s1-address',  'Please enter the property address.']);
  }
  if (step === 2) {
    const price = document.getElementById('s2-price').value;
    if (!price || price <= 0) errors.push(['s2-price', 'Please enter a valid price.']);
  }
  if (step === 4) {
    const contact = document.getElementById('s4-contact').value.trim();
    if (!contact) errors.push(['s4-contact', 'Please enter a contact email or phone.']);
  }

  // Clear previous errors
  document.querySelectorAll('.field.is-error').forEach(f => f.classList.remove('is-error'));

  errors.forEach(([id, msg]) => {
    const input = document.getElementById(id);
    if (!input) return;
    const field = input.closest('.field');
    if (field) {
      field.classList.add('is-error');
      let errEl = field.querySelector('.field__error');
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'field__error';
        field.appendChild(errEl);
      }
      errEl.textContent = msg;
      errEl.style.display = 'block';
    }
  });

  if (errors.length) {
    const firstErrId = errors[0][0];
    document.getElementById(firstErrId)?.focus();
    return false;
  }
  return true;
}

function goNext() {
  if (!validateStep(currentStep)) return;
  if (currentStep === TOTAL_STEPS) {
    submitListing();
    return;
  }
  currentStep = Math.min(currentStep + 1, TOTAL_STEPS);
  updateStepper();
  document.querySelector('.post-step.is-active')?.scrollIntoView({ behavior:'smooth', block:'start' });
}

function goBack() {
  currentStep = Math.max(currentStep - 1, 1);
  updateStepper();
}

function updateReview() {
  if (currentStep !== 4) return;
  const vals = {
    category: document.getElementById('s1-category')?.options[document.getElementById('s1-category').selectedIndex]?.text || '—',
    title:    document.getElementById('s1-title')?.value || '—',
    address:  document.getElementById('s1-address')?.value || '—',
    price:    document.getElementById('s2-price')?.value ? '$' + Number(document.getElementById('s2-price').value).toLocaleString() : '—',
    beds:     document.getElementById('s2-beds')?.value || '—',
    baths:    document.getElementById('s2-baths')?.value || '—',
    area:     document.getElementById('s2-area')?.value || '—',
    photos:   uploadedPhotos.length,
  };
  const rv = document.getElementById('review-content');
  if (!rv) return;
  rv.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
      <div><p class="text-muted text-sm">Category</p><p class="font-semibold">${vals.category}</p></div>
      <div><p class="text-muted text-sm">Price</p><p class="font-semibold">${vals.price}</p></div>
      <div style="grid-column:1/-1"><p class="text-muted text-sm">Title</p><p class="font-semibold">${vals.title}</p></div>
      <div style="grid-column:1/-1"><p class="text-muted text-sm">Address</p><p class="font-semibold">${vals.address}</p></div>
      <div><p class="text-muted text-sm">Bedrooms</p><p class="font-semibold">${vals.beds}</p></div>
      <div><p class="text-muted text-sm">Bathrooms</p><p class="font-semibold">${vals.baths}</p></div>
      <div><p class="text-muted text-sm">Area</p><p class="font-semibold">${vals.area} sq ft</p></div>
      <div><p class="text-muted text-sm">Photos</p><p class="font-semibold">${vals.photos} uploaded</p></div>
    </div>`;
}

function submitListing() {
  const contact = document.getElementById('s4-contact')?.value.trim();
  if (!contact) { validateStep(4); return; }

  // Show success state
  const form = document.getElementById('post-form');
  const success = document.getElementById('success-state');
  if (form)    form.style.display    = 'none';
  if (success) success.style.display = 'block';

  showToast('Listing published successfully!', 'success');
}

function initUploadZone() {
  const zone    = document.getElementById('upload-zone');
  const fileInput = document.getElementById('photo-input');
  const previews  = document.getElementById('photo-previews');

  if (!zone || !fileInput) return;

  zone.addEventListener('click', () => fileInput.click());
  zone.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') fileInput.click(); });

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('is-dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('is-dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('is-dragover');
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', () => handleFiles(fileInput.files));

  function handleFiles(files) {
    [...files].forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        uploadedPhotos.push(e.target.result);
        renderPreviews();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderPreviews() {
    previews.innerHTML = uploadedPhotos.map((src, i) => `
      <div class="photo-preview">
        <img src="${src}" alt="Upload preview ${i+1}">
        <button class="photo-preview__remove" onclick="removePhoto(${i})" aria-label="Remove photo ${i+1}">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>`).join('');
  }
}

window.removePhoto = function(i) {
  uploadedPhotos.splice(i, 1);
  document.getElementById('photo-previews').innerHTML = uploadedPhotos.map((src, j) => `
    <div class="photo-preview">
      <img src="${src}" alt="Upload preview ${j+1}">
      <button class="photo-preview__remove" onclick="removePhoto(${j})" aria-label="Remove photo ${j+1}">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>`).join('');
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-next')?.addEventListener('click', goNext);
  document.getElementById('btn-back')?.addEventListener('click', goBack);
  updateStepper();
  initUploadZone();
});
