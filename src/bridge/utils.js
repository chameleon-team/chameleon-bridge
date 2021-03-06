/**
 * 基础js方法的封装
 *
 */
function typeEqual(obj, type) {
  return Object.prototype.toString.call(obj) === '[object ' + type + ']';
}

export function isFn(obj) {
  return typeEqual(obj, 'Function');
}

export function isStr(obj) {
  return typeEqual(obj, 'String');
}

export function isObj(obj) {
  return typeEqual(obj, 'Object');
}

export function isArray(obj) {
  return typeEqual(obj, 'Array');
}

export function isUndefined(obj) {
  return typeEqual(obj, 'Undefined');
}

export function isEmpty(obj) {
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export function noop() { }

export function parseQuery(obj) {
  let str = '&';
  let keys = null;
  if (obj && Object.keys(obj).length > 0) {
    keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      str += `${key}=${encodeURIComponent(obj[key])}` + '&';
    }

  }
  return str;

}

export function queryStringify(obj) {
  let str = '&';
  let keys = null;
  if (obj && Object.keys(obj).length > 0) {
    keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      str += `${key}=${encodeURIComponent(obj[key])}` + '&';
    }

  }
  return str;
}

export function queryParse(search) {
  search = search || '';
  let arr = search.split(/(\?|&)/);
  let parmsObj = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].indexOf('=') !== -1) {
      let keyValue = arr[i].match(/([^=]*)=(.*)/);
      parmsObj[keyValue[1]] = keyValue[2];
    }
  }
  return parmsObj;
}

export function isNeedApiPrefix(url) {
  return /^\/[^/]/.test(url);
}

export function addApiPrefix(url) {
  if (process && process.env && process.env.cmlApiPrefix) {
    return process.env.cmlApiPrefix + url;
  }
  return url;
}

export function tryJsonParse(some) {
  // 这里eslint提示也先别删除\[\]
  if (isStr(some) && /[\{\[].*[\}\]]/.test(some)) {
    some = JSON.parse(some);
  }
  return some;
}

export function getQueryParamsFromSearchStr(qs) {
  let search = qs;
  let arr = search.split(/(\?|&)/);
  let parmsObj = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].indexOf('=') !== -1) {
      let keyValue = arr[i].match(/([^=]*)=(.*)/);
      parmsObj[keyValue[1]] = decodeURIComponent(keyValue[2]);
    }
  }
  return parmsObj;
}

/**
 * 获取处理后的各端打开的地址
 * @param {String} url url地址
 * @return {Object} objTreated 处理好的三端地址及对象
 */
export function getOpenObj(url) {
  const webUrlWithoutQuery = url.split('?')[0];
  const queryObj = getQueryParamsFromSearchStr(url);
  let {
    weixin_appid = '',
    weixin_path = '',
    weixin_envVersion = '',
    weex_path = '',
    wx_addr = '',
    cml_addr = '',
    ...extraData
  } = queryObj;

  // weex 链接
  let weexUrl = '';
  if (cml_addr) {
    cml_addr = cml_addr + '?_cml_r=' + ~~(Math.random()*1E5);
    cml_addr = encodeURIComponent(cml_addr);
    weexUrl = webUrlWithoutQuery + '?weex_path=' + weex_path + queryStringify(extraData) + '&cml_addr=' + cml_addr;
  }
  // 向下兼容
  if (wx_addr) {
    wx_addr = wx_addr + '?_cml_r=' + ~~(Math.random()*1E5);
    wx_addr = encodeURIComponent(wx_addr);
    weexUrl = webUrlWithoutQuery + '?weex_path=' + weex_path + queryStringify(extraData) + '&wx_addr=' + wx_addr;
  }

  let objTreated = {
    weex: weexUrl,
    web: webUrlWithoutQuery + '?' + queryStringify(extraData),
    wx: {
      appId: weixin_appid,
      path: weixin_path,
      extraData: extraData,
      envVersion: weixin_envVersion
    }
  };
  return objTreated;
}

// 获得带正确连接符的url
export function getUrlWithConnector(url) {
  let connector = url.includes('?') ? '&' : '?';
  return url + connector;
}

/**
 * 比较版本号
 * @param {String} v1 版本号1
 * @param {String} symb 比较符
 * @param {String} v2 版本号2
 */
export function compareVersion(v1, symb, v2) {
  v1 = parseVersion(v1);
  v2 = parseVersion(v2);
  if (symb.indexOf('=') !== -1 && v1 === v2) {
    return true;
  }
  if (symb.indexOf('>') !== -1 && v1 > v2) {
    return true;
  }
  if (symb.indexOf('<') !== -1 && v1 < v2) {
    return true;
  }
  return false;
}

function parseVersion(version = '') {
  version = version.split('.');
  version.length = 4;
  let ret = [];
  version.forEach(function (n) {
    n = n * 1;
    if (n) {
      ret.push(n >= 10 ? n : '0' + n);
    } else {
      ret.push('00');
    }
  });
  return parseInt(ret.join(''), 10);
}