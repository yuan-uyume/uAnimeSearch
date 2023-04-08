'use strict';
import uAnimeCore from "../src/js/core/uAnimeCore";
const methods = {
  search: async (request, sender, sendResponse) => {
    uAnimeCore.search(...(request.args), data => {
      sendResponse(data)
    })
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("background onMessage: ", request, sender);
  // methods[request.type](request, sender, sendResponse)
  sendResponse("ASDASDSAD")
  return true;
});
