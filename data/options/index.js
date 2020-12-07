'use strict';

const toast = document.getElementById('toast');
const isFF = /Firefox/.test(navigator.userAgent);

if (isFF === false) {
  document.querySelector('[value="proxy_only"]').disabled = true;
}

chrome.extension.isAllowedIncognitoAccess(result => {
  document.getElementById('incognito').textContent = result ? 'Yes' : 'No';
  document.getElementById('incognito').dataset.enabled = result;
});

function restore() {
  chrome.storage.local.get({
    enabled: true,
    eMode: isFF ? 'proxy_only' : 'disable_non_proxied_udp',
    dMode: 'default_public_interface_only',
    dAPI: true
  }, prefs => {
    console.log(prefs.eMode);
    document.getElementById(prefs.enabled ? 'enabled' : 'disabled').checked = true;
    document.getElementById('when-enabled').value = prefs.eMode;
    document.getElementById('when-disabled').value = prefs.dMode;
    document.getElementById('device-enum-api').checked = prefs.dAPI;
  });
}

function save() {
  chrome.storage.local.set({
    enabled: document.getElementById('enabled').checked,
    eMode: document.getElementById('when-enabled').value,
    dMode: document.getElementById('when-disabled').value,
    dAPI: document.getElementById('device-enum-api').checked
  }, () => {
    toast.textContent = 'Settings saved!';
    window.setTimeout(() => toast.textContent = '', 750);
  });
}

document.getElementById('save').addEventListener('click', save);

restore();

// reset
document.getElementById('reset').addEventListener('click', e => {
  if (e.detail === 1) {
    toast.textContent = 'Double-click to reset!';
    window.setTimeout(() => toast.textContent = '', 750);
  }
  else {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
});
// support
document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '?rd=donate'
}));
