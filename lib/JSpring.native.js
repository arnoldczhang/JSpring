/**
 * MODULE - NativeUtil
 *
 * NativeUtil.lvCommon("lvJSSetTitle",{
 *       "title" : CONFIG.apptitle || title
 *  });
 *
 * @author Tanjiasheng
 */
;(function(global) {
	global = global || window;
	var module = JSpring.module,
		$ = JSpring.$,
		$oCreate = Object.create,
		extendObj = $oCreate(null);

	/*****************安卓和ios回传执行函数声明开始(后续会统一回调函数名)********************/
	if (!window.NativeUtil) {
	    //安卓
	    var setContact,shareSuccess,shareFail,onsuccess,onfail,setHotelDate,passCityValue;
	    //ios
	    var passContact,passHotelDate,passStationValue,viewWillAppear;
	    //安卓回调函数声明
	    window.call = function (data,mname) {
	        NativeUtil.callbackMap[mname](data);      
	    }
	    //终端版本判断
	    var ua = navigator.userAgent,
	    isIos_nu = ua.indexOf('iPhone OS') > -1 || ua.indexOf('iPad') > -1,
	    isAnd_nu = ua.indexOf('Android') > -1,
	    is7_5_nu = ua.indexOf('LVMM/7.5') > -1,
	    isLvClient_nu = ua.indexOf('LVMM') > -1;
	    /*****************安卓和ios传执行函数声明结束********************/
	    /*****************IOS初始化&注册handler开始********************/
	    if(is7_5_nu && isIos_nu) {
	        function connectWebViewJavascriptBridge(callback) {
	            if (window.WebViewJavascriptBridge) {
	                callback(WebViewJavascriptBridge);
	            } else {
	                document.addEventListener('WebViewJavascriptBridgeReady', function () {
	                    callback(WebViewJavascriptBridge);
	                }, false);
	            }
	        }

	        connectWebViewJavascriptBridge(function (bridge) {
	            bridge.init(function (message, responseCallback) {
	                message = document.getElementsByName('share')[0].getAttribute(message);
	                if (responseCallback) {
	                    responseCallback(message);
	                }
	            });
	            //初始化完成，将队列中的方法执行
	            if (NativeUtil && NativeUtil.execArr.length > 0 && NativeUtil.lvCommon) {
	                for (var i = 0; i < NativeUtil.execArr.length; i++) {
	                    NativeUtil.lvCommon(NativeUtil.execArr[i].methodName, NativeUtil.execArr[i].parameter, NativeUtil.execArr[i].callbackFun);
	                }
	                NativeUtil.execArr = [];
	            }
	        });
	    }else if(isLvClient_nu && isIos_nu){
	        function setupWebViewJavascriptBridge(callback) {
	            if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
	            if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
	            window.WVJBCallbacks = [callback];
	            var WVJBIframe = document.createElement('iframe');
	            WVJBIframe.style.display = 'none';
	            WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
	            document.documentElement.appendChild(WVJBIframe);
	            setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
	        }
	        setupWebViewJavascriptBridge(function(bridge) {
	            //初始化完成，将队列中的方法执行
	            if (NativeUtil && NativeUtil.execArr.length > 0 && NativeUtil.lvCommon) {
	                for (var i = 0; i < NativeUtil.execArr.length; i++) {
	                    NativeUtil.lvCommon(NativeUtil.execArr[i].methodName, NativeUtil.execArr[i].parameter, NativeUtil.execArr[i].callbackFun);
	                }
	                NativeUtil.execArr = [];
	            }
	        });
	    }
	    /*****************IOS初始化&注册handler结束********************/
	    //封装对象
	    var NativeUtil = {
	        debug: false,
	    	_ua : navigator.userAgent,
	    	_param : {},
	        execArr : [],
	        callbackMap : {},
	        _classNameMap : {//ios和安卓跳转页面对应类名存储结构
	            mainView: {//首页
	                ios : "MyLvmamaController",
	                and : "MainActivity"
	            },
	            Place : {//门票频道页
	                and : "TicketFindActivity",
	                ios : "PlaceViewController"
	            },
	            RouteZby : {//周边游频道页
	                and : "HolidayNearbyActivity",
	                ios : "RouteZbyViewController"
	            },
	            RouteGny : {//国内游频道页
	                and : "HolidayDomesticActivity",
	                ios : "RouteGnyViewController"
	            },
	            RouteCjy : {//出境游频道页
	                and : "HolidayAbroadActivity",
	                ios : "RouteCjyViewController"
	            },
	            Hotel : {//酒店频道页
	                and : "HotelIndexSearchActivity",
	                ios : "HotelHomeController"
	            },
	            Ship : {//游轮频道页
	                and : "YouLunActivity",
	                ios : "ShipViewController"
	            },
	            Visa : {//签证频道页
	                and : "VisaIndexActivity",
	                ios : "VisaViewController"
	            },
	            MicroTour : {//微游首页
	                and : "TravelActivity750",
	                ios : "MicroTourViewController"
	            },
	            MicroTourEditInfo : {//编辑游记
	                and : "EditTravelActivity",
	                ios : "MicroTourEditInfoViewController"
	            },
	            MyTour : {//我的游记
	                and : "MineTravelActivity ",
	                ios : "MyTourController"
	            },
	            TravelPersonList : {//游玩人
	                and : "MineTravelActivity",
	                ios : "TravelPersonListController"
	            },
	            CouponUse : {//优惠券
	                and : "",
	                ios : "CouponUseViewController"
	            },
	            OrderVoChoosePay : {//去支付
	                and : "BookOrderPayVSTActivity",
	                ios : "OrderVoChoosePayController"
	            },
	            Login : {//登录
	                and : "LoginActivity",
	                ios : "LoginViewController"
	            },
	            MicroTourTripDetail : {//微游详情
	                and : "TravelDetailActivity",
	                ios : "MicroTourTripDetailController"
	            },
	            CitySelectView : {//城市选择
	                and : "",
	                ios : "CitySelectViewController"
	            },
	            PlaceCitySelectView : {//站点选择
	                and : "",
	                ios : "PlaceCitySelectViewController"
	            },
	            MyCommentView : {
	                and : "MineCommentActivity",
	                ios : "MyCommentViewController"
	            },
	            AroundHotel:{//附近热销酒店
	                and: "NearbyActivity ",
	                ios: "AroundHotelViewController"
	            },
	            AroundProduct:{//周边景点套餐
	                and: "NearbyActivity",
	                ios: "AroundProductViewController"
	            },
	            MapView:{//地图页面
	                and: "TicketLocationMapActivity",
	                ios: "MapViewController"
	            },
	            AroundMapView: {
	                and: "NearbyMapTicketActivity",
	                ios: "AroundMapViewController"
	            },
	            MineCoupon: {
	                and: "MineCouponActivity",
	                ios: "CouponViewController"
	            }
	        },
	        //调用native方法核心函数
	    	lvCommon: function(methodName,parameter,callbackFun){
	            var param,
	                that = this;
	            if(typeof parameter == "function"){
	                callbackFun = parameter;
	                param = {};
	            }else{
	                param = parameter || {};
	            }
	            that.callbackMap[methodName] = callbackFun;
	    		var toSend = '{"parameter":' + JSON.stringify(param) + ',"methodName":"' + methodName +'"}';
	            if(that.debug){
	                alert("param:--------" + toSend);
	            }
	            var conObj = window.WebViewJavascriptBridge || window.lvmm;
	            if (conObj && conObj.callHandler && isLvClient_nu) {
	                if (isAnd_nu) {
	                    conObj.callHandler('lvJSCallNativeHandler', toSend, call);
	                }else{
	                    conObj.callHandler('lvJSCallNativeHandler', toSend, function(data){
	                        if (typeof callbackFun == "function") {
	                            callbackFun(data);
	                        }
	                    });
	                }       
	            }else{//桥未初始化完成，将请求参数压入队列
	                var exPara = {
	                    "methodName": methodName,
	                    "parameter": parameter,
	                    "callbackFun": callbackFun
	                }
	                that.execArr.push(exPara);
	            }
	    	},
	        //取得Android/IOS页面对应的className
	        getPageClassName: function(pageName){
	            if(isIos_nu){
	                return this._classNameMap[pageName].ios;
	            }else if(isAnd_nu){
	                return this._classNameMap[pageName].and;
	            }
	        },
	        //页面跳转
	        goClass: function(pageName,extraParams){
	            var className = this.getPageClassName(pageName);
	            this._param = {className:className};
	            for(var key in extraParams){
	                this._param[key] = extraParams[key];
	            }
	            // alert(this._param);
	            this.lvCommon("lvJSGoClass",this._param);
	        }
	    }

	    window.onload = function(){
	        NativeUtil.lvCommon("lvJSHideLoading");
	    }
	}
	
	$.extend(module, {NativeUtil : NativeUtil});
	window.NativeUtil = NativeUtil;
	return NativeUtil;
}(this || window));