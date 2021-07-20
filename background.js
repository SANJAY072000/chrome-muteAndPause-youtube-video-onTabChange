let previous_tab = 0,
  pause,
  resume;
pause = resume = true;

function pauseVideo(tab) {
  chrome.tabs.sendMessage(tab.id, { action: "stop" });
}

function resumeVideo(tab) {
  chrome.tabs.sendMessage(tab.id, { action: "resume" });
}

function change_tabs(tabId) {
  if (pause && previous_tab) {
    chrome.tabs.get(previous_tab, function (prev) {
      if (!chrome.runtime.lastError) {
        pauseVideo(prev);
      }
    });
  }
  previous_tab = tabId;
  chrome.tabs.get(tabId, function (tab) {
    if (resume && !chrome.runtime.lastError) {
      resumeVideo(tab);
    }
  });
}

chrome.tabs.onActivated.addListener(function (info) {
  change_tabs(info.tabId);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    "status" in changeInfo &&
    changeInfo.status === "complete" &&
    !tab.active
  ) {
    pauseVideo(tab);
  }
});

chrome.windows.onFocusChanged.addListener(function (info) {
  if (previous_tab) {
    chrome.tabs.get(previous_tab, function (tab) {
      if (tab === undefined || chrome.runtime.lastError) {
        return;
      }
      if (!tab.active && pause) {
        pauseVideo(tab);
      }
    });
  }
});
