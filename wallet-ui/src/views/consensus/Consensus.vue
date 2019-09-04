<template>
    <div class="consensus bg-gray">
        <h3 class="title">
            {{addressInfo.address}}
            <span v-show="addressInfo.alias">({{addressInfo.alias}})</span>
            <i class="iconfont icon-fuzhi clicks" @click="copy(addressInfo.address)"></i>
        </h3>
        <div class="card w1200">
            <div class="card-info left fl">
                <h5 class="card-title font18">我的共识</h5>
                <ul>
                    <li>总委托 <label><u class="td click" @click="toUrl('consensusList')">{{addressInfo.consensusLock}}</u><span
                            class="fCN">NULS</span></label></li>
                    <li>可用余额 <label>{{addressInfo.balance}}<span class="fCN">NULS</span></label></li>
                    <li>总共识奖励 <label>{{addressInfo.totalReward}}<span class="fCN">NULS</span></label></li>
                </ul>
            </div>
            <div class="card-info right fr">
                <h5 class="card-title font18">
                    所有共识
                    <span class="font16 click fr" @click="toUrl('newConsensus')" v-show="!isNew">创建</span>
                </h5>
                <ul>
                    <li>共识节点 <label>{{nodeCount.agentCount}}</label></li>
                    <li>总节点数 <label>{{nodeCount.totalCount}}</label></li>
                    <li>总委托量 <label>{{nulsCount.consensusTotal}}<span class="fCN">NULS</span></label></li>
                </ul>
            </div>
        </div>
        <div class="cb"></div>
        <el-tabs v-model="consensusActive" @tab-click="handleClick" class="w1200">
            <el-tab-pane label="所有节点" name="consensusFirst">
                <div class="filter">
                    <SelectBar v-model="nodeStatusRegion" :typeOptions="nodeStatusOptions" typeName="nodeStatus"
                               @change="changeNodeStatus">
                    </SelectBar>
                    <SelectBar v-model="nodeTypeRegion" :typeOptions="nodeTypeOptions" typeName="nodeType"
                               @change="changeNodeType">
                    </SelectBar>
                    <el-input placeholder="请选择输入ID\别名\地址...." class="search" v-model="searchValue"
                              suffix-icon="el-icon-search">
                        <i class="iconfont icon-search_icon fr click"></i>
                    </el-input>
                </div>
                <div class="node">
                    <div class="node_info" v-for="item in searchData" :key="item.agentId">
                        <h4 class="bg-gray">
                            <i class="iconfont iconwo" v-show="item.isNew"></i>&nbsp;
                            <span class="uppercase">{{item.agentId}}</span>&nbsp;
                            <i class="iconfont"
                               :class="item.status ===0 ? 'icondaigongshi fred' : 'icongongshizhong fCN'"></i>
                            <i class="follow el-icon-star-off"></i>
                        </h4>
                        <ul class="bg-white click" @click="toUrl('consensusInfo',item.txHash)">
                            <li>别名<span>{{item.agentAlias}}</span></li>
                            <li>佣金比例 <span>{{item.commissionRate}}%</span></li>
                            <li>总委托量<span>{{item.totalDeposit}}</span></li>
                            <li>参与人数<span>{{item.depositCount}}</span></li>
                            <li>保证金<span>{{item.deposit}}</span></li>
                            <li>信用值<span>{{item.creditValue}}</span></li>
                        </ul>
                    </div>
                    <div class="cb"></div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="我的节点" name="consensusSecond">
                <div class="node">
                    <div class="node_info" v-for="item in myNodeData" :key="item.agentId">
                        <h4 class="bg-gray">
                            <i class="iconfont iconwo" v-show="item.isNew"></i>&nbsp;
                            <span class="uppercase">{{item.agentId}}</span>&nbsp;
                            <i class="iconfont"
                               :class="item.status ===0 ? 'icondaigongshi fred' : 'icongongshizhong fCN'"></i>
                            <i class="follow el-icon-star-off"></i>
                        </h4>
                        <ul class="bg-white click" @click="toUrl('consensusInfo',item.txHash)">
                            <li>别名<span>{{item.agentAlias}}</span></li>
                            <li>佣金比例 <span>{{item.commissionRate}}%</span></li>
                            <li>总委托量<span>{{item.totalDeposit/100000000}}</span></li>
                            <li>参与人数<span>{{item.depositCount}}</span></li>
                            <li>保证金<span>{{item.deposit/100000000}}</span></li>
                            <li>信用值<span>{{item.creditValue}}</span></li>
                        </ul>
                    </div>
                    <div class="cb"></div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  import SelectBar from '@/components/SelectBar';
  import {timesDecimals, copys} from '@/api/util'

  export default {
    name: 'consensus',
    data() {
      return {
        consensusActive: 'consensusFirst',
        //节点信息
        nodeCount: {agentCount: 0, totalCount: 0},
        //nuls 信息
        nulsCount: {consensusTotal: 0},
        //排序下拉框选择列表
        nodeTypeOptions: [
          {value: 0, label: '0'},
          {value: 1, label: '1'},
          {value: 2, label: '2'},
          {value: 3, label: '3'},
          {value: 4, label: '4'},
        ],
        nodeTypeRegion: 0,//节点类型，type=0时，返回所有交易
        //节点类型排序
        nodeStatusOptions: [
          {value: 0, label: '0'},
          {value: 1, label: '1'},
          {value: 2, label: '2'},
          {value: 3, label: '3'},
        ],
        nodeStatusRegion: 0,

        searchValue: '',//搜索框
        allNodeData: [],//所有节点信息
        addressInfo: [], //账户信息
        isNew: false,//账户是否已经创建了节点
        pageIndex: 1, //页码
        pageSize: 20, //每页条数
        pageTotal: 0,//总页数
        myNodeData: [],//我的节点信息
        setInterval:null,//定时器变量
      };
    },
    components: {
      SelectBar
    },
    created() {
      this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      setInterval(() => {
        this.addressInfo = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
      }, 500);
      this.getConsensusNodeCount();
      this.getCoinInfo();
    },
    mounted() {
      this.getConsensusNodes(this.pageIndex, this.pageSize, this.nodeTypeRegion);
      this.getConsensusInfoByAddress(this.pageIndex, this.pageSize, this.addressInfo.address);
      this.setInterval = setInterval(() => {
        this.getAddressInfoByNode(this.addressInfo)
      },10000)

    },
    destroyed() {
      clearInterval(this.setInterval);
    },
    computed: {
      //数据筛选
      searchData: function () {
        let search = this.searchValue;
        //console.log(this.nodeList);
        if (search) {
          return this.allNodeData.filter(function (product) {
            return Object.keys(product).some(function (key) {
              return String(product[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
            })
          })
        }
        return this.allNodeData;
      },
    },
    watch: {
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.isNew = false;
          this.getConsensusNodeCount();
          this.getCoinInfo();
          this.getConsensusNodes(this.pageIndex, this.pageSize, this.nodeTypeRegion);
          this.getConsensusInfoByAddress(this.pageIndex, this.pageSize, this.addressInfo.address);
        }
      }
    },
    methods: {

      /**
       * 获取地址网络信息
       * @param addressInfo
       **/
      async getAddressInfoByNode(addressInfo) {
        addressInfo.alias = "";
        addressInfo.balance = 0;
        addressInfo.consensusLock = 0;
        addressInfo.totalReward = 0;
        await this.$post('/', 'getAccount', [addressInfo.address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              addressInfo.alias = response.result.alias;
              addressInfo.balance = timesDecimals(response.result.balance);
              addressInfo.consensusLock = timesDecimals(response.result.consensusLock);
              addressInfo.totalReward = timesDecimals(response.result.totalReward);
            }
            localStorage.setItem(addressInfo.address, JSON.stringify(addressInfo));
          })
          .catch((error) => {
            console.log("getAccount:" + error);
            localStorage.setItem(addressInfo.address, JSON.stringify(addressInfo));
          });
      },


      /**
       * 获取共识数统计信息
       **/
      getConsensusNodeCount() {
        this.$post('/', 'getConsensusNodeCount', [])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.nodeCount = response.result
            } else {
              this.nodeCount.agentCount = 0;
              this.nodeCount.totalCount = 0;
            }
          })
          .catch((error) => {
            this.nodeCount.agentCount = 0;
            this.nodeCount.totalCount = 0;
            console.log("getConsensusNodeCount:" + error);
          });
      },

      /**
       * 获取共识委托量统计信息
       **/
      getCoinInfo() {
        this.$post('/', 'getCoinInfo', [])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.nulsCount.circulation = timesDecimals(response.result.circulation);
              this.nulsCount.consensusTotal = timesDecimals(response.result.consensusTotal);
              this.nulsCount.total = timesDecimals(response.result.total);
            } else {
              this.nulsCount.circulation = 0;
              this.nulsCount.consensusTotal = 0;
              this.nulsCount.total = 0;
            }
          })
          .catch((error) => {
            this.nulsCount.circulation = 0;
            this.nulsCount.consensusTotal = 0;
            this.nulsCount.total = 0;
            console.log("getCoinInfo:" + error);
          });
      },

      /**
       * 所有共识列表信息
       * @param pageIndex
       * @param pageSize,
       * @param type
       **/
      getConsensusNodes(pageIndex, pageSize, type) {
        this.$post('/', 'getConsensusNodes', [pageIndex, pageSize, type])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let itme of response.result.list) {
                itme.bozhengjin = itme.deposit;
                itme.deposit = timesDecimals(itme.deposit);
                itme.agentReward = timesDecimals(itme.agentReward);
                itme.totalDeposit = timesDecimals(itme.totalDeposit);
                itme.totalReward = timesDecimals(itme.totalReward);
                if (itme.agentAddress === this.addressInfo.address) {
                  itme.isNew = true;//创建的节点
                } else {
                  itme.isNew = false;
                }
              }
              this.allNodeData = response.result.list
            }
          })
          .catch((error) => {
            console.log("getConsensusNodes:" + error);
          });

      },

      /**
       * 我的节点（根据地址获取共识信息）
       * @param pageIndex
       * @param pageSize
       * @param address
       **/
      getConsensusInfoByAddress(pageIndex, pageSize, address) {
        this.$post('/', 'getAccountConsensus', [pageIndex, pageSize, address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.myNodeData = response.result.list;
              //循环获取节点列表判断是否有地址创建列表
              for (let item of response.result.list) {
                if (item.agentAddress === this.addressInfo.address) {
                  item.isNew = true;//创建的节点
                  this.isNew = true;
                } else {
                  item.isNew = false;
                  this.isNew = false;
                }
              }
            }
          })
          .catch((error) => {
            console.log("getAccountConsensus:" + error);
          });
      },

      /**
       *  根据节点类型筛选
       *  @param type
       **/
      changeNodeStatus(type) {
        this.nodeStatusRegion = type;
        this.getConsensusNodes(this.pageIndex, this.pageSize, this.nodeStatusRegion)
      },

      /**
       *  根据数据排序
       *  @param type
       **/
      changeNodeType(type) {
        this.nodeTypeRegion = parseInt(type);
        switch (type) {
          case 1:
            this.nodeTypeSort(this.allNodeData, 'creditValue');
            break;
          case 2:
            this.nodeTypeSort(this.allNodeData, 'commissionRate');
            break;
          case 3:
            this.nodeTypeSort(this.allNodeData, 'totalDeposit');
            break;
          case 4:
            this.nodeTypeSort(this.allNodeData, 'bozhengjin');
            break;
          default:
            this.getConsensusNodes(this.pageIndex, this.pageSize, this.nodeStatusRegion)
        }
      },

      /**
       * 数组排序
       */
      nodeTypeSort(arr, name) {
        //console.log(name);
        let compare = function (prop) {
          return function (obj1, obj2) {
            let val1 = obj1[prop];
            let val2 = obj2[prop];
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
              val1 = Number(val1);
              val2 = Number(val2);
            }
            if (val1 > val2) {
              return -1;
            } else if (val1 < val2) {
              return 1;
            } else {
              return 0;
            }
          }
        };
        return arr.sort(compare(name));
      },

      /**
       * 连接跳转
       * @param name
       * @param params
       */
      toUrl(name, params) {
        //console.log(name,params);
        let newQuery = {};
        if (name === 'consensusInfo') {
          newQuery = {hash: params}
        } else {
          newQuery = {}
        }
        this.$router.push({
          name: name,
          query: newQuery
        })
      },

      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: "已经复制完成", type: 'success', duration: 1000});
      },

      /**
       * tab 切换
       * @param tab
       */
      handleClick(tab) {
        this.consensusActive = tab.name;
        if (tab.name === 'consensusFirst') {
          this.getConsensusNodes(this.pageIndex, this.pageSize, this.nodeTypeRegion);
        } else {
          this.getConsensusInfoByAddress(this.pageIndex, this.pageSize, this.addressInfo.address);
        }
      }
    }
  }
</script>

<style lang="less">
    @import "./../../assets/css/style";

    .consensus {
        .card {
            margin: -20px auto 0;
            height: 200px;
            .left, .right {
                width: 590px;
            }
        }
        .node {
            margin: 0 0 100px 0;
            .node_info {
                border: @BD1;
                width: 285px;
                height: 175px;
                margin: 20px 20px 0 0;
                float: left;
                &:nth-child(4n) {
                    margin: 20px 0 0 0;
                }
                h4 {
                    height: 32px;
                    line-height: 32px;
                    padding: 0 20px;
                    .follow {
                        float: right;
                        padding-top: 5px;
                    }
                }
                ul {
                    padding: 0 0 2px 0;
                    li {
                        height: 23px;
                        line-height: 23px;
                        padding: 0 0 0 30px;
                        font-size: 12px;
                        span {
                            display: block;
                            float: right;
                            text-align: left;
                            width: 160px;
                        }
                    }

                }
            }
        }
    }
</style>
