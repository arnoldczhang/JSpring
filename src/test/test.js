module.exports = function (cm) {
  JSpring(['test', function ($scope, $, module, plugin) {
    ;
  }, function ($, module, plugin) {
      var URL = cm.URL;
      var $location = module.$location;

      //初始化监听变量
      return {
          testFlag : 'test'
      };
  }]);  
};
