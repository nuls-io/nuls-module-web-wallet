(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3fe0fe72"],{"0a90":function(e,t,r){var s=r("63b6"),n=r("10ff");s(s.G+s.F*(parseFloat!=n),{parseFloat:n})},"0d40":function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"transfer bg-gray"},[r("h3",{staticClass:"title"},[e._v("NULS 转账")]),r("div",{staticClass:"w1200 bg-white"},[r("el-form",{ref:"transferForm",attrs:{model:e.transferForm,rules:e.transferRules}},[r("el-form-item",{attrs:{label:"付款地址:"}},[r("el-input",{attrs:{disabled:""},model:{value:e.transferForm.fromAddress,callback:function(t){e.$set(e.transferForm,"fromAddress","string"===typeof t?t.trim():t)},expression:"transferForm.fromAddress"}})],1),r("el-form-item",{attrs:{label:"收款地址:",prop:"toAddress"}},[r("el-input",{model:{value:e.transferForm.toAddress,callback:function(t){e.$set(e.transferForm,"toAddress","string"===typeof t?t.trim():t)},expression:"transferForm.toAddress"}},[r("i",{staticClass:"iconfont iconlianxiren click",attrs:{slot:"suffix"},on:{click:e.showBook},slot:"suffix"})])],1),r("el-form-item",{attrs:{label:"资产类型:"}},[r("el-select",{model:{value:e.transferForm.type,callback:function(t){e.$set(e.transferForm,"type",t)},expression:"transferForm.type"}},[r("el-option",{attrs:{label:"NULS",value:"NULS"}})],1)],1),r("el-form-item",{attrs:{label:"转账金额:",prop:"amount"}},[r("span",{staticClass:"balance font12 fr"},[e._v("可用余额："+e._s(e.addressInfo.balance))]),r("el-input",{model:{value:e.transferForm.amount,callback:function(t){e.$set(e.transferForm,"amount",t)},expression:"transferForm.amount"}})],1),r("el-form-item",{attrs:{"label.trim":"备注:"}},[r("el-input",{attrs:{type:"textarea"},on:{change:e.countFee},model:{value:e.transferForm.remarks,callback:function(t){e.$set(e.transferForm,"remarks",t)},expression:"transferForm.remarks"}})],1),r("div",{staticClass:"font14"},[r("el-tooltip",{attrs:{placement:"top"}},[r("div",{attrs:{slot:"content"},slot:"content"},[e._v("该手续费值是根据当前NULS网络预估的，实际消耗可能小于该值，多余部分将会通过共识奖励退回")]),r("i",{staticClass:"el-icon-warning"})]),e._v("\n        手续费："+e._s(e.fee)+" "),r("span",{staticClass:"fCN"},[e._v("NULS")])],1),r("el-form-item",{staticClass:"form-next"},[r("el-button",{attrs:{type:"success"},on:{click:function(t){return e.submitForm("transferForm")}}},[e._v("下一步")])],1)],1)],1),r("Password",{ref:"password",on:{passwordSubmit:e.passSubmit}}),r("el-dialog",{staticClass:"confirm-dialog",attrs:{title:"转账确认",visible:e.transferVisible,width:"40rem"},on:{"update:visible":function(t){e.transferVisible=t}}},[r("div",{staticClass:"bg-white"},[r("div",{staticClass:"div-data"},[r("p",[e._v("付款地址：")]),r("label",[e._v(e._s(e.transferForm.fromAddress))])]),r("div",{staticClass:"div-data"},[r("p",[e._v("收款地址：")]),r("label",[e._v(e._s(e.transferForm.toAddress))])]),r("div",{staticClass:"div-data"},[r("p",[e._v("手续费：")]),r("label",[e._v(e._s(e.fee)+" "),r("span",{staticClass:"fCN"},[e._v("NULS")])])]),r("div",{staticClass:"div-data"},[r("p",[e._v("金额：")]),r("label",{staticClass:"yellow"},[e._v(e._s(e.transferForm.amount)+" "),r("span",{staticClass:"fCN"},[e._v("NULS")])])]),r("div",{staticClass:"div-data"},[r("p",[e._v("备注：")]),r("label",[e._v(e._s(e.transferForm.remarks))])])]),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:function(t){e.transferVisible=!1}}},[e._v("取 消")]),r("el-button",{attrs:{type:"success"},on:{click:e.confirmTraanser}},[e._v("确认提交")])],1)])],1)},n=[],a=(r("c5f6"),r("96cf"),r("3b8d")),o=(r("6b54"),r("06db"),r("e814")),i=r.n(o),c=r("59ad"),u=r.n(c),f=r("0ad0"),d=r.n(f),l=r("6ace"),p=r("1959"),m=r("d1f0"),b={data:function(){var e=this,t=function(e,t,r){var s=/^(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{20,50}$/;""===t?r(new Error("请输入收款地址")):s.exec(t)?r():r(new Error("请输入正确的收款地址"))},r=function(t,r,s){var n=/^([1-9][\d]{0,72}|0)(\.[\d]{1,72})?$/;""===r?s(new Error("请输入金额")):n.exec(r)?u()(r)<.001?s(new Error("金额必须大于0.001")):setTimeout(function(){i()(Object(l["b"])(r).toString())>i()(Object(l["b"])(e.addressInfo.balance).toString())?s(new Error("金额不能大于可用余额")):s()},200):s(new Error("金额必须为数字"))};return{addressInfo:"",balanceInfo:"",transferForm:{fromAddress:"",toAddress:"",type:"NULS",amount:"",remarks:""},transferRules:{toAddress:[{validator:t,trigger:["blur","change"]}],amount:[{validator:r,trigger:["blur","change"]}]},fee:.001,transferVisible:!1}},created:function(){var e=this;this.addressInfo=JSON.parse(sessionStorage.getItem(sessionStorage.key(0))),setInterval(function(){e.addressInfo=JSON.parse(sessionStorage.getItem(sessionStorage.key(0)))},500),this.transferForm.fromAddress=this.addressInfo.address},watch:{addressInfo:function(e,t){e.address!==t.address&&t.address&&(this.transferForm.fromAddress=this.addressInfo.address)}},components:{Password:m["a"]},methods:{countFee:function(){for(var e=this.transferForm.remarks,t=0,r=0;r<e.length;r++){var s=e.charCodeAt(r);s>=1&&s<=126||65376<=s&&s<=65439?t++:t+=2}t>200?console.log(t):console.log("len:"+t)},txAssemble:function(){var e=Object(a["a"])(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(p["c"])(this.transferForm.fromAddress).then(function(e){if(e.success){t.balanceInfo=e.data;var r={fromAddress:t.transferForm.fromAddress,toAddress:t.transferForm.toAddress,assetsChainId:2,assetsId:1,amount:Number(Object(l["c"])(t.transferForm.amount,1e8).toString()),fee:1e4},s=Object(p["d"])(r,t.balanceInfo,2),n=[];if(s.success){n=d.a.transactionAssemble(s.data.inputs,s.data.outputs,t.transferForm.remarks,2);var a=Object(p["b"])(n,1);return r.fee!==a?(r.fee=a,s=Object(p["d"])(r,t.balanceInfo,2),d.a.transactionAssemble(s.data.inputs,s.data.outputs,t.transferForm.remarks,2)):n}t.$message({message:"input和outputs组装错误："+s.data,type:"error",duration:1e3})}else t.$message({message:"获取账户余额失败:"+e,type:"error",duration:1e3})}).catch(function(e){t.$message({message:"获取账户余额失败："+e,type:"error",duration:1e3})});case 2:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),submitForm:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),!1;t.transferVisible=!0})},confirmTraanser:function(){var e=Object(a["a"])(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(p["c"])(this.transferForm.fromAddress).then(function(e){e.success?(t.balanceInfo=e.data,t.$refs.password.showPassword(!0)):t.$message({message:"获取账户余额失败:"+e,type:"error",duration:1e3})}).catch(function(e){t.$message({message:"获取账户余额失败："+e,type:"error",duration:1e3})});case 2:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),getNulsBalance:function(){var e=Object(a["a"])(regeneratorRuntime.mark(function e(){var t,r,s=this,n=arguments;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=n.length>0&&void 0!==n[0]?n[0]:1,r=n.length>1?n[1]:void 0,e.next=4,this.$post("/","getAccountBalance",[t,r]).then(function(e){e.hasOwnProperty("result")?(s.balanceInfo={balance:e.result.balance,nonce:e.result.nonce},s.$refs.password.showPassword(!0)):s.$message({message:"获取账户余额失败:"+e,type:"error",duration:1e3})}).catch(function(e){s.$message({message:"获取账户余额失败："+e,type:"error",duration:1e3})});case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),passSubmit:function(){var e=Object(a["a"])(regeneratorRuntime.mark(function e(t){var r,s,n,a,o,i,c,u=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(r=d.a.decrypteOfAES(this.addressInfo.aesPri,t),s=d.a.importByKey(2,r,t),s.address!==this.addressInfo.address){e.next=37;break}return n={fromAddress:this.transferForm.fromAddress,toAddress:this.transferForm.toAddress,assetsChainId:2,assetsId:1,amount:Number(Object(l["c"])(this.transferForm.amount,1e8).toString()),fee:1e4},e.next=6,Object(p["d"])(n,this.balanceInfo,2);case 6:if(a=e.sent,o=[],i="",!a.success){e.next=32;break}return e.next=12,d.a.transactionAssemble(a.data.inputs,a.data.outputs,this.transferForm.remarks,2);case 12:if(o=e.sent,c=Object(p["b"])(o,1),n.fee===c){e.next=27;break}return n.fee=c,e.next=18,Object(p["d"])(n,this.balanceInfo,2);case 18:return a=e.sent,e.next=21,d.a.transactionAssemble(a.data.inputs,a.data.outputs,this.transferForm.remarks,2);case 21:return o=e.sent,e.next=24,d.a.transactionSerialize(d.a.decrypteOfAES(this.addressInfo.aesPri,t),this.addressInfo.pub,o);case 24:i=e.sent,e.next=30;break;case 27:return e.next=29,d.a.transactionSerialize(d.a.decrypteOfAES(this.addressInfo.aesPri,t),this.addressInfo.pub,o);case 29:i=e.sent;case 30:e.next=33;break;case 32:this.$message({message:a.data,type:"error",duration:1e3});case 33:return e.next=35,Object(p["e"])(i).then(function(e){e.success?u.toUrl("txList"):u.$message({message:e.data,type:"error",duration:1e3})}).catch(function(e){u.$message({message:"验证并广播交易异常："+e,type:"error",duration:1e3})});case 35:e.next=38;break;case 37:this.$message({message:"对不起，密码错误",type:"error",duration:1e3});case 38:case"end":return e.stop()}},e,this)}));function t(t){return e.apply(this,arguments)}return t}(),showBook:function(){this.$message({message:"开发者......",duration:1e3})},toUrl:function(e){this.$router.push({name:e})}}},h=b,v=(r("3fbe"),r("2877")),g=Object(v["a"])(h,s,n,!1,null,null,null);t["default"]=g.exports},"10ff":function(e,t,r){var s=r("e53d").parseFloat,n=r("a1ce").trim;e.exports=1/s(r("e692")+"-0")!==-1/0?function(e){var t=n(String(e),3),r=s(t);return 0===r&&"-"==t.charAt(0)?-0:r}:s},"11e9":function(e,t,r){var s=r("52a7"),n=r("4630"),a=r("6821"),o=r("6a99"),i=r("69a8"),c=r("c69a"),u=Object.getOwnPropertyDescriptor;t.f=r("9e1e")?u:function(e,t){if(e=a(e),t=o(t,!0),c)try{return u(e,t)}catch(r){}if(i(e,t))return n(!s.f.call(e,t),e[t])}},"188a":function(e,t,r){},1959:function(e,t,r){"use strict";r.d(t,"c",function(){return a}),r.d(t,"b",function(){return i}),r.d(t,"d",function(){return c}),r.d(t,"e",function(){return f}),r.d(t,"a",function(){return l});r("96cf");var s=r("3b8d"),n=r("9f30");function a(e){return o.apply(this,arguments)}function o(){return o=Object(s["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(n["a"])("/","getAccountBalance",[1,t]).then(function(e){return e.hasOwnProperty("result")?{success:!0,data:{balance:e.result.balance,nonce:e.result.nonce}}:{success:!1,data:e}}).catch(function(e){return{success:!1,data:e}});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)})),o.apply(this,arguments)}function i(e,t){var r=e.txSerialize().length;return r+=110*t,1e5*Math.ceil(r/1024)}function c(e,t,r){return u.apply(this,arguments)}function u(){return u=Object(s["a"])(regeneratorRuntime.mark(function e(t,r,s){var n,a,o,i,c,u,f;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(n=t.amount+t.fee,a=0,o=r.nonce,i=t.amount,c=0,!(r.balance<t.amount+t.fee)){e.next=7;break}return e.abrupt("return",{success:!1,data:"Your balance is not enough."});case 7:return 4===s?c=-1:5===s?c=-1:6===s?(n=t.amount,a=-1,o=t.depositHash.substring(t.depositHash.length-16),i=t.amount-t.fee):9===s&&(n=t.amount,a=-1,o=t.depositHash.substring(t.depositHash.length-16),i=t.amount-t.fee,c=(new Date).valueOf()+2592e5),u=[{address:t.fromAddress,assetsChainId:t.assetsChainId,assetsId:t.assetsId,amount:n,locked:a,nonce:o}],f=[{address:t.toAddress?t.toAddress:t.fromAddress,assetsChainId:t.assetsChainId,assetsId:t.assetsId,amount:i,lockTime:c}],e.abrupt("return",{success:!0,data:{inputs:u,outputs:f}});case 11:case"end":return e.stop()}},e)})),u.apply(this,arguments)}function f(e){return d.apply(this,arguments)}function d(){return d=Object(s["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(n["a"])("/","validateTx",[t]).then(function(e){if(console.log(e),e.hasOwnProperty("result")){var r=e.result.value;return Object(n["a"])("/","broadcastTx",[t]).then(function(e){return e.hasOwnProperty("result")?{success:!0,hash:r}:{success:!1,data:e.error}}).catch(function(e){return{success:!1,data:e}})}return{success:!1,data:e.error}}).catch(function(e){return{success:!1,data:e}});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)})),d.apply(this,arguments)}function l(e){return p.apply(this,arguments)}function p(){return p=Object(s["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(n["a"])("/","getConsensusDeposit",[1,100,t]).then(function(e){return e.result}).catch(function(e){return{success:!1,data:e}});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)})),p.apply(this,arguments)}},"243f":function(e,t,r){},"3fbe":function(e,t,r){"use strict";var s=r("243f"),n=r.n(s);n.a},"59ad":function(e,t,r){e.exports=r("7be7")},"5d6b":function(e,t,r){var s=r("e53d").parseInt,n=r("a1ce").trim,a=r("e692"),o=/^[-+]?0[xX]/;e.exports=8!==s(a+"08")||22!==s(a+"0x16")?function(e,t){var r=n(String(e),3);return s(r,t>>>0||(o.test(r)?16:10))}:s},"5dbc":function(e,t,r){var s=r("d3f4"),n=r("8b97").set;e.exports=function(e,t,r){var a,o=t.constructor;return o!==r&&"function"==typeof o&&(a=o.prototype)!==r.prototype&&s(a)&&n&&n(e,a),e}},7445:function(e,t,r){var s=r("63b6"),n=r("5d6b");s(s.G+s.F*(parseInt!=n),{parseInt:n})},7672:function(e,t,r){"use strict";var s=r("188a"),n=r.n(s);n.a},"7be7":function(e,t,r){r("0a90"),e.exports=r("584a").parseFloat},"8b97":function(e,t,r){var s=r("d3f4"),n=r("cb7c"),a=function(e,t){if(n(e),!s(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(e,t,s){try{s=r("9b43")(Function.call,r("11e9").f(Object.prototype,"__proto__").set,2),s(e,[]),t=!(e instanceof Array)}catch(n){t=!0}return function(e,r){return a(e,r),t?e.__proto__=r:s(e,r),e}}({},!1):void 0),check:a}},9093:function(e,t,r){var s=r("ce10"),n=r("e11e").concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return s(e,n)}},a1ce:function(e,t,r){var s=r("63b6"),n=r("25eb"),a=r("294c"),o=r("e692"),i="["+o+"]",c="​",u=RegExp("^"+i+i+"*"),f=RegExp(i+i+"*$"),d=function(e,t,r){var n={},i=a(function(){return!!o[e]()||c[e]()!=c}),u=n[e]=i?t(l):o[e];r&&(n[r]=u),s(s.P+s.F*i,"String",n)},l=d.trim=function(e,t){return e=String(n(e)),1&t&&(e=e.replace(u,"")),2&t&&(e=e.replace(f,"")),e};e.exports=d},aa77:function(e,t,r){var s=r("5ca1"),n=r("be13"),a=r("79e5"),o=r("fdef"),i="["+o+"]",c="​",u=RegExp("^"+i+i+"*"),f=RegExp(i+i+"*$"),d=function(e,t,r){var n={},i=a(function(){return!!o[e]()||c[e]()!=c}),u=n[e]=i?t(l):o[e];r&&(n[r]=u),s(s.P+s.F*i,"String",n)},l=d.trim=function(e,t){return e=String(n(e)),1&t&&(e=e.replace(u,"")),2&t&&(e=e.replace(f,"")),e};e.exports=d},b9e9:function(e,t,r){r("7445"),e.exports=r("584a").parseInt},c5f6:function(e,t,r){"use strict";var s=r("7726"),n=r("69a8"),a=r("2d95"),o=r("5dbc"),i=r("6a99"),c=r("79e5"),u=r("9093").f,f=r("11e9").f,d=r("86cc").f,l=r("aa77").trim,p="Number",m=s[p],b=m,h=m.prototype,v=a(r("2aeb")(h))==p,g="trim"in String.prototype,w=function(e){var t=i(e,!1);if("string"==typeof t&&t.length>2){t=g?t.trim():l(t,3);var r,s,n,a=t.charCodeAt(0);if(43===a||45===a){if(r=t.charCodeAt(2),88===r||120===r)return NaN}else if(48===a){switch(t.charCodeAt(1)){case 66:case 98:s=2,n=49;break;case 79:case 111:s=8,n=55;break;default:return+t}for(var o,c=t.slice(2),u=0,f=c.length;u<f;u++)if(o=c.charCodeAt(u),o<48||o>n)return NaN;return parseInt(c,s)}}return+t};if(!m(" 0o1")||!m("0b1")||m("+0x1")){m=function(e){var t=arguments.length<1?0:e,r=this;return r instanceof m&&(v?c(function(){h.valueOf.call(r)}):a(r)!=p)?o(new b(w(t)),r,m):w(t)};for(var x,F=r("9e1e")?u(b):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),y=0;F.length>y;y++)n(b,x=F[y])&&!n(m,x)&&d(m,x,f(b,x));m.prototype=h,h.constructor=m,r("2aba")(s,p,m)}},d1f0:function(e,t,r){"use strict";var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("el-dialog",{staticClass:"password-dialog",attrs:{title:"密码",visible:e.passwordVisible,top:"30vh",width:"30rem","close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.passwordVisible=t},open:e.passwordShow,close:e.passwordClose}},[r("el-form",{ref:"passwordForm",attrs:{model:e.passwordForm,rules:e.passwordRules},nativeOn:{submit:function(e){e.preventDefault()}}},[r("div",[e._v("请输入密码")]),r("el-form-item",{attrs:{prop:"password"}},[r("el-input",{ref:"inpus",attrs:{type:"password",maxlength:22},model:{value:e.passwordForm.password,callback:function(t){e.$set(e.passwordForm,"password",t)},expression:"passwordForm.password"}})],1)],1),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:e.passwordClose}},[e._v("取 消")]),r("el-button",{attrs:{type:"success",id:"passwordInfo"},on:{click:function(t){return e.dialogSubmit("passwordForm")}}},[e._v("确 定")])],1)],1)},n=[],a={props:{},data:function(){var e=function(e,t,r){""===t?r(new Error("请输入密码")):r()};return{passwordVisible:!1,passwordForm:{password:""},passwordRules:{password:[{validator:e,trigger:["blur","change"]}]}}},mounted:function(){},watch:{passwordVisible:function(e){e&&setTimeout(function(){},200)}},methods:{passwordShow:function(){},passwordClose:function(){this.$refs["passwordForm"].resetFields(),this.passwordVisible=!1},showPassword:function(e){this.passwordVisible=e},dialogSubmit:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;t.$emit("passwordSubmit",t.passwordForm.password),t.passwordVisible=!1})}}},o=a,i=(r("7672"),r("2877")),c=Object(i["a"])(o,s,n,!1,null,null,null);t["a"]=c.exports},e692:function(e,t){e.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},e814:function(e,t,r){e.exports=r("b9e9")},fdef:function(e,t){e.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);
//# sourceMappingURL=chunk-3fe0fe72.8b430bdc.js.map