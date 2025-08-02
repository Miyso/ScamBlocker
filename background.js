

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');
  // Initialize blocked URLs list if not present
  chrome.storage.sync.get(['blockedUrls'], (result) => {
    if (!result.blockedUrls) {
      chrome.storage.sync.set({ blockedUrls: [] });
    }
  });
});

// Open settings page when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
});




let DEFAULT_BAD_URLS = [];

function loadDefaultBadUrls(callback) {
  fetch('https://raw.githubusercontent.com/Miyso/ScamBlocker/main/default_bad_urls.json')
    .then(response => response.json())
    .then(json => {
      DEFAULT_BAD_URLS = json;
      if (callback) callback();
    })
    .catch(err => {
      console.error('[ScamBlocker] Failed to load default_bad_urls.json from GitHub:', err);
      DEFAULT_BAD_URLS = [];
      if (callback) callback();
    });
}



function updateBlockedRules() {
  chrome.storage.sync.get(['blockedUrls', 'defaultBlockedEnabled'], (result) => {
    const userBlocked = result.blockedUrls || [];
    const defaultEnabled = result.defaultBlockedEnabled !== false;
    const blocked = defaultEnabled
      ? Array.from(new Set([...DEFAULT_BAD_URLS, ...userBlocked]))
      : Array.from(new Set([...userBlocked]));
    const maxRules = 100;
    const rules = blocked.map((pattern, i) => {
      let urlFilter = pattern.replace(/\*/g, '*');
      return {
        id: i + 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            url: chrome.runtime.getURL('pages/blocked.html')
          }
        },
        condition: { urlFilter, resourceTypes: ["main_frame"] }
      };
    });
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({length: maxRules}, (_, i) => i + 1),
      addRules: rules
    });
  });
}


// Update rules on install and when blockedUrls change
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');
  chrome.storage.sync.get(['blockedUrls'], (result) => {
    if (!result.blockedUrls) {
      chrome.storage.sync.set({ blockedUrls: [] });
    }
    loadDefaultBadUrls(updateBlockedRules);
  });
});



chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && (changes.blockedUrls || changes.defaultBlockedEnabled)) {
    loadDefaultBadUrls(updateBlockedRules);
  }
});
