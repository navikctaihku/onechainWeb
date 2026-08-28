/* OneChain classic homepage behavior. */
(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.15 });
    reveals.forEach(el => revealObs.observe(el));

    // Fan cards — scroll trigger + interactive hover
    const fanCards = document.getElementById('fanCards');
    if (fanCards) {
      const cards = fanCards.querySelectorAll('.fan-card');
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) { fanCards.classList.add('fanned'); }
      else {
        const fanObs = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting && e.intersectionRatio >= 0.4) fanCards.classList.add('fanned');
            else if (!e.isIntersecting) {
              fanCards.classList.remove('fanned');
              fanCards.classList.remove('has-active');
              cards.forEach(c => c.classList.remove('active'));
            }
          });
        }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0] });
        fanObs.observe(fanCards);
      }

      // Smooth card hover interaction
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          if (!fanCards.classList.contains('fanned')) return;
          fanCards.classList.add('has-active');
          cards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        });
      });

      // Remove active when mouse leaves the entire fan area
      fanCards.addEventListener('mouseleave', () => {
        fanCards.classList.remove('has-active');
        cards.forEach(c => c.classList.remove('active'));
      });
    }

    // Product showcase — accessible tabbed crossfade
    (function initProductShowcase() {
      const root = document.getElementById('productShowcase');
      const track = document.getElementById('productShowcaseTrack');
      if (!root || !track) return;

      const tabs = Array.from(root.querySelectorAll('.product-tab'));
      const slides = Array.from(track.querySelectorAll('.product-showcase-slide'));
      const prevBtn = root.querySelector('.product-showcase-arrow--prev');
      const nextBtn = root.querySelector('.product-showcase-arrow--next');
      let current = 0;

      const goTo = (index) => {
        current = (index + slides.length) % slides.length;
        tabs.forEach((tab, i) => {
          const active = i === current;
          tab.classList.toggle('is-active', active);
          tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));

        const fanCardsEl = document.getElementById('fanCards');
        if (fanCardsEl && slides[current]?.dataset.product === 'cert') {
          fanCardsEl.classList.add('fanned');
        }
      };

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => goTo(Number(tab.dataset.index)));
      });
      prevBtn?.addEventListener('click', () => goTo(current - 1));
      nextBtn?.addEventListener('click', () => goTo(current + 1));
      goTo(0);
    })();

    // ===== Reusable interactive node network =====
    function initNodeNetwork(container, canvas, opts = {}) {
      if (!container || !canvas) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const ctx = canvas.getContext('2d');
      const LINK_DIST = opts.linkDist || 120;
      const MOUSE_DIST = opts.mouseDist || 160;
      const PULL = opts.pull ?? 0.35;        // mouse responsiveness
      const leftColor = opts.leftColor || '20,164,188';
      const rightColor = opts.rightColor || '20,164,188';
      const leftBand = opts.leftBand ?? 0.28;
      const rightBand = opts.rightBand ?? 0.72;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      let w = 0, h = 0, nodes = [];
      let frameId = null;
      let isVisible = false;
      const mouse = { x: -9999, y: -9999, active: false };

      function buildNodes() {
        const perSide = Math.max(6, Math.min(14, Math.round(w * h / 80000)));
        nodes = [];
        const bands = [
          { min: 0, max: w * leftBand, color: leftColor },
          { min: w * rightBand, max: w, color: rightColor }
        ];
        bands.forEach(band => {
          for (let i = 0; i < perSide; i++) {
            nodes.push({
              x: band.min + Math.random() * (band.max - band.min),
              y: Math.random() * h,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              r: 2 + Math.random() * 3.5,
              color: band.color,
              homeBandMin: band.min,
              homeBandMax: band.max
            });
          }
        });
      }

      function resize() {
        const rect = container.getBoundingClientRect();
        w = rect.width; h = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildNodes();
      }

      function tick() {
        ctx.clearRect(0, 0, w, h);
        for (const n of nodes) {
          if (mouse.active) {
            const dx = mouse.x - n.x, dy = mouse.y - n.y;
            const d = Math.hypot(dx, dy);
            if (d < MOUSE_DIST && d > 0.1) {
              const pull = (1 - d / MOUSE_DIST) * PULL;
              n.vx += (dx / d) * pull * 0.06;
              n.vy += (dy / d) * pull * 0.06;
            }
          }
          n.x += n.vx; n.y += n.vy;
          n.vx *= 0.99; n.vy *= 0.99;
          if (n.x < n.homeBandMin) { n.x = n.homeBandMin; n.vx *= -1; }
          if (n.x > n.homeBandMax) { n.x = n.homeBandMax; n.vx *= -1; }
          if (n.y < 0) { n.y = 0; n.vy *= -1; }
          if (n.y > h) { n.y = h; n.vy *= -1; }
          if (Math.abs(n.vx) < 0.05) n.vx += (Math.random() - 0.5) * 0.2;
          if (Math.abs(n.vy) < 0.05) n.vy += (Math.random() - 0.5) * 0.2;
        }
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < LINK_DIST) {
              const alpha = (1 - d / LINK_DIST) * 0.45;
              ctx.strokeStyle = `rgba(${a.color},${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
        if (mouse.active) {
          for (const n of nodes) {
            const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
            if (d < MOUSE_DIST) {
              ctx.strokeStyle = `rgba(${n.color},${(1 - d / MOUSE_DIST) * 0.65})`;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(n.x, n.y);
              ctx.stroke();
            }
          }
        }
        for (const n of nodes) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${n.color},0.8)`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${n.color},0.07)`;
          ctx.fill();
        }
        if (isVisible && !document.hidden) frameId = requestAnimationFrame(tick);
      }

      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });
      container.addEventListener('mouseleave', () => { mouse.active = false; });

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
      });

      resize();
      const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !frameId && !document.hidden) frameId = requestAnimationFrame(tick);
          if (!isVisible && frameId) {
            cancelAnimationFrame(frameId);
            frameId = null;
          }
        });
      }, { threshold: 0.05 });
      visibilityObserver.observe(container);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && frameId) {
          cancelAnimationFrame(frameId);
          frameId = null;
        } else if (!document.hidden && isVisible && !frameId) {
          frameId = requestAnimationFrame(tick);
        }
      });
    }

    // Products header — ESGLedger (left) + CertLedger (right) brand primaries
    initNodeNetwork(
      document.querySelector('.products-header-wrap'),
      document.getElementById('productsNetwork'),
      { leftColor: '0,119,113', rightColor: '1,98,130', linkDist: 110, mouseDist: 150 }
    );

    // ===== AI AT ONECHAIN — interactive effects =====
    (function initAISection() {
      const section = document.getElementById('ai');
      if (!section) return;
      const aiReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const whenReady = (fn) => {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
      };

      // 1. tsParticles — only if the particle host still exists in the DOM
      whenReady(() => {
        if (aiReduced || typeof tsParticles === 'undefined') return;
        if (!document.getElementById('aiParticles')) return;
        tsParticles.load({
          id: 'aiParticles',
          options: {
            fullScreen: { enable: false },
            fpsLimit: 60,
            detectRetina: true,
            background: { color: 'transparent' },
            particles: {
              number: { value: 55, density: { enable: true, width: 1400, height: 900 } },
              color: { value: ['#14a4bc', '#016282'] },
              opacity: { value: 0.5 },
              size: { value: { min: 1.5, max: 3.5 } },
              links: { enable: true, distance: 140, color: '#14a4bc', opacity: 0.3, width: 1 },
              move: { enable: true, speed: 0.9, outModes: { default: 'bounce' } }
            },
            interactivity: {
              detectsOn: 'canvas',
              events: {
                onHover: { enable: true, mode: 'grab' },
                onClick: { enable: true, mode: 'push' },
                resize: { enable: true }
              },
              modes: {
                grab: { distance: 190, links: { opacity: 0.55 } },
                push: { quantity: 3 }
              }
            }
          }
        }).then((particleContainer) => {
          const particleObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !document.hidden) particleContainer.play();
              else particleContainer.pause();
            });
          }, { threshold: 0.05 });
          particleObserver.observe(section);
          document.addEventListener('visibilitychange', () => {
            if (document.hidden) particleContainer.pause();
            else if (section.getBoundingClientRect().bottom > 0 && section.getBoundingClientRect().top < window.innerHeight) particleContainer.play();
          });
        });
      });

      // 2. vanilla-tilt — 3D card tilt following the mouse, with glare
      whenReady(() => {
        if (aiReduced || typeof VanillaTilt === 'undefined') return;
        VanillaTilt.init(section.querySelectorAll('.ai-card'), {
          max: 8, speed: 450, scale: 1.02,
          glare: true, 'max-glare': 0.12, gyroscope: false
        });
      });

      // 3. Cursor-following glow inside cards
      section.querySelectorAll('.ai-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
          card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
      });

      // 4. Scroll-driven connector fill + step activation
      const aiSteps = document.getElementById('aiSteps');
      const aiFill = document.getElementById('aiStepsFill');
      if (aiSteps && aiFill) {
        const stepEls = [...aiSteps.querySelectorAll('.ai-step')];
        if (aiReduced) {
          aiFill.style.width = '100%';
          stepEls.forEach((el) => el.classList.add('is-active'));
        } else {
          const update = () => {
            const rect = aiSteps.getBoundingClientRect();
            const vh = window.innerHeight;
            const p = Math.min(1, Math.max(0, (vh * 0.9 - rect.top) / (rect.height + vh * 0.45)));
            aiFill.style.width = (p * 100) + '%';
            stepEls.forEach((el, i) => {
              el.classList.toggle('is-active', p >= (i + 0.6) / stepEls.length);
            });
          };
          window.addEventListener('scroll', update, { passive: true });
          window.addEventListener('resize', update);
          update();
        }
      }

      // 5. Count-up stats when scrolled into view (countUp.js + IntersectionObserver)
      whenReady(() => {
        const statsEl = document.getElementById('aiStats');
        if (!statsEl) return;
        const defs = [
          ['aiStatTps', 3000], ['aiStatAudit', 100],
          ['aiStatVerify', 3], ['aiStatMonitor', 24]
        ];
        const showFinal = () => defs.forEach(([id, v]) => {
          const el = document.getElementById(id);
          if (el) el.textContent = v.toLocaleString();
        });
        if (aiReduced || typeof countUp === 'undefined' || !countUp.CountUp) {
          showFinal();
          return;
        }
        let started = false;
        const startAll = () => {
          if (started) return;
          started = true;
          defs.forEach(([id, v]) => {
            const c = new countUp.CountUp(id, v, { duration: 2.2 });
            if (c.error) {
              const el = document.getElementById(id);
              if (el) el.textContent = v.toLocaleString();
            } else {
              c.start();
            }
          });
        };
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { startAll(); obs.disconnect(); }
          });
        }, { threshold: 0.3 });
        obs.observe(statsEl);
        // fallback: if already in view or observer missed, start after a beat
        setTimeout(() => {
          const r = statsEl.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) startAll();
        }, 800);
      });

      // 6. Magnetic CTA — interaction stays inside the AI section
      const cta = section.querySelector('.ai-cta');
      if (cta && !aiReduced) {
        const RADIUS = 140, STRENGTH = 0.35;
        section.addEventListener('mousemove', (e) => {
          const r = cta.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const dx = e.clientX - cx, dy = e.clientY - cy;
          const d = Math.hypot(dx, dy);
          if (d < RADIUS) {
            const f = (1 - d / RADIUS) * STRENGTH;
            cta.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
          } else if (cta.style.transform) {
            cta.style.transform = '';
          }
        }, { passive: true });
        section.addEventListener('mouseleave', () => { cta.style.transform = ''; });
      }
    })();

    // ============================================================
    // ===== ADDED DYNAMIC EFFECTS =====
    // ============================================================
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const HERO_INTRO_MS = 1500;

    // --- 0. Hero intro splash: logo only, then reveal video + copy ---
    (function initHeroIntro() {
      const hero = document.getElementById('hero');
      if (!hero) return;

      const revealHero = () => {
        hero.classList.add('hero--revealed');
        window.dispatchEvent(new CustomEvent('hero-revealed'));
        document.body.classList.add('loaded');
        initHeroTypewriter();
      };

      if (reducedMotion) {
        revealHero();
        return;
      }

      document.body.classList.add('anim-ready');
      setTimeout(revealHero, HERO_INTRO_MS);
    })();

    // --- Hero typewriter (Liftable-style: char-by-char) ---
    let heroTypewriterStarted = false;
    function initHeroTypewriter() {
      if (heroTypewriterStarted) return;
      heroTypewriterStarted = true;

      const el = document.getElementById('heroRotateWord');
      const phrases = [
        'earns verified proof',
        'proves ESG claims',
        'certifies credentials',
        'scales with trust',
      ];

      if (!el) return;
      if (reducedMotion) {
        el.textContent = phrases[0];
        return;
      }

      let phraseIdx = 0;
      let charIdx = 0;
      let deleting = false;

      const TYPE_MS = 58;
      const DELETE_MS = 32;
      const PAUSE_TYPED_MS = 2400;
      const PAUSE_DELETED_MS = 500;

      const schedule = (ms) => {
        setTimeout(tick, ms);
      };

      const tick = () => {
        const phrase = phrases[phraseIdx];

        if (!deleting) {
          charIdx += 1;
          el.textContent = phrase.slice(0, charIdx);
          if (charIdx >= phrase.length) {
            schedule(PAUSE_TYPED_MS);
            deleting = true;
            return;
          }
          schedule(TYPE_MS);
          return;
        }

        charIdx -= 1;
        el.textContent = phrase.slice(0, charIdx);
        if (charIdx <= 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          schedule(PAUSE_DELETED_MS);
          return;
        }
        schedule(DELETE_MS);
      };

      schedule(900);
    }

    // --- 1. Hero entrance on load (text fades in after intro reveal) ---
    if (!reducedMotion) {
      // .anim-ready + .loaded are set by initHeroIntro after 1.5s
    } else {
      document.body.classList.add('anim-ready', 'loaded');
    }

    // --- 2. Scroll reading-progress bar -------------------------
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar && !reducedMotion) {
      let ticking = false;
      const updateProgress = () => {
        const h = document.documentElement;
        const scrolled = h.scrollTop;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? (scrolled / max) * 100 : 0;
        progressBar.style.width = pct + '%';
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
      }, { passive: true });
      updateProgress();
    }

    // --- 3. Nav depth on scroll ---------------------------------
    const navEl = document.querySelector('.sc-nav');
    if (navEl) {
      const onScrollNav = () => navEl.classList.toggle('scrolled', window.scrollY > 40);
      window.addEventListener('scroll', onScrollNav, { passive: true });
      onScrollNav();
    }

    // --- 4. Count-up statistics ---------------------------------
    // Animates any [data-count] from 0 -> data-target once it scrolls in.
    const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    function animateCount(el) {
      const target = parseFloat(el.dataset.target) || 0;
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const prefix = el.dataset.prefix ? el.dataset.prefix.replace('&lt;', '<') : '';
      const suffix = el.dataset.suffix || '';
      const useComma = el.dataset.comma === 'true';
      const duration = 1600;
      const start = performance.now();
      const format = v => {
        let s = v.toFixed(decimals);
        if (useComma) s = Number(s).toLocaleString('en-US');
        return prefix + s + suffix;
      };
      const step = now => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = format(target * easeOutExpo(p));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = format(target);
      };
      requestAnimationFrame(step);
    }
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
      if (reducedMotion) {
        // Leave the original text as-is (already the final value).
      } else {
        const countObs = new IntersectionObserver((entries, obs) => {
          entries.forEach(e => {
            if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
          });
        }, { threshold: 0.4 });
        counters.forEach(c => countObs.observe(c));
      }
    }

    // --- 5. Staggered reveal for feature cards ------------------
    const featureGrid = document.querySelector('.features-grid');
    if (featureGrid && !reducedMotion) {
      featureGrid.classList.remove('reveal'); // avoid double-animating the whole block
      featureGrid.classList.add('visible');
      const cards = [...featureGrid.querySelectorAll('.feature-card')];
      cards.forEach(c => c.classList.add('fade-up'));
      const gridObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            cards.forEach((c, i) => setTimeout(() => c.classList.add('in'), i * 90));
            obs.disconnect();
          }
        });
      }, { threshold: 0.15 });
      gridObs.observe(featureGrid);
    }

    // --- 6. Magnetic primary buttons ----------------------------
    // Button drifts a fraction of the cursor's offset, springs back on leave.
    if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.btn-primary').forEach(btn => {
        const strength = 0.25, max = 6; // gentle
        btn.addEventListener('mousemove', e => {
          const r = btn.getBoundingClientRect();
          let x = (e.clientX - (r.left + r.width / 2)) * strength;
          let y = (e.clientY - (r.top + r.height / 2)) * strength;
          x = Math.max(-max, Math.min(max, x));
          y = Math.max(-max, Math.min(max, y));
          btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
      });
    }

    // --- 7. Exhibition video: muted autoplay, light overlay only on manual pause ---
    const exVid = document.getElementById('exhibitionVideo');
    const exOverlay = document.getElementById('videoOverlay');
    const exText = document.getElementById('videoText');
    const unmuteHint = document.getElementById('unmuteHint');
    if (exVid && exOverlay) {
      let pauseFromScroll = false;

      const showOverlay = () => {
        exOverlay.classList.add('show');
        exOverlay.setAttribute('aria-hidden', 'false');
        if (exText) exText.classList.remove('hidden');
      };
      const hideOverlay = () => {
        exOverlay.classList.remove('show');
        exOverlay.setAttribute('aria-hidden', 'true');
        if (exText) exText.classList.add('hidden');
      };

      const playMuted = () => {
        hideOverlay();
        exVid.muted = true;
        return exVid.play().catch(() => {});
      };

      exOverlay.addEventListener('click', () => playMuted());
      exVid.addEventListener('play', hideOverlay);
      exVid.addEventListener('ended', showOverlay);
      exVid.addEventListener('pause', () => {
        if (pauseFromScroll || exVid.ended) return;
        showOverlay();
      });

      if (unmuteHint) {
        unmuteHint.addEventListener('click', () => {
          exVid.muted = false;
          exVid.play().catch(() => {});
          unmuteHint.classList.remove('show');
        });
        exVid.addEventListener('volumechange', () => {
          if (!exVid.muted) unmuteHint.classList.remove('show');
        });
      }

      showOverlay();
      exVid.muted = true;

      const exSection = document.getElementById('exhibition');
      if (exSection && !reducedMotion) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (!e.isIntersecting) {
              pauseFromScroll = true;
              exVid.pause();
              pauseFromScroll = false;
              if (!exVid.ended) showOverlay();
            }
          });
        }, { threshold: [0, 0.35, 0.6] });
        io.observe(exSection);
      }
    }

    (function initHeroVideo() {
      const vid = document.getElementById('heroBgVideoA');
      const hero = document.getElementById('hero');
      if (!vid || !hero) return;

      const playHero = () => {
        if (hero.classList.contains('hero--revealed')) vid.play().catch(() => {});
      };
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) playHero();
          else vid.pause();
        });
      }, { threshold: 0.1 });

      heroObserver.observe(hero);
      window.addEventListener('hero-revealed', playHero);
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) playHero();
      });
    })();

    // Reclaim section — force autoplay when in view
    const reclaimVid = document.getElementById('reclaimVideo');
    const reclaimSection = document.getElementById('reclamation');
    if (reclaimVid && reclaimSection) {
      reclaimVid.muted = true;
      const playReclaim = () => reclaimVid.play().catch(() => {});
      playReclaim();
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) playReclaim();
      });
      new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) playReclaim();
          else reclaimVid.pause();
        });
      }, { threshold: 0.2 }).observe(reclaimSection);
    }

    // --- Liquid glass credentials: scroll-driven fan expansion ---
    (function initGlassFan() {
      const stage = document.getElementById('glassStage');
      if (!stage) return;
      const cards = [...stage.querySelectorAll('.glass-card')];
      const n = cards.length;
      const mid = (n - 1) / 2;

      if (reducedMotion) {
        // static fanned layout
        cards.forEach((c, i) => {
          const k = i - mid;
          c.style.transform = `translateX(${k * 130}%) rotate(${k * 8}deg)`;
        });
        return;
      }

      const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

      function layout() {
        const r = stage.getBoundingClientRect();
        const vh = window.innerHeight;
        // progress: 0 when stage enters viewport bottom, 1 when its center reaches ~40% of viewport
        const raw = (vh - r.top) / (vh * 0.85);
        const t = easeOutCubic(Math.max(0, Math.min(1, raw)));
        const spreadX = Math.min(r.width * 0.36, 300);  // px per step, responsive
        cards.forEach((c, i) => {
          const k = i - mid;
          const x = k * spreadX * t;
          const rot = k * 9 * t;
          const y = Math.abs(k) * 26 * t - t * 10;
          const z = 10 - Math.abs(k);
          c.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
          c.style.zIndex = z;
        });
      }

      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => { layout(); ticking = false; });
          ticking = true;
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      layout();

      // lift + glow on hover (uses the standalone scale property so the
      // scroll-driven transform is never disturbed)
      if (window.matchMedia('(hover: hover)').matches) {
        cards.forEach(card => {
          card.style.transition = 'box-shadow 0.35s ease, scale 0.3s ease, filter 0.3s ease';
          card.addEventListener('mouseenter', () => {
            card.style.scale = '1.06';
            card.style.filter = 'brightness(1.05)';
          });
          card.addEventListener('mouseleave', () => {
            card.style.removeProperty('scale');
            card.style.removeProperty('filter');
          });
        });
      }
    })();

})();
