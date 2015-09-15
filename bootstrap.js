
Components.utils.import("resource://gre/modules/Services.jsm");

var myobserver = {
    observe : function(subject, topic, data) {
	subject.QueryInterface(Components.interfaces.nsIHttpChannel);
	if( subject.URI.host == 'www.youtube.com' &&
	    subject.getRequestHeader('Cookie').match(/s_tempdata.*autonav=1/) ) {
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
