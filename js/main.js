/// <reference path="patch.js" />

/**
 * Show Context Menu when you see the nicovideo page.
 * 
 * @param {number} tabId
 * @param {Object} selectInfo
 * @param {Tab} tab
 */
function showMenu(tabId, selectInfo, tab){
	tab ? _showMenu(tab) : chrome.tabs.get(tabId, _showMenu);
}


/**
 * Implementation of showMenu.
 * 
 * @param {Tab} tab
 */
function _showMenu(tab){
	var rNico = /^https?:\/\/www.nicovideo\.jp\/.+$/;
	chrome.contextMenus.removeAll(function(){
		if(!rNico.test(tab.url)) return;
		chrome.contextMenus.create({
			title: "Extract Audio EX",
			contexts: ["all"],
			onclick: extractAllAudio
		});
	});
}

chrome.tabs.onCreated.addListener(_showMenu);
chrome.tabs.onUpdated.addListener(showMenu);
chrome.tabs.onSelectionChanged.addListener(showMenu);
