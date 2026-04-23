
{
  const isFirefox = /Firefox/.test(navigator.userAgent) || typeof InstallTrigger !== 'undefined';

  const update = async () => {
    const prefs = await chrome.storage.local.get({
      dAPI: true,
      eMode: isFirefox ? 'proxy_only' : 'disable_non_proxied_udp',
      dMode: 'default_public_interface_only'
    });
    chrome.contextMenus.update('dAPI', {
      checked: prefs.dAPI
    });
    chrome.contextMenus.update(prefs.eMode, {
      checked: true
    });
    chrome.contextMenus.update(prefs.dMode, {
      checked: true
    });
  };

  const onStartup = async () => {
    if (onStartup.done) {
      return;
    }
    onStartup.done = true;

    await chrome.contextMenus.create({
      id: 'test',
      contexts: ['action'],
      title: chrome.i18n.getMessage('bg_1')
    }, () => chrome.runtime.lastError),
    await chrome.contextMenus.create({
      id: 'dAPI',
      contexts: ['action'],
      title: chrome.i18n.getMessage('bg_2'),
      type: 'checkbox'
    }, () => chrome.runtime.lastError),
    await chrome.contextMenus.create({
      id: 'when-enabled',
      contexts: ['action'],
      title: chrome.i18n.getMessage('bg_3')
    }, () => chrome.runtime.lastError),
    await chrome.contextMenus.create({
      id: 'disable_non_proxied_udp',
      contexts: ['action'],
      title: chrome.i18n.getMessage('bg_4'),
      parentId: 'when-enabled',
      type: 'radio'
    }, () => chrome.runtime.lastError),
    await chrome.contextMenus.create({
      id: 'proxy_only',
      contexts: ['action'],
      title: chrome.i18n.getMessage('bg_5'),
      parentId: 'when-enabled',
      type: 'radio',
      enabled: isFirefox
    }, () => chrome.runtime.lastError),
    await chrome.contextMenus.create({
      id: 'when-disabled',
      contexts: ['action'],
      title: chrome.i18n.getMessage('bg_6')
    }, () => chrome.runtime.lastError),
    await chrome.contextMenus.create({
      id: 'default_public_interface_only',
      contexts: ['action'],
      title: chrome.i18n.getMessage('bg_7'),
      parentId: 'when-disabled',
      type: 'radio'
    }, () => chrome.runtime.lastError),
    await chrome.contextMenus.create({
      id: 'default_public_and_private_interfaces',
      contexts: ['action'],
      title: chrome.i18n.getMessage('bg_8'),
      parentId: 'when-disabled',
      type: 'radio'
    }, () => chrome.runtime.lastError);

    //
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
    else if (
      info.menuItemId === 'default_public_interface_only' ||
      info.menuItemId === 'default_public_and_private_interfaces'
    ) {
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
