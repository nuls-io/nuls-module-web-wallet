/**
 * Created by zhoulijun on 2019-09-17.
 */
"use strict";

//燃烧地址的公钥
export const API_BURNING_ADDRESS_PUB = '000000000000000000000000000000000000000000000000000000000000000000';
//运行环境（true:正式环境，false:测试环境）
export const RUN_DEV = true;
//ChainId和资产ID
export const MAIN_INFO = {chainId: 18, assetId: 1};
//运行模式（true:electron窗体模式，false:浏览器模式）
export const RUN_PATTERN = true;
//桌面程序下载路径
export const FILE_URL = 'http://down.bbai.co:8083';
//正式、测试网络的api
export let API_URL = 'http://wallet.bbai.io:8003';
setInterval(() => {
  API_URL = localStorage.hasOwnProperty("url") && localStorage.getItem('url') !== 'undefined' ? JSON.parse(localStorage.getItem("url")).urls : 'http://wallet.bbai.io:8003';
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
    chainName: 'BBAI',
    urls: 'http://wallet.bbai.io:8003',
    delay: '10ms',
    selection: true,
    isDelete: false
  },
];
export const defaultData = electronData;
//默认服务节点地址
export const defaultUrl = electronData[0];
//默认浏览器地址（跳转地址）
export const explorerUrl = 'http://explorer.bbai.io/';
