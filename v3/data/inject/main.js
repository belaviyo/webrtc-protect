{
  const port = document.getElementById('webrtc-protect');
  port.remove();

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
