/**
 * MODULE - losc
 *
 * @author Keller&Arnold.Zhang
 *
 * @method cmCreateProductviewTag
 * @method cmCreateElementTag
 * @method cmCreatePageviewTag
 * @method cmCreateOrderTag
 * @method cmCreateShopAction9Tag
 * @method cmCreateRegistrationTag
 *
 */
;(function(global) {
	global = global || window;
	var module = JSpring.module,
		$oCreate = Object.create,
		extendObj = $oCreate(null),
		losc = extendObj.losc = $oCreate(null),
		agent = navigator.userAgent,
		channelObj = getChannel(),
		channel = channelObj.channel,
		newChannel = channelObj.newChannel;

	losc.getStatisticsType = function _getStatisticsType (PageID, CategoryID, productId, productName, Departure, type, elementId) {
            var isPrerender = agent.indexOf("prerender")!=-1;//是否是prerender访问
            if(isPrerender){
                return;
            }

            if (losc.cmCreateOrderTag) {
                //losc loaded
                return cmCreateTagProxy(PageID, CategoryID, productId, productName, Departure, type, elementId, channel);
            }

            var interval = setInterval(function() {
                if(typeof(_LVMAMA_COREMETRICS)!='undefined'){
                    cmCreateTagProxy(PageID, CategoryID, productId, productName, Departure, type, elementId, channel);
                    clearInterval(interval);
                    
                    /**
                        * cmCreateOrderTag
                        **/
                    losc.cmCreateOrderTag = cmCreateOrderTag;

                    /**
                        * cmCreateShopAction9Tag
                        **/
                    losc.cmCreateShopAction9Tag = cmCreateShopAction9Tag;

                    /**
                        * cmCreateRegistrationTag
                        **/
                    losc.cmCreateRegistrationTag = cmCreateRegistrationTag;
                }
            }, 200);
        };

        /**
        	* cmCreateProductviewTag
        	**/
        losc.cmCreateProductviewTag = function _cmCreateProductviewTag (PageID, CategoryID, productId, productName, Departure, elementId) {
        	return this.getStatisticsType (PageID, CategoryID, productId, productName, Departure, 'product', elementId);
        };

        /**
        	* cmCreateElementTag
        	**/
        losc.cmCreateElementTag = function _cmCreateElementTag (PageID, CategoryID, productId, productName, Departure) {
        	return this.getStatisticsType (PageID, CategoryID, productId, productName, Departure, 'element');
        };

        /**
        	* cmCreatePageviewTag
        	**/
        losc.cmCreatePageviewTag = function _cmCreatePageviewTag (PageID, CategoryID, productId, productName, Departure) {
        	return this.getStatisticsType (PageID, CategoryID, productId, productName, Departure, 'page');
        };

        function cmCreateTagProxy (PageID, CategoryID, productId, productName, Departure, type, elementId, channel) {
            _LVMAMA_COREMETRICS.init(document.domain);
            if(type == 'product'){
                cmCreateProductviewTag(channel + "_" + elementId + "_" +productId,productName, channel + "_" + CategoryID , channel + Departure);
            }else if(type == 'element'){
                cmCreateElementTag(channel + "_" + PageID, channel + "_" + CategoryID);
            }else if(type == 'page'){
                cmCreatePageviewTag(channel + "_h5_" + PageID, channel + "_" + CategoryID, '', '',channel + Departure);
            }
        };

        function getChannel () {
        	var channel, newChannel;
        	if (agent.indexOf('Mobile') > 0 && agent.indexOf('iPhone OS') > 0 && agent.indexOf('LVMM') > 0) {
        	    channel = "ip";
        	    newChannel = 'app';
        	} else if (agent.indexOf('Mobile') > 0 && agent.indexOf('Android') > 0 && agent.indexOf('LVMM') > 0) {
        	    channel = "ad";
        	    newChannel = 'app';
        	} else if (agent.match(/MicroMessenger/i) == "MicroMessenger") {
        	    channel = "weixin";
        	    newChannel = 'weixin';
        	}else if(agent.indexOf('Windows Phone')!=-1 && agent.indexOf('WebView')!=-1){
        	    channel = "APP_WP";
        	    newChannel = 'app';
        	}else {
        	    channel = "wap";
        	    newChannel = 'wap';
        	}

        	return {
        		channel : channel,
        		newChannel : newChannel
        	};
        };
	
	$.extend(module, extendObj);
	return losc;
}(this || window));