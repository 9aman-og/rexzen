"""Local or live browser smoke; runs without adding a website dependency."""
import os
import re
import unittest

BASE = os.environ.get('D4096_URL')
if not BASE:
    raise unittest.SkipTest('Set D4096_URL to run the browser smoke')

from playwright.sync_api import sync_playwright, expect
EDGE = os.environ.get('D4096_CHROMIUM')


class Experience(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.play = sync_playwright().start()
        cls.browser = cls.play.chromium.launch(executable_path=EDGE, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.play.stop()

    def test_product_view_and_distinct_contact_failures(self):
        page = self.browser.new_page(viewport={'width':1440,'height':900}, reduced_motion='reduce')
        self.addCleanup(page.close)
        errors=[]
        page.on('pageerror', lambda e:errors.append(str(e)))
        self.assertEqual(page.goto(BASE).status, 200)
        expect(page.locator('#model-stage')).to_have_attribute('data-renderer','3d',timeout=22000)
        expect(page.locator('#model-stage canvas')).to_have_attribute('data-count','4096')
        expect(page.locator('#model-poster')).to_be_hidden()
        first = page.locator('#model-stage canvas').screenshot()
        page.get_by_role('button',name='Exploded view',exact=True).press('Enter')
        expect(page.locator('#model-stage')).to_have_attribute('data-view','layers')
        expect(page.get_by_role('button',name='Exploded view',exact=True)).to_have_attribute('aria-pressed','true')
        self.assertNotEqual(first, page.locator('#model-stage canvas').screenshot())
        select=page.get_by_role('combobox',name='Fault scenario')
        select.select_option('scattered')
        expect(page.locator('#sim-valid')).to_have_text('4,000')
        expect(page.locator('#sim-result')).to_have_text('Within modeled thresholds')
        select.select_option('clustered')
        expect(page.locator('#sim-valid')).to_have_text('4,000')
        expect(page.locator('#sim-result')).to_have_text('Withheld: sector coverage')
        expect(page.locator('#coverage-map')).to_have_attribute('aria-label','Electrode map: 96 of 4,096 positions are rejected')
        select.select_option('two-tiles')
        expect(page.locator('#sim-valid')).to_have_text('3,968')
        expect(page.locator('#sim-result')).to_have_text('Withheld: total coverage')
        select.select_option('reference')
        expect(page.locator('#sim-valid')).to_have_text('0')
        expect(page.locator('#sim-present')).to_have_text('4,096')
        self.assertEqual(errors,[])

    def test_mobile_webgl_loss_keeps_the_workbench_and_links(self):
        page=self.browser.new_page(viewport={'width': 390,'height':844},is_mobile=True,has_touch=True)
        self.addCleanup(page.close)
        page.route(re.compile(r'/d4096-viewer\.mjs($|\?)'),lambda route:route.abort())
        page.goto(BASE)
        expect(page.locator('#model-stage')).to_have_attribute('data-renderer','static',timeout=22000)
        expect(page.locator('#model-poster')).to_be_visible()
        page.get_by_role('combobox',name='Fault scenario').select_option('one-tile')
        expect(page.locator('#sim-valid')).to_have_text('4,032')
        self.assertTrue(page.evaluate('document.documentElement.scrollWidth === window.innerWidth'))
        expect(page.get_by_role('link',name='Investor brief',exact=True).first).to_have_attribute('href','investor-brief.pdf')

    def test_no_script_keeps_core_evidence_and_documents(self):
        page=self.browser.new_page(viewport={'width':320,'height':760},java_script_enabled=False)
        self.addCleanup(page.close)
        page.goto(BASE)
        expect(page.get_by_role('heading',level=1)).to_contain_text('4,096')
        self.assertRegex(page.get_by_role('heading',level=1).inner_text(),r'points\s+of contact')
        expect(page.locator('#model-poster')).to_be_visible()
        expect(page.get_by_role('link',name='Engineering report',exact=True).first).to_be_attached()
        self.assertTrue(page.evaluate('document.documentElement.scrollWidth === window.innerWidth'))

    def test_data_failure_keeps_research_downloads_and_never_enables_gate(self):
        page=self.browser.new_page()
        self.addCleanup(page.close)
        page.route(re.compile(r'/electrode-map\.csv($|\?)'),lambda route:route.fulfill(status=200,content_type='text/csv',body='address,x,y\n0,0,0\n'))
        page.goto(BASE)
        expect(page.locator('#sim-result')).to_have_text('Workbench unavailable')
        expect(page.get_by_role('combobox',name='Fault scenario')).to_be_disabled()
        expect(page.locator('#model-poster')).to_be_visible()
        expect(page.get_by_role('link',name='Investor brief',exact=True).first).to_be_visible()

    def test_optional_coverage_canvas_failure_does_not_stop_numeric_gate(self):
        page=self.browser.new_page()
        self.addCleanup(page.close)
        page.add_init_script('''
            const getContext=HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext=function(...args){
                if(this.id==='coverage-map')throw new DOMException('Canvas blocked','SecurityError');
                return getContext.apply(this,args);
            };
        ''')
        page.goto(BASE)
        select=page.get_by_role('combobox',name='Fault scenario')
        select.select_option('clustered')
        expect(page.locator('#sim-result')).to_have_text('Withheld: sector coverage')
        expect(page.locator('#sim-valid')).to_have_text('4,000')


if __name__=='__main__': unittest.main()
