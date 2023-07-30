{
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

  if (navigator.mediaDevices?.enumerateDevices) {
    navigator.mediaDevices.enumerateDevices = new Proxy(navigator.mediaDevices.enumerateDevices, {
      apply(target, self, args) {
        if (port.dataset.dAPI === 'true') {
          return Promise.resolve([]);
        }
        return Reflect.apply(target, self, args);
      }
    });
  }
}
