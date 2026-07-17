`), lines 156-175:**  

- Replaced the `setTheme` function with a version that removes the old icon container and re-inserts a fresh `<i>` element with the new `data-lucide` attribute, then re-calls `lucide.createIcons()`.  
- This ensures the icon is always correct after toggling, regardless of previous Lucide replacement.

(function () {
  var root = document.documentElement;
  var KEY = 'xroga-theme';
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(KEY, theme); } catch (_) {}
    var btn = document.getElementById('theme-toggle') || document.querySelector('[data-theme-toggle]');
    if (btn) {
      var next = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      btn.innerHTML = theme === 'dark'
        ? '<i data-lucide="sun" aria-hidden="true"></i><span>Day</span>'
        : '<i data-lucide="moon" aria-hidden="true"></i><span>Night</span>';
      try { if (window.lucide) lucide.createIcons(); } catch (_) {}
    }
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (_) {}
  var preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved === 'light' || saved === 'dark' ? saved : (preferDark ? 'dark' : 'light'));
  function wire(el) {
    if (!el || el.dataset.xrogaThemeWired) return;
    el.dataset.xrogaThemeWired = '1';
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var cur = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      apply(cur === 'dark' ? 'light' : 'dark');
    });
  }
  wire(document.getElementById('theme-toggle'));
  document.querySelectorAll('[data-theme-toggle], .theme-toggle, .night-day-toggle, button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="night" i]').forEach(wire);
})();
