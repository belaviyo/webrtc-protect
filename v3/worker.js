'use strict';

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
          let path = 'data/icons/';
          let title = 'WebRTC access is allowed';
          if (s.value !== value) {
            path += 'red/';
            title = 'WebRTC access cannot be changed. It is controlled by another extension';
          }
          else if (prefs.enabled === false) {
            path += 'disabled/';
            title = 'WebRTC access is blocked';
          }
          // icon
          chrome.browserAction.setIcon({
            path: {
              16: path + '16.png',
              32: path + '32.png',
              48: path + '48.png'
            }
          });
          // tooltip
          chrome.browserAction.setTitle({
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

chrome.browserAction.onClicked.addListener(() => {
  chrome.storage.local.get({
    enabled: true
  }, prefs => chrome.storage.local.set({
    enabled: !prefs.enabled
  }));
});

{
  const onStartup = () => chrome.contextMenus.create({
    id: 'leakage',
    contexts: ['browser_action'],
    title: 'Check WebTRC Leakage'
  });
  chrome.runtime.onInstalled.addListener(onStartup);
  chrome.runtime.onStartup.addListener(onStartup);
}
chrome.contextMenus.onClicked.addListener(() => {
  chrome.tabs.create({
    url: 'https://webbrowsertools.com/ip-address/'
  });
});

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
            tabs.query({active: true, currentWindow: true}, tbs => tabs.create({
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
