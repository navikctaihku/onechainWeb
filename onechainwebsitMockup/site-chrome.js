/* OneChain shared site chrome — Vercel-style nav with mega dropdowns + footer.
   Usage: add <div id="site-nav"></div> after <body>, <div id="site-footer"></div>
   before </body>, and <script src="site-chrome.js" defer></script> in <head>. */
(function () {


  var icon = function (bg, glyph) {
    var paths = {
      '🌱': '<path d="M12 21V10"/><path d="M12 13c-4.5 0-7-2.5-7-7 4.5 0 7 2.5 7 7Z"/><path d="M12 17c3.8 0 6-2.1 6-6-3.8 0-6 2.1-6 6Z"/>',
      '♻️': '<path d="m7 7 2-3 2 3M9 4a8 8 0 0 1 7 4M17 17l-2 3-2-3M15 20a8 8 0 0 1-7-4M3 13l2-3 2 3"/>',
      '🎓': '<path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 12v4.5c2.8 1.7 7.2 1.7 10 0V12M21 9v6"/>',
      '🪪': '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M13 10h5M13 14h4"/>',
      '⚡': '<path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>',
      '📘': '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M4 19a3.5 3.5 0 0 1 3.5-3.5H20"/>',
      '🔎': '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
      '⛓️': '<path d="m9.5 14.5 5-5"/><path d="M7.2 16.8 5.8 18.2a3.5 3.5 0 0 1-5-5l3.4-3.4a3.5 3.5 0 0 1 5 0"/><path d="m14.8 7.2 1.4-1.4a3.5 3.5 0 0 1 5 5l-3.4 3.4a3.5 3.5 0 0 1-5 0"/>'
    };
    var svg = paths[glyph] || '<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>';
    return '<span class="sc-item-icon" style="background:' + bg + '" aria-hidden="true"><svg viewBox="0 0 24 24">' + svg + '</svg></span>';
  };
  var item = function (href, ic, name, desc) {
    return '<a class="sc-item" href="' + href + '">' +
      '<span><span class="sc-item-name">' + name + '</span>' +
      '<span class="sc-item-desc" style="display:block">' + desc + '</span></span></a>';
  };
  var caret = '<svg class="sc-caret" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var MENUS = [
    { label: 'Products', cols: [
      { title: 'Flagship Products', items: [
        item('esgledger.html', icon('rgba(46,204,113,0.12)', '🌱'), 'ESGLedger', 'Blockchain-verified ESG data & plastic credit marketplace'),
        item('certledger.html', icon('rgba(240,180,41,0.14)', '🎓'), 'CertLedger', 'Tamper-proof credentials, verified in seconds'),
      ]},
      { title: 'Developer Platform', items: [
        item('api-platform.html', icon('rgba(0,180,216,0.12)', '⚡'), 'API Platform', 'REST APIs for documents, assets, and products'),
        item('api-docs.html', icon('rgba(0,180,216,0.12)', '📄'), 'API Docs', 'Base URL, auth, and endpoint map'),
      ]},
    ]},
    { label: 'Solutions', cols: [
      { title: 'Lead Use Cases', items: [
        item('solutions.html#lead', icon('rgba(46,204,113,0.12)', '♻️'), 'Watsons & Timber', 'Recycling credits and timber provenance — one story'),
      ]},
      { title: 'By Industry', items: [
        item('solutions.html#esg', icon('rgba(46,204,113,0.12)', '🌱'), 'ESG & Sustainability', 'Anti-greenwashing data and plastic credits'),
        item('solutions.html#credentials', icon('rgba(240,180,41,0.14)', '🪪'), 'Credentials & Identity', 'Issue, hold, and verify digital certificates'),
        item('solutions.html#education', icon('rgba(1,98,130,0.10)', '🏫'), 'Education', 'Diplomas and transcripts anyone can verify'),
        item('solutions.html#government', icon('rgba(1,98,130,0.10)', '🏛️'), 'Government', 'Regulatory-grade audit trails and licences'),
      ]},
    ]},
    { label: 'Company', cols: [
      { title: 'What We Build', items: [
        item('company.html#services', icon('rgba(20,164,188,0.12)', '⛓️'), 'Blockchain Services', 'Build a chain, bring data on-chain, and launch real applications'),
        item('infrastructure.html', icon('rgba(1,98,130,0.10)', '🗄️'), 'Infrastructure', 'Three-layer enterprise blockchain stack'),
        item('company.html#applications', icon('rgba(127,119,221,0.12)', '📦'), 'Applications', 'Products in production on OneChain'),
        item('company.html#greentech', icon('rgba(46,204,113,0.12)', '🌿'), 'Green Tech', 'Circular economy and climate technology'),
      ]},
    ]},
    { label: 'About', cols: [
      { title: 'Who We Are', items: [
        item('about.html', icon('rgba(1,98,130,0.10)', '🏢'), 'About Us', 'Our story, from Cyberport to today'),
        item('about.html#vision', icon('rgba(0,180,216,0.12)', '🧭'), 'Vision & Mission', 'What we believe and where we\u2019re going'),
        item('about.html#solving', icon('rgba(240,180,41,0.14)', '🔍'), 'What We Solve', 'The trust problems we exist to fix'),
      ]},
    ]},
    { label: 'Resources', cols: [
      { title: 'Explore', items: [
        item('blog.html', icon('rgba(0,180,216,0.12)', '📘'), 'Blog', 'Insights, product news, and partner stories'),
        item('contact.html', icon('rgba(240,180,41,0.14)', '💬'), 'Contact', 'Talk to the team'),
      ]},
    ]},
  ];

  function buildNav() {
    var lis = MENUS.map(function (m) {
      var cols = m.cols.map(function (c) {
        return '<div class="sc-col"><div class="sc-col-title">' + c.title + '</div>' + c.items.join('') + '</div>';
      }).join('');
      return '<li><button class="sc-menu-btn" type="button" aria-expanded="false">' + m.label + caret + '</button>' +
        '<div class="sc-panel">' + cols + '</div></li>';
    }).join('');
    return '<nav class="sc-nav"><div class="sc-nav-inner">' +
      '<a href="index.html" class="sc-logo"><img src="onchain-logo.png" alt="OneChain"></a>' +
      '<ul class="sc-menu">' + lis + '</ul>' +
      '<div class="sc-actions">' +
      '<a class="sc-btn-ghost" href="contact.html">Contact</a>' +
      '<button class="sc-burger" aria-label="Menu" type="button">☰</button>' +
      '</div></div></nav>' + buildMobile();
  }

  function buildMobile() {
    var html = MENUS.map(function (m) {
      var links = [];
      m.cols.forEach(function (c) {
        c.items.forEach(function (it) {
          var href = it.match(/href="([^"]+)"/)[1];
          var name = it.match(/sc-item-name">([^<]+)</)[1];
          links.push('<a href="' + href + '">' + name + '</a>');
        });
      });
      return '<div class="sc-mgroup"><div>' + m.label + '</div>' + links.join('') + '</div>';
    }).join('');
    return '<div class="sc-mobile">' + html +
      '<div class="sc-mgroup"><a href="contact.html" style="padding-left:0;font-weight:600;color:var(--sc-ink)">Contact Us</a></div></div>';
  }

  function buildFooter() {
    var col = function (title, links) {
      return '<div class="sc-fcol"><h5>' + title + '</h5><ul>' +
        links.map(function (l) { return '<li><a href="' + l[1] + '">' + l[0] + '</a></li>'; }).join('') +
        '</ul></div>';
    };
    var contactCol =
      '<div class="sc-fcol sc-fcol--contact"><h5>Get in Touch</h5><ul>' +
      '<li><a href="tel:+85225714301">(852) 2571 4301</a></li>' +
      '<li><a href="mailto:info@one-chain.io">info@one-chain.io</a></li>' +
      '<li><span class="sc-fcontact-address">Level 9, Core C, Cyberport 3,<br>100 Cyberport Rd, Pok Fu Lam,<br>Hong Kong</span></li>' +
      '</ul></div>';
    var social =
      '<div class="sc-footer-social" aria-label="Social media">' +
      '<a href="https://www.facebook.com/onechainhk" target="_blank" rel="noopener" aria-label="Facebook">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.41-3.68 3.56-3.68 1.03 0 2.11.18 2.11.18v2.32h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.91h-2.2V22c4.78-.75 8.44-4.91 8.44-9.93z"/></svg></a>' +
      '<a href="https://www.instagram.com/one.chain.io" target="_blank" rel="noopener" aria-label="Instagram">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11.25 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg></a>' +
      '<a href="https://www.linkedin.com/company/one-chain" target="_blank" rel="noopener" aria-label="LinkedIn">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S.02 4.88.02 3.5 1.14 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.48h4.56V23H.22V8.48zM8.34 8.48h4.37v1.98h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 7v7.92h-4.56v-7.02c0-1.67-.03-3.82-2.33-3.82-2.33 0-2.69 1.82-2.69 3.7V23H8.34V8.48z"/></svg></a>' +
      '<a href="https://www.youtube.com/@onechain" target="_blank" rel="noopener" aria-label="YouTube">' +
      '<svg width="22" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.52V8.48L15.82 12l-6.07 3.52z"/></svg></a>' +
      '</div>';
    return '<footer class="sc-footer"><div class="sc-footer-inner"><div class="sc-footer-grid">' +
      '<div class="sc-footer-brand"><img src="onchain-logo.png" alt="OneChain">' +
      '<p>Full-stack blockchain company building the trust layer for Asia. Cyberport, Hong Kong.</p></div>' +
      col('Products', [['ESGLedger', 'esgledger.html'], ['CertLedger', 'certledger.html'], ['API Platform', 'api-platform.html'], ['API Docs', 'api-docs.html']]) +
      col('Solutions', [['Watsons & Timber', 'solutions.html#lead'], ['ESG & Sustainability', 'solutions.html#esg'], ['Credentials & Identity', 'solutions.html#credentials'], ['Education', 'solutions.html#education'], ['Government', 'solutions.html#government']]) +
      col('Company', [['Blockchain Services', 'company.html#services'], ['Infrastructure', 'infrastructure.html'], ['Applications', 'company.html#applications'], ['Green Tech', 'company.html#greentech']]) +
      col('About', [['About Us', 'about.html'], ['Vision & Mission', 'about.html#vision'], ['What We Solve', 'about.html#solving'], ['Blog', 'blog.html']]) +
      contactCol +
      '</div><div class="sc-footer-bottom">' +
      '<div class="sc-footer-bottom-left">' +
      social +
      '<img class="sc-footer-iso" src="iso-27001.svg" alt="ISO 27001 Certified" width="52" height="52">' +
      '</div>' +
      '<p>© 2026 OneChain Ltd. · Level 9, Core C, Cyberport 3, Pok Fu Lam, Hong Kong · <a href="mailto:info@one-chain.io?subject=Privacy%20Policy" style="color:inherit">Privacy Policy</a> · <a href="mailto:info@one-chain.io?subject=Terms%20of%20Use" style="color:inherit">Terms of Use</a></p>' +
      '</div></div></footer>';
  }

  function init() {
    // Brand Guideline: Inter Bold (brand) / Inter (body) / Noto Sans TC (CJK)
    if (!document.querySelector('link[href*="family=Inter"]')) {
      var fl = document.createElement('link');
      fl.rel = 'stylesheet';
      fl.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap';
      document.head.appendChild(fl);
    }
    if (!document.querySelector('link[href*="global.css"]')) {
      var globalStyles = document.createElement('link');
      globalStyles.rel = 'stylesheet';
      globalStyles.href = 'global.css';
      document.head.appendChild(globalStyles);
    }
    if (!document.querySelector('link[href*="chrome.css"]')) {
      var chromeStyles = document.createElement('link');
      chromeStyles.rel = 'stylesheet';
      chromeStyles.href = 'chrome.css';
      document.head.appendChild(chromeStyles);
    }

    var navMount = document.getElementById('site-nav');
    if (!navMount) { navMount = document.createElement('div'); document.body.insertBefore(navMount, document.body.firstChild); }
    navMount.outerHTML = buildNav();

    var footMount = document.getElementById('site-footer');
    if (!footMount) { footMount = document.createElement('div'); document.body.appendChild(footMount); }
    footMount.outerHTML = buildFooter();

    // dropdown behaviour (click + hover with close delay)
    var items = document.querySelectorAll('.sc-menu > li');
    var closeAll = function () {
      items.forEach(function (li) {
        li.classList.remove('sc-open');
        var menuButton = li.querySelector('.sc-menu-btn');
        if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
      });
    };
    items.forEach(function (li) {
      var btn = li.querySelector('.sc-menu-btn');
      var timer;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var was = li.classList.contains('sc-open');
        closeAll();
        if (!was) {
          li.classList.add('sc-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
      li.addEventListener('mouseenter', function () {
        clearTimeout(timer);
        closeAll();
        li.classList.add('sc-open');
        btn.setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('mouseleave', function () {
        timer = setTimeout(function () {
          li.classList.remove('sc-open');
          btn.setAttribute('aria-expanded', 'false');
        }, 150);
      });
    });
    document.addEventListener('click', closeAll);

    // mobile menu
    var burger = document.querySelector('.sc-burger');
    var mobile = document.querySelector('.sc-mobile');
    if (burger && mobile) {
      burger.addEventListener('click', function (e) {
        e.stopPropagation();
        mobile.classList.toggle('sc-open');
        burger.textContent = mobile.classList.contains('sc-open') ? '✕' : '☰';
      });
    }

    initFX();
  }

  /* ===== FX layer: spotlight cards, count-up stats, scroll progress ===== */
  function initFX() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1) Spotlight hover — applies to common card selectors across all pages
    var CARD_SEL = ['.pillar', '.stat', '.layer', '.app', '.vision-card', '.doing-card',
      '.solve', '.career-card', '.value-card', '.feature-card', '.product-card',
      '.explore-card', '.industry-card'].join(',');
    var DARK_SEL = '.green-card';
    if (!reduce) {
      document.querySelectorAll(CARD_SEL).forEach(function (el) { el.classList.add('sc-spot'); });
      document.querySelectorAll(DARK_SEL).forEach(function (el) { el.classList.add('sc-spot', 'sc-spot-dark'); });
      document.addEventListener('mousemove', function (e) {
        var el = e.target.closest && e.target.closest('.sc-spot');
        if (!el) return;
        var r = el.getBoundingClientRect();
        el.style.setProperty('--sc-mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--sc-my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    }

    // 2) Count-up numbers — animates digits inside .stat b when scrolled into view
    var stats = document.querySelectorAll('.stat b');
    if (stats.length && !reduce && 'IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          countUp(entry.target);
        });
      }, { threshold: 0.6 });
      stats.forEach(function (el) { obs.observe(el); });
    }
    function countUp(el) {
      var text = el.textContent;
      var m = text.match(/([0-9][0-9,]*(?:\.[0-9]+)?)/);
      if (!m) return; // non-numeric stats like "HK" stay as-is
      var target = parseFloat(m[1].replace(/,/g, ''));
      var decimals = (m[1].split('.')[1] || '').length;
      var hasComma = m[1].indexOf(',') !== -1;
      var prefix = text.slice(0, m.index);
      var suffix = text.slice(m.index + m[1].length);
      var t0 = null, DUR = 1400;
      function frame(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / DUR);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = (target * eased).toFixed(decimals);
        if (hasComma) val = Number(val).toLocaleString('en-US', { minimumFractionDigits: decimals });
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = text;
      }
      requestAnimationFrame(frame);
    }

    // 3) Scroll progress bar (skip if the page already has one)
    if (!document.querySelector('.scroll-progress')) {
      var bar = document.createElement('div');
      bar.className = 'sc-progress';
      document.body.appendChild(bar);
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking) return; ticking = true;
        requestAnimationFrame(function () {
          var h = document.documentElement;
          var max = h.scrollHeight - h.clientHeight;
          bar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
          ticking = false;
        });
      }, { passive: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
