// content-email-banner.js
// Injects a banner showing the current 'from' email address on supported webmail sites


function getSenderAddress() {
  // Gmail
  if (window.location.hostname.includes('mail.google.com')) {
    // Try multiple selectors for sender
    let sender = null;
    // 1. Opened email header (new Gmail)
    const header = document.querySelector('div[data-header-id]');
    if (header) {
      const senderSpan = header.querySelector('span[email]');
      if (senderSpan && senderSpan.getAttribute('email')) {
        sender = senderSpan.getAttribute('email');
        console.log('[Copilot Extension] Gmail sender found via span[email]:', sender);
      }
    }
    // 2. Fallback: span.gD (old Gmail)
    if (!sender) {
      const fallback = document.querySelector('span.gD');
      if (fallback && fallback.getAttribute('email')) {
        sender = fallback.getAttribute('email');
        console.log('[Copilot Extension] Gmail sender found via span.gD[email]:', sender);
      } else if (fallback && fallback.textContent.includes('@')) {
        sender = fallback.textContent.trim();
        console.log('[Copilot Extension] Gmail sender found via span.gD text:', sender);
      }
    }
    // 3. Try address in opened message details
    if (!sender) {
      const details = document.querySelector('span[email]');
      if (details && details.getAttribute('email')) {
        sender = details.getAttribute('email');
        console.log('[Copilot Extension] Gmail sender found via details span[email]:', sender);
      }
    }
    if (!sender) console.warn('[Copilot Extension] Gmail sender not found');
    return sender;
  }
  // Outlook
  if (window.location.hostname.includes('outlook.live.com')) {
    let sender = null;
    const readingPane = document.querySelector('span._3YeAx');
    if (readingPane && readingPane.textContent.includes('@')) {
      sender = readingPane.textContent.trim();
      console.log('[Copilot Extension] Outlook sender found via span._3YeAx:', sender);
    }
    if (!sender) {
      const senderFallback = document.querySelector('span[title*="@"]');
      if (senderFallback) {
        sender = senderFallback.textContent.trim();
        console.log('[Copilot Extension] Outlook sender found via span[title*="@"]:', sender);
      }
    }
    if (!sender) console.warn('[Copilot Extension] Outlook sender not found');
    return sender;
  }
  // Yahoo
  if (window.location.hostname.includes('mail.yahoo.com')) {
    let sender = null;
    const mainSender = document.querySelector('span[data-test-id="message-view-sender"]');
    if (mainSender && mainSender.textContent.includes('@')) {
      sender = mainSender.textContent.trim();
      console.log('[Copilot Extension] Yahoo sender found via message-view-sender:', sender);
    }
    if (!sender) {
      const senderFallback = document.querySelector('span[data-test-id="message-sender-email"]');
      if (senderFallback && senderFallback.textContent.includes('@')) {
        sender = senderFallback.textContent.trim();
        console.log('[Copilot Extension] Yahoo sender found via message-sender-email:', sender);
      }
    }
    if (!sender) console.warn('[Copilot Extension] Yahoo sender not found');
    return sender;
  }
  // ProtonMail
  if (window.location.hostname.includes('mail.proton.me')) {
    let sender = null;
    const senderSpan = document.querySelector('span[data-testid="message-sender-email"]');
    if (senderSpan && senderSpan.textContent.includes('@')) {
      sender = senderSpan.textContent.trim();
      console.log('[Copilot Extension] ProtonMail sender found:', sender);
    }
    if (!sender) console.warn('[Copilot Extension] ProtonMail sender not found');
    return sender;
  }
  // Zoho Mail
  if (window.location.hostname.includes('mail.zoho.com')) {
    let sender = null;
    const senderSpan = document.querySelector('span.zmSenderEmail');
    if (senderSpan && senderSpan.textContent.includes('@')) {
      sender = senderSpan.textContent.trim();
      console.log('[Copilot Extension] Zoho sender found:', sender);
    }
    if (!sender) console.warn('[Copilot Extension] Zoho sender not found');
    return sender;
  }
  console.warn('[Copilot Extension] Sender not found for this webmail');
  return null;
}


function injectBanner(email) {
  if (!email) return;
  if (document.getElementById('copilot-email-banner')) return;
  const banner = document.createElement('div');
  banner.id = 'copilot-email-banner';
  banner.textContent = `Sender: ${email}`;
  banner.style.position = 'fixed';
  banner.style.top = '0';
  banner.style.left = '0';
  banner.style.width = '100%';
  banner.style.background = '#2563eb';
  banner.style.color = '#fff';
  banner.style.fontSize = '1.15em';
  banner.style.fontWeight = 'bold';
  banner.style.padding = '10px 0';
  banner.style.zIndex = '9999';
  banner.style.textAlign = 'center';
  banner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  document.body.appendChild(banner);
}



function tryInject() {
  const email = getSenderAddress();
  const oldBanner = document.getElementById('copilot-email-banner');
  if (email) {
    if (oldBanner) oldBanner.remove();
    injectBanner(email);
  } else {
    if (oldBanner) oldBanner.remove();
  }
}


// Throttle tryInject to avoid excessive DOM queries

let injectTimeout = null;
let KNOWN_GOOD_SENDERS = [];

function loadKnownGoodSenders(callback) {
  fetch('https://raw.githubusercontent.com/yourusername/yourrepo/main/known_good_senders.json')
    .then(response => response.json())
    .then(json => {
      KNOWN_GOOD_SENDERS = json;
      if (callback) callback();
    })
    .catch(err => {
      console.error('[Copilot Extension] Failed to load known_good_senders.json from GitHub:', err);
      KNOWN_GOOD_SENDERS = [];
      if (callback) callback();
    });
}

function getEmailSubject() {
  // Gmail
  if (window.location.hostname.includes('mail.google.com')) {
    let subject = null;
    const subjectH2 = document.querySelector('h2.hP');
    if (subjectH2) {
      subject = subjectH2.textContent.trim();
      console.log('[Copilot Extension] Gmail subject found via h2.hP:', subject);
    }
    // Try fallback selector for subject
    if (!subject) {
      const subjectDiv = document.querySelector('div.ajA');
      if (subjectDiv) {
        subject = subjectDiv.textContent.trim();
        console.log('[Copilot Extension] Gmail subject found via div.ajA:', subject);
      }
    }
    if (!subject) console.warn('[Copilot Extension] Gmail subject not found');
    return subject || '';
  }
  // Outlook
  if (window.location.hostname.includes('outlook.live.com')) {
    let subject = null;
    const subjectDiv = document.querySelector('div._3KxvI');
    if (subjectDiv) {
      subject = subjectDiv.textContent.trim();
      console.log('[Copilot Extension] Outlook subject found via div._3KxvI:', subject);
    }
    if (!subject) {
      const subjectFallback = document.querySelector('div[role="heading"]');
      if (subjectFallback) {
        subject = subjectFallback.textContent.trim();
        console.log('[Copilot Extension] Outlook subject found via div[role="heading"]:', subject);
      }
    }
    if (!subject) console.warn('[Copilot Extension] Outlook subject not found');
    return subject || '';
  }
  // Yahoo
  if (window.location.hostname.includes('mail.yahoo.com')) {
    let subject = null;
    const subjectH1 = document.querySelector('h1[data-test-id="message-view-subject"]');
    if (subjectH1) {
      subject = subjectH1.textContent.trim();
      console.log('[Copilot Extension] Yahoo subject found via message-view-subject:', subject);
    }
    if (!subject) {
      const subjectFallback = document.querySelector('span[data-test-id="message-subject"]');
      if (subjectFallback) {
        subject = subjectFallback.textContent.trim();
        console.log('[Copilot Extension] Yahoo subject found via message-subject:', subject);
      }
    }
    if (!subject) console.warn('[Copilot Extension] Yahoo subject not found');
    return subject || '';
  }
  // ProtonMail
  if (window.location.hostname.includes('mail.proton.me')) {
    let subject = null;
    const subjectH2 = document.querySelector('h2[data-testid="message-subject"]');
    if (subjectH2) {
      subject = subjectH2.textContent.trim();
      console.log('[Copilot Extension] ProtonMail subject found:', subject);
    }
    if (!subject) console.warn('[Copilot Extension] ProtonMail subject not found');
    return subject || '';
  }
  // Zoho Mail
  if (window.location.hostname.includes('mail.zoho.com')) {
    let subject = null;
    const subjectSpan = document.querySelector('span.zmSub');
    if (subjectSpan) {
      subject = subjectSpan.textContent.trim();
      console.log('[Copilot Extension] Zoho subject found:', subject);
    }
    if (!subject) console.warn('[Copilot Extension] Zoho subject not found');
    return subject || '';
  }
  console.warn('[Copilot Extension] Subject not found for this webmail');
  return '';
}


function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function checkSenderWarning(sender, subject) {
  console.log('[Copilot Extension] Checking sender warning:', { sender, subject });
  if (!sender || !subject) return null;
  const normSubject = normalize(subject);
  for (const entry of KNOWN_GOOD_SENDERS) {
    const normCompany = normalize(entry.company);
    if (normSubject.includes(normCompany)) {
      // Only return null if sender matches the email for this company
      if (sender.trim().toLowerCase() === entry.email.trim().toLowerCase()) {
        console.log(`[Copilot Extension] Sender matches known good for ${entry.company}:`, sender);
        return null;
      } else {
        console.warn(`[Copilot Extension] WARNING: Sender does not match known good for ${entry.company}. Sender: ${sender}, Expected: ${entry.email}`);
        return `Warning: This email claims to be from ${entry.company}, but the sender address (${sender}) does not match the known good address (${entry.email}).`;
      }
    }
  }
  return null;
}

function injectBanner(email, warning) {
  if (warning) {
    console.warn('[Copilot Extension] Injecting warning banner:', warning);
  } else if (email) {
    console.log('[Copilot Extension] Injecting sender banner:', email);
  }
  if (!email && !warning) return;
  if (document.getElementById('copilot-email-banner')) document.getElementById('copilot-email-banner').remove();
  const banner = document.createElement('div');
  banner.id = 'copilot-email-banner';
  banner.style.position = 'fixed';
  banner.style.top = '0';
  banner.style.left = '0';
  banner.style.width = '100%';
  banner.style.background = warning ? '#b91c1c' : '#2563eb';
  banner.style.color = '#fff';
  banner.style.fontSize = '1.15em';
  banner.style.fontWeight = 'bold';
  banner.style.padding = '10px 0';
  banner.style.zIndex = '9999';
  banner.style.textAlign = 'center';
  banner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  banner.textContent = warning ? warning : `Sender: ${email}`;
  document.body.appendChild(banner);
}

// Only run the sender/subject check and banner injection once per page load
let bannerInjected = false;

function tryInjectOnce() {
  if (bannerInjected) return;
  console.log('[Copilot Extension] Running tryInjectOnce');
  const sender = getSenderAddress();
  const subject = getEmailSubject();
  console.log('[Copilot Extension] Extracted sender:', sender);
  console.log('[Copilot Extension] Extracted subject:', subject);
  const warning = checkSenderWarning(sender, subject);
  if (sender || warning) {
    injectBanner(sender, warning);
    bannerInjected = true;
  } else {
    const oldBanner = document.getElementById('copilot-email-banner');
    if (oldBanner) oldBanner.remove();
  }
}

// Only run the sender/subject check and banner injection once per email view
let lastSender = null;
let lastSubject = null;

function tryInjectOnChange() {
  const sender = getSenderAddress();
  const subject = getEmailSubject();
  // Only update banner if sender or subject has changed
  if (sender !== lastSender || subject !== lastSubject) {
    console.log('[Copilot Extension] Email or subject changed, updating banner');
    const warning = checkSenderWarning(sender, subject);
    if (sender || warning) {
      injectBanner(sender, warning);
    } else {
      const oldBanner = document.getElementById('copilot-email-banner');
      if (oldBanner) oldBanner.remove();
    }
    lastSender = sender;
    lastSubject = subject;
  } else {
    console.log('[Copilot Extension] Sender and subject unchanged, not updating banner');
  }
}

function throttledInject() {
  if (injectTimeout) clearTimeout(injectTimeout);
  injectTimeout = setTimeout(() => {
    tryInjectOnChange();
  }, 300);
}

loadKnownGoodSenders(() => {
  tryInjectOnChange();
  const observer = new MutationObserver(throttledInject);
  observer.observe(document.body, { childList: true, subtree: true });
});
