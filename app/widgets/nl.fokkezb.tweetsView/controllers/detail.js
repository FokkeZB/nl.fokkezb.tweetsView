var args = arguments[0] || {};

var tweet = args.text.replace(/(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a onclick="Ti.App.fireEvent(\'tweetsView:click\',{link:\'$1\'})">$1</a>')
                     .replace(/(^|\s)@(\w+)/g, '$1<a onclick="Ti.App.fireEvent(\'tweetsView:click\',{user:\'$2\'})">@$2</a>')
                     .replace(/(^|\s)#(\w+)/g, '$1<a onclick="Ti.App.fireEvent(\'tweetsView:click\',{tag:\'$2\'})">#$2</a>');

var html = '<html><head><title>Tweet</title><style> body { margin: 0; font-family: Palatino; font-size: 16px; } a { color: #208ccf; } }</style></head><body>' + tweet + '</body></html>';

var date = new Date(args.created_at);

$.image.image = args.profile_image_url.replace('_normal', '_bigger');
$.name.text = args.from_user_name;
$.user.text = '@' + args.from_user;
$.text.html = html;
$.time.text = String.formatDate(date) + ' ' + String.formatTime(date);

$.image.addEventListener('click', function (e) {
	Ti.App.fireEvent('tweetsView:click', {
		user: args.from_user
	});
});