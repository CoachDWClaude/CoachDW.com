#!/usr/bin/env python3
"""Builds public/index.html from the section files in src/.

Edit one section at a time in src/sections/ (or src/popups/), then run:
    python3 tools/build.py
The page order and where the Join the tribe breaks go live in src/page.txt.

    python3 tools/build.py --preview OUTDIR
writes a preview copy (relative paths, section picker, font switch) for checking in Claude.
"""
import os, re, sys, json, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')

def read(p):
    with open(os.path.join(SRC, p), encoding='utf-8') as f:
        return f.read()

def items():
    out = []
    for line in read('page.txt').splitlines():
        line = line.strip()
        if line and not line.startswith('#'):
            out.append(line)
    return out

def build(preview=False):
    parts, cur = [], None
    for it in items():
        if it == 'BREAK':
            html = read('partials/cta-break.html')
        else:
            html = read(it)
        if preview and it != 'BREAK' and it.startswith('sections/') and not it.endswith('01-header.html'):
            if cur: parts.append('</div>\n')
            name = re.sub(r'^\d+-', '', os.path.basename(it)[:-5]).replace('-', ' ').title()
            parts.append('<div data-sec="%s">\n' % name); cur = name
        if preview and it.startswith('popups/') and cur:
            parts.append('</div>\n'); cur = None
        parts.append(html.rstrip('\n') + '\n\n')
    if cur: parts.append('</div>\n')
    return read('head.html') + ''.join(parts) + read('foot.html')

if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[1] == '--preview':
        out = sys.argv[2]
        html = build(preview=True)
        html = html.replace('href="/site.css"', 'href="site.css"').replace('src="/site.js"', 'src="site.js"').replace('src="/hero.js"', 'src="hero.js"')
        html = html.replace('"/images/', '"images/').replace('href="/demo/"', 'href="https://appdemo-7yy.pages.dev/demo/"')
        html = re.sub(r'href="/articles/([^"/]+)/"', r'href="articles/\1/index.html"', html)
        extra = open(os.path.join(ROOT, 'tools', 'preview-extras.html'), encoding='utf-8').read()
        head_extra, body_extra = extra.split('<!-- BODY -->')
        html = html.replace('</head>', head_extra + '</head>', 1)
        html = html.replace('<div style="background: #0b0b0b; color: #ffffff; font-family:', '<div data-wrap style="background: #0b0b0b; color: #ffffff; font-family:', 1)
        if os.environ.get('CDW_PICKER', '1') != '0':  # CDW_PICKER=0 builds a clean preview with no section picker
            html = html.replace('<script src="site.js"></script>', body_extra + '<script src="site.js"></script>', 1)
        os.makedirs(out, exist_ok=True)
        with open(os.path.join(out, 'index.html'), 'w', encoding='utf-8') as f: f.write(html)
        for fn in ('site.css', 'site.js', 'hero.js'):
            shutil.copy(os.path.join(ROOT, 'public', fn), os.path.join(out, fn))
        shutil.copytree(os.path.join(ROOT, 'public', 'images'), os.path.join(out, 'images'), dirs_exist_ok=True)
        # article pages, with paths made relative to articles/<slug>/
        art = os.path.join(ROOT, 'public', 'articles')
        if os.path.isdir(art):
            import shutil
            shutil.copytree(os.path.join(art, 'img'), os.path.join(out, 'articles', 'img'), dirs_exist_ok=True)
            for slug in os.listdir(art):
                f = os.path.join(art, slug, 'index.html')
                if not os.path.isfile(f): continue
                a = open(f, encoding='utf-8').read().replace('"/articles/img/', '"../img/').replace('href="/#all-articles"', 'href="../../index.html#all-articles"').replace('href="/"', 'href="../../index.html"')
                os.makedirs(os.path.join(out, 'articles', slug), exist_ok=True)
                open(os.path.join(out, 'articles', slug, 'index.html'), 'w', encoding='utf-8').write(a)
        print('preview written to', out)
    else:
        with open(os.path.join(ROOT, 'public', 'index.html'), 'w', encoding='utf-8') as f: f.write(build())
        print('public/index.html built')
