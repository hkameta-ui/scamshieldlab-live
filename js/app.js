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
   1. Live Threat Intelligence Terminal Feed
   ========================================================================== */
function initTicker() {
  const tickerItems = [
    {
      source: "FBI IC3 ADVISORY",
      text: "Synthetic voice cloning targeting family emergencies surges 310%",
      linkText: "Open Safe Word Kit →",
      linkUrl: "family-safe-word.html"
    },
    {
      source: "ZERO-TRUST PRIVACY",
      text: "ScamShield Lab heuristic analyzer operates 100% in-browser with zero data retention",
      linkText: "View Privacy Matrix →",
      linkUrl: "how-we-score.html#privacy-matrix"
    },
    {
      source: "CISA BULLETIN",
      text: "Reverse-proxy AiTM phishing kits actively intercepting session tokens and SMS 2FA",
      linkText: "Read Passkey Guide →",
      linkUrl: "guide-phishing.html"
    },
    {
      source: "FINCEN WARNING",
      text: "Transnational syndicates deploying LLM bots for automated Pig Butchering investment traps",
      linkText: "Dissect Attack Lifecycle →",
      linkUrl: "guide-pig-butchering.html"
    },
    {
      source: "USPIS ADVISORY",
      text: "Nationwide package redelivery and toll authority smishing waves harvesting payment cards",
      linkText: "Inspect Red Flags →",
      linkUrl: "guide-delivery-scams.html"
    },
    {
      source: "HEURISTIC SCANNER",
      text: "Paste suspicious texts, emails, or links to calculate instant 4-layer risk score",
      linkText: "Run Guest Scan (0.4s) →",
      linkUrl: "#analyzer"
    }
  ];

  const tickerContainer = document.getElementById("liveThreatTicker");
  if (!tickerContainer) return;

  const renderItemsHtml = () => tickerItems.map(item => `
    <span class="ticker-item">
      <span class="ticker-tag">${escapeHtml(item.source)}</span>
      <span class="ticker-text">${escapeHtml(item.text)}</span>
      <a href="${escapeHtml(item.linkUrl)}" class="ticker-action-link">${escapeHtml(item.linkText)}</a>
    </span>
  `).join('<span class="ticker-divider" aria-hidden="true">&bull;</span>');

  const content = renderItemsHtml();
  tickerContainer.innerHTML = `
    <div class="ticker-track">
      ${content}
      <span class="ticker-divider" aria-hidden="true">&bull;</span>
      ${content}
    </div>
  `;
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
      <button type="button" class="preset-chip ${idx < 3 ? 'headline-chip' : ''}" data-idx="${idx}" aria-label="Load preset: ${escapeHtml(p.name)}">
        <span class="chip-dot"></span> ${escapeHtml(p.name)}
      </button>
    `).join("");

    presetsContainer.querySelectorAll(".preset-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-idx");
        const preset = window.ANALYZER_PRESETS[idx];
        if (preset) {
          inputEl.value = preset.sample;
          if (heroQuickInput) heroQuickInput.value = preset.sample;
          presetsContainer.querySelectorAll(".preset-chip").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          runAnalysis(preset.sample);
        }
      });
    });
  }

  // Wire up Above-The-Fold Live Demo Chips & Controls
  const heroQuickInput = document.getElementById("heroQuickInput");
  const heroScanBtn = document.getElementById("heroScanBtn");
  const heroPasteBtn = document.getElementById("heroPasteBtn");
  const heroSampleChips = document.querySelectorAll(".hero-sample-chip");

  if (heroSampleChips.length > 0 && window.ANALYZER_PRESETS) {
    heroSampleChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const idx = chip.getAttribute("data-idx");
        const preset = window.ANALYZER_PRESETS[idx];
        if (preset) {
          if (heroQuickInput) heroQuickInput.value = preset.sample;
          inputEl.value = preset.sample;
          heroSampleChips.forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          runAnalysis(preset.sample);
        }
      });
    });
  }

  // Wire up Copy Incident Response Checklist Button
  const copyChecklistBtn = document.getElementById("copyChecklistBtn");
  if (copyChecklistBtn) {
    copyChecklistBtn.addEventListener("click", async () => {
      const checklistText = [
        "🚨 SCAMSHIELD EMERGENCY INCIDENT RESPONSE CHECKLIST",
        "===================================================",
        "[ ] 1. STOP ALL CONTACT: Do not reply, click links, or dial numbers in the message.",
        "[ ] 2. IF YOU CLICKED A LINK: Disconnect device from Wi-Fi immediately & run an antivirus scan.",
        "[ ] 3. IF CREDENTIALS / OTP ENTERED: Call your bank fraud line immediately (number on back of card) to freeze accounts.",
        "[ ] 4. SECURE YOUR ACCOUNTS: Change passwords from a separate clean device and enable Passkeys / 2FA.",
        "[ ] 5. REPORT THE ATTACK: Forward SMS to 7726 (free spam reporting) and file a complaint at https://reportfraud.ftc.gov/."
      ].join("\n");

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(checklistText);
        } else {
          const tempTextArea = document.createElement("textarea");
          tempTextArea.value = checklistText;
          document.body.appendChild(tempTextArea);
          tempTextArea.select();
          document.execCommand("copy");
          document.body.removeChild(tempTextArea);
        }

        const copyBtnIcon = document.getElementById("copyBtnIcon");
        const copyBtnText = document.getElementById("copyBtnText");
        if (copyBtnIcon) copyBtnIcon.textContent = "✓";
        if (copyBtnText) copyBtnText.textContent = "Checklist Copied!";
        copyChecklistBtn.classList.add("copied");

        setTimeout(() => {
          if (copyBtnIcon) copyBtnIcon.textContent = "📋";
          if (copyBtnText) copyBtnText.textContent = "Copy Action Checklist";
          copyChecklistBtn.classList.remove("copied");
        }, 2500);
      } catch (err) {
        alert("Action checklist copied to clipboard!");
      }
    });
  }

  if (heroScanBtn && heroQuickInput) {
    heroScanBtn.addEventListener("click", () => {
      let text = heroQuickInput.value.trim();
      if (!text) {
        heroQuickInput.focus();
        heroQuickInput.style.borderColor = "var(--color-primary)";
        heroQuickInput.style.boxShadow = "0 0 15px rgba(0, 242, 254, 0.4)";
        setTimeout(() => {
          heroQuickInput.style.borderColor = "";
          heroQuickInput.style.boxShadow = "";
        }, 1500);
        return;
      }
      inputEl.value = text;
      runAnalysis(text);
    });
  }

  if (heroPasteBtn && heroQuickInput) {
    heroPasteBtn.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const clipText = await navigator.clipboard.readText();
          if (clipText && clipText.trim()) {
            heroQuickInput.value = clipText.trim();
            inputEl.value = clipText.trim();
            runAnalysis(clipText.trim());
            return;
          }
        }
      } catch (e) {
        // Fallback: clipboard permission denied or not supported
      }
      heroQuickInput.focus();
      heroQuickInput.select();
    });
  }

  const heroClearBtn = document.getElementById("heroClearBtn");
  if (heroClearBtn && heroQuickInput) {
    heroClearBtn.addEventListener("click", () => {
      heroQuickInput.value = "";
      if (inputEl) inputEl.value = "";
      if (resultsContainer) resultsContainer.style.display = "none";
      heroSampleChips.forEach(c => c.classList.remove("active"));
      if (presetsContainer) {
        presetsContainer.querySelectorAll(".preset-chip").forEach(b => b.classList.remove("active"));
      }
      heroQuickInput.focus();
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
      if (heroQuickInput) heroQuickInput.value = "";
      if (resultsContainer) resultsContainer.style.display = "none";
      if (presetsContainer) {
        presetsContainer.querySelectorAll(".preset-chip").forEach(b => b.classList.remove("active"));
      }
      heroSampleChips.forEach(c => c.classList.remove("active"));
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
        const yOffset = -85;
        const y = resultsContainer.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
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
    const moneyAmountRegex = /(?:[\$€£₹]|rs\.?|inr)\s*\d+([,\.]\d+)?|\b\d+\s*(dollars|bucks|usd|eur|gbp|usdt|rupees|inr|lakhs?|crores?)\b|\b(send|need|wire|transfer|pay|lend|won)\s+(\$|₹|\d+|money|cash|funds|prize)\b/i;

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
    const urlShorteners = ["bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "ow.ly", "shorturl.at"];
    let suspiciousUrlFound = false;
    let isShortenedUrl = false;

    urls.forEach(u => {
      const lowerUrl = u.toLowerCase();
      if (suspiciousTlds.some(tld => lowerUrl.includes(tld)) || lowerUrl.includes("defi-") || lowerUrl.includes("-trading") || lowerUrl.includes("verify-") || lowerUrl.includes("secure-")) {
        suspiciousUrlFound = true;
      }
      if (urlShorteners.some(s => lowerUrl.includes(s))) {
        isShortenedUrl = true;
      }
    });

    if (suspiciousUrlFound) {
      score += 40;
      flags.push({
        severity: "CRITICAL",
        title: "Deceptive or Newly Registered Phishing Domain",
        description: "The link points to an unverified or throwaway domain commonly registered for credential theft and fraudulent crypto dashboards."
      });
    } else if (isShortenedUrl) {
      score += 35;
      flags.push({
        severity: "HIGH",
        title: "Masked URL Shortener (Obfuscated Destination)",
        description: "Contains an obfuscated URL shortener (e.g., bit.ly / tinyurl). Adversaries weaponize shorteners to conceal malicious destinations and evade carrier SMS spam filters."
      });
    } else if (urls.length > 0) {
      score += 15;
      flags.push({
        severity: "MODERATE",
        title: "Embedded Hyperlink Present",
        description: "Contains clickable links. Never log into accounts through links received via unsolicited messages. Navigate directly to the official app or website instead."
      });
    }

    // 9. Fake Lottery, Lucky Draw & Prize Claims (Indian & Global Smishing)
    const prizeKeywords = [
      "congratulations", "lucky draw", "lottery", "claim your prize", "prize winner",
      "selected as winner", "cash reward", "claim reward", "jackpot", "won ₹", "won rs", "won $"
    ];
    const matchedPrizes = prizeKeywords.filter(k => lower.includes(k));
    let isPrizeScam = false;
    if (matchedPrizes.length > 0 || (lower.includes("won") && (lower.includes("prize") || lower.includes("claim") || lower.includes("draw")))) {
      isPrizeScam = true;
      score += 55;
      flags.push({
        severity: "CRITICAL",
        title: "Fake Lucky Draw / Lottery Prize Scam",
        description: `High-risk indicator: Claims you won an unexpected lottery or lucky draw ("${matchedPrizes.length > 0 ? matchedPrizes.slice(0, 2).map(escapeHtml).join('", "') : 'prize claim'}"). Scammers use fake cash prizes to bait victims into clicking credential harvesters or paying advance 'processing fees'. Legitimate lotteries never notify winners via unsolicited SMS or masked links.`
      });
    }

    // 10. Fake Job Recruitment & Part-Time Task Scams (WhatsApp / Telegram / SMS Engagement Bait)
    const jobKeywords = [
      "flexible job", "part-time job", "part time job", "work from home", "remote job", "online job",
      "hiring manager", "recruiter", "recruitment", "hr manager", "career team",
      "found your profile", "found your resume", "reviewed your resume", "saw your profile",
      "found your cv", "shortlisted your profile", "daily payout", "earn daily", "simple tasks"
    ];
    const jobReplyHooks = [
      "reply with yes", "reply yes", "reply with interested", "reply interested",
      "reply 1", "type yes", "send yes", "text yes", "reply with 'yes'", "reply with 'interested'"
    ];

    const matchedJob = jobKeywords.filter(k => lower.includes(k));
    const matchedJobHooks = jobReplyHooks.filter(k => lower.includes(k));
    let isJobScam = false;

    if (matchedJob.length > 0 && (matchedJobHooks.length > 0 || (lower.includes("reply") && (lower.includes("yes") || lower.includes("interested"))))) {
      isJobScam = true;
      score += 60;
      flags.push({
        severity: "CRITICAL",
        title: "Fake Job / Part-Time Task Scam Lure",
        description: `High-risk indicator: Unsolicited recruitment offer claiming to have "found your profile" with a "flexible job", prompting you to reply ("YES" / "INTERESTED"). Attackers use this two-stage bait to verify active phone numbers before luring victims into WhatsApp or Telegram groups that demand prepaid task deposits.`
      });
    } else if (matchedJobHooks.length > 0 && (lower.includes("job") || lower.includes("earn") || lower.includes("salary") || lower.includes("income") || lower.includes("profile"))) {
      isJobScam = true;
      score += 55;
      flags.push({
        severity: "CRITICAL",
        title: "Unsolicited Two-Stage Smishing Bait",
        description: `Prompts an immediate single-word response ("YES" / "INTERESTED") to an unsolicited job or income lure. Replying marks your phone number as an active, responsive target on scammer lead lists.`
      });
    }

    // 11. OTP / 2FA Verification Code Harvesting, Account Takeover & Fake Refund Scams
    const codeInterceptionKeywords = [
      "receive a code", "share the code", "send the code", "tell me the code", "read the code",
      "verification code", "security code", "authentication code", "6-digit code", "passcode",
      "one-time password", "otp", "2fa code", "confirm the code", "read back the code", "sms code",
      "enter the code", "provide the code", "forward the code", "give me the code", "text me the code",
      "send me the code", "send it to me", "sent a code", "sent you a code", "code to your number",
      "code to your phone", "code on your phone", "code by mistake", "accidentally sent a code",
      "accidentally sent you a code"
    ];
    const refundKeywords = [
      "refund", "confirm the refund", "process the refund", "process your refund",
      "claim refund", "overpayment", "cancel subscription", "cancel charge", "cancel transaction",
      "subscription renewal", "accidental charge", "geek squad", "norton", "mcafee"
    ];

    const matchedCode = codeInterceptionKeywords.filter(k => lower.includes(k));
    const matchedRefund = refundKeywords.filter(k => lower.includes(k));
    let isOtpTheft = false;

    // Pattern A: Accidental Code Interception / Social Engineering Account Takeover
    // e.g. "I sent a code to your number by mistake. Can you send it to me?"
    const hasAccidentalMistake = (
      lower.includes("by mistake") || lower.includes("mistake") || lower.includes("accident") ||
      lower.includes("wrong number") || lower.includes("put your number") || lower.includes("entered your number") ||
      lower.includes("typed your number")
    );
    const hasCodeRef = (
      lower.includes("verification code") || lower.includes("security code") || lower.includes("authentication code") ||
      lower.includes("one-time password") || lower.includes("otp") || lower.includes("2fa") ||
      lower.includes("6-digit") || lower.includes("passcode") || lower.includes("sms code") ||
      (lower.includes("code") && (
        lower.includes("sent a code") || lower.includes("send the code") || lower.includes("share the code") ||
        lower.includes("receive a code") || lower.includes("code to your") || lower.includes("code by mistake") ||
        lower.includes("forward the code") || lower.includes("tell me the code") || lower.includes("give me the code") ||
        lower.includes("sent you a code") || lower.includes("code on your") || lower.includes("can you send") ||
        lower.includes("send it") || lower.includes("send me")
      )) ||
      lower.includes("pin") || lower.includes("digit")
    );
    const hasSendRequest = (
      lower.includes("send it to me") || lower.includes("send me the code") || lower.includes("send the code to me") ||
      lower.includes("send it back") || lower.includes("forward the code") || lower.includes("give me the code") ||
      lower.includes("tell me the code") || lower.includes("share the code") || lower.includes("read the code") ||
      lower.includes("what is the code") || lower.includes("what's the code") || lower.includes("what was the code") ||
      ((lower.includes("can you send") || lower.includes("please send")) && (lower.includes("code") || lower.includes("otp") || lower.includes("pin") || lower.includes("digit"))) ||
      (lower.includes("send it") && (lower.includes("code") || lower.includes("number") || lower.includes("mistake")))
    );

    const isAccidentalCodeTheft = (
      (lower.includes("sent a code") || lower.includes("sent you a code") || lower.includes("code to your number") || lower.includes("code to your phone") || lower.includes("code on your phone")) &&
      (hasAccidentalMistake || hasSendRequest || lower.includes("send") || lower.includes("forward"))
    ) || (
      hasAccidentalMistake && hasCodeRef && (hasSendRequest || lower.includes("send") || lower.includes("forward") || lower.includes("give"))
    ) || (
      hasSendRequest && (hasCodeRef || lower.includes("number") || lower.includes("phone") || lower.includes("sms"))
    );

    if (isAccidentalCodeTheft) {
      isOtpTheft = true;
      score += 75;
      flags.push({
        severity: "CRITICAL",
        title: "Account Takeover: 'Accidental' Verification Code / 2FA Theft",
        description: `High-risk indicator: Claims to have sent a code "by mistake" and requests you to send, forward, or read it back ("${matchedCode.length > 0 ? matchedCode.slice(0, 2).map(escapeHtml).join('", "') : 'code sent by mistake'}"). Attackers initiate an account takeover (WhatsApp, Google, banking, or social media) using your phone number, then trick you into handing over the SMS one-time passcode (OTP). Legitimate systems NEVER require you to send back a code received by mistake. NEVER share incoming verification codes.`
      });
    } else if (matchedCode.length > 0 && (matchedRefund.length > 0 || lower.includes("refund"))) {
      isOtpTheft = true;
      score += 65;
      flags.push({
        severity: "CRITICAL",
        title: "2FA / OTP Theft Disguised as Refund Confirmation",
        description: `High-risk indicator: Mentions receiving a security code to "confirm a refund" ("${matchedCode.slice(0, 1).map(escapeHtml).join('", "')}"). Banks, credit card issuers, and merchants NEVER require you to provide an incoming security code to issue a refund. The code you receive is an authorization token (OTP/2FA) to drain funds or reset your account password.`
      });
    } else if (matchedCode.length > 0 && (lower.includes("send") || lower.includes("share") || lower.includes("tell") || lower.includes("read") || lower.includes("confirm") || lower.includes("give") || lower.includes("forward"))) {
      isOtpTheft = true;
      score += 60;
      flags.push({
        severity: "CRITICAL",
        title: "One-Time Passcode (OTP) Harvesting Trap",
        description: `High-risk indicator: Demands that you share, confirm, or read back a security verification code. Security codes (OTP) are private keys meant strictly for the account owner. Sharing a code gives attackers immediate access to bypass multi-factor authentication (MFA).`
      });
    } else if (matchedRefund.length > 0 && (lower.includes("call") || lower.includes("toll free") || lower.includes("within 24 hours") || lower.includes("cancel") || lower.includes("charged") || lower.includes("invoice"))) {
      score += 45;
      flags.push({
        severity: "HIGH",
        title: "Fake Refund / Subscription Cancellation Lure",
        description: `High-risk indicator: Claims an unexpected charge or offers a refund ("${matchedRefund.slice(0, 2).map(escapeHtml).join('", "')}"). Scammers invent bogus subscription invoices to bait victims into calling fraudulent call centers.`
      });
    }

    // 12. Compound Attack Synergy Boost
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
      } else if (isPrizeScam) {
        summaryText = "DANGER: High-probability Fake Lucky Draw / Lottery Scam detected. Never pay advance fees, taxes, or click masked bit.ly links to claim unexpected prize money.";
      } else if (isJobScam) {
        summaryText = "DANGER: High-probability Fake Job / Part-Time Task Scam detected. Legitimate employers never send unsolicited SMS offers asking you to reply with 'YES' or 'INTERESTED'. DO NOT REPLY.";
      } else if (isOtpTheft) {
        summaryText = "DANGER: High-probability 2FA/OTP Code Theft or Account Takeover detected. Banks and merchants NEVER require you to receive or confirm a code to issue refunds or verify identity. Attackers trigger logins then claim a code was sent 'by mistake' to steal accounts. NEVER SHARE CODES.";
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

    // Dynamic Flipped Immediate Actions Card (Immediate Action in Plain English at Top)
    const immediateActionsCard = document.getElementById("analyzerImmediateActions");
    if (immediateActionsCard) {
      const isHighThreat = data.score >= 50;
      const isModerate = data.score >= 30 && data.score < 50;
      
      const titleEl = immediateActionsCard.querySelector(".actions-card-title");
      const subtitleEl = immediateActionsCard.querySelector(".actions-card-subtitle");
      const iconEl = immediateActionsCard.querySelector(".actions-alert-icon");
      const checklistItemsEl = document.getElementById("analyzerChecklistItems");

      if (isHighThreat) {
        immediateActionsCard.style.borderColor = "rgba(239, 68, 68, 0.4)";
        immediateActionsCard.style.background = "linear-gradient(180deg, rgba(239, 68, 68, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%)";
        if (iconEl) iconEl.textContent = "🚨";
        if (titleEl) titleEl.textContent = "Immediate Action Plan (Do This First)";
        if (subtitleEl) subtitleEl.textContent = "Plain-English emergency guidance — follow these steps before reviewing technical evidence:";
        if (checklistItemsEl) {
          checklistItemsEl.innerHTML = `
            <li><span class="chk-box">☐</span> <strong>STOP ALL CONTACT:</strong> Do not reply, click links, or dial numbers in the message.</li>
            <li><span class="chk-box">☐</span> <strong>IF YOU CLICKED A LINK:</strong> Disconnect device from Wi-Fi immediately & run an antivirus scan.</li>
            <li><span class="chk-box">☐</span> <strong>IF CREDENTIALS / OTP ENTERED:</strong> Call your bank's fraud line immediately (number on back of card) to freeze accounts.</li>
            <li><span class="chk-box">☐</span> <strong>SECURE YOUR ACCOUNTS:</strong> Change passwords from a separate clean device and enable Passkeys / 2FA.</li>
            <li><span class="chk-box">☐</span> <strong>REPORT THE ATTACK:</strong> Forward SMS to 7726 (free spam reporting) and file a complaint at <a href="https://reportfraud.ftc.gov/" target="_blank" rel="noopener noreferrer">reportfraud.ftc.gov</a>.</li>
          `;
        }
      } else if (isModerate) {
        immediateActionsCard.style.borderColor = "rgba(245, 158, 11, 0.4)";
        immediateActionsCard.style.background = "linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%)";
        if (iconEl) iconEl.textContent = "⚠️";
        if (titleEl) titleEl.textContent = "Precautionary Action Plan (Moderate Suspicion)";
        if (subtitleEl) subtitleEl.textContent = "This communication contains suspicious elements — verify before interacting:";
        if (checklistItemsEl) {
          checklistItemsEl.innerHTML = `
            <li><span class="chk-box">☐</span> <strong>VERIFY INDEPENDENTLY:</strong> Do not use contact info inside the message. Look up the organization's official website directly.</li>
            <li><span class="chk-box">☐</span> <strong>INSPECT DOMAINS:</strong> Ensure URLs match the official brand (e.g., <code>usps.com</code>, not <code>usps-delivery.top</code>).</li>
            <li><span class="chk-box">☐</span> <strong>NEVER SHARE CODES:</strong> Legitimate agents will never ask you for one-time verification passwords.</li>
            <li><span class="chk-box">☐</span> <strong>REPORT IF UNSOLICITED:</strong> Forward unsolicited SMS messages to 7726 to help carrier spam filters block the sender.</li>
          `;
        }
      } else {
        immediateActionsCard.style.borderColor = "rgba(16, 185, 129, 0.4)";
        immediateActionsCard.style.background = "linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%)";
        if (iconEl) iconEl.textContent = "🛡️";
        if (titleEl) titleEl.textContent = "Safety Verification: Low Risk Communication";
        if (subtitleEl) subtitleEl.textContent = "No prominent scam patterns detected. Standard digital hygiene recommendations:";
        if (checklistItemsEl) {
          checklistItemsEl.innerHTML = `
            <li><span class="chk-box">☐</span> <strong>STANDARD SAFETY:</strong> The text appears standard, but stay alert if future messages ask for money or credentials.</li>
            <li><span class="chk-box">☐</span> <strong>KEEP PASSWORDS STRONG:</strong> Use unique passphrases and a password manager across all your online services.</li>
            <li><span class="chk-box">☐</span> <strong>KEEP 2FA ACTIVE:</strong> Multi-factor authentication blocks over 99% of automated credential stuffing attempts.</li>
          `;
        }
      }
    }

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

    // Contextual Active Defense Recommendation (Nord Security Verified Partner Integration)
    const defenseRecBox = document.getElementById("analyzerDefenseRecommendation");
    if (defenseRecBox) {
      const lowerText = (inputEl ? inputEl.value : "").toLowerCase();
      const hasUrlOrPhish = data.score >= 30 || lowerText.includes("http") || lowerText.includes(".com") || lowerText.includes(".org") || lowerText.includes(".net") || lowerText.includes(".top") || lowerText.includes(".xyz") || lowerText.includes("toll") || lowerText.includes("link") || lowerText.includes("click");
      const hasCredentialRisk = lowerText.includes("password") || lowerText.includes("passcode") || lowerText.includes("pin") || lowerText.includes("otp") || lowerText.includes("code") || lowerText.includes("voice") || lowerText.includes("grand") || lowerText.includes("arrest");

      const hasEmailOrBec = lowerText.includes("invoice") || lowerText.includes("wire transfer") || lowerText.includes("payroll") || lowerText.includes("direct deposit") || lowerText.includes("executive") || lowerText.includes("ceo") || lowerText.includes("vendor") || lowerText.includes("w-2") || lowerText.includes("employment agreement");

      let recTitle = "NordVPN Threat Protection Pro";
      let recBadge = "DNS & Phishing Shield";
      let recIcon = "assets/images/nordvpn-icon.svg";
      let recDesc = "Malicious SMS and road toll scams use spoofed domains to harvest payment card details. NordVPN's Threat Protection Pro automatically intercepts and blocks malicious URLs at the DNS level before they can load in your browser.";
      let recBtnClass = "defense-rec-btn";
      let recBtnText = "Activate DNS & Phishing Shield (68% Off)";
      let recUrl = (window.SITE_CONFIG && window.SITE_CONFIG.affiliates && window.SITE_CONFIG.affiliates.vpnPrivacy) ? window.SITE_CONFIG.affiliates.vpnPrivacy.url : "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=159036&url_id=902";
      let promoPillHtml = "";

      let secondaryTitle = "NordPass Premium & Passkey Vault";
      let secondaryIcon = "assets/images/nordpass-icon.svg";
      let secondaryDesc = "Hardware-backed passkeys eliminate credential theft risks.";
      let secondaryUrl = (window.SITE_CONFIG && window.SITE_CONFIG.affiliates && window.SITE_CONFIG.affiliates.passwordManager) ? window.SITE_CONFIG.affiliates.passwordManager.url : "https://go.nordpass.io/aff_c?offer_id=488&aff_id=159036&url_id=9356";
      let secondaryCta = "Explore Passkeys";

      if (hasEmailOrBec) {
        recTitle = "Google Workspace with Gemini";
        recBadge = "AI Phishing & BEC Defense";
        recIcon = "assets/images/google-workspace-icon.svg";
        recDesc = "Business Email Compromise (BEC) and fake invoice scams spoof executive domains. Google Workspace with Gemini deploys deep-learning AI to neutralize 99.9% of spoofed emails and impersonation attempts before reaching inboxes.";
        recBtnClass = "defense-rec-btn google-btn";
        recBtnText = "Claim 10% Off & Free Trial";
        recUrl = (window.SITE_CONFIG && window.SITE_CONFIG.affiliates && window.SITE_CONFIG.affiliates.googleWorkspace) ? window.SITE_CONFIG.affiliates.googleWorkspace.url : "https://sharegoogleworkspace.advocate.impact.com/mzYP7Zg";
        promoPillHtml = `
          <div class="promo-code-pill" data-copy-code="UCYHWLERFJVJUW4" title="Click to copy 10% discount promo code" role="button" tabindex="0">
            <span>Exclusive Code: <strong>UCYHWLERFJVJUW4</strong> (10% Off)</span>
            <span class="copy-code-badge">📋 Copy</span>
          </div>
        `;
        secondaryTitle = "NordVPN Threat Protection Pro";
        secondaryIcon = "assets/images/nordvpn-icon.svg";
        secondaryDesc = "Automated DNS domain interception blocking fake recruiter portals.";
        secondaryUrl = (window.SITE_CONFIG && window.SITE_CONFIG.affiliates && window.SITE_CONFIG.affiliates.vpnPrivacy) ? window.SITE_CONFIG.affiliates.vpnPrivacy.url : "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=159036&url_id=902";
        secondaryCta = "Activate DNS Shield";
      } else if (hasCredentialRisk && !hasUrlOrPhish) {
        recTitle = "NordPass Premium & Passkey Vault";
        recBadge = "FIDO2 & Passkey Vault";
        recIcon = "assets/images/nordpass-icon.svg";
        recDesc = "Cybercriminals use AI voice clones and fake emergency calls to steal passwords and 2FA credentials. NordPass neutralizes credential-theft attacks through zero-knowledge hardware-bound passkeys.";
        recBtnClass = "defense-rec-btn nordpass-btn";
        recBtnText = "Lock Passwords with Passkeys";
        recUrl = (window.SITE_CONFIG && window.SITE_CONFIG.affiliates && window.SITE_CONFIG.affiliates.passwordManager) ? window.SITE_CONFIG.affiliates.passwordManager.url : "https://go.nordpass.io/aff_c?offer_id=488&aff_id=159036&url_id=9356";
        secondaryTitle = "Google Titan Security Key";
        secondaryIcon = "🔑";
        secondaryDesc = "Hardware FIDO2 cryptographic tokens blocking unauthorized account takeovers.";
        secondaryUrl = "https://store.google.com/product/titan_security_key";
        secondaryCta = "Explore Titan Keys";
      }

      const secondaryIconHtml = secondaryIcon.endsWith(".svg")
        ? `<img src="${escapeHtml(secondaryIcon)}" alt="${escapeHtml(secondaryTitle)} Icon" width="26" height="26" class="affiliate-brand-img" loading="lazy" decoding="async">`
        : `<span style="font-size: 1.25rem;">${escapeHtml(secondaryIcon)}</span>`;

      defenseRecBox.innerHTML = `
        <div class="defense-rec-header">
          <span class="defense-rec-badge">🛡️ Recommended Active Defense: ${escapeHtml(recBadge)}</span>
          <span class="defense-partner-verified">&#10003; Verified Security Partner</span>
        </div>
        <div class="defense-rec-content">
          <div class="defense-rec-icon">
            <img src="${escapeHtml(recIcon)}" alt="${escapeHtml(recTitle)} Icon" class="affiliate-brand-img" width="52" height="52" loading="lazy" decoding="async">
          </div>
          <div class="defense-rec-info">
            <h4>${escapeHtml(recTitle)}</h4>
            <p>${escapeHtml(recDesc)}</p>
            ${promoPillHtml}
          </div>
          <div>
            <a href="${escapeHtml(recUrl)}" target="_blank" rel="noopener sponsored" class="${recBtnClass}">
              ${escapeHtml(recBtnText)} &nearr;
            </a>
          </div>
        </div>
        <div class="defense-rec-secondary-row">
          <div class="defense-rec-secondary-info">
            ${secondaryIconHtml}
            <span><strong>Complementary Layer:</strong> ${escapeHtml(secondaryTitle)} &bull; ${escapeHtml(secondaryDesc)}</span>
          </div>
          <a href="${escapeHtml(secondaryUrl)}" target="_blank" rel="noopener sponsored" class="defense-rec-secondary-link">
            ${escapeHtml(secondaryCta)} &rarr;
          </a>
        </div>
        <div class="defense-rec-footer">
          <span>Exclusive ScamShield Lab Reader Pricing Applied (Up to 68% Off Nord / 10% Off Google Workspace)</span>
          <span>FTC Disclosure: Authorized Security Partner Referral</span>
        </div>
      `;
      defenseRecBox.style.display = "flex";
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

  function renderCards(threats, queryText = "") {
    if (threats.length === 0) {
      container.innerHTML = `
        <div class="no-results-card" role="status">
          <p>No threats matching ${queryText ? `"${escapeHtml(queryText)}"` : "your current filter"}.</p>
          <div class="no-results-hint">
            Try searching for active threats: 
            <button type="button" class="search-suggestion-btn" data-search="sunpass">SunPass</button>
            <button type="button" class="search-suggestion-btn" data-search="ezpass">E-ZPass</button>
            <button type="button" class="search-suggestion-btn" data-search="zelle">Zelle</button>
            <button type="button" class="search-suggestion-btn" data-search="irs">IRS</button>
            <button type="button" class="search-suggestion-btn" data-search="voice">Voice Cloning</button>
            <button type="button" class="search-suggestion-btn" data-search="quishing">QR Quishing</button>
          </div>
        </div>
      `;

      container.querySelectorAll(".search-suggestion-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const s = btn.getAttribute("data-search");
          if (searchInput) searchInput.value = s;
          if (heroSearchInput) heroSearchInput.value = s;
          filterTabs.forEach(t => {
            const isAll = t.getAttribute("data-filter") === "all";
            t.classList.toggle("active", isAll);
            t.setAttribute("aria-selected", isAll ? "true" : "false");
          });
          applyFilter();
        });
      });
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
          <div><strong>Estimated Impact:</strong> ${escapeHtml(t.impact)}</div>
          ${t.impactSource ? `<div class="threat-impact-source">🏛️ Verified Sourcing: <span>${escapeHtml(t.impactSource)}</span></div>` : ""}
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

        ${t.sources && t.sources.length ? `
        <div class="threat-sources-box">
          <span class="threat-sources-title">Verified Intelligence Citations:</span>
          <div class="threat-sources-list">
            ${t.sources.map(s => `
              <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="threat-source-link" title="Open verified documentation: ${escapeHtml(s.label)}">
                <span class="source-tag-name">🏛️ ${escapeHtml(s.name)}:</span> <span class="source-tag-label">${escapeHtml(s.label)}</span> &rarr;
              </a>
            `).join("")}
          </div>
        </div>
        ` : ""}
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
      debounceTimer = setTimeout(() => {
        if (heroSearchInput && document.activeElement === searchInput) {
          heroSearchInput.value = searchInput.value;
        }
        applyFilter();
      }, 150);
    });
  }

  // Hero Quick Search integration
  const heroSearchInput = document.getElementById("heroQuickSearchInput");
  const heroSearchBtn = document.getElementById("heroQuickSearchBtn");

  function triggerSearchOrScan(term) {
    const cleanTerm = (term || "").trim();
    if (!cleanTerm) return;

    if (cleanTerm.length > 55) {
      // Looks like a full suspicious text message -> route to Neural Analyzer
      const scamInput = document.getElementById("scamTextInput");
      const scanBtn = document.getElementById("analyzeBtn");
      if (scamInput && scanBtn) {
        scamInput.value = cleanTerm;
        const analyzerSection = document.getElementById("analyzer");
        if (analyzerSection) analyzerSection.scrollIntoView({ behavior: "smooth" });
        scanBtn.click();
      }
    } else {
      // Threat keyword -> filter radar and scroll to matrix
      if (searchInput) searchInput.value = cleanTerm;
      filterTabs.forEach(t => {
        const isAll = t.getAttribute("data-filter") === "all";
        t.classList.toggle("active", isAll);
        t.setAttribute("aria-selected", isAll ? "true" : "false");
      });
      applyFilter();
      const radarSection = document.getElementById("threat-radar");
      if (radarSection) radarSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  if (heroSearchInput) {
    let heroDebounceTimer;
    heroSearchInput.addEventListener("input", () => {
      clearTimeout(heroDebounceTimer);
      heroDebounceTimer = setTimeout(() => {
        if (searchInput) searchInput.value = heroSearchInput.value;
        applyFilter();
      }, 150);
    });

    heroSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        triggerSearchOrScan(heroSearchInput.value);
      }
    });
  }

  if (heroSearchBtn && heroSearchInput) {
    heroSearchBtn.addEventListener("click", () => {
      triggerSearchOrScan(heroSearchInput.value);
    });
  }

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search immediately
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const targetInput = heroSearchInput || searchInput;
      if (targetInput) {
        targetInput.focus();
        targetInput.select();
      }
    }
  });

  // URL Query Handler for Google SearchAction Sitelinks (e.g. ?q=SunPass)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("q");
    if (queryParam) {
      if (heroSearchInput) heroSearchInput.value = queryParam;
      triggerSearchOrScan(queryParam);
    }
  } catch (err) {
    console.warn("URL query parse error:", err);
  }

  function applyFilter() {
    const activeTab = document.querySelector(".threat-filter-tab.active");
    let category = activeTab ? activeTab.getAttribute("data-filter") : "all";
    const query = (searchInput ? searchInput.value : (heroSearchInput ? heroSearchInput.value : "")).toLowerCase().trim();

    function matchesItem(item) {
      if (!query) return true;
      const inTitle = item.title && item.title.toLowerCase().includes(query);
      const inSummary = item.summary && item.summary.toLowerCase().includes(query);
      const inCategoryName = item.categoryName && item.categoryName.toLowerCase().includes(query);
      const inCategory = item.category && item.category.toLowerCase().includes(query);
      const inIndicators = Array.isArray(item.indicators) && item.indicators.some(i => i.toLowerCase().includes(query));
      const inDefense = item.countermeasures && item.countermeasures.toLowerCase().includes(query);
      const inCaseStudy = item.caseStudy && item.caseStudy.toLowerCase().includes(query);
      const inKeywords = Array.isArray(item.keywords) && item.keywords.some(k => k.toLowerCase().includes(query));
      const inImpact = item.impact && item.impact.toLowerCase().includes(query);
      return inTitle || inSummary || inCategoryName || inCategory || inIndicators || inDefense || inCaseStudy || inKeywords || inImpact;
    }

    let filtered = window.THREAT_DATABASE.filter(item => {
      const matchesCategory = (category === "all") || (item.category === category);
      return matchesCategory && matchesItem(item);
    });

    // Auto-recovery: If user has a category tab selected and searches a term that exists in another category,
    // automatically switch to "All Vectors" tab so they find what they are searching for immediately.
    if (filtered.length === 0 && category !== "all" && query) {
      const allMatches = window.THREAT_DATABASE.filter(matchesItem);
      if (allMatches.length > 0) {
        filterTabs.forEach(t => {
          const isAll = t.getAttribute("data-filter") === "all";
          t.classList.toggle("active", isAll);
          t.setAttribute("aria-selected", isAll ? "true" : "false");
        });
        filtered = allMatches;
      }
    }

    renderCards(filtered, query);
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
    const isSvgIcon = item.icon && item.icon.endsWith(".svg");
    const iconHtml = isSvgIcon 
      ? `<img src="${escapeHtml(item.icon)}" alt="${escapeHtml(item.name)} Official Logo" width="48" height="48" loading="lazy" decoding="async" class="affiliate-brand-img">`
      : `<span class="affiliate-emoji-icon">${escapeHtml(item.icon || "🛡️")}</span>`;

    return `
      <div class="affiliate-card">
        <div class="affiliate-card-badge">${escapeHtml(item.badge)}</div>
        <div class="affiliate-icon-box" aria-hidden="true">${iconHtml}</div>
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

// 1-Click Interactive Promo Code Copy Handler
document.addEventListener("click", (e) => {
  const promoPill = e.target.closest("[data-copy-code]");
  if (!promoPill) return;

  const code = promoPill.getAttribute("data-copy-code");
  if (!code) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      const badge = promoPill.querySelector(".copy-code-badge");
      if (badge) {
        const oldTxt = badge.textContent;
        badge.textContent = "✓ Copied!";
        promoPill.classList.add("copied");
        setTimeout(() => {
          badge.textContent = oldTxt;
          promoPill.classList.remove("copied");
        }, 2500);
      }
    }).catch(() => {});
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    const promoPill = e.target && e.target.closest ? e.target.closest("[data-copy-code]") : null;
    if (promoPill) {
      e.preventDefault();
      promoPill.click();
    }
  }
});

// Mobile & Browser BF-Cache Invalidation:
// Ensure visitors never receive a stale frozen page snapshot when navigating back or reopening tabs
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

// Lightweight Passive Back to Top Controller (Zero CLS, GPU-Accelerated)
document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    let isTicking = false;
    window.addEventListener("scroll", () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 380) {
            backToTopBtn.classList.add("visible");
          } else {
            backToTopBtn.classList.remove("visible");
          }
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
