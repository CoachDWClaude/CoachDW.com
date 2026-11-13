#!/usr/bin/env python3
"""Build branded article pages from src/articles/*.md into public/articles/<slug>/index.html.

Uses the locked CoachDW article template (tools/article-template.html, with the brand
images saved in public/articles/img/). Source format, one block per line:
  key: value lines, then ---          title, kicker, tagline, format, date
  ## Heading / ### Sub-heading
  > Pull quote
  - bullet / 1. numbered item
  =Sign-off line (centred, no number)
  anything else is a paragraph (first one gets the drop cap, the rest are numbered)
  ---refs then one reference per line
Inline: **bold**, *italic*, [text](url), [1] citation.
"""
import html, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKOOL = 'https://www.skool.com/strengthforlife-5963'
TPL = open(os.path.join(ROOT, 'tools', 'article-template.html')).read()

EXTRA_CSS = '''
  /* coachdw.com additions: readable width on desktop, Special Elite everywhere */
  .title-block,.body-content,.references,.art-back{max-width:760px;margin-left:auto;margin-right:auto}
  .title-block .kicker,.para-break .eyebrow,.img-full .img-caption{font-family:'Special Elite','Courier New',monospace}
  .title-block .book-title{font-size:clamp(24px,5vw,40px)}
  .title-block .tagline{font-size:clamp(16px,2vw,19px)}
  .body-content p,.body-content li{font-size:clamp(15px,1.9vw,18px)}
  .body-content h2{font-size:clamp(20px,2.6vw,26px)}
  .body-content h3{color:var(--black);font-size:clamp(17px,2.2vw,21px);font-weight:400;margin:24px 0 10px}
  .body-content ul,.body-content ol{margin:0 0 18px 1.3em;color:#2b2b2b;line-height:1.7}
  .body-content li{margin-bottom:8px}
  .body-content b{color:var(--black)}
  .body-content a,.references a{color:var(--red)}
  .body-content .signoff{text-align:center;color:var(--black);margin:6px 0}
  .pull-quote .quote-text{font-size:clamp(18px,2.4vw,22px)}
  body{background-image:none!important}
  .header{padding:8px max(16px,calc((100% - 1200px)/2 + 16px))}
  .header img.sig,.header img.logo{max-width:min(46%,320px)}
  .header a{display:contents}
  .art-back{padding:0 20px 34px}
  .art-back a{display:inline-flex;align-items:center;gap:8px;color:var(--black);text-decoration:none;border:2px solid var(--red);border-radius:10px;background:#fff;padding:12px 16px;font-size:16px}
  .art-back a span{color:var(--red)}
'''

def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<a href="\2" target="_blank" rel="noopener">\1</a>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<i>\1</i>', t)
    t = re.sub(r'\[(\d+)\]', r'<span class="cite">[\1]</span>', t)
    return t

def quote(text, imgs):
    mark, sig = imgs
    return (f'<div class="pull-quote"><div class="rule-row top"><img class="quote-mark" src="{mark}" alt=""><span class="plain-line"></span></div>'
            f'<div class="quote-text">{inline(text)}</div>'
            f'<div class="rule-row bottom"><span class="plain-line"></span><img class="quote-signature" src="{sig}" alt=""></div></div>')

def build(path):
    src = open(path).read()
    head, rest = src.split('\n---\n', 1)
    meta = dict(l.split(': ', 1) for l in head.strip().splitlines())
    body, refs = (rest.split('\n---refs\n', 1) + [''])[:2]
    slug = os.path.splitext(os.path.basename(path))[0]
    imgs = re.findall(r'class="quote-mark" src="([^"]+)"', TPL)[0], re.findall(r'class="quote-signature" src="([^"]+)"', TPL)[0]

    out, n, first, lst = [], 1, True, None
    def close():
        nonlocal lst
        if lst: out.append(f'</{lst}>'); lst = None
    words = 0
    for line in body.strip().splitlines():
        line = line.rstrip()
        if not line: continue
        words += len(line.split())
        if line.startswith('- ') or re.match(r'\d+\. ', line):
            kind = 'ul' if line.startswith('- ') else 'ol'
            if lst != kind: close(); out.append(f'<{kind}>'); lst = kind
            out.append(f'<li>{inline(re.sub(r"^(- |\d+\. )", "", line))}</li>'); continue
        close()
        if line.startswith('## '): out.append(f'<h2>{inline(line[3:])}</h2>')
        elif line.startswith('### '): out.append(f'<h3>{inline(line[4:])}</h3>')
        elif line.startswith('> '): out.append(quote(line[2:], imgs))
        elif line.startswith('='): out.append(f'<p class="signoff">{inline(line[1:])}</p>')
        elif first:
            first = False
            out.append(f'<p><span class="drop-cap">{html.escape(line[0])}</span>{inline(line[1:])}</p>')
        else:
            n += 1
            out.append(f'<p><span class="p-num">{n}</span>{inline(line)}</p>')
    close()
    mins = max(1, round(words / 220))

    skool_banner = re.search(r'<!-- SKOOL CTA.*?</p>', TPL, re.S).group(0)
    skool_banner = re.sub(r'href="[^"]*"', f'href="{SKOOL}" target="_blank" rel="noopener"', skool_banner, count=1)
    out.append(skool_banner)
    body_html = '\n  '.join(out)

    refs_html = ''
    if refs.strip():
        items = [r for r in refs.strip().splitlines() if r.strip()]
        refs_html = ('<div class="references">\n    <h3>References</h3>\n    ' +
                     '\n    '.join(f'<p><span class="cite">[{i}]</span> {inline(r)}</p>' for i, r in enumerate(items, 1)) +
                     '\n  </div>')

    title_block = (f'<div class="title-block">\n  <div class="kicker">{html.escape(meta["kicker"])}</div>\n'
                   f'  <div class="book-title">{html.escape(meta["title"])}</div>\n'
                   f'  <div class="tagline">{inline(meta["tagline"])}</div>\n'
                   f'  <div class="item-meta">{html.escape(meta.get("format", "Article"))} &middot; {mins} minute read &middot; {html.escape(meta.get("date", ""))}</div>\n</div>')

    page = TPL
    page = re.sub(r'<title>.*?</title>', f'<title>{html.escape(meta["title"])} | CoachDW</title>\n<meta name="description" content="{html.escape(meta["tagline"])}">', page, flags=re.S)
    page = page.replace('</style>', EXTRA_CSS + '</style>', 1)
    # header images link home
    page = re.sub(r'(<div class="header">)(.*?)(</div>)', lambda m: m.group(1) + '<a href="/" aria-label="CoachDW.com home">' + m.group(2) + '</a>' + m.group(3), page, count=1, flags=re.S)
    page = re.sub(r'<!-- \[EDIT\] TITLE BLOCK.*?<div class="title-block">.*?</div>\s*</div>', title_block, page, count=1, flags=re.S)
    page = re.sub(r'<!-- \[EDIT\] BODY CONTENT.*?<!-- FOOTER', lambda m: f'<div class="body-content">\n  {body_html}\n</div>\n{refs_html}\n<div class="art-back"><a href="/#all-articles"><span aria-hidden="true">&larr;</span> Back to Articles &amp; Chapters</a></div>\n\n<!-- FOOTER', page, count=1, flags=re.S)
    page = re.sub(r'<!-- ={10,}.*?={10,} -->\s*', '', page, count=1, flags=re.S)
    os.makedirs(os.path.join(ROOT, 'public', 'articles', slug), exist_ok=True)
    open(os.path.join(ROOT, 'public', 'articles', slug, 'index.html'), 'w').write(page)
    print('built', slug, f'({mins} min read)')

if __name__ == '__main__':
    d = os.path.join(ROOT, 'src', 'articles')
    for f in sorted(os.listdir(d)):
        if f.endswith('.md'): build(os.path.join(d, f))
