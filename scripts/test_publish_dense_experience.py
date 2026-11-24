#!/usr/bin/env python3
"""Integration checks for the snapshot publisher without involving the network."""
import tempfile
from pathlib import Path
import unittest

from publish_dense_research import ASSETS, publish


class DenseRelease(unittest.TestCase):
    def test_public_overlay_installs_workbench_without_replacing_r0_payloads(self):
        source = Path(__file__).resolve().parents[1] / 'public-research' / 'dense-4096'
        with tempfile.TemporaryDirectory() as folder:
            tree = Path(folder)
            root = tree / 'research'
            parent = root / 'bci'
            parent.mkdir(parents=True)
            (parent / 'index.html').write_text('<main>Rexzen Neural R0</main>', encoding='utf-8')
            (parent / 'benchmark.json').write_bytes(b'untouched')
            (root / 'index.html').write_text('<main>Rexzen Research</main>', encoding='utf-8')
            (tree / 'sitemap.xml').write_text('<urlset></urlset>', encoding='utf-8')
            self.assertIn('d4096-gate.mjs', ASSETS, 'publication does not include the new workbench yet')
            publish(source, tree)
            installed = parent / 'dense-4096'
            self.assertEqual({p.name for p in installed.iterdir()}, set(ASSETS))
            self.assertIn('/research/bci/dense-4096/', (parent / 'index.html').read_text(encoding='utf-8'))
            self.assertIn('/research/bci/dense-4096/', (root / 'index.html').read_text(encoding='utf-8'))
            self.assertIn('/research/bci/dense-4096/', (tree / 'sitemap.xml').read_text(encoding='utf-8'))
            self.assertEqual((parent / 'benchmark.json').read_bytes(), b'untouched')
            self.assertEqual((installed / 'rexzen-d4096.pdf').read_bytes(), (source / 'rexzen-d4096.pdf').read_bytes())
            with self.assertRaises(ValueError):
                publish(source, tree)


if __name__ == '__main__':
    unittest.main()
