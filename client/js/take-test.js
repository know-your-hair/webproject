const POROSITY_COPY = {
  high: 'High-porosity hair has raised or gapped cuticles, so it absorbs moisture fast but loses it just as quickly. Focus on sealing with butters and oils after every wash.',
  medium: 'Medium-porosity hair holds moisture well and generally responds to most products. A light, consistent routine is usually enough to keep it healthy.',
  low: 'Low-porosity hair has tightly packed cuticles that resist moisture. Use lightweight, water-based products and apply heat to help products absorb.',
};

// null = not answered yet, 'skip' = skipped, or a porosity value
const selections = { float: null, spray: null };

function wireGroup(groupId, key) {
  const group = document.getElementById(groupId);
  group.querySelectorAll('.result-choice').forEach((btn) => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.result-choice').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selections[key] = btn.dataset.porosity;
      document.getElementById(`nudge-${key}`).style.display = 'none';
      maybeShowResult();
    });
  });
}

function wireSkip(buttonId, key) {
  document.getElementById(buttonId).addEventListener('click', () => {
    selections[key] = 'skip';
    // Show the nudge only if the OTHER test hasn't been answered with a real result yet
    const other = key === 'float' ? 'spray' : 'float';
    document.getElementById(`nudge-${key}`).style.display =
      selections[other] && selections[other] !== 'skip' ? 'none' : 'block';
    maybeShowResult();
  });
}

function resolvePorosity() {
  const real = ['float', 'spray']
    .map((k) => selections[k])
    .filter((v) => v && v !== 'skip');

  if (real.length === 0) return null; // need at least one real answer
  if (real.length === 1) return real[0];

  const [float, spray] = [selections.float, selections.spray];
  if (float === spray) return float;
  if (float === 'medium') return spray;
  if (spray === 'medium') return float;
  return float; // conflicting high/low: trust the float test
}

async function maybeShowResult() {
  // Both fields need to be "resolved" — answered or skipped — before showing anything
  if (!selections.float || !selections.spray) return;

  const porosity = resolvePorosity();
  if (!porosity) return; // both were skipped, nothing to show yet

  const banner = document.getElementById('result-banner');
  document.getElementById('result-heading').textContent =
    porosity === 'high' ? 'High Porosity' : porosity === 'medium' ? 'Medium Porosity' : 'Low Porosity';
  document.getElementById('result-copy').textContent = POROSITY_COPY[porosity];
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
  wireSkip('skip-float', 'float');
  wireSkip('skip-spray', 'spray');
});
