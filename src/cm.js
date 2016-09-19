/**
  * common method
  **/
module.exports = function() {
    var NODE_ENV = 'development';
    var HOST = 'mock/';
    if (window.location.host == "m.lvmama.com") {
        NODE_ENV = 'production';
        HOST = 'http://m.lvmama.com';
    }

    //设置根域名cookie
    function setRootCookie(name, value, domain, path) {
        var _domain = domain;
        var _path = path;
        if (_domain) {
            _domain = ";domain=" + _domain;
        } else {
            _domain = "";
        }
        if (_path) {
            _path = ";path=" + _path;
        } else {
            _path = "";
        }
        var Days = 30; //此 cookie 将被保存 30 天
        var exp = new Date(); //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + _domain + _path + ";expires=" + exp.toGMTString();
    };

    //获取指定名称的cookie的值
    function getCookie(objName) {
        var arrStr = document.cookie.split(";");
        for (var i = 0; i < arrStr.length; i++) {
            var temp = arrStr[i].split("=");
            if (temp[0].trim() == objName) return decodeURIComponent(temp[1]);
        }
    };

    //设置cookie
    function setCookie(name, value) {
        var Days = 30; //此 cookie 将被保存 30 天
        var exp = new Date(); //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    };


    return {
        URL: NODE_ENV == 'production' ? {
            test: HOST + '/api/router/rest.do?method=api.com.biz.synTime&version=1.0.0&IS_DEBUG=1'
        } : {
            test: HOST + 'test.json'
        },
        setRootCookie: setRootCookie,
        getCookie: getCookie,
        setCookie: setCookie
    };
};