function matchesDefaultBadUrl(urlInput) {
  return DEFAULT_BAD_URLS.some(pattern => {
    // Convert * to .*
    const regexStr = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    const regex = new RegExp('^' + regexStr + '$');
    return regex.test(urlInput);
  });
}

function addBlockedUrl() {
  const urlInput = document.getElementById('blockurl').value.trim();
  if (!urlInput) return;
  // Prevent adding if matches any default bad URL pattern
  if (matchesDefaultBadUrl(urlInput)) {
    alert('This URL or pattern is already covered by the default blocked list.');
    return;
  }
  chrome.storage.sync.get(['blockedUrls'], (result) => {
    const blocked = result.blockedUrls || [];
    if (!blocked.includes(urlInput)) {
      blocked.push(urlInput);
      chrome.storage.sync.set({ blockedUrls: blocked }, () => {
        alert('URL blocked: ' + urlInput);
        document.getElementById('blockurl').value = '';
        renderBlockedUrls();
      });
    } else {
      alert('URL already blocked.');
    }
  });
}

function removeBlockedUrl(urlToRemove) {
  chrome.storage.sync.get(['blockedUrls'], (result) => {
    let blocked = result.blockedUrls || [];
    blocked = blocked.filter(url => url !== urlToRemove);
    chrome.storage.sync.set({ blockedUrls: blocked }, () => {
      renderBlockedUrls();
    });
  });
}

let DEFAULT_BAD_URLS = [];
let defaultBlockedEnabled = true;

function loadDefaultBadUrls(callback) {
  fetch('https://raw.githubusercontent.com/Miyso/ScamBlocker/main/src/data/defaultBadUrls.json')
    .then(response => response.json())
    .then(json => {
      DEFAULT_BAD_URLS = json;
      chrome.storage.sync.get(['defaultBlockedEnabled'], (result) => {
        defaultBlockedEnabled = result.defaultBlockedEnabled !== false; // default true
        if (callback) callback();
      });
    })
    .catch(err => {
      console.error('[ScamBlocker] Failed to load src/data/defaultBadUrls.json from GitHub:', err);
      DEFAULT_BAD_URLS = [];
      if (callback) callback();
    });
}

function renderBlockedUrls() {
  // Render user blocked URLs
  chrome.storage.sync.get(['blockedUrls'], (result) => {
    const blocked = result.blockedUrls || [];
    const list = document.getElementById('blockedList');
    list.innerHTML = '';
    blocked.forEach(url => {
      const li = document.createElement('li');
      li.textContent = url;
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.className = 'remove-btn';
      removeBtn.onclick = () => removeBlockedUrl(url);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  });

  // Render default blocked URLs
  const defaultList = document.getElementById('defaultBlockedList');
  if (defaultList) {
    defaultList.innerHTML = '';
    if (defaultBlockedEnabled) {
      DEFAULT_BAD_URLS.forEach(url => {
        const li = document.createElement('li');
        li.textContent = url;
        defaultList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'Default blocked list is disabled.';
      li.style.color = '#b91c1c';
      defaultList.appendChild(li);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clickme').addEventListener('click', addBlockedUrl);
  const toggle = document.getElementById('toggleDefaultBlocked');
  chrome.storage.sync.get([
    'defaultBlockedEnabled',
    'showSenderBanner',
    'scanSubjectForImpersonation',
    'scanBodyForImpersonation'
  ], (result) => {
    toggle.checked = result.defaultBlockedEnabled !== false;
    document.getElementById('toggleShowSenderBanner').checked = result.showSenderBanner !== false;
    document.getElementById('toggleScanSubject').checked = !!result.scanSubjectForImpersonation;
    document.getElementById('toggleScanBody').checked = !!result.scanBodyForImpersonation;
  });
  toggle.addEventListener('change', (e) => {
    chrome.storage.sync.set({ defaultBlockedEnabled: toggle.checked }, () => {
      defaultBlockedEnabled = toggle.checked;
      renderBlockedUrls();
      chrome.runtime.sendMessage({ type: 'updateDefaultBlockedEnabled', enabled: toggle.checked });
    });
  });

  document.getElementById('toggleShowSenderBanner').addEventListener('change', (e) => {
    chrome.storage.sync.set({ showSenderBanner: e.target.checked });
  });
  document.getElementById('toggleScanSubject').addEventListener('change', (e) => {
    chrome.storage.sync.set({ scanSubjectForImpersonation: e.target.checked });
  });
  document.getElementById('toggleScanBody').addEventListener('change', (e) => {
    chrome.storage.sync.set({ scanBodyForImpersonation: e.target.checked });
  });

  loadDefaultBadUrls(renderBlockedUrls);
});
