var tabSelectArgs = {
  active: true,
  currentWindow: true,
};

var isFull = false;

function sendCurrentTabMessage(message, fn) {
  chrome.tabs.query(tabSelectArgs, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, fn);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("check");

  toggle.addEventListener("change", function () {
    isFull = this.checked;
    sendCurrentTabMessage({ isFull });
  });

  sendCurrentTabMessage({ getStatus: true }, function (response) {
    isFull = response.isFull;
    toggle.checked = isFull;
  });
});
