/**
 * DIY ATTRIBUTE - router
 * include MODULE - $routeParam
 *
 * @author Arnold.Zhang
 *
 */
;(function(global) {
  var ARRAY = [],
        J = JSpring,
        $ = J.$,
        doc = document,
        head = doc.head,
        REGEXP = $.REGEXP,
        module = J.module,
        storage = module.$storage || global.sessionStorage,

        $keys = Object.keys,
        $slice = ARRAY.slice,
        $shift = ARRAY.shift,
        $parse = JSON.parse,
        $strfy = JSON.stringify,
        colonREG = /\s*\:\s*/,
        $oCreate = Object.create,
        $createEl = doc.createElement.bind(doc),

        lastPathName = '';

  //浏览历史栈
  J.Stack = [];

  //文件缓存
  J.fileCach = $oCreate(null);

  J.router = function router (container, routes, cm) {
      container = $(container);
      var jsFile,
            tplFile,
            stack = [],
            startTime,
            realRoute = [],
            matchRoute = {},
            onHashChanging = false,
            touchHasMoved = false,
            hasSwiperBack = false,
            h5Mode = J.router.html5Mode,
            $location = module['$location'],
            locationKey = !h5Mode ? 'hash' : 'pathname';
            reserveREG = /([\/\?]+)/g,
            routeKeys = $keys(routes),
            $replace = REGEXP.replace,
            routeParamREG = /\:([^\:\-\.]+)/g,
            hashREG = !h5Mode ? /#\/([^\?]+)\?*[^\?]*/ : new RegExp($location.base + '([\\w\\$]+)'),
            defaultRoute = routes['default'],
            inithash = oldhash = $replace(location[locationKey], hashREG, "$1"),
            deviceIsIOS = REGEXP.test(/iP(ad|hone|od)/, navigator.userAgent);

      $.each(routeKeys, function routeKeysEach (r) {
        if (REGEXP.test(colonREG, r)) {
          matchRoute[r] = [];
          matchRoute[r][0] = new RegExp($replace($replace(r, routeParamREG, function (match, $1) {
            $.push(matchRoute[r][1], $1);
            return '(\\w+)';
          }), reserveREG, '\\$1'));
          matchRoute[r][1] = [];
        } else {
          $.push(realRoute, r);
        }
      });
      J.hashLoad = hashLoad;

      //TDK
      J.titleTag = $('title');
      J.descTag = $('meta[name="Description"]');
      J.keywordsTag = $('meta[name="Keywords"]');

      var isSwiperBack = JSpring.swiperBack
        ? function (x1, x2, y1, y2) {
          return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
            && x2 - x1 > 100;
        } : function () {
          return false;
        };

      if (container.exist) {
        var pageX, pageY,
              pageX2, pageY2,
              boundary = 10;
        //Simple FastClick
        container.on('touchstart', function (e) {
          var touch = e.changedTouches[0];
          pageX = touch.pageX;
          pageY = touch.pageY;
          pageX2 = 0;
          pageY2 = 0;
          touchHasMoved = false;
          startTime = e.timeStamp;
        }).on('touchmove', function (e) {
          var touch = e.changedTouches[0];
          pageX2 = touch.pageX;
          pageY2 = touch.pageY;

          if (Math.abs(pageX2 - pageX) > boundary || Math.abs(pageY2 - pageY) > boundary) {
            touchHasMoved = true;

            if (JSpring.swiperBack 
                && $.isApp
                && !hasSwiperBack 
                && e.timeStamp - startTime > 300 
                && isSwiperBack(pageX, pageX2, pageY, pageY2)) {
              $location && $location.back();
              hasSwiperBack = true;
              setTimeout(function () {
                hasSwiperBack = false;
              });
            }
          }
        }).on('touchend', function (e) {
          var touch = e.changedTouches[0];
          var targetElement = doc.elementFromPoint(touch.clientX, touch.clientY);

          if (!touchHasMoved && targetElement && isNeedsClick(targetElement) && e.timeStamp - startTime < 200) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            var clickEvent = doc.createEvent('MouseEvents');
            clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
            targetElement.dispatchEvent(clickEvent);
          }
        });
        J.container = container;
      } else {
        $.warn(J.WARN.container);
      }

      //if is the initial load or refresh, set 'inithash' to 'defaultRoute'
      inithash = defaultRoute;
      hashLoad(oldhash, {
        noStack : true
      });

      $(window).on('pageshow', function _pageshow (e) {

        var hash = $replace(location[locationKey], hashREG, "$1");

        //if is cached page
        if (e.persisted) {

          //'matchRoute' and 'realRoute', 'realRoute' is supported firstly
          J.backViewEvent[hash] && J.backViewEvent[hash](e);
        }
      });

      $(window).on('pagehide', function _pagehide (e) {

        //leave the page, set 'inithash' to ''(for diff project redirect)
        inithash = '';
      });

      $(window).on('hashchange', function _hashchange (e) {
        hashLoadProxy();
      });

      $(window).on('popstate', function _popstate (e) {
        hashLoadProxy();
      });

      function hashLoadProxy () {

        if (onHashChanging) return false;

        if (lastPathName == location.href) {
          return false;
        }
        
        lastPathName = location.href;

        //if redirect from other project, not reload page
        if (inithash != defaultRoute) {
          return inithash = defaultRoute;
        }

        //FIXME 'refresh' in 360 browser, history length will be added
        var pathname = location[locationKey],
              _hash = J.Stack.pop(),
              realHash = $replace(pathname, hashREG, "$1");

        while (_hash && pathname.indexOf(_hash) < 0) {
          _hash = J.Stack.pop();
        }

        J.backViewPort = true;
        hashLoad(_hash || realHash, {
          noStack : true
        });
      };

      function hashLoad (hash, opts) {

        if (onHashChanging) return false;
        opts = opts || {};
        onHashChanging = true;
        lastPathName = location.href;
        var route, toDefault = false;

        if ($.inArray(realRoute, hash)) {
          route = routes[hash];
          oldhash = hash;

        } else if (route = isMatchRoute(hash)) {
          route = routes[route];
          oldhash = hash;

        } else {
          toDefault = true;
          oldhash = defaultRoute;
          route = routes[defaultRoute || routeKeys[0]];
        }

        opts.noStack && stack.pop();

        if (stack.length) {
          $.uniqPush(J.Stack, stack.pop());
        }

        setTDK(route, hash);
        tplFile = J.fileCach[route.templateUrl];

        if (route.controllerFn) {

          if (!tplFile) {
            $.getText(route.templateUrl).then(function (tplFile) {
              J.fileCach[route.templateUrl] = tplFile;
              instanceInit(tplFile, route.controllerFn, true);
            });
          } else {
            instanceInit(tplFile, route.controllerFn, true);
          }
        } else {
          jsFile = J.fileCach[route.controllerUrl];
          
          if (tplFile) {

            if (jsFile) {
              instanceInit(tplFile, jsFile);
            } else {
              $.getText(route.controllerUrl).then(function (jsFile) {
                J.fileCach[route.controllerUrl] = jsFile;
                instanceInit(tplFile, jsFile);
              });
            }
          } else {
            $.getText(route.templateUrl).then(function (tplFile) {
              J.fileCach[route.templateUrl] = tplFile;
              $.getText(route.controllerUrl).then(function (jsFile) {
                J.fileCach[route.controllerUrl] = jsFile;
                instanceInit(tplFile, jsFile);
              });
            });
          }
        }
        

        function instanceInit (tpl, js, webpackFlag) {
          var viewport,
                loc,
                routeInfo = {
                  hash : hash,
                  uniqId : route.uniqId,
                  template : tpl,
                  readyTransition : route.readyTransition,
                  transition : route.transition || 'fadeIn',
                  transitionLeave : route.transitionLeave || '',
                  cach : route.cach || false,
                };

          if (route.readyTransition) {
            $.each(routeKeys, function routeKeysEach (rt) {
              delete routes[rt].readyTransition;
            });
          }
          
          //if the path beyond the config
          if (toDefault) {
            J.routeCach[oldhash || routeKeys[0]] = routeInfo;
            history.replaceState(null, route.title || '', (!h5Mode ? location.pathname + '#/' : '') + oldhash);
            !opts.noStack && $.push(stack, oldhash);
          } else {
            J.routeCach[routeInfo.uniqId] = routeInfo;
            $.push(stack, hash);
          }

          if (routeInfo.cach && JSpring.backViewPort) {
            if (viewport = J.vm[routeInfo.uniqId]) {
              return viewport.renderFromCach(), onHashChanging = false;
            }
          }

          if (!opts.noSearch && (loc = module['$location'])) {
            var indexQ = $.indexOf(location.hash, '?');
            loc.$search = $.getSearchObj(location.search || (indexQ > -1 ? location.hash.slice(indexQ) : ''));
          }

          if (webpackFlag) {
            return js(function (res) {
              return res(cm || {}), onHashChanging = false;
            });
          }

          destoryStyleTag();
          return new Function('cm', 'return ' + js + ';')(cm), onHashChanging = false;
        };
      };

      function setTDK (route, hash) {
        setKeywords(route.keywords, hash);
        setDescription(route.description, hash);
        setTitle(route.title, hash);
      };

      function setTitle (title, hash) {
        var el;
        if ($.isNull(title)) {
          return false;
        }

        if (!J.titleTag.exist) {
          el = $createEl('title');
          $.before(head.firstChild, el);
          J.titleTag = $(el);
        }

        return J.titleTag.html($.isFunction(title) 
          ? title(hash) : title || '');
      };

      function setDescription (desc, hash) {
        var el;
        if ($.isNull(desc)) {
          return false;
        }

        if (!J.descTag.exist) {
          el = $createEl('meta');
          $.attr(el, 'name', 'Description');
          $.before(head.firstChild, el);
          J.descTag = $(el);
        }

        return J.descTag.attr('content', $.isFunction(desc) 
          ? desc(hash) : desc || '');
      };

      function setKeywords (keywords, hash) {
        var el;
        if ($.isNull(keywords)) {
          return false;
        }

        if (!J.keywordsTag.exist) {
          el = $createEl('meta');
          $.attr(el, 'name', 'Keywords');
          $.before(head.firstChild, el);
          J.keywordsTag = $(el);
        }

        return J.keywordsTag.attr('content', $.isFunction(keywords) 
          ? keywords(hash) : keywords || '');
      };

      function destoryStyleTag (num) {
        //FIXME 去掉index.html上多余的style属性
        num = num || 50;
        var style = head.getElementsByTagName('style'),
              l = style.length;
              
        while (l >= num) {
          $.remove($.last(style));
          l--;
        }
      };

      function isMatchRoute (route) {
        var result, routeParam;
        return $.each($keys(matchRoute), function matchRouteEach (k) {
          var expr = matchRoute[k][0], 
                rootKey = matchRoute[k][1],
                matchArr;

          if (matchArr = REGEXP.exec(expr, route)) {
            matchArr = $slice.call(matchArr, 1);
            routeParam = module.$routeParam = {};
            $.each(rootKey, function rootKeyEach (m) {
              routeParam[m] = $shift.call(matchArr);
            });
            return result = k;
          }
        }) || false;
      };

      function isNeedsClick (el) {
        if (!el.tagName) {
          return false;
        }
        switch (el.tagName.toLowerCase()) {
          case 'button' :
          case 'select' :
          case 'textarea' :
            return el.disabled;
            break;
          case 'input' :
            if ((deviceIsIOS && el.type === 'file') || el.disabled) {
              return true;
            } else {
              return false;
            }
            break;
          case 'label':
          case 'video':
            return true;
          default :
            return true;
        }
      };
    };

    //默认路由跳转走hash
    J.router.html5Mode = false;

    J.router.enableHtml5Mode = function enableHtml5Mode () {
      J.router.html5Mode = true;
    };
}(window));