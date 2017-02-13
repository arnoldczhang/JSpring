/**
 * PLUGIN - cityPicker
 *
 * @name CityPicker
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

    var css = require('./cityPicker.css');
    var tpl = require('./cityPicker.tpl');
    var defaultConfig = {
        uniqId : 'cityPicker',
        tagName : 'citypicker',
        transitionOut : 'slideOutRight',
        transitionIn : 'slideLeft',
        template : tpl,
        replace : false
    };


    function CityPicker (config, opts) {
        if (!(this instanceof CityPicker)) {
            return new CityPicker(config, opts);
        }

        var _this = this;
        $.each($keys(config), function (v) {
          _this[v] = config[v];
        });

        _this.service = service.call(_this);
        _this.controller = controller.call(_this);
        _this.render();
    };

    proto = CityPicker.prototype;
    $.extend(proto, defaultConfig);
    proto.constructor = CityPicker;
    proto.render = function render () {
        var _this = this;
        return JSpring([
            _this.uniqId
            , _this.controller
            , _this.service
            , _this.template
            , _this.tagName
        ], {
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
            var letterList = [],
                  letterCityList = {},
                  oldHash= '';

            _this.data.forEach(function (d) {
                var py = d.pinyin[0];
                if ($.inArray(letterList, py)) {
                    $.push(letterCityList[py], d);
                } else {
                    $.push(letterList, py);
                    letterCityList[py] = [d];
                }
            });

            var i = 0;
            function anchorFn (el) {
                var hash = $.data(el, 'hash');
                if (oldHash === hash) {
                    return false;
                } else if (hash) {
                    oldHash = hash;
                    return $(hash).scrollIntoView();
                }
            };

            return {
                cityInfo : _this.data,
                letterCityList : letterCityList,
                letterList : letterList.sort(),
                anchorJump : function (e) {
                    return anchorFn(e.target);
                },
                anchorScroll : function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var touch = (e.touches || [])[0] || e;
                    return anchorFn(doc.elementFromPoint(touch.pageX, touch.pageY));
                },
                getCityInfo : function (e) {
                    $.isFunction(_this.callback) && _this.callback($.data(e.target), _this);

                }
            };
        }
    };

    CityPicker.init = function init (config) {
        return new CityPicker(config);
    };

    CityPicker.destroy = function destory (inst) {
        var vm = JSpring.vm[inst.uniqId];
        return $.transitionRemove(vm.viewport, inst.transitionOut);
    };

    JSpring.plugin['cityPicker'] = CityPicker;
    return CityPicker;
    
 }(this || window, document));
