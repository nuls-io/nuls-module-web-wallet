(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1c1df372"],{"2e64":function(t,a,e){"use strict";var s=e("ff03"),n=e.n(s);n.a},"4f3e":function(t,a,e){"use strict";var s=e("9c89"),n=e.n(s);n.a},"62e4":function(t,a){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},"9c89":function(t,a,e){},b301:function(t,a,e){"use strict";var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"back",attrs:{backUrl:t.backUrl}},[e("span",{staticClass:"back-box",on:{click:t.back}},[e("i",{staticClass:"el-icon-arrow-left"}),e("span",[t._v(t._s(t.backTitle))])])])},n=[],l={props:{backTitle:{type:String,default:""},backUrl:{type:String,default:"1"},backParams:{type:String,default:""}},methods:{back:function(){"1"===this.backUrl?this.$router.go(-1):this.$router.push({name:this.backUrl})}}},i=l,c=(e("2e64"),e("2877")),o=Object(c["a"])(i,s,n,!1,null,null,null);a["a"]=o.exports},f304:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.txInfoLoading,expression:"txInfoLoading"}],staticClass:"transfer_info bg-gray"},[e("div",{staticClass:"bg-white"},[e("div",{staticClass:"w1200"},[e("BackBar",{attrs:{backTitle:"交易记录"}}),e("h3",{staticClass:"title"},[t._v(t._s(t.hash)+"\n        "),e("i",{staticClass:"iconfont icon-fuzhi clicks",on:{click:function(a){return t.copy(t.hash)}}})])],1)]),e("div",{staticClass:"card_long mt_20 w1200"},[e("h5",{staticClass:"card-title font18"},[t._v("基础信息")]),e("ul",[e("li",[t._v("时间 "),e("label",[t._v(t._s(t.txInfo.createTime))])]),e("li",[t._v("金额 "),e("label",[t._v(t._s(t.txInfo.value)),e("span",{staticClass:"fCN"},[t._v("NULS")])])]),e("li",[t._v("高度 "),e("label",{staticClass:"click"},[e("u",{staticClass:"td"},[t._v(t._s(t.txInfo.height))])])]),e("li",[t._v("手续费 "),e("label",[t._v(t._s(t.txInfo.fee)),e("span",{staticClass:"fCN"},[t._v("NULS")])])]),e("li",[t._v("类型 "),e("label",[t._v(t._s(t.$t("type."+t.txInfo.type)))])]),e("li",[t._v("状态 "),e("label",[t._v(t._s(0===t.txInfo.status?"已确认":"未确认"))])]),1===t.txInfo.type?e("li",[t._v("\n        节点ID\n        "),e("label",[e("u",{staticClass:"click td uppercase"},[t._v(t._s(t.txInfo.txData.agentId))])])]):t._e(),1===t.txInfo.type?e("li",[t._v("\n        轮次信息\n        "),e("label",[t._v("轮次\n          "),e("u",{staticClass:" click cd"},[t._v(t._s(t.txInfo.txData.roundIndex))]),t._v("\n          编号 "+t._s(t.txInfo.txData.packageIndex)+"\n        ")])]):t._e(),3===t.txInfo.type?e("li",[t._v("别名 "),e("label",[t._v(t._s(t.txInfo.txData.alias))])]):t._e(),4===t.txInfo.type||5===t.txInfo.type||9===t.txInfo.type?e("li",[t._v("\n        创建地址\n        "),e("label",[e("u",{staticClass:"click td"},[t._v(t._s(t.txInfo.txData.agentAddress))])])]):t._e(),4===t.txInfo.type||5===t.txInfo.type||6===t.txInfo.type||9===t.txInfo.type?e("li",[t._v("\n        节点ID\n        "),e("label",[e("u",{staticClass:"click td uppercase"},[t._v(t._s(t.txInfo.txData.agentId))])])]):t._e(),4===t.txInfo.type||9===t.txInfo.type?e("li",[t._v("\n        打包地址\n        "),e("label",[e("u",{staticClass:"click td"},[t._v(t._s(t.txInfo.txData.packingAddress))])])]):t._e(),4===t.txInfo.type||9===t.txInfo.type?e("li",[t._v("佣金比例 "),e("label",[t._v(t._s(t.txInfo.txData.commissionRate)+"%")])]):t._e(),4===t.txInfo.type||9===t.txInfo.type?e("li",[t._v("\n        奖励地址\n        "),e("label",[e("u",{staticClass:"click td"},[t._v(t._s(t.txInfo.txData.rewardAddress))])])]):t._e(),9===t.txInfo.type?e("li",[t._v("保证金 "),e("label",[t._v(t._s(t.txInfo.txData.deposit/1e8)),e("span",{staticClass:"fCN"},[t._v("NULS")])])]):t._e(),9===t.txInfo.type?e("li",[t._v("信用值 "),e("label",[t._v(t._s(t.txInfo.txData.creditValue))])]):t._e(),3!==t.txInfo.type?e("li",[t._v("\n        备注\n        "),e("label",{staticClass:"remark overflow tr",attrs:{title:t.txInfo.remark}},[t._v(t._s(t.txInfo.remark))])]):t._e(),4!==t.txInfo.type&&6!==t.txInfo.type&&9!==t.txInfo.type?e("li"):t._e(),e("p",{staticClass:"cb"})])]),e("div",{staticClass:"cb"}),e("div",{staticClass:"card w1200"},[e("div",{staticClass:"card-info left fl"},[e("h5",{staticClass:"card-title font18"},[t._v("Input")]),e("ul",t._l(t.inputData,function(a){return e("li",{key:a.address},[e("font",{staticClass:"click td"},[t._v(t._s(a.address))]),e("label",[t._v(t._s(a.amount)),e("span",{staticClass:"fCN"},[t._v("NULS")])])],1)}),0)]),e("div",{staticClass:"card-info right fr"},[e("h5",{staticClass:"card-title font18"},[t._v("Output")]),e("ul",t._l(t.outputData,function(a){return e("li",{key:a.address},[e("font",{staticClass:"click td"},[t._v(t._s(a.address))]),e("label",[t._v(t._s(a.amount)),e("span",{staticClass:"fCN"},[t._v("NULS")])])],1)}),0)])])])},n=[],l=e("5d73"),i=e.n(l),c=e("c1df"),o=e.n(c),r=e("6ace"),f=e("b301"),u={data:function(){return{txInfoLoading:!1,hash:this.$route.query.hash,txInfo:[],inputData:[],outputData:[]}},created:function(){},mounted:function(){this.getTxInfoByHash(this.hash)},components:{BackBar:f["a"]},methods:{getTxInfoByHash:function(t){var a=this;this.txInfoLoading=!0,this.$post("/","getTx",[t]).then(function(t){if(console.log(t),t.hasOwnProperty("result")){if(t.result.createTime=o()(Object(r["e"])(t.result.createTime)).format("YYYY-MM-DD HH:mm:ss"),t.result.fee=Object(r["g"])(t.result.fee),t.result.value=Object(r["g"])(t.result.value),t.result.coinFroms){var e=!0,s=!1,n=void 0;try{for(var l,c=i()(t.result.coinFroms);!(e=(l=c.next()).done);e=!0){var f=l.value;f.amount=Object(r["g"])(f.amount)}}catch(I){s=!0,n=I}finally{try{e||null==c.return||c.return()}finally{if(s)throw n}}a.inputData=t.result.coinFroms}if(t.result.coinTos){var u=!0,_=!1,d=void 0;try{for(var v,p=i()(t.result.coinTos);!(u=(v=p.next()).done);u=!0){var x=v.value;x.amount=Object(r["g"])(x.amount)}}catch(I){_=!0,d=I}finally{try{u||null==p.return||p.return()}finally{if(_)throw d}}a.outputData=t.result.coinTos}a.txInfo=t.result,a.txInfoLoading=!1}}).catch(function(t){console.log("getTx:"+t)})},toUrl:function(t){this.$router.push({name:t})},copy:function(t){Object(r["d"])(t),this.$message({message:"已经复制完成",type:"success",duration:1e3})}}},_=u,d=(e("4f3e"),e("2877")),v=Object(d["a"])(_,s,n,!1,null,null,null);a["default"]=v.exports},ff03:function(t,a,e){}}]);
//# sourceMappingURL=chunk-1c1df372.3d0da306.js.map