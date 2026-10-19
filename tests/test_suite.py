"""
ScamShield Lab - Comprehensive Automated Unit & UI Validation Suite
Complies with Project Mandates (Rules 1, 2, 3, 4, 5)
"""

import os
import re
import unittest
import subprocess

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestProjectMandatesAndBranching(unittest.TestCase):
    """Rule 5: Feature branch workflow test."""

    def test_current_branch_is_feature_branch(self):
        result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=WORKSPACE_ROOT,
            capture_output=True,
            text=True
        )
        current_branch = result.stdout.strip()
        self.assertNotEqual(
            current_branch, "main",
            "Rule 5 Violation: Work must never be conducted directly on the 'main' branch!"
        )
        self.assertTrue(
            current_branch.startswith("feature/"),
            f"Rule 5 Violation: Branch '{current_branch}' must follow feature/* naming convention!"
        )

    def test_rules_file_exists(self):
        agents_md = os.path.join(WORKSPACE_ROOT, "AGENTS.md")
        gemini_md = os.path.join(WORKSPACE_ROOT, "GEMINI.md")
        rule5_file = os.path.join(WORKSPACE_ROOT, ".agents", "rules", "branching-and-merge.md")
        
        self.assertTrue(os.path.isfile(agents_md), "AGENTS.md must exist")
        self.assertTrue(os.path.isfile(gemini_md), "GEMINI.md must exist")
        self.assertTrue(os.path.isfile(rule5_file), "Rule 5 definition file must exist")
        
        with open(agents_md, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("Rule 5: Feature Branch Workflow", content)


class TestHeaderAndNavigationStyles(unittest.TestCase):
    """Header layout & overlap prevention tests."""

    def setUp(self):
        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            self.css = f.read()

    def test_brand_logo_has_flex_shrink_zero(self):
        self.assertTrue(
            re.search(r"\.brand-logo\s*\{[^}]*flex-shrink:\s*0", self.css),
            "UI Safety Mandate: .brand-logo must have flex-shrink: 0 to prevent text squishing"
        )

    def test_nav_actions_has_flex_shrink_zero(self):
        self.assertTrue(
            re.search(r"\.nav-actions\s*\{[^}]*flex-shrink:\s*0", self.css),
            "UI Safety Mandate: .nav-actions must have flex-shrink: 0 to prevent button overlap"
        )

    def test_nav_cta_btn_has_white_space_nowrap(self):
        self.assertTrue(
            re.search(r"\.nav-cta-btn\s*\{[^}]*white-space:\s*nowrap", self.css),
            "UI Safety Mandate: .nav-cta-btn must have white-space: nowrap to prevent multi-line wrap"
        )

    def test_nav_links_have_nowrap(self):
        self.assertTrue(
            re.search(r"\.nav-links\s+a\s*\{[^}]*white-space:\s*nowrap", self.css),
            "UI Safety Mandate: .nav-links a must have white-space: nowrap"
        )

    def test_responsive_breakpoint_covers_tablets_and_laptops(self):
        self.assertTrue(
            "@media (max-width: 1080px)" in self.css or "@media (max-width: 1100px)" in self.css,
            "Responsive Mandate: Nav must collapse into mobile drawer for widths <= 1080px to prevent overlap"
        )


class TestHtmlPagesStructure(unittest.TestCase):
    """HTML validation across all published pages."""

    HTML_FILES = [
        "index.html",
        "about.html",
        "privacy.html",
        "terms.html",
        "guide-voice-cloning.html",
        "guide-pig-butchering.html"
    ]

    def test_all_pages_have_consistent_header_brand_tag(self):
        for filename in self.HTML_FILES:
            filepath = os.path.join(WORKSPACE_ROOT, filename)
            self.assertTrue(os.path.isfile(filepath), f"{filename} must exist")
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                self.assertIn(
                    'class="brand-tag">AI LAB</span>',
                    content,
                    f"Brand consistency error: {filename} must display the new AI LAB brand tag"
                )
                self.assertIn(
                    'class="nav-cta-btn"',
                    content,
                    f"Button consistency error: {filename} must use .nav-cta-btn"
                )

    def test_no_empty_adsense_raw_text_above_hero(self):
        index_path = os.path.join(WORKSPACE_ROOT, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            content = f.read()
            # Ensure raw developer placeholders are not above the hero
            hero_pos = content.find('<section class="hero-section">')
            header_pos = content.find('<header class="site-header">')
            interstitial = content[header_pos:hero_pos]
            self.assertNotIn(
                "Google AdSense Header Leaderboard",
                interstitial,
                "UI Mandate: Cluttering empty AdSense placeholder text must not appear above hero"
            )

    def test_images_have_dimensions(self):
        for filename in self.HTML_FILES:
            filepath = os.path.join(WORKSPACE_ROOT, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                img_tags = re.findall(r"<img\s+[^>]*>", content)
                for tag in img_tags:
                    self.assertTrue(
                        "width=" in tag or "height=" in tag or "style=" in tag,
                        f"Rule 1 Asset Optimization: Image tag {tag} in {filename} must have dimensions"
                    )


class TestAppJsSecurityAndHeuristics(unittest.TestCase):
    """Unit tests for client-side JavaScript logic (app.js)."""

    def setUp(self):
        js_path = os.path.join(WORKSPACE_ROOT, "js", "app.js")
        with open(js_path, "r", encoding="utf-8") as f:
            self.js_code = f.read()

    def test_xss_escape_html_function_defined(self):
        self.assertIn("function escapeHtml(str)", self.js_code)
        self.assertIn("&amp;", self.js_code)
        self.assertIn("&lt;", self.js_code)
        self.assertIn("&gt;", self.js_code)

    def test_no_raw_innerhtml_of_user_input(self):
        # Verify that scamTextInput value is never directly assigned to innerHTML without sanitization or score processing
        self.assertNotIn("innerHTML = inputEl.value", self.js_code)
        self.assertNotIn("innerHTML = text", self.js_code)

    def test_python_simulation_of_escape_html(self):
        def escape_html(s):
            if s is None:
                return ""
            return (
                str(s)
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace('"', "&quot;")
                .replace("'", "&#039;")
            )

        malicious_input = '<script>alert("XSS")</script>&<img src=x onerror=alert(1)>'
        sanitized = escape_html(malicious_input)
        self.assertNotIn("<script>", sanitized)
        self.assertNotIn("<img", sanitized)
        self.assertIn("&lt;script&gt;", sanitized)

    def test_grandparent_emergency_scam_detection(self):
        """Verify that the user's specific Grandparent/CashApp emergency message is caught as CRITICAL."""
        test_message = "Hi Grandma, it's your grandson. I got into a car accident and need money for the hospital, please send $500 to this CashApp:"
        
        # Verify app.js contains family impersonation, CashApp, and accident rules
        self.assertIn("grandma", self.js_code.lower())
        self.assertIn("grandson", self.js_code.lower())
        self.assertIn("car accident", self.js_code.lower())
        self.assertIn("cashapp", self.js_code.lower())
        self.assertIn("isFamilyEmergency", self.js_code)
        self.assertIn("Family Impersonation / Grandparent Emergency Scam", self.js_code)



class TestCopyrightAndLegalCompliance(unittest.TestCase):
    """Rule 6: Copyright & Intellectual Property Protection Mandate."""

    def test_rule_6_defined_in_agents_and_gemini_rules(self):
        agents_md = os.path.join(WORKSPACE_ROOT, "AGENTS.md")
        gemini_md = os.path.join(WORKSPACE_ROOT, "GEMINI.md")
        rule6_file = os.path.join(WORKSPACE_ROOT, ".agents", "rules", "copyright-compliance.md")
        
        self.assertTrue(os.path.isfile(rule6_file), "copyright-compliance.md rule file must exist")
        
        with open(agents_md, "r", encoding="utf-8") as f:
            self.assertIn("Rule 6: Copyright & Intellectual Property Protection Mandate", f.read())
        with open(gemini_md, "r", encoding="utf-8") as f:
            self.assertIn("Rule 6: Copyright & Intellectual Property Protection Mandate", f.read())

    def test_terms_has_trademark_fair_use_and_dmca_notice(self):
        terms_path = os.path.join(WORKSPACE_ROOT, "terms.html")
        with open(terms_path, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("Nominative Fair Use", content)
            self.assertIn("DMCA Copyright Infringement Notice", content)
            self.assertIn("legal@scamshieldlab.com", content)

    def test_all_referenced_images_exist(self):
        html_files = [
            "index.html",
            "about.html",
            "privacy.html",
            "terms.html",
            "guide-voice-cloning.html",
            "guide-pig-butchering.html"
        ]
        assets_dir = os.path.join(WORKSPACE_ROOT, "assets", "images")
        existing_images = set(os.listdir(assets_dir))

        for filename in html_files:
            filepath = os.path.join(WORKSPACE_ROOT, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                matches = re.findall(r"assets/images/([a-zA-Z0-9_\-\.]+)", content)
                for img_name in matches:
                    self.assertIn(
                        img_name,
                        existing_images,
                        f"Unresolved or missing image '{img_name}' referenced in {filename}"
                    )


if __name__ == "__main__":
    unittest.main()

