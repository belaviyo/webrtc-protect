self.importScripts('context.js');

const isFirefox = /Firefox/.test(navigator.userAgent) || typeof InstallTrigger !== 'undefined';

function action() {
  chrome.storage.local.get({
    enabled: true,
    eMode: isFirefox ? 'proxy_only' : 'disable_non_proxied_udp',
    dMode: 'default_public_interface_only'
  }, prefs => {
    // webRTCIPHandlingPolicy
    const value = prefs.enabled ? prefs.eMode : prefs.dMode;
    chrome.privacy.network.webRTCIPHandlingPolicy.clear({}, () => {
      chrome.privacy.network.webRTCIPHandlingPolicy.set({
        value
      }, () => {
        chrome.privacy.network.webRTCIPHandlingPolicy.get({}, s => {
          let path = '/data/icons/';
          let title = 'WebRTC Protection in On';

          if (s.value !== value) {
            path += 'red/';
            title = 'WebRTC access cannot be changed. It is controlled by another extension';
          }
          else if (prefs.enabled === false) {
            path += 'disabled/';
            title = 'WebRTC Protection in Off';
          }
          // icon
          chrome.action.setIcon({
            path: {
              16: path + '16.png',
              32: path + '32.png',
              48: path + '48.png'
            }
          });
          // tooltip
          chrome.action.setTitle({
            title
          });
        });
      });
    });
  });
}

action();

chrome.storage.onChanged.addListener(() => {
  action();
});

chrome.action.onClicked.addListener(() => chrome.storage.local.get({
  enabled: true
}, prefs => chrome.storage.local.set({
  enabled: !prefs.enabled
})));

/* FAQs & Feedback */
{
  const {management, runtime: {onInstalled, setUninstallURL, getManifest}, storage, tabs} = chrome;
  if (navigator.webdriver !== true) {
    const page = getManifest().homepage_url;
    const {name, version} = getManifest();
    onInstalled.addListener(({reason, previousVersion}) => {
      management.getSelf(({installType}) => installType === 'normal' && storage.local.get({
        'faqs': true,
        'last-update': 0
      }, prefs => {
        if (reason === 'install' || (prefs.faqs && reason === 'update')) {
          const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
          if (doUpdate && previousVersion !== version) {
            tabs.query({active: true, lastFocusedWindow: true}, tbs => tabs.create({
              url: page + '?version=' + version + (previousVersion ? '&p=' + previousVersion : '') + '&type=' + reason,
              active: reason === 'install',
              ...(tbs && tbs.length && {index: tbs[0].index + 1})
            }));
            storage.local.set({'last-update': Date.now()});
          }
        }
      }));
    });
    setUninstallURL(page + '?rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
  }
}
