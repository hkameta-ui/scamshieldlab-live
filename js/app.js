/**
 * ScamShield AI - Interactive Application Logic
 * Heuristic Scam Analyzer, Threat Radar, Resilience Quiz & Incident Playbook
 * 
 * Complies with Project Mandates:
 * - Rule 1: High Performance (Optimized event listeners, zero DOM thrashing)
 * - Rule 2: Security (Strict HTML sanitization & escapeHtml against XSS, zero external transmission)
 * - Rule 3: Non-Offensive Content (Family-Safe filtering & respectful educational tone)
 * - Rule 4: Universal Accessibility (WCAG 2.1 AA ARIA live regions, keyboard navigation)
 */

document.addEventListener("DOMContentLoaded", () => {
  initTicker();
  initAnalyzer();
  initThreatRadar();
  initQuiz();
  initIncidentPlaybook();
  initAffiliateCards();
  initMobileNav();
  initFaqAccordion();
});

/**
 * XSS Defense: Strict HTML Entity Sanitizer
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   1. Live Threat Ticker
   ========================================================================== */
function initTicker() {
  const tickerItems = [
    "🚨 CRITICAL ALERT: Real-time AI voice cloning scam rings surge 310% targeting family emergencies.",
    "⚠️ HIGH RISK: Deepfake video conference CFO impersonation tricks enterprise finance teams ($25M loss).",
    "🛡️ DEFENSE TIP: Establish an offline family secret safe word today — bypass synthetic audio deception.",
    "⚠️ ALERT: Malicious sponsored ads found for 'Sora Video Desktop' dropping LummaC2 info-stealers.",
    "💡 ADVICE: Freeze credit on Experian, Equifax, and TransUnion to block synthetic AI credit applications."
  ];

  const tickerContainer = document.getElementById("liveThreatTicker");
  if (tickerContainer) {
    tickerContainer.innerHTML = tickerItems.map(item => `<span class="ticker-pill">${escapeHtml(item)}</span>`).join(" &bull; ");
  }
}

/* ==========================================================================
   2. Interactive AI Scam & Phishing Analyzer Engine
   ========================================================================== */
function initAnalyzer() {
  const inputEl = document.getElementById("scamTextInput");
  const scanBtn = document.getElementById("analyzeBtn");
  const clearBtn = document.getElementById("clearTextBtn");
  const presetsContainer = document.getElementById("presetsContainer");
  const resultsContainer = document.getElementById("analyzerResults");
  const scanningIndicator = document.getElementById("scanningIndicator");

  if (!inputEl || !scanBtn) return;

  // Render presets buttons
  if (presetsContainer && window.ANALYZER_PRESETS) {
    presetsContainer.innerHTML = window.ANALYZER_PRESETS.map((p, idx) => `
      <button type="button" class="preset-chip" data-idx="${idx}" aria-label="Load preset: ${escapeHtml(p.name)}">
        <span class="chip-dot"></span> ${escapeHtml(p.name)}
      </button>
    `).join("");

    presetsContainer.querySelectorAll(".preset-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-idx");
        const preset = window.ANALYZER_PRESETS[idx];
        if (preset) {
          inputEl.value = preset.sample;
          presetsContainer.querySelectorAll(".preset-chip").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          runAnalysis(preset.sample);
        }
      });
    });
  }

  scanBtn.addEventListener("click", () => {
    const text = inputEl.value.trim();
    if (!text) {
      alert("Please paste or type a suspicious message, email, or URL to analyze.");
      inputEl.focus();
      return;
    }
    runAnalysis(text);
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      inputEl.value = "";
      if (resultsContainer) resultsContainer.style.display = "none";
      if (presetsContainer) {
        presetsContainer.querySelectorAll(".preset-chip").forEach(b => b.classList.remove("active"));
      }
      inputEl.focus();
    });
  }

  function runAnalysis(text) {
    if (scanningIndicator) {
      scanningIndicator.style.display = "flex";
      scanningIndicator.setAttribute("aria-busy", "true");
    }
    if (resultsContainer) {
      resultsContainer.style.display = "none";
    }

    // High performance microtask deferral
    setTimeout(() => {
      const evaluation = evaluateScamRisk(text);
      renderResults(evaluation);
      if (scanningIndicator) {
        scanningIndicator.style.display = "none";
        scanningIndicator.setAttribute("aria-busy", "false");
      }
      if (resultsContainer) {
        resultsContainer.style.display = "block";
        resultsContainer.setAttribute("role", "region");
        resultsContainer.setAttribute("aria-live", "polite");
        resultsContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 450);
  }

  function evaluateScamRisk(text) {
    const flags = [];
    let score = 0;
    const lower = text.toLowerCase();
    const cleanNoSpace = lower.replace(/[\s\-_]+/g, "");

    // 0. Non-Offensive Content & Ethics Safeguard (Rule 3)
    const abusiveKeywords = [
      "fuck", "shit", "bitch", "asshole", "cunt", "nigger", "faggot", "slut", "whore"
    ];
    const matchedAbuse = abusiveKeywords.filter(k => lower.includes(k));
    if (matchedAbuse.length > 0) {
      flags.push({
        severity: "FAMILY-SAFE FILTER",
        title: "Content Standards Notice",
        description: "ScamShield Lab operates under strict Family-Safe and non-offensive standards. Vulgar or abusive terms are excluded from our security heuristic models."
      });
    }

    // 1. Family Impersonation & Grandparent Emergency Scams (AI Voice Emergency)
    const familyKeywords = [
      "grandma", "grandpa", "grandmother", "grandfather", "grandson", "granddaughter", 
      "grandchild", "mom", "dad", "mother", "father", "son", "daughter", "nephew", 
      "niece", "cousin", "aunt", "uncle", "it's your grandson", "it's your son", 
      "it's your daughter", "your grandson", "your granddaughter", "your child"
    ];
    const distressKeywords = [
      "car accident", "accident", "hospital", "jail", "arrested", "arrest", 
      "police station", "bail", "surgery", "wreck", "hurt badly", "kidnapped", 
      "held hostage", "stranded", "emergency", "in trouble", "attorney", "lawyer"
    ];

    const matchedFamily = familyKeywords.filter(k => lower.includes(k));
    const matchedDistress = distressKeywords.filter(k => lower.includes(k));

    let isFamilyEmergency = false;
    if (matchedFamily.length > 0 && matchedDistress.length > 0) {
      isFamilyEmergency = true;
      score += 45;
      flags.push({
        severity: "CRITICAL",
        title: "Family Impersonation / Grandparent Emergency Scam",
        description: `High-risk indicator: Claims to be a distressed relative ("${matchedFamily.slice(0, 2).map(escapeHtml).join('", "')}") facing an acute crisis ("${matchedDistress.slice(0, 2).map(escapeHtml).join('", "')}"). Scammers routinely simulate or use 3-second AI voice clones to deceive grandparents and parents into urgent panic transfers.`
      });
    } else if (matchedFamily.length > 0 && (lower.includes("my phone broke") || lower.includes("temporary number") || lower.includes("lost my phone"))) {
      isFamilyEmergency = true;
      score += 40;
      flags.push({
        severity: "CRITICAL",
        title: "Hello Mom / Broken Phone Impersonation",
        description: `Claims to be a family member messaging from an unknown or temporary number ("phone broke"). This is the standard opening for the WhatsApp 'Hello Mom' impersonation scam.`
      });
    }

    // 2. Road Toll & Transit Agency Smishing (SunPass, E-ZPass, FasTrak, TxTag, etc. - FBI IC3 Warning)
    const tollKeywords = [
      "sunpass", "e-zpass", "ezpass", "fastrak", "txtag", "i-pass", "tollway", "turnpike",
      "toll enforcement", "toll authority", "toll collection", "toll violation", "toll charge",
      "toll fee", "toll invoice", "unpaid toll", "overdue toll", "toll services", "toll debt"
    ];
    const tollActionPhrases = [
      "unpaid toll", "avoid additional fees", "avoid late fees", "avoid penalty", "pay now to avoid",
      "additional fees", "late fee", "settle your toll", "toll balance", "pay now", "action required"
    ];

    const matchedTolls = tollKeywords.filter(k => lower.includes(k));
    const matchedTollActions = tollActionPhrases.filter(k => lower.includes(k));

    let isTollSmishing = false;
    if (matchedTolls.length > 0 || (lower.includes("toll") && matchedTollActions.length > 0)) {
      isTollSmishing = true;
      score += 55;
      flags.push({
        severity: "CRITICAL",
        title: "FBI-Alerted Smishing Scam: Road Toll Impersonation",
        description: `High-risk indicator: Simulates state road toll collection services ("${matchedTolls.length > 0 ? matchedTolls.slice(0, 2).map(escapeHtml).join('", "') : 'unpaid toll'}"). The FBI IC3 warns that state toll agencies (SunPass, E-ZPass, FasTrak) never send unsolicited SMS text messages demanding urgent payment with clickable links to avoid fees.`
      });
    }

    // 3. High-Urgency & Panic Tactics
    const urgencyKeywords = [
      "immediately", "urgent", "urgently", "emergency", "within 24 hours", "within 1 hour", 
      "police", "arrest", "jail", "bail", "hospital", "car accident", "don't hang up", 
      "hurry", "asap", "right now", "strictly confidential", "before 5:00 pm", 
      "breach penalty", "final warning", "action required", "pay now", "avoid additional fees",
      "avoid late fees", "unpaid", "avoid penalty", "immediate action", "overdue"
    ];
    const matchedUrgency = urgencyKeywords.filter(k => lower.includes(k));
    if (matchedUrgency.length > 0) {
      score += Math.min(30, matchedUrgency.length * 10);
      if (!isFamilyEmergency || matchedUrgency.length > 2) {
        flags.push({
          severity: "HIGH",
          title: "High-Pressure Psychological Urgency",
          description: `Detected crisis and panic triggers: "${matchedUrgency.slice(0, 3).map(escapeHtml).join('", "')}". Adversaries manufacture artificial urgency to prevent you from conferring with advisors.`
        });
      }
    }

    // 4. Financial Demands, P2P Apps, and Small-Fee Smishing Bait
    const cryptoRegex = /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b|\b0x[a-fA-F0-9]{40}\b/i;
    const paymentKeywords = [
      "bitcoin", "crypto", "wire transfer", "escrow", "zelle", "gift card", 
      "cash app", "cashapp", "venmo", "paypal", "apple cash", "western union", 
      "moneygram", "wallet address", "usdt", "deposit", "steam card", "apple card", 
      "itunes", "vanilla visa", "chime", "greendot", "bank transfer"
    ];
    const moneyAmountRegex = /\$\s*\d+([,\.]\d+)?|\b\d+\s*(dollars|bucks|usd|eur|gbp|usdt)\b|\b(send|need|wire|transfer|pay|lend)\s+(\$|\d+|money|cash|funds)\b/i;

    const hasCryptoAddress = cryptoRegex.test(text);
    const hasMoneyAmount = moneyAmountRegex.test(text);
    const matchedPayments = paymentKeywords.filter(k => {
      const cleanK = k.replace(/\s+/g, "");
      return lower.includes(k) || cleanNoSpace.includes(cleanK);
    });

    let hasFinancialDemand = false;
    if (hasCryptoAddress || matchedPayments.length > 0 || (hasMoneyAmount && (matchedUrgency.length > 0 || matchedFamily.length > 0 || isTollSmishing || lower.includes("fee") || lower.includes("toll") || lower.includes("pay")))) {
      hasFinancialDemand = true;
      score += 40;
      let paymentDesc = "";
      if (hasCryptoAddress) {
        paymentDesc = "Contains an explicit public cryptocurrency wallet address. Blockchain transactions are mathematically irreversible.";
      } else if (matchedPayments.length > 0) {
        paymentDesc = `Demands funds via non-reversible consumer payment apps or gift cards: "${matchedPayments.slice(0, 3).map(escapeHtml).join('", "')}".`;
      } else if (isTollSmishing) {
        paymentDesc = "Demands urgent toll or fee payment under threat of escalating penalties. Scammers intentionally use small dollar amounts ($1 to $15) to lower user skepticism and harvest credit card numbers.";
      } else {
        paymentDesc = "Demands urgent funds or fee payments under escalating penalties.";
      }
      flags.push({
        severity: "CRITICAL",
        title: "Irreversible Payment / Fee Escalation Demand",
        description: paymentDesc
      });
    }

    // 5. Authority & Institution Impersonation (Bank, USPS, IRS, Geek Squad)
    const authorityKeywords = [
      "bank of america", "chase bank", "wells fargo", "citibank", "usps", "fedex", 
      "ups delivery", "geek squad", "paypal support", "amazon security", "internal revenue service", 
      "irs", "social security administration", "border patrol", "customs"
    ];
    const matchedAuthority = authorityKeywords.filter(k => lower.includes(k));
    const securityTriggerWords = ["account suspended", "unauthorized charge", "card blocked", "fraud alert", "suspicious activity", "package on hold", "redelivery fee"];
    const matchedSecurityTriggers = securityTriggerWords.filter(k => lower.includes(k));

    if (matchedAuthority.length > 0 || matchedSecurityTriggers.length > 0) {
      score += 35;
      flags.push({
        severity: "HIGH",
        title: "Brand / Authority Security Impersonation",
        description: `Simulates official corporate or government fraud alerts ("${[...matchedAuthority, ...matchedSecurityTriggers].slice(0, 3).map(escapeHtml).join('", "')}"). Scammers use brand trust to induce panic clicks.`
      });
    }

    // 6. Investment Fraud & Pig Butchering Patterns
    const investmentKeywords = [
      "guaranteed return", "guaranteed yield", "arbitrage", "trading signals", 
      "passive income", "18% weekly", "insider tips", "crypto liquidity",
      "wrong number", "polite gentleman", "assistant gave me", "kind soul", "chat on whatsapp"
    ];
    const matchedInvestment = investmentKeywords.filter(k => lower.includes(k));
    if (matchedInvestment.length > 0) {
      score += 35;
      flags.push({
        severity: "CRITICAL",
        title: "Pig Butchering / Investment Confidence Trap",
        description: `Contains classic romance/crypto confidence hooks ("${matchedInvestment.slice(0, 3).map(escapeHtml).join('", "')}"). Legitimate financial platforms never guarantee high weekly investment returns.`
      });
    }

    // 7. Secrecy & Out-of-Band Disruption
    const secrecyKeywords = [
      "don't tell mom", "don't tell dad", "keep this secret", "keep this between us", 
      "non-disclosure", "cannot take calls", "my phone broke", "police officer letting me", 
      "in-flight", "strictly confidential"
    ];
    const matchedSecrecy = secrecyKeywords.filter(k => lower.includes(k));
    if (matchedSecrecy.length > 0) {
      score += 25;
      flags.push({
        severity: "HIGH",
        title: "Isolation & Secrecy Demands",
        description: `Sender explicitly demands secrecy or claims inability to speak on the phone ("${matchedSecrecy.slice(0, 2).map(escapeHtml).join('", "')}"). This tactic prevents victims from verifying the story with friends or family.`
      });
    }

    // 8. Deceptive URLs & Phishing Links
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urls = text.match(urlRegex) || [];
    const suspiciousTlds = [".top", ".xyz", ".vip", ".cc", ".icu", ".work", ".cfd", ".buzz", ".live", ".fit", ".rest"];
    let suspiciousUrlFound = false;

    urls.forEach(u => {
      if (suspiciousTlds.some(tld => u.toLowerCase().includes(tld)) || u.includes("defi-") || u.includes("-trading") || u.includes("verify-") || u.includes("secure-")) {
        suspiciousUrlFound = true;
      }
    });

    if (suspiciousUrlFound) {
      score += 40;
      flags.push({
        severity: "CRITICAL",
        title: "Deceptive or Newly Registered Phishing Domain",
        description: "The link points to an unverified or throwaway domain commonly registered for credential theft and fraudulent crypto dashboards."
      });
    } else if (urls.length > 0) {
      score += 15;
      flags.push({
        severity: "MODERATE",
        title: "Embedded Hyperlink Present",
        description: "Contains clickable links. Never log into accounts through links received via unsolicited messages. Navigate directly to the official app or website instead."
      });
    }

    // 9. Compound Attack Synergy Boost
    if (isFamilyEmergency && hasFinancialDemand) {
      score += 25; // Guarantee top-tier critical alert for family emergency money requests
    }
    if (isTollSmishing && (hasFinancialDemand || urls.length > 0 || matchedUrgency.length > 0)) {
      score += 20; // Guarantee top-tier critical alert for active toll smishing lures
    }

    // Suspicion Principle: If the user tests a message that triggered any red flags or security triggers,
    // do not show a complacent "Low Risk" (<50) score. Any message with verified flags must be elevated.
    if (flags.length > 0) {
      if (flags.some(f => f.severity === "CRITICAL")) {
        score = Math.max(score, 75);
      } else {
        score = Math.max(score, 52);
      }
    }

    // Score Capping & Range
    score = Math.min(98, Math.max(5, score));

    // Determine category rating
    let riskLevel = "LOW RISK";
    let riskColor = "var(--color-success)";
    let summaryText = "No prominent scam patterns detected. The message appears to follow standard correspondence formatting.";

    if (score >= 60) {
      riskLevel = "CRITICAL THREAT";
      riskColor = "var(--color-danger)";
      if (isFamilyEmergency) {
        summaryText = "DANGER: High-probability Family Impersonation / Grandparent Scam detected. Criminals weaponize emotional distress (accidents, hospital bills) to trick relatives into sending untraceable funds via CashApp, Zelle, or gift cards. DO NOT SEND MONEY. Call your relative on their known personal phone number to verify.";
      } else if (isTollSmishing) {
        summaryText = "DANGER: High-probability Road Toll Smishing Scam detected (SunPass / E-ZPass impersonation). Official toll agencies NEVER demand payment via SMS text messages to avoid late fees. DO NOT click links or enter payment card credentials.";
      } else if (hasCryptoAddress || matchedInvestment.length > 0) {
        summaryText = "DANGER: High-probability Financial / Crypto Investment Scam detected. Never deposit funds or share private keys based on unsolicited communications.";
      } else {
        summaryText = "DANGER: This text displays multiple signature indicators of high-threat cyber fraud. DO NOT send funds, verify credentials, or click embedded links.";
      }
    } else if (score >= 30) {
      riskLevel = "MODERATE SUSPICION";
      riskColor = "var(--color-warning)";
      summaryText = "CAUTION: This communication contains suspicious urgency, financial phrasing, or unfamiliar links. Verify the sender's identity through an independent, pre-established channel before taking any action.";
    }

    return { score, riskLevel, riskColor, flags, summaryText };
  }

  function renderResults(data) {
    const dialVal = document.getElementById("analyzerScoreValue");
    const dialLevel = document.getElementById("analyzerRiskLevel");
    const dialSummary = document.getElementById("analyzerRiskSummary");
    const flagsList = document.getElementById("analyzerFlagsList");
    const meterFill = document.getElementById("analyzerMeterFill");
    const advisoryBox = document.getElementById("analyzerUrlAdvisory");

    if (dialVal) dialVal.textContent = `${data.score}/100`;
    if (dialLevel) {
      dialLevel.textContent = data.riskLevel;
      dialLevel.style.color = data.riskColor;
    }
    if (dialSummary) dialSummary.textContent = data.summaryText;

    if (meterFill) {
      meterFill.style.width = `${data.score}%`;
      meterFill.style.backgroundColor = data.riskColor;
      meterFill.setAttribute("aria-valuenow", data.score);
      meterFill.setAttribute("aria-valuemin", "0");
      meterFill.setAttribute("aria-valuemax", "100");
    }

    if (flagsList) {
      if (data.flags.length === 0) {
        flagsList.innerHTML = `
          <div class="clean-state-box">
            <span class="clean-icon" aria-hidden="true">🛡️</span>
            <div>
              <strong>No High-Risk Red Flags Detected</strong>
              <p>While no automated triggers fired, always maintain healthy skepticism with unexpected attachments or requests for sensitive data.</p>
            </div>
          </div>
        `;
      } else {
        // Safe rendering with strict HTML escaping
        flagsList.innerHTML = data.flags.map(f => {
          const badgeClass = f.severity.toLowerCase().includes("critical") ? "critical" : 
                             f.severity.toLowerCase().includes("filter") ? "high" : "high";
          return `
            <div class="flag-item ${badgeClass}">
              <div class="flag-header">
                <span class="badge ${badgeClass}">${escapeHtml(f.severity)}</span>
                <span class="flag-title">${escapeHtml(f.title)}</span>
              </div>
              <p class="flag-desc">${escapeHtml(f.description)}</p>
            </div>
          `;
        }).join("");
      }
    }

    // Dynamic Zero-Trust URL & Domain Security Advisory
    if (advisoryBox) {
      const isLowRisk = data.score < 50;
      advisoryBox.className = `url-advisory-box ${isLowRisk ? 'advisory-low-risk' : 'advisory-high-threat'}`;
      advisoryBox.innerHTML = `
        <div class="advisory-header">
          <span class="advisory-icon" aria-hidden="true">${isLowRisk ? '🔍' : '⚠️'}</span>
          <div>
            <h4 class="advisory-title">${isLowRisk ? 'Zero-Trust Safety Advisory: Verify Sender & URLs' : 'Security Defense Rule: Never Trust SMS Links'}</h4>
            <p class="advisory-subtitle">${isLowRisk ? 
              'Automated heuristics did not flag known red flags, but <strong>cybercriminals frequently send vague or disguised links</strong>. Always inspect before clicking:' : 
              'State toll authorities (SunPass, E-ZPass), banks, USPS, and the IRS <strong>NEVER send urgent payment demands via SMS links</strong>.'}
            </p>
          </div>
        </div>
        <ul class="advisory-checklist">
          <li><strong>Inspect the exact web domain:</strong> Look at the URL structure carefully. Scammers use lookalike domains (e.g. <code>sunpass-toll-pay.top</code> or <code>service-sunpass.xyz</code> instead of the legitimate <code>sunpass.com</code>).</li>
          <li><strong>Never tap links in text messages:</strong> Close the SMS and open a new browser tab or mobile app to check your account balance directly.</li>
          <li><strong>Check with official channels:</strong> If you suspect an unpaid toll or account freeze, visit the agency's official website directly by typing their web address.</li>
        </ul>
      `;
    }
  }
}

/* ==========================================================================
   3. AI Threat Radar 2026 Database & Filtering
   ========================================================================== */
function initThreatRadar() {
  const container = document.getElementById("threatCardsGrid");
  const filterTabs = document.querySelectorAll(".threat-filter-tab");
  const searchInput = document.getElementById("threatSearchInput");

  if (!container || !window.THREAT_DATABASE) return;

  function renderCards(threats) {
    if (threats.length === 0) {
      container.innerHTML = `
        <div class="no-results-card" role="status">
          <p>No threats matching your current filter. Try adjusting your search term.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = threats.map(t => `
      <article class="threat-card" data-category="${escapeHtml(t.category)}">
        <div class="threat-card-header">
          <span class="threat-badge" style="background: rgba(239, 68, 68, 0.15); color: ${escapeHtml(t.severityColor)}; border: 1px solid ${escapeHtml(t.severityColor)};">
            ${escapeHtml(t.severity)}
          </span>
          <span class="threat-category-tag">${escapeHtml(t.categoryName)}</span>
        </div>

        <h3 class="threat-card-title">${escapeHtml(t.title)}</h3>
        <p class="threat-summary">${escapeHtml(t.summary)}</p>

        <div class="threat-impact-row">
          <strong>Estimated Impact:</strong> ${escapeHtml(t.impact)}
        </div>

        <div class="threat-section-title">Key Indicators (Red Flags):</div>
        <ul class="threat-indicators-list">
          ${t.indicators.map(ind => `<li>${escapeHtml(ind)}</li>`).join("")}
        </ul>

        <div class="threat-defense-box">
          <div class="defense-title">🛡️ Recommended Defense:</div>
          <p>${escapeHtml(t.countermeasures)}</p>
        </div>

        <div class="case-study-callout">
          <strong>Real-World Incident:</strong> ${escapeHtml(t.caseStudy)}
        </div>
      </article>
    `).join("");
  }

  // Initial render
  renderCards(window.THREAT_DATABASE);

  // Tab Filtering
  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      applyFilter();
    });
  });

  // Search Filtering with Debouncing for Performance
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilter, 150);
    });
  }

  function applyFilter() {
    const activeTab = document.querySelector(".threat-filter-tab.active");
    const category = activeTab ? activeTab.getAttribute("data-filter") : "all";
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const filtered = window.THREAT_DATABASE.filter(item => {
      const matchesCategory = (category === "all") || (item.category === category);
      const matchesQuery = !query || 
        item.title.toLowerCase().includes(query) || 
        item.summary.toLowerCase().includes(query) ||
        item.indicators.some(i => i.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });

    renderCards(filtered);
  }
}

/* ==========================================================================
   4. Interactive "How Scam-Proof Are You?" Quiz
   ========================================================================== */
function initQuiz() {
  const quizBox = document.getElementById("quizContainer");
  if (!quizBox || !window.QUIZ_QUESTIONS) return;

  let currentIdx = 0;
  let userScore = 0;
  const total = window.QUIZ_QUESTIONS.length;

  function renderQuestion(idx) {
    const q = window.QUIZ_QUESTIONS[idx];
    quizBox.innerHTML = `
      <div class="quiz-progress-bar" role="progressbar" aria-valuenow="${idx + 1}" aria-valuemin="1" aria-valuemax="${total}">
        <div class="quiz-progress-fill" style="width: ${((idx + 1) / total) * 100}%"></div>
      </div>
      <div class="quiz-header-meta">
        <span class="quiz-step-count">Scenario ${idx + 1} of ${total}</span>
        <span class="quiz-score-badge">Current Score: ${userScore}/${idx * 20} pts</span>
      </div>

      <h3 class="quiz-question-title">${escapeHtml(q.question)}</h3>

      <div class="quiz-options-list" role="group" aria-label="Scenario options">
        ${q.options.map((opt, oIdx) => `
          <button type="button" class="quiz-opt-btn" data-oidx="${oIdx}">
            <span class="opt-letter">${String.fromCharCode(65 + oIdx)}</span>
            <span class="opt-text">${escapeHtml(opt.text)}</span>
          </button>
        `).join("")}
      </div>

      <div id="quizFeedbackBox" class="quiz-feedback-box" role="status" aria-live="polite" style="display: none;"></div>
      <div id="quizNextBtnRow" style="display: none; margin-top: 1.5rem; text-align: right;">
        <button type="button" id="quizNextBtn" class="btn btn-primary">
          ${idx + 1 === total ? "View Final Security Assessment" : "Next Scenario &rarr;"}
        </button>
      </div>
    `;

    // Bind option clicks
    const optButtons = quizBox.querySelectorAll(".quiz-opt-btn");
    optButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const oIdx = parseInt(btn.getAttribute("data-oidx"), 10);
        handleAnswer(q, oIdx, optButtons);
      });
    });
  }

  function handleAnswer(question, selectedIdx, allBtns) {
    allBtns.forEach(b => b.disabled = true);
    const selectedOpt = question.options[selectedIdx];
    const feedbackBox = document.getElementById("quizFeedbackBox");
    const nextBtnRow = document.getElementById("quizNextBtnRow");
    const nextBtn = document.getElementById("quizNextBtn");

    if (selectedOpt.correct) {
      userScore += 20;
      allBtns[selectedIdx].classList.add("correct");
      if (feedbackBox) {
        feedbackBox.className = "quiz-feedback-box success";
        feedbackBox.innerHTML = `<strong>Correct! 🎯</strong> ${escapeHtml(selectedOpt.explanation)}`;
        feedbackBox.style.display = "block";
      }
    } else {
      allBtns[selectedIdx].classList.add("wrong");
      question.options.forEach((opt, i) => {
        if (opt.correct) allBtns[i].classList.add("correct");
      });
      if (feedbackBox) {
        feedbackBox.className = "quiz-feedback-box danger";
        feedbackBox.innerHTML = `<strong>Incorrect ⚠️</strong> ${escapeHtml(selectedOpt.explanation)}`;
        feedbackBox.style.display = "block";
      }
    }

    if (nextBtnRow) nextBtnRow.style.display = "block";
    if (nextBtn) {
      nextBtn.focus();
      nextBtn.addEventListener("click", () => {
        if (currentIdx + 1 < total) {
          currentIdx++;
          renderQuestion(currentIdx);
        } else {
          renderFinalAssessment();
        }
      });
    }
  }

  function renderFinalAssessment() {
    let rating = "";
    let ratingClass = "";
    let guidance = "";

    if (userScore >= 80) {
      rating = "Cyber Shield Fortress (High AI Resilience)";
      ratingClass = "badge-success";
      guidance = "Outstanding! You possess an advanced understanding of synthetic voice threats, deepfake vectors, and social engineering. Keep your tools updated and share this knowledge with friends and family.";
    } else if (userScore >= 60) {
      rating = "Moderate Awareness (Vulnerable to Advanced Deepfakes)";
      ratingClass = "badge-warning";
      guidance = "Good base awareness, but you could still fall victim to high-fidelity AI voice clones or sophisticated Quishing attacks. Implementing out-of-band verification is your best next step.";
    } else {
      rating = "High Risk (Easily Targeted by Modern AI Scams)";
      ratingClass = "badge-danger";
      guidance = "You are at significant risk of being exploited by automated GenAI fraud networks. We strongly recommend reading our Deepfake Protection Guide and installing an Identity Theft Protection suite immediately.";
    }

    quizBox.innerHTML = `
      <div class="quiz-final-results" role="status" aria-live="polite">
        <div class="final-score-circle">
          <span class="score-number">${userScore}</span>
          <span class="score-denom">/100 pts</span>
        </div>
        <h3 class="final-rating-title ${ratingClass}">${escapeHtml(rating)}</h3>
        <p class="final-guidance">${escapeHtml(guidance)}</p>

        <div class="action-buttons-group" style="margin-top: 1.5rem;">
          <a href="#defense-stack" class="btn btn-primary">Review Recommended Protection Stack</a>
          <button type="button" id="restartQuizBtn" class="btn btn-secondary">Retake Assessment</button>
        </div>
      </div>
    `;

    const restartBtn = document.getElementById("restartQuizBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        currentIdx = 0;
        userScore = 0;
        renderQuestion(0);
      });
    }
  }

  // Start with first scenario
  renderQuestion(0);
}

/* ==========================================================================
   5. Interactive Incident Response Playbook (Saved to LocalStorage)
   ========================================================================== */
function initIncidentPlaybook() {
  const checkboxes = document.querySelectorAll(".incident-task-checkbox");
  const clearBtn = document.getElementById("resetPlaybookBtn");
  const progressText = document.getElementById("playbookProgressText");

  if (!checkboxes.length) return;

  const STORAGE_KEY = "scamshield_playbook_state";
  let savedState = {};

  try {
    savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    savedState = {};
  }

  // Apply saved state
  checkboxes.forEach(cb => {
    const taskId = cb.getAttribute("data-task-id");
    if (savedState[taskId]) {
      cb.checked = true;
      cb.closest(".playbook-step-card")?.classList.add("completed");
    }

    cb.addEventListener("change", () => {
      savedState[taskId] = cb.checked;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
      } catch (e) {}

      if (cb.checked) {
        cb.closest(".playbook-step-card")?.classList.add("completed");
      } else {
        cb.closest(".playbook-step-card")?.classList.remove("completed");
      }
      updatePlaybookProgress();
    });
  });

  function updatePlaybookProgress() {
    const total = checkboxes.length;
    const completed = Object.values(savedState).filter(Boolean).length;
    if (progressText) {
      progressText.textContent = `${completed} of ${total} emergency actions completed`;
    }
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Reset your emergency checklist progress?")) {
        savedState = {};
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
        checkboxes.forEach(cb => {
          cb.checked = false;
          cb.closest(".playbook-step-card")?.classList.remove("completed");
        });
        updatePlaybookProgress();
      }
    });
  }

  updatePlaybookProgress();
}

/* ==========================================================================
   6. Cybersecurity Affiliate Defense Stack
   ========================================================================== */
function initAffiliateCards() {
  const container = document.getElementById("affiliateCardsRow");
  if (!container || !window.SITE_CONFIG || !window.SITE_CONFIG.affiliates) return;

  const affs = window.SITE_CONFIG.affiliates;
  const cardsHtml = Object.keys(affs).map(key => {
    const item = affs[key];
    const icon = item.icon || "🛡️";
    return `
      <div class="affiliate-card">
        <div class="affiliate-card-badge">${escapeHtml(item.badge)}</div>
        <div class="affiliate-icon-box" aria-hidden="true">${escapeHtml(icon)}</div>
        <h4 class="affiliate-name">${escapeHtml(item.name)}</h4>
        <p class="affiliate-tagline">${escapeHtml(item.tagline)}</p>
        <div class="affiliate-cta-box">
          <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener sponsored" class="btn btn-affiliate">
            ${escapeHtml(item.cta)} &nearr;
          </a>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = cardsHtml;
}

/* ==========================================================================
   7. Mobile Navigation & Accessibility (WCAG 2.1 AA)
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobileNavToggle");
  const navLinks = document.getElementById("primaryNavLinks");

  if (toggleBtn && navLinks) {
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-controls", "primaryNavLinks");

    toggleBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
}

/* ==========================================================================
   8. FAQ Accordion with Accessibility Semantics
   ========================================================================== */
function initFaqAccordion() {
  const headers = document.querySelectorAll(".faq-item-header");
  headers.forEach((h, idx) => {
    const parent = h.closest(".faq-item");
    const body = parent ? parent.querySelector(".faq-item-body") : null;
    const bodyId = `faq-body-${idx}`;

    h.setAttribute("role", "button");
    h.setAttribute("tabindex", "0");
    h.setAttribute("aria-expanded", "false");
    if (body) {
      body.setAttribute("id", bodyId);
      h.setAttribute("aria-controls", bodyId);
    }

    function toggleFaq() {
      if (parent) {
        const isActive = parent.classList.toggle("active");
        h.setAttribute("aria-expanded", String(isActive));
      }
    }

    h.addEventListener("click", toggleFaq);
    h.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFaq();
      }
    });
  });
}
