(function(e){function n(n){for(var o,s,r=n[0],i=n[1],u=n[2],l=0,d=[];l<r.length;l++)s=r[l],a[s]&&d.push(a[s][0]),a[s]=0;for(o in i)Object.prototype.hasOwnProperty.call(i,o)&&(e[o]=i[o]);f&&f(n);while(d.length)d.shift()();return c.push.apply(c,u||[]),t()}function t(){for(var e,n=0;n<c.length;n++){for(var t=c[n],o=!0,s=1;s<t.length;s++){var r=t[s];0!==a[r]&&(o=!1)}o&&(c.splice(n--,1),e=i(i.s=t[0]))}return e}var o={},s={app:0},a={app:0},c=[];function r(e){return i.p+"js/"+({}[e]||e)+"."+{"chunk-09629ad6":"045b76c5","chunk-4994154a":"2cd1fbf7","chunk-5777448e":"775de158","chunk-7d65be30":"cd1e2b55","chunk-186cee8c":"2e58af98","chunk-3fe0fe72":"8b430bdc","chunk-51452d9e":"ea8894aa","chunk-67fcdde4":"b7868e1d","chunk-7d41c3cc":"5280d7e2","chunk-a950fa80":"427a3bdd","chunk-12ef1e54":"6a6bf6ce","chunk-cb898a66":"7fdc2ffa","chunk-f1c9f8c4":"b4a3b635","chunk-046f869e":"9ce0d7e8","chunk-1c1df372":"3d0da306","chunk-283df1f6":"0597c7bf","chunk-77c58598":"de4e83df","chunk-77edc371":"14f18701"}[e]+".js"}function i(n){if(o[n])return o[n].exports;var t=o[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.e=function(e){var n=[],t={"chunk-09629ad6":1,"chunk-4994154a":1,"chunk-5777448e":1,"chunk-186cee8c":1,"chunk-3fe0fe72":1,"chunk-51452d9e":1,"chunk-67fcdde4":1,"chunk-7d41c3cc":1,"chunk-12ef1e54":1,"chunk-cb898a66":1,"chunk-f1c9f8c4":1,"chunk-046f869e":1,"chunk-1c1df372":1,"chunk-283df1f6":1,"chunk-77c58598":1,"chunk-77edc371":1};s[e]?n.push(s[e]):0!==s[e]&&t[e]&&n.push(s[e]=new Promise(function(n,t){for(var o="css/"+({}[e]||e)+"."+{"chunk-09629ad6":"cbce3c70","chunk-4994154a":"e12b1d1d","chunk-5777448e":"91323ed0","chunk-7d65be30":"31d6cfe0","chunk-186cee8c":"c44d6f4a","chunk-3fe0fe72":"a8a53adf","chunk-51452d9e":"891611dc","chunk-67fcdde4":"1852b682","chunk-7d41c3cc":"2d29b718","chunk-a950fa80":"31d6cfe0","chunk-12ef1e54":"20d8ab35","chunk-cb898a66":"83aa64a5","chunk-f1c9f8c4":"d771faf2","chunk-046f869e":"80d337ff","chunk-1c1df372":"70bf0339","chunk-283df1f6":"199ff945","chunk-77c58598":"d4097f27","chunk-77edc371":"80d337ff"}[e]+".css",a=i.p+o,c=document.getElementsByTagName("link"),r=0;r<c.length;r++){var u=c[r],l=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(l===o||l===a))return n()}var d=document.getElementsByTagName("style");for(r=0;r<d.length;r++){u=d[r],l=u.getAttribute("data-href");if(l===o||l===a)return n()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=n,f.onerror=function(n){var o=n&&n.target&&n.target.src||a,c=new Error("Loading CSS chunk "+e+" failed.\n("+o+")");c.request=o,delete s[e],f.parentNode.removeChild(f),t(c)},f.href=a;var h=document.getElementsByTagName("head")[0];h.appendChild(f)}).then(function(){s[e]=0}));var o=a[e];if(0!==o)if(o)n.push(o[2]);else{var c=new Promise(function(n,t){o=a[e]=[n,t]});n.push(o[2]=c);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,i.nc&&l.setAttribute("nonce",i.nc),l.src=r(e),u=function(n){l.onerror=l.onload=null,clearTimeout(d);var t=a[e];if(0!==t){if(t){var o=n&&("load"===n.type?"missing":n.type),s=n&&n.target&&n.target.src,c=new Error("Loading chunk "+e+" failed.\n("+o+": "+s+")");c.type=o,c.request=s,t[1](c)}a[e]=void 0}};var d=setTimeout(function(){u({type:"timeout",target:l})},12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(n)},i.m=e,i.c=o,i.d=function(e,n,t){i.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,n){if(1&n&&(e=i(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)i.d(t,o,function(n){return e[n]}.bind(null,o));return t},i.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(n,"a",n),n},i.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},i.p="/",i.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=n,u=u.slice();for(var d=0;d<u.length;d++)n(u[d]);var f=l;c.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"0a3d":function(e,n,t){"use strict";var o=t("ada8"),s=t.n(o);s.a},"1ae4":function(e,n,t){e.exports=t.p+"img/logo.ef0bcec3.svg"},"1d2a":function(e,n,t){},"4f36":function(e,n,t){e.exports=t.p+"img/alpha-black.4d43afc3.svg"},"56d7":function(e,n,t){"use strict";t.r(n);t("cadf"),t("551c"),t("f751"),t("097d");var o=t("2b0e"),s=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"app",attrs:{id:"app"}},[t("HeaderBar"),t("router-view"),t("BottomBar")],1)},a=[],c=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"header"},[t("div",{staticClass:"w1200"},[t("div",{staticClass:"logo"},[t("img",{staticClass:"click",attrs:{src:e.logoSvg},on:{click:function(n){return e.toUrl("home")}}})]),t("div",{staticClass:"nav"},[t("el-menu",{attrs:{mode:"horizontal","default-active":e.navActives(e.$route.path)},on:{select:e.handleSelect}},[t("el-menu-item",{attrs:{index:"home"}},[e._v(e._s(e.$t("nav.wallet")))]),t("el-menu-item",{attrs:{index:"transfer",disabled:0===e.addressList.length}},[e._v(e._s(e.$t("nav.transfer"))+"\n                ")]),t("el-menu-item",{attrs:{index:"consensus",disabled:0===e.addressList.length}},[e._v(e._s(e.$t("nav.consensus"))+"\n                ")]),t("el-menu-item",{attrs:{index:"contract",disabled:""}},[e._v(e._s(e.$t("nav.contracts")))])],1)],1),t("div",{staticClass:"tool"},[t("el-menu",{attrs:{mode:"horizontal","default-active":e.navActive},on:{select:e.handleSelect}},[t("el-submenu",{staticClass:"user",attrs:{index:"address",disabled:0===e.addressList.length}},[t("template",{slot:"title"},[t("i",{staticClass:"iconfont iconzhanghu"})]),e._l(e.addressList,function(n){return t("el-menu-item",{key:n.address,attrs:{index:n.address}},[t("i",{staticClass:"iconfont iconwo",class:n.selection?"":"transparent"}),e._v("\n                        "+e._s(n.addresss)),t("span",{directives:[{name:"show",rawName:"v-show",value:n.alias,expression:"item.alias"}]},[e._v(" | ("+e._s(n.alias)+")")]),e._v(" | "),t("span",[e._v(e._s(n.balance))])])})],2),t("el-submenu",{attrs:{index:"set"}},[t("template",{slot:"title"},[e._v("设置")]),t("el-menu-item",{staticClass:"tc",attrs:{index:"address"}},[e._v("地址管理")]),t("el-menu-item",{staticClass:"tc",attrs:{index:"nodeService"}},[e._v("服务节点")]),t("el-menu-item",{staticClass:"tc",attrs:{index:"address",disabled:""}},[e._v("通讯录")])],2),t("el-submenu",{attrs:{index:"lang",disabled:""}},[t("template",{slot:"title"},[e._v(e._s("en"===this.lang?"Eng":"中文"))]),t("el-menu-item",{attrs:{index:"cn"}},[e._v("中文")]),t("el-menu-item",{attrs:{index:"en"}},[e._v("English")])],2),t("li",{staticClass:"el-menu-item"},[e._v("|")]),t("el-menu-item",{attrs:{index:"24",disabled:""}},[e._v("帮助")])],1)],1)]),t("div",{staticClass:"cb"})])},r=[],i=t("f499"),u=t.n(i),l=t("5d73"),d=t.n(l),f=t("db49"),h=t("1ae4"),p=t.n(h),m=t("4f36"),k=t.n(m),b=t("6ace"),g={data:function(){return{logoSvg:f["d"]?p.a:k.a,navActive:"/",addressList:[],lang:"cn"}},components:{},created:function(){this.getAddressList()},mounted:function(){var e=this;setInterval(function(){e.getAddressList()},500)},methods:{handleSelect:function(e,n){if(n.length>1)if("address"===n[0]){var t=!0,o=!1,s=void 0;try{for(var a,c=d()(this.addressList);!(t=(a=c.next()).done);t=!0){var r=a.value;r.selection&&(r.selection=!1,localStorage.setItem(r.address,u()(r))),r.address===n[1]&&(r.selection=!0,localStorage.setItem(r.address,u()(r)))}}catch(i){o=!0,s=i}finally{try{t||null==c.return||c.return()}finally{if(o)throw s}}}else"set"===n[0]?this.$router.push({name:n[1]}):"lang"===n[0]&&this.selectLanguage(e);else this.$router.push({name:e})},navActives:function(e){return 0===e.indexOf("/transfer")?"transfer":0===e.indexOf("/consensus")?"consensus":"home"},getAddressList:function(){this.addressList=[];for(var e=localStorage.length-1;e>=0;e--)"SILENT"!==localStorage.getItem(localStorage.key(e))&&localStorage.key(e).length>10&&this.addressList.push(JSON.parse(localStorage.getItem(localStorage.key(e))));var n=!0,t=!1,o=void 0;try{for(var s,a=d()(this.addressList);!(n=(s=a.next()).done);n=!0){var c=s.value;c.addresss=Object(b["f"])(c.address,8),c.selection&&(sessionStorage.clear(),sessionStorage.setItem(c.address,u()(c)))}}catch(r){t=!0,o=r}finally{try{n||null==a.return||a.return()}finally{if(t)throw o}}},selectLanguage:function(e){this.lang=e,this.$i18n.locale=this.lang},toUrl:function(e){this.$router.push({name:e})}},watch:{}},v=g,I=(t("0a3d"),t("2877")),y=Object(I["a"])(v,c,r,!1,null,null,null),w=y.exports,C=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[t("div",{staticClass:"bottom"},[t("div",{staticClass:"w1200 font14"},[t("div",{staticClass:"left fl"},[t("p",{staticClass:"fl"},[e._v("服务节点: "),t("u",{staticClass:"clicks",on:{click:function(n){return e.toUrl("nodeService")}}},[e._v(e._s(e.serviceUrls))])]),t("p",{staticClass:"fr"},[e._v("主网/服务节点: "+e._s(e.mainHeightInfo.height)+"/"+e._s(e.heightInfo.height))])]),t("div",{staticClass:"right fr"},[t("label",{staticClass:"clicks"},[e._v("服务协议")]),t("label",{staticClass:"clicks"},[e._v("隐私政策")]),t("label",{staticClass:"click",on:{click:e.checkUpdate}},[e._v("Alpha 2.0.1")])])])]),t("el-dialog",{attrs:{title:"更新钱包",width:"35rem",visible:e.updateDialogVisible,"show-close":1===e.tips.type||4===e.tips.type,"close-on-press-escape":!1,"close-on-click-modal":!1},on:{"update:visible":function(n){e.updateDialogVisible=n}}},[t("div",{staticClass:"upload"},[t("div",{staticClass:"upload-tips"},[e._v("提示信息："+e._s(e.tips.info))]),0!==e.downloadPercent?t("div",{staticClass:"upload-percent"},[t("el-progress",{attrs:{"text-inside":!0,"stroke-width":18,percentage:e.downloadPercent,status:"success"}})],1):e._e(),3===e.tips.type?t("div",{staticClass:"upload-bt"},[t("el-button",{attrs:{type:"info"},on:{clcik:e.afterRun}},[e._v("后台运行")])],1):e._e()])])],1)},S=[],T=(t("96cf"),t("3b8d")),P=t("bc3a"),_=t.n(P),L={name:"bottom-bar",data:function(){return{mainHeightInfo:[],heightInfo:[],serviceUrls:localStorage.hasOwnProperty("urls")?JSON.parse(localStorage.getItem("urls")).urls:"http://apitn1.nulscan.io/",updateDialogVisible:!1,tips:{},downloadPercent:0}},created:function(){var e=this;this.getBestBlockHeader(),this.getMainHeader(),this.serviceUrls=localStorage.hasOwnProperty("urls")?JSON.parse(localStorage.getItem("urls")).urls:"http://apitn1.nulscan.io/",setInterval(function(){e.serviceUrls=localStorage.hasOwnProperty("urls")?JSON.parse(localStorage.getItem("urls")).urls:"http://apitn1.nulscan.io/"},500)},mounted:function(){var e=this;setInterval(function(){e.getBestBlockHeader()},1e4)},watch:{serviceUrls:function(e,n){e&&e!==n&&n&&this.getBestBlockHeader()}},methods:{getMainHeader:function(){var e=this,n={jsonrpc:"2.0",method:"getBestBlockHeader",params:[2],id:5898};_.a.post("http://apitn1.nulscan.io",n).then(function(n){n.data.hasOwnProperty("result")?e.mainHeightInfo=n.data.result:e.mainHeightInfo={height:0}}).catch(function(n){e.heightInfo={height:0},console.log("getBestBlockHeader:"+n)})},getBestBlockHeader:function(){var e=this;this.$post("/","getBestBlockHeader",[]).then(function(n){n.hasOwnProperty("result")?e.heightInfo=n.result:e.heightInfo={height:0}}).catch(function(n){e.heightInfo={height:0},console.log("getBestBlockHeader:"+n)})},checkUpdate:function(){var e=Object(T["a"])(regeneratorRuntime.mark(function e(){var n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.updateDialogVisible=!0,this.tips={},this.downloadPercent=0,n=this,n.$electron.ipcRenderer.send("checkForUpdate"),e.next=7,n.$electron.ipcRenderer.on("message",function(e,t){n.tips=t});case 7:n.$electron.ipcRenderer.on("downloadProgress",function(e,t){n.downloadPercent=t.percent||0}),n.$electron.ipcRenderer.on("isUpdateNow",function(){n.$electron.ipcRenderer.send("isUpdateNow")});case 9:case"end":return e.stop()}},e,this)}));function n(){return e.apply(this,arguments)}return n}(),afterRun:function(){this.updateDialogVisible=!1},toUrl:function(e){this.$router.push({name:e})}}},A=L,x=(t("93f7"),Object(I["a"])(A,C,S,!1,null,null,null)),B=x.exports,N={components:{HeaderBar:w,BottomBar:B},methods:{}},R=N,O=(t("7c55"),Object(I["a"])(R,s,a,!1,null,null,null)),D=O.exports,H=t("8c4f");o["default"].use(H["a"]);var U=new H["a"]({mode:"history",routes:[{path:"*",name:"home",component:function(e){return Promise.all([t.e("chunk-a950fa80"),t.e("chunk-283df1f6")]).then(function(){var n=[t("bb51")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/",name:"home",component:function(e){return Promise.all([t.e("chunk-a950fa80"),t.e("chunk-283df1f6")]).then(function(){var n=[t("bb51")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/wallet/frozenList",name:"frozenList",component:function(e){return Promise.all([t.e("chunk-a950fa80"),t.e("chunk-046f869e")]).then(function(){var n=[t("470f")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/wallet/txList",name:"txList",component:function(e){return Promise.all([t.e("chunk-a950fa80"),t.e("chunk-77c58598")]).then(function(){var n=[t("482b")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/transfer",name:"transfer",component:function(e){return Promise.all([t.e("chunk-7d65be30"),t.e("chunk-3fe0fe72")]).then(function(){var n=[t("0d40")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/transfer/transferInfo",name:"transferInfo",component:function(e){return Promise.all([t.e("chunk-a950fa80"),t.e("chunk-1c1df372")]).then(function(){var n=[t("f304")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/consensus",name:"consensus",component:function(e){return t.e("chunk-5777448e").then(function(){var n=[t("c5cc")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/consensus/consensusInfo",name:"consensusInfo",component:function(e){return Promise.all([t.e("chunk-7d65be30"),t.e("chunk-a950fa80"),t.e("chunk-12ef1e54")]).then(function(){var n=[t("a475")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/consensus/newConsensus",name:"newConsensus",component:function(e){return Promise.all([t.e("chunk-7d65be30"),t.e("chunk-67fcdde4")]).then(function(){var n=[t("2736")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/consensus/consensusList",name:"consensusList",component:function(e){return Promise.all([t.e("chunk-a950fa80"),t.e("chunk-77edc371")]).then(function(){var n=[t("86bf")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/contract",name:"contract",component:function(e){return t.e("chunk-09629ad6").then(function(){var n=[t("dd78")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/address",name:"address",component:function(e){return Promise.all([t.e("chunk-7d65be30"),t.e("chunk-51452d9e")]).then(function(){var n=[t("fe38")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/newAddress",name:"newAddress",component:function(e){return Promise.all([t.e("chunk-7d65be30"),t.e("chunk-cb898a66")]).then(function(){var n=[t("b483")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/importAddress",name:"importAddress",component:function(e){return Promise.all([t.e("chunk-7d65be30"),t.e("chunk-7d41c3cc")]).then(function(){var n=[t("6b02")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/setAlias",name:"setAlias",component:function(e){return Promise.all([t.e("chunk-7d65be30"),t.e("chunk-186cee8c")]).then(function(){var n=[t("eb26")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/editPassword",name:"editPassword",component:function(e){return Promise.all([t.e("chunk-7d65be30"),t.e("chunk-f1c9f8c4")]).then(function(){var n=[t("ce96")];e.apply(null,n)}.bind(this)).catch(t.oe)}},{path:"/nodeService",name:"nodeService",component:function(e){return t.e("chunk-4994154a").then(function(){var n=[t("2864")];e.apply(null,n)}.bind(this)).catch(t.oe)}}]}),j=t("2f62");o["default"].use(j["a"]);var $=new j["a"].Store({state:{},mutations:{},actions:{}}),z=t("5c96"),E=t.n(z);t("0fae");o["default"].use(E.a);var M=t("4897"),J=t.n(M),V=t("a925"),W=t("cebc"),q=t("b2d6"),F=t.n(q),G=Object(W["a"])({nav:{wallet:"Wallet",transfer:"Transfer",consensus:"Consensus",contracts:"Contracts",application:"Application"},public:{apr:"APR",txs:"TXS",stake:"Stake",entrust:"Stake",proportion:"Commission",creditValue:"Credit",allEntrust:"Total stake",bond:"Deposit",participants:"Participants",basicInfo:"Basic info",copySuccess:"Copied to clipboard",copyError:"Failed to copy to clipboard",developedTips:"More features are being developed...",txList:"Transaction history",transactionList:"Transaction list",tokenTrading:"Token transaction",address:"Account",locking:"locking",timeLocking:"Time locking",consensusLocking:"Locking",usablebalance:"Usable",usable:"Usable",balance:"Balance",total:"Total",alias:"Alias",block:"Block",seedNode:"Seed nodes",outNode:"Packing nodes",height:"Height",time:"Date",transactionNo:"Transaction amount",blockReward:"Block reward",consensusReward:"Consensus reward",size:"Bytes",createAddress:"Agent address",packAddress:"Packing address",outAddress:"Reward address",contractAddress:"Contract address",addressType:"Account type",round:"Round",number:"Number",fee:"Fee",type:"Type",amount:"Amount",serial:"Number",sender:"Sender",recipient:"Receiver",passCard:"Token",abbreviate:"Abbreviate",week:"Week",month:"Month",year:"Year",yellowCard:"Yellow card",redCard:"Red card",lostRate:"Lost rate",day:"Day",hour:"Hour",minute:"Minute",createTime:"Create time",reason:"Reason",join:"Join",quit:"Quit",remarks:"Remarks",status:"Status",input:"Input",output:"Output",searchTip:"address/height/txhash/...",copy:"Click copy",copysuccess:"Copy success"},type:{undefined:"",0:"All",1:"Consensus reward",2:"Transfer",3:"Aliased",4:"Register node",5:"Stake",51:"Change",6:"Cancel consensus",7:"Yellow card",8:"Red card",9:"Unregister node",10:"General Data'",100:"Create contract",101:"Call contract",1011:"Call Contract",102:"Del contract",103:"Contract transfer",104:"Contract return",1000:"Token"},frozenType:{undefined:"",1:"Highly locking",2:"Time locking",3:"Consensus locking"},addressType:{undefined:"",1:"General Account",2:"Contract account",3:"Multi account"},nodeType:{undefined:"",0:"General",1:"Credit",2:"Commission",3:"Staked amount",4:"Deposit"},history:{0:"All history",1:"Int history",2:"Out history"},nodeStatus:{undefined:"",0:"All nodes",1:"General nodes",2:"Developer nodes",3:"Ambassador nodes"},contractStatus:{undefined:"","-1":"Create failure",0:"Uncertificated",1:"Certificating",2:"Certificated",3:"Deleted"},home:{home0:"Height",home1:"Consensus nodes",home2:"Total stake",home3:"Total supply",home4:"Circulating Supply",home5:"Consensus annualized reward rate",home6:"Consenseus reward calculator",home7:"14 days NULS Transaction history",home8:"More"},cale:{cale0:"Consensus reward calculator",cale1:"stake",cale3:"Daily",cale4:"Weekly",cale5:"Monthly",cale6:"Annual",cale7:"Please enter stake amount",cale8:"Stake amount ranges from 2000 to 500,000",cale9:"Stake amount should be number",cale10:"Please enter commission rate",cale11:"Commission rate ranges from 10 to 100",cale12:"Commission rate should be number",cale13:"Please enter credit",cale14:"Credit ranges from 0 to 1",cale15:"Credit should be number",cale16:"Please enter total satke",cale17:"Commission rate ranges from 20,000 to 100,000,000",cale18:"Total stake should be number",cale19:"Please enter deposit",cale20:"Deposit ranges from 20,000 to 200,000",cale21:"Deposit should be number",cale22:"Please enter stake",cale23:"Deposit ranges from 2000 to 500,000",cale24:"Deposit should be number"},block:{block0:"Blocks",block1:"Hide consensus blocks",block2:"Hide consensus blocks"},blockList:{},address:{address0:"Address list"},addressList:{addressList0:"Assets info",addressList1:"Total income",addressList2:"Total expenditure",addressList3:"Token list"},transaction:{transaction0:"Transaction history",transaction1:"Total transactions"},transactionInfo:{transactionInfo0:"Total fee",transactionInfo1:"Txsize",transactionInfo2:"Refund",transactionInfo3:"Business data",transactionInfo4:"Agent node",transactionInfo5:"Punished account",transactionInfo6:"Round",transactionInfo7:"",transactionInfo8:"Price",transactionInfo9:"Function",transactionInfo10:"Unlock time"},consensus:{consensus0:"Total stake info",consensus1:"Consensus nodes",consensus2:"Node Info",consensus3:"Round info",consensus4:"Current node",consensus5:"Current packing node",consensus6:"Packing nodes of this round ",consensus7:"Current time interval",consensus8:"Round list",consensus9:"Time interval",consensus10:"Packing nodes amount",consensus11:"Normally packing nodes",search:"Please enter an alias/address/ID"},consensusInfo:{consensusInfo0:"Continuous running time",consensusInfo1:"Total blocks",consensusInfo2:"Packing time of this round",consensusInfo3:"Node version",consensusInfo4:"Deposit reward",consensusInfo5:"Commission reward",consensusInfo6:"Total reward",consensusInfo7:"Packing reward",consensusInfo8:"Block reward",consensusInfo9:"Punishment",consensusInfo10:"Current stake info",consensusInfo11:"Stake address",consensusInfo12:"Stake time",consensusInfo13:"Stake history"},rotationInfo:{rotationInfo0:"Round",rotationInfo1:"Only show punishment",rotationInfo2:"Round No.",rotationInfo3:"Blocks"},contracts:{contracts0:"All contracts",contracts1:"Hide NRC-20 contracts",contracts2:"NRC-20 contracts",contracts3:"Total supply",contracts:""},contractsInfo:{contractsInfo0:"Code"},codeInfo:{codeInfo0:"Contract source code is certified",codeInfo1:"Compiler",codeInfo2:"The certification date",codeInfo3:"Contract code",codeInfo4:"Contract source code isn't certified",codeInfo5:"Sorry, source code certificate failed!",codeInfo6:"Upload source code for certification",codeInfo7:"Source code upload notes",codeInfo8:"1.Please compress the source code into a zip package for uploading",codeInfo9:"2.The file directory structure and code in the zip package need to be consistent with deployment code, or it will result in certificating failure",codeInfo10:"Sorry, the maximum upload file size is 5M",codeInfo11:"Request timeout please retry",codeInfo12:"Sorry, I didn't find anything",codeInfo13:"3.Zip packages should not contain non-Java files, otherwise upload authentication will fail"},tokenInfo:{tokenInfo0:"Decimal",tokenInfo1:"Holders",tokenInfo2:"Token transaction",tokenInfo3:"Token list",tokenInfo4:"Rank",tokenInfo5:"Amount",tokenInfo6:"Percentage"},bottom:{website:"Official Website",webWallet:"Light wallet",community:"Community",about:"About"}},F.a),Y=G,Q=t("f0d9"),X=t.n(Q),Z=Object(W["a"])({nav:{wallet:"钱包",transfer:"转账",consensus:"共识",contracts:"合约",application:"应用"},public:{apr:"年奖励率",txs:"交易量",stake:"全网委托量",entrust:"委托量",proportion:"佣金比例",creditValue:"信用值",allEntrust:"总委托量",bond:"保证金",participants:"参与人数",basicInfo:"基本信息",copySuccess:"已复制到剪切板",copyError:"已复制到剪切板",developedTips:"更多功能正在研发中...",txList:"交易记录",transactionList:"交易列表",tokenTrading:"通证交易",address:"地址",locking:"锁定",timeLocking:"时间锁定",consensusLocking:"锁定",usablebalance:"可用",usable:"可用",balance:"余额",total:"总计",alias:"别名",block:"块",seedNode:"种子节点",outNode:"出块节点",height:"高度",time:"时间",transactionNo:"交易数量",blockReward:"块奖励",consensusReward:"共识奖励",size:"大小",createAddress:"创建地址",packAddress:"打包地址",outAddress:"奖励地址",contractAddress:"合约地址",addressType:"地址类型",round:"轮次",number:"编号",fee:"手续费",type:"类型",amount:"金额",serial:"序号",sender:"发送者",recipient:"接收者",passCard:"通证",abbreviate:"缩写",week:"周",month:"月",year:"年",yellowCard:"黄牌",redCard:"红牌",lostRate:"丢块率",day:"天",hour:"时",minute:"分",createTime:"创建时间",reason:"原因",join:"加入",quit:"退出",remarks:"备注",status:"状态",input:"输入",output:"输出",searchTip:"地址/高度/txhash/...",copy:"点击复制",copysuccess:"复制成功"},type:{undefined:"",0:"全部交易",1:"共识奖励",2:"转账交易",3:"设置别名",4:"创建节点",5:"加入共识",6:"退出共识",7:"黄牌惩罚",8:"红牌惩罚",9:"注销节点",10:"通用数据",15:"创建合约",16:"调用合约",17:"删除合约",18:"合约转账",19:"合约返还"},frozenType:{undefined:"",1:"高度锁定",2:"时间锁定",3:"共识锁定"},addressType:{undefined:"",1:"普通地址",2:"合约地址",3:"多签地址"},transferStatus:{undefined:"",0:"未确认",1:"已确认"},nodeType:{undefined:"",0:"综合排序",1:"信用值",2:"佣金",3:"委托量",4:"保证金"},history:{0:"所有历史",1:"加入历史",2:"退出历史"},nodeStatus:{undefined:"",0:"全部节点",1:"普通节点",2:"开发者节点",3:"大使节点"},contractStatus:{undefined:"","-1":"创建失败",0:"未认证",1:"认证中",2:"认证通过",3:"已删除"},home:{home0:"当前高度",home1:"共识节点",home2:"全网委托量",home3:"总发行量",home4:"总流通量",home5:"共识年化奖励率",home6:"共识奖励计算",home7:"14天NULS交易历史",home8:"更多"},cale:{cale0:"共识奖励计算器",cale1:"参与委托",cale3:"日奖励",cale4:"周奖励",cale5:"月奖励",cale6:"年奖励",cale7:"请输入委托量",cale8:"委托量范围为 2000 到 500000",cale9:"委托量必须为数字",cale10:"请输入节点佣金比例",cale11:"佣金比例范围为 10 到 100",cale12:"佣金比例必须为数字",cale13:"请输入节点信用值",cale14:"信用值在 0 到 1",cale15:"信用值必须为数字",cale16:"请输入全网委托量",cale17:"全网委托量范围为 200000 到 100000000",cale18:"全网委托量必须为数字",cale19:"请输入节点保证金",cale20:"保证金范围为 20000 到 200000",cale21:"保证金必须为数字",cale22:"请输入委托量",cale23:"委托量范围为 200000 到 500000",cale24:"委托量必须为数字"},block:{block0:"区块列表",block1:"隐藏共识奖励",block2:"隐藏共识奖励区块"},blockList:{},address:{address0:"地址列表"},addressList:{addressList0:"资产信息",addressList1:"总收入",addressList2:"总支出",addressList3:"通证列表"},transaction:{transaction0:"交易历史",transaction1:"交易总量"},transactionInfo:{transactionInfo0:"总费用",transactionInfo1:"交易打包",transactionInfo2:"返还",transactionInfo3:"业务数据",transactionInfo4:"委托节点",transactionInfo5:"惩罚地址",transactionInfo6:"第",transactionInfo7:"轮",transactionInfo8:"价格",transactionInfo9:"方法",transactionInfo10:"解锁时间"},consensus:{consensus0:"全网委托信息",consensus1:"共识中节点",consensus2:"节点信息",consensus3:"轮次信息",consensus4:"当前轮次",consensus5:"当前出块节点",consensus6:"本轮出块节点数",consensus7:"本轮时间区间",consensus8:"共识轮次列表",consensus9:"时间区间",consensus10:"出块节点数",consensus11:"正常出块节点数",search:"请输入别名/地址/ID"},consensusInfo:{consensusInfo0:"持续运行时间",consensusInfo1:"总出块数",consensusInfo2:"本轮出块时间",consensusInfo3:"节点版本",consensusInfo4:"保证金奖励",consensusInfo5:"佣金奖励",consensusInfo6:"总奖励",consensusInfo7:"出块列表",consensusInfo8:"块收益",consensusInfo9:"红黄牌",consensusInfo10:"当前委托信息",consensusInfo11:"委托地址",consensusInfo12:"委托时间",consensusInfo13:"历史委托信息"},rotationInfo:{rotationInfo0:"轮",rotationInfo1:"只显示红黄牌",rotationInfo2:"本轮编号",rotationInfo3:"区块列表"},contracts:{contracts0:"所有合约",contracts1:"隐藏NRC-20合约",contracts2:"NRC-20 合约",contracts3:"总发行量",contracts:""},contractsInfo:{contractsInfo0:"代码"},codeInfo:{codeInfo0:"合约源代码已认证",codeInfo1:"编译器",codeInfo2:"认证时间",codeInfo3:"合约代码",codeInfo4:"合约源代码未认证",codeInfo5:"对不起，源代码认证失败!",codeInfo6:"上传源码进行认证",codeInfo7:"源码上传注意事项",codeInfo8:"1.请将源码压缩为一个zip包再进行上传",codeInfo9:"2.压缩包中的文件目录结构和代码需和部署时保持已一致，否则将导致认证不通过",codeInfo10:"对不起，上传的文件不超过5M",codeInfo11:"请求超时请重试",codeInfo12:"对不起，什么都没查到",codeInfo13:"3.zip包中不可包含非Java文件，否则将导致上传认证失败"},tokenInfo:{tokenInfo0:"精度",tokenInfo1:"持有地址数",tokenInfo2:"通证交易",tokenInfo3:"持有地址",tokenInfo4:"排名",tokenInfo5:"数量",tokenInfo6:"百分比"},bottom:{website:"官网",webWallet:"网页钱包",community:"社区",about:"关于"}},X.a),K=Z,ee={en:Y,cn:K};o["default"].use(V["a"]);var ne=new V["a"]({locale:localStorage.lang||"cn",messages:ee});J.a.i18n(function(e,n){return ne.t(e,n)});var te=ne,oe=t("9f30"),se=t("54cc"),ae=t.n(se);o["default"].use(ae.a),o["default"].config.productionTip=!1,o["default"].prototype.$post=oe["a"],new o["default"]({router:U,store:$,i18n:te,render:function(e){return e(D)}}).$mount("#app")},"5c48":function(e,n,t){},"6ace":function(e,n,t){"use strict";t.d(n,"a",function(){return r}),t.d(n,"c",function(){return i}),t.d(n,"g",function(){return l}),t.d(n,"b",function(){return d}),t.d(n,"f",function(){return f}),t.d(n,"d",function(){return h}),t.d(n,"e",function(){return p});t("a481"),t("6b54"),t("06db");var o=t("901e"),s=t("f904"),a=t.n(s);function c(e){var n=new o["BigNumber"](10);return n.pow(e)}function r(e,n){var t=new o["BigNumber"](e);return t.minus(n)}function i(e,n){var t=new o["BigNumber"](e);return t.times(n)}function u(e,n){var t=new o["BigNumber"](e);return t.div(n)}function l(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:8,t=new o["BigNumber"](u(e,c(n)).toString());return t.toFormat().replace(/[,]/g,"")}function d(e){var n=new o["BigNumber"](1e8);return n.times(e)}function f(e,n){return e&&e.length>10?e.substr(0,n)+"...."+e.substr(e.length-n,e.length):e}var h=function(e){return a()(e)};function p(e){if("number"===typeof e){var n,t=new Date,o=6e4*t.getTimezoneOffset(),s=(new Date).getTimezoneOffset()/60;n=s>0?e-o:e+o;var a=n+36e5*Math.abs(s);return new Date(a)}}},"7c55":function(e,n,t){"use strict";var o=t("5c48"),s=t.n(o);s.a},"93f7":function(e,n,t){"use strict";var o=t("1d2a"),s=t.n(o);s.a},"9f30":function(e,n,t){"use strict";t.d(n,"a",function(){return i});var o=t("795b"),s=t.n(o),a=t("bc3a"),c=t.n(a),r=t("db49");function i(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];return new s.a(function(o,s){t.unshift(r["a"]);var a={jsonrpc:"2.0",method:n,params:t,id:5898};c.a.post(e,a).then(function(e){o(e.data)},function(e){s(e)})})}c.a.defaults.timeout=r["c"],c.a.defaults.baseURL=r["b"],setInterval(function(){c.a.defaults.baseURL=r["b"]},500),c.a.defaults.headers.post["Content-Type"]="application/json"},ada8:function(e,n,t){},db49:function(e,n,t){"use strict";t.d(n,"a",function(){return s}),t.d(n,"d",function(){return a}),t.d(n,"b",function(){return r}),t.d(n,"c",function(){return i});var o=!1,s=2,a=!1,c=localStorage.hasOwnProperty("urls")?JSON.parse(localStorage.getItem("urls")).urls:"http://apitn1.nulscan.io/",r=c;setInterval(function(){c=localStorage.hasOwnProperty("urls")?JSON.parse(localStorage.getItem("urls")).urls:"http://apitn1.nulscan.io/",r=c},500);var i=o?"9000":"8000"}});
//# sourceMappingURL=app.3b615f2c.js.map