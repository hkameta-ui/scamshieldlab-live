/**
 * ScamShield AI - Monetization & Site Configuration
 * 
 * Replace the placeholders below with your personal Google AdSense ID
 * and affiliate referral links to start generating income immediately.
 */

window.SITE_CONFIG = {
  siteName: "ScamShield Lab",
  siteUrl: "https://scamshieldlab.com",
  supportEmail: "security@scamshieldlab.com",

  // --- GOOGLE ADSENSE MONETIZATION SETTINGS ---
  adsense: {
    enabled: true, // Set to true when your AdSense account is approved
    publisherId: "ca-pub-7565560894775775", // Google AdSense Publisher ID
    slots: {
      headerBanner: "1234567890",      // Responsive Top Leaderboard
      inContentRect: "2345678901",      // In-Article 300x250 or Responsive
      sidebarSticky: "3456789012",      // High-CTR Sticky Sidebar Banner
      footerBanner: "4567890123"        // Bottom Anchor / Footer Banner
    }
  },

  // --- CYBERSECURITY AFFILIATE MONETIZATION (HIGH PAYOUT COMMISSIONS) ---
  // Replace these with your referral URLs from CJ Affiliate, ShareASale, Impact, or direct partner programs
  affiliates: {
    identityTheft: {
      name: "Aura Identity Theft Protection",
      tagline: "$1,000,000 Identity Theft Insurance & Dark Web Monitoring",
      payoutEst: "$50 - $80 per signup",
      url: "https://aura.com/?ref=scamshield", // Replace with your affiliate tracking link
      badge: "Top Pick 2026",
      cta: "Claim 14-Day Free Trial"
    },
    passwordManager: {
      name: "NordPass Premium & Passkey Vault",
      tagline: "Prevent Phishing & Credential Theft with Zero-Knowledge Passkeys",
      payoutEst: "30% - 100% Commission",
      url: "https://go.nordpass.io/aff_c?offer_id=488&aff_id=159036&url_id=9356", // Verified Nord Partner Link (Affiliate ID: 159036)
      badge: "Essential Defense",
      cta: "Protect Passwords & Passkeys"
    },
    endpointSecurity: {
      name: "Malwarebytes Premium & Anti-Exploit",
      tagline: "Real-time AI behavioral detection against ransomware & zero-days",
      payoutEst: "$25 - $45 per purchase",
      url: "https://malwarebytes.com/?ref=scamshield", // Replace with your affiliate tracking link
      badge: "Real-Time Shield",
      cta: "Download Free Scanner"
    },
    vpnPrivacy: {
      name: "NordVPN Threat Protection Pro",
      tagline: "Block malicious scam domains & encrypt DNS queries automatically",
      payoutEst: "40% - 100% Commission",
      url: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=159036&url_id=902", // Verified Nord Partner Link (Affiliate ID: 159036)
      badge: "Verified Partner",
      cta: "Get Secure VPN (68% Off)"
    }
  }
};
