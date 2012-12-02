/* TODO:
 * - Bij geen tweets een tablerow met top,right,left,bottom 0 (fullscreen) met info?
 * - Net zoals Twitter detailpagina per tweet met dan tekst in webview clickable
 * - Toch .init verplichten zodat dan parent bekend is en we met rootview en events kunnen spelen
 * - Events firen bij selecteren tweet voor eventuele afhandeling op maat
 * - Parent navgroup, tabgroup herkennen: nav/tab.open || event
 * 	 Is dit wel mogelijk aangezien parent tabgroup tab niet kent?
 *   Dan beter alles laten doen via init: opener: navgroup || tab || win || callback
 * - Parent window, view herkennen: win.open || event
 * - Bovenstaande idee bloggen
 * - Toch username achternaam 
 */

var args = arguments[0] || {};

var options = {
	q: 'apps'
};
var loading = false;
var data = [];
var refresh_url, next_page;
var scrollController, pullController;

function doInit(opts) {
	_.extend(options, opts);
	
	pullController = Alloy.createWidget('nl.fokkezb.pullToRefresh');
	pullController.init({
		table: $.tableView,
		loader: doRefresh
	});

	if (options.opener !== false) {
		$.tableView.on('click', onTableViewClick);
	} else {
		$.tableView.allowsSelection = false;
	}
}

function openWindow(win) {
	
	if (typeof options.opener === 'function') {
		options.opener(win);
	
	} else if (typeof options.opener == 'object' && typeof options.opener.open === 'function') {
		options.opener.open(win);
		
	} else {
		win.open();
	}
}

function onTweetClick(e) {
	var scheme, url;
	
	if (e.tag) {
		// FIXME Vereist inloggen: url = 'https://mobile.twitter.com/search?q=%23' + e.tag;
		url = 'https://twitter.com/search?q=%23' + e.tag;
	
	} else if (e.user) {
		scheme = 'twitter:@' + e.user;
		url = 'https://mobile.twitter.com/' + e.user;
	
	} else {
		url = e.link;
	}
	
	if (scheme && Ti.Platform.canOpenURL(scheme)) {
		Ti.Plaform.openURL(scheme);
		
	} else if (url) {
		var win = Alloy.createWidget('nl.fokkezb.browserView', null, {
			url: url
		}).getView();
		
		openWindow(win);
	}
}

function onTableViewClick(e) {
	
	if (e.source.image) {
		onTweetClick({
			user: e.row.data.from_user
		});
		
	} else {
		var win = Alloy.createWidget('nl.fokkezb.tweetsView', 'detail', e.row.data).getView();
		
		Ti.App.addEventListener('tweetsView:click', onTweetClick);
		
		win.addEventListener('close', function () {
			Ti.App.removeEventListener('tweetsView:click', onTweetClick);
		});
		
		openWindow(win);
	}
}

function doManualRefresh() {

	if (loading) {
		return false;
	}
	
	pullController.trigger();
	
	return true;
}

function doRefresh(callback) {
	
	if (refresh_url) {
		doLoad(refresh_url, callback);
	
	} else {
		doLoad('?q=' + options.q, callback)
	}
}

function doNext(callback) {
	doLoad(next_page, callback);
}

function doLoad(query, callback) {
	
	if (loading) {
		
		if (callback) {
			callback(false);
		}
		
		return false;
	}
	
	loading = true;
	
	var url = 'http://search.twitter.com/search.json' + query;
		
	var json, xhr = Ti.Network.createHTTPClient({
	    onload: function () {
	    	json = JSON.parse(this.responseText);
	    	
	    	if (json.since_id) {
	    		
	    		for (var i = json.results.length - 1; i >= 0; i--) {
	    			data.unshift(Alloy.createWidget('nl.fokkezb.tweetsView', 'row', json.results[i]).getView());
	    		}	
	    		
	    	} else {
	    		
	    		for (var i = 0; i < json.results.length; i++) {
	    			data.push(Alloy.createWidget('nl.fokkezb.tweetsView', 'row', json.results[i]).getView());
	    		}
	    	}
			
			$.tableView.setData(data);
			
			if (!json.since_id) {
				
				if (json.next_page) {
					next_page = json.next_page;
					
					if (!scrollController) {
						scrollController = Alloy.createWidget('nl.fokkezb.dynamicScrolling');
						scrollController.init({
							table: $.tableView,
							loader: doNext
						});
					}
				
				} else {
					next_page = null;
					
					if (scrollController) {
						scrollController.remove();
						scrollController = null;
					}
				}
			}
			
	    	refresh_url = json.refresh_url;

			if (callback) {
				callback(true);
			}
			
			loading = false;
		},
		onerror: function (e) {
			Ti.API.debug(e.error);
			
			if (callback) {
				callback(false);
			}
			
			loading = false;
		}
	});

	xhr.open('GET', url);
	xhr.send();
	
	return true;
}

if (args.q) {
	doInit(args);
}

exports.init = doInit;
exports.load = doManualRefresh;