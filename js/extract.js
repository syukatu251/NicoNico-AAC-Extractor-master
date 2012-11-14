﻿/**
 * Copyright 2012 (c) - Syu Kato <ukyo.web@gmail.com>
 */

VIDEO_TITLE_POSTFIX = decodeURIComponent("%20%E2%80%90%20%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB");

/**
 * Extract AAC from a movie.
 * 
 * @param {ArrayBuffer} buffer
 * @param {string} title
 */
function extractAAC(buffer, title) {
    var mp4 = new mp4js.Mp4(buffer);
    var aacBuff = mp4.extractAACAsArrayBuffer();
    var bb = new WebKitBlobBuilder();
    bb.append(mp4js.aacToM4a(aacBuff));
    downloadFile(bb.getBlob(), title + ".m4a");
}


/**
 * Extract mp3 from a swf movie.
 * 
 * @param {ArrayBuffer} buffer
 * @param {string} title
 */
function extractMp3FromSwf(buffer, title) {
    var swf = new Swf(buffer);
    var data = swf.extractMp3();
    downloadFile(data, title + ".mp3");
}


/**
 * Extract audio from a flv movie.
 * 
 * @param {ArrayBuffer} buffer
 * @param {string} title
 */
function extractAudioFromFlv(buffer, title) {
    var flv = new Flv(buffer);
    var data = flv.extractAudio();
    var bb = new WebKitBlobBuilder();
    if (data.type === ".aac") {
        bb.append(mp4js.aacToM4a(data.buffer));
        //bb.append(data.buffer);
        downloadFile(bb.getBlob(), title + ".m4a");
    } else {
        bb.append(data.buffer);
        downloadFile(bb.getBlob(), title + data.type);
    }

}


/**
 * Create a dummy tab and download a file to download folder.
 * 
 * @param {Object} obj file's url and name.
 */
function downloadFile(data, filename) {
    chrome.tabs.create({ url: "../html/dummy.html", selected: false }, function (tab) {
        setTimeout(function () {
            var obj = { url: webkitURL.createObjectURL(data), filename: filename };
            chrome.tabs.sendRequest(tab.id, obj, function (response) {
                console.log(response);
            });
        }, 1000);
    });
}


/**
 * Extract audio from movie.
 * If a type of movie is mp4, call function extractAAC.
 * Else if a type of movie is swf, call function extractMp3.
 */
function extractAudio(in_title, in_url) {
    try {
        loadFileBuffer(getMovieURL(in_url), function (buffer) {
            try {
                var bytes = new Uint8Array(buffer), fn;

                if (bytes[0] === 70 && bytes[1] === 76 && bytes[2] === 86) {//FLV
                    fn = extractAudioFromFlv;
                } else if (bytes[0] === 67 && bytes[1] === 87 && bytes[2] === 83) {//SWF
                    fn = extractMp3FromSwf;
                } else if (bytes[4] === 102 && bytes[5] === 116 && bytes[6] === 121 && bytes[7] === 112) {//MP4
                    fn = extractAAC;
                } else {
                    throw 'unknown file type';
                }


                fn(buffer, in_title);
            } catch (e) {
                onerror();
            }
        });
    } catch (e) {
        onerror();
    }
}


/**
 * When to extract audio is failed, this function will be called.
 * This function displays a error message in notification.
 */
function onerror() {
    var notification = createNotification("Nico Audio Extractor", "To extract was failed.");
    notification.show();
    setTimeout(notification.cancel, 5000);
}


/**
 * @param {string} id
 * @return {boolean}
 */
function isSwf(id) {
    return id.slice(0, 2) === "nm";
}

/**
 * Get a URL of movie data with nicovideo API.
 * 
 * @param {string} pageURL
 * @return {string} 動画データのURL
 */
function getMovieURL(pageURL) {
    var id = pageURL.split("/").pop();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://flapi.nicovideo.jp/api/getflv/" + id + (isSwf(id) ? "?as3=1" : ""), false);
    xhr.send();
    return decodeURIComponent(/url=([^&]+)/.exec(xhr.responseText)[1]);
}