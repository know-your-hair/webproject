// main.js — shared header/footer, nav, and auth modal for every page.
// Each page just needs: <div id="site-header"></div> and <div id="site-footer"></div>

const NAV_LINKS = [
  { href: '/index.html', label: 'Home', key: 'home' },
  { href: '/pages/take-test.html', label: 'Take Test', key: 'take-test' },
  { href: '/pages/get-routine.html', label: 'Get Routine', key: 'get-routine' },
  { href: '/pages/scalp-analysis.html', label: 'Scalp Analysis', key: 'scalp-analysis' },
  { href: '/pages/oils.html', label: 'Oils', key: 'oils' },
  { href: '/pages/ingredients.html', label: 'Ingredients', key: 'ingredients' },
  { href: '/pages/mistakes.html', label: 'Mistakes', key: 'mistakes' },
  { href: '/pages/concerns.html', label: 'Concerns', key: 'concerns' },
  { href: '/pages/about.html', label: 'About', key: 'about' },
];

function renderHeader() {
  const mount = document.getElementById('site-header');
  if (!mount) return;
  const current = mount.dataset.active || '';
  const links = NAV_LINKS.map(
    (l) => `<li><a href="${l.href}" class="${l.key === current ? 'active' : ''}">${l.label}</a></li>`
  ).join('');

  mount.innerHTML = `
    <div class="nav-row">
      <a href="/index.html" class="brand">KnowYourHair<span class="dot">.</span></a>
      <ul class="nav-links" id="nav-links">${links}</ul>
      <div class="nav-actions">
        <span id="user-chip"></span>
        <button class="btn btn-primary" id="auth-trigger">Login / Sign up</button>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">☰</button>
      </div>
    </div>`;

  document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
  });

  refreshAuthUI();
  document.getElementById('auth-trigger').addEventListener('click', () => {
    if (KYH.getToken()) {
      KYH.logout();
      refreshAuthUI();
    } else {
      openAuthModal();
    }
  });
}

function refreshAuthUI() {
  const chip = document.getElementById('user-chip');
  const trigger = document.getElementById('auth-trigger');
  const email = KYH.getEmail();
  if (chip && trigger) {
    if (email) {
      chip.textContent = email;
      trigger.textContent = 'Log out';
    } else {
      chip.textContent = '';
      trigger.textContent = 'Login / Sign up';
    }
  }
}

function renderFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  mount.innerHTML = `
    <a href="/index.html" class="brand">KnowYourHair<span class="dot">.</span></a>
    <p>&copy; ${new Date().getFullYear()} KnowYourHair. Learn. Care. Glow.</p>`;
}

/* ---------- Auth modal (shared across all pages) ---------- */
function buildAuthModal() {
  if (document.getElementById('auth-modal')) return;
  const wrap = document.createElement('div');
  wrap.className = 'modal-overlay';
  wrap.id = 'auth-modal';
  wrap.innerHTML = `
    <div class="modal">
      <button class="modal-close" id="auth-close">✕</button>
      <p class="eyebrow" id="auth-eyebrow">Sign up</p>
      <h2 id="auth-title">Create your account</h2>
      <p id="auth-sub">Sign up to save your routines and access them anytime.</p>
      <form id="auth-form">
        <div class="field">
          <label for="auth-email">Email</label>
          <input type="email" id="auth-email" required />
        </div>
        <div class="field">
          <label for="auth-password">Password</label>
          <input type="password" id="auth-password" required minlength="6" />
        </div>
        <div class="field" id="confirm-field">
          <label for="auth-confirm">Confirm password</label>
          <input type="password" id="auth-confirm" minlength="6" />
        </div>
        <div class="form-error" id="auth-error"></div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center" id="auth-submit">Create account</button>
      </form>
      <p class="form-note">
        <span id="auth-switch-label">Already have an account?</span>
        <a href="#" id="auth-switch" class="btn-text">Log in</a>
      </p>
    </div>`;
  document.body.appendChild(wrap);

  let mode = 'signup';

  function setMode(next) {
    mode = next;
    const isSignup = mode === 'signup';
    document.getElementById('auth-eyebrow').textContent = isSignup ? 'Sign up' : 'Log in';
    document.getElementById('auth-title').textContent = isSignup ? 'Create your account' : 'Welcome back';
    document.getElementById('auth-sub').textContent = isSignup
      ? 'Sign up to save your routines and access them anytime.'
      : 'Log in to see your saved test results and routine.';
    document.getElementById('confirm-field').style.display = isSignup ? 'block' : 'none';
    document.getElementById('auth-submit').textContent = isSignup ? 'Create account' : 'Log in';
    document.getElementById('auth-switch-label').textContent = isSignup ? 'Already have an account?' : "Don't have an account?";
    document.getElementById('auth-switch').textContent = isSignup ? 'Log in' : 'Sign up';
    document.getElementById('auth-error').textContent = '';
  }

  document.getElementById('auth-switch').addEventListener('click', (e) => {
    e.preventDefault();
    setMode(mode === 'signup' ? 'login' : 'signup');
  });

  document.getElementById('auth-close').addEventListener('click', closeAuthModal);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) closeAuthModal(); });

  document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const confirm = document.getElementById('auth-confirm').value;
    const errorEl = document.getElementById('auth-error');
    errorEl.textContent = '';

    if (mode === 'signup' && password !== confirm) {
      errorEl.textContent = 'Passwords do not match.';
      return;
    }

    try {
      const data = mode === 'signup'
        ? await KYH.api.signup(email, password)
        : await KYH.api.login(email, password);

      if (data.msg) {
        errorEl.textContent = data.msg;
        return;
      }
      KYH.setSession(data.token, data.email);
      refreshAuthUI();
      closeAuthModal();
    } catch (err) {
      errorEl.textContent = 'Something went wrong. Please try again.';
    }
  });

  wrap._setMode = setMode;
}

function openAuthModal() {
  buildAuthModal();
  document.getElementById('auth-modal')._setMode('signup');
  document.getElementById('auth-modal').classList.add('open');
}
function closeAuthModal() {
  const m = document.getElementById('auth-modal');
  if (m) m.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
});
