/**
 * MODULE - localStorage($storage)
 *
 * @description Compatible Safari seamless browsing
 * @author Arnold.Zhang
 *
 */
  ;(function(w) {
    var storage = w.localStorage,
          sessStorage = w.sessionStorage,
          module = JSpring.module,
          $oCreate = Object.create,
          extendObj = $oCreate(null),
          jParse = JSON.parse,
          jStrfy = JSON.stringify,
          $storage = extendObj.$storage = storage;

    try {
      storage.setItem('testKey', '1');
      storage.removeItem('testKey');
    } catch (err) {

      $storage = $oCreate(null);

      $storage.setItem = 
      sessStorage.setItem = 
      storage.setItem = setItem;

      $storage.getItem =
      sessStorage.getItem =
      storage.getItem = getItem;

      $storage.removeItem =
      sessStorage.removeItem =
      storage.removeItem = removeItem;

      $storage.clearAll =
      sessStorage.clearAll =
      storage.clearAll = clearAll;
    }

    function setItem (key, obj) {
      if (w.name) {
        var nameItem = jParse(w.name);
      } else {
        nameItem = {};
      }

      if (typeof obj == 'string' && /[\{\}]/.test(obj)) {
        obj = jParse(obj);
      }
      nameItem[key] = obj;
      return w.name = jStrfy(nameItem);
    };

    function getItem (key) {
      if (w.name) {
        return jStrfy(jParse(w.name)[key]) || null;
      }
      return false;
    };

    function removeItem (key) {
      if (w.name) {
        var nameItem = jParse(w.name);
        delete nameItem[key];
        return w.name = jStrfy(nameItem);
      }
      return false;
    };

    function clearAll () {
      return w.name = '', true;
    };

    $.extend(module, extendObj);
    return $storage;
  }(window));