(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6f4f4740"],{"0a49":function(e,t,s){var n=s("9b43"),a=s("626a"),r=s("4bf8"),o=s("9def"),i=s("cd1c");e.exports=function(e,t){var s=1==e,c=2==e,u=3==e,d=4==e,l=6==e,p=5==e||l,f=t||i;return function(t,i,h){for(var b,m,g=r(t),v=a(g),w=n(i,h,3),I=o(v.length),x=0,y=s?f(t,I):c?f(t,0):void 0;I>x;x++)if((p||x in v)&&(b=v[x],m=w(b,x,g),e))if(s)y[x]=m;else if(m)switch(e){case 3:return!0;case 5:return b;case 6:return x;case 2:y.push(b)}else if(d)return!1;return l?-1:u||d?d:y}}},"188a":function(e,t,s){},1959:function(e,t,s){"use strict";s.d(t,"i",function(){return i}),s.d(t,"d",function(){return c}),s.d(t,"c",function(){return u}),s.d(t,"h",function(){return l}),s.d(t,"f",function(){return f}),s.d(t,"k",function(){return b}),s.d(t,"b",function(){return g}),s.d(t,"j",function(){return w}),s.d(t,"a",function(){return x}),s.d(t,"e",function(){return _}),s.d(t,"g",function(){return O});s("7514"),s("c5f6"),s("6b54"),s("96cf");var n=s("3b8d"),a=s("9f30"),r=s("6ace"),o=s("db49");function i(e){return e===o["e"].chainId}function c(e,t){var s=e.txSerialize().length;return s+=110*t,1e5*Math.ceil(s/1024)}function u(e,t){return d.apply(this,arguments)}function d(){return d=Object(n["a"])(regeneratorRuntime.mark(function e(t,s){var n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=0,e.next=3,Object(a["a"])("/","getByzantineCount",[t.txSerialize().toString("hex")]).then(function(e){if(e.hasOwnProperty("result")){var a=t.txSerialize().length;a+=110*(s+e.result.value),n=1e6*Math.ceil(a/1024)}else n=-100}).catch(function(e){console.log(e),n=-100});case 3:return e.abrupt("return",n);case 4:case"end":return e.stop()}},e)})),d.apply(this,arguments)}function l(e,t,s){return p.apply(this,arguments)}function p(){return p=Object(n["a"])(regeneratorRuntime.mark(function e(t,s,n){var a,o,i,c,u,d,l,p;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(a=Number(Object(r["b"])(t.amount,t.fee)),o=0,i=s.nonce,c=t.amount,u=0,4===n?u=-1:5===n?u=-1:6===n?(a=t.amount,o=-1,i=t.depositHash.substring(t.depositHash.length-16),c=t.amount-t.fee):9===n?(a=t.amount,o=-1,i=t.depositHash.substring(t.depositHash.length-16),c=t.amount-t.fee,u=(new Date).valueOf()+2592e5):16===n&&(a=t.amount),d=[{address:t.fromAddress,assetsChainId:t.assetsChainId,assetsId:t.assetsId,amount:a,locked:o,nonce:i}],2!==n||t.assetsChainId===Object(r["f"])()){e.next=16;break}return d[0].amount=t.amount,e.next=11,f(Object(r["f"])(),t.assetsId,t.fromAddress);case 11:if(l=e.sent,!(l.data.balance<1e5)){e.next=15;break}return console.log("余额小于手续费"),e.abrupt("return");case 15:d.push({address:t.fromAddress,assetsChainId:Object(r["f"])(),assetsId:t.assetsId,amount:1e5,locked:o,nonce:l.data.nonce});case 16:if(p=[],15!==n&&17!==n){e.next=19;break}return e.abrupt("return",{success:!0,data:{inputs:d,outputs:p}});case 19:if(16!==n){e.next=26;break}if(!t.toAddress){e.next=25;break}return t.value&&(p=[{address:t.toAddress,assetsChainId:t.assetsChainId,assetsId:t.assetsId,amount:t.value,lockTime:u}]),e.abrupt("return",{success:!0,data:{inputs:d,outputs:p}});case 25:c=t.value;case 26:return p=[{address:t.toAddress?t.toAddress:t.fromAddress,assetsChainId:t.assetsChainId,assetsId:t.assetsId,amount:c,lockTime:u}],e.abrupt("return",{success:!0,data:{inputs:d,outputs:p}});case 28:case"end":return e.stop()}},e)})),p.apply(this,arguments)}function f(){return h.apply(this,arguments)}function h(){return h=Object(n["a"])(regeneratorRuntime.mark(function e(){var t,s,n,r=arguments;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=r.length>0&&void 0!==r[0]?r[0]:2,s=r.length>1&&void 0!==r[1]?r[1]:1,n=r.length>2?r[2]:void 0,e.next=5,Object(a["a"])("/","getAccountBalance",[t,s,n]).then(function(e){return e.hasOwnProperty("result")?{success:!0,data:{balance:e.result.balance,nonce:e.result.nonce}}:{success:!1,data:e}}).catch(function(e){return{success:!1,data:e}});case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}},e)})),h.apply(this,arguments)}function b(e){return m.apply(this,arguments)}function m(){return m=Object(n["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(a["a"])("/","validateTx",[t]).then(function(e){return e.hasOwnProperty("result")?{success:!0,data:e.result}:{success:!1,data:e.error}}).catch(function(e){return{success:!1,data:e}});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)})),m.apply(this,arguments)}function g(e){return v.apply(this,arguments)}function v(){return v=Object(n["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(a["a"])("/","broadcastTx",[t]).then(function(e){return e.hasOwnProperty("result")?{success:!0,data:e.result}:{success:!1,data:e.error}}).catch(function(e){return{success:!1,data:e}});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)})),v.apply(this,arguments)}function w(e){return I.apply(this,arguments)}function I(){return I=Object(n["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(a["a"])("/","validateTx",[t]).then(function(e){if(e.hasOwnProperty("result")){var s=e.result.value;return Object(a["a"])("/","broadcastTx",[t]).then(function(e){return e.hasOwnProperty("result")?{success:!0,hash:s}:{success:!1,data:e.error}}).catch(function(e){return{success:!1,data:e}})}return{success:!1,data:e.error}}).catch(function(e){return{success:!1,data:e}});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)})),I.apply(this,arguments)}function x(e){return y.apply(this,arguments)}function y(){return y=Object(n["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(a["a"])("/","getConsensusDeposit",[1,300,t]).then(function(e){return e.result}).catch(function(e){return{success:!1,data:e}});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)})),y.apply(this,arguments)}function _(e){return $.apply(this,arguments)}function $(){return $=Object(n["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(a["a"])("/","getContractConstructor",[t]).then(function(e){return e.hasOwnProperty("result")?{success:!0,data:e.result.constructor}:{success:!1,data:e.error}}).catch(function(e){return{success:!1,data:e}});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)})),$.apply(this,arguments)}function k(){return j.apply(this,arguments)}function j(){return j=Object(n["a"])(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=[{chainId:1,addressPrefix:"NULS"},{chainId:2,addressPrefix:"tNULS"}],e.next=3,Object(a["a"])("/","getAllAddressPrefix",[]).then(function(e){e.hasOwnProperty("result")?(sessionStorage.hasOwnProperty("prefixData")&&sessionStorage.removeItem("prefixData"),sessionStorage.setItem("prefixData",JSON.stringify(e.result))):sessionStorage.setItem("prefixData",JSON.stringify(t))}).catch(function(e){console.log(e),sessionStorage.setItem("prefixData",JSON.stringify(t))});case 3:case"end":return e.stop()}},e)})),j.apply(this,arguments)}function O(e){return A.apply(this,arguments)}function A(){return A=Object(n["a"])(regeneratorRuntime.mark(function e(t){var s,n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,k();case 2:if(s=JSON.parse(sessionStorage.getItem("prefixData")),!s){e.next=8;break}return n=s.find(function(e){return e.chainId===t}),e.abrupt("return",n.addressPrefix);case 8:return e.abrupt("return","");case 9:case"end":return e.stop()}},e)})),A.apply(this,arguments)}},"2e64":function(e,t,s){"use strict";var n=s("ff03"),a=s.n(n);a.a},"45e9":function(e,t,s){"use strict";var n=s("90c8"),a=s.n(n);a.a},7514:function(e,t,s){"use strict";var n=s("5ca1"),a=s("0a49")(5),r="find",o=!0;r in[]&&Array(1)[r](function(){o=!1}),n(n.P+n.F*o,"Array",{find:function(e){return a(this,e,arguments.length>1?arguments[1]:void 0)}}),s("9c6c")(r)},7672:function(e,t,s){"use strict";var n=s("188a"),a=s.n(n);a.a},"90c8":function(e,t,s){},a475:function(e,t,s){"use strict";s.r(t);var n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"consensus_info bg-gray"},[s("div",{staticClass:"bg-white"},[s("div",{staticClass:"w1200"},[s("BackBar",{attrs:{backTitle:e.$t("nav.consensus")}}),s("h3",{staticClass:"title uppercase"},[e._v(e._s(e.nodeInfo.agentId)),s("i",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],staticClass:"el-icon-star-off click"})])],1)]),s("div",{staticClass:"card_long mt_20 w1200 bg-white"},[s("h5",{staticClass:"card-title font18"},[e._v("\n      "+e._s(e.$t("consensusInfo.consensusInfo6"))+"\n      "),s("i",{staticClass:"iconfont",class:0===e.nodeInfo.status?"icondaigongshi fred":"icongongshizhong fCN"}),s("el-button",{directives:[{name:"show",rawName:"v-show",value:e.addressInfo.address===e.nodeInfo.agentAddress,expression:"addressInfo.address === nodeInfo.agentAddress"}],staticClass:"fr fred",attrs:{type:"danger"},on:{click:e.stopNode}},[e._v(e._s(e.$t("consensusInfo.consensusInfo5"))+"\n      ")])],1),s("ul",[s("li",[e._v(e._s(e.$t("public.createAddress"))+" "),s("label",[e._v(e._s(e.nodeInfo.agentAddress))])]),s("li",[e._v(e._s(e.$t("public.deposit"))+" "),s("label",[e._v(e._s(e.nodeInfo.deposits)),s("span",{staticClass:"fCN"},[e._v(e._s(e.agentAsset.agentAsset.symbol))])])]),s("li",[e._v(e._s(e.$t("public.rewardAddress"))+" "),s("label",[e._v(e._s(e.nodeInfo.rewardAddress))])]),s("li",[e._v(e._s(e.$t("public.totalStake"))+" "),s("label",[e._v(e._s(e.nodeInfo.totalDeposit)),s("span",{staticClass:"fCN"},[e._v(e._s(e.agentAsset.agentAsset.symbol))])])]),s("li",[e._v(e._s(e.$t("public.packingAddress"))+" "),s("label",[e._v(e._s(e.nodeInfo.packingAddress))])]),s("li",[e._v(e._s(e.$t("consensusInfo.consensusInfo7"))+" "),s("label",[e._v(e._s(e.nodeInfo.totalReward)),s("span",{staticClass:"fCN"},[e._v(e._s(e.addressInfo.symbol))])])]),s("li",[e._v(e._s(e.$t("consensusInfo.consensusInfo8"))+" "),s("label",[e._v(e._s(e.nodeInfo.agentAlias?e.nodeInfo.agentAlias:"--"))])]),s("li",[e._v(e._s(e.$t("public.participants"))+" "),s("label",[e._v(e._s(e.nodeInfo.depositCount))])]),s("li",[e._v(e._s(e.$t("consensusInfo.consensusInfo9"))+" "),s("label",[e._v(e._s(e.nodeInfo.createTime))])]),s("li",[e._v(e._s(e.$t("public.commission"))+"\n        "),s("label",[e._v(e._s(e.nodeInfo.commissionRate)+"%\n          "),s("el-tooltip",{attrs:{placement:"top"}},[s("div",{attrs:{slot:"content"},slot:"content"},[e._v("\n              "+e._s(e.$t("consensusInfo.consensusInfo12"))+"\n            ")]),s("i",{staticClass:"el-icon-warning"})])],1)]),s("li",[e._v(e._s(e.$t("consensusInfo.consensusInfo10"))+" "),s("label",[s("u",{staticClass:"click td",on:{click:function(t){return e.toUrl("consensusInfo",e.nodeInfo.txHash)}}},[e._v(e._s(e.nodeInfo.yellowCardCount)+e._s(e.$t("consensusInfo.consensusInfo11")))])])]),s("li",[e._v(e._s(e.$t("public.credit"))+" "),s("label",[e._v(e._s(e.nodeInfo.creditValue))])]),s("p",{staticClass:"cb"})])]),s("div",{staticClass:"cb"}),s("div",{directives:[{name:"loading",rawName:"v-loading",value:e.nodeDepositLoading,expression:"nodeDepositLoading"}]},[s("div",{directives:[{name:"show",rawName:"v-show",value:e.jionNode,expression:"jionNode"}],staticClass:"entrust w1200 bg-white"},[s("div",{staticClass:"entrust_add w630"},[s("el-form",{ref:"jionNodeForm",attrs:{model:e.jionNodeForm,"status-icon":"",rules:e.jionNodeRules},nativeOn:{submit:function(e){e.preventDefault()}}},[s("el-form-item",{attrs:{label:e.$t("consensusInfo.consensusInfo1")+"("+e.agentAsset.agentAsset.symbol+")",prop:"amount"}},[s("span",{staticClass:"balance font12 fr"},[e._v(e._s(e.$t("consensus.consensus2"))+"："+e._s(e.balanceInfo.balance/1e8))]),s("el-input",{model:{value:e.jionNodeForm.amount,callback:function(t){e.$set(e.jionNodeForm,"amount",t)},expression:"jionNodeForm.amount"}})],1),s("div",{staticClass:"font14"},[e._v("\n            "+e._s(e.$t("public.fee"))+": "+e._s(e.fee)+" "),s("span",{staticClass:"fCN"},[e._v(e._s(e.agentAsset.agentAsset.symbol))])]),s("el-form-item",{staticClass:"form-next"},[s("el-button",{attrs:{type:"success"},on:{click:function(t){return e.jionNodeSubmitForm("jionNodeForm")}}},[e._v(e._s(e.$t("password.password3"))+"\n            ")])],1)],1)],1)]),s("div",{directives:[{name:"show",rawName:"v-show",value:!e.jionNode,expression:"!jionNode"}],staticClass:"entrust_list w1200"},[s("div",{staticClass:"top_total font14"},[e._v("\n        "+e._s(e.$t("public.totalStake"))+"："+e._s(e.nodeInfo.totalDeposit)+" "),s("span",{staticClass:"fCN"},[e._v(e._s(e.agentAsset.agentAsset.symbol))])]),s("div",{staticClass:"top_ico"},[s("i",{staticClass:"el-icon-plus click",on:{click:e.showNodeList}})]),s("el-table",{attrs:{data:e.nodeDepositData,stripe:"",border:""}},[s("el-table-column",{attrs:{prop:"blockHeight",label:e.$t("public.height"),align:"center"}}),s("el-table-column",{attrs:{prop:"createTime",label:e.$t("consensusList.consensusList1"),align:"center"}}),s("el-table-column",{attrs:{prop:"amount",label:e.$t("public.amount")+"("+e.agentAsset.agentAsset.symbol+")",align:"center"}}),s("el-table-column",{attrs:{label:e.$t("public.operation"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("label",{staticClass:"click tab_bn",on:{click:function(s){return e.cancelDeposit(t.row)}}},[e._v(e._s(e.$t("consensusInfo.consensusInfo0")))])]}}])})],1),s("div",{staticClass:"pages"},[s("div",{staticClass:"page-total"},[e._v("\n          "+e._s(e.$t("public.display"))+" "+e._s(e.pageIndex-1===0?1:(e.pageIndex-1)*e.pageSize)+"-"+e._s(e.pageIndex*e.pageSize)+"\n          "+e._s(e.$t("public.total"))+" "+e._s(e.pageTotal)+"\n        ")]),s("el-pagination",{directives:[{name:"show",rawName:"v-show",value:e.pageTotal>e.pageSize,expression:"pageTotal>pageSize"}],staticClass:"fr",attrs:{background:"","page-size":e.pageSize,layout:" prev, pager, next, jumper",total:e.pageTotal},on:{"current-change":e.nodeDepositPages}})],1)],1)]),s("Password",{ref:"password",on:{passwordSubmit:e.passSubmit}})],1)},a=[],r=(s("6b54"),s("96cf"),s("3b8d")),o=(s("ac4d"),s("8a81"),s("ac6a"),s("c5f6"),s("c32d")),i=s.n(o),c=s("0ad0"),u=s.n(c),d=s("1959"),l=s("6ace"),p=s("d1f0"),f=s("b301"),h={data:function(){var e=this,t=function(t,s,n){var a=Number(Object(l["a"])(5e5,Number(e.nodeInfo.totalDeposit))),r=Number(Object(l["a"])(e.balanceInfo.balance,Number(Object(l["d"])(s,1e8)))),o=/^\d+(?=\.{0,1}\d+$|$)/,i=/^\d{1,8}(\.\d{1,8})?$/;if(!s)return n(new Error(e.$t("consensusInfo.consensusInfo2")));if(o.exec(s)&&i.exec(s)){if(s<2e3)return n(new Error(e.$t("consensusInfo.consensusInfo43")));if(s>a)return n(new Error(e.$t("consensusInfo.consensusInfo41")+a+e.$t("consensusInfo.consensusInfo42")));if(r<.001)return n(new Error(e.$t("transfer.transfer131")+Number(Object(l["a"])(Number(Object(l["p"])(e.balanceInfo.balance)),.001))));n()}else n(new Error(e.$t("consensusInfo.consensusInfo3")))};return{addressInfo:{},balanceInfo:{},agentAsset:JSON.parse(sessionStorage.getItem("info")),nodeInfo:{},fee:.001,outInfo:"",passwordType:0,jionNode:!1,nodeDepositData:[],nodeDepositLoading:!0,pageIndex:1,pageSize:5,pageTotal:0,jionNodeForm:{amount:""},jionNodeRules:{amount:[{validator:t,trigger:["blur","change"]}]},prefix:""}},created:function(){var e=this;Object(d["g"])(Object(l["f"])()).then(function(t){e.prefix=t}).catch(function(t){console.log(t),e.prefix=""}),this.addressInfo=Object(l["e"])(1),setInterval(function(){e.addressInfo=Object(l["e"])(1)},500)},mounted:function(){this.getBalanceByAddress(this.agentAsset.agentAsset.chainId,this.agentAsset.agentAsset.assetId,this.addressInfo.address),this.getNodeInfoByHash(this.$route.query.hash),this.getNodeDepositByHash(this.pageIndex,this.pageSize,this.addressInfo.address,this.$route.query.hash)},components:{Password:p["a"],BackBar:f["a"]},methods:{getNodeInfoByHash:function(e){var t=this;this.$post("/","getConsensusNode",[e]).then(function(e){e.hasOwnProperty("result")&&(e.result.agentReward=Object(l["p"])(e.result.agentReward),e.result.deposits=Object(l["p"])(e.result.deposit),e.result.totalDeposit=Object(l["p"])(e.result.totalDeposit),e.result.totalReward=Object(l["p"])(e.result.totalReward),e.result.createTime=i()(Object(l["l"])(1e3*e.result.createTime)).format("YYYY-MM-DD HH:mm:ss"),t.nodeInfo=e.result)}).catch(function(e){console.log("getConsensusNode:"+e)})},getNodeDepositByHash:function(e,t,s,n){var a=this;this.$post("/","getAccountDeposit",[e,t,s,n]).then(function(e){if(e.hasOwnProperty("result")){var t=!0,s=!1,n=void 0;try{for(var r,o=e.result.list[Symbol.iterator]();!(t=(r=o.next()).done);t=!0){var c=r.value;c.amount=Object(l["p"])(c.amount),c.fee=Object(l["p"])(c.fee),c.createTime=i()(Object(l["l"])(1e3*c.createTime)).format("YYYY-MM-DD HH:mm:ss")}}catch(u){s=!0,n=u}finally{try{t||null==o.return||o.return()}finally{if(s)throw n}}a.nodeDepositData=e.result.list,0===e.result.totalCount?a.jionNode=!0:a.jionNode=!1,a.pageTotal=e.result.totalCount,a.nodeDepositLoading=!1}else a.nodeDepositLoading=!1}).catch(function(e){console.log("getConsensusDeposit:"+e)})},nodeDepositPages:function(e){this.pageIndex=e,this.getNodeDepositByHash(this.pageIndex,this.pageSize,this.addressInfo.address,this.$route.query.hash)},showNodeList:function(){this.jionNode=!0,this.getNodeDepositByHash(this.pageIndex,this.pageSize,this.$route.query.hash)},jionNodeSubmitForm:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;t.$refs.password.showPassword(!0),t.passwordType=0})},getBalanceByAddress:function(e,t,s){var n=this;Object(d["f"])(e,t,s).then(function(e){e.success?n.balanceInfo=e.data:n.$message({message:n.$t("public.err2")+e,type:"error",duration:1e3})}).catch(function(e){n.$message({message:n.$t("public.err3")+e,type:"error",duration:1e3})})},cancelDeposit:function(e){var t=this;this.outInfo=e,Object(d["f"])(this.agentAsset.agentAsset.chainId,this.agentAsset.agentAsset.assetId,this.addressInfo.address).then(function(e){e.success?(t.balanceInfo=e.data,t.$refs.password.showPassword(!0),t.passwordType=1):t.$message({message:t.$t("public.err2")+e,type:"error",duration:1e3})}).catch(function(e){t.$message({message:t.$t("public.err3")+e,type:"error",duration:1e3})})},stopNode:function(){var e=this;Object(d["f"])(this.agentAsset.agentAsset.chainId,this.agentAsset.agentAsset.assetId,this.addressInfo.address).then(function(t){t.success?(e.balanceInfo=t.data,e.$refs.password.showPassword(!0),e.passwordType=2):e.$message({message:e.$t("public.err2")+t,type:"error",duration:1e3})}).catch(function(t){e.$message({message:e.$t("public.err3")+t,type:"error",duration:1e3})})},passSubmit:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(t){var s,n,a,r,o,i,c,p,f,h,b,m,g,v,w,I,x,y,_,$,k,j,O,A=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(s=u.a.decrypteOfAES(this.addressInfo.aesPri,t),n=u.a.importByKey(this.addressInfo.chainId,s,t,this.prefix),n.address!==this.addressInfo.address){e.next=101;break}if(a={fromAddress:this.addressInfo.address,assetsChainId:this.agentAsset.agentAsset.chainId,assetsId:this.agentAsset.agentAsset.assetId,amount:Number(Object(l["d"])(this.jionNodeForm.amount,1e8)),fee:1e5},r={},o="",i=this.addressInfo.pub,c="",0!==this.passwordType){e.next=25;break}return e.next=11,Object(d["h"])(a,this.balanceInfo,5);case 11:if(r=e.sent,p={address:this.addressInfo.address,agentHash:this.$route.query.hash,deposit:Number(Object(l["d"])(this.jionNodeForm.amount,1e8))},!r.success){e.next=22;break}return e.next=16,u.a.transactionAssemble(r.data.inputs,r.data.outputs,c,5,p);case 16:return f=e.sent,e.next=19,u.a.transactionSerialize(s,i,f);case 19:o=e.sent,e.next=23;break;case 22:this.$message({message:this.$t("public.err1")+r.data,type:"error",duration:1e3});case 23:e.next=97;break;case 25:if(1!==this.passwordType){e.next=43;break}return a.amount=Number(Object(l["d"])(this.outInfo.amount,1e8)),a.depositHash=this.outInfo.txHash,e.next=30,Object(d["h"])(a,this.balanceInfo,6);case 30:if(r=e.sent,!r.success){e.next=40;break}return e.next=34,u.a.transactionAssemble(r.data.inputs,r.data.outputs,c,6,this.outInfo.txHash);case 34:return h=e.sent,e.next=37,u.a.transactionSerialize(s,i,h);case 37:o=e.sent,e.next=41;break;case 40:this.$message({message:this.$t("public.err1")+r.data,type:"error",duration:1e3});case 41:e.next=97;break;case 43:if(2!==this.passwordType){e.next=96;break}return a.amount=this.nodeInfo.deposit,a.depositHash=this.$route.query.hash,e.next=48,Object(d["h"])(a,this.balanceInfo,9);case 48:if(r=e.sent,!r.success){e.next=93;break}return b=r.data.inputs,m=[],e.next=54,Object(d["a"])(this.$route.query.hash);case 54:for(g=e.sent,v=!0,w=!1,I=void 0,e.prev=58,x=g.list[Symbol.iterator]();!(v=(y=x.next()).done);v=!0)_=y.value,b.push({address:_.address,assetsChainId:this.agentAsset.agentAsset.chainId,assetsId:this.agentAsset.agentAsset.assetId,amount:_.amount,locked:-1,nonce:_.txHash.substring(_.txHash.length-16)}),m.push({address:_.address,assetsChainId:this.agentAsset.agentAsset.chainId,assetsId:this.agentAsset.agentAsset.assetId,amount:_.amount,lockTime:0});e.next=66;break;case 62:e.prev=62,e.t0=e["catch"](58),w=!0,I=e.t0;case 66:e.prev=66,e.prev=67,v||null==x.return||x.return();case 69:if(e.prev=69,!w){e.next=72;break}throw I;case 72:return e.finish(69);case 73:return e.finish(66);case 74:return $=[],k=[],m.forEach(function(e){var t;(t=$.indexOf(e.address))>-1?k[t].amount=Number(k[t].amount)+Number(e.amount):($.push(e.address),k.push({address:e.address,amount:e.amount,assetsChainId:e.assetsChainId,assetsId:e.assetsId,lockTime:e.lockTime}))}),k.unshift(r.data.outputs[0]),e.next=80,u.a.transactionAssemble(b,k,c,9,this.$route.query.hash);case 80:if(j=e.sent,O=Object(d["d"])(j,1),a.fee===O){e.next=88;break}return a.fee=O,k[0].amount=Number(Object(l["a"])(this.nodeInfo.deposit,O).toString()),e.next=87,u.a.transactionAssemble(b,k,c,9,this.$route.query.hash);case 87:j=e.sent;case 88:return e.next=90,u.a.transactionSerialize(s,i,j);case 90:o=e.sent,e.next=94;break;case 93:this.$message({message:this.$t("public.err1")+r.data,type:"error",duration:1e3});case 94:e.next=97;break;case 96:console.log("交易类型错误");case 97:return e.next=99,Object(d["j"])(o).then(function(e){e.success?A.$router.push({name:"txList"}):A.$message({message:A.$t("public.err")+e.data.code,type:"error",duration:1e3})}).catch(function(e){A.$message({message:A.$t("public.err0")+e,type:"error",duration:1e3})});case 99:e.next=102;break;case 101:this.$message({message:this.$t("address.address13"),type:"error",duration:1e3});case 102:case"end":return e.stop()}},e,this,[[58,62,66,74],[67,,69,73]])}));function t(t){return e.apply(this,arguments)}return t}(),toUrl:function(e,t){Object(l["h"])(e,t)}},watch:{addressInfo:function(e,t){e&&e.address!==t.address&&t.address&&(this.nodeDepositLoading=!0,this.jionNodeForm.amount="",this.getBalanceByAddress(this.agentAsset.agentAsset.chainId,this.agentAsset.agentAsset.assetId,this.addressInfo.address),this.getNodeDepositByHash(this.pageIndex,this.pageSize,this.addressInfo.address,this.$route.query.hash))}}},b=h,m=(s("45e9"),s("2877")),g=Object(m["a"])(b,n,a,!1,null,null,null);t["default"]=g.exports},b301:function(e,t,s){"use strict";var n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"back",attrs:{backUrl:e.backUrl}},[s("span",{staticClass:"back-box",on:{click:e.back}},[s("i",{staticClass:"el-icon-arrow-left"}),s("span",[e._v(e._s(e.backTitle))])])])},a=[],r={props:{backTitle:{type:String,default:""},backUrl:{type:String,default:"1"},backParams:{type:String,default:""}},methods:{back:function(){"1"===this.backUrl?this.$router.go(-1):this.$router.push({name:this.backUrl})}}},o=r,i=(s("2e64"),s("2877")),c=Object(i["a"])(o,n,a,!1,null,null,null);t["a"]=c.exports},cd1c:function(e,t,s){var n=s("e853");e.exports=function(e,t){return new(n(e))(t)}},d1f0:function(e,t,s){"use strict";var n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("el-dialog",{staticClass:"password-dialog",attrs:{title:e.$t("password.password1"),visible:e.passwordVisible,top:"30vh",width:"30rem","close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.passwordVisible=t},open:e.passwordShow,close:e.passwordClose}},[s("el-form",{ref:"passwordForm",attrs:{model:e.passwordForm,rules:e.passwordRules},nativeOn:{submit:function(e){e.preventDefault()}}},[s("div",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}]},[e._v(e._s(e.$t("password.password1")))]),s("el-form-item",{attrs:{prop:"password"}},[s("el-input",{ref:"inpus",attrs:{type:"password",maxlength:22},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.enterSubmit("passwordForm")}},model:{value:e.passwordForm.password,callback:function(t){e.$set(e.passwordForm,"password",t)},expression:"passwordForm.password"}})],1)],1),s("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{on:{click:e.passwordClose}},[e._v(e._s(e.$t("password.password2")))]),s("el-button",{attrs:{type:"success",id:"passwordInfo"},on:{click:function(t){return e.dialogSubmit("passwordForm")}}},[e._v(e._s(e.$t("password.password3"))+"\n    ")])],1)],1)},a=[],r={props:{},data:function(){var e=this,t=function(t,s,n){""===s?n(new Error(e.$t("password.password1"))):n()};return{passwordVisible:!1,passwordForm:{password:""},passwordRules:{password:[{validator:t,trigger:["blur","change"]}]}}},created:function(){},mounted:function(){},watch:{passwordVisible:function(e){var t=this;e&&setTimeout(function(){t.$refs["inpus"].focus()},200)}},methods:{enterSubmit:function(e){this.passwordForm.password&&this.dialogSubmit(e)},passwordShow:function(){},passwordClose:function(){this.$refs["passwordForm"].resetFields(),this.passwordVisible=!1},showPassword:function(e){this.passwordVisible=e},dialogSubmit:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;t.$emit("passwordSubmit",t.passwordForm.password),t.passwordVisible=!1})}}},o=r,i=(s("7672"),s("2877")),c=Object(i["a"])(o,n,a,!1,null,null,null);t["a"]=c.exports},e853:function(e,t,s){var n=s("d3f4"),a=s("1169"),r=s("2b4c")("species");e.exports=function(e){var t;return a(e)&&(t=e.constructor,"function"!=typeof t||t!==Array&&!a(t.prototype)||(t=void 0),n(t)&&(t=t[r],null===t&&(t=void 0))),void 0===t?Array:t}},ff03:function(e,t,s){}}]);
//# sourceMappingURL=chunk-6f4f4740.978be56b.js.map