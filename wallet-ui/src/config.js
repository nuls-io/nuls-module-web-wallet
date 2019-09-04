const IS_DEV = process.env.NODE_ENV !== 'production';
export const API_CHAIN_ID = 2;
//运行环境（true:正式环境，false:测试环境）
export const RUN_DEV = false;
//正式、测试网络的api
//const API_URL = RUN_DEV ? 'http://192.168.1.192:18003/' : 'http://192.168.1.37:18003/';
let API_URL = localStorage.hasOwnProperty("urls") ? JSON.parse(localStorage.getItem("urls")).urls : 'http://apitn1.nulscan.io/';
//Request url
export let API_ROOT = API_URL;
setInterval(() => {
  API_URL = localStorage.hasOwnProperty("urls") ? JSON.parse(localStorage.getItem("urls")).urls : 'http://apitn1.nulscan.io/';
  API_ROOT = API_URL;
}, 500);

//export const API_ROOT = IS_DEV ? 'http://apitn2.nulscan.io/' : API_URL;
//Request response time
export const API_TIME = IS_DEV ? '9000' : '8000';
