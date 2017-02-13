/**
 * PLUGIN - BottomFilter
 *
 * @name BottomFilter
 * @function init - 初始化（必须）
 * @function destroy - 销毁（必须）
 * @param config - 插件配置
 * @author Arnold.Zhang
 *
 */
 ;(function(global, doc) {
    global = global || window;
    doc = doc || document;
    var proto,

          STRING = '',

          spaceREG = /\s+/g,
          $keys = Object.keys,
          $lower = STRING.toLocaleLowerCase;

    var css = require('./bottomFilter.css');
    var tpl = require('./bottomFilter.tpl');
    var defaultConfig = {
        uniqId : 'bottomFilter',
        // tagName : 'bottomFilter',
        transitionOut : 'fadeIn',
        transitionIn : 'slideUp',
        template : tpl,
        replace : false
    };


    function BottomFilter (config, opts) {
        if (!(this instanceof BottomFilter)) {
            return new BottomFilter(config, opts);
        }

        var _this = this;
        $.each($keys(config), function (v) {
          _this[v] = config[v];
        });

        _this.service = service.call(_this);
        _this.controller = controller.call(_this);
        _this.render();
    };

    proto = BottomFilter.prototype;
    $.extend(proto, defaultConfig);
    proto.constructor = BottomFilter;
    proto.render = function render () {
        var _this = this;
        return JSpring([
            _this.uniqId
            , _this.controller
            , _this.service
            , _this.template
            , _this.tagName
        ], {
            container : $(_this.tagName || doc.body),
            keepViewport : true,
            transitionIn : _this.transitionIn,
            replace : _this.replace
        });
    };

    function controller () {
        var _this = this;
        return function ($scope, $, module, plugin) {
            ;
        };
    };

    function service () {
        var _this = this;
        return function ($, module, plugin) {
            
            return {
                tabList : [
                    {
                        word : '排序',
                        image : 'http://pic.lvmama.com/mobile/img/lvmama/v7/module/internal/paly-day0.png'
                    },
                    {
                        word : '价格',
                        image : 'http://pic.lvmama.com/mobile/img/lvmama/v7/module/internal/paly-day0.png'
                    },
                    {
                        word : '筛选',
                        image : 'http://pic.lvmama.com/mobile/img/lvmama/v7/module/internal/paly-day0.png'
                    }
                ],
                isDoubleFlag : false,
                isSingleFlag : false,
                matteFlag : false,
                tabFlag : true,
                isFilterFlag : false,
                toggleMatta : function toggleMatta (word) {
                    if (word == '筛选') {
                        this.isDoubleFlag = !this.isDoubleFlag;
                    } else if (word == '价格') {
                        this.isSingleFlag = !this.isSingleFlag;
                    } else {
                        this.isSingleFlag = !this.isSingleFlag;
                    }
                    this.matteFlag =!this.matteFlag;
                    if (this.matteFlag) {
                        $('#viewport_' + proto.uniqId).css('height', '100%');
                    } else {
                        $('#viewport_' + proto.uniqId).css('height', '49px');
                    }
                }
            };
        }
    };

    BottomFilter.init = function init (config) {
        return new BottomFilter(config);
    };

    BottomFilter.destroy = function destory (inst) {
        var vm = JSpring.vm[inst.uniqId];
        return $.transitionRemove(vm.viewport, inst.transitionOut);
    };

    JSpring.plugin['BottomFilter'] = BottomFilter;
    return BottomFilter;
    
 }(this || window, document));
