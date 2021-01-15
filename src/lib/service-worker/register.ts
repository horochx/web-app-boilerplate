export function register(updateCallback?: (skipWaiting: () => void) => void) {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.register("service-worker.js").then((reg) => {
    // https://github.com/w3c/ServiceWorker/issues/515
    setTimeout(() => {
      handleUpdate(reg, updateCallback);

      checkUpdateLoop(reg);

      // skip controllerchange from first install
      if (!reg.active && reg.installing) {
        reg.installing!.addEventListener("statechange", function () {
          if (this.state === "installed") {
            setTimeout(() => {
              handleControllerChange();
            }, 0);
          }
        });
      } else {
        handleControllerChange();
      }
    }, 0);
  });

  const handleUpdate = (
    reg: ServiceWorkerRegistration,
    updateCallback?: (skipWaiting: () => void) => void
  ) => {
    const skipWaiting = () => {
      reg.waiting?.postMessage({ type: "SKIP_WAITING" });
    };

    if (reg.waiting) {
      updateCallback?.(skipWaiting);
      return;
    }

    const handleInstallStateChange = () => {
      reg.installing!.addEventListener("statechange", function () {
        if (this.state === "installed") {
          updateCallback?.(skipWaiting);
        }
      });
    };

    if (reg.active && reg.installing) {
      handleInstallStateChange();
      return;
    }

    reg.addEventListener("updatefound", handleInstallStateChange);
  };

  const checkUpdateLoop = (reg: ServiceWorkerRegistration) => {
    setTimeout(() => {
      reg.update().then(() => {
        checkUpdateLoop(reg);
      });
    }, 30 * 60 * 1000);
  };

  const handleControllerChange = () => {
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) {
        return;
      }
      refreshing = true;
      window.location.reload();
    });
  };
}
