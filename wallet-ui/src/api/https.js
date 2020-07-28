import axios from 'axios'
import * as config from './../config.js'
import {chainID} from './util'

axios.defaults.timeout = config.API_TIME;
axios.defaults.baseURL = config.API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
import logger from "./logger-web"

// import logger from "./logger-desktop"

/**
 * 封装post请求
 * Encapsulation post method
 * @param url
 * @param methodName
 * @param data
 * @returns {Promise}
 */
export function post(url, methodName, data = [], templateName = '') {
  axios.defaults.baseURL = config.API_URL;
  return new Promise((resolve, reject) => {
    if (methodName !== 'getMsg' && methodName !== 'commitMsg') {
      data.unshift(chainID());
    }
    const params = {"jsonrpc": "2.0", "method": methodName, "params": data, "id": Math.floor(Math.random() * 1000)};
    //console.log(params);
    axios.post(url, params)
      .then(response => {
        //console.log(response);
        if (!response.data.hasOwnProperty('error')) {
          logger.info(methodName + ' ' + templateName);
        } else {
          logger.warn(methodName + ' ' + JSON.stringify(response.data.error) + ' ' + templateName);
        }
        resolve(response.data);
      }, err => {
        logger.error(err + ' params:' + params + ' ' + templateName);
        reject(err)
      })
  })
}
