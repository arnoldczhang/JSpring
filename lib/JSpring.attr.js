/**
 * DIY ATTRIBUTE - attr
 *
 * @format href:'112233' + @c.id
 * @format {src:'112233' + @c.index, tagName : @c.name}
 * @author Arnold.Zhang
 *
 */
;(function(global) {
  global = global || window;
  var J = JSpring,
        $ = J.$,
        REGEXP = $.REGEXP,
        WARN = $.WARN,
        $keys = Object.keys,
        attrParamREG = /^\s*([^\s]+)\s*\:\s*([^\{\}]+)$/,
        objParamREG = /^\s*\{(\s*['"]*([\w\$\+\-\s]+)['"]*\s*\:\s*([^,]+),?)+\}$/,
        semiREG = /\s*;\s*\w+/;

  J.diyAttrs['attr'] = 1;
  J.diyWatchers['attr'] = setAttrProps;
  J.diyDirects['attr'] = vAttr;

  function setAttrProps (vm, node, attr, expression, props) {
    props.fnBody = $.getFnBody(vm, expression);

    //href:@pic.url
    if (matchArr = REGEXP.exec(attrParamREG, props.fnBody)) {
      props.attr = matchArr[1].replace(/\$scope\./, '');
      props.fnBody = matchArr[2];

    //{href:'visaDetail/' + @pic.sub_object_id}
    } else if (REGEXP.test(objParamREG, props.fnBody)) {
      props.objFormat = false;
    }else {
      $.warn(J.WARN.format('attr', expression));
    }
  };

  function vAttr (node, value) {
    if (!value) return;
    var props = this.watcher.props;
    if ($.isObject(value)) {
      $.each($keys(value), function vAttrEach (k) {
        value[k] && $.attr(node, k, value[k]);
      });
    } else {
      !REGEXP.test(semiREG, value)
        ? value && $.attr(node, props.attr, value)
        : $.warn(WARN.oneAttr);
    }
  };

}(this || window));