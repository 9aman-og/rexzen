"""Add the dense research track after the normal R0 Pages overlay."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import argparse
import shutil

ASSETS=('index.html','engineering.html','rexzen-d4096.pdf','rexzen-d4096-source.zip','electrode-map.csv','topology.svg','signal-path.svg','bench-model.json','visual-study.json','sources.json')
ROUTE='/research/bci/dense-4096/'
URL='https://rexzen.si'+ROUTE
DISCOVERY='''
<section class="wrap section" id="dense-4096" aria-labelledby="dense-4096-title">
<p class="eyebrow">Related research / D4096</p>
<h2 id="dense-4096-title">4,096-channel research track</h2>
<p class="note">A separate dense scalp-array design with a verified software payload replay and a public-data analysis. No Rexzen hardware results.</p>
<p><a href="/research/bci/dense-4096/">Explore the D4096 engineering release →</a></p>
</section>
'''

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
    if loc.exists() or loc.is_symlink() or idx.is_symlink() or sitemap.is_symlink():raise ValueError('expected a fresh path and a normal built site')
    if {p.name for p in source.iterdir()}!=set(ASSETS):raise ValueError('release allowlist mismatch')
    for n in ASSETS:
        f=source/n
        if not f.is_file() or f.is_symlink() or not f.stat().st_size:raise ValueError('bad asset: '+n)
        if n.endswith('.html') and set(RelativeLinks(f.read_text(encoding='utf-8')).values)-set(ASSETS):raise ValueError('invalid relative link in '+n)
    h=idx.read_text(encoding='utf-8'); x=sitemap.read_text(encoding='utf-8')
    if h.count('</main>')!=1 or x.count('</urlset>')!=1 or ROUTE in h or URL in x:raise ValueError('incompatible parent HTML or sitemap')
    loc.mkdir()
    for n in ASSETS:shutil.copyfile(source/n,loc/n)
    idx.write_text(h.replace('</main>',DISCOVERY+'</main>',1),encoding='utf-8',newline='\n')
    sitemap.write_text(x.replace('</urlset>',f'  <url><loc>{URL}</loc></url>\n</urlset>',1),encoding='utf-8',newline='\n')
    print(f'Installed {len(ASSETS)} assets at {ROUTE}; existing R0 files preserved except for one discovery link on its index')

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('release',type=Path);p.add_argument('site',type=Path);a=p.parse_args();publish(a.release,a.site)
