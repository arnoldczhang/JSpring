/**
 * MODULE - $location
 *
 * @function go
 * @function replace
 * @function back
 * @function assign
 * @author Arnold.Zhang
 *
 */
;(function(global) {
	global = global || window;
	var module = JSpring.module,
		$ = JSpring.$,
		$oCreate = Object.create,
		extendObj = $oCreate(null),
		$location = extendObj.$location = $oCreate(null),
		base = $('base'),
		lastPathName;

	$.extend($location, location);
	base.exist && ($location.base = /\.\//.test(base = base.attr('href')) 
		? base.replace(/\.([^\.]+)/, '$1') 
		: base[base.length - 1] == '/' ? base : (base + '/'));

	$location.go = function go (pathname, search) {

		//FIXME go with search, e.g '?name=abc'
		search = search || '';
		if (lastPathName != pathname) {
			lastPathName = pathname;
			setTimeout(function () {
				lastPathName = null;
			}, 300);
		} else {
			return;
		}

		$location.$search = $.getSearchObj(search);
		history.pushState(null, '', getUrl(pathname, search));
		return JSpring.hashLoad(pathname, {
			noSearch : true
		});
	};

	$location.replace = function replace (pathname, search) {
		search = search || '';
		$location.$search = $.getSearchObj(search);
		history.replaceState(null, '', getUrl(pathname, search));
		return JSpring.hashLoad(pathname, {
			noSearch : true
		});
	};

	$location.back = function back (step) {
		JSpring.backViewPort = true;
		return history.go($.isUndefined(step) ? -1 : step);
	};

	function getUrl (pathname, search) {
		return (!JSpring.router.html5Mode ? location.pathname + '#/' : '') + pathname + search;
	};

	$location.assign = $location.go;
	$.extend(module, extendObj);
	return $location;
}(this || window));