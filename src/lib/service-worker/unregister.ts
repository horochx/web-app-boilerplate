export function unregister() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.getRegistrations().then((regs) => {
    for (let reg of regs) {
      reg.unregister();
    }
  });
}
