//开发模式
export const IS_DEV = process.env.NODE_ENV !== 'production';
//链ID
export const API_CHAIN_ID = sessionStorage.hasOwnProperty('chainID') ? Number(sessionStorage.getItem('chainID')) : 1;
//燃烧地址的公钥
export const API_BURNING_ADDRESS_PUB = '000000000000000000000000000000000000000000000000000000000000000000';
//运行环境（true:正式环境，false:测试环境）
export const RUN_DEV = true;
//正式环境ChainId和资产ID
export const MAIN_INFO = RUN_DEV ? {chainId: 1, assetsId: 1} : {chainId: 2, assetsId: 1};
//运行模式（true:electron窗体模式，false:浏览器模式）
export const RUN_PATTERN = false;
//桌面程序下载路径（main：http://file.wallet.nuls.io/download/main  test：http://file.wallet.nuls.io/download/test）background.js package 手动修改
export const FILE_URL = RUN_DEV ? 'http://file.wallet.nuls.io/download/main' : 'http://file.wallet.nuls.io/download/test';
//正式、测试网络的api
export let API_URL = 'https://public1.nuls.io';
setInterval(() => {
  API_URL = localStorage.hasOwnProperty("urls") ? JSON.parse(localStorage.getItem("urls")).urls : 'https://public1.nuls.io';
}, 500);
//请求最迟时间
export const API_TIME = IS_DEV ? '9000' : '8000';

//默认节点服务列表
const electronData =[
  {name: 'Official', chainId: 1, assetId: 1, decimals: 8, chainName: 'NULS', urls: 'https://wallet.nuls.io/public', delay: '10ms', selection: true, isDelete: false},
  {name: 'Official', chainId: 1, assetId: 1, decimals: 8, chainName: 'NULS', urls: 'https://public1.nuls.io', delay: '10ms', selection: false, isDelete: false},
  {name: 'Official', chainId: 1, assetId: 1, decimals: 8, chainName: 'NULS', urls: 'http://public2.nuls.io', delay: '10ms', selection: false, isDelete: false},
];
const explorerData = [
  {name: 'Official',chainId:1,assetId:1,decimals:8,chainName:'NULS', urls: '/api', delay: '10ms', selection: true, isDelete: false},
  {name: 'Official', chainId: 1, assetId: 1, decimals: 8, chainName: 'NULS', urls: 'https://wallet.nuls.io/public', delay: '10ms', selection: false, isDelete: false},
  {name: 'Official', chainId: 1, assetId: 1, decimals: 8, chainName: 'NULS', urls: 'https://public1.nuls.io', delay: '10ms', selection: false, isDelete: false},
  {name: 'Official', chainId: 1, assetId: 1, decimals: 8, chainName: 'NULS', urls: 'http://public2.nuls.io', delay: '10ms', selection: false, isDelete: false},
];
export const defaultData = RUN_PATTERN ? electronData : explorerData;

//默认服务节点地址
export const defaultUrl = RUN_PATTERN ? electronData[0] : explorerData[0];
//默认浏览器地址（跳转地址）
export const explorerUrl = RUN_DEV ? 'http://www.nulscan.io/' : 'http://beta.nulscan.io/';
