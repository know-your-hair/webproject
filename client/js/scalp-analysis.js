// scalp-analysis.js — rule-based tips from the form, saved via /api/scalp when logged in.
// Flags a "consult a doctor" warning when answers indicate a serious concern.

function buildTips({ flakiness, itchiness, oiliness }) {
  const tips = [];
  if (flakiness === 'heavy') tips.push('Heavy or persistent flaking can be dandruff or a scalp condition — an anti-dandruff shampoo (or a dermatologist visit) is worth trying.');
  else if (flakiness === 'mild') tips.push('Mild flaking is often just dryness — try a gentle, weekly scalp exfoliation before shampooing.');

  if (itchiness === 'frequent') tips.push('Frequent itchiness alongside flaking or redness is worth having a dermatologist look at.');
  else if (itchiness === 'mild') tips.push('Mild itchiness can come from product buildup — try a clarifying wash every few weeks.');

  if (oiliness === 'oily') tips.push('If your scalp gets oily fast, wash roots more frequently and keep heavy oils/butters off the scalp itself.');
  else if (oiliness === 'dry') tips.push('A scalp that stays dry benefits from a lightweight scalp oil massaged in a few times a week.');
  else tips.push('Balanced oil production — keep doing what you\'re doing and reassess if anything changes.');

  return tips;
}

function isSevere({ flakiness, itchiness }) {
  // Flag as "bad" when flaking is heavy AND itchiness is at least mild,
  // or itchiness is frequent on its own.
  return (flakiness === 'heavy' && itchiness !== 'none') || itchiness === 'frequent';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('scalp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      flakiness: document.getElementById('flakiness').value,
      itchiness: document.getElementById('itchiness').value,
      oiliness: document.getElementById('oiliness').value,
      notes: document.getElementById('notes').value,
    };
    const tips = buildTips(payload);
    const severe = isSevere(payload);
    const resultEl = document.getElementById('scalp-result');

    resultEl.innerHTML = `
      ${severe ? `
        <div class="porosity-banner show" style="background:var(--clay);margin-top:30px">
          <p class="eyebrow" style="color:#f7e9e2">Please consider seeing a doctor</p>
          <h3>Your answers suggest something worth having checked</h3>
          <p>Heavy flaking combined with itchiness (or frequent itchiness on its own) can point to a scalp condition that's best handled by a dermatologist rather than home care alone.</p>
          <a href="/pages/consult-doctor.html" class="btn btn-primary" style="background:#fbf8f0;color:var(--clay)">Book a doctor's appointment →</a>
        </div>` : ''}
      <div class="routine-steps" style="margin-top:30px">
        ${tips.map((t) => `<div class="routine-step"><span class="num">•</span><p>${t}</p></div>`).join('')}
      </div>
      <p class="form-note" id="scalp-save-msg"></p>`;

    if (KYH.getToken()) {
      const res = await KYH.api.saveScalpAnalysis(payload);
      document.getElementById('scalp-save-msg').textContent = res.msg ? res.msg : 'Saved to your account.';
    } else {
      document.getElementById('scalp-save-msg').textContent = 'Log in to save this result.';
    }

    resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
