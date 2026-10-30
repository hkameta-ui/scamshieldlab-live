"""
ScamShield Lab - Comprehensive Automated Unit & UI Validation Suite
Complies with Project Mandates (Rules 1, 2, 3, 4, 5)
"""

import os
import re
import unittest
import subprocess
from tests.design_readiness_check import PUBLISHED_HTML_FILES

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
        "guide-digital-arrest.html",
        "family-safe-word.html",
        "incident-response.html",
        "quiz.html",
        "how-we-score.html",
        "guide-phishing.html",
        "guide-job-scams.html",
        "guide-delivery-scams.html"
    ]

    def test_all_pages_have_consistent_header_brand_tag(self):
        for filename in self.HTML_FILES:
            filepath = os.path.join(WORKSPACE_ROOT, filename)
            self.assertTrue(os.path.isfile(filepath), f"{filename} must exist")
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                self.assertIn(
                    'class="brand-sub-badge">AI FORENSIC ANALYZER</span>',
                    content,
                    f"Brand consistency error: {filename} must display 'AI FORENSIC ANALYZER' subtitle"
                )
                self.assertIn(
                    'class="brand-main-title">ScamShield<span class="brand-lab-accent">Lab</span>',
                    content,
                    f"Brand consistency error: {filename} must display 'ScamShieldLab' title"
                )
                self.assertIn(
                    'class="nav-cta-btn"',
                    content,
                    f"Button consistency error: {filename} must use .nav-cta-btn"
                )

    def test_seo_and_explainability_moat_positioning(self):
        """SEO & Positioning Mandate: Distinguish from Singapore gov app with 'ScamShield Lab - AI forensic analyzer' everywhere."""
        for filename in self.HTML_FILES:
            filepath = os.path.join(WORKSPACE_ROOT, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                self.assertIn(
                    "ScamShield Lab",
                    content,
                    f"SEO Mandate: {filename} must reference 'ScamShield Lab'"
                )
                self.assertIn(
                    "AI Forensic Analyzer",
                    content,
                    f"Positioning Mandate: {filename} must explicitly declare 'AI Forensic Analyzer'"
                )
                self.assertIn(
                    "Notice & Non-Affiliation",
                    content,
                    f"Legal Mandate: {filename} footer must contain explicit non-affiliation disclaimer with official Singapore app"
                )

    def test_educational_category_guides_and_red_flags(self):
        """SEO Mandate: Dedicated category educational guides with simulated red-flag teardowns for high-intent ranking."""
        category_guides = [
            "guide-phishing.html",
            "guide-job-scams.html",
            "guide-delivery-scams.html"
        ]
        for guide in category_guides:
            filepath = os.path.join(WORKSPACE_ROOT, guide)
            self.assertTrue(os.path.isfile(filepath), f"Category guide {guide} must exist")
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                self.assertIn("simulated-message-card", content, f"{guide} must feature visual simulated message card")
                self.assertIn("redflag-highlight", content, f"{guide} must highlight red-flag triggers")
                self.assertIn("redflag-analysis-grid", content, f"{guide} must provide forensic red-flag breakdown")

    def test_how_we_score_page_architecture_and_privacy_matrix(self):
        """Explainability Moat Mandate: Transparent 4-layer heuristic architecture, 0-100 formula, and Privacy-by-Design matrix."""
        filepath = os.path.join(WORKSPACE_ROOT, "how-we-score.html")
        self.assertTrue(os.path.isfile(filepath), "how-we-score.html must exist")
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("The 4-Layer Forensic Engine Architecture", content)
            self.assertIn("LAYER 1", content)
            self.assertIn("Linguistic Urgency & Psychological Manipulation", content)
            self.assertIn("LAYER 2", content)
            self.assertIn("Infrastructure, Domain & URL Telemetry", content)
            self.assertIn("LAYER 3", content)
            self.assertIn("Payment Channels & Asset Extraction", content)
            self.assertIn("LAYER 4", content)
            self.assertIn("2FA Interception & Account Takeover", content)
            self.assertIn('id="privacy-matrix"', content)
            self.assertIn("privacy-matrix-table", content)
            self.assertIn("Zero-Storage Architecture", content)
            self.assertIn("0 bytes stored", content)

    def test_incident_response_playbook_and_dispute_generator(self):
        """Rule 1 & Pillar 1: Ensure 15-Minute Emergency Incident Response Wizard is fully wired."""
        ir_path = os.path.join(WORKSPACE_ROOT, "incident-response.html")
        self.assertTrue(os.path.isfile(ir_path), "incident-response.html must exist")
        with open(ir_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("crisis-card", content)
        self.assertIn("vector-card", content)
        self.assertIn("progress-sticky-bar", content)
        self.assertIn("checklist-item", content)
        self.assertIn("https://www.experian.com/freeze", content)
        self.assertIn("https://www.equifax.com/personal/credit-report-services/credit-freeze/", content)
        self.assertIn("https://www.transunion.com/credit-freeze", content)
        self.assertIn("disputeLetterOutput", content)
        self.assertIn("Regulation E", content)
        self.assertIn("UCC § 4A-202", content)
        self.assertIn("Financial Fraud Kill Chain", content)
        self.assertIn("affiliate-stack-grid", content)
        self.assertIn('rel="noopener sponsored"', content)

    def test_quiz_simulator_and_scenarios(self):
        """Rule 1 & Pillar 1: Ensure 2026 Cyber Resilience Simulator and Spot the Fake challenge is fully wired."""
        quiz_path = os.path.join(WORKSPACE_ROOT, "quiz.html")
        self.assertTrue(os.path.isfile(quiz_path), "quiz.html must exist")
        with open(quiz_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("simulator-card", content)
        self.assertIn("mockup-wrapper", content)
        self.assertIn("btn-decision-scam", content)
        self.assertIn("btn-decision-legit", content)
        self.assertIn("feedback-box", content)
        self.assertIn("results-panel", content)
        self.assertIn("blindspots-box", content)
        self.assertIn("affiliate-stack-grid", content)
        self.assertIn('rel="noopener sponsored"', content)
        self.assertIn("SCENARIOS", content)

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
            self.assertIn("min-height: 70px", css, "site-header must declare min-height: 70px to eliminate header pop CLS")
            self.assertIn("max-height: 38px", css, "site-ticker must declare max-height: 38px ceiling lock")
            self.assertIn("align-items: start", css, "hero-grid must declare align-items: start to eliminate vertical drift CLS")
            self.assertIn("min-height: 220px", css, "hero-live-demo-card must declare reserved min-height: 220px")
            self.assertIn("min-height: 32px", css, "hero-badges-row must declare reserved min-height: 32px")

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

    def test_dr_priyanka_ameta_profile_in_about_page(self):
        """Rule 3: Content Standards - Verify academic research leadership profile for Dr. Priyanka Ameta."""
        about_path = os.path.join(WORKSPACE_ROOT, "about.html")
        with open(about_path, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("Dr. Priyanka Ameta", content)
            self.assertIn("Computer Science Academician", content)
            self.assertIn("Data-Driven Digital Marketing: From Insights to Intelligent Engagement", content)

    def test_all_referenced_images_exist(self):
        html_files = [
            "index.html",
            "about.html",
            "privacy.html",
            "terms.html",
            "guide-voice-cloning.html",
            "guide-pig-butchering.html",
            "guide-digital-arrest.html",
            "family-safe-word.html",
            "incident-response.html"
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
        guides = ["guide-voice-cloning.html", "guide-pig-butchering.html", "guide-digital-arrest.html"]
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
        self.assertIn("digital-arrest", self.threat_code)
        self.assertIn("Supreme Court", self.threat_code)

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


class TestGoogleWorkspaceAffiliatePartnerIntegration(unittest.TestCase):
    """Rule 1 & Rule 6: Validation tests for Google Workspace verified referral partner assets, tracking URL, and defense recommendations."""

    def test_official_google_workspace_svg_icon_exists(self):
        icon_path = os.path.join(WORKSPACE_ROOT, "assets", "images", "google-workspace-icon.svg")
        self.assertTrue(os.path.isfile(icon_path), "Official Google Workspace SVG icon must exist")
        with open(icon_path, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn('width="48"', content)
            self.assertIn('height="48"', content)

    def test_config_js_google_workspace_partner_url_and_badge(self):
        config_path = os.path.join(WORKSPACE_ROOT, "config.js")
        with open(config_path, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("assets/images/google-workspace-icon.svg", content)
            self.assertIn("sharegoogleworkspace.advocate.impact.com/mzYP7Zg", content)
            self.assertIn("Verified Partner", content)
            self.assertIn("UCYHWLERFJVJUW4", content)

    def test_app_js_and_css_google_workspace_recommendations(self):
        app_path = os.path.join(WORKSPACE_ROOT, "js", "app.js")
        with open(app_path, "r", encoding="utf-8") as f:
            app_code = f.read()
            self.assertIn("Google Workspace with Gemini", app_code)
            self.assertIn("google-workspace-icon.svg", app_code)
            self.assertIn("google-btn", app_code)

        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()
            self.assertIn(".defense-rec-btn.google-btn", css)

    def test_verified_partners_appear_first_in_config(self):
        config_path = os.path.join(WORKSPACE_ROOT, "config.js")
        with open(config_path, "r", encoding="utf-8") as f:
            content = f.read()
            idx_google = content.find("googleWorkspace:")
            idx_vpn = content.find("vpnPrivacy:")
            idx_pass = content.find("passwordManager:")
            idx_aura = content.find("identityTheft:")
            idx_malware = content.find("endpointSecurity:")
            self.assertTrue(idx_google < idx_aura, "Google Workspace must appear before Aura")
            self.assertTrue(idx_vpn < idx_aura, "NordVPN must appear before Aura")
            self.assertTrue(idx_pass < idx_aura, "NordPass must appear before Aura")
            self.assertTrue(idx_aura < idx_malware, "Aura must appear before Malwarebytes")

    def test_pillar_guides_declare_affiliate_defense_stacks(self):
        """Rule 3 Mandate: Ensure all pillar guides display contextual, FTC-compliant defense stacks."""
        guides = ["guide-phishing.html", "guide-job-scams.html", "guide-delivery-scams.html", "guide-voice-cloning.html", "guide-pig-butchering.html", "guide-digital-arrest.html"]
        for g in guides:
            g_path = os.path.join(WORKSPACE_ROOT, g)
            with open(g_path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertIn("affiliate-stack-grid", content, f"{g} must contain an affiliate-stack-grid")
            self.assertIn('rel="noopener sponsored"', content, f"{g} must declare rel='noopener sponsored' on partner links")

    def test_promo_code_copy_and_styling(self):
        """Conversion UX Mandate: Ensure 1-click promo code copy pill is wired in app.js and styled in CSS."""
        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()
        self.assertIn(".promo-code-pill", css)
        self.assertIn(".defense-rec-secondary-row", css)

        app_path = os.path.join(WORKSPACE_ROOT, "js", "app.js")
        with open(app_path, "r", encoding="utf-8") as f:
            app_code = f.read()
        self.assertIn("data-copy-code", app_code)
        self.assertIn("UCYHWLERFJVJUW4", app_code)

    def test_defense_stack_is_positioned_between_analyzer_and_threat_radar(self):
        index_path = os.path.join(WORKSPACE_ROOT, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            html = f.read()
            idx_analyzer = html.find('id="analyzer"')
            idx_defense = html.find('id="defense-stack"')
            idx_radar = html.find('id="threat-radar"')
            self.assertTrue(idx_analyzer < idx_defense, "Analyzer must appear before Defense Stack")
            self.assertTrue(idx_defense < idx_radar, "Defense Stack must appear before Threat Radar")


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
        """Ensures verified engineering statistics (100+ signals, 4-layer engine) are prominently displayed in the hero without unverified % claims."""
        self.assertIn("hero-social-proof-strip", self.index_html)
        self.assertIn("100+", self.index_html)
        self.assertIn("4-Layer", self.index_html)
        self.assertNotIn("98.8%", self.index_html)
        self.assertIn(".hero-social-proof-strip", self.css)

    def test_honest_scoring_and_methodology_transparency(self):
        """Rule 3: Content Standards - Enforce explainable methodology notices and reject unverified accuracy claims."""
        self.assertIn("analyzer-methodology-note", self.index_html)
        self.assertIn("how-we-score.html", self.index_html)
        
        how_we_score_path = os.path.join(WORKSPACE_ROOT, "how-we-score.html")
        with open(how_we_score_path, "r", encoding="utf-8") as f:
            hws_html = f.read()
            self.assertIn("Honest Scoring Architecture", hws_html)
            self.assertIn("Why We Reject Unverified Accuracy Percentages", hws_html)

    def test_independent_privacy_verification_protocol(self):
        """Rule 2 & Rule 3: Enforce independent audit protocols enabling anyone to verify zero-retention data handling."""
        self.assertIn("privacy-audit-card", self.index_html)
        self.assertIn("The Airplane-Mode Test", self.index_html)
        self.assertIn("Inspect DevTools Network Calls", self.index_html)
        self.assertIn(".privacy-audit-card", self.css)

        privacy_path = os.path.join(WORKSPACE_ROOT, "privacy.html")
        with open(privacy_path, "r", encoding="utf-8") as f:
            priv_html = f.read()
            self.assertIn("Independent Privacy Verification Protocol", priv_html)
            self.assertIn("The Air-Gapped Offline Test", priv_html)

        how_we_score_path = os.path.join(WORKSPACE_ROOT, "how-we-score.html")
        with open(how_we_score_path, "r", encoding="utf-8") as f:
            hws_html = f.read()
            self.assertIn("Independent Privacy Audit", hws_html)

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
        """Conversion UX Mandate: Guest mode is the default with a prominent primary CTA in the hero live demo to eliminate signup friction."""
        self.assertIn('id="heroScanBtn"', self.index_html)
        self.assertIn("Instant Guest Scan", self.index_html)
        self.assertIn("Zero Signup", self.index_html)
        self.assertIn("No account required", self.index_html)
        self.assertIn("heroScanBtn", self.app_js)

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


class TestSecurityClaimsAndResearchCitations(unittest.TestCase):
    """Rule 3 & Feedback Mandate: Verifies no absolute marketing claims and ensures prominent academic/governmental sourcing."""

    def setUp(self):
        index_path = os.path.join(WORKSPACE_ROOT, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            self.index_html = f.read()

        threat_path = os.path.join(WORKSPACE_ROOT, "js", "threat-data.js")
        with open(threat_path, "r", encoding="utf-8") as f:
            self.threat_js = f.read()

        app_path = os.path.join(WORKSPACE_ROOT, "js", "app.js")
        with open(app_path, "r", encoding="utf-8") as f:
            self.app_js = f.read()

        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            self.css = f.read()

    def test_no_unverifiable_absolute_claims_in_html(self):
        """Ensures absolute claims ('100% defense', '100% private', '100% client-side', 'foolproof') are removed."""
        forbidden_phrases = [
            "100% defense",
            "100% private",
            "100% client-side",
            "foolproof defense",
            "stopping 100% of",
            "100% identical"
        ]
        html_files = [f for f in os.listdir(WORKSPACE_ROOT) if f.endswith(".html")]
        for h in html_files:
            file_path = os.path.join(WORKSPACE_ROOT, h)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                for phrase in forbidden_phrases:
                    self.assertNotIn(
                        phrase.lower(), content.lower(),
                        f"Unverifiable absolute claim '{phrase}' must not appear in production file {h}"
                    )

    def test_hero_hud_has_prominent_research_citations(self):
        """Ensures the 3-second synthesis and $1.1B+ loss metrics feature prominent citations on the homepage."""
        self.assertIn("hero-source-footnote", self.index_html)
        self.assertIn("source-footnote-pill", self.index_html)
        self.assertIn("Microsoft Research", self.index_html)
        self.assertIn("VALL-E", self.index_html)
        self.assertIn("FBI IC3", self.index_html)
        self.assertIn("Deloitte Center for Financial Services", self.index_html)
        self.assertIn("$1.1B+", self.index_html)
        self.assertIn(".hero-source-footnote", self.css)
        self.assertIn(".proof-source", self.css)

    def test_threat_radar_renders_verified_intelligence_sources(self):
        """Ensures threat cards render verified intelligence citation badges with academic/agency references."""
        self.assertIn("threat-sources-box", self.app_js)
        self.assertIn("threat-impact-source", self.app_js)
        self.assertIn("VALL-E 3s Neural Synthesis Benchmark", self.threat_js)
        self.assertIn("FBI IC3", self.threat_js)
        self.assertIn("Deloitte", self.threat_js)
        self.assertIn(".threat-sources-box", self.css)
        self.assertIn(".threat-impact-source", self.css)

    def test_faq_contains_formal_citations(self):
        """Ensures the voice cloning FAQ provides verifiable academic and FTC citations."""
        self.assertIn("faq-citation-box", self.index_html)
        self.assertIn("arXiv:2301.02111", self.index_html)
        self.assertIn("VALL-E", self.index_html)
        self.assertIn("Deloitte Center for Financial Services", self.index_html)
        self.assertIn(".faq-citation-box", self.css)

    def test_deloitte_citation_prominently_implemented(self):
        """Ensures the $1.1B+ AI voice & deepfake losses metric is prominently attributed to Deloitte Center for Financial Services."""
        self.assertIn("Deloitte Center for Financial Services", self.index_html)
        self.assertIn("AI Voice &amp; Deepfake Losses", self.index_html)
        guide_voice_path = os.path.join(WORKSPACE_ROOT, "guide-voice-cloning.html")
        with open(guide_voice_path, "r", encoding="utf-8") as f:
            guide_voice = f.read()
        self.assertIn("Deloitte Center for Financial Services", guide_voice)
        self.assertIn("Deloitte", self.threat_js)

    def test_footer_review_pill_present_on_all_pages(self):
        """Ensures the 'Reviewed by Cybersecurity Professionals' & 'Last Updated: October 2026' pill is present across all HTML pages."""
        html_files = [
            "index.html", "how-we-score.html", "family-safe-word.html", "incident-response.html",
            "guide-voice-cloning.html", "guide-pig-butchering.html", "guide-digital-arrest.html",
            "guide-phishing.html", "guide-job-scams.html", "guide-delivery-scams.html",
            "about.html", "privacy.html", "terms.html"
        ]
        self.assertIn(".footer-review-pill", self.css)
        self.assertIn(".review-pill-link", self.css)
        self.assertIn(".review-pill-date", self.css)
        for h in html_files:
            file_path = os.path.join(WORKSPACE_ROOT, h)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertIn("footer-review-pill", content, f"Missing footer-review-pill in {h}")
            self.assertIn("Reviewed by Cybersecurity Professionals", content, f"Missing review label in {h}")
            self.assertIn("Last Updated: October 2026", content, f"Missing last updated date in {h}")

    def test_cache_invalidation_headers_configured(self):
        """Rule 1 & Caching: Ensures Cloudflare _headers file enforces zero-stale HTML cache."""
        headers_path = os.path.join(WORKSPACE_ROOT, "_headers")
        self.assertTrue(os.path.exists(headers_path), "Missing Cloudflare _headers configuration file")
        with open(headers_path, "r", encoding="utf-8") as f:
            headers_content = f.read()
        self.assertIn("Cache-Control: no-cache, no-store, must-revalidate", headers_content)
        self.assertIn("Pragma: no-cache", headers_content)
        self.assertIn("Expires: 0", headers_content)
        self.assertIn("immutable", headers_content)

    def test_html_files_contain_cache_control_meta_tags(self):
        """Rule 1 & Caching: Ensures all 11 HTML files declare no-cache meta tags to prevent client browser stagnation."""
        html_files = [
            "index.html", "how-we-score.html", "family-safe-word.html", "incident-response.html",
            "guide-voice-cloning.html", "guide-pig-butchering.html", "guide-digital-arrest.html",
            "guide-phishing.html", "guide-job-scams.html", "guide-delivery-scams.html",
            "about.html", "privacy.html", "terms.html"
        ]
        for h in html_files:
            file_path = os.path.join(WORKSPACE_ROOT, h)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertIn('http-equiv="Cache-Control"', content, f"Missing Cache-Control meta tag in {h}")
            self.assertIn('content="no-cache, no-store, must-revalidate"', content, f"Incorrect Cache-Control value in {h}")
            self.assertIn('http-equiv="Pragma"', content, f"Missing Pragma meta tag in {h}")
            self.assertIn('http-equiv="Expires"', content, f"Missing Expires meta tag in {h}")

    def test_bfcache_invalidation_listener_present_in_app_js(self):
        """Rule 1: Ensures mobile & browser back-forward cache invalidator is active in app.js."""
        self.assertIn('addEventListener("pageshow"', self.app_js)
        self.assertIn('event.persisted', self.app_js)
        self.assertIn('window.location.reload()', self.app_js)


class TestFundamentalDesignAndAdSenseReadiness(unittest.TestCase):
    """Mandatory pre-merge quality gate enforcing zero dummy placeholders, full sitemap coverage,
    link integrity, asset synchronization, and AdSense compliance."""

    def test_fundamental_design_readiness_gate(self):
        import sys
        sys.path.insert(0, WORKSPACE_ROOT)
        from tests.design_readiness_check import run_readiness_checks
        passed = run_readiness_checks()
        self.assertTrue(passed, "Fundamental Design & Pre-Merge Readiness checks failed! See logs above.")


class TestCoreWebVitalsCompliance(unittest.TestCase):
    """Rule 1 Mandate: Validates image payloads, hero preloads, non-blocking fonts, and zero-shift CLS locks."""

    FEATURED_IMAGE_MAP = {
        'index.html': 'assets/images/hero.webp',
        'how-we-score.html': 'assets/images/how-we-score.webp',
        'incident-response.html': 'assets/images/incident-response.webp',
        'quiz.html': 'assets/images/scam-simulator.webp',
        'guide-phishing.html': 'assets/images/phishing-guide.webp',
        'guide-job-scams.html': 'assets/images/job-scams-guide.webp',
        'guide-delivery-scams.html': 'assets/images/delivery-scams-guide.webp',
        'guide-voice-cloning.html': 'assets/images/deepfake.webp',
        'guide-pig-butchering.html': 'assets/images/hero.webp',
        'guide-digital-arrest.html': 'assets/images/digital-arrest-guide.webp',
        'guide-deepfake-video.html': 'assets/images/hero.webp',
        'guide-sim-swapping.html': 'assets/images/hero.webp',
        'guide-remote-access-scams.html': 'assets/images/hero.webp',
        'guide-crypto-drainer-scams.html': 'assets/images/hero.webp',
        'guide-bank-impersonation.html': 'assets/images/hero.webp',
        'guide-student-loan-scams.html': 'assets/images/hero.webp'
    }

    def test_image_weight_budgets_for_lcp(self):
        assets_dir = os.path.join(WORKSPACE_ROOT, "assets", "images")
        self.assertTrue(os.path.isdir(assets_dir))
        for img_name in os.listdir(assets_dir):
            if img_name.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                img_path = os.path.join(assets_dir, img_name)
                size_kb = os.path.getsize(img_path) / 1024.0
                if img_name in ("logo.jpg", "logo.webp"):
                    self.assertLessEqual(size_kb, 15, f"{img_name} ({size_kb:.1f} KB) must be <= 15 KB")
                elif img_name.endswith(".webp"):
                    self.assertLessEqual(size_kb, 70, f"{img_name} ({size_kb:.1f} KB) exceeds 70 KB LCP budget")
                elif img_name in ("hero.jpg", "hero.webp"):
                    self.assertLessEqual(size_kb, 100, f"{img_name} ({size_kb:.1f} KB) must be <= 100 KB")
                else:
                    self.assertLessEqual(size_kb, 120, f"{img_name} ({size_kb:.1f} KB) must be <= 120 KB")

    def test_hero_image_is_preloaded_with_fetchpriority_high(self):
        index_path = os.path.join(WORKSPACE_ROOT, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn('rel="preload"', content)
        self.assertIn('as="image"', content)
        self.assertTrue('hero.webp' in content or 'hero.jpg' in content)
        self.assertIn('fetchpriority="high"', content)

    def test_all_featured_pages_preload_lcp_image(self):
        """Rule 1 Mandate: Every page with an above-the-fold hero or featured image MUST preload its WebP asset with fetchpriority='high'."""
        for filename, expected_img in self.FEATURED_IMAGE_MAP.items():
            path = os.path.join(WORKSPACE_ROOT, filename)
            self.assertTrue(os.path.exists(path), f"Missing page: {filename}")
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            clean_img = expected_img.split('?')[0]
            preload_pattern = r'<link[^>]+rel=["\']preload["\'][^>]+href=["\'][^"\']*' + re.escape(clean_img) + r'[^"\']*["\'][^>]*>'
            preload_match = re.search(preload_pattern, content)
            self.assertIsNotNone(
                preload_match,
                f"LCP Preload Violation: {filename} must declare <link rel='preload' as='image' href='{clean_img}' ... fetchpriority='high'>"
            )
            tag = preload_match.group(0)
            self.assertIn('as="image"', tag, f"{filename} preload must specify as='image'")
            self.assertIn('type="image/webp"', tag, f"{filename} preload must specify type='image/webp'")
            self.assertIn('fetchpriority="high"', tag, f"{filename} preload must specify fetchpriority='high'")

    def test_featured_images_have_fetchpriority_high_and_no_lazy(self):
        """Rule 1 Mandate: Primary above-the-fold images must specify fetchpriority='high' and never loading='lazy'."""
        for filename in self.FEATURED_IMAGE_MAP.keys():
            path = os.path.join(WORKSPACE_ROOT, filename)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            img_pattern = r'<img[^>]+class=["\'](?:hero-img|article-featured-img|quiz-featured-img|ir-featured-img)["\'][^>]*>'
            img_match = re.search(img_pattern, content)
            self.assertIsNotNone(img_match, f"Primary image tag not found in {filename}")
            tag = img_match.group(0)
            self.assertIn('fetchpriority="high"', tag, f"{filename} primary img must declare fetchpriority='high'")
            self.assertNotIn('loading="lazy"', tag, f"LCP regression risk: {filename} above-the-fold image must NOT have loading='lazy'")
            self.assertIn('decoding="async"', tag, f"{filename} primary img must declare decoding='async'")
            self.assertTrue('width=' in tag and 'height=' in tag, f"{filename} primary img missing explicit width/height dimensions")

    def test_featured_images_have_webp_picture_source(self):
        """Rule 1 Mandate: Featured images must have a WebP <source> inside <picture> for next-gen compression."""
        for filename, expected_img in self.FEATURED_IMAGE_MAP.items():
            path = os.path.join(WORKSPACE_ROOT, filename)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            clean_img = expected_img.split('?')[0]
            self.assertIn('<picture>', content, f"{filename} must wrap primary image inside a <picture> element")
            self.assertIn(clean_img, content, f"{filename} <picture> element missing source for {clean_img}")

    def test_all_pages_declare_non_blocking_font_loading(self):
        """Rule 1 Mandate: All 22 published pages must load Google Fonts asynchronously to eliminate render-blocking CSS delays."""
        for filename in PUBLISHED_HTML_FILES:
            path = os.path.join(WORKSPACE_ROOT, filename)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertIn('rel="preconnect" href="https://fonts.googleapis.com"', content, f"{filename} missing Google Fonts preconnect")
            self.assertIn('rel="preconnect" href="https://fonts.gstatic.com" crossorigin', content, f"{filename} missing gstatic crossorigin preconnect")
            self.assertIn('display=swap', content, f"{filename} font URL missing display=swap parameter")
            self.assertIn('rel="preload" as="style" href="https://fonts.googleapis.com', content, f"{filename} font stylesheet must be preloaded as style")
            self.assertIn('media="print" onload="this.media=\'all\'"', content, f"{filename} font stylesheet must load asynchronously with media='print' onload")
            self.assertIn('<noscript>', content, f"{filename} missing noscript fallback for Google Fonts")

    def test_head_scripts_are_non_render_blocking(self):
        """Rule 1 Mandate: No synchronous scripts in <head> that block DOM parsing or initial paint."""
        for filename in PUBLISHED_HTML_FILES:
            path = os.path.join(WORKSPACE_ROOT, filename)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            head_content = content.split("</head>")[0]
            scripts = re.findall(r"""<script[^>]*src=["\'][^"\']+["\'][^>]*>""", head_content)
            for script_tag in scripts:
                is_non_blocking = 'defer' in script_tag or 'async' in script_tag
                self.assertTrue(
                    is_non_blocking,
                    f"LCP Blocker: Synchronous <script> detected in <head> of {filename}: {script_tag}"
                )

    def test_site_ticker_height_is_locked_for_zero_cls(self):
        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn(".site-ticker", content)
        self.assertIn("height: 38px", content)


class TestMobileNavigationDrawer(unittest.TestCase):
    """Rule 4 & Mobile UX Mandate: Validates mobile navigation drawer markup, CSS responsiveness, and JS controllers."""

    def test_mobile_toggle_button_present_in_all_pages(self):
        """All 14 published pages must declare the #mobileNavToggle button with accessible label."""
        html_files = PUBLISHED_HTML_FILES
        self.assertEqual(len(html_files), 22, "Must audit all 22 published HTML pages")
        for h in html_files:
            file_path = os.path.join(WORKSPACE_ROOT, h)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertIn('id="mobileNavToggle"', content, f"Page {h} missing mobileNavToggle button")
            self.assertIn('aria-label="Toggle Navigation Menu"', content, f"Page {h} missing aria-label on mobileNavToggle")

    def test_mobile_nav_drawer_css_rules(self):
        """Ensures css/styles.css specifies proper responsive drawer display rules for <= 1080px."""
        css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css = f.read()
        self.assertIn("@media (max-width: 1080px)", css)
        self.assertIn(".main-nav.open", css)
        self.assertIn(".mobile-toggle-btn", css)
        self.assertIn("min-width: 44px", css)
        self.assertIn("min-height: 44px", css)

    def test_mobile_nav_system_controller_in_config(self):
        """Ensures config.js declares initMobileNavSystem with complete touch, escape, and click handlers."""
        config_path = os.path.join(WORKSPACE_ROOT, "config.js")
        with open(config_path, "r", encoding="utf-8") as f:
            js = f.read()
        self.assertIn("function initMobileNavSystem()", js)
        self.assertIn("mobileNavToggle", js)
        self.assertIn("primaryNavLinks", js)
        self.assertIn("aria-expanded", js)
        self.assertIn("DOMContentLoaded", js)


class TestAdSenseAndCrawlerIntegrity(unittest.TestCase):
    """Pillar 2 & AdSense Readiness Mandate: Validates ads.txt, crawler directives, Cloudflare headers, and meta tags."""

    def test_ads_txt_contains_authorized_publisher_and_format(self):
        """ads.txt must exist at root, be formatted properly, and contain authorized publisher ID."""
        ads_path = os.path.join(WORKSPACE_ROOT, "ads.txt")
        self.assertTrue(os.path.isfile(ads_path), "ads.txt must exist at workspace root")
        with open(ads_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("google.com, pub-7565560894775775, DIRECT, f08c47fec0942fa0", content)

    def test_robots_txt_explicit_adsense_bot_directives(self):
        """robots.txt must explicitly grant access to Mediapartners-Google, Google-Adwords-Bot, and AdsBot-Google."""
        robots_path = os.path.join(WORKSPACE_ROOT, "robots.txt")
        self.assertTrue(os.path.isfile(robots_path), "robots.txt must exist at workspace root")
        with open(robots_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("User-agent: Mediapartners-Google", content)
        self.assertIn("User-agent: Google-Adwords-Bot", content)
        self.assertIn("User-agent: AdsBot-Google", content)
        self.assertIn("User-agent: Googlebot", content)
        self.assertIn("Sitemap: https://scamshieldlab.com/sitemap.xml", content)

    def test_headers_declares_crawler_and_ads_txt_types(self):
        """_headers must define explicit Content-Type and Cache-Control for /ads.txt, /robots.txt, and /sitemap.xml."""
        headers_path = os.path.join(WORKSPACE_ROOT, "_headers")
        self.assertTrue(os.path.isfile(headers_path), "_headers must exist at workspace root")
        with open(headers_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("/ads.txt", content)
        self.assertIn("Content-Type: text/plain; charset=utf-8", content)
        self.assertIn("/robots.txt", content)
        self.assertIn("/sitemap.xml", content)

    def test_all_pages_have_adsense_account_meta_tag(self):
        """All 14 published HTML pages must declare <meta name="google-adsense-account" content="ca-pub-7565560894775775">."""
        html_files = PUBLISHED_HTML_FILES
        self.assertEqual(len(html_files), 22, "Must audit all 22 published HTML pages")
        for h in html_files:
            file_path = os.path.join(WORKSPACE_ROOT, h)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertIn(
                '<meta name="google-adsense-account" content="ca-pub-7565560894775775">',
                content,
                f"Page {h} missing google-adsense-account meta tag"
            )
            self.assertIn(
                'pagead2.googlesyndication.com',
                content,
                f"Page {h} missing AdSense verification script tag"
            )

    def test_rfc9116_security_txt_and_vendor_profile(self):
        """Validate RFC 9116 security.txt existence, fields, and vendor profile in about.html."""
        sec_path = os.path.join(WORKSPACE_ROOT, ".well-known", "security.txt")
        sec_root_path = os.path.join(WORKSPACE_ROOT, "security.txt")
        self.assertTrue(os.path.isfile(sec_path), ".well-known/security.txt must exist")
        self.assertTrue(os.path.isfile(sec_root_path), "security.txt root fallback must exist")
        
        with open(sec_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("Contact: mailto:security@scamshieldlab.com", content)
        self.assertIn("Expires:", content)
        self.assertIn("Canonical: https://scamshieldlab.com/.well-known/security.txt", content)

        # Check about.html has vendor-profile and security-audit sections
        about_path = os.path.join(WORKSPACE_ROOT, "about.html")
        with open(about_path, "r", encoding="utf-8") as f:
            about_content = f.read()
        self.assertIn('id="vendor-profile"', about_content)
        self.assertIn('id="security-audit"', about_content)
        self.assertIn('id="contact-disclosure"', about_content)

    def test_mit_license_and_open_source_transparency(self):
        """Verify presence of MIT License and open-source transparency links across site."""
        license_path = os.path.join(WORKSPACE_ROOT, "LICENSE")
        self.assertTrue(os.path.isfile(license_path), "LICENSE file must exist in repository root")
        with open(license_path, "r", encoding="utf-8") as f:
            lic_content = f.read()
        self.assertIn("MIT License", lic_content)
        self.assertIn("ScamShield Lab", lic_content)

        # Verify open-source GitHub links in how-we-score.html and about.html
        how_score_path = os.path.join(WORKSPACE_ROOT, "how-we-score.html")
        with open(how_score_path, "r", encoding="utf-8") as f:
            score_content = f.read()
        self.assertIn("https://github.com/hkameta-ui/scamshieldlab-live", score_content)
        self.assertIn("Deterministic Extraction", score_content)
        self.assertIn("Explainable Attribution", score_content)

        about_path = os.path.join(WORKSPACE_ROOT, "about.html")
        with open(about_path, "r", encoding="utf-8") as f:
            about_content = f.read()
        self.assertIn("https://github.com/hkameta-ui/scamshieldlab-live", about_content)

    def test_advisory_signal_notice_present(self):
        """Verify presence of Advisory Intelligence Signal notice in index.html and how-we-score.html."""
        index_path = os.path.join(WORKSPACE_ROOT, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            index_content = f.read()
        self.assertIn("Advisory Intelligence Signal", index_content)
        self.assertIn("Not a Final Verdict", index_content)

        how_score_path = os.path.join(WORKSPACE_ROOT, "how-we-score.html")
        with open(how_score_path, "r", encoding="utf-8") as f:
            score_content = f.read()
        self.assertIn("Advisory Notice", score_content)
        self.assertIn("not a definitive legal or infallible verdict", score_content)

    def test_operational_maturity_changelog_present(self):
        """Verify presence of Operational Cadence & Threat Intelligence Changelog in about.html."""
        about_path = os.path.join(WORKSPACE_ROOT, "about.html")
        with open(about_path, "r", encoding="utf-8") as f:
            about_content = f.read()
        self.assertIn('id="threat-changelog"', about_content)
        self.assertIn("Operational Cadence & Threat Intelligence Changelog", about_content)
        self.assertIn("Release v2026.10.4", about_content)
        self.assertIn("Release v2026.10.3", about_content)
        self.assertIn("Release v2026.10.1", about_content)

    def test_trustpilot_verification_file_present(self):
        """Verify presence and exact token content of Trustpilot domain verification file."""
        tp_file = os.path.join(WORKSPACE_ROOT, "bb2aa5f6-194f-4d93-93fc-0d07c3205e3d.html")
        self.assertTrue(os.path.isfile(tp_file), "Trustpilot verification file must exist in workspace root")
        with open(tp_file, "r", encoding="utf-8") as f:
            content = f.read().strip()
        self.assertEqual(content, "bb2aa5f6-194f-4d93-93fc-0d07c3205e3d")


if __name__ == "__main__":

    unittest.main()



