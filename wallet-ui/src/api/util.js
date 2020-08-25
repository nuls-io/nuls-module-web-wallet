import nuls from 'nuls-sdk-js'
import {BigNumber} from 'bignumber.js'
import copy from 'copy-to-clipboard'
import {explorerUrl, RUN_DEV} from '@/config.js'
import openner from "./opener-web";

//import openner from "./opener-desktop";

/**
 * 10的N 次方
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Power(arg) {
  let newPower = new BigNumber(10);
  return newPower.pow(arg);
}

/**
 * 减法
 * @param nu
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Minus(nu, arg) {
  let newMinus = new BigNumber(nu);
  return newMinus.minus(arg);
}

/**
 * 乘法
 * @param nu
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Times(nu, arg) {
  let newTimes = new BigNumber(nu);
  return newTimes.times(arg);
}

/**
 * 加法
 * @param nu
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Plus(nu, arg) {
  let newPlus = new BigNumber(nu);
  return newPlus.plus(arg);
}

/**
 * 除法
 * @param nu
 * @param arg
 * @returns {BigNumber}
 * @constructor
 */
export function Division(nu, arg) {
  let newDiv = new BigNumber(nu);
  return newDiv.div(arg);
}

/**
 * 数字除以精度系数
 */
export function timesDecimals(nu, decimals) {
  let newInfo = sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')) : '';
  let newDecimals = decimals ? decimals : newInfo.defaultAsset.decimals;
  if (decimals === 0) {
    return nu
  }
  let fmt = {groupSeparator: ',',};
  BigNumber.config({FORMAT: fmt});
  return Number(Division(nu,Number(Power(newDecimals))))
}

/**
 * 数字除以精度系数
 */
export function divisionDecimals(nu, decimals = '') {
  let newInfo = sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')) : '';
  let newDecimals = decimals ? decimals : newInfo.defaultAsset.decimals;
  if (decimals === 0) {
    return nu
  }
  let newNu = new BigNumber(Division(nu, Power(newDecimals)).toString());
  return newNu.toFixed()
  // console.log(newNu, nu,'===--===',decimals)
  // return newNu.toFormat().replace(/[,]/g, '');
}

/**
 * 数字乘以精度系数
 */
export function timesDecimals0(nu, decimals) {
  let newInfo = sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')) : '';
  let newDecimals = decimals ? decimals : newInfo.defaultAsset.decimals;
  if (decimals === 0) {
    return nu
  }
  let newNu = new BigNumber(Times(nu, Power(newDecimals)));
  return newNu;
}

/**
 * 数字乘以精度系数(超长数字)
 *
 */
export function timesDecimalsBig(nu, decimals) {
  let newInfo = sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')) : '';
  let newDecimals = decimals ? decimals : newInfo.defaultAsset.decimals;
  if (decimals === 0) {
    return nu
  }
  let fmt = {groupSeparator: '',};
  BigNumber.config({FORMAT: fmt});
  let newNu = new BigNumber(Times(nu, Power(newDecimals)));
  return newNu.toFormat();
}

/**
 * @disc: 验证密码
 * @params:  accountInfo
 * @params:  password
 * @params:  prefix
 * @date: 2019-08-22 12:05
 * @author: Wave
 */
export function passwordVerification(accountInfo, password, prefix) {
  const pri = nuls.decrypteOfAES(accountInfo.aesPri, password);
  if (!prefix && sessionStorage.hasOwnProperty('info')) {
    prefix = JSON.parse(sessionStorage.getItem('info')).defaultAsset.symbol
  }
  const newAddressInfo = nuls.importByKey(chainID(), pri, password, prefix);
  if (newAddressInfo.address === accountInfo.address || nuls.addressEquals(accountInfo.address, newAddressInfo.address)) {
    return {success: true, pri: pri, pub: accountInfo.pub, aesPri: accountInfo.aesPri, address: newAddressInfo.address};
  } else {
    return {success: false};
  }
}

/**
 * 获取链ID
 * @returns {number}
 */
export function chainID() {
  if (localStorage.hasOwnProperty('url') && localStorage.getItem('url') !== 'undefined') {
    let newUrl = JSON.parse(localStorage.getItem('url'));
    return newUrl.chainId
  } else {
    return RUN_DEV ? 1 : 2;
  }
}

/**
 * 获取chainId+number
 * @returns {string}
 */
export function chainIdNumber() {
  return 'chainId' + chainID();
}

/**
 * 获取地址列表或选择地址
 * @param type 0:地址列表，1:选中地址
 * @returns {*}
 */
export function addressInfo(type) {
  let chainNumber = 'chainId' + chainID();
  let addressList = localStorage.hasOwnProperty(chainNumber) ? JSON.parse(localStorage.getItem(chainNumber)) : [];
  if (addressList) {
    if (type === 0) {
      return addressList
    } else {
      for (let item  of addressList) {
        if (item.selection) {
          return item
        }
      }
    }
  } else {
    return addressList
  }
}

/**
 * 超长数字显示
 * @param nu
 * @param powerNu
 * @returns {string}
 */
export function langNumber(nu, powerNu) {
  let newNu = new BigNumber(Division(nu, powerNu).toString());
  return newNu.toFormat().replace(/[,]/g, '');
}

/**
 * 字符串中间显示....
 * @param string
 * @param leng
 * @returns {*}
 */
export function superLong(string, leng) {
  if (string && string.length > 10) {
    return string.substr(0, leng) + "...." + string.substr(string.length - leng, string.length);
  } else {
    return string;
  }
}

/**
 * 复制 copy
 * @param value
 */
export const copys = (value) => copy(value);

/**
 * 计数时间差
 * @param dateBegin
 * @returns {{days: number, hours: number, minutes: number, seconds: number}}
 */
export function timeDifference(dateBegin) {
  let dateEnd = new Date();    //结束时间
  let newDate = dateEnd.getTime() - dateBegin;   //时间差的毫秒数
  let days = Math.floor(newDate / (24 * 3600 * 1000));//计算出相差天数
  let leave1 = newDate % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000));
  let leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000));
  let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
  let seconds = Math.round(leave3 / 1000);
  return {days: days, hours: hours, minutes: minutes, seconds: seconds};
}

/**
 * 根据不同时区显示时间
 * @param time
 * @returns {*}
 */
export function getLocalTime(time) {
  if (typeof time !== 'number') return;
  let d = new Date();
  let offset = d.getTimezoneOffset() * 60000;
  let localUtc = new Date().getTimezoneOffset() / 60;
  let utcTime;
  if (localUtc > 0) {
    utcTime = time - offset;
  } else {
    utcTime = time + offset;
  }
  let localTime = utcTime + 3600000 * Math.abs(localUtc);
  return new Date(localTime);
}

/**
 * 获取参数的必填值
 * @param parameterList
 * @returns {{allParameter: boolean, args: Array}}
 */
export function getArgs(parameterList) {
  //console.log(parameterList);
  let newArgs = [];
  let allParameter = false;
  if (parameterList.length !== 0) {
    //循环获取必填参数
    for (let itme of parameterList) {
      if (itme.required) {
        if (itme.value) {
          allParameter = true;
          newArgs.push(itme.value)
        } else {
          return {allParameter: false, args: newArgs};
        }
      } else {
        allParameter = true;
        if (!itme.value) {
          newArgs.push('')
        } else {
          newArgs.push(itme.value)
        }
      }
    }
    return {allParameter: allParameter, args: newArgs};
  } else {
    return {allParameter: true, args: newArgs};
  }
}

/**
 * 连接跳转
 * @param name
 * @param parameter
 */
export function connectToExplorer(name, parameter) {
  let newUrl = '';
  if (name === 'height') {
    newUrl = explorerUrl + 'block/info?height=' + parameter
  } else if (name === 'address') {
    newUrl = explorerUrl + 'address/info?address=' + parameter
  } else if (name === 'hash') {
    newUrl = explorerUrl + 'consensus/info?hash=' + parameter
  } else if (name === 'rotation') {
    newUrl = explorerUrl + 'rotation/info?rotation=' + parameter
  } else if (name === 'contractsInfo') {
    newUrl = explorerUrl + 'contracts/info?contractAddress=' + parameter
  } else if (name === 'contracts') {
    newUrl = explorerUrl + 'contracts'
  } else if (name === 'consensusInfo') {
    newUrl = explorerUrl + 'consensus/info?hash=' + parameter
  } else if (name === 'transactionInfo') {
    newUrl = explorerUrl + 'transaction/info?hash=' + parameter
  } else if (name === 'nuls') {
    newUrl = parameter
  }
  //console.log(newUrl);
  let symbol = sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')).defaultAsset.symbol : 'NULS';
  if (symbol === 'NULS') {
    //console.log(newUrl);
    openner(newUrl);
  }
}

//地址必须参数列表
export const defaultAddressInfo = {
  address: '', //地址
  aesPri: '',//加密私钥
  pub: '',//公钥
  selection: false,//是否选中
  alias: "",//别名
  remark: "",//标签（备注）
  balance: 0,//余额
  consensusLock: 0,//锁定金额
  totalReward: 0,//总奖励
  tokens: [],//代币列表
  contractList: [],//合约列表（收藏的合约）
};

//地址信息写入localStorage
export function localStorageByAddressInfo(newAddressInfo) {
  let addressList = [];
  let newAddressList = [];
  newAddressList.push(newAddressInfo);
  let newArr = addressInfo(0);
  if (newArr.length !== 0) {
    let ifAddress = false;
    for (let item of newArr) {
      if (item.address === newAddressInfo.address) {
        item.aesPri = newAddressInfo.aesPri;
        item.pub = newAddressInfo.pub;
        ifAddress = true
      }
      if (item.selection) {
        newAddressList[0].selection = false;
      }
    }
    if (ifAddress) {
      addressList = [...newArr]
    } else {
      addressList = [...newArr, ...newAddressList]
    }
  } else {
    newAddressInfo.selection = true;
    addressList.push(newAddressInfo);
  }
  //console.log(addressList);
  localStorage.setItem(chainIdNumber(), JSON.stringify(addressList));
}

/**
 *  深度比较两个对象是否相同
 * @param {Object} oldData
 * @param {Object} newData
 */
export function equalsObj(oldData, newData) {
  //类型为基本类型时,如果相同,则返回true
  if (oldData === newData) return true;
  if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
    //类型为对象并且元素个数相同
    //遍历所有对象中所有属性,判断元素是否相同
    for (const key in oldData) {
      if (oldData.hasOwnProperty(key)) {
        if (!equalsObj(oldData[key], newData[key]))
        //对象中具有不相同属性 返回false
          return false;
      }
    }
  } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
    //类型为数组并且数组长度相同
    for (let i = 0, length = oldData.length; i < length; i++) {
      if (!equalsObj(oldData[i], newData[i]))
      //如果数组元素中具有不相同元素,返回false
        return false;
    }
  } else {
    //其它类型,均返回false
    return false;
  }
  //走到这里,说明数组或者对象中所有元素都相同,返回true
  return true;
}

/**
 * 判断此对象是否是Object类型
 * @param {Object} obj
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 判断此类型是否是Array类型
 * @param {Array} arr
 */
function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

/**
 * @disc: 随机数
 * @params: len
 * @date: 2019-12-02 14:43
 * @author: Wave
 */
export function getRamNumber(len) {
  let chars = 'ABCDEFGHJKLMNOPQRSVTWXYIUZabcdefhijkmnprstwxyzovu0123456789';
  let maxPos = chars.length;
  let ramNumber = '';
  for (let i = 0; i < len; i++) {
    ramNumber += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return ramNumber;
}

/**
 *  把html转义成HTML实体字符
 * @param str
 * @returns {string}
 * @constructor
 */
export function htmlEncode(str) {
  let s = "";
  if (str.length === 0) {
    return "";
  }
  s = str.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/ /g, "&nbsp;");
  s = s.replace(/\\'/g, "&#39;"); //IE下不支持实体名称
  s = s.replace(/\\"/g, "&quot;");
  return s;
}

/**
 *  转义字符还原成html字符
 * @param str
 * @returns {string}
 * @constructor
 */
export function htmlRestore(str) {
  let s = "";
  if (str.length === 0) {
    return "";
  }
  s = str.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#39;/g, "/\\'");
  s = s.replace(/&quot;/g, "/\"");
  return s;
}

/**
 * @disc: 判断pc和手机端
 * @date: 2020-05-29 16:51
 * @author: Wave
 */
export function IsPC() {
  let userAgentInfo = navigator.userAgent;
  let Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  let flag = true;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

