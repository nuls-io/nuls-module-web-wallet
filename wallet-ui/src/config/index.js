//运行模式（true:electron窗体模式，false:浏览器模式）
export const RUN_PATTERN = true;

//桌面程序下载路径
export const FILE_URL = 'http://file.wallet.nuls.io/download/test';

//正式、测试网络的api
export let API_URL = 'https://beta.wallet.nuls.io/api';

setInterval(() => {
  API_URL = localStorage.hasOwnProperty("url") && localStorage.getItem('url') !== 'undefined' ? JSON.parse(localStorage.getItem("url")).urls : '/api';
}, 500);

//请求最迟时间
export const API_TIME = '8000';

//燃烧地址的公钥
export const black_address = {
  '1': 'NULSd6HgWSU1iR6BfNoQi85mAMT52JMFzpnok',
  '2': 'tNULSeBaMhZnRteniCy3UZqPjTbnWKBPHX1a5d'
}

//默认节点服务列表
export const defaultNodes = [
  {
    name: 'NULS_MAIN',
    chainId: 1,
    assetId: 1,
    decimals: 8,
    chainName: 'NULS',
    symbol: 'NULS',
    apiUrl:  'https://public1.nuls.io',
    explorerUrl: 'https://nulscan.io',
    delay: ''
  },
  {
    name: 'NULS_BETA',
    chainId: 2,
    assetId: 1,
    decimals: 8,
    chainName: 'tNULS',
    symbol: 'NULS',
    apiUrl: 'https://beta.public1.nuls.io',
    explorerUrl: 'http://beta.nulscan.io',
    delay: ''
  },
];

export const defaultPrefix = [
  {chainId: 1, addressPrefix: 'NULS'},
  {chainId: 2, addressPrefix: 'tNULS'},
];
