// Extracts the body text of the currently opened email for all providers
function getEmailBody() {
  let bodyText = '';
  if (window.location.hostname.includes('mail.google.com')) {
    const bodyDiv = document.querySelector('div.a3s');
    if (bodyDiv) bodyText = bodyDiv.textContent || '';
  } else if (window.location.hostname.includes('outlook.live.com')) {
    const readingPane = document.getElementById('Skip to message-region');
    if (readingPane) {
      const bodySpan = readingPane.querySelector('div[role="document"]');
      if (bodySpan) bodyText = bodySpan.textContent || '';
    }
  } else if (window.location.hostname.includes('mail.yahoo.com')) {
    const bodyDiv = document.querySelector('div[data-test-id="message-view-body"]');
    if (bodyDiv) bodyText = bodyDiv.textContent || '';
  } else if (window.location.hostname.includes('mail.proton.me')) {
    const bodyDiv = document.querySelector('div[data-testid="message-body"]');
    if (bodyDiv) bodyText = bodyDiv.textContent || '';
  } else if (window.location.hostname.includes('mail.zoho.com')) {
    const bodyDiv = document.querySelector('div.zmMsgView');
    if (bodyDiv) bodyText = bodyDiv.textContent || '';
  }
  return bodyText;
}
// src/content/emailBanner.js
// Injects a banner showing the current 'from' email address on supported webmail sites

function getSenderAddress() {
  // Gmail
  if (window.location.hostname.includes('mail.google.com')) {
    let gmailSender = null;
    const header = document.querySelector('div[data-header-id]');
    if (header) {
      const senderSpan = header.querySelector('span[email]');
      if (senderSpan && senderSpan.getAttribute('email')) {
        gmailSender = senderSpan.getAttribute('email');
        console.log('[ScamBlocker] Gmail sender found via span[email]:', gmailSender);
      }
    }
    if (!gmailSender) {
      const fallback = document.querySelector('span.gD');
      if (fallback && fallback.getAttribute('email')) {
        gmailSender = fallback.getAttribute('email');
        console.log('[ScamBlocker] Gmail sender found via span.gD[email]:', gmailSender);
      } else if (fallback && fallback.textContent.includes('@')) {
        gmailSender = fallback.textContent.trim();
        console.log('[ScamBlocker] Gmail sender found via span.gD text:', gmailSender);
      }
    }
    if (!gmailSender) {
      const details = document.querySelector('span[email]');
      if (details && details.getAttribute('email')) {
        gmailSender = details.getAttribute('email');
        console.log('[ScamBlocker] Gmail sender found via details span[email]:', gmailSender);
      }
    }
    if (!gmailSender) console.warn('[ScamBlocker] Gmail sender not found');
    return gmailSender;
  }
  // Outlook
  if (window.location.hostname.includes('outlook.live.com')) {
    let outlookSender = null;
    const readingPane = document.getElementById('Skip to message-region');
    if (readingPane) {
      const span = readingPane.querySelector('span.OZZZK');
      if (span) {
        const match = span.textContent.match(/<([^>]+)>/);
        if (match) {
          outlookSender = match[1].trim();
          console.log('[ScamBlocker] Outlook sender found via span.OZZZK:', outlookSender);
        } else {
          const text = span.textContent.trim();
          if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text)) {
            outlookSender = text;
            console.log('[ScamBlocker] Outlook sender found as email address in span.OZZZK:', outlookSender);
          } else {
            console.warn('[ScamBlocker] Could not extract sender from span.OZZZK:', span.textContent);
          }
        }
      } else {
        console.warn('[ScamBlocker] No span.OZZZK found for sender extraction');
      }
    }
    if (!outlookSender) console.warn('[ScamBlocker] Outlook sender not found');
    return outlookSender;
  }
  // Yahoo
  if (window.location.hostname.includes('mail.yahoo.com')) {
    let yahooSender = null;
    const mainSender = document.querySelector('span[data-test-id="message-view-sender"]');
    if (mainSender && mainSender.textContent.includes('@')) {
      yahooSender = mainSender.textContent.trim();
      console.log('[ScamBlocker] Yahoo sender found via message-view-sender:', yahooSender);
    }
    if (!yahooSender) {
      const senderFallback = document.querySelector('span[data-test-id="message-sender-email"]');
      if (senderFallback && senderFallback.textContent.includes('@')) {
        yahooSender = senderFallback.textContent.trim();
        console.log('[ScamBlocker] Yahoo sender found via message-sender-email:', yahooSender);
      }
    }
    if (!yahooSender) console.warn('[ScamBlocker] Yahoo sender not found');
    return yahooSender;
  }
  // ProtonMail
  if (window.location.hostname.includes('mail.proton.me')) {
    let protonSender = null;
    const senderSpan = document.querySelector('span[data-testid="message-sender-email"]');
    if (senderSpan && senderSpan.textContent.includes('@')) {
      protonSender = senderSpan.textContent.trim();
      console.log('[ScamBlocker] ProtonMail sender found:', protonSender);
    }
    if (!protonSender) console.warn('[ScamBlocker] ProtonMail sender not found');
    return protonSender;
  }
  // Zoho Mail
  if (window.location.hostname.includes('mail.zoho.com')) {
    let zohoSender = null;
    const senderSpan = document.querySelector('span.zmSenderEmail');
    if (senderSpan && senderSpan.textContent.includes('@')) {
      zohoSender = senderSpan.textContent.trim();
      console.log('[ScamBlocker] Zoho sender found:', zohoSender);
    }
    if (!zohoSender) console.warn('[ScamBlocker] Zoho sender not found');
    return zohoSender;
  }
  console.warn('[ScamBlocker] Sender not found for this webmail');
  return null;
}

      console.log('[ScamBlocker] Warning banner injected inside email box:', emailBox);
function injectBanner(email) {
      console.warn('[ScamBlocker] Email box element not found. Warning banner not injected.');
  if (document.getElementById('copilot-email-banner')) return;
      console.log('[ScamBlocker] Warning banner injected inside email box:', emailBox);
  banner.id = 'copilot-email-banner';
      console.warn('[ScamBlocker] Email box element not found. Warning banner not injected.');
  banner.style.position = 'fixed';
      console.log('[ScamBlocker] Warning banner injected inside email box:', emailBox);
  banner.style.left = '0';
      console.warn('[ScamBlocker] Email box element not found. Warning banner not injected.');
  banner.style.background = '#2563eb';
      console.log('[ScamBlocker] Warning banner injected inside email box:', emailBox);
  banner.style.fontSize = '1.15em';
      console.warn('[ScamBlocker] Email box element not found. Warning banner not injected.');
  banner.style.padding = '10px 0';
  console.log('[ScamBlocker] Running tryInjectOnce');
  banner.style.textAlign = 'center';
  console.log('[ScamBlocker] Extracted sender:', sender);
  document.body.appendChild(banner);
  console.log('[ScamBlocker] Extracted subject:', subject);

    console.log('[ScamBlocker] Email or subject changed, updating banner');

    console.log('[ScamBlocker] Sender and subject unchanged, not updating banner');
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
  fetch('https://raw.githubusercontent.com/Miyso/ScamBlocker/main/src/data/knownGoodSenders.json')
    .then(response => response.json())
    .then(json => {
      KNOWN_GOOD_SENDERS = json;
      if (callback) callback();
    })
    .catch(err => {
      console.error('[Copilot Extension] Failed to load src/data/knownGoodSenders.json from GitHub:', err);
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
    // Only scan for subject in the currently opened/focused email inside the reading pane region
    const readingPane = document.getElementById('Skip to message-region');
    if (readingPane) {
      // Find the first span.OZZZK inside the reading pane
      const span = readingPane.querySelector('span.OZZZK');
      if (span) {
        // If format is PayPal<service@paypal.com>
        const match = span.textContent.match(/^([^<]+)/);
        if (match && match[1].trim()) {
          subject = match[1].trim();
          console.log('[Copilot Extension] Outlook subject found via span.OZZZK:', subject);
        } else {
          // If no <...>, check if text looks like an email address
          const text = span.textContent.trim();
          if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text)) {
            subject = text;
            console.log('[Copilot Extension] Outlook subject found as email address in span.OZZZK:', subject);
          } else {
            console.warn('[Copilot Extension] Could not extract subject from span.OZZZK:', span.textContent);
          }
        }
      } else {
        console.warn('[Copilot Extension] No span.OZZZK found for subject extraction');
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


let showSenderBanner = false;
let scanSubjectForImpersonation = true;
let scanBodyForImpersonation = false;

chrome.storage.sync.get([
  'showSenderBanner',
  'scanSubjectForImpersonation',
  'scanBodyForImpersonation'
], (result) => {
  showSenderBanner = result.showSenderBanner !== false;
  scanSubjectForImpersonation = !!result.scanSubjectForImpersonation;
  scanBodyForImpersonation = !!result.scanBodyForImpersonation;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    if (changes.showSenderBanner) showSenderBanner = changes.showSenderBanner.newValue !== false;
    if (changes.scanSubjectForImpersonation) scanSubjectForImpersonation = !!changes.scanSubjectForImpersonation.newValue;
    if (changes.scanBodyForImpersonation) scanBodyForImpersonation = !!changes.scanBodyForImpersonation.newValue;
  }
});

function checkSenderWarning(sender, subject) {
  console.log('[Copilot Extension] Checking sender warning:', { sender, subject });
  if (!sender || !subject) return null;
  let warning = null;
  const normSubject = normalize(subject);
  let normBody = '';
  if (scanBodyForImpersonation) {
    const bodyText = getEmailBody();
    normBody = normalize(bodyText);
  }
  for (const entry of KNOWN_GOOD_SENDERS) {
    const normCompany = normalize(entry.company);
    const normEmail = normalize(entry.email);
    // Scan subject for impersonation attempts
    if (scanSubjectForImpersonation && normSubject.includes(normCompany)) {
      if (sender.trim().toLowerCase() === entry.email.trim().toLowerCase()) {
        console.log(`[Copilot Extension] Sender matches known good for ${entry.company}:`, sender);
        warning = null;
      } else {
        console.warn(`[Copilot Extension] WARNING: Sender does not match known good for ${entry.company}. Sender: ${sender}, Expected: ${entry.email}`);
        warning = `Warning: This email claims to be from ${entry.company}, but the sender address (${sender}) does not match the known good address (${entry.email}).`;
      }
    }
    // Scan body for impersonation attempts (only if enabled)
    if (scanBodyForImpersonation && (normBody.includes(normCompany) || normBody.includes(normEmail))) {
      if (sender.trim().toLowerCase() !== entry.email.trim().toLowerCase()) {
        console.warn(`[Copilot Extension] WARNING: Email body mentions ${entry.company} or ${entry.email}, but sender does not match. Sender: ${sender}, Expected: ${entry.email}`);
        warning = `Warning: This email body mentions ${entry.company} or ${entry.email}, but the sender address (${sender}) does not match the known good address (${entry.email}).`;
      }
    }
  }
  return warning;
}


function injectBanner(email, warning) {
  // Only show sender banner if enabled
  if (!showSenderBanner) return;
  if (!warning) return;
  console.warn('[Copilot Extension] Injecting warning banner:', warning);
  // Remove any existing banner
  const oldBanner = document.getElementById('copilot-email-banner');
  if (oldBanner) oldBanner.remove();

  // Create warning banner only
  const banner = document.createElement('div');
  banner.id = 'copilot-email-banner';
  banner.style.background = 'linear-gradient(90deg,#b91c1c 0%,#ef4444 100%)';
  banner.style.color = '#fff';
  banner.style.fontSize = '1.08em';
  banner.style.fontWeight = 'bold';
  banner.style.padding = '4px 0';
  banner.style.borderRadius = '8px';
  banner.style.margin = '0 0 12px 0';
  banner.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
  banner.style.textAlign = 'center';
  banner.style.letterSpacing = '0.5px';
  banner.style.border = '2px solid #991b1b';
  banner.style.zIndex = '2147483647';
  banner.textContent = warning;

  // Try to inject banner inside the main email box/container
  let emailBox = null;
  if (window.location.hostname.includes('mail.google.com')) {
    emailBox = document.querySelector('div[role="main"]');
    if (emailBox) {
      emailBox.insertBefore(banner, emailBox.firstChild);
      banner.style.position = 'relative';
      banner.style.width = '95%';
      banner.style.margin = '8px auto';
      banner.style.marginBottom = '8px';
      banner.style.zIndex = '2147483647';
      console.log('[Copilot Extension] Warning banner injected inside email box:', emailBox);
    } else {
      console.warn('[Copilot Extension] Email box element not found. Warning banner not injected.');
    }
  } else if (window.location.hostname.includes('outlook.live.com')) {
    // Insert banner inside the wide-content-host div for the message region
    const wideContent = document.querySelector('div.wide-content-host');
    if (wideContent) {
      const wrapper = document.createElement('div');
      wrapper.style.width = '100%';
      wrapper.style.display = 'block';
      wrapper.appendChild(banner);
      wideContent.insertBefore(wrapper, wideContent.firstChild);
      banner.style.position = 'relative';
      banner.style.width = '95%';
      banner.style.margin = '8px auto';
      banner.style.marginBottom = '8px';
      banner.style.zIndex = '2147483647';
      console.log('[Copilot Extension] Warning banner injected inside wide-content-host container:', wideContent);
    } else {
      console.warn('[Copilot Extension] wide-content-host container not found. Warning banner not injected.');
    }
  } else if (window.location.hostname.includes('mail.yahoo.com')) {
    emailBox = document.querySelector('div[data-test-id="message-view-body"]') || document.querySelector('div[data-test-id="message-view"]');
    if (emailBox) {
      emailBox.insertBefore(banner, emailBox.firstChild);
      banner.style.position = 'relative';
      banner.style.width = '95%';
      banner.style.margin = '8px auto';
      banner.style.marginBottom = '8px';
      banner.style.zIndex = '2147483647';
      console.log('[Copilot Extension] Warning banner injected inside email box:', emailBox);
    } else {
      console.warn('[Copilot Extension] Email box element not found. Warning banner not injected.');
    }
  } else if (window.location.hostname.includes('mail.proton.me')) {
    emailBox = document.querySelector('main') || document.querySelector('div[role="main"]');
    if (emailBox) {
      emailBox.insertBefore(banner, emailBox.firstChild);
      banner.style.position = 'relative';
      banner.style.width = '95%';
      banner.style.margin = '8px auto';
      banner.style.marginBottom = '8px';
      banner.style.zIndex = '2147483647';
      console.log('[Copilot Extension] Warning banner injected inside email box:', emailBox);
    } else {
      console.warn('[Copilot Extension] Email box element not found. Warning banner not injected.');
    }
  } else if (window.location.hostname.includes('mail.zoho.com')) {
    emailBox = document.querySelector('div.zmMsgView') || document.querySelector('div[role="main"]');
    if (emailBox) {
      emailBox.insertBefore(banner, emailBox.firstChild);
      banner.style.position = 'relative';
      banner.style.width = '95%';
      banner.style.margin = '8px auto';
      banner.style.marginBottom = '8px';
      banner.style.zIndex = '2147483647';
      console.log('[Copilot Extension] Warning banner injected inside email box:', emailBox);
    } else {
      console.warn('[Copilot Extension] Email box element not found. Warning banner not injected.');
    }
  }
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
  // Always search for the reading pane div before checking sender/subject
  if (window.location.hostname.includes('outlook.live.com')) {
    document.getElementById('Skip to message-region');
  }
  const sender = getSenderAddress();
  const subject = getEmailSubject();
  // Only update banner if sender or subject has changed
  if (sender !== lastSender || subject !== lastSubject) {
    console.log('[Copilot Extension] Email or subject changed, updating banner');
    const warning = checkSenderWarning(sender, subject);
    if (warning) {
      injectBanner(sender, warning);
    } else {
      // Only remove banner if there is no warning for the current email
      const oldBanner = document.getElementById('copilot-email-banner');
      if (oldBanner) oldBanner.remove();
    }
    lastSender = sender;
    lastSubject = subject;
  } else {
    // If the banner exists and warning is still valid, do nothing (persist banner)
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
