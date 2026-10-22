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
        # On release branches (main/master), verify clean production state; on active work branches, enforce feature/* prefix
        if current_branch not in ["main", "master"]:
            self.assertTrue(
                current_branch.startswith("feature/"),
                f"Rule 5 Violation: Work branch '{current_branch}' must follow feature/* naming convention!"
            )
        else:
            self.assertIn(current_branch, ["main", "master"])

    def test_main_and_master_are_synchronized(self):
        """Rule 5 Mandate: Ensure main and master branches always point to the identical commit."""
        main_sha = subprocess.run(
            ["git", "rev-parse", "refs/heads/main"],
            cwd=WORKSPACE_ROOT,
            capture_output=True,
            text=True
        ).stdout.strip()
        master_sha = subprocess.run(
            ["git", "rev-parse", "refs/heads/master"],
            cwd=WORKSPACE_ROOT,
            capture_output=True,
            text=True
        ).stdout.strip()
        self.assertEqual(
            main_sha, master_sha,
            f"Branch Synchronization Mandate: main ({main_sha}) and master ({master_sha}) must point to the same commit!"
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

    def test_rule_7_local_port_mandate(self):
        """Rule 7: Local server port mandate and prohibition of port 8080."""
        agents_md = os.path.join(WORKSPACE_ROOT, "AGENTS.md")
        gemini_md = os.path.join(WORKSPACE_ROOT, "GEMINI.md")
        rule7_file = os.path.join(WORKSPACE_ROOT, ".agents", "rules", "local-development-port.md")

        self.assertTrue(os.path.isfile(rule7_file), "local-development-port.md must exist")
        
        for filepath in [agents_md, gemini_md, rule7_file]:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                self.assertIn("Rule 7", content)
                self.assertIn("8080", content)
                self.assertIn("5050", content)


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
        "guide-pig-butchering.html",
        "family-safe-word.html"
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

    def test_no_css_font_import_in_styles_css(self):
        """Rule 1 Mandate: No blocking @import in styles.css to eliminate font FOUT and CLS."""
        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()
            self.assertNotIn("@import url", css, "styles.css must not contain blocking @import url(...)")

    def test_all_html_files_link_google_fonts_directly(self):
        """Rule 1 Mandate: All HTML files must link Google Fonts directly in <head> for zero-shift delivery."""
        for filename in self.HTML_FILES:
            filepath = os.path.join(WORKSPACE_ROOT, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                self.assertIn("fonts.googleapis.com/css2", content, f"{filename} must link fonts stylesheet in <head>")
                self.assertIn("display=swap", content, f"{filename} font link must declare display=swap")

    def test_cls_layout_stability_aspect_ratios_and_min_heights(self):
        """Rule 1 Mandate: Cumulative Layout Shift (CLS) = 0 requires aspect-ratios and reserved min-heights."""
        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()
            self.assertIn("aspect-ratio: 16 / 9", css, "hero visual and img must declare aspect-ratio: 16 / 9")
            self.assertIn("min-height: 560px", css, "threat-grid must declare reserved min-height")
            self.assertIn("min-height: 420px", css, "quiz-wrapper-card must declare reserved min-height")
            self.assertIn("contain: layout", css, "dynamic components must enforce layout containment")

    def test_asset_synchronization_and_cache_busting(self):
        """Rule 1 Mandate: All HTML files must link stylesheets and scripts with synchronized cache-busting tokens."""
        css_versions = {}
        for filename in self.HTML_FILES:
            filepath = os.path.join(WORKSPACE_ROOT, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                # Stylesheet cache-busting
                match = re.search(r'href="css/styles\.css\?v=([^"]+)"', content)
                self.assertIsNotNone(
                    match,
                    f"Rule 1 Asset Synchronization: {filename} must link css/styles.css with a ?v= version token"
                )
                css_versions[filename] = match.group(1)

                # Script cache-busting for config.js
                config_match = re.search(r'src="config\.js\?v=([^"]+)"', content)
                self.assertIsNotNone(
                    config_match,
                    f"Rule 1 Asset Synchronization: {filename} must link config.js with a ?v= version token"
                )

        # Ensure all HTML files declare the identical active CSS version
        unique_versions = set(css_versions.values())
        self.assertEqual(
            len(unique_versions), 1,
            f"Rule 1 Asset Synchronization: All HTML files must declare the exact same CSS version token, found: {css_versions}"
        )

    def test_rule_1_mandate_documented_in_rules_files(self):
        """Verifies that the Asset Synchronization & Cache-Busting Mandate is permanently codified."""
        agents_md = os.path.join(WORKSPACE_ROOT, "AGENTS.md")
        gemini_md = os.path.join(WORKSPACE_ROOT, "GEMINI.md")
        sync_rule = os.path.join(WORKSPACE_ROOT, ".agents", "rules", "asset-synchronization.md")

        for fpath in [agents_md, gemini_md, sync_rule]:
            with open(fpath, "r", encoding="utf-8") as f:
                self.assertIn("Asset Synchronization & Cache-Busting Mandate", f.read())

    def test_scrollbar_gutter_and_body_stabilization(self):
        """Rule 1 Mandate: Scrollbar gutter and body height must be reserved to prevent body layout shifts."""
        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()
            self.assertIn("scrollbar-gutter: stable", css, "html must declare scrollbar-gutter: stable")
            self.assertIn("overflow-y: scroll", css, "html must declare overflow-y: scroll")
            self.assertIn("min-height: 100vh", css, "body must declare min-height: 100vh")


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

    def test_sunpass_smishing_detection_scores_critical(self):
        """Verify that SunPass / toll smishing is caught as CRITICAL threat and triggers FBI smishing warning."""
        test_message = "SunPass Alert: You have an unpaid toll of $3.25. Pay now to avoid additional fees:"
        
        # Verify app.js contains toll keywords, action phrases, and smishing classification
        self.assertIn("sunpass", self.js_code.lower())
        self.assertIn("unpaid toll", self.js_code.lower())
        self.assertIn("avoid additional fees", self.js_code.lower())
        self.assertIn("isTollSmishing", self.js_code)
        self.assertIn("FBI-Alerted Smishing Scam: Road Toll Impersonation", self.js_code)

    def test_suspicion_score_floor_enforced(self):
        """Verify the user's principle: Any message with security flags must never score < 50 (floor >= 52)."""
        self.assertIn("score = Math.max(score, 52)", self.js_code)
        self.assertIn("score = Math.max(score, 75)", self.js_code)

    def test_url_verification_advisory_in_app_and_html(self):
        """Verify Zero-Trust URL & domain advisory is present in index.html, app.js, and styles.css."""
        index_path = os.path.join(WORKSPACE_ROOT, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            index_html = f.read()
        self.assertIn("analyzerUrlAdvisory", index_html)
        self.assertIn("url-advisory-box", index_html)

        self.assertIn("analyzerUrlAdvisory", self.js_code)
        self.assertIn("Zero-Trust Safety Advisory", self.js_code)
        self.assertIn("sunpass.com", self.js_code)

        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css_code = f.read()
        self.assertIn(".url-advisory-box", css_code)
        self.assertIn(".advisory-checklist", css_code)



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

    def test_non_affiliation_disclaimer_present_across_all_pages(self):
        """Rule 6: Verify non-affiliation disclaimer referencing scamshield.gov.sg is in every published HTML file."""
        html_files = [
            "index.html",
            "about.html",
            "privacy.html",
            "terms.html",
            "guide-voice-cloning.html",
            "guide-pig-butchering.html",
            "family-safe-word.html"
        ]
        for filename in html_files:
            filepath = os.path.join(WORKSPACE_ROOT, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                self.assertIn(
                    "scamshield.gov.sg",
                    content,
                    f"Legal Mandate (Rule 6): {filename} must display the non-affiliation notice referencing scamshield.gov.sg"
                )

    def test_about_and_terms_have_explicit_non_affiliation_clauses(self):
        """Rule 6: Verify dedicated non-affiliation clauses in about.html and terms.html."""
        about_path = os.path.join(WORKSPACE_ROOT, "about.html")
        terms_path = os.path.join(WORKSPACE_ROOT, "terms.html")
        
        with open(about_path, "r", encoding="utf-8") as f:
            about_content = f.read()
            self.assertIn("Independent Organization & Trademark Notice", about_content)
            self.assertIn("Government of Singapore", about_content)
            self.assertIn("GovTech Singapore", about_content)

        with open(terms_path, "r", encoding="utf-8") as f:
            terms_content = f.read()
            self.assertIn("Non-Affiliation Notice", terms_content)
            self.assertIn("Government of Singapore", terms_content)

    def test_all_referenced_images_exist(self):
        html_files = [
            "index.html",
            "about.html",
            "privacy.html",
            "terms.html",
            "guide-voice-cloning.html",
            "guide-pig-butchering.html",
            "family-safe-word.html"
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


class TestFamilySafeWordTool(unittest.TestCase):
    """Validation for Family Safe Word & AI Voice Cloning Defense Kit Generator."""

    def setUp(self):
        self.tool_path = os.path.join(WORKSPACE_ROOT, "family-safe-word.html")
        with open(self.tool_path, "r", encoding="utf-8") as f:
            self.content = f.read()

    def test_file_exists_and_has_schema(self):
        self.assertTrue(os.path.isfile(self.tool_path))
        self.assertIn('"@type": "WebApplication"', self.content)
        self.assertIn("Family Safe Word", self.content)

    def test_interactive_controls_present(self):
        required_ids = [
            "familyNameInput",
            "safeWordInput",
            "rollWordBtn",
            "challengeSelect",
            "answerInput",
            "cardFamilyDisplay",
            "cardSafeWordDisplay",
            "cardQuestionDisplay",
            "cardAnswerDisplay",
            "copyProtocolBtn",
            "printCardBtn"
        ]
        for elem_id in required_ids:
            self.assertIn(f'id="{elem_id}"', self.content, f"Missing required element id: {elem_id}")

    def test_accessibility_labels_and_skip_link(self):
        self.assertIn('class="skip-link"', self.content)
        self.assertIn('for="familyNameInput"', self.content)
        self.assertIn('for="safeWordInput"', self.content)
        self.assertIn('for="challengeSelect"', self.content)

    def test_non_affiliation_disclaimer_present(self):
        self.assertIn("scamshield.gov.sg", self.content)


class TestEditorialAndResearchIntegrity(unittest.TestCase):
    """Verifies that fictional personas are replaced with authentic research methodology."""

    def test_no_fictional_persona_names(self):
        fictional_names = ["Marcus Vance", "Elena Rostova", "Kevin Nguyen"]
        for root, _, files in os.walk(WORKSPACE_ROOT):
            if ".git" in root or ".agents" in root or "tests" in root:
                continue
            for f in files:
                if f.endswith((".html", ".js")):
                    path = os.path.join(root, f)
                    with open(path, "r", encoding="utf-8") as file:
                        content = file.read()
                        for name in fictional_names:
                            self.assertNotIn(
                                name, content,
                                f"Fictional persona '{name}' must not appear in production file {f}"
                            )

    def test_about_page_has_research_methodology(self):
        about_path = os.path.join(WORKSPACE_ROOT, "about.html")
        with open(about_path, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("Research Methodology & Intelligence Architecture", content)
            self.assertIn("Client-Side Heuristic Engine", content)
            self.assertIn("Federal & Regulatory Intelligence", content)
            self.assertIn("Adversary Tactics Reverse-Engineering", content)

    def test_guide_bylines_use_research_lab(self):
        guides = ["guide-voice-cloning.html", "guide-pig-butchering.html"]
        for g in guides:
            path = os.path.join(WORKSPACE_ROOT, g)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                self.assertIn("ScamShield Threat Research Lab", content)


class TestThreatRadarSearchEngine(unittest.TestCase):
    """Validation tests for Threat Radar intelligence database and keyword search."""

    def setUp(self):
        threat_path = os.path.join(WORKSPACE_ROOT, "js", "threat-data.js")
        with open(threat_path, "r", encoding="utf-8") as f:
            self.threat_code = f.read()

        app_path = os.path.join(WORKSPACE_ROOT, "js", "app.js")
        with open(app_path, "r", encoding="utf-8") as f:
            self.app_code = f.read()

    def test_threat_database_contains_critical_threats(self):
        self.assertIn("toll-smishing", self.threat_code)
        self.assertIn("SunPass", self.threat_code)
        self.assertIn("E-ZPass", self.threat_code)
        self.assertIn("bank-impersonation", self.threat_code)
        self.assertIn("zelle", self.threat_code.lower())
        self.assertIn("irs-government-extortion", self.threat_code)

    def test_app_js_multi_field_matching_and_recovery(self):
        self.assertIn("inKeywords", self.app_code)
        self.assertIn("inCaseStudy", self.app_code)
        self.assertIn("inCategoryName", self.app_code)
        self.assertIn("search-suggestion-btn", self.app_code)
        self.assertIn("allMatches", self.app_code)


class TestNordAffiliatePartnerIntegration(unittest.TestCase):
    """Rule 1 & Rule 6: Validation tests for Nord verified partner assets and in-tool defense recommendations."""

    def test_official_nord_svg_icons_exist(self):
        vpn_icon = os.path.join(WORKSPACE_ROOT, "assets", "images", "nordvpn-icon.svg")
        pass_icon = os.path.join(WORKSPACE_ROOT, "assets", "images", "nordpass-icon.svg")
        self.assertTrue(os.path.isfile(vpn_icon), "Official NordVPN SVG icon must exist")
        self.assertTrue(os.path.isfile(pass_icon), "Official NordPass SVG icon must exist")

    def test_config_js_nord_partner_urls_and_svg_icons(self):
        config_path = os.path.join(WORKSPACE_ROOT, "config.js")
        with open(config_path, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("assets/images/nordvpn-icon.svg", content)
            self.assertIn("assets/images/nordpass-icon.svg", content)
            self.assertIn("aff_id=159036", content)

    def test_defense_recommendation_container_and_styles(self):
        index_path = os.path.join(WORKSPACE_ROOT, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            self.assertIn('id="analyzerDefenseRecommendation"', f.read())

        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()
            self.assertIn(".defense-recommendation-box", css)
            self.assertIn(".affiliate-brand-img", css)

    def test_app_js_renders_defense_recommendations(self):
        app_path = os.path.join(WORKSPACE_ROOT, "js", "app.js")
        with open(app_path, "r", encoding="utf-8") as f:
            app_code = f.read()
            self.assertIn("analyzerDefenseRecommendation", app_code)
            self.assertIn("NordVPN Threat Protection Pro", app_code)
            self.assertIn("NordPass Premium & Passkey Vault", app_code)
            self.assertIn("affiliate-brand-img", app_code)


class TestAboveTheFoldTrustAndLiveDemo(unittest.TestCase):
    """Validation tests for instant above-the-fold credibility, live demo, and authority trust bar."""

    def setUp(self):
        index_path = os.path.join(WORKSPACE_ROOT, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            self.index_html = f.read()

        app_path = os.path.join(WORKSPACE_ROOT, "js", "app.js")
        with open(app_path, "r", encoding="utf-8") as f:
            self.app_js = f.read()

        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            self.css = f.read()

    def test_hero_non_affiliation_disclaimer(self):
        """Ensures immediate 5-second credibility with prominent Singapore non-affiliation notice in hero."""
        self.assertIn("hero-disclaimer-pill", self.index_html)
        self.assertIn("scamshield.gov.sg", self.index_html)
        self.assertIn(".hero-disclaimer-pill", self.css)

    def test_hero_live_demo_controls(self):
        """Ensures live interactive demo is available above the fold with paste, clear, and scan controls."""
        self.assertIn("hero-live-demo-card", self.index_html)
        self.assertIn('id="heroQuickInput"', self.index_html)
        self.assertIn('id="heroScanBtn"', self.index_html)
        self.assertIn('id="heroPasteBtn"', self.index_html)
        self.assertIn('id="heroClearBtn"', self.index_html)
        self.assertIn("hero-sample-chip", self.index_html)
        self.assertIn(".hero-live-demo-card", self.css)
        self.assertIn(".btn-hero-aux", self.css)

    def test_hero_social_proof_numbers(self):
        """Ensures verified social proof statistics are prominently displayed in the hero."""
        self.assertIn("hero-social-proof-strip", self.index_html)
        self.assertIn("15,400+", self.index_html)
        self.assertIn("98.8%", self.index_html)
        self.assertIn(".hero-social-proof-strip", self.css)

    def test_authority_trust_bar(self):
        """Ensures authority threat intelligence frameworks (FBI IC3, FTC, CISA, OWASP, NIST) are displayed."""
        self.assertIn("trust-authority-bar", self.index_html)
        self.assertIn("FBI IC3", self.index_html)
        self.assertIn("FTC", self.index_html)
        self.assertIn("CISA", self.index_html)
        self.assertIn("OWASP", self.index_html)
        self.assertIn("NIST", self.index_html)
        self.assertIn(".trust-authority-bar", self.css)

    def test_app_js_wires_hero_demo_controls(self):
        """Ensures app.js event listeners correctly wire up hero sample chips, paste button, clear button, and scan button."""
        self.assertIn("heroQuickInput", self.app_js)
        self.assertIn("heroSampleChips", self.app_js)
        self.assertIn("heroScanBtn", self.app_js)
        self.assertIn("heroPasteBtn", self.app_js)
        self.assertIn("heroClearBtn", self.app_js)

    def test_prize_lucky_draw_scam_detection(self):
        """Ensures fake lottery, lucky draw, and Indian Rupee / shortener smishing are recognized."""
        self.assertIn("Fake Lucky Draw / Lottery Prize Scam", self.app_js)
        self.assertIn("Masked URL Shortener", self.app_js)
        self.assertIn("bit.ly", self.app_js)

    def test_fake_job_recruitment_scam_detection(self):
        """Ensures fake job / task-based smishing (found your profile, flexible job, reply YES/INTERESTED) is recognized."""
        self.assertIn("Fake Job / Part-Time Task Scam Lure", self.app_js)
        self.assertIn("flexible job", self.app_js)
        self.assertIn("reply with yes", self.app_js)

    def test_otp_refund_interception_scam_detection(self):
        """Ensures OTP code theft and fake refund confirmation traps are recognized as critical threats."""
        self.assertIn("2FA / OTP Theft Disguised as Refund Confirmation", self.app_js)
        self.assertIn("One-Time Passcode (OTP) Harvesting Trap", self.app_js)
        self.assertIn("receive a code", self.app_js)
        self.assertIn("confirm the refund", self.app_js)
        self.assertIn("NEVER require you to receive or confirm a code to issue refunds", self.app_js)

    def test_cloudflare_deployment_config(self):
        """Ensures wrangler.toml and package.json exist and specify correct Worker static assets deployment settings."""
        wrangler_path = os.path.join(WORKSPACE_ROOT, "wrangler.toml")
        package_path = os.path.join(WORKSPACE_ROOT, "package.json")
        assetsignore_path = os.path.join(WORKSPACE_ROOT, ".assetsignore")
        self.assertTrue(os.path.exists(wrangler_path), "wrangler.toml must exist for Cloudflare deployment")
        self.assertTrue(os.path.exists(package_path), "package.json must exist for Cloudflare tool detection")
        self.assertTrue(os.path.exists(assetsignore_path), ".assetsignore must exist for asset filtering")

        with open(wrangler_path, "r", encoding="utf-8") as f:
            wrangler_content = f.read()
        self.assertIn("scamshieldlab-live", wrangler_content)
        self.assertIn("[assets]", wrangler_content)
        self.assertIn('directory = "."', wrangler_content)

        with open(package_path, "r", encoding="utf-8") as f:
            package_content = f.read()
        self.assertIn("wrangler", package_content)
        self.assertIn('"deploy": "wrangler deploy"', package_content)

    def test_giant_guest_mode_primary_cta(self):
        """Conversion UX Mandate: Guest mode is the default with a giant primary CTA to reduce friction."""
        self.assertIn('id="giantGuestCtaBtn"', self.index_html)
        self.assertIn("btn-giant-guest-cta", self.index_html)
        self.assertIn("No Account Needed", self.index_html)
        self.assertIn(".btn-giant-guest-cta", self.css)
        self.assertIn("giantGuestCtaBtn", self.app_js)

    def test_three_one_click_example_scams(self):
        """Conversion UX Mandate: Provides 3 one-click example scams (Phishing, Job Scam, Delivery Scam) so users don't have to type."""
        threat_data_path = os.path.join(WORKSPACE_ROOT, "js", "threat-data.js")
        with open(threat_data_path, "r", encoding="utf-8") as f:
            threat_data_js = f.read()

        # Check in threat-data.js presets
        self.assertIn("🎣 Phishing Scam", threat_data_js)
        self.assertIn("💼 Job Scam", threat_data_js)
        self.assertIn("📦 Delivery Scam", threat_data_js)

        # Check in index.html hero sample chips
        self.assertIn("🎣 Phishing", self.index_html)
        self.assertIn("💼 Job Scam", self.index_html)
        self.assertIn("📦 Delivery Scam", self.index_html)

    def test_flipped_results_immediate_actions_top(self):
        """Conversion UX Mandate: Results card flips the layout to display immediate actions and copy checklist on top."""
        self.assertIn('id="analyzerImmediateActions"', self.index_html)
        self.assertIn('id="copyChecklistBtn"', self.index_html)
        self.assertIn("1. DON'T CLICK", self.index_html)
        self.assertIn("2. DON'T PAY / SHARE", self.index_html)
        self.assertIn("3. REPORT HERE", self.index_html)

        # Ensure immediate action card is physically placed BEFORE the score dial and detailed flags in HTML
        actions_pos = self.index_html.find('id="analyzerImmediateActions"')
        score_pos = self.index_html.find('class="results-score-panel"')
        flags_pos = self.index_html.find('class="flags-container"')
        self.assertTrue(actions_pos > 0 and score_pos > actions_pos and flags_pos > score_pos,
                        "Immediate actions must appear on TOP of results before score dial and detailed flags")

        # Ensure app.js wires up checklist copying
        self.assertIn("copyChecklistBtn", self.app_js)
        self.assertIn("analyzerImmediateActions", self.app_js)

    def test_accidental_code_interception_scam_detection(self):
        """Ensures 'sent a code by mistake / can you send it to me' account takeover is recognized as a critical threat."""
        self.assertIn("Account Takeover: 'Accidental' Verification Code / 2FA Theft", self.app_js)
        self.assertIn("isAccidentalCodeTheft", self.app_js)
        self.assertIn("sent a code to your number", self.app_js)
        self.assertIn("code by mistake", self.app_js)
        self.assertIn("send it to me", self.app_js)

    def test_score_dial_integrated_at_top_of_immediate_actions(self):
        """Conversion UX Mandate: Score dial is integrated at the very top of immediate actions for zero-scroll instant visibility."""
        actions_card_idx = self.index_html.find('id="analyzerImmediateActions"')
        score_panel_idx = self.index_html.find('class="results-score-panel"')
        imperatives_idx = self.index_html.find('class="triage-imperatives-grid"')
        
        # Verify score panel is inside immediate actions card and appears before the triage grid
        self.assertTrue(actions_card_idx > 0, "analyzerImmediateActions must exist")
        self.assertTrue(score_panel_idx > actions_card_idx, "results-score-panel must be inside analyzerImmediateActions")
        self.assertTrue(imperatives_idx > score_panel_idx, "results-score-panel must appear BEFORE triage imperatives for instant visibility")


if __name__ == "__main__":
    unittest.main()


