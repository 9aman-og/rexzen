"""Add the dense research track after the normal R0 Pages overlay."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import argparse
import shutil

ASSETS=(
    'index.html','engineering.html','rexzen-d4096.pdf','rexzen-d4096-source.zip',
    'electrode-map.csv','topology.svg','signal-path.svg','bench-model.json','visual-study.json','sources.json',
    'd4096.css','d4096-page.mjs','d4096-gate.mjs','d4096-viewer.mjs','density-evidence.svg',
    'coverage-results.json','d4096-render.webp','d4096-social.jpg','investor-brief.pdf',
    'three.module.min.js','three.core.min.js','THREE-LICENSE.txt',
)
SOURCE_NAMES={name: 'experience.html' if name=='index.html' else name for name in ASSETS}
ROUTE='/research/bci/dense-4096/'
URL='https://rexzen.si'+ROUTE
DISCOVERY='''
<section class="wrap section" id="dense-4096" aria-labelledby="dense-4096-title">
<p class="eyebrow">Related research / D4096</p>
<h2 id="dense-4096-title">D4096: 4,096 points of contact</h2>
<p class="note">An interactive 3D electrode map, contact-failure simulation, and a brief for investors. Research design only; no Rexzen hardware results.</p>
<p><a href="/research/bci/dense-4096/">Explore the D4096 instrument →</a></p>
</section>
'''
R0_DISCOVERY='<p><a href="/research/bci/">Explore Rexzen Neural R0 →</a></p>'
D4096_DISCOVERY='<p><a href="/research/bci/dense-4096/">Inspect the D4096 instrument in 3D →</a></p>'

class RelativeLinks(HTMLParser):
    def __init__(self, text):
        super().__init__();self.values=[];self.feed(text)
    def handle_starttag(self,tag,attrs):
        for k,v in attrs:
            if k not in ('href','src') or not v:continue
            u=urlsplit(v)
            if not u.scheme and not u.netloc and u.path and not u.path.startswith('/'):self.values.append(u.path)


def publish(release,site):
    source=Path(release); root=Path(site); parent=root/'research/bci'; loc=parent/'dense-4096'; idx=parent/'index.html'; sitemap=root/'sitemap.xml'
    research=root/'research/index.html'
    if loc.exists() or loc.is_symlink() or any(p.is_symlink() for p in (idx,sitemap,research)):raise ValueError('expected a fresh path and a normal built site')
    # The original 0.2 index stays in source control; the investor experience becomes the public index.
    if {p.name for p in source.iterdir()}!=set(SOURCE_NAMES.values())|{'index.html'}:raise ValueError('release allowlist mismatch')
    for n,provided in SOURCE_NAMES.items():
        f=source/provided
        if not f.is_file() or f.is_symlink() or not f.stat().st_size:raise ValueError('bad asset: '+n)
        if n.endswith('.html') and set(RelativeLinks(f.read_text(encoding='utf-8')).values)-set(ASSETS):raise ValueError('invalid relative link in '+n)
    h=idx.read_text(encoding='utf-8'); x=sitemap.read_text(encoding='utf-8'); overview=research.read_text(encoding='utf-8')
    if h.count('</main>')!=1 or overview.count('</main>')!=1 or x.count('</urlset>')!=1 or ROUTE in h or ROUTE in overview or URL in x:raise ValueError('incompatible parent HTML or sitemap')
    loc.mkdir()
    for n,provided in SOURCE_NAMES.items():shutil.copyfile(source/provided,loc/n)
    idx.write_text(h.replace('</main>',DISCOVERY+'</main>',1),encoding='utf-8',newline='\n')
    if overview.count(R0_DISCOVERY)==1:
        overview=overview.replace(R0_DISCOVERY,R0_DISCOVERY+'\n'+D4096_DISCOVERY,1)
    else:
        overview=overview.replace('</main>','<section class="section wrap">'+D4096_DISCOVERY+'</section>\n</main>',1)
    research.write_text(overview,encoding='utf-8',newline='\n')
    sitemap.write_text(x.replace('</urlset>',f'  <url><loc>{URL}</loc></url>\n</urlset>',1),encoding='utf-8',newline='\n')
    print(f'Installed {len(ASSETS)} assets at {ROUTE}; linked the research and R0 indexes and refreshed the sitemap')

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('release',type=Path);p.add_argument('site',type=Path);a=p.parse_args();publish(a.release,a.site)
