chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason !== "install" && details.reason !== "update") return;
});

function store(isFull, tab) {
  chrome.storage.sync.set({ crunchyfull_active: isFull });
  chrome.action.setIcon({
    path: {
      16: isFull ? "/img/icon16-on.png" : "/img/icon16.png",
      32: isFull ? "/img/icon32-on.png" : "/img/icon32.png",
      48: isFull ? "/img/icon48-on.png" : "/img/icon48.png",
      128: isFull ? "/img/icon128-on.png" : "/img/icon128.png",
    },
    tabId: tab.id,
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, _) {
  if (Object.hasOwnProperty.call(request, "isFull")) {
    store(Boolean(request.isFull), sender.tab);
  }
  chrome.action.enable(sender.tab.id);
});

chrome.action.onClicked.addListener(function (tab) {
  if (!tab.url.match(/^https:\/\/.+\.crunchyroll\.com.+$/)) {
    chrome.action.setBadgeText({ text: "!", tabId: tab.id });
    chrome.action.setTooltip({
      title: "This extension only works on Crunchyroll!",
    });
    return;
  }
  chrome.storage.sync.get("crunchyfull_active", function (data) {
    var isFull = !Boolean(data.crunchyfull_active);
    chrome.tabs.sendMessage(tab.id, { getStatus: true }, function (response) {
      if (Boolean(response.isFull) !== isFull) {
        chrome.tabs.sendMessage(tab.id, { isFull });
      }
      store(isFull, tab);
    });
  });
});

chrome.action.disable();
