(function () {
      'use strict';

      /* ---------- CoinGecko free prices ---------- */
      async function fetchPrices() {
        const ids = ['bitcoin', 'ethereum', 'solana', 'arbitrum'];
        const url =
          'https://api.coingecko.com/api/v3/simple/price?ids=' +
          ids.join(',') +
          '&vs_currencies=usd&include_24hr_change=true';
        const res = await fetch(url);
        if (!res.ok) throw new Error('CoinGecko ' + res.status);
        return res.json();
      }

      async function renderDashboard() {
        try {
          const data = await fetchPrices();
          const map = {
            bitcoin: { ticker: 'BTC', name: 'Bitcoin' },
            ethereum: { ticker: 'ETH', name: 'Ethereum' },
            solana: { ticker: 'SOL', name: 'Solana' },
            arbitrum: { ticker: 'ARB', name: 'Arbitrum' },
          };

          // Update KPI
          const kpiEl = document.getElementById('btc-kpi');
          if (kpiEl && data.bitcoin?.usd != null) {
            kpiEl.textContent = '$' + Number(data.bitcoin.usd).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            });
          }

          // Update table
          const tbody = document.getElementById('crypto-tbody');
          if (tbody) {
            let html = '';
            for (const [id, info] of Object.entries(map)) {
              const row = data[id];
              if (!row) continue;
              const price = Number(row.usd);
              const change = Number(row.usd_24h_change || 0);
              const cls = change >= 0 ? 'up' : 'down';
              const sign = change >= 0 ? '+' : '';
              html +=
                '<tr>' +
                '<td><strong>' + info.ticker + '</strong> <span style="color:var(--text-secondary);font-size:0.85rem;">' +
                info.name + '</span></td>' +
                '<td>$' + price.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '</td>' +
                '<td class="' + cls + '">' + sign + change.toFixed(2) + '%</td>' +
                '</tr>';
            }
            tbody.innerHTML = html || '<tr><td colspan="3" style="text-align:center;color:var(--text-secondary);">No data</td></tr>';
          }
        } catch (err) {
          console.warn('[Crypto]', err);
          const tbody = document.getElementById('crypto-tbody');
          if (tbody) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--down);">Failed to load prices</td></tr>';
          }
        }
      }

      /* ---------- Theme toggle ---------- */
      function initTheme() {
        const html = document.documentElement;
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        function setTheme(mode) {
          html.setAttribute('data-theme', mode);
          localStorage.setItem('theme', mode);
          const icon = btn.querySelector('i');
          if (icon) {
            icon.setAttribute('data-lucide', mode === 'dark' ? 'moon' : 'sun');
            if (window.lucide) {
              lucide.createIcons();
            }
          }
        }

        function getPreferred() {
          const stored = localStorage.getItem('theme');
          if (stored === 'light' || stored === 'dark') return stored;
          return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }

        setTheme(getPreferred());

        btn.addEventListener('click', function () {
          const current = html.getAttribute('data-theme');
          setTheme(current === 'dark' ? 'light' : 'dark');
        });

        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
          if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'light' : 'dark');
          }
        });
      }

      /* ---------- Boot ---------- */
      // Wait for Lucide to be ready, then render
      function boot() {
        initTheme();
        renderDashboard();
        // Re-run icons after any dynamic content
        if (window.lucide) lucide.createIcons();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
      } else {
        boot();
      }
    })();

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