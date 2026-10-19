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
    impact: "Over $1.1B in annual global losses",
    summary: "Attackers scrape 3-5 seconds of audio from social media (TikTok, Instagram Reels) to synthesize an exact voice clone. They call parents or grandparents claiming an emergency, car accident, or arrest requiring immediate wire or crypto bail.",
    indicators: [
      "Caller demands immediate secrecy ('Don't tell mom', 'Police said not to hang up')",
      "Payment requested via irreversible channels (Bitcoin ATM, Zelle, Wire, Gift Cards)",
      "Background noise seems unnaturally clean or slightly robotic",
      "Refusal to answer personal trivia not available on public social profiles"
    ],
    countermeasures: "Establish a secret, offline 'Family Safe Word'. Always hang up immediately and dial the family member directly on their verified cell phone.",
    caseStudy: "Elderly couples targeted by synthetic voice clones of their grandchildren, losing an average of $8,500 per incident before verification."
  },
  {
    id: "agentic-bec",
    title: "Agentic AI Business Email Compromise (BEC)",
    category: "agentic",
    categoryName: "Agentic AI Operations",
    severity: "CRITICAL",
    severityColor: "#EF4444",
    impact: "$2.9B corporate risk worldwide",
    summary: "Autonomous AI agents perform continuous automated reconnaissance on LinkedIn and corporate websites. When an executive travels, the agent generates hyper-personalized, contextually flawless emails to finance staff requesting urgent invoice settlements.",
    indicators: [
      "Flawless grammar and nuanced corporate tone mimicking internal communication",
      "Executive is known to be in flight or at an off-site conference",
      "Urgent request to change vendor bank account details on an active invoice",
      "Slightly spoofed domain (e.g., using lookalike Unicode letters or subtle typos)"
    ],
    countermeasures: "Mandate strict out-of-band verification via voice or in-person dual authorization for any vendor account change over $1,000.",
    caseStudy: "Multi-national engineering firm Arup lost $25M when a finance employee was tricked by a multi-person deepfake video conference."
  },
  {
    id: "pig-butchering",
    title: "LLM-Automated 'Pig Butchering' (Sha Zhu Pan)",
    category: "crypto",
    categoryName: "Crypto & Romance",
    severity: "HIGH",
    severityColor: "#F59E0B",
    impact: "Billions stolen through fraudulent liquidity pools",
    summary: "Syndicates use fine-tuned Large Language Models to converse with hundreds of thousands of victims across WhatsApp, Tinder, and LinkedIn simultaneously. The AI builds trust over weeks before introducing a rigged crypto trading platform.",
    indicators: [
      "Initial contact begins as an alleged 'wrong number' text that turns friendly",
      "Profile photo is an attractive, wealthy entrepreneur or model",
      "Gradual pivot to 'guaranteed daily yield' or 'inside trading signals'",
      "Victims can withdraw small amounts initially, but large balances are locked with demands for 'tax payments'"
    ],
    countermeasures: "Never invest on platforms suggested by online acquaintances. Check domain registration age on WHOIS — scam trading sites are usually under 90 days old.",
    caseStudy: "Victims persuaded to stake life savings into fake Web3 decentralized finance apps displaying fabricated profit dashboards."
  },
  {
    id: "quishing-qr",
    title: "AI-Generated QR Phishing ('Quishing')",
    category: "phishing",
    categoryName: "Evasive Phishing",
    severity: "HIGH",
    severityColor: "#F59E0B",
    impact: "Bypasses 84% of traditional corporate email gateways",
    summary: "Because modern email security filters inspect hyperlinks and text attachments, attackers embed obfuscated QR codes generated with AI aesthetic designs. The victim scans the QR code on their mobile device, moving them off corporate security controls.",
    indicators: [
      "Email alerts regarding mandatory 2FA reset, HR survey, or urgent parcel delivery",
      "No clickable links; instead, an embedded image with a high-contrast QR code",
      "Directs to a spoofed Microsoft 365, Google Workspace, or Okta login portal",
      "Immediate session hijacking using token-stealing adversary-in-the-middle (AiTM) kits"
    ],
    countermeasures: "Never scan QR codes from unexpected emails or paper flyers. Use mobile QR scanners that preview destination domains and SSL certificates.",
    caseStudy: "Spike in fake parking meter QR stickers and corporate MFA re-enrollment email scams targeting corporate executives."
  },
  {
    id: "fake-ai-software",
    title: "Malicious Fake AI Software & Browser Extensions",
    category: "malware",
    categoryName: "Fake AI Utilities",
    severity: "HIGH",
    severityColor: "#F59E0B",
    impact: "Info-stealers (RedLine, LummaC2) harvesting browser cookies and crypto wallets",
    summary: "Threat actors purchase sponsored Google Search and Facebook Ads for fake tools like 'ChatGPT-5 Desktop Beta', 'Midjourney v7 Free', or 'Sora Video Generator'. Downloading the installer deploys info-stealers that harvest session tokens.",
    indicators: [
      "Sponsored Google Ads ranking above organic official domains",
      "Executable or zip files hosted on Discord CDN, Mega, or GitHub releases",
      "Executable asks for Administrator rights or bypass of Windows Defender SmartScreen",
      "Browser suddenly logs you out of Google, Discord, Telegram, or crypto exchanges"
    ],
    countermeasures: "Only download AI utilities from official domains (openai.com, anthropic.com). Verify SHA256 checksums and keep real-time behavioral antivirus active.",
    caseStudy: "Over 500,000 users infected through deceptive Facebook ads promoting a desktop version of generative AI video tools."
  },
  {
    id: "deepfake-kyc",
    title: "Synthetic KYC Bypass & Credit Fraud",
    category: "deepfake",
    categoryName: "Identity Fraud",
    severity: "CRITICAL",
    severityColor: "#EF4444",
    impact: "Identity theft and unauthorized credit lines",
    summary: "Fraud rings create synthetic digital identities combining real leaked SSNs with AI-rendered faces that pass automated webcam liveness checks to open fraudulent bank accounts and take out fast loans.",
    indicators: [
      "Unexplained inquiries appearing on your Equifax, Experian, or TransUnion credit report",
      "Letters from fintech banks or buy-now-pay-later (BNPL) services for accounts you never created",
      "Sudden phone service disruption due to unauthorized eSIM / SIM swapping"
    ],
    countermeasures: "Freeze your credit files permanently with all three major credit bureaus. Use dedicated identity theft monitoring with dark web credential alerts.",
    caseStudy: "Fintech lenders hit with millions in default loans originated through real-time generative video injection feeds."
  }
];

// Presets for the Interactive Scam Text Analyzer
window.ANALYZER_PRESETS = [
  {
    name: "AI Voice Bail Scam (SMS/Email)",
    sample: "Dad, it's Michael. I'm in huge trouble. I got into an accident in another city and my phone broke. The police officer is letting me use his device. Please don't tell mom right now, she'll panic. They need $4,200 for bail processing immediately before I get transferred to county jail. Send it via Bitcoin ATM to bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh or wire to this account. Call me on this number right now before they take me in."
  },
  {
    name: "Pig Butchering Crypto DM",
    sample: "Hi David! Are you still in Singapore? Oh I'm so sorry, I think my assistant gave me the wrong number. You seem like a very polite gentleman though! By the way, I run a fashion brand and also invest in AI decentralized liquidity arbitrage. My uncle works at Goldman Sachs and gives me verified trading signals with 18% guaranteed weekly return. Here is the private platform: https://defi-quant-goldman-trading.top/invite?code=88392"
  },
  {
    name: "Urgent CEO Wire Request (Agentic BEC)",
    sample: "Hi Sarah, I am currently boarding an international flight to Tokyo for the acquisition closing and cannot take calls. We need an urgent vendor settlement processed before 5:00 PM EST today for the merger due diligence, otherwise we risk a breach penalty. Please wire $68,500 to our external counsel's updated escrow account attached below. Keep this strictly confidential under our non-disclosure terms until the public press release tomorrow morning."
  },
  {
    name: "SunPass Toll Smishing (SMS)",
    sample: "SunPass Alert: You have an unpaid toll of $3.25. Pay now to avoid additional fees: https://sunpass-service-pay.top/invoice"
  },
  {
    name: "Legitimate Corporate Newsletter (Safe Sample)",
    sample: "Hi Team, Welcome to our monthly engineering newsletter. In this edition, we review our quarterly product metrics, highlight new team members joining our DevOps department, and summarize our upcoming internal hackathon scheduled for November 15th. You can review the agenda on the company Confluence wiki at your convenience. Have a great week!"
  }
];

// Interactive Quiz Questions
window.QUIZ_QUESTIONS = [
  {
    question: "You receive an urgent phone call. The voice sounds 100% identical to your son, crying and claiming he is arrested after a car crash and needs $5,000 bail sent right now. What is the safest first action?",
    options: [
      { text: "Immediately ask for their crypto wallet address or Zelle info to help quickly.", correct: false, explanation: "Never send money during an emotional emergency call. Scammers rely on panic to bypass rational thinking." },
      { text: "Hang up immediately, ask for our agreed family safe word, or call your son back directly on his saved phone number.", correct: true, explanation: "Correct! With 3 seconds of audio, AI can clone any voice. Out-of-band verification via a known number or an offline family safe word is the only foolproof defense." },
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
