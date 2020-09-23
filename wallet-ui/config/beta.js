/**
 * Created by zhoulijun on 2019-09-17.
 */
"use strict";

//燃烧地址的公钥
export const API_BURNING_ADDRESS_PUB = '000000000000000000000000000000000000000000000000000000000000000000';
//运行环境（true:正式环境，false:测试环境）
export const RUN_DEV = false;
//ChainId和资产ID
export const MAIN_INFO = {chainId: 2, assetId: 1};
//运行模式（true:electron窗体模式，false:浏览器模式）
export const RUN_PATTERN = false;
//桌面程序下载路径
export const FILE_URL = 'http://file.wallet.nuls.io/download/test';
//测试网络的api
export let API_URL = '/api';
setInterval(() => {
  API_URL = localStorage.hasOwnProperty("url") && localStorage.getItem('url') !== 'undefined' ? JSON.parse(localStorage.getItem("url")).urls : '/api';
}, 500);
//请求最迟时间
export const API_TIME = '8000';

//默认节点服务列表
const electronData = [
  {
    name: 'Official',
    chainId: MAIN_INFO.chainId,
    assetId: MAIN_INFO.assetId,
    decimals: 8,
    chainName: RUN_DEV ? 'NULS' : 'tNULS',
    urls: RUN_DEV ? 'https://wallet.nuls.io/public' : 'https://beta.wallet.nuls.io/api',
    delay: '10ms',
    selection: true,
    isDelete: false
  },
  {
    name: 'Official',
    chainId: MAIN_INFO.chainId,
    assetId: MAIN_INFO.assetId,
    decimals: 8,
    chainName: RUN_DEV ? 'NULS' : 'tNULS',
    urls: RUN_DEV ? 'https://public1.nuls.io' : 'http://apitn1.nulscan.io',
    delay: '10ms',
    selection: false,
    isDelete: false
  },
  {
    name: 'Official',
    chainId: MAIN_INFO.chainId,
    assetId: MAIN_INFO.assetId,
    decimals: 8,
    chainName: RUN_DEV ? 'NULS' : 'tNULS',
    urls: RUN_DEV ? 'http://public2.nuls.io' : 'http://apitn2.nulscan.io',
    delay: '10ms',
    selection: false,
    isDelete: false
  },
];
const explorerData = [
  {
    name: 'Official',
    chainId: MAIN_INFO.chainId,
    assetId: MAIN_INFO.assetId,
    decimals: 8,
    chainName: RUN_DEV ? 'NULS' : 'tNULS',
    urls: '/api',
    delay: '10ms',
    selection: true,
    isDelete: false
  },
  {
    name: 'Official',
    chainId: MAIN_INFO.chainId,
    assetId: MAIN_INFO.assetId,
    decimals: 8,
    chainName: RUN_DEV ? 'NULS' : 'tNULS',
    urls: RUN_DEV ? 'https://wallet.nuls.io/public' : 'https://beta.wallet.nuls.io/api',
    delay: '10ms',
    selection: false,
    isDelete: false
  },
  {
    name: 'Official',
    chainId: MAIN_INFO.chainId,
    assetId: MAIN_INFO.assetId,
    decimals: 8,
    chainName: RUN_DEV ? 'NULS' : 'tNULS',
    urls: RUN_DEV ? 'https://public1.nuls.io' : 'http://beta.public1.nuls.io/',
    delay: '10ms',
    selection: false,
    isDelete: false
  },
  {
    name: 'Official',
    chainId: MAIN_INFO.chainId,
    assetId: MAIN_INFO.assetId,
    decimals: 8,
    chainName: RUN_DEV ? 'NULS' : 'tNULS',
    urls: RUN_DEV ? 'http://public2.nuls.io' : 'http://beta.public2.nuls.io/',
    delay: '10ms',
    selection: false,
    isDelete: false
  },
];
export const defaultData = RUN_PATTERN ? electronData : explorerData;

//默认服务节点地址
export const defaultUrl = RUN_PATTERN ? electronData[0] : explorerData[0];
//默认浏览器地址（跳转地址）
export const explorerUrl = 'http://beta.nulscan.io/';
//默认钱包地址（跳转地址）
export const walletUrl = 'http://beta.wallet.nuls.io/';

