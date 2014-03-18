> **WARNING**: This widget currently doesn't work since Twitter 1.0 API is deprecated and dependent widgets are out of sync.

# TweetsView Widget [![Titanium](http://www-static.appcelerator.com/badges/titanium-git-badge-sq.png)](http://www.appcelerator.com/titanium/) [![Alloy](http://www-static.appcelerator.com/badges/alloy-git-badge-sq.png)](http://www.appcelerator.com/alloy/)
## Overview
The *TweetsView* widget provides a twitter-like experience in a view designed to fill a window (most likely to be contained by a tab) or a splitview, for [Alloy](http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html) - the new MVC for [Titanium](http://www.appcelerator.com/platform) by [Appcelerator](http://www.appcelerator.com).

## Screenshots

### List view
![List view](https://raw.github.com/FokkeZB/nl.fokkezb.tweetsView/master/app/widgets/nl.fokkezb.tweetsView/docs/screenshot_list.png)

### Pull to refresh
![Pull to refresh](https://raw.github.com/FokkeZB/nl.fokkezb.tweetsView/master/app/widgets/nl.fokkezb.tweetsView/docs/screenshot_ptr.png)

### Dynamic Scrolling
![Dynamic Scrolling](https://raw.github.com/FokkeZB/nl.fokkezb.tweetsView/master/app/widgets/nl.fokkezb.tweetsView/docs/screenshot_ds.png)

### Detail view
![Detail view](https://raw.github.com/FokkeZB/nl.fokkezb.tweetsView/master/app/widgets/nl.fokkezb.tweetsView/docs/screenshot_detail.png)

### Browser view (opening a link in a tweet)
![Browser view](https://raw.github.com/FokkeZB/nl.fokkezb.tweetsView/master/app/widgets/nl.fokkezb.tweetsView/docs/screenshot_bv.png)

## Dependencies
* [PullToRefresh](https://github.com/FokkeZB/nl.fokkezb.pullToRefresh) widget for loading newer tweets.
* [DynamicScrolling](https://github.com/FokkeZB/nl.fokkezb.dynamicScrolling) widget for loading older tweets.
* [BrowserView](https://github.com/FokkeZB/nl.fokkezb.browserView) widget for loading links in tweets.

## Features
* Initialize the widget without any controller code.
* Specify any query (`q`) to search for on Twitter.
* Manually trigger lazy loading of tweets, e.g. on window open.
* Loads newer tweets using the [PullToRefresh](https://github.com/FokkeZB/nl.fokkezb.pullToRefresh) widget.
* Loads older tweets using the [DynamicScrolling](https://github.com/FokkeZB/nl.fokkezb.dynamicScrolling) widget.
* Tries to open mentions and hash tags in the iOS twitter client and falls back to the [BrowserView](https://github.com/FokkeZB/nl.fokkezb.browserView) widget.
* Opens links in tweets within the app using the [BrowserView](https://github.com/FokkeZB/nl.fokkezb.browserView) widget.
* Pass a callback, tab or navigationgroup to open a tweet or link in a new window from any context you're using the view in.

## Future work
* Android and Mobile Web compatibility and testing.
* Change the root view to a window ([TC-1534](https://jira.appcelerator.org/browse/TC-1534))
* Add and test more automatic context (tab, navigationgroup…) support.
* Supply buttons for tweeting, reply etc.

## Quick Start
* [Download the latest version](https://github.com/FokkeZB/nl.fokkezb.tweetsView/tags) of the widget as a ZIP file.
* Move the file to your project's root folder.
* Unzip the file and you'll find the widget under `app/widgets/nl.fokkezb.tweetsView`.
* Add the widget as a dependency to your `app/config.json` file like so:

```javascript
	"dependencies": {
		"nl.fokkezb.tweetsView":"1.0"
	}
```

* Follow the above 4 steps likewise for the [PullToRefresh](https://github.com/FokkeZB/nl.fokkezb.pullToRefresh), [DynamicScrolling](https://github.com/FokkeZB/nl.fokkezb.dynamicScrolling) and [BrowserView](https://github.com/FokkeZB/nl.fokkezb.browserView) widgets.
* Use the widget in a view. At this moment you'd most likely want to require it in a window, that is contained in a tab or navigation group.

```xml
<Tab id="tvt" title="My Tweets">
	<Window id="tvw" title="Tweets">
		<Widget src="nl.fokkezb.tweetsView" id="tv" q="my search" />
	</Window>
</Tab>
```
## Optionally use init()
Instead of passing the search query using the `q` attribute in the view, you can also use the widget's `init()` method. This allows you to also specify a callback, tab or navigation group to open the tweets or browserview in. 

```javascript
$.tv.init({
    q: 'my search',
    opener: $.tvt
});
```

**or**

```javascript
$.tv.init({
    q: 'my search',
    opener: function (win) {
      // Bad example: this is the default without using an opener :)
      win.open();
    }
});
```

## Manually caling load()
The widget does not automatically load the tweets on initialization. This is because if you'd use it in a tabgroup, the view will be initialized even if the tab is not the primary tab the user will see. So, you will need to manually trigger the first load by doing something like:

```javascript
function onOpen() {
	$.tw.off('open', onOpen);
	$.tv.load();
}
$.tw.on('open', onOpen);
```

## Changelog
* 1.0.1: Fixed for Alloy 1.0GA
* 1.0: Initial version
