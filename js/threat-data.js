/**
 * 2026 AI Threat Radar Intelligence Database & Heuristic Presets
 */

window.THREAT_DATABASE = [
  {
    id: "voice-cloning",
    title: "AI Voice Cloning 'Family Emergency' Scam",
    category: "voice",
    categoryName: "Voice Cloning (Vishing)",
    severity: "CRITICAL",
    severityColor: "#EF4444",
    impact: "$1.1B+ in annual AI voice & deepfake losses",
    impactSource: "Deloitte Center for Financial Services & FBI IC3",
    summary: "Attackers scrape as little as 3 seconds of audio from social media (TikTok, Instagram Reels) to synthesize an exact voice clone. They call parents or grandparents claiming an emergency, car accident, or arrest requiring immediate wire or crypto bail.",
    sources: [
      { name: "Deloitte", label: "Center for Financial Services ($1.1B+ Deepfake Losses)", url: "https://www2.deloitte.com/us/en/insights/industry/financial-services.html" },
      { name: "Microsoft Research", label: "VALL-E 3s Neural Synthesis Benchmark", url: "https://arxiv.org/abs/2301.02111" },
      { name: "FBI IC3", label: "Annual Cyber Threat Report", url: "https://www.ic3.gov" },
      { name: "FTC", label: "Consumer Sentinel Voice Clone Advisory", url: "https://www.ftc.gov" }
    ],
    indicators: [
      "Caller demands immediate secrecy ('Don't tell mom', 'Police said not to hang up')",
      "Payment requested via irreversible channels (Bitcoin ATM, Zelle, Wire, Gift Cards)",
      "Background noise seems unnaturally clean or slightly robotic",
      "Refusal to answer personal trivia not available on public social profiles"
    ],
    countermeasures: "Establish a secret, offline 'Family Safe Word'. Always hang up immediately and dial the family member directly on their verified cell phone.",
    caseStudy: "Elderly couples targeted by synthetic voice clones of their grandchildren, losing an average of $8,500 per incident before verification.",
    keywords: ["voice", "vishing", "bail", "grandparent", "grandma", "grandson", "car accident", "emergency", "family safe word", "kidnapping", "ransom", "audio clone", "cloning", "phone scam"]
  },
  {
    id: "agentic-bec",
    title: "Agentic AI Business Email Compromise (BEC)",
    category: "agentic",
    categoryName: "Agentic AI Operations",
    severity: "CRITICAL",
    severityColor: "#EF4444",
    impact: "$2.9B corporate risk worldwide",
    impactSource: "FBI IC3 BEC Telemetry & FinCEN",
    summary: "Autonomous AI agents perform continuous automated reconnaissance on LinkedIn and corporate websites. When an executive travels, the agent generates hyper-personalized, contextually flawless emails to finance staff requesting urgent invoice settlements.",
    sources: [
      { name: "FBI IC3", label: "Business Email Compromise Advisory", url: "https://www.ic3.gov" },
      { name: "FinCEN", label: "Financial Threat Advisory", url: "https://www.fincen.gov" }
    ],
    indicators: [
      "Flawless grammar and nuanced corporate tone mimicking internal communication",
      "Executive is known to be in flight or at an off-site conference",
      "Urgent request to change vendor bank account details on an active invoice",
      "Slightly spoofed domain (e.g., using lookalike Unicode letters or subtle typos)"
    ],
    countermeasures: "Mandate strict out-of-band verification via voice or in-person dual authorization for any vendor account change over $1,000.",
    caseStudy: "Multi-national engineering firm Arup lost $25M when a finance employee was tricked by a multi-person deepfake video conference.",
    keywords: ["bec", "ceo", "cfo", "wire", "invoice", "vendor", "arup", "email compromise", "executive", "payroll", "agentic", "corporate fraud"]
  },
  {
    id: "pig-butchering",
    title: "LLM-Automated 'Pig Butchering' (Sha Zhu Pan)",
    category: "crypto",
    categoryName: "Crypto & Romance",
    severity: "HIGH",
    severityColor: "#F59E0B",
    impact: "Billions stolen through fraudulent liquidity pools",
    impactSource: "US Secret Service & FBI IC3",
    summary: "Syndicates use fine-tuned Large Language Models to converse with hundreds of thousands of victims across WhatsApp, Tinder, and LinkedIn simultaneously. The AI builds trust over weeks before introducing a rigged crypto trading platform.",
    sources: [
      { name: "US Secret Service", label: "Crypto Confidence Fraud Warning", url: "https://www.secretservice.gov" },
      { name: "FBI IC3", label: "Sha Zhu Pan Syndicate Brief", url: "https://www.ic3.gov" }
    ],
    indicators: [
      "Initial contact begins as an alleged 'wrong number' text that turns friendly",
      "Profile photo is an attractive, wealthy entrepreneur or model",
      "Gradual pivot to 'guaranteed daily yield' or 'inside trading signals'",
      "Victims can withdraw small amounts initially, but large balances are locked with demands for 'tax payments'"
    ],
    countermeasures: "Never invest on platforms suggested by online acquaintances. Check domain registration age on WHOIS — scam trading sites are usually under 90 days old.",
    caseStudy: "Victims persuaded to stake life savings into fake Web3 decentralized finance apps displaying fabricated profit dashboards.",
    keywords: ["pig butchering", "sha zhu pan", "crypto", "romance", "whatsapp", "tinder", "dating", "arbitrage", "liquidity pool", "goldman", "bitcoin", "ethereum", "usdt"]
  },
  {
    id: "quishing-qr",
    title: "AI-Generated QR Phishing ('Quishing')",
    category: "phishing",
    categoryName: "Evasive Phishing",
    severity: "HIGH",
    severityColor: "#F59E0B",
    impact: "Bypasses 84% of traditional corporate email gateways",
    impactSource: "CISA & FTC Advisories",
    summary: "Because modern email security filters inspect hyperlinks and text attachments, attackers embed obfuscated QR codes generated with AI aesthetic designs. The victim scans the QR code on their mobile device, moving them off corporate security controls.",
    sources: [
      { name: "FTC", label: "QR Code Scams Public Advisory", url: "https://www.ftc.gov" },
      { name: "CISA", label: "Barcode & QR Security Guide", url: "https://www.cisa.gov" }
    ],
    indicators: [
      "Email alerts regarding mandatory 2FA reset, HR survey, or urgent parcel delivery",
      "No clickable links; instead, an embedded image with a high-contrast QR code",
      "Directs to a spoofed Microsoft 365, Google Workspace, or Okta login portal",
      "Immediate session hijacking using token-stealing adversary-in-the-middle (AiTM) kits"
    ],
    countermeasures: "Never scan QR codes from unexpected emails or paper flyers. Use mobile QR scanners that preview destination domains and SSL certificates.",
    caseStudy: "Spike in fake parking meter QR stickers and corporate MFA re-enrollment email scams targeting corporate executives.",
    keywords: ["quishing", "qr code", "qr", "mfa", "2fa", "microsoft 365", "okta", "barcode", "parking meter", "scan", "aitm", "token theft"]
  },
  {
    id: "fake-ai-software",
    title: "Malicious Fake AI Software & Browser Extensions",
    category: "malware",
    categoryName: "Fake AI Utilities",
    severity: "HIGH",
    severityColor: "#F59E0B",
    impact: "Info-stealers (RedLine, LummaC2) harvesting browser cookies and crypto wallets",
    impactSource: "CISA KEV Catalog & Threat Reports",
    summary: "Threat actors purchase sponsored Google Search and Facebook Ads for fake tools like 'ChatGPT-5 Desktop Beta', 'Midjourney v7 Free', or 'Sora Video Generator'. Downloading the installer deploys info-stealers that harvest session tokens.",
    sources: [
      { name: "CISA", label: "Known Exploited Vulnerabilities Catalog", url: "https://www.cisa.gov" },
      { name: "Mandiant", label: "Infostealer Threat Intelligence", url: "https://cloud.google.com/security" }
    ],
    indicators: [
      "Sponsored Google Ads ranking above organic official domains",
      "Executable or zip files hosted on Discord CDN, Mega, or GitHub releases",
      "Executable asks for Administrator rights or bypass of Windows Defender SmartScreen",
      "Browser suddenly logs you out of Google, Discord, Telegram, or crypto exchanges"
    ],
    countermeasures: "Only download AI utilities from official domains (openai.com, anthropic.com). Verify SHA256 checksums and keep real-time behavioral antivirus active.",
    caseStudy: "Over 500,000 users infected through deceptive Facebook ads promoting a desktop version of generative AI video tools.",
    keywords: ["fake ai", "malware", "chatgpt-5", "sora", "midjourney", "redline", "lummac2", "infostealer", "stealer", "trojan", "extension", "chrome extension"]
  },
  {
    id: "deepfake-kyc",
    title: "Synthetic KYC Bypass & Credit Fraud",
    category: "deepfake",
    categoryName: "Identity Fraud",
    severity: "CRITICAL",
    severityColor: "#EF4444",
    impact: "Identity theft and unauthorized credit lines",
    impactSource: "NIST & INTERPOL Briefings",
    summary: "Fraud rings create synthetic digital identities combining real leaked SSNs with AI-rendered faces that pass automated webcam liveness checks to open fraudulent bank accounts and take out fast loans.",
    sources: [
      { name: "NIST", label: "Digital Identity Guidelines SP 800-63", url: "https://pages.nist.gov/800-63-3/" },
      { name: "INTERPOL", label: "Financial Fraud & Deepfake Brief", url: "https://www.interpol.int" }
    ],
    indicators: [
      "Unexplained inquiries appearing on your Equifax, Experian, or TransUnion credit report",
      "Letters from fintech banks or buy-now-pay-later (BNPL) services for accounts you never created",
      "Sudden phone service disruption due to unauthorized eSIM / SIM swapping"
    ],
    countermeasures: "Freeze your credit files permanently with all three major credit bureaus. Use dedicated identity theft monitoring with dark web credential alerts.",
    caseStudy: "Fintech lenders hit with millions in default loans originated through real-time generative video injection feeds.",
    keywords: ["kyc", "deepfake", "synthetic identity", "credit freeze", "loan fraud"]
  },
  {
    id: "toll-smishing",
    title: "State Road Toll Smishing (SunPass / E-ZPass / FasTrak / TxTag)",
    category: "phishing",
    categoryName: "Toll & SMS Smishing",
    severity: "CRITICAL",
    severityColor: "#EF4444",
    impact: "Over $100M+ in stolen payment cards and nationwide FBI IC3 alerts",
    impactSource: "FBI IC3 Nationwide Smishing PSA",
    summary: "Mass SMS phishing campaigns simulate state road toll collection services (SunPass in Florida, E-ZPass across 19 states, FasTrak in California, TxTag in Texas). The urgent text demands an immediate small payment ($3 to $12) for an 'unpaid toll' to avoid $50+ late fees, directing victims to credential-harvesting lookalike payment portals.",
    sources: [
      { name: "FBI IC3", label: "Nationwide Toll Smishing Public Advisory", url: "https://www.ic3.gov" }
    ],
    indicators: [
      "SMS arrives from a random personal cell number (10-digit) or foreign country code (+44, +63), not an official agency shortcode",
      "Demands urgent payment for an unpaid toll with late fee threats ('Pay within 24 hours to avoid penalty')",
      "Link points to a deceptive, newly registered domain (e.g., sunpass-toll-services.top, ezpass-toll-pay.xyz, invoice-fastrak.com)",
      "Official state toll agencies (SunPass, E-ZPass, FasTrak) never send unsolicited SMS demanding payment with clickable links"
    ],
    countermeasures: "Never click links in toll SMS messages. Navigate directly to the official state portal (sunpass.com, e-zpassny.com) or check your transponder account directly.",
    caseStudy: "The FBI IC3 issued an urgent public warning after thousands of drivers across 15+ states received identical smishing texts within 48 hours.",
    keywords: ["sunpass", "ezpass", "e-zpass", "fastrak", "txtag", "i-pass", "toll", "tollway", "turnpike", "unpaid toll", "late fee", "smishing"]
  },
  {
    id: "bank-impersonation",
    title: "Bank Fraud Department & Zelle / Wire Transfer Trap",
    category: "voice",
    categoryName: "Bank & Wire Fraud",
    severity: "CRITICAL",
    severityColor: "#EF4444",
    impact: "Over $2.7B in unauthorized bank transfers annually",
    impactSource: "FTC Consumer Sentinel Data",
    summary: "Victims receive an SMS alert about a suspicious transaction, followed immediately by a spoofed call from their bank's fraud department. The caller sounds professional, knows the victim's name, and instructs them to transfer money 'to a secure account' or reverse a Zelle charge, which actually transfers the funds directly to the criminal.",
    sources: [
      { name: "FTC", label: "Bank Imposter Scam Alert", url: "https://www.ftc.gov" },
      { name: "FBI IC3", label: "Financial Accounts Impersonation Warning", url: "https://www.ic3.gov" }
    ],
    indicators: [
      "Caller asks you to read back a one-time passcode (OTP) or authentication code sent to your phone",
      "Instructs you to send funds to yourself or a 'safe holding account' via Zelle, wire transfer, or crypto",
      "Creates extreme urgency claiming your account is currently being drained by a rogue employee",
      "Caller ID spoofing shows the exact 1-800 number from the back of your debit card"
    ],
    countermeasures: "Hang up immediately. Banks will NEVER ask you to read back an OTP or transfer money to protect your account. Call the phone number printed directly on the back of your physical card.",
    caseStudy: "Elderly and business banking customers tricked into authorizing tens of thousands in wire and Zelle transfers under the guise of an active fraud investigation.",
    keywords: ["zelle", "bank", "wire", "chase", "wells fargo", "citi", "bank of america", "fraud department", "otp", "passcode"]
  },
  {
    id: "irs-government-extortion",
    title: "Government & Law Enforcement Extortion (IRS / FBI / Arrest Warrant)",
    category: "voice",
    categoryName: "Government Extortion",
    severity: "CRITICAL",
    severityColor: "#EF4444",
    impact: "$500M+ extorted through panic and fear tactics",
    impactSource: "IRS & TIGTA Fraud Reports",
    summary: "Impostors posing as IRS agents, federal marshals, or local police officers contact victims alleging overdue tax penalties, unpaid legal summons, or imminent arrest warrants. They use aggressive intimidation to demand immediate payment via gift cards, wire transfers, or Bitcoin ATMs.",
    sources: [
      { name: "IRS", label: "Tax Scams & Consumer Alerts", url: "https://www.irs.gov/newsroom/tax-scams-consumer-alerts" },
      { name: "TIGTA", label: "Treasury Inspector General Extortion Alert", url: "https://www.treasury.gov/tigta" }
    ],
    indicators: [
      "Caller threatens immediate arrest by local police or county sheriff within the hour",
      "Demands payment via prepaid gift cards (Apple, Target, Vanilla Visa) or cryptocurrency ATMs",
      "Refuses to allow you to hang up, confer with family, or consult a CPA/attorney",
      "Government agencies (IRS, FBI, Law Enforcement) never notify citizens of warrants or penalties via phone or demand gift card payments"
    ],
    countermeasures: "Hang up immediately. Government agencies send official written notices via postal mail and never accept cryptocurrency or gift cards for penalties.",
    caseStudy: "Victims persuaded to purchase thousands in retail gift cards and read the redemption codes over the phone while kept on active call for hours.",
    keywords: ["irs", "police", "arrest", "warrant", "sheriff", "jail", "federal marshal", "tax penalty", "extortion"]
  }
];

// Presets for the Interactive Scam Text Analyzer (Featuring 3 One-Click Headline Scams)
window.ANALYZER_PRESETS = [
  {
    name: "🎣 Phishing Scam",
    category: "phishing",
    sample: "URGENT SECURITY ALERT: Your Chase online banking access has been suspended due to 3 unauthorized login attempts from IP 185.220.101.4. To restore your debit card and verify your identity, visit immediately: https://chase-security-verify.top/verify-login?id=89214. Failure to verify within 2 hours will result in permanent card cancellation."
  },
  {
    name: "💼 Job Scam",
    category: "job",
    sample: "Hello! We reviewed your resume on LinkedIn and found your profile suitable for an online flexible part-time job. You can earn $200-$500 daily by completing simple rating tasks from home for 30 minutes a day. Daily payout via PayPal or USDT. Reply with 'YES' or 'INTERESTED' to connect with our HR manager on WhatsApp now!"
  },
  {
    name: "📦 Delivery Scam",
    category: "delivery",
    sample: "USPS Final Notice: Your package #US940285 could not be dispatched due to an incomplete delivery street address. Please update your address and pay the $1.85 redelivery surcharge within 12 hours at https://usps-post-redelivery.top to avoid your parcel being returned to sender."
  },
  {
    name: "🚗 Road Toll Scam",
    category: "toll",
    sample: "SunPass Alert: You have an unpaid toll of $3.25. Pay now to avoid $50 late fees: https://sunpass-service-pay.top/invoice"
  },
  {
    name: "📞 AI Voice Bail Scam",
    category: "voice",
    sample: "Dad, it's Michael. I'm in huge trouble. I got into an accident in another city and my phone broke. The police officer is letting me use his device. Please don't tell mom right now, she'll panic. They need $4,200 for bail processing immediately before I get transferred to county jail. Send it via Bitcoin ATM to bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh or wire to this account. Call me on this number right now before they take me in."
  },
  {
    name: "💬 Crypto Romance (Pig Butchering)",
    category: "crypto",
    sample: "Hi David! Are you still in Singapore? Oh I'm so sorry, I think my assistant gave me the wrong number. You seem like a very polite gentleman though! By the way, I run a fashion brand and also invest in AI decentralized liquidity arbitrage. My uncle works at Goldman Sachs and gives me verified trading signals with 18% guaranteed weekly return. Here is the private platform: https://defi-quant-goldman-trading.top/invite?code=88392"
  },
  {
    name: "🛡️ Safe Corporate Email",
    category: "safe",
    sample: "Hi Team, Welcome to our monthly engineering newsletter. In this edition, we review our quarterly product metrics, highlight new team members joining our DevOps department, and summarize our upcoming internal hackathon scheduled for November 15th. You can review the agenda on the company Confluence wiki at your convenience. Have a great week!"
  }
];

// Interactive Quiz Questions
window.QUIZ_QUESTIONS = [
  {
    question: "You receive an urgent phone call. The voice sounds indistinguishable from your son, crying and claiming he is arrested after a car crash and needs $5,000 bail sent right now. What is the safest first action?",
    options: [
      { text: "Immediately ask for their crypto wallet address or Zelle info to help quickly.", correct: false, explanation: "Never send money during an emotional emergency call. Scammers rely on panic to bypass rational thinking." },
      { text: "Hang up immediately, ask for our agreed family safe word, or call your son back directly on his saved phone number.", correct: true, explanation: "Correct! With as little as 3 seconds of reference audio (benchmarked by Microsoft VALL-E research), AI can synthesize realistic voice clones. Out-of-band verification via a known number or an offline family safe word is the most authoritative, reliable defense." },
      { text: "Ask the caller where he went to high school to see if he remembers.", correct: false, explanation: "Basic biographical info like high schools or hometowns is easily scraped from public Facebook or LinkedIn profiles." }
    ]
  },
  {
    question: "An attractive stranger messages you on WhatsApp or LinkedIn by 'mistake', apologizes, starts a friendly daily chat, and casually shares screenshots of huge crypto arbitrage profits. What is this?",
    options: [
      { text: "A classic AI-assisted 'Pig Butchering' (Sha Zhu Pan) confidence scam.", correct: true, explanation: "Spot on! Syndicates use LLMs to build emotional trust over weeks before directing you to a fake trading portal that will steal your deposits." },
      { text: "A genuine networking opportunity with a wealthy investor.", correct: false, explanation: "Legitimate institutional investors never solicit random people over WhatsApp or unsolicited LinkedIn messages." },
      { text: "A harmless bot testing internet connection speeds.", correct: false, explanation: "These are organized criminal syndicates utilizing generative AI bots to scale financial fraud." }
    ]
  },
  {
    question: "You get an email from 'IT Support' saying your 2FA token expired, containing a large QR code to scan with your phone camera. Why do scammers use QR codes?",
    options: [
      { text: "Because QR codes load faster on high-speed internet.", correct: false, explanation: "Speed is irrelevant; evasion and off-device exploitation is the real objective." },
      { text: "To bypass corporate email gateway URL scanners and trick you into an Adversary-in-the-Middle phishing site on your personal phone.", correct: true, explanation: "Correct! 'Quishing' hides the malicious URL inside an image, moving you away from your computer's security safeguards." },
      { text: "Because email clients cannot display standard text links anymore.", correct: false, explanation: "Standard links work fine, but security software easily flags malicious domain URLs." }
    ]
  },
  {
    question: "Which of the following is the single most effective defense against unauthorized bank accounts and synthetic credit fraud in your name?",
    options: [
      { text: "Changing your email password once every two weeks.", correct: false, explanation: "Password changes do not stop someone using your stolen SSN to open a line of credit." },
      { text: "Freezing your credit with the 3 major credit bureaus (Equifax, Experian, TransUnion).", correct: true, explanation: "Correct! Freezing your credit prevents lenders from running credit inquiries, blocking scammers from opening new credit cards or loans even if they have your credentials." },
      { text: "Clearing your browser cache every night.", correct: false, explanation: "Clearing browser cache has zero impact on financial credit bureau inquiries." }
    ]
  },
  {
    question: "A sponsored Google search result offers 'Free ChatGPT-5 Turbo for Windows Desktop'. What is the most probable danger?",
    options: [
      { text: "It's an info-stealer malware payload designed to extract browser session cookies and cryptocurrency wallet keys.", correct: true, explanation: "Correct! Fraud actors frequently buy Google Ads for non-existent desktop versions of AI tools to distribute RedLine or LummaC2 malware." },
      { text: "It will just show too many pop-up advertisements.", correct: false, explanation: "Modern fake AI installers drop persistent info-stealers and credential scrapers, not just harmless ads." },
      { text: "It is an official preview build directly from AI researchers.", correct: false, explanation: "Legitimate labs provide models exclusively through their verified domains and official app stores." }
    ]
  }
];
