'use strict';

function action () {
  chrome.storage.local.get({
    enabled: true,
    eMode: 'disable_non_proxied_udp',
    dMode: 'default_public_interface_only'
  }, prefs => {
    // webRTCIPHandlingPolicy
    chrome.privacy.network.webRTCIPHandlingPolicy.clear({}, () => {
      chrome.privacy.network.webRTCIPHandlingPolicy.set({
        value: prefs.enabled ? prefs.eMode : prefs.dMode
      });
    });
    // icon
    let root = 'data/icons/' + (prefs.enabled ? '' : 'disabled/');
    chrome.browserAction.setIcon({
      path: {
        16: root + '16.png',
        32: root + '32.png',
        64: root + '64.png'
      }
    });
    // tooltip
    chrome.browserAction.setTitle({
      title: 'WebRTC protect (' + (prefs.enabled ? 'enabled' : 'disabled') + ')'
    });
  });
}

action();

chrome.storage.onChanged.addListener(() => {
  action();
});

chrome.browserAction.onClicked.addListener(() => {
  chrome.storage.local.get({
    enabled: true
  }, prefs => chrome.storage.local.set({
    enabled: !prefs.enabled
  }));
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'leakage',
    contexts: ['browser_action'],
    title: 'Check WebTRC Leakage'
  });
});

chrome.contextMenus.onClicked.addListener(() => {
  chrome.tabs.create({
    url: 'http://tools.add0n.com/webrtc-leakage.html'
  });
});

// FAQs & Feedback
chrome.storage.local.get({
  'version': null,
  'faqs': navigator.userAgent.toLowerCase().indexOf('firefox') === -1 ? true : false
}, prefs => {
  let version = chrome.runtime.getManifest().version;

  if (prefs.version ? (prefs.faqs && prefs.version !== version) : true) {
    chrome.storage.local.set({version}, () => {
      chrome.tabs.create({
        url: 'http://add0n.com/webrtc-protect.html?version=' + version +
          '&type=' + (prefs.version ? ('upgrade&p=' + prefs.version) : 'install')
      });
    });
  }
});
(function () {
  let {name, version} = chrome.runtime.getManifest();
  chrome.runtime.setUninstallURL('http://add0n.com/feedback.html?name=' + name + '&version=' + version);
})();
