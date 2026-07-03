# Prompting for Dynamic Web Effects — A Working Guide

How to read two real "award-style" websites and write prompts that reproduce their motion. Built around your two references:

- **Hubtown** — `https://hubtown.co.in/` — cinematic, scroll-driven storytelling (real-estate).
- **Future of Finance** — `https://futureoffinance.peachweb.io/` — clean SaaS landing page with reveal + sticky motion.

The goal isn't to copy them pixel-for-pixel. It's to teach you the **vocabulary and structure** that makes an AI build the *right* effect on the first try, so you can apply it to the OneChain site.

---

## Part 1 — The one mental model that fixes 90% of bad prompts

Most people prompt motion like this: *"make the section animate nicely on scroll."* The AI guesses, picks a random library, and you get something generic. Animation is not one thing — it's **five separate decisions**. Name all five and the AI has nothing left to guess.

Every effect = **Trigger · Property · Timeline · Easing · Library**

| Decision | The question it answers | Example values |
|---|---|---|
| **Trigger** | What starts it? | page load, element enters viewport, scroll position, hover, click |
| **Property** | What visually changes? | opacity, translateY, scale, clip-path, color, text split |
| **Timeline** | How is it sequenced? | duration, delay, stagger between items, scroll-scrub vs. one-shot |
| **Easing** | What's the *feel* of the motion? | `power3.out`, `expo.out`, spring, linear (for scrub) |
| **Library** | What builds it? | GSAP + ScrollTrigger, Lenis, Framer Motion, vanilla IntersectionObserver, CSS |

> Rule of thumb: **if your prompt doesn't contain a trigger, a property, and an easing word, it's underspecified.** Add those three and quality jumps immediately.

A second rule that matters as much: **always specify the no-JS / reduced-motion fallback.** Pros do this; it's the difference between a demo and a shippable site. One line — *"content must be visible if JS fails, and respect `prefers-reduced-motion`"* — is enough.

---

## Part 2 — The stacks these two sites use (so you name the right tool)

You don't need to scrape their source. The *type* of motion tells you the standard, correct library — and naming it in your prompt is what stops the AI defaulting to clunky CSS keyframes.

**Hubtown** is a custom "creative dev" build. Its fingerprint — buttery momentum scrolling, words that animate in pieces, sections that pin while you scroll — is the classic award-site stack:

- **GSAP** + **ScrollTrigger** — the engine for scroll-linked timelines and pinning.
- **Lenis** (or Locomotive Scroll) — smooth/inertia scrolling that GSAP hooks into.
- **SplitType / GSAP SplitText** — breaks headlines into lines/words/chars so they can stagger.
- A **preloader** with a real percentage counter gating the reveal.

**Future of Finance** is built on **Peachworlds** (a Framer-style no-code builder). Under the hood that's **Framer Motion**-type behaviour: `whileInView` reveals, sticky stacking sections, a marquee, and count-up stats. You can rebuild all of it with either Framer Motion (React) or **vanilla IntersectionObserver + CSS** (no framework) — the prompts below give you both.

Plain takeaway for prompting:

- Scroll-*scrubbed* / pinned / kinetic-type motion → **ask for GSAP + ScrollTrigger (+ Lenis, + SplitType).**
- One-shot reveal-on-enter, sticky cards, marquee, counters → **vanilla IntersectionObserver + CSS** is enough and lighter; ask for Framer Motion only if you're already in React.

---

## Part 3 — Effect-by-effect breakdown + copy-paste prompts

Each effect below has three parts: **what's happening**, **why/how (the technique)**, and a **prompt you can paste** into Claude, Cursor, etc. Prompts are written to be self-contained.

### A. Preloader with a real percentage counter
*(Both sites — "0% … Loading … 100% Ready to Explore")*

**What's happening:** A full-screen overlay sits on top on load. A number counts 0→100 (often tied to real asset loading, sometimes faked on a timer). At 100 the overlay wipes/fades away and the hero animates in. It buys time for fonts/images and sets a premium tone.

**Technique:** Count-up driven by GSAP (or `requestAnimationFrame`); overlay exit is a `clip-path` or `transform: translateY(-100%)` wipe; the hero's intro timeline is chained to start *after* the wipe so nothing pops in early.

**Prompt:**
```
Build a full-screen preloader overlay for a website hero, in vanilla HTML/CSS/JS
(no framework). Requirements:
- Fixed overlay covering the viewport, dark background, centered percentage
  text "0%" that counts up to "100%" over ~2s using requestAnimationFrame.
- Below it, small status text that changes "Loading" -> "Ready" at 100%.
- At 100%, the overlay exits with a smooth upward wipe using
  transform: translateY(-100%) and a 0.8s cubic-bezier(0.7,0,0.3,1) ease.
- After the wipe, fire a callback that adds an "is-ready" class to <body> so the
  hero content can run its own entrance animation.
- Respect prefers-reduced-motion: if set, skip the count-up, show content instantly.
- Fallback: if JS fails, the page content underneath must still be visible
  (overlay is added/managed by JS, not hard-coded as blocking).
Comment each step so I can learn how it works.
```

---

### B. Scroll storytelling — pinned sections + kinetic typography
*(Hubtown — "Future / Innovation / Collaboration / Excellence / Purpose / Legacy")*

**What's happening:** As you scroll, the page moves through chapters. A section **pins** (stays fixed) while its headline animates word-by-word and a label/image cross-fades, then it releases and the next chapter takes over. Scrolling *scrubs* the animation — scroll up and it reverses. This is the signature "expensive" effect.

**Technique:** GSAP **ScrollTrigger** with `pin: true` and `scrub: true`. Headlines are split into words/lines with **SplitType**, then staggered. **Lenis** provides the smooth momentum so the scrub feels analog, not steppy.

**Two prompts — start with the simpler reveal, then graduate to the pinned version.**

*B1 — kinetic headline reveal (the building block):*
```
Using GSAP + ScrollTrigger + SplitType (load all 3 from CDN), animate a large
headline so that when it scrolls into view, it reveals line by line: each line
starts at opacity 0 and translateY(120%) clipped by overflow:hidden on a wrapper,
then rises to its place. Stagger lines by 0.08s, ease "expo.out", duration 1s.
Trigger when the headline is ~80% from the top of the viewport, play once.
Include the HTML/CSS. Add prefers-reduced-motion fallback that shows text normally.
```

*B2 — the full pinned, scroll-scrubbed chapter section:*
```
Build a scroll-driven "storytelling" section with GSAP ScrollTrigger and Lenis
smooth scroll (CDN). Structure: a section that PINS for the duration of ~150%
viewport height of scrolling. While pinned and scrubbed to scroll progress:
1) a small kicker label fades/slides in,
2) a 3-word headline reveals word by word (SplitType, stagger),
3) a background image scales from 1.1 to 1.0 (subtle parallax),
4) near the end, everything fades out so the next section can take over.
Use scrub: true so scrolling up reverses it. Keep easing linear inside the
scrubbed timeline (scrub controls timing). Give me a reusable pattern I can
duplicate for 6 chapters, and explain pin + scrub in comments.
Add a prefers-reduced-motion path that disables pinning and just shows each
section statically.
```

> Teaching note: the magic words here are **`pin`**, **`scrub`**, and **`stagger`**. If a scroll effect feels "linked to my scrollbar," it's `scrub`. If a section "sticks then lets go," it's `pin`. Say those words and the AI knows exactly what you mean.

---

### C. Sticky / stacking feature cards
*(Future of Finance — numbered features 01 / 02 / 03 that pin and swap)*

**What's happening:** A column of feature panels where the visual (image) **sticks** in place while the text scrolls past, or cards **stack on top of each other** as you scroll. Numbered 01→03. It's the same family as B but lighter — no scrubbed timeline needed, often just CSS `position: sticky`.

**Technique:** Pure CSS `position: sticky` for the pinned media column, plus IntersectionObserver to highlight the active item. The "stacking cards" variant gives each card `position: sticky; top: 0` so later cards slide over earlier ones.

**Prompt:**
```
Build a "sticky feature showcase" section, vanilla HTML/CSS/JS, two-column layout.
- LEFT column: text blocks for features 01, 02, 03 (kicker, heading, paragraph,
  CTA), stacked vertically, normal scroll.
- RIGHT column: a single image panel that uses position: sticky; top: 20vh so it
  stays in view while the left text scrolls.
- As each left feature enters the viewport center, use IntersectionObserver to
  swap the right image (crossfade 0.4s) and mark that feature active (full opacity;
  inactive ones at 0.4).
- Mobile (<768px): collapse to one column, image above each text block, no sticky.
- Respect prefers-reduced-motion (no crossfade, instant swap).
Comment the IntersectionObserver logic.
```

*Variant — stacking cards (cards overlap as you scroll):*
```
Make a vertical stack of 3 cards where each card is position: sticky; top: 5rem
so that as I scroll, each successive card slides up and overlaps the previous one,
creating a layered "deck" effect. Give each card a slightly different background,
a large index number (01/02/03), and a soft shadow at the top edge. Pure CSS where
possible. Explain why sticky + source order produces the stack.
```

---

### D. Count-up statistics
*(Future of Finance — +48% efficiency, −21% risk, etc.)*

**What's happening:** Big numbers animate from 0 to their target when the stats row scrolls into view. Small effect, big perceived polish.

**Technique:** IntersectionObserver fires once when the row is visible; a `requestAnimationFrame` loop interpolates 0→target with an easing curve. Handle prefixes/suffixes (`+`, `%`, `K`) by animating only the numeric part.

**Prompt:**
```
Create an animated stats counter row, vanilla JS. Four stats, each with a target
value and optional prefix/suffix (e.g. "+48%", "-21%", "10K%", "21%").
- Numbers start at 0 and count up to target over 1.6s using requestAnimationFrame
  with an easeOutExpo curve.
- Trigger ONCE when the row scrolls into view (IntersectionObserver, threshold 0.4).
- Read targets from data attributes (data-target, data-prefix, data-suffix) so it's
  reusable. Format thousands with K (e.g. 10000 -> "10K").
- prefers-reduced-motion: show final numbers immediately.
Give me HTML markup + JS, commented.
```

---

### E. Micro-interactions (the finishing layer)

These are small but they're 50% of why both sites *feel* expensive. Prompt them individually and layer them in.

**E1 — Lenis smooth/inertia scrolling** (the base layer everything else rides on):
```
Add Lenis smooth scrolling (CDN) to my page with gentle inertia: lerp ~0.1,
duration ~1.2s, and wire it into requestAnimationFrame. If I'm using GSAP
ScrollTrigger, sync them so scroll-triggered animations stay accurate. Make sure
anchor links and the keyboard still scroll correctly. Disable under
prefers-reduced-motion.
```

**E2 — Magnetic button** (button drifts toward the cursor):
```
Make a "magnetic" button: on mousemove within ~80px, the button translates a
fraction (~0.3) of the cursor's offset from its center toward the cursor, and
springs back to center on mouseleave with a soft ease. Use transform only (GPU).
Vanilla JS, works for any element with class .magnetic. Comment the math.
```

**E3 — Custom cursor** (small dot that lags + grows on hover, Hubtown-style):
```
Build a custom cursor: a small circle that follows the mouse with slight lag
(lerp ~0.15 via requestAnimationFrame), and scales up + changes color when
hovering elements with class .cursor-grow (links, buttons). Hide on touch devices
and keep the native cursor as fallback. Vanilla JS + CSS.
```

**E4 — Infinite logo marquee** (the "trusted by" strip):
```
Create an infinite horizontal marquee of logos that scrolls continuously and
loops seamlessly (duplicate the track and translate by -50%). Pause on hover.
Pure CSS animation, no JS. Mask the left/right edges with a fade gradient.
```

**E5 — Animated arrow / link hover** (the white arrow that slides on the CTAs):
```
Style a CTA where, on hover, the arrow icon slides right and a duplicate arrow
enters from the left (clipped by overflow:hidden) so it reads as continuous motion,
and the label gets a subtle underline wipe left-to-right. CSS only, 0.3s ease.
```

---

## Part 4 — The master prompt (assemble it for OneChain)

When you want a whole section rather than one effect, give the AI a **brief, then the motion spec, then constraints**, in that order. Template:

```
ROLE: You are a senior creative front-end developer who builds award-style sites
(think Awwwards / FWA). Tech: vanilla HTML/CSS/JS + GSAP, ScrollTrigger, SplitType,
and Lenis from CDN. No build step.

CONTEXT: This is the homepage for "OneChain", a [one-line description of OneChain].
Brand feel: [e.g. dark, premium, futuristic; accent color #XXXXXX; font X].

BUILD this hero + first chapter:
1) Preloader: 0->100% counter, then an upward wipe, then reveal the hero (Effect A).
2) Hero: kicker label, a 3-line headline that reveals line-by-line on load
   (Effect B1), one CTA with a magnetic + sliding-arrow hover (E2 + E5).
3) Lenis smooth scrolling across the whole page (E1).
4) First scroll chapter: a pinned, scrubbed section with a word-by-word headline
   and a subtle background parallax (Effect B2).

MOTION SPEC: easing expo.out / power3.out for entrances; scrub:true for the pinned
section; stagger 0.08s; durations 0.8–1.2s. Keep it tasteful, not flashy.

CONSTRAINTS:
- Mobile responsive; disable pinning on <768px.
- Respect prefers-reduced-motion (show everything statically, no pinning).
- Content must be in the HTML (visible if JS fails) — animate from a visible base.
- Comment each animation block so I can learn and tweak it.

Deliver as a single index.html with <style> and <script>, plus a short note on
what to change to add more chapters.
```

Swap the bracketed parts and you have a OneChain-specific build prompt. To extend, reuse the **Effect B2** pattern per chapter and the **Effect C** pattern for your features section.

---

## Part 5 — Principles, and the mistakes to avoid

**Do:**
- **Name the library.** "Using GSAP ScrollTrigger…" beats "make it animate on scroll" every time.
- **Use the three magic scroll words** when relevant: `pin`, `scrub`, `stagger`.
- **Give numbers.** Durations in seconds, stagger in seconds, easing by name, offsets in px/%. Vague = generic.
- **Describe the *feel*, then let easing carry it:** "snappy then settle" → `expo.out`; "linked to my scrollbar" → `scrub`; "bouncy" → spring/elastic.
- **Always include the reduced-motion + no-JS fallback line.** It's one sentence and it's what separates pro output.
- **Build in layers.** Get the static layout right, add Lenis, then reveals, then pinning, then micro-interactions. Don't ask for everything in one shot the first time.

**Don't:**
- Don't say "make it like Hubtown" with no detail — the AI can't see the site. Describe the *effect* instead.
- Don't stack heavy effects everywhere; both reference sites are restrained. One signature scroll moment beats ten.
- Don't animate from `display:none` or empty HTML — it breaks SEO and the no-JS fallback. Animate *from a visible base*.
- Don't forget mobile: pinning + scrubbing often needs to be disabled on small screens.

---

## Quick-reference: effect → say this → library

| You want… | Say in the prompt | Library |
|---|---|---|
| Loading % screen | "count-up preloader, wipe on exit, gate the hero" | RAF / GSAP |
| Words animate in pieces | "split into words/lines with SplitType, stagger, expo.out" | GSAP + SplitType |
| Section sticks while scrolling | "pin with ScrollTrigger, scrub:true" | GSAP ScrollTrigger |
| Buttery momentum scroll | "Lenis smooth scroll, lerp 0.1" | Lenis |
| Image stays, text scrolls | "position: sticky media column" | CSS + IntersectionObserver |
| Cards overlap as you scroll | "each card position:sticky top:5rem, stacks" | CSS |
| Numbers count up on view | "RAF count-up, IntersectionObserver once, easeOutExpo" | Vanilla JS |
| Button pulls toward cursor | "magnetic button, transform 0.3 of offset" | Vanilla JS |
| Dot cursor that lags | "custom cursor, lerp 0.15, grows on hover" | Vanilla JS |
| Endless logo strip | "infinite CSS marquee, duplicate track, -50%" | CSS |

---

*Tip for using this guide: start with one effect (the preloader or a kinetic headline), paste that single prompt, get it working, then layer the next one. You'll learn faster from five small wins than one giant prompt.*
