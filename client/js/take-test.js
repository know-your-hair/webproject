// take-test.js — records float/spray test answers, resolves a porosity
// result, and saves it (locally always, to the backend if logged in).

const PORosity_COPY = {
  high: 'High-porosity hair has raised or gapped cuticles, so it absorbs moisture fast but loses it just as quickly. Focus on sealing with butters and oils after every wash.',
  medium: 'Medium-porosity hair holds moisture well and generally responds to most products. A light, consistent routine is usually enough to keep it healthy.',
  low: 'Low-porosity hair has tightly packed cuticles that resist moisture. Use lightweight, water-based products and apply heat to help products absorb.',
};

const selections = { float: null, spray: null };

function wireGroup(groupId, key) {
  const group = document.getElementById(groupId);
  group.querySelectorAll('.result-choice').forEach((btn) => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.result-choice').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selections[key] = btn.dataset.porosity;
      maybeShowResult();
    });
  });
}

function resolvePorosity() {
  const { float, spray } = selections;
  if (!float || !spray) return null;
  if (float === spray) return float;
  // If they disagree, favor whichever isn't "medium" (medium = default/no strong signal)
  if (float === 'medium') return spray;
  if (spray === 'medium') return float;
  return float; // conflicting high/low: trust the float test
}

async function maybeShowResult() {
  const porosity = resolvePorosity();
  if (!porosity) return;

  const banner = document.getElementById('result-banner');
  document.getElementById('result-heading').textContent =
    porosity === 'high' ? 'High Porosity' : porosity === 'medium' ? 'Medium Porosity' : 'Low Porosity';
  document.getElementById('result-copy').textContent = PORosity_COPY[porosity];
  banner.classList.add('show');
  banner.scrollIntoView({ behavior: 'smooth', block: 'center' });

  KYH.setPorosity(porosity);

  if (KYH.getToken()) {
    try { await KYH.api.saveTestResult(porosity); } catch (e) { /* non-blocking */ }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  wireGroup('float-choices', 'float');
  wireGroup('spray-choices', 'spray');
});
