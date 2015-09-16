
const { utils: Cu, interfaces: Ci } = Components;

const require = Cu.import("resource://gre/modules/commonjs/toolkit/require.js", {}).require;

const querystring = require('sdk/querystring'); 

Cu.import("resource://gre/modules/Services.jsm");

var myobserver = {
    observe : function(subject, topic, data) {
	subject.QueryInterface(Ci.nsIHttpChannel);

	if( subject.URI.host != 'www.youtube.com' )
	    return;
	
	var cookies = querystring.
	    parse( subject.getRequestHeader('Cookie'), ';', '=' );

	var key = Object.keys(cookies).find(function(key) {
	    if( key.match(/tempdata/) )
		return key;
	});
	
	var tempValues = querystring.parse(cookies[key], '&', '=');

	if( tempValues['feature'] == 'related-auto' ||
	    tempValues['feature'] == 'autoplay' ) {
	    console.log('STOPPED YOUTUBE AUTOPLAY');
	    subject.cancel(Components.results.NS_BINDING_ABORTED);
	}
    }
};

function startup(data, reason) {
    Services.obs.addObserver(myobserver, "http-on-modify-request", false);
}

function shutdown(data, reason) {
    Services.obs.removeObserver(myobserver, "http-on-modify-request");
}

function install(data, reason) {
}

function uninstall(data, reason) {
}
