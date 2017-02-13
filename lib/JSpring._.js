/**
 * MODULE - _
 *
 * @description Common Methods (like underscore)
 * @author Arnold.Zhang
 *
 */
module.exports = (function(w, doc) {

    var 
          OBJ = {},
          ARRAY = [],
          STRING = '',
          doc = doc || document,
          BODY = doc.body,

          UA = navigator.userAgent,
          spaceREG = /\s+/g,
          equalREG = /\=/,
          forChildREG = /(@[^@\.'"\]]+)/,
          booleanLiteralREG = /^(?:true|false)$/,
          irReplaceKeyREG = /^((?!\$event).)*$/,
          allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' 
            + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' 
            + 'encodeURIComponent,parseInt,parseFloat',
          allowedKeywordsREG = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)'),
          identRE = /[^\w\$\.'"{>;\u4E00-\u9FA5\/\?\-](?:[A-Za-z_$@][\w$]*)/g,
          
          $keys = Object.keys,
          $oCreate = Object.create,
          $shift = ARRAY.shift,
          $split = STRING.split,
          $toString = OBJ.toString,
          $oCreate = Object.create,
          $substr = STRING.substr,
          $replace = STRING.replace,
          $substring = STRING.substring,
          $lower = STRING.toLocaleLowerCase;


    /**
      * browser navigator userAgent
      **/
    var BROWSER = {
      UC : /UCBrowser/,
      Safari : /Safari/,
      Moz : /Firefox/,
      QQ : /QQBrowser/,
      Sogou : /SogouMobileBrowser/
    };

    /**
      * platform navigator userAgent
      **/
    var PLATFORM = {
      Android : /Android/,
      IOS : /iPhone/,
      Wp : /Windows Phone/,
      App : /LVMM/,
      Pad : /iPad/,
      Webview : /WebView/,
      Wechat : /MicroMessenger/
    };


    /**
      * typeof enum
      **/
    var ENUM = {
      'null' : null,
      void0 : void 0,
      string : 'string',
      number : 'number',
      'function' : 'function',
    };


    /**
      * useful nodeType
      **/
    var NODETYPE = {
      Element : 1,
      Attr : 2,
      Text : 3,
      Comment : 8,
      Document : 9,
      DocumentFragment : 11
    };


    /**
      * warning info
      **/
    var WARN = {
      format : function _format (replacer, expr) {
        return REGEXP.replace(REGEXP.replace('expression [{1}] not match the format of {2} attribute', /\{1\}/, expr), /\{2\}/, replacer);
      },
      keyset : 'keyset format error',
      lack : 'lack of necessary params',
      fn : 'param 1 should be a function',
      forSame : 'child and parent cannot be the same in the for',
      filter : 'you haven`t add the filter or the filter isn`t exist',
      container : 'the viewport haven`t found the container to place in',
      oneAttr : 'you can only set one attribute with this data format',
      beObj : 'the param MUST BE OBJECT',
      jsonStr : 'have you "JSON.stringify(obj)" ?'
    };


    /**
      * RegExp Object
      */
    var REGEXP = {
      exec : function exec (regExp, word) {
        var result = regExp.exec(word);
        regExp.lastIndex = 0;
        return result;
      },

      test : function test (regExp, word) {
        var result = regExp.test(word);
        regExp.lastIndex = 0;
        return result;
      },

      replace : function replace (word, regExp, regBack) {
        return $replace.call(word, regExp, regBack);
      }
    };


    /**
      * _
      **/
    var _ = {

      warn : function warn () {
        return Function.apply.call(console.warn, console, arguments);
      },

      log : function log () {
        var args = _.toArray(arguments),
              lvColor = 'color:#d30775';

        if (args.length == 1) {
          args[0] = '%c' + args[0];
          args.unshift('%c/**\n*');
          args.push('\n%c**/');
          args = [args.join(' ')];
          args.push(lvColor, lvColor + ';font-size:24px;', lvColor);
        }
        
        return Function.apply.call(console.log, console, args);
      },

      err : function err () {
        return Function.apply.call(console.error, console, arguments);
      },

      time : function time () {
        // return Function.apply.call(console.time, console, arguments);
      },

      timeEnd : function timeEnd () {
        // return Function.apply.call(console.timeEnd, console, arguments);
      },

      isArrayLike : function isArrayLike (obj) {
        if (obj == null || _.isWindow(obj)) {
          return false;
        }

        var length = obj.length;
        if (obj.nodeType === 1 && length) {
          return true;
        }

        return _.isString(obj) || _.isArray(obj) || length === 0 ||
               typeof length === 'number' && length > 0 && (length - 1) in obj;
      },

      isWindow : function isWindow (obj) {
        return obj && obj.window === obj;
      },

      /**
       * made parseInt a lot faster.
       */
      toInt : function toInt (number) {
        return number >> 0;
      },

      bool : function bool (val) {
        return !!val;
      },

      toArray : function toArray (list, start) {
        var len;
        if (len = list.length) {
          start = start || 0;
          var i = len - start;
          var ret = new Array(i);
          while (i--) {
              ret[i] = list[i + start];
          }
          return ret;
        }
        return _.isArray(list) ? [] : 'length' in list ? list : [list];
      },

      indexOf : function indexOf (arr, obj, strict) {
        var i = arr.length;
        if (strict) {
          while (i--) {if (arr[i] === obj) return i; }
        } else {
          while (i--) {if (arr[i] == obj) return i; }
        }
        return -1;
      },

      inArray : function inArray (arr, child) {
        if (_.isArray(arr)) {
          return !!~_.indexOf(arr, child);
        }
        return !!~_.indexOf(_.toArray(arr), child);
      },

      inString : function inString (str, child) {
        if (_.isString(str)) {
          return str.indexOf(child) > -1;
        }
        return false;
      },

      push : function push (arr, child) {
        if (_.isArray(arr)) {
          arr[arr.length] = child;
        }
        return arr;
      },

      uniqPush : function uniqPush (arr, child) {
        if (_.isArray(arr)) {
          return !_.inArray(arr, child) && _.push(arr, child);
        }
        return false;
      },

      each : function each (arr, callback, opts) {
          var result, attrArr, key;
          opts = opts || {};
          if (arr && arr.length) {
              for (var i = opts.start || 0, l = opts.end || arr.length; i < l; i += 1) {
                  if (!_.isVoid0(result = callback(arr[i], i, arr))) {
                      return result;
                  }
              }
          } else if (_.isObject(arr)) {
            if (!opts.deep) {
              for (i = 0, attrArr = $keys(arr), l = attrArr.length; i < l; i += 1) {
                key = attrArr[i];
                if (!_.isVoid0(result = callback(arr[key], key, arr))) {
                  return result;
                }
              }
            } else {
              for (key in arr) {
                if (!_.isVoid0(result = callback(arr[key], key, arr))) {
                    return result;
                }
              }
            }
          }
          return false;
      },

      'delete' : function _delete (url, data, opts) {
        return _.ajax(url, 'delete', _.isObject(data) ? data : {}, opts);
      },

      put : function put (url, data, opts) {
        return _.ajax(url, 'put', _.isObject(data) ? data : {}, opts);
      },

      post : function post (url, data, opts) {
        return _.ajax(url, 'post', _.isObject(data) ? data : {}, opts);
      },

      get : function get (url, data, opts) {
        return _.ajax(url, 'get', _.isObject(data) ? data : {}, opts);
      },

      /**
      * $.jsonp('//api.map.baidu.com/geocoder/v2/?ak=VIqafisYEvp6E0j0j0DeWkny&location=31.238032669517935,121.38725332252167&output=json&pois=0&coordtype=wgs84ll&callback=baidu_jsonp_1', 
      *    function (res) {
      *        console.log(res);
      *    });
      **/
      jsonp : function jsonp (url, opts, callback) {

        if (_.isFunction(opts)) {
          callback = opts;
          opts = {};
        }

        var jsonpREG = new RegExp((opts.jsonp || 'callback') + '=([^&]+)', 'g'),
              script = document.createElement("script"),
              result = url.match(jsonpREG),
              cbName;

        if (!result) {
          return _.err('必须包含回调方法名');
        }

        if (!_.isFunction(callback)) {
          callback = function (res) {
            return res;
          }
        }

        cbName = $split.call(result[result.length - 1], equalREG)[1];
        script.type = "text/javascript";
        script.src = url;
        BODY.appendChild(script);
        window[cbName] = function (res) {
          BODY.removeChild(script);
          callback(res);
        };
      },

      getText : function getText (url, data, opts) {
        opts = opts || {};
        return _.ajax(url, 'get', _.isObject(data) ? data : {}, {resType : 'text', version : opts.version});
      },

      ajax : function ajax (url, method, data, opts) {
        opts = opts || {};
        opts.version && (data._v = _.genUUID());

        if (opts.resType != 'text') {
          _.extend(data, JSpring.commonParam || $oCreate(null));
        }

        data = _.serialize(data);
        return new Promise(function(resolve, reject){
            return _.http(url, $lower.call(method), data, opts, resolve, reject);
        }, opts);
      },

      http : function http (url, method, data, opts, resolve, reject) {
        opts = opts || {};
        var client = new XMLHttpRequest(),
              responseType = opts.resType || 'json';

        if (method == 'get') {
          url += /\?/.test(url) ? '&' + data : '?' + data;
          data = null;
        }

        client.open(method, url, true);

        //接口通过校验标识
        client.setRequestHeader('signal', 'ab4494b2-f532-4f99-b57e-7ca121a137ca');
        client.onreadystatechange = handler;
        try {
          client.responseType = responseType;
        } catch (err) {
          client.setRequestHeader('responseType', responseType);
        }
        client.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        client.send(data);

        function handler() {
          var response;
          if (this.readyState !== 4) {
            return;
          }

          if (this.status === 200) {
            response = this.response;
            if (responseType == 'json') {
              _.isString(response) && (response = JSON.parse(response));
            }
            resolve(response);
          } else {
            reject(new Error(this.statusText));
          }
        };
      },

      serialize : function serialize (data) {
          var result = '';
          if (_.isObject(data)) {
              _.each($keys(data), function seriKeyEach (key) {
                var value;
                if (_.isArray(value = data[key])) {
                    _.each(value, function seriValueEach (val) {
                      if (!_.isVoid0(val)) {
                        result += key + '=' + encodeURIComponent(val) + '&';
                      } else {
                        result += key + '=&';
                      }
                    });
                } else {
                  if (!_.isVoid0(value)) {
                    result += key + '=' + encodeURIComponent(value) + '&';
                  } else {
                    result += key + '=&';
                  }
                }
              });
          }
          return $substr.call(result, 0, result.length - 1);
      },

      genUUID : function genUUID (prefix, opts) {
          prefix = _.isUndefined(prefix) ? 'LVMM' : prefix;
          return $substr.call(REGEXP.replace(prefix + Math.random(), /0\./g, ""), 0, 15);
      },

      createAttrMap : function createAttrMap (arr, fnArr) {
        var obj = $oCreate(null);
        _.each(arr, function createAttrMapEach (v, i) {
          obj[v] = fnArr[i];
        });
        return obj;
      },

      isNode : function isNode (node) {
        return !!(node && node.nodeType);
      },

      remove : function remove (node) {
        var parent;
        if (this.isNode(node) && (parent = this.parent(node))) {
          return parent.removeChild(node);
        }
        return false;
      },

      clone : function clone (node, deep) {
        if (this.isNode(node)) {
          return node.cloneNode(deep || true);
        }
        return false;
      },

      delAttr : function delAttr (node, key) {
        if (!this.isNode(node)) {
          return false;
        }
        node.removeAttribute(key);
        return node;
      },

      attr : function attr (node, key, value) {
        if (!this.isNode(node)) {
          return false;
        }

        if (!(2 in arguments)) {
          return node.getAttribute(key);
        }

        if (key in node) {
          node[key] = value;
        } else {
          node.setAttribute(key, value);
        }
        return node;
      },

      parent : function parent (node) {
        if (!this.isNode(node)) {
          return false;
        }
        return node.parentNode || false;
      },

      replace : function replace (node, newNode) {

        if (!this.isNode(node) || !this.isNode(newNode)) {
          return false;
        }

        var parent = this.parent(node);
        parent && parent.replaceChild(newNode, node);
        return this;
      },

      before : function before (node, target, parent) {
        var _parent;
        if (!this.isNode(node) || !this.isNode(target)) {
          return false;
        }
        _parent = this.parent(node);
        _parent ? _parent.insertBefore(target, node)
          : parent ? parent.appendChild(target) : null;
        return this;
      },

      after : function after (node, target, parent) {
        var sibling, _parent;
        if (!this.isNode(node)) {
          return false;
        }

        if (sibling = node.nextSibling) {
          return _.before(sibling, target);
        }
        _parent = this.parent(node) || parent;
        _parent ? _parent.appendChild(target) : null;
        return this;
      },

      next : function next (node) {
        var nextSibling;
        if (!this.isNode(node)) {
          return false;
        }

        nextSibling = node.nextSibling;
        while(nextSibling) {
          if (!this.isText(nextSibling)) {
            return nextSibling;
          }
          nextSibling = nextSibling.nextSibling;
        }
        return false;
      },

      last : function last (obj) {
        if (obj.length) {
          return obj[obj.length - 1];
        }
        return obj;
      },

      inDOC : function inDOC (node, ct) {
        ct = ct || doc;
        if (!ct || !ct.contains) {
          return false;
        }
        return ct.contains(node);
      },

      isReferType : function isReferType (obj) {
        return typeof obj === 'object' || typeof obj === 'symbol';
      },

      eq : function eq (v1, v2, deep) {
        var _this = this, result, keySet;
        if (_.isArray(v1) && _.isArray(v2)) {
          if (v1.length !== v2.length) {
            return false;
          } else if (v1.toString() == '' && v2.toString() == '') {
            return true;
          }

          return _.each(v1, function eqArrEach (v, i) {
            if (_.isReferType(v) && _.isReferType(v2[i])) {
              return _this.eq(v, v2[i]);
            }

            if (v != v2[i]) {
              return false;
            }
          });
        }

        if (_.isObject(v1) && _.isObject(v2)) {
          if ((keySet = $keys(v1)).length !== $keys(v2).length) {
            return false;
          }

          return _.each(keySet, function eqObjEach (k, i) {
            if (_.isReferType(v1[k]) && _.isReferType(v2[k])) {
              return _this.eq(v1[k], v2[k]);
            }

            if (v1[k] != v2[k]) {
              return false;
            }
          });
        }
        return true;
      },

      getFnBody : function getFnBody (vm, exp, noSpace) {
        var fnBody = vm.cach.get('exp'),
              space = noSpace ? '' : ' ';

        if (!fnBody[exp]) {
          fnBody[exp] = REGEXP.replace(space + exp, identRE, identReplacer);
        }
        return fnBody[exp];
      },

      getDiyFnBody : function getDiyFnBody (vm, exp, opts) {
        opts = opts || {};
        var fnBody = vm.cach.get('exp'),
              space = opts.noSpace ? '' : ' ';

        if (!fnBody[exp]) {
          fnBody[exp] = REGEXP.replace(space + exp, opts.identRE || identRE, identReplacer);
        }
        return fnBody[exp];
      },

      data : function data (node, key, value) {
        if (!this.isNode(node)) {
          return false;
        }

        if (!(1 in arguments)) {
          return node.dataset;
        }

        if (!(2 in arguments)) {
          return node.dataset[key];
        }
        
        node.dataset[key] = value;
        return node;
      },

      transitionRemove : function transitionRemove (el, effect, backFlg) {
        var zIndex = el.style.zIndex;
        var endFlag = false;
        backFlg && (el.style.zIndex = 99999);
        el.classList.add(effect);
        el.addEventListener('webkitAnimationEnd', animationEnd, false);

        //2016.8.18 fix webkitAnimationEnd not triggered
        setTimeout(animationProxyEnd, 501);

        function animationEnd (e) {
          animationProxyEnd(e);
        };

        function animationProxyEnd (e) {
          if (endFlag) return;
          endFlag = true;
          el.style.display = 'none';
          el.style.zIndex = zIndex;
          el.classList.remove(effect);
          el.classList.remove('effect_active');
          el.removeEventListener('webkitAnimationEnd', animationEnd);
          _.remove(el);
        };
      },

      isNaN : function isNaN (value) {
        return _.isNumber(value) && value != value;
      },

      extend : function _extend (target, source) {
        if (!(1 in arguments)) {
              source = target;
              target = {};
        }
        if (_.isArray(source)) {
          target = [];
          _.each(source, function (s, i) {
            target[i] = s;
          });
        } else {
          $keys(source).forEach(function (s) {
              target[s] = !_.isVoid0(source[s]) ? source[s] : '';
          });  
        }
        return target;
      },

      deepExtend : function deepExtend (tObj, sObj) {
        tObj = tObj || {};
        for(var i in sObj){   
            if(typeof sObj[i] !== "object"){   
                tObj[i] = sObj[i];   
            }else if (sObj[i].constructor == Array){   
                tObj[i] = this.extend(sObj[i]);
            }else{   
                tObj[i] = tObj[i] || {};   
                this.deepExtend(tObj[i],sObj[i]);   
            }   
        }
        return tObj;
      },

      isGoodBrowser : function isGoodBrowser () {
        return !_.isMoz;
      },

      getStrVal : function getStrVal (value) {
        return (this.isUndefined(value) || this.isNull(value)) ? '' : value;
      },

      isVoid0 : function isVoid0 (value) {
        return value == ENUM.void0;
      },

      createLoadingImg : function createLoadingImg () {
        var str = '<div class="dataLoading">' +
                '<i></i><i></i>' +
                '<span>加载中...</span>' +
                '</div>' +
                '<div class="loadingMask"></div>',
                div = doc.createElement('div');

        div.innerHTML = str;
        div.ontouchmove = function (e) {
          e.preventDefault();
        }
        return div;
      },

      cach : (function () {
        var cach = $oCreate(null);
        return {
          get : function getCach (key) {
            return cach[key];
          },

          set : function setCach (key, value) {
            if (_.isString(key)) {
              cach[key] = value;
            }
          },
          
          remove : function removeCach (key) {
            delete cach[key];
          },

          clear : function clearCach () {
            cach = $oCreate(null);
          }
        };
      } ()),

      syncContainerHeight : function syncContainerHeight (inst, height) {
        var container = inst.container,
              viewport = inst.viewport;

        container.css('height', '100%')
          .css('height', height || (viewport.offsetHeight + 'px'));
      },

      getSearchObj : function getSearchObj (search) {

        var obj = $oCreate(null);

        if (!search) {
          return obj;
        }
        var arr = search.split(/\?|&/);

        if (arr[0] == '') {
          arr.shift();
        }

        $.each(arr, function convertEach (v) {
          var vArr = v.split('='),
                key = vArr[0],
                value = vArr[1];

          if (!$.isUndefined(obj[key])) {
            !$.isArray(obj[key]) && (obj[key] = [obj[key]]);
            $.push(obj[key], value);
          } else {
            obj[key] = vArr[1];
          }
        });
        return obj;
      },

      compileJsonStr : function compileJsonStr (str) {

        try {

          if (_.isString(str)) {
            return JSON.parse(str.replace(/&quot;/g, "\""));
          } else {
            _.warn(WARN.jsonStr);
          }
          
        } catch (err) {
          _.warn(err);
        }
      }

    };


    /**
      * Promise (like es6 Promise)
      */
    function Promise (callback, opts) {
        if (!(this instanceof Promise)) {
            return new Promise(callback, opts);
        }
        var _this = this;
        opts = opts || {};
        _this.callback = callback;
        _.extend(_this, opts);
        _this._cbQueue = [];
        _this._fbQueue = [];
        _this.promiseId = _.genUUID('promise_');
        _this.cb = function (res) {return _this.res = res; };
        _this.fb = function (err) {return _this.err = err; };
        _this.init(callback, {inst : _this});
    };

    Promise.prototype = {
      constructor : Promise,
      init : function init (callback, opts) {
        opts = opts || {};
        var inst = opts.inst;
        inst.define(opts.inst);
        if (_.isFunction(callback)) {
            callback.call(inst, inst.cb, inst.fb);
        }
      },

      define : function define (inst) {
          var pId = inst.promiseId;
          inst.pushQById(pId);
          Object.defineProperties(inst, {
              res : {
                  configurable : true,
                  enumerable: false,
                  set: function promiseResSet (res) {
                      !inst.keepLoading && inst.deleteQById(pId);
                      var cb = $shift.call(inst._cbQueue);
                      cb && (inst._res = cb.call(inst, res));
                  },
                  get : function promiseResGet () {
                      return inst._res;
                  }
              },
              err : {
                  configurable : true,
                  enumerable: false,
                  set: function promiseErrSet (err) {
                      inst.deleteQById(pId);
                      var fb = $shift.call(inst._fbQueue);
                      fb && err && (inst._err = fb.call(inst, err));
                  },
                  get : function promiseErrGet () {
                      return inst._err;
                  }
              },
          });
      },

      pushQById : function pushQById (id) {

        if (this.resType == 'text') {

          //text request has no loading effect
          return;
        }

        if (!this.keepLoading) {
          Promise.count++;
        }

        if (!this.noLoadingImg && !Promise.$q.length) {
          !_.inDOC(Promise.loadingImg) 
            && BODY.appendChild(Promise.loadingImg);
          // _.log('%c XHR start loading', 'color:rgb(211,7,117)');
        }
        _.push(Promise.$q, id);
      },

      deleteQById : function deleteQById (id) {
        var index = _.indexOf(Promise.$q, id);

        if (index > -1) {
          Promise.$q.splice(index, 1);

          if (!Promise.$q.length && !Promise.inProcess) {
            Promise.inProcess = true;
            Promise.stopProcess(this);
          } else {
            Promise.stopProcess(this);
          }
        }
        return this;
      },

      detectType : function detectType (type, inst) {
          var callback = inst.callback;
          while (callback instanceof Promise) {
              callback = callback.callback;
          }

          if (type == 'resolve') {
              return inst.cb.call(inst, inst._res || callback);
          }

          if (type == 'reject') {
              return inst.fb.call(inst, inst._err || callback);
          }
      },

      then : function _then (resolve, reject) {
          var _this = this;
          _this._cbQueue[_this._cbQueue.length] = resolve;
          _.isFunction(reject) && (_this._fbQueue[_this._fbQueue.length] = reject);
          _this.detectType(_this.type, _this);
          return _this;
      },

      'catch' : function _catch (reject) {
          var _this = this;
          _this._fbQueue[_this._fbQueue.length] = _.isFunction(reject) ? reject : function () {
              return _this;
          };
          return _this;
      },

      done : function done (resolve, reject) {
          if (!this.end) {
              this.end = true;
              return this.then(resolve).catch(reject);
          }
          return this;
      },

      'finally' : function _finally (callback) {
          return this.then(callback);
      }

    };

    Promise.resolve = function _resolve (resolve) {
        return new Promise(resolve, {type : 'resolve'});
    };

    Promise.reject = function _reject (reject) {
        return new Promise(reject, {type : 'reject'});
    };

    Promise.$q = [];

    Promise.inProcess = false;
    Promise.count = 0;

    Promise.stopProcess = function stopProcess (inst) {

      if (--Promise.count) {
        return;
      }

      if (!inst.noLoadingImg) {
        setTimeout(function () {

          if (_.inDOC(Promise.loadingImg)) {
              BODY.removeChild(Promise.loadingImg);
              Promise.inProcess = false;
              // _.log('%c XHR finished loading', 'color:rgb(211,7,117)');
          }
        }, 500);
      } else {
        Promise.inProcess = false;
      }
    };

    Promise.loadingImg = _.createLoadingImg();

    /**
      * Cach
      */
    function Cach (obj) {
      if (!(this instanceof Cach)) {
          return new Cach(obj);
      }

      var _this = this;
      this.size = 0;
      this._ = $oCreate(null);
      if (_.isObject(obj)) {
        _.each(obj, function cachEach (value, key) {
          _this.set(key, value);
          _this.size += 1;
        });
      }
    };

    Cach.prototype = {
      constructor : Cach,
      set : function set (key, value) {
        this._[key] = value;
        this.size += 1;
      },

      get : function get (key) {
        return this._[key];
      },

      has : function has (key) {
        return this._.hasOwnProperty(key);
      },

      'delete' : function _delete (key) {
        delete this._[key];
        this.size -= 1;
      },

      clear : function clear () {
        this._ = $oCreate(null);
        this.size = 0;
        return true;
      }
    };

    function identReplacer (match) {
      var pre = $substring.call(match, 0, 1),
            suffix = $substr.call(match, 1);

      if (REGEXP.test(allowedKeywordsREG, suffix)) {
        return match;
      } else {
        suffix = _.indexOf(suffix, '"') > -1 
          ? REGEXP.replace(suffix, restoreRE, function (m, $1) {return $1; }) 
          : suffix;

        if (REGEXP.test(booleanLiteralREG, suffix)) {
          return pre + suffix;
        }

        if (!REGEXP.test(irReplaceKeyREG, suffix)) {
          return pre + suffix;
        }

        if (REGEXP.test(forChildREG, suffix)) {
          var pointIndex = _.indexOf(suffix, '.');
          pointIndex < 0 && (pointIndex = suffix.length);
          match = $substring.call(suffix, 0, pointIndex);
          return pre + '$scope["' + match + '"]' + $substr.call(suffix, pointIndex);
        }
        return pre + '$scope.' + suffix;
      }
    };
    
    _.each($keys(NODETYPE), function nodeTypeEach (nodeKey) {
      _['is' + nodeKey] = function (node) {
        return node.nodeType == NODETYPE[nodeKey];
      };
    });

    _.each([BROWSER, PLATFORM], function (keyObj) {
      _.each($keys(keyObj), function keyObjEach (key) {
        _['is' + key] = REGEXP.test(keyObj[key], UA);
      });
    });

    _.each($split.call('Function Object Array Undefined Null Number String  Boolean File Blob FormData', spaceREG), function isEach (el, i, arr) {
      _['is' + el] = function (obj) {
        return $toString.call(obj) == '[object ' + el + ']';
      };
    });

    _.REGEXP = REGEXP;
    _.WARN = WARN;
    _.Cach = Cach;
    return _;

  } (window, document));
