var isFull = JSON.parse(localStorage.getItem("isFull") || "false");

var fullStyles = {
  zIndex: 9000,
  position: "fixed",
  top: "0",
  bottom: "0",
};

var normalStyles = {
  zIndex: null,
  position: null,
  top: null,
  bottom: null,
};

function toggle(request) {
  isFull = Boolean(request.isFull);

  var wrappers = document.getElementsByClassName("video-player-wrapper");
  if (wrappers.length > 0) {
    Object.assign(wrappers[0].style, isFull ? fullStyles : normalStyles);
  }

  localStorage.setItem("isFull", isFull ? "true" : "false");
}

chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request.getStatus) {
    sendResponse({ isFull });
    return;
  } else {
    toggle(request);
  }
});

// detect when the video player appears in the DOM
if (!document.getElementsByClassName("video-player-wrapper").length) {
  var observer = new MutationObserver(function (mutations) {
    var escape = false;
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].addedNodes.length > 0) {
        for (var j = 0; j < mutations[i].addedNodes.length; j++) {
          if (
            mutations[i].addedNodes[j].classList.contains("erc-watch-episode")
          ) {
            escape = true;
            var wrappers = document.getElementsByClassName(
              "video-player-wrapper"
            );
            if (wrappers.length > 0) {
              normalStyles.zIndex = wrappers[0].style.zIndex;
              normalStyles.position = wrappers[0].style.position;
              normalStyles.top = wrappers[0].style.top;
              normalStyles.bottom = wrappers[0].style.bottom;
            }
            toggle({ isFull });
            observer.disconnect();
            break;
          }
        }
        if (escape) {
          break;
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  var wrappers = document.getElementsByClassName("video-player-wrapper");
  if (wrappers.length > 0) {
    normalStyles.zIndex = wrappers[0].style.zIndex;
    normalStyles.position = wrappers[0].style.position;
    normalStyles.top = wrappers[0].style.top;
    normalStyles.bottom = wrappers[0].style.bottom;
  }
  toggle({ isFull });
}
