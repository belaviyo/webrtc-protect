'use strict';

const toast = document.getElementById('toast');
const isFF = /Firefox/.test(navigator.userAgent);

const notify = msg => {
  toast.textContent = msg;
  clearTimeout(notify.id);
  notify.id = setTimeout(() => toast.textContent = '', 750);
};

if (isFF === false) {
  document.querySelector('[value="proxy_only"]').disabled = true;
}

chrome.extension.isAllowedIncognitoAccess(result => {
  document.getElementById('incognito').textContent = result ? 'Yes' : 'No';
  document.getElementById('incognito').dataset.enabled = result;
});

chrome.storage.local.get({
  enabled: true,
  eMode: isFF ? 'proxy_only' : 'disable_non_proxied_udp',
  dMode: 'default_public_interface_only',
  dAPI: true
}).then(prefs => {
  document.getElementById(prefs.enabled ? 'enabled' : 'disabled').checked = true;
  document.getElementById('when-enabled').value = prefs.eMode;
  document.getElementById('when-disabled').value = prefs.dMode;
  document.getElementById('device-enum-api').checked = prefs.dAPI;
});

chrome.storage.onChanged.addListener(ps => {
  if ('enabled' in ps) {
    document.getElementById(ps.enabled.newValue ? 'enabled' : 'disabled').checked = true;
  }
  if ('eMode' in ps) {
    document.getElementById('when-enabled').value = ps.eMode.newValue;
  }
  if ('dMode' in ps) {
    document.getElementById('when-disabled').value = ps.dMode.newValue;
  }
  if ('dAPI' in ps) {
    document.getElementById('device-enum-api').checked = ps.dAPI.newValue;
  }
});

document.getElementById('save').onclick = () => chrome.storage.local.set({
  enabled: document.getElementById('enabled').checked,
  eMode: document.getElementById('when-enabled').value,
  dMode: document.getElementById('when-disabled').value,
  dAPI: document.getElementById('device-enum-api').checked
}).then(() => notify('Options saved!'));

// reset
document.getElementById('reset').addEventListener('click', e => {
  if (e.detail === 1) {
    notify('Double-click to reset!');
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
