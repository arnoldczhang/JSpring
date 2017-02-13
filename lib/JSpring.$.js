/**
 * MODULE - $
 *
 * @description Selector(like JQuery)
 * @author Arnold.Zhang
 *
 */
module.exports = function(_) {

  var 
          OBJ = {},
          ARRAY = [],
          STRING = '',
          w = window,
          doc = document,

          spaceREG = /\s+/g,
          $split = STRING.split,
          $concat = ARRAY.concat,
          $keys = Object.keys;

    function Query (selector) {
        if (typeof selector == 'object') {
            this.els = $.isArrayLike(selector) ? $.toArray(selector) : [selector];
            this.exist = !!this.els.length;
            return;
        }
        this.els = $.toArray(doc.querySelectorAll(selector));
        this.context = doc;
        this.exist = !!this.els.length;
    };

    Query.prototype = {
        constructor : Query,
        val : function val (value) {
            if (_.isVoid0(value)) {
                return this.els[0] ? this.els[0].value : '';
            }
            this.each(function (el) {
                el.value = value;
            });
            return this;
        },

        remove : function remove () {
            this.each(function (el) {
                _.remove(el);
            });
            return this;
        },

        each : function each (callback) {
            if (_.isFunction(callback)) {
                this.els.length && this.els.forEach(function (el, i, arr) {
                    callback(el, i, arr);
                });    
            }
            return this;
        },

        html : function _html (html) {
            if (_.isVoid0(html)) {
                return this.els[0].innerHTML;
            }
            this.each(function (el) {
                el.innerHTML = html;
            });
            return this;
        },

        contains : function contains (node) {
          if (!$.isNode(node)) {
            return this;
          }
          return this.els[0].contains(node);
        },

        attr : function attr (key, value) {
          if (!(1 in arguments)) {
            return this.els[0].getAttribute(key);
          }
          this.each(function (el, i) {
            el.setAttribute(key, value);
          });
          return this;
        },

        append : function append (child) {
            var frag = doc.createElement('div'), children;
            if (!$.isNode(child) && !child.length) {
              return this;
            }

            if (typeof child != 'string') {
                children = $.toArray(child);
            } else {
                frag.innerHTML = child;
                children = $.toArray(frag.childNodes);
            }

            this.each(function(el, index) {
              children.forEach(function(child) {
                el.appendChild(child);
              });
            });
            return this;
        },

        css : function css (cssHtml, value) {
            var _this = this;
            if (typeof cssHtml == 'object') {
                $keys(cssHtml).forEach(function (cssName) {
                    _this.each(function (el) {
                        el.style[cssName] = cssHtml[cssName];
                    });
                });
            } else if (typeof cssHtml == 'string' && !_.isVoid0(value)){
                this.each(function (el) {
                    el.style[cssHtml] = value;
                });
            } else {
                return getComputedStyle(this.els[0], null).getPropertyValue(cssHtml);
            }
            return this;
        },

        show : function show () {
            this.each(function (el) {
                el.style.display = 'block';
            });
        },

        hide : function hide () {
            this.each(function (el) {
                el.style.display = 'none';
            });
        },

        toggle : function toggle () {
            this.each(function (el) {
                var dis = el.style.display;
                el.style.display = dis =='block' ? 'none' : 'block';
            });
        },

        on : function on (evtType, callback, useCapture) {
            this.each(function (el) {
                el.addEventListener(evtType, callback, useCapture || false);
            });
            return this;
        },

        addClass : function addClass (className) {
            var classArr = $split.call(className, spaceREG);
            this.each(function (el) {
                classArr.forEach(function (cls) {
                    el.classList.add(cls);
                });
            });
            return this;
        },

        removeClass : function removeClass (className) {
            var classArr = $split.call(className, spaceREG);
            this.each(function (el) {
                classArr.forEach(function (cls) {
                    el.classList.remove(cls);
                });
            });
            return this;
        },

        hasClass : function hasClass (className) {
            return this.els[0].classList.contains(className);
        },

        find : function find (selector) {
            var elArr = [];
            if (typeof selector == 'string') {
                this.each(function(el) {
                    elArr = $concat.apply(elArr, el.querySelectorAll(selector));
                });
                return elArr;
            }
            return this;
        },

        eq : function (index) {
          return this.els[index] || false;
        },

        first : function () {
          return this.eq(0);
        },

        last : function () {
          return this.eq(this.els.length - 1);
        },

        children : function () {
          return $.toArray(this.eq(0).children);
        },

        scrollIntoView : function () {
            this.els[0].scrollIntoView();
            return
        }

    };

    function $ (selector) {
        if ($.isUndefined(selector)) {
          return $.warn('Query need a selector');
        }

        if (typeof selector == 'function') {
            return doc.addEventListener('DOMContentLoaded', function () {
              selector(w, doc);
            }, false);
        }
        return new Query(selector);
    };

    //FIXME $ need to be a global variable?
    w.$ = w.$ || $;
    _.extend($, _);
    return $;

};
