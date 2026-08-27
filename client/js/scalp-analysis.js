// scalp-analysis.js — rule-based tips from the form, saved via /api/scalp when logged in.

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
    const resultEl = document.getElementById('scalp-result');
    resultEl.innerHTML = `
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
  });
});
