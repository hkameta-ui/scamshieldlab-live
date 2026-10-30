#!/usr/bin/env python3
"""
ScamShield Lab - Fundamental Design & Pre-Merge Readiness Verification Gate
===========================================================================
This test script performs mandatory fundamental quality, navigation, AdSense
compliance, and asset synchronization audits across all published site pages.
Must PASS 100% with zero errors before any branch is approved for merge into main.

Usage:
    python tests/design_readiness_check.py
"""

import os
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PUBLISHED_HTML_FILES = [
    "index.html",
    "how-we-score.html",
    "family-safe-word.html",
    "incident-response.html",
    "quiz.html",
    "guide-phishing.html",
    "guide-job-scams.html",
    "guide-delivery-scams.html",
    "guide-voice-cloning.html",
    "guide-pig-butchering.html",
    "guide-digital-arrest.html",
    "guide-deepfake-video.html",
    "guide-sim-swapping.html",
    "guide-remote-access-scams.html",
    "guide-crypto-drainer-scams.html",
    "guide-bank-impersonation.html",
    "guide-student-loan-scams.html",
    "about.html",
    "editorial-policy.html",
    "contact.html",
    "privacy.html",
    "terms.html"
]

class LinkAndIdExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.images = []
        self.title = ""
        self.meta_desc = ""
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if "id" in attr_dict:
            self.ids.add(attr_dict["id"])
        if tag == "a" and "href" in attr_dict:
            self.links.append(attr_dict["href"])
        if tag == "img":
            self.images.append(attr_dict)
        if tag == "title":
            self.in_title = True
        if tag == "meta" and attr_dict.get("name") == "description":
            self.meta_desc = attr_dict.get("content", "")

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data

def run_readiness_checks():
    print("=" * 72)
    print("  SCAMSHIELD LAB - FUNDAMENTAL DESIGN & PRE-MERGE READINESS GATE")
    print("=" * 72)
    failures = []

    # Parse all HTML files
    parsed_files = {}
    raw_contents = {}
    for filename in PUBLISHED_HTML_FILES:
        filepath = os.path.join(WORKSPACE_ROOT, filename)
        if not os.path.isfile(filepath):
            failures.append(f"[CRITICAL] Missing published HTML file: {filename}")
            continue
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        raw_contents[filename] = content
        extractor = LinkAndIdExtractor()
        extractor.feed(content)
        parsed_files[filename] = extractor

    print(f"[*] Parsed {len(parsed_files)}/{len(PUBLISHED_HTML_FILES)} production HTML files.\n")

    # ---------------------------------------------------------
    # CHECK 1: ZERO DUMMY/MOCK AD PLACEHOLDERS & DEVELOPER NOTES
    # ---------------------------------------------------------
    print("[1/9] Auditing for Dummy Ad Placeholders & Developer Notes...")
    banned_patterns = [
        (r"\[\s*(?:High-CPC|High-CTR|High-Paying|Responsive|Contextual)[^\]]*\]", "Bracketed Ad Placeholder"),
        (r"Contextual targeting: Antivirus", "Developer Mock Ad Note"),
        (r"High dwell time position above footer", "Developer Mock Ad Note"),
        (r"Lorem ipsum", "Lorem Ipsum Template Text"),
        (r"\bTODO\b", "Unfinished TODO Note"),
        (r"\bFIXME\b", "Unfinished FIXME Note")
    ]
    placeholder_issues = []
    for filename, content in raw_contents.items():
        lines = content.splitlines()
        for idx, line in enumerate(lines, 1):
            for pattern, label in banned_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    # Exclude form input placeholder attributes
                    if "placeholder=" in line or "placeholder =" in line:
                        continue
                    placeholder_issues.append(f"  {filename}:{idx} [{label}]: {line.strip()[:80]}")

    if placeholder_issues:
        failures.append("Found dummy ad placeholders or developer draft text:\n" + "\n".join(placeholder_issues))
        print(f"  FAILED: {len(placeholder_issues)} placeholder instances detected.")
    else:
        print("  PASSED: Zero dummy ad placeholders or developer mock text found.")

    # ---------------------------------------------------------
    # CHECK 2: ZERO BROKEN INTERNAL OR ANCHOR LINKS
    # ---------------------------------------------------------
    print("\n[2/9] Auditing Internal & Anchor Navigation Links...")
    broken_links = []
    for filename, extractor in parsed_files.items():
        for href in extractor.links:
            # Skip external and standard protocols
            if not href or href.startswith(("http://", "https://", "mailto:", "tel:", "javascript:", "data:")):
                continue
            
            # Pure internal anchor: #section
            if href.startswith("#"):
                target_id = href[1:]
                if target_id and target_id not in extractor.ids:
                    broken_links.append(f"  {filename} -> href='{href}' (ID #{target_id} does not exist on page)")
            else:
                parts = href.split("#")
                target_file = parts[0]
                target_id = parts[1] if len(parts) > 1 else None

                if target_file and target_file not in parsed_files:
                    # Allow links like index.html or root
                    if target_file not in ["index.html", ""] and not os.path.exists(os.path.join(WORKSPACE_ROOT, target_file)):
                        broken_links.append(f"  {filename} -> href='{href}' (Target file '{target_file}' not found)")
                elif target_id:
                    tf = target_file if target_file else filename
                    if tf in parsed_files and target_id not in parsed_files[tf].ids:
                        broken_links.append(f"  {filename} -> href='{href}' (ID #{target_id} not in '{tf}')")

    if broken_links:
        failures.append("Found broken internal or anchor navigation links:\n" + "\n".join(broken_links))
        print(f"  FAILED: {len(broken_links)} broken navigation links detected.")
    else:
        print("  PASSED: 100% of internal and anchor links resolve successfully.")

    # ---------------------------------------------------------
    # CHECK 3: XML SITEMAP FULL 100% COVERAGE & SYNCHRONIZATION
    # ---------------------------------------------------------
    print("\n[3/9] Verifying XML Sitemap Coverage...")
    sitemap_path = os.path.join(WORKSPACE_ROOT, "sitemap.xml")
    if not os.path.isfile(sitemap_path):
        failures.append("Missing sitemap.xml in root directory")
        print("  FAILED: sitemap.xml not found.")
    else:
        try:
            tree = ET.parse(sitemap_path)
            root = tree.getroot()
            ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}
            sitemap_urls = [loc.text.strip() for loc in root.findall(".//ns:loc", ns)]
            
            missing_from_sitemap = []
            for hf in PUBLISHED_HTML_FILES:
                matched = any(hf in u or (hf == "index.html" and u.endswith("scamshieldlab.com/")) for u in sitemap_urls)
                if not matched:
                    missing_from_sitemap.append(hf)
            
            if missing_from_sitemap:
                failures.append(f"Pages missing from sitemap.xml: {missing_from_sitemap}")
                print(f"  FAILED: {len(missing_from_sitemap)} published pages missing from sitemap.xml.")
            else:
                print(f"  PASSED: All {len(PUBLISHED_HTML_FILES)} published pages declared in sitemap.xml.")
        except Exception as e:
            failures.append(f"Failed to parse sitemap.xml: {e}")
            print(f"  FAILED: XML parsing error in sitemap.xml: {e}")

    # ---------------------------------------------------------
    # CHECK 4: SYNCHRONIZED CACHE-BUSTING ASSET QUERY STRINGS (RULE 1)
    # ---------------------------------------------------------
    print("\n[4/9] Verifying Asset Version Synchronization (Rule 1)...")
    versions_found = set()
    file_version_map = {}
    for filename, content in raw_contents.items():
        v_matches = re.findall(r"(?:styles\.css|app\.js|config\.js|threat-data\.js)\?v=([a-zA-Z0-9_\-]+)", content)
        if v_matches:
            file_version_map[filename] = sorted(set(v_matches))
            versions_found.update(v_matches)
        else:
            failures.append(f"{filename} links unversioned scripts or stylesheets (Rule 1 violation)")

    if len(versions_found) > 1:
        failures.append(f"Asset cache-busting tokens are desynchronized: {versions_found}. Map: {file_version_map}")
        print(f"  FAILED: Multiple conflicting asset cache versions detected: {versions_found}")
    elif len(versions_found) == 0:
        failures.append("No asset cache-busting tokens detected in HTML files")
        print("  FAILED: Zero version tokens found.")
    else:
        sync_version = list(versions_found)[0]
        print(f"  PASSED: Synchronized cache version active across all files: '?v={sync_version}'")

    # ---------------------------------------------------------
    # CHECK 5: GOOGLE ADSENSE CODE SNIPPET, META TAG & ADS.TXT INTEGRITY
    # ---------------------------------------------------------
    print("\n[5/9] Verifying Google AdSense Snippets, Meta Tags, robots.txt & ads.txt...")
    ads_txt_path = os.path.join(WORKSPACE_ROOT, "ads.txt")
    if not os.path.isfile(ads_txt_path):
        failures.append("Missing ads.txt file")
        print("  FAILED: ads.txt missing.")
    else:
        with open(ads_txt_path, "r", encoding="utf-8") as f:
            ads_txt_content = f.read()
        if "pub-7565560894775775" not in ads_txt_content:
            failures.append("ads.txt does not contain publisher ID pub-7565560894775775")
            print("  FAILED: ads.txt publisher ID mismatch.")
        else:
            print("  PASSED: ads.txt valid with authorized publisher pub-7565560894775775.")

    # robots.txt validation
    robots_path = os.path.join(WORKSPACE_ROOT, "robots.txt")
    if not os.path.isfile(robots_path):
        failures.append("Missing robots.txt file")
        print("  FAILED: robots.txt missing.")
    else:
        with open(robots_path, "r", encoding="utf-8") as f:
            robots_content = f.read()
        if "Mediapartners-Google" not in robots_content or "Google-Adwords-Bot" not in robots_content:
            failures.append("robots.txt missing explicit AdSense bot crawler directives")
            print("  FAILED: robots.txt missing AdSense crawler directives.")
        else:
            print("  PASSED: robots.txt declares explicit AdSense & AdWords bot crawl permissions.")

    # _headers validation
    headers_path = os.path.join(WORKSPACE_ROOT, "_headers")
    if not os.path.isfile(headers_path):
        failures.append("Missing _headers file")
        print("  FAILED: _headers missing.")
    else:
        with open(headers_path, "r", encoding="utf-8") as f:
            headers_content = f.read()
        if "/ads.txt" not in headers_content or "text/plain" not in headers_content:
            failures.append("_headers missing explicit Content-Type for /ads.txt")
            print("  FAILED: _headers missing /ads.txt MIME configuration.")
        else:
            print("  PASSED: _headers declares explicit Content-Type & CORS for /ads.txt.")

    missing_adsense_tag = []
    missing_meta_tag = []
    for filename, content in raw_contents.items():
        if "pagead2.googlesyndication.com" not in content or "ca-pub-7565560894775775" not in content:
            missing_adsense_tag.append(filename)
        if '<meta name="google-adsense-account" content="ca-pub-7565560894775775">' not in content:
            missing_meta_tag.append(filename)

    if missing_adsense_tag:
        failures.append(f"Pages missing Google AdSense head script: {missing_adsense_tag}")
        print(f"  FAILED: AdSense tag missing in {missing_adsense_tag}.")
    else:
        print(f"  PASSED: Google AdSense verification script present in all {len(raw_contents)} pages.")

    if missing_meta_tag:
        failures.append(f"Pages missing Google AdSense account meta tag: {missing_meta_tag}")
        print(f"  FAILED: AdSense account meta tag missing in {missing_meta_tag}.")
    else:
        print(f"  PASSED: Google AdSense account meta tag present in all {len(raw_contents)} pages.")

    # ---------------------------------------------------------
    # CHECK 6: LEGAL NON-AFFILIATION DISCLAIMER (PREVENTS IMPERSONATION)
    # ---------------------------------------------------------
    print("\n[6/9] Verifying Legal Non-Affiliation Disclaimers...")
    missing_disclaimer = []
    for filename, content in raw_contents.items():
        if "scamshield.gov.sg" not in content or "not affiliated with" not in content.lower():
            missing_disclaimer.append(filename)

    if missing_disclaimer:
        failures.append(f"Pages missing explicit non-affiliation disclaimer with official Singapore app: {missing_disclaimer}")
        print(f"  FAILED: Missing legal disclaimer in {missing_disclaimer}.")
    else:
        print(f"  PASSED: All {len(raw_contents)} pages display explicit non-affiliation disclaimer.")

    # ---------------------------------------------------------
    # CHECK 7: SEO METADATA & CANONICAL INTEGRITY
    # ---------------------------------------------------------
    print("\n[7/9] Verifying SEO Metadata, Titles, Descriptions & Canonicals...")
    seo_issues = []
    titles = set()
    for filename, extractor in parsed_files.items():
        if not extractor.title.strip():
            seo_issues.append(f"{filename}: Missing <title>")
        elif extractor.title.strip() in titles:
            seo_issues.append(f"{filename}: Duplicate <title> '{extractor.title.strip()}'")
        else:
            titles.add(extractor.title.strip())

        if not extractor.meta_desc or len(extractor.meta_desc) < 40:
            seo_issues.append(f"{filename}: Missing or too short meta description ({len(extractor.meta_desc)} chars)")

        if 'rel="canonical"' not in raw_contents[filename]:
            seo_issues.append(f"{filename}: Missing <link rel=\"canonical\">")

    if seo_issues:
        failures.append("SEO metadata validation errors:\n  " + "\n  ".join(seo_issues))
        print(f"  FAILED: {len(seo_issues)} SEO metadata issues detected.")
    else:
        print(f"  PASSED: All {len(PUBLISHED_HTML_FILES)} pages have unique titles, descriptions, and canonicals.")

    # ---------------------------------------------------------
    # CHECK 8: ACCESSIBILITY SKIP LINK & IMAGE DIMENSIONS (WCAG & RULE 1)
    # ---------------------------------------------------------
    print("\n[8/9] Verifying WCAG Skip Links & Image Layout Dimensions...")
    a11y_issues = []
    for filename, extractor in parsed_files.items():
        if 'class="skip-link"' not in raw_contents[filename]:
            a11y_issues.append(f"{filename}: Missing accessibility skip-link")
        if "main-content" not in extractor.ids:
            a11y_issues.append(f"{filename}: Missing <main id=\"main-content\"> anchor target")

        for img in extractor.images:
            if "width" not in img or "height" not in img:
                src = img.get("src", "unknown")
                a11y_issues.append(f"{filename}: Image '{src}' missing width/height attributes (CLS risk)")

    if a11y_issues:
        failures.append("Accessibility & Image layout errors:\n  " + "\n  ".join(a11y_issues))
        print(f"  FAILED: {len(a11y_issues)} accessibility/image issues detected.")
    else:
        print("  PASSED: 100% of pages pass accessibility skip links and image dimension constraints.")

    # ---------------------------------------------------------
    # CHECK 9: CORE WEB VITALS MANDATE (IMAGE BUDGETS, LCP PRELOAD, NON-BLOCKING FONTS & CLS LOCK)
    # ---------------------------------------------------------
    print("\n[9/9] Auditing Core Web Vitals (Image Budgets, LCP Preloads, Async Fonts & CLS Lock)...")
    cwv_issues = []

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

    # 1. Image Size Budgets
    assets_dir = os.path.join(WORKSPACE_ROOT, "assets", "images")
    if os.path.isdir(assets_dir):
        for img_name in os.listdir(assets_dir):
            if img_name.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                img_path = os.path.join(assets_dir, img_name)
                size_kb = os.path.getsize(img_path) / 1024.0
                if img_name in ("logo.jpg", "logo.webp") and size_kb > 15:
                    cwv_issues.append(f"{img_name} exceeds 15 KB budget ({size_kb:.1f} KB) - must be optimized for 36x36 display")
                elif img_name.endswith(".webp") and size_kb > 70:
                    cwv_issues.append(f"{img_name} exceeds 70 KB LCP WebP budget ({size_kb:.1f} KB)")
                elif img_name in ("hero.jpg", "hero.webp") and size_kb > 100:
                    cwv_issues.append(f"{img_name} exceeds 100 KB budget ({size_kb:.1f} KB) - risks LCP regression")
                elif size_kb > 120:
                    cwv_issues.append(f"{img_name} exceeds 120 KB image budget ({size_kb:.1f} KB)")

    # 2. LCP Image Preload & fetchpriority across all 16 featured pages
    for filename, expected_img in FEATURED_IMAGE_MAP.items():
        content = raw_contents.get(filename, "")
        clean_img = expected_img.split('?')[0]
        preload_pattern = r"""<link[^>]+rel=["']preload["'][^>]+href=["'][^"']*""" + re.escape(clean_img) + r"""[^"']*["'][^>]*>"""
        preload_match = re.search(preload_pattern, content)
        if not preload_match:
            cwv_issues.append(f"{filename}: Missing LCP <link rel='preload' as='image' href='{clean_img}'>")
        else:
            tag = preload_match.group(0)
            if 'fetchpriority="high"' not in tag:
                cwv_issues.append(f"{filename}: Preload for {clean_img} missing fetchpriority='high'")

        # Audit primary img tag
        img_pattern = r"""<img[^>]+class=["'](?:hero-img|article-featured-img|quiz-featured-img|ir-featured-img)["'][^>]*>"""
        img_match = re.search(img_pattern, content)
        if not img_match:
            cwv_issues.append(f"{filename}: Missing primary hero/featured <img> tag")
        else:
            itag = img_match.group(0)
            if 'fetchpriority="high"' not in itag:
                cwv_issues.append(f"{filename}: Primary <img> missing fetchpriority='high'")
            if 'loading="lazy"' in itag:
                cwv_issues.append(f"{filename}: Primary above-the-fold <img> has loading='lazy' (LCP regression risk)")

    # 3. Asynchronous Non-Blocking Google Fonts Loading across all 22 pages
    for filename, content in raw_contents.items():
        if 'rel="preload" as="style" href="https://fonts.googleapis.com' not in content:
            cwv_issues.append(f"{filename}: Google Fonts stylesheet must be preloaded as style (rel='preload' as='style')")
        if 'media="print" onload="this.media=\'all\'"' not in content:
            cwv_issues.append(f"{filename}: Google Fonts stylesheet must load asynchronously with media='print' onload")
        if '<noscript>' not in content or 'https://fonts.googleapis.com' not in content:
            cwv_issues.append(f"{filename}: Missing <noscript> fallback for Google Fonts")
        if 'display=swap' not in content:
            cwv_issues.append(f"{filename}: Google Font URL must include display=swap")

    # 4. Non-Blocking Head Scripts
    for filename, content in raw_contents.items():
        head = content.split("</head>")[0]
        scripts = re.findall(r"""<script[^>]*src=["'][^"']+["'][^>]*>""", head)
        for s in scripts:
            if 'defer' not in s and 'async' not in s:
                cwv_issues.append(f"{filename}: Blocking synchronous <script> detected in <head>: {s}")

    # 5. CLS Zero-Shift Ticker Lock in styles.css
    css_path = os.path.join(WORKSPACE_ROOT, "css", "styles.css")
    if os.path.isfile(css_path):
        with open(css_path, "r", encoding="utf-8") as f:
            css_content = f.read()
        if ".site-ticker" not in css_content or "height: 38px" not in css_content:
            cwv_issues.append("css/styles.css .site-ticker must declare explicit height (height: 38px) to prevent CLS")

    if cwv_issues:
        failures.append("Core Web Vitals validation errors:\n  " + "\n  ".join(cwv_issues))
        print(f"  FAILED: {len(cwv_issues)} Core Web Vitals issues detected.")
    else:
        print("  PASSED: All image budgets, LCP preloads, async fonts, and CLS height-locks verified 100%.")

    # ---------------------------------------------------------
        # FINAL VERDICT
    # ---------------------------------------------------------
    print("\n" + "=" * 72)
    if failures:
        print("  VERDICT: [FAIL] - FUNDAMENTAL READINESS CHECKS FAILED")
        print("=" * 72)
        print("\nSummary of Failures:")
        for idx, f in enumerate(failures, 1):
            print(f"\n{idx}. {f}")
        print("\n[!] Please resolve all failures above before proposing merge into main.")
        return False
    else:
        print("  VERDICT: [PASS] - ALL FUNDAMENTAL READINESS CHECKS PASSED 100%")
        print("=" * 72)
        print("  Ready for pre-merge review and AdSense approval audit.")
        return True

if __name__ == "__main__":
    success = run_readiness_checks()
    sys.exit(0 if success else 1)
