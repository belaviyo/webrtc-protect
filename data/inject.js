'use strict';

const script = document.createElement('script');
chrome.storage.local.get({
  dAPI: true,
  enabled: true
}, prefs => {
  Object.assign(script.dataset, prefs);
});
chrome.storage.onChanged.addListener(ps => {
  if (ps.dAPI) {
    script.dataset.dAPI = ps.dAPI.newValue;
  }
  if (ps.enabled) {
    script.dataset.enabled = ps.enabled.newValue;
  }
});
script.textContent = `{
  const script = document.currentScript;
  const enumerateDevices = navigator.mediaDevices.enumerateDevices;
  Object.defineProperty(navigator.mediaDevices, 'enumerateDevices', {
    value: () => new Promise(resolve => {
      if (script.dataset.dAPI === 'true' && script.dataset.enabled === 'true') {
        resolve([]);
      }
      else {
        resolve(enumerateDevices.call(navigator.mediaDevices));
      }
    })
  });
}`;
document.documentElement.appendChild(script);
script.remove();
