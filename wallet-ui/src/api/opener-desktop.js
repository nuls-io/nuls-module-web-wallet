/**
 * Created by zhoulijun on 2019-07-16.
 */
import {shell} from 'electron';
export default (url)=>{
    shell.openExternal(url);
}
