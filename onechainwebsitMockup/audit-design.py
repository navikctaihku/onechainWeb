#!/usr/bin/env python3
"""
OneChain design-system guard.  Run:  ./audit-design.py

Checks the four rules stated at the top of tokens.css. CSS-aware: it resolves
each declaration back to its enclosing rule, so "mono on a code block" is not
confused with "mono on a label". Exits non-zero on drift — usable as a CI gate.
"""
import re, sys, glob, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
PAGES = sorted(glob.glob('*.html'))
FILES = PAGES + ['chrome.css', 'global.css', 'home.css', 'site-base.css']
FILES = [f for f in FILES if os.path.exists(f)]

G, R, B, X = '\033[32m', '\033[31m', '\033[1m', '\033[0m'
fails = []

def ok(msg):   print(f'  {G}✓{X} {msg}')
def bad(msg, hits):
    print(f'\n{B}✗ {msg}{X}')
    for h in hits[:20]:
        print(f'    {h}')
    if len(hits) > 20:
        print(f'    … and {len(hits)-20} more')
    fails.append(msg)

def scan(pattern, skip_line=None, files=None):
    out = []
    for f in (files or FILES):
        for i, ln in enumerate(open(f), 1):
            if re.search(pattern, ln, re.I) and not (skip_line and re.search(skip_line, ln, re.I)):
                out.append(f'{f}:{i}: {ln.strip()[:120]}')
    return out

print(f'\n{B}OneChain design-system audit{X}\n')

# 1 — no black. A mask needs a literal colour, so mask-image is exempt.
hits = scan(r'#000000\b|#000\b|#0a1628|#0f1d32|#05080f|#111827|#1a2332|#1a2a40|#2f3a45',
            skip_line=r'mask-image')
ok('no black / near-black') if not hits else bad('black / near-black found', hits)

# 2 — the grey ramp is pure neutral; blue-tinted slate is what made greys drift.
hits = scan(r'#64748b|#475569|#94a3b8|#334155|#e2e8f0')
ok('no blue-tinted slate greys') if not hits else bad('off-brand slate grey found', hits)

# 2b — ONE grey for all text: #545454. Any other neutral used as a text colour
#      is drift, no matter how close it looks.
hits = scan(r'#(3a3a3a|6e6e6e|737373|767676|8a8a8a|9a9a9a|333333|444444|555555|666666|777777'
            r'|888888|999999|4a4a4a|2f2f2f|a8b4c0)\b|#(333|444|555|666|777|888|999)\b')
ok('one grey for all text (#545454)') if not hits else bad('a second grey crept in', hits)

# 3 — CertLedger deep blue only on CertLedger surfaces.
allowed = {'certledger.html', 'products.html'}
hits = scan(r'#016282|#014d66|#8ad7e8', files=[f for f in FILES if f not in allowed])
ok('CertLedger blue stays on CertLedger') if not hits else bad('CertLedger blue off-product', hits)

# 4 — tokens.css is the only place variables are declared.
hits = [h for h in scan(r':root\s*[,{]') if '*' not in h.split(':', 2)[2][:3]]
ok('tokens.css is the only :root') if not hits else bad(':root declared outside tokens.css', hits)

# 5 — mono is for code/hashes/paths, never labels. Resolve the enclosing rule.
CODE = re.compile(r'(^|[\s,>])(pre|code)\b|ep-|\.path\b|\.m\b|f-hash|cm-meta|browser-url|terminal|sandbox', re.I)
hits = []
for f in FILES:
    src = open(f).read()
    for m in re.finditer(r'([^{};]+)\{([^{}]*)\}', src):
        sel, body = m.group(1).strip().splitlines()[-1].strip(), m.group(2)
        if re.search(r'font-family:\s*var\(--font-mono\)|ui-monospace', body, re.I) and not CODE.search(sel):
            hits.append(f'{f}: {sel[:80]}')
ok('mono font limited to code') if not hits else bad('mono font on a non-code element', hits)

# 6 — load order: tokens + global first, site-base last.
bad_order = []
for f in PAGES:
    got = re.findall(r'href="(tokens|global|site-base)\.css', open(f).read())
    if got[:2] != ['tokens', 'global'] or got[-1:] != ['site-base']:
        bad_order.append(f'{f}: {" ".join(got) or "(none)"}')
ok('stylesheet order correct on every page') if not bad_order else bad('wrong stylesheet order', bad_order)

# 7 — inventory
raw = set()
for f in FILES:
    src = open(f).read()
    # <meta name="theme-color"> cannot resolve CSS variables — a literal hex is required there.
    src = re.sub(r'<meta[^>]*theme-color[^>]*>', '', src, flags=re.I)
    for m in re.findall(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b', src):
        raw.add(m.lower())
print(f'\n  raw colours outside tokens.css: {len(raw)}')
print(f'  expected: white, mask-black, terminal traffic-lights ({", ".join(sorted(raw))})')

if fails:
    print(f'\n{R}FAIL{X} — {len(fails)} rule(s) violated.\n'); sys.exit(1)
print(f'\n{G}PASS{X} — colour, type and load order are consistent site-wide.\n')
