'use strict';

chrome.extension.isAllowedIncognitoAccess(result => {
  document.getElementById('incognito').textContent = result ? 'Yes' : 'No';
  document.getElementById('incognito').dataset.enabled = result;
});

function restore() {
  chrome.storage.local.get({
    enabled: true,
    eMode: 'disable_non_proxied_udp',
    dMode: 'default_public_interface_only',
    dAPI: true
  }, prefs => {
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
    const info = document.getElementById('info');
    info.textContent = 'Settings saved!';
    window.setTimeout(() => info.textContent = '', 750);
  });
}

document.getElementById('save').addEventListener('click', save);

restore();
