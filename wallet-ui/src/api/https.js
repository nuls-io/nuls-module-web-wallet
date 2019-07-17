import axios from 'axios'
import * as config from './../config.js'
import {chainID} from './util'

axios.defaults.timeout = config.API_TIME;
axios.defaults.baseURL = config.API_URL;
setInterval(() => {
    axios.defaults.baseURL = config.API_URL;
}, 500);
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
    return new Promise((resolve, reject) => {
        data.unshift(chainID());
        const params = {"jsonrpc": "2.0", "method": methodName, "params": data, "id": 5898};
        axios.post(url, params)
            .then(response => {
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