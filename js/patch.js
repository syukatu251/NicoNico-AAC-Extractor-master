/// <reference path="../libs/jquery-1.8.2.js" />
/// <reference path="extract.js" />


function extractAllAudio() {
    chrome.tabs.getSelected(null, function (out_tab) {
        $.get(out_tab.url).done(function (out_data) {
            var jqAnchor = $(out_data).find("a.watch");
            jqAnchor.each(function (out_index, out_jqAnchor) {
                var title = jqAnchor.eq(out_index).attr("title");
                var url = "http://www.nicovideo.jp/" + jqAnchor.eq(out_index).attr("href");
                setTimeout(function () {
                    chrome.tabs.create({ url: url, selected: false }, function (tab) {
                        setTimeout(function () {
                            extractAudio(title, url);
                            setTimeout(function () {
                                chrome.tabs.executeScript(tab.id, { code: "window.close()" });
                            }, 1000);
                        }, 2 * 1000);
                    });
                }, out_index * 60 * 1000);
            });
        });
    });
}