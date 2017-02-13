/**
 * MODULE - commonParam
 *
 * @author TBD
 *
 */
;(function(global) {

	var $ = JSpring.$,
		$oCreate = Object.create,
		_ua = navigator.userAgent,
		cp = JSpring.commonParam;

	cp.format = 'json';
	getChannel(cp);

	function getChannel (obj) {
		var firstChannel, secondChannel;

		if (_ua.indexOf("LVMM") > -1 && _ua.indexOf("iPhone; CPU") > -1) {
			firstChannel = "IPHONE";
			secondChannel = "AppStore";
		} else if (_ua.indexOf("LVMM") > -1 && _ua.indexOf("Android") > -1) {
			firstChannel = "ANDROID";
			secondChannel = _ua.substring(_ua.indexOf("ANDROID_") + 8, _ua.lastIndexOf("LVMM") - 1);
		} else if (_ua.indexOf("LVMM") > -1 && _ua.indexOf("iPad; CPU OS") > -1) {
			firstChannel = "IPAD";
			secondChannel = "AppStore";
		} else if (_ua.indexOf("Windows Phone") > -1 && _ua.indexOf("WebView") > -1) {
			firstChannel = "WP";
			secondChannel = "WPStore";
		} else {
			firstChannel = "TOUCH";
			secondChannel = "LVMM";
		}
		cp.firstChannel = firstChannel;
		cp.secondChannel = secondChannel;
	};

	$.extend($, {
		isIPhoneLVMM : $.isApp && $.isIOS,
		isIPadLVMM : $.isApp && $.isPad,
		isAndroidLVMM : $.isApp && $.isAndroid,
		isWindowsLVMM : $.isWebview && $.isWp,
		appVersion : _ua.replace(/.+LVMM\/([\d\.]+).*/, '$1')
	});

	return cp;
}(this || window));