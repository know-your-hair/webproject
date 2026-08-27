// get-routine.js — generates a routine from the saved porosity value
// and lets logged-in users save it to their account.

const ROUTINES = {
  high: [
    'Cleanse weekly with a sulfate-free, moisturizing shampoo — high-porosity hair over-strips easily.',
    'Deep condition with a protein-light, moisture-rich mask for 15–20 minutes every wash day.',
    'Apply a leave-in conditioner while hair is still damp to lock in water.',
    'Seal with a heavier oil or butter (shea, castor) to slow moisture loss.',
    'Protect hair at night with a satin bonnet or pillowcase.',
  ],
  medium: [
    'Cleanse every 5–7 days with a gentle, balanced shampoo.',
    'Condition after every wash with a lightweight conditioner.',
    'Use a leave-in or light cream on damp hair to maintain moisture.',
    'Seal ends with a small amount of light oil (jojoba, grapeseed) as needed.',
    'Trim every 8–10 weeks to keep ends healthy.',
  ],
  low: [
    'Cleanse with a clarifying shampoo occasionally to prevent product buildup.',
    'Deep condition with heat (a warm towel or hooded dryer) so product can actually absorb.',
    'Use lightweight, water-based leave-ins — heavy creams will just sit on the surface.',
    'Apply products to soaking-wet hair, not just damp hair.',
    'Avoid heavy butters and oils that add more buildup than moisture.',
  ],
};

function renderEmpty(container) {
  container.innerHTML = `
    <div class="empty-state">
      <p class="eyebrow">No result yet</p>
      <h2>Take the porosity test first</h2>
      <p>Your routine is built around your hair's porosity, so we need that result before we can recommend anything.</p>
      <a href="/pages/take-test.html" class="btn btn-primary">Take the test</a>
    </div>`;
}

function renderRoutine(container, porosity) {
  const steps = ROUTINES[porosity] || ROUTINES.medium;
  const label = porosity.charAt(0).toUpperCase() + porosity.slice(1);

  container.innerHTML = `
    <div class="section-head">
      <p class="tag-pill">${label} porosity routine</p>
      <h2>Your ${label.toLowerCase()}-porosity care routine</h2>
    </div>
    <div class="routine-steps">
      ${steps.map((s, i) => `
        <div class="routine-step">
          <span class="num">${String(i + 1).padStart(2, '0')}</span>
          <p>${s}</p>
        </div>`).join('')}
    </div>
    <div style="text-align:center;margin-top:30px">
      <button class="btn btn-primary" id="save-routine-btn">Save this routine</button>
      <p class="form-note" id="save-msg"></p>
    </div>`;

  document.getElementById('save-routine-btn').addEventListener('click', async () => {
    const msg = document.getElementById('save-msg');
    if (!KYH.getToken()) {
      msg.textContent = 'Log in to save your routine.';
      return;
    }
    msg.textContent = 'Saving…';
    const res = await KYH.api.saveRoutine(porosity, steps);
    msg.textContent = res.msg ? res.msg : 'Saved to your account.';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('routine-section');
  const porosity = KYH.getPorosity();
  if (!porosity) renderEmpty(container);
  else renderRoutine(container, porosity);
});
