import {post} from './https'
import {Plus, chainID} from './util'
import {MAIN_INFO} from '@/config.js'

/**
 * 判断是否为主网
 * @param chainId
 **/
export function isMainNet(chainId) {
  return chainId === MAIN_INFO.chainId;
}

/**
 * 计算手续费
 * @param tx
 * @param signatrueCount 签名数量，默认为1
 **/
export function countFee(tx, signatrueCount) {
  let txSize = tx.txSerialize().length;
  txSize += signatrueCount * 110;
  return 100000 * Math.ceil(txSize / 1024);
}

/**
 * 计算跨链交易手续费
 * @param tx
 * @param signatrueCount 签名数量，默认为1
 **/
export async function countCtxFee(tx, signatrueCount) {
  let resultValue = 0;
  await post('/', 'getByzantineCount', [tx.txSerialize().toString('hex')])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        let txSize = tx.txSerialize().length;
        txSize += (signatrueCount + response.result.value) * 110;
        resultValue = 1000000 * Math.ceil(txSize / 1024)
      } else {
        resultValue = -100
      }
    })
    .catch((error) => {
      console.log(error);
      resultValue = -100
    });
  return resultValue;
}

/**
 * 获取inputs and outputs
 * @param transferInfo
 * @param balanceInfo
 * @param type
 * @returns {*}
 **/
export async function inputsOrOutputs(transferInfo, balanceInfo, type) {
  let newAmount = Number(Plus(transferInfo.amount, transferInfo.fee));
  let newLocked = 0;
  let newNonce = balanceInfo.nonce;
  let newoutputAmount = transferInfo.amount;
  let newLockTime = 0;
  if (type === 4) {
    newLockTime = -1;
  } else if (type === 5) {
    newLockTime = -1;
  } else if (type === 6) {
    newAmount = transferInfo.amount;
    newLocked = -1;
    newNonce = transferInfo.depositHash.substring(transferInfo.depositHash.length - 16);
    newoutputAmount = transferInfo.amount - transferInfo.fee;
  } else if (type === 9) {
    newAmount = transferInfo.amount;
    newLocked = -1;
    newNonce = transferInfo.depositHash.substring(transferInfo.depositHash.length - 16);
    newoutputAmount = transferInfo.amount - transferInfo.fee;
    //锁定三天
    //let times = (new Date()).valueOf() + 3600000 * 72;
    let times = (new Date()).valueOf();
    newLockTime = Number(times.toString().substr(0, times.toString().length - 3));
    //newLockTime = times;
  } else {
    //return {success: false, data: "No transaction type"}
  }

  let inputs = [{
    address: transferInfo.fromAddress,
    assetsChainId: transferInfo.assetsChainId,
    assetsId: transferInfo.assetsId,
    amount: newAmount,
    locked: newLocked,
    nonce: newNonce
  }];

  if (type === 2 && transferInfo.assetsChainId !== chainID()) {
    inputs[0].amount = transferInfo.amount;
    //账户转出资产余额
    let nulsbalance = await getNulsBalance(chainID(), 1, transferInfo.fromAddress);
    //console.log(nulsbalance);
    if (nulsbalance.data.balance < 100000) {
      console.log("余额小于手续费");
      return
    }
    inputs.push({
      address: transferInfo.fromAddress,
      assetsChainId: chainID(),
      assetsId: 1,
      amount: 100000,
      locked: newLocked,
      nonce: nulsbalance.data.nonce
    })
  }
  let outputs = [];
  if (type === 15 || type === 17) {
    return {success: true, data: {inputs: inputs, outputs: outputs}};
  }
  if (type === 16) {
    inputs[0].amount = Number(Plus(transferInfo.amount, 100000));
    if (transferInfo.toAddress) {
      if (transferInfo.value) { //向合约地址转nuls
        //inputs[0].amount = transferInfo.amount;
        outputs = [{
          address: transferInfo.toAddress,
          assetsChainId: transferInfo.assetsChainId,
          assetsId: transferInfo.assetsId,
          amount: transferInfo.value,
          lockTime: newLockTime
        }];
      }
    }
    return {success: true, data: {inputs: inputs, outputs: outputs}};
  }

  if (transferInfo.times && type === 2) {
    newLockTime = Date.parse(transferInfo.times) / 1000
  }

  outputs = [{
    address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
    assetsChainId: transferInfo.assetsChainId,
    assetsId: transferInfo.assetsId,
    amount: newoutputAmount,
    lockTime: newLockTime
  }];
  /*console.log(inputs);
  console.log(outputs);*/
  return {success: true, data: {inputs: inputs, outputs: outputs}};
}

/**
 * 获取账户的余额及nonce
 * @param assetChainId
 * @param assetId
 * @param address
 * @returns {Promise<any>}
 */
export async function getNulsBalance(assetChainId = 2, assetId = 1, address) {
  return await post('/', 'getAccountBalance', [assetChainId, assetId, address])
    .then((response) => {
      if (response.hasOwnProperty("result")) {
        return {success: true, data: {balance: response.result.balance, nonce: response.result.nonce}}
      } else {
        return {success: false, data: response}
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 验证交易
 * @param txHex
 * @returns {Promise<any>}
 **/
export async function validateTx(txHex) {
  return await post('/', 'validateTx', [txHex])
    .then((response) => {
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result};
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 广播交易
 * @param txHex
 * @returns {Promise<any>}
 **/
export async function broadcastTx(txHex) {
  return await post('/', 'broadcastTx', [txHex])
    .then((response) => {
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result};
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 验证交易并广播
 * @param txHex
 * @returns {Promise<any>}
 **/
export async function validateAndBroadcast(txHex) {
  return await post('/', 'validateTx', [txHex])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        let newHash = response.result.value;
        return post('/', 'broadcastTx', [txHex])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              return {success: true, hash: newHash};
            } else {
              return {success: false, data: response.error};
            }
          })
          .catch((error) => {
            return {success: false, data: error};
          });
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 获取节点的委托列表
 * @param agentHash
 * @returns {Promise<any>}
 **/
export async function agentDeposistList(agentHash) {
  return await post('/', 'getConsensusDeposit', [1, 300, agentHash])
    .then((response) => {
      return response.result;
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 获取合约代码构造函数
 * @param contractCodeHex
 * @returns {Promise<any>}
 */
export async function getContractConstructor(contractCodeHex) {
  return await post('/', 'getContractConstructor', [contractCodeHex])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result.constructor};
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 获取链ID对应的前缀
 * @returns {Promise<any>}
 */
export async function getAllAddressPrefix() {
  let newData = [
    {chainId: 1, addressPrefix: 'NULS'},
    {chainId: 2, addressPrefix: 'tNULS'},
  ];
  await post('/', 'getAllAddressPrefix', [])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        if (sessionStorage.hasOwnProperty('prefixData')) {
          sessionStorage.removeItem('prefixData')
        }
        sessionStorage.setItem('prefixData', JSON.stringify(response.result));
      } else {
        sessionStorage.setItem('prefixData', JSON.stringify(newData));
      }
    })
    .catch((error) => {
      console.log(error);
      sessionStorage.setItem('prefixData', JSON.stringify(newData));
    });
}

//根据链ID获取前缀
export async function getPrefixByChainId(chainId) {
  await getAllAddressPrefix();
  let prefixData = JSON.parse(sessionStorage.getItem('prefixData'));
  if (prefixData) {
    let newInfo = prefixData.find((v) => {
      return v.chainId === chainId;
    });
    return newInfo.addressPrefix;
  } else {
    return '';
  }
}

/**
 * @disc: 获取扫描后签名信息
 * @params: importRandomString
 * @date: 2019-12-02 16:39
 * @author: Wave
 */
export async function getScanAutograph(randomString) {
  return await post('/', 'getMsg', [randomString])
    .then(async (response) => {
      //console.log(response);
      if (response.hasOwnProperty("result") && response.result.pubkey) {
        if (response.result.pubkey && response.result.signData) {
          return {success: true, data: {signData: response.result.signData, pubkey: response.result.pubkey}}
        } else {
          return {success: true, data: {}}
        }
      } else {
        return {success: false, data: response}
      }
    })
    .catch((error) => {
      return {success: false, data: error}
    });
}

/**
 * @disc: 发送消息到后台
 * @params: key,value
 * @date: 2019-12-02 16:39
 * @author: Wave
 */
export async function commitData(txHexKey, signDataKey, address, assembleHex) {
  let parameterValue = {
    address: address,
    hash: assembleHex.getHash().toString('hex'),
    txHex: assembleHex.txSerialize().toString("hex")
  };
  return await post('/', 'commitMsg', [txHexKey, parameterValue])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        let txInfo = {
          url: localStorage.hasOwnProperty('url') ? JSON.parse(localStorage.getItem('url')).urls : 'https://beta.wallet.nuls.io/api',
          txHexKey: txHexKey,
          signDataKey: signDataKey,
        };
        /*console.log(txInfo);
        console.log(parameterValue.hash);
        console.log(parameterValue.txHex);*/
        return {success: true, data: {txInfo: txInfo, assembleHex: assembleHex}}
      } else {
        return {success: false, data: response}
      }
    })
    .catch((error) => {
      return {success: false, data: error}
    });
}
