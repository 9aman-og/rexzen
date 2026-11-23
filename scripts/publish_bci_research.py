"""Install exactly the Rexzen Neural R0 research release onto a built Pages tree."""
from __future__ import annotations

import argparse
from html.parser import HTMLParser
from pathlib import Path
import shutil
from urllib.parse import urlsplit, unquote

ROUTE='/research/bci/'
CANONICAL='https://rexzen.si'+ROUTE
ASSETS = ('index.html','technical.html','demo.html','wearable.svg','electrodes.svg','architecture.svg',
          'Rexzen-Neural-R0.pdf','Rexzen-Neural-Investor.pptx','Rexzen-Neural-R0-source.zip','benchmark.json','evidence.json')
INSERT = '''
<section class="section wrap" id="neural-r0" aria-labelledby="neural-r0-title">
  <p class="eyebrow">Research release / Neural R0</p>
  <h2 id="neural-r0-title">A discreet EEG wearable concept</h2>
  <p>Proposed hardware, a reproducible offline EEG experiment, and a simulated control flow. This is not a product launch or a speech-decoding demonstration.</p>
  <p><a href="/research/bci/">Explore Rexzen Neural R0 →</a></p>
</section>
'''

class AssetLinks(HTMLParser):
    def __init__(self,text):
        super().__init__(); self.links=[]; self.feed(text)
    def handle_starttag(self,tag,attrs):
        self.links.extend(v for k,v in attrs if k in {'href','src'} and v)

def publish(release,root):
    src=Path(release)
    dst=Path(root)
    section=dst/'research'
    route=section/'bci'
    sitemap=dst/'sitemap.xml'
    index=section/'index.html'
    if route.exists() or route.is_symlink() or index.is_symlink() or sitemap.is_symlink():
        raise ValueError('expected an unused route and standard Pages files')
    seen={p.name for p in src.iterdir()}
    if seen!=set(ASSETS): raise ValueError(f'release asset mismatch: {seen.symmetric_difference(ASSETS)}')
    for name in ASSETS:
        path=src/name
        if not path.is_file() or path.is_symlink() or not path.stat().st_size:
            raise ValueError('invalid artifact: '+name)
        if path.suffix=='.html':
            for link in AssetLinks(path.read_text(encoding='utf-8')).links:
                url=urlsplit(link)
                if url.scheme or url.netloc or not url.path or url.path.startswith('/'):
                    continue
                if unquote(url.path) not in ASSETS:
                    raise ValueError(f'{name}: invalid relative asset {link}')
    research=index.read_text(encoding='utf-8')
    urls=sitemap.read_text(encoding='utf-8')
    if any(x in research for x in (ROUTE, 'id="neural-r0"')) or research.count('</main>')!=1:
        raise ValueError('unexpected research-index structure')
    if CANONICAL in urls or urls.count('</urlset>')!=1:
        raise ValueError('unexpected sitemap structure')
    route.mkdir()
    for name in ASSETS: shutil.copyfile(src/name,route/name)
    index.write_text(research.replace('</main>', INSERT+'</main>',1),encoding='utf-8',newline='\n')
    sitemap.write_text(urls.replace('</urlset>',f'  <url><loc>{CANONICAL}</loc></url>\n</urlset>',1),encoding='utf-8',newline='\n')
    print(f'Published {len(ASSETS)} staged assets under {ROUTE}; updated research index and sitemap only')

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('release',type=Path);p.add_argument('site',type=Path)
    args=p.parse_args();publish(args.release,args.site)
