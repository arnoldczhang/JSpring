/**
 * DIY ATTRIBUTE - href
 *
 * @format 'aaaaa'
 * @format @child.href
 * @format {true : 'aaa', false : 'bbb'}[@child.isHref]
 * @format {true : param.aa, false : param.bb}[@child.isHref]
 * @author Arnold.Zhang
 *
 */
;(function(global) {
  global = global || window;
  var J = JSpring,
        $ = J.$,
        REGEXP = $.REGEXP,
        $keys = Object.keys,
        normParamREG = /^\s*([\w\$\.#\:\/@\(\)\+\-\s\!\+'"\[\]]+)\s*$/,
        hrefParamREG = /^\s*\{(\s*(?:true|false)\s*\:\s*['"]*\s*([^,]+)\s*['"]*\s*,?\s*)+\}\s*\[\s*([\w\.\$@\(\)\|\=\s]+)\s*\]$/;

  J.diyAttrs['href'] = 1;
  J.diyWatchers['href'] = setHrefProps;
  J.diyDirects['href'] = vHref;

  function setHrefProps (vm, node, attr, expression, props) {
    props.fnBody = $.getFnBody(vm, expression);

    //'aaaaa'
    //@child.href
    if (matchArr = REGEXP.exec(normParamREG, props.fnBody)) {
      props.fnBody = matchArr[1];

    //{true : 'aaa', false : 'bbb'}[@child.isHref]
    //{true : param.aa, false : param.bb}[@child.isHref]
    } else if (REGEXP.test(hrefParamREG, props.fnBody)) {
      props.objFormat = false;
    }else {
      $.warn(J.WARN.format('href', expression));
    }
  };

  function vHref (node, value) {
    $.attr(node, 'href', value);
  };

}(this || window));