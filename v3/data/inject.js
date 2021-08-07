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

  navigator.mediaDevices.enumerateDevices = new Proxy(navigator.mediaDevices.enumerateDevices, {
    apply(target, self, args) {
      if (script.dataset.dAPI === 'true' && script.dataset.enabled === 'true') {
        return Promise.resolve([]);
      }
      return Reflect.apply(target, self, args);
    }
  });
}`;
document.documentElement.appendChild(script);
script.remove();
