import sdk from 'nuls-sdk-js/lib/api/sdk'
import utils from 'nuls-sdk-js/lib/utils/utils'
import {MAIN_INFO} from '@/config.js'
import {Times} from '@/api/util'
import {post} from './https'

/**
 * 不上链方法调用
 * @param contractAddress
 * @param methodName
 * @param methodDesc
 * @param args
 */
export async function methodCall(contractAddress, methodName, methodDesc, args) {
  //console.log(contractAddress, methodName, methodDesc, args);
  return await post('/', 'invokeView', [contractAddress, methodName, methodDesc, args])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result}
      } else {
        return {success: false, data: response}
      }
    })
    .catch((error) => {
      return {success: false, data: error}
    });
}

/**
 * 上链方法调用
 */
export async function chainMethodCall(address, methodsInfo, contractAddress, values, args) {
  let resData = await validateContractCall(address, Number(Times(values, 100000000)), sdk.CONTRACT_MAX_GASLIMIT, sdk.CONTRACT_MINIMUM_PRICE, contractAddress, methodsInfo.name, methodsInfo.desc, args);
  if (resData.success) {
    return {success: true, data: resData.data};
  } else {
    return {success: false, data: resData.data};
  }
}

/**
 * 验证调用合约交易
 * @param sender
 * @param value
 * @param gasLimit
 * @param price
 * @param contractAddress
 * @param methodName
 * @param methodDesc
 * @param args
 */
async function validateContractCall(sender, value, gasLimit, price, contractAddress, methodName, methodDesc, args) {
  return await post('/', 'validateContractCall', [sender, value, gasLimit, price, contractAddress, methodName, methodDesc, args])
    .then(async (response) => {
      //console.log(response);
      if (response.result.success) {
        //return {success: true, data: response.result};
        let resData = await imputedContractCallGas(sender, value, contractAddress, methodName, methodDesc, args);
        if (resData.success) {
          return {success: true, data: resData.data};
        } else {
          return {success: false, data: resData.data};
        }
      } else {
        return {success: false, data: response.result.msg};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 预估调用合约交易的gas
 * @param sender
 * @param value
 * @param contractAddress
 * @param methodName
 * @param methodDesc
 * @param args
 */
async function imputedContractCallGas(sender, value, contractAddress, methodName, methodDesc, args) {
  return await post('/', 'imputedContractCallGas', [sender, value, contractAddress, methodName, methodDesc, args])
    .then(async (response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        let contractConstructorArgsTypes = await getContractMethodArgsTypes(contractAddress, methodName, methodDesc);
        if (!contractConstructorArgsTypes.success) {
          return {success: false, data: contractConstructorArgsTypes.data};
        }
        let newArgs = utils.twoDimensionalArray(args, contractConstructorArgsTypes.data);
        let contractCallData = {
          chainId: MAIN_INFO.chainId,
          sender: sender,
          contractAddress: contractAddress,
          value: value,
          gasLimit: response.result.gasLimit,
          price: 25,
          methodName: methodName,
          methodDesc: methodDesc,
          args: newArgs
        };
        return {success: true, data: contractCallData};
      } else {
        return {success: false, data: response.data};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 获取合约指定函数的参数类型
 * @param contractAddress
 * @param  methodName
 * @param  methodDesc
 */
async function getContractMethodArgsTypes(contractAddress, methodName, methodDesc) {
  return await post('/', 'getContractMethodArgsTypes', [contractAddress, methodName, methodDesc])
    .then((response) => {
      //console.log(response);
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

