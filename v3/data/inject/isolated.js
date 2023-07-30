let port;
try {
  port = document.getElementById('webrtc-protect');
  port.remove();
}
catch (e) {
  port = document.createElement('span');
  port.id = 'webrtc-protect';
  document.documentElement.append(port);
}

chrome.storage.local.get({
  dAPI: true
}, prefs => {
  port.dataset.dAPI = prefs.dAPI;
});
chrome.storage.onChanged.addListener(ps => {
  if (ps.dAPI) {
    port.dataset.dAPI = ps.dAPI.newValue;
  }
});
