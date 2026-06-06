/* =============================================
   CALCULATOR.JS — Affordability / mortgage math
   ============================================= */

function fmt(n) {
  return '$' + Math.round(n).toLocaleString();
}

function calc() {
  const price   = parseFloat(document.getElementById('c-price').value)   || 0;
  const dpMode  = document.querySelector('input[name="dp-mode"]:checked')?.value || 'percent';
  const dpRaw   = parseFloat(document.getElementById('c-down').value)     || 0;
  const rate    = parseFloat(document.getElementById('c-rate').value)     || 0;
  const term    = parseFloat(document.getElementById('c-term').value)     || 30;
  const taxYr   = parseFloat(document.getElementById('c-tax').value)      || 0;
  const insYr   = parseFloat(document.getElementById('c-ins').value)      || 0;

  // Down payment can be a % of price or an absolute amount
  const downAmount = dpMode === 'percent' ? price * (dpRaw / 100) : dpRaw;
  const downPct    = price > 0 ? (downAmount / price) * 100 : 0;
  const principal  = Math.max(price - downAmount, 0);

  const monthlyRate = rate / 100 / 12;
  const n = term * 12;

  let monthlyPI;
  if (monthlyRate === 0) {
    monthlyPI = n > 0 ? principal / n : 0;
  } else {
    monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) /
                (Math.pow(1 + monthlyRate, n) - 1);
  }
  if (!isFinite(monthlyPI) || isNaN(monthlyPI)) monthlyPI = 0;

  // Split P&I into principal vs interest for the FIRST month (illustrative)
  const firstInterest  = principal * monthlyRate;
  const firstPrincipal = Math.max(monthlyPI - firstInterest, 0);

  const monthlyTax = taxYr / 12;
  const monthlyIns = insYr / 12;
  const totalMonthly = monthlyPI + monthlyTax + monthlyIns;

  // Update big number + breakdown
  document.getElementById('c-monthly').textContent = fmt(totalMonthly);
  document.getElementById('c-loan-amt').textContent = fmt(principal);
  document.getElementById('c-down-summary').textContent =
    fmt(downAmount) + ' (' + downPct.toFixed(1) + '%)';

  document.getElementById('bd-principal').textContent = fmt(firstPrincipal);
  document.getElementById('bd-interest').textContent  = fmt(firstInterest);
  document.getElementById('bd-tax').textContent       = fmt(monthlyTax + monthlyIns);

  // Visual bar — proportions of the total monthly payment
  const denom = totalMonthly || 1;
  const pPct = (firstPrincipal / denom) * 100;
  const iPct = (firstInterest  / denom) * 100;
  const tPct = ((monthlyTax + monthlyIns) / denom) * 100;
  document.querySelector('.calc-bar__seg--principal').style.width = pPct + '%';
  document.querySelector('.calc-bar__seg--interest').style.width  = iPct + '%';
  document.querySelector('.calc-bar__seg--tax').style.width       = tPct + '%';
}

function syncDownLabel() {
  const mode = document.querySelector('input[name="dp-mode"]:checked')?.value || 'percent';
  const input = document.getElementById('c-down');
  const suffix = document.getElementById('down-suffix');
  if (mode === 'percent') {
    suffix.textContent = '%';
    if (parseFloat(input.value) > 100) input.value = 20;
  } else {
    suffix.textContent = '$';
  }
  calc();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#calc-form input, #calc-form select')
    .forEach(el => el.addEventListener('input', calc));
  document.querySelectorAll('input[name="dp-mode"]')
    .forEach(el => el.addEventListener('change', syncDownLabel));
  calc();
});
