function muteOtherTabs() {
  chrome.runtime.sendMessage({ type: "mute_other_streams" });
}

function setupPageVisibilityChangeListener() {
  document.addEventListener("visibilitychange", () => {
    // Mute other tabs when switching to this one
    if (document.visibilityState === "visible") muteOtherTabs();
  });
}

setupPageVisibilityChangeListener();

// Mute other tabs when opening this one if the user is on it
if (document.visibilityState === "visible") muteOtherTabs();
