
{
  const isFirefox = /Firefox/.test(navigator.userAgent) || typeof InstallTrigger !== 'undefined';

  const update = () => chrome.storage.local.get({
    dAPI: true,
    eMode: isFirefox ? 'proxy_only' : 'disable_non_proxied_udp',
    dMode: 'default_public_interface_only'
  }, prefs => {
    chrome.contextMenus.update('dAPI', {
      checked: prefs.dAPI
    });
    chrome.contextMenus.update(prefs.eMode, {
      checked: true
    });
    chrome.contextMenus.update(prefs.dMode, {
      checked: true
    });
  });

  const onStartup = async () => {
    await chrome.contextMenus.create({
      id: 'test',
      contexts: ['action'],
      title: 'Check WebTRC Leakage'
    });
    await chrome.contextMenus.create({
      id: 'dAPI',
      contexts: ['action'],
      title: 'Disable WebRTC Media Device Enumeration API',
      type: 'checkbox'
    });
    await chrome.contextMenus.create({
      id: 'when-enabled',
      contexts: ['action'],
      title: 'When Enabled'
    });
    await chrome.contextMenus.create({
      id: 'disable_non_proxied_udp',
      contexts: ['action'],
      title: 'Disable non-proxied UDP (force proxy)',
      parentId: 'when-enabled',
      type: 'radio'
    });
    await chrome.contextMenus.create({
      id: 'proxy_only',
      contexts: ['action'],
      title: 'Only connections using TURN on a TCP connection through a proxy',
      parentId: 'when-enabled',
      type: 'radio',
      enabled: isFirefox
    });
    await chrome.contextMenus.create({
      id: 'when-disabled',
      contexts: ['action'],
      title: 'When Disabled'
    });
    await chrome.contextMenus.create({
      id: 'default_public_interface_only',
      contexts: ['action'],
      title: 'Use the default public interface only',
      parentId: 'when-disabled',
      type: 'radio'
    });
    await chrome.contextMenus.create({
      id: 'default_public_and_private_interfaces',
      contexts: ['action'],
      title: 'Use the default public interface and private interface',
      parentId: 'when-disabled',
      type: 'radio'
    });
    update();
  };

  chrome.runtime.onInstalled.addListener(onStartup);
  chrome.runtime.onStartup.addListener(onStartup);

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'test') {
      chrome.tabs.create({
        url: 'https://webbrowsertools.com/ip-address/',
        index: tab.index + 1
      });
    }
    else if (info.menuItemId === 'dAPI') {
      chrome.storage.local.set({
        dAPI: info.checked
      });
    }
    else if (info.menuItemId === 'disable_non_proxied_udp' || info.menuItemId === 'proxy_only') {
      chrome.storage.local.set({
        eMode: info.menuItemId
      });
    }
    else if (info.menuItemId === 'default_public_interface_only' || info.menuItemId === 'default_public_and_private_interfaces') {
      chrome.storage.local.set({
        dMode: info.menuItemId
      });
    }
  });

  chrome.storage.onChanged.addListener(ps => {
    if (ps.dAPI || ps.eMode || ps.dMode) {
      update();
    }
  });
}

