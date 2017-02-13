/**
 * DIY ATTRIBUTE - style
 *
 * @format 'backgroundColor:' + cc + ';'
 * @format {true : 'backgroundColor:red;color:white', false : 'fontSize:30px'}[styleFlg]
 * @author Arnold.Zhang
 *
 */
;(function(global) {
  global = global || window;
  var J = JSpring,
        $ = J.$,
        REGEXP = $.REGEXP,
        $keys = Object.keys,
        $oCreate = Object.create,
        semiREG = /\s*;\s*/,
        objREG = /(\{[^\{\}]+\})/,
        arrowREG = /\s*\:(?!\/)\s*/,
        toBoolREG = /([^\[]+\[\s*)([^\[\s!\]]+)(\s*\])/g,
        styleParamREG = /^([\s\w\:;'"\+@\(\)_\.\+]+)$/,
        identRE = /[^\w\$\.'"{:;\u4E00-\u9FA5\/\?\-](?:[A-Za-z_$@][\w$]*)/g,
        styleValParamREG = /^\{(\s*(?:true|false)\s*\:\s*['"]\s*([\w\$\:\;\(\)\u4E00-\u9FA5\+@\.\+\s'"]+)\s*['"]*\s*,?\s*)+\}\s*\[\s*([\w\.\$@\(\)\|>\=\s]+)\s*\]$/;

  J.diyAttrs['style'] = 1;
  J.diyWatchers['style'] = setStyleProps;
  J.diyDirects['style'] = vStyle;

  function setStyleProps (vm, node, attr, expression, props) {
    var matchArr;
    props.fnBody = $.getDiyFnBody(vm, expression, {
      identRE : identRE
    });
    
    //'backgroundColor:' + cc + ';'
    if (matchArr = REGEXP.exec(styleParamREG, expression)) {
      props.parent = matchArr[1];

    //{true : 'backgroundColor:red'}[styleFlg]
    } else if (REGEXP.test(styleValParamREG, expression)) {
        props.fnBody = REGEXP.replace(REGEXP.replace(props.fnBody, toBoolREG, '$1$2$3'), objREG, '($1)');
        vm.cach.get('exp')[expression] = props.fnBody;
    } else {
      $.warn(J.WARN.format('style', expression));
    }
  };

  function vStyle (node, value) {
    if (!value || /undefined/.test(value)) return;
    var _this = this,
          props = _this.watcher.props,
         styleGroup = value.split(semiREG),
         toggleStyle;
    
    toggleStyle = _this.toggleStyle || $oCreate(null);
    $.each($keys(toggleStyle), function toggleStyleEach (k) {
      node.style[k] = toggleStyle[k];
    });

    _this.toggleStyle = $oCreate(null);
    $.each(styleGroup, function styleEach (style) {
      var _styleArr = style.split(arrowREG),
            _styleKey = _styleArr[0],
            _styleValue = _styleArr[1];

      if (_styleKey) {
        _this.toggleStyle[_styleKey] = node.style[_styleKey];
        node.style[_styleKey] = _styleValue;
      }
    });
  };

}(this || window));