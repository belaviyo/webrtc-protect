'use strict';

var rdmstr = ('s' + Math.random()).replace('.', '_');

var script = Object.assign(document.createElement('script'), {
  textContent: `
    var ${rdmstr} = [];
    {
      const enumerateDevices = navigator.mediaDevices.enumerateDevices;
      Object.defineProperty(navigator.mediaDevices, 'enumerateDevices', {
        value: () => new Promise(resolve => {
          ${rdmstr}.push(resolve);
          window.postMessage('device-enum-api', '*');
        }).then(r => r ? [] : enumerateDevices.call(navigator.mediaDevices))
      });
    }
  `
});
document.documentElement.appendChild(script);
document.documentElement.removeChild(script);

window.addEventListener('message', ({data}) => data === 'device-enum-api' && chrome.storage.local.get({
  dAPI: true,
  enabled: true
}, prefs => {
  const script = Object.assign(document.createElement('script'), {
    textContent: `
      ${rdmstr}.forEach(r => r(${prefs.dAPI && prefs.enabled}));
      ${rdmstr} = [];
    `
  });
  document.documentElement.appendChild(script);
  document.documentElement.removeChild(script);
}));
