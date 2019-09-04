import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const cn ={
  "nav":{
    "wallet": "钱包",
    "transfer": "转账",
    "consensus": "共识",
    "contracts": "合约",
    "application":"应用"
  },

  "public":{
    "apr":"年奖励率",
    "txs":"交易量",
    "stake": "全网委托量",
    "entrust":"委托量",
    "proportion":"佣金比例",
    "creditValue":"信用值",
    "allEntrust":"总委托量",
    "bond":"保证金",
    "participants":"参与人数",
    "basicInfo":"基本信息",
    "copySuccess":"已复制到剪切板",
    "copyError":"已复制到剪切板",
    "developedTips":"更多功能正在研发中...",
    "txList":"交易记录",
    "transactionList":"交易列表",
    "tokenTrading":"通证交易",
    "address":"地址",
    "locking":"锁定",
    "timeLocking":"时间锁定",
    "consensusLocking":"锁定",
    "usablebalance":"可用",
    "usable":"可用",
    "balance":"余额",
    "total":"总计",
    "alias":"别名",
    "block":"块",
    "seedNode":"种子节点",
    "outNode":"出块节点",
    "height":"高度",
    "time":"时间",
    "transactionNo":"交易数量",
    "blockReward":"块奖励",
    "consensusReward":"共识奖励",
    "size":"大小",
    "createAddress":"创建地址",
    "packAddress":"打包地址",
    "outAddress":"奖励地址",
    "contractAddress":"合约地址",
    "addressType":"地址类型",
    "round":"轮次",
    "number":"编号",
    "fee":"手续费",
    "type":"类型",
    "amount":"金额",
    "serial":"序号",
    "sender":"发送者",
    "recipient":"接收者",
    "passCard":"通证",
    "abbreviate":"缩写",
    "week":"周",
    "month":"月",
    "year":"年",
    "yellowCard":"黄牌",
    "redCard":"红牌",
    "lostRate":"丢块率",
    "day":"天",
    "hour":"时",
    "minute":"分",
    "createTime":"创建时间",
    "reason":"原因",
    "join":"加入",
    "quit":"退出",
    "remarks":"备注",
    "status":"状态",
    "input":"输入",
    "output":"输出",
    "searchTip":"地址/高度/txhash/...",
    "copy":"点击复制",
    "copysuccess":"复制成功"
  },

  "type": {
    "undefined":"",
    "0": "全部交易",
    "1": "共识奖励",
    "2": "转账交易",
    "3": "设置别名",
    "4": "创建节点",
    "5": "加入共识",
    "6": "退出共识",
    "7": "黄牌惩罚",
    "8": "红牌惩罚",
    "9": "注销节点",
    "10": "通用数据",
    "15":"创建合约",
    "16":"调用合约",
    "17":"删除合约",
    "18":"合约转账",
    "19":"合约返还",
  },

  "frozenType": {
    "undefined":"",
    "1": "高度锁定",
    "2": "时间锁定",
    "3": "共识锁定"
  },

  "addressType": {
    "undefined":"",
    "1": "普通地址",
    "2": "合约地址",
    "3": "多签地址"
  },

  "transferStatus": {
    "undefined":"",
    "0": "未确认",
    "1": "已确认"
  },

  "nodeType": {
    "undefined":"",
    "0": "综合排序",
    "1": "信用值",
    "2": "佣金",
    "3": "委托量",
    "4": "保证金"
  },

  "history":{
    "0":"所有历史",
    "1":"加入历史",
    "2":"退出历史",
  },

  "nodeStatus": {
    "undefined":"",
    "0": "全部节点",
    "1": "普通节点",
    "2": "开发者节点",
    "3": "大使节点"
  },

  "contractStatus": {
    "undefined":"",
    "-1":"创建失败",
    "0": "未认证",
    "1": "认证中",
    "2": "认证通过",
    "3": "已删除"
  },

  "home":{
    "home0":"当前高度",
    "home1":"共识节点",
    "home2":"全网委托量",
    "home3":"总发行量",
    "home4":"总流通量",
    "home5":"共识年化奖励率",
    "home6":"共识奖励计算",
    "home7":"14天NULS交易历史",
    "home8":"更多"
  },

  "cale":{
    "cale0":"共识奖励计算器",
    "cale1":"参与委托",
    "cale3":"日奖励",
    "cale4":"周奖励",
    "cale5":"月奖励",
    "cale6":"年奖励",
    "cale7":"请输入委托量",
    "cale8":"委托量范围为 2000 到 500000",
    "cale9":"委托量必须为数字",
    "cale10":"请输入节点佣金比例",
    "cale11":"佣金比例范围为 10 到 100",
    "cale12":"佣金比例必须为数字",
    "cale13":"请输入节点信用值",
    "cale14":"信用值在 0 到 1",
    "cale15":"信用值必须为数字",
    "cale16":"请输入全网委托量",
    "cale17":"全网委托量范围为 200000 到 100000000",
    "cale18":"全网委托量必须为数字",
    "cale19":"请输入节点保证金",
    "cale20":"保证金范围为 20000 到 200000",
    "cale21":"保证金必须为数字",
    "cale22":"请输入委托量",
    "cale23":"委托量范围为 200000 到 500000",
    "cale24":"委托量必须为数字"
  },

  "block":{
    "block0":"区块列表",
    "block1":"隐藏共识奖励",
    "block2":"隐藏共识奖励区块"
  },

  "blockList":{

  },

  "address":{
    "address0":"地址列表"
  },

  "addressList":{
    "addressList0":"资产信息",
    "addressList1":"总收入",
    "addressList2":"总支出",
    "addressList3":"通证列表"
  },

  "transaction":{
    "transaction0":"交易历史",
    "transaction1":"交易总量"
  },

  "transactionInfo":{
    "transactionInfo0":"总费用",
    "transactionInfo1":"交易打包",
    "transactionInfo2":"返还",
    "transactionInfo3":"业务数据",
    "transactionInfo4":"委托节点",
    "transactionInfo5":"惩罚地址",
    "transactionInfo6":"第",
    "transactionInfo7":"轮",
    "transactionInfo8":"价格",
    "transactionInfo9":"方法",
    "transactionInfo10":"解锁时间"
  },

  "consensus":{
    "consensus0":"全网委托信息",
    "consensus1":"共识中节点",
    "consensus2":"节点信息",
    "consensus3":"轮次信息",
    "consensus4":"当前轮次",
    "consensus5":"当前出块节点",
    "consensus6":"本轮出块节点数",
    "consensus7":"本轮时间区间",
    "consensus8":"共识轮次列表",
    "consensus9":"时间区间",
    "consensus10":"出块节点数",
    "consensus11":"正常出块节点数",
    "search":"请输入别名/地址/ID"
  },

  "consensusInfo":{
    "consensusInfo0":"持续运行时间",
    "consensusInfo1":"总出块数",
    "consensusInfo2":"本轮出块时间",
    "consensusInfo3":"节点版本",
    "consensusInfo4":"保证金奖励",
    "consensusInfo5":"佣金奖励",
    "consensusInfo6":"总奖励",
    "consensusInfo7":"出块列表",
    "consensusInfo8":"块收益",
    "consensusInfo9":"红黄牌",
    "consensusInfo10":"当前委托信息",
    "consensusInfo11":"委托地址",
    "consensusInfo12":"委托时间",
    "consensusInfo13":"历史委托信息",
  },

  "rotationInfo":{
    "rotationInfo0":"轮",
    "rotationInfo1":"只显示红黄牌",
    "rotationInfo2":"本轮编号",
    "rotationInfo3":"区块列表"
  },

  "contracts":{
    "contracts0":"所有合约",
    "contracts1":"隐藏NRC-20合约",
    "contracts2":"NRC-20 合约",
    "contracts3":"总发行量",
    "contracts":""
  },

  "contractsInfo":{
    "contractsInfo0":"代码"
  },

  "codeInfo":{
    "codeInfo0":"合约源代码已认证",
    "codeInfo1":"编译器",
    "codeInfo2":"认证时间",
    "codeInfo3":"合约代码",
    "codeInfo4":"合约源代码未认证",
    "codeInfo5":"对不起，源代码认证失败!",
    "codeInfo6":"上传源码进行认证",
    "codeInfo7":"源码上传注意事项",
    "codeInfo8":"1.请将源码压缩为一个zip包再进行上传",
    "codeInfo9":"2.压缩包中的文件目录结构和代码需和部署时保持已一致，否则将导致认证不通过",
    "codeInfo10":"对不起，上传的文件不超过5M",
    "codeInfo11":"请求超时请重试",
    "codeInfo12":"对不起，什么都没查到",
    "codeInfo13":"3.zip包中不可包含非Java文件，否则将导致上传认证失败",
  },

  "tokenInfo":{
    "tokenInfo0":"精度",
    "tokenInfo1":"持有地址数",
    "tokenInfo2":"通证交易",
    "tokenInfo3":"持有地址",
    "tokenInfo4":"排名",
    "tokenInfo5":"数量",
    "tokenInfo6":"百分比"
  },

  "bottom":{
    "website":"官网",
    "webWallet":"网页钱包",
    "community":"社区",
    "about":"关于"
  },
  ...zhLocale
};

export default cn
