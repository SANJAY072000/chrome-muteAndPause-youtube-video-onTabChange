// Message listener in milli-seconds
const time_for_retry = 500;
const time_for_delay = 50;

chrome.runtime.onMessage.addListener((msg, send, reply) => {
  if (msg.type === "mute_other_streams") muteTabs(send.tab, 0);
});

function muteTabs(curTab, firstTime) {
  chrome.tabs.query({ url: "https://*.youtube.com/*" }, (tabs) => {
    if (chrome.runtime.lastError) {
      // If less than 1sec has elapsed since the content script sent the command, retry after a small delay

      if (firstTime < time_for_retry)
        setTimeout(() => muteTabs(curTab, firstTime + time_for_delay));
      else console.error(chrome.runtime.lastError.message);
      return;
    }

    tabs.forEach((tab) =>
      chrome.tabs.update(tab.id, {
        muted: tab.id !== curTab.id,
      })
    );
  });
}
