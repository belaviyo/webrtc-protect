const port = document.createElement('port');
port.id = 'webrtc-protect';
document.documentElement.append(port);

chrome.storage.local.get({
  dAPI: true
}, prefs => {
  Object.assign(port.dataset, prefs);
});
chrome.storage.onChanged.addListener(ps => {
  if (ps.dAPI) {
    port.dataset.dAPI = ps.dAPI.newValue;
  }
});
