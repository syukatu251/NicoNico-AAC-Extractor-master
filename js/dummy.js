chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    var a = document.createElement("a"), e;
    a.download = request.filename;
    console.log(request);
    a.href = request.url;
    e = document.createEvent("MouseEvent");
    e.initEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
    sendResponse({});
    setTimeout(window.close, 2000);
});