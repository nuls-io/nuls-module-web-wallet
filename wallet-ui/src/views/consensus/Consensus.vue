<template>
  <div class="consensus bg-gray">
    <h3 class="title">
      {{addressInfo.address}}
      <span v-show="addressInfo.alias"> | {{addressInfo.alias}}</span>
      <i class="iconfont icon-fuzhi clicks" @click="copy(addressInfo.address)"></i>
    </h3>
    <div class="card w1200">
      <div class="card-info left fl">
        <h5 class="card-title font18">
          {{$t('consensus.consensus0')}}
          <span class="font14 fr">{{Number(addressInfo.totalReward).toFixed(3)}}<font class="fCN"> {{addressInfo.symbol}}</font></span>
        </h5>
        <ul>
          <li>
            {{$t('consensus.consensus1')}}
            <label>
              <u class="click"
                 @click="toUrl('consensusList',addressInfo.consensusLock)">{{Number(addressInfo.consensusLock).toFixed(3)}}</u>
              <span class="fCN">{{addressInfo.symbol}}</span>
            </label>
          </li>
          <li>
            {{$t('consensus.consensus2')}}
            <label>{{Number(addressInfo.balance).toFixed(3)}}<span class="fCN">{{addressInfo.symbol}}</span></label>
          </li>
          <li>
            {{$t('consensus.consensus3')}}
            <label>{{Number(addressInfo.lastReward).toFixed(3)}}<span class="fCN">{{addressInfo.symbol}}</span></label>
          </li>
        </ul>
      </div>
      <div class="card-info right fr">
        <h5 class="card-title font18">
          {{$t('consensus.consensus4')}}
          <span class="font16 click fr" @click="toUrl('newConsensus')" v-show="!isNew && !isRed">
            {{$t('consensus.consensus5')}}
          </span>
        </h5>
        <ul>
          <li>
            {{$t('consensus.consensus8')}}
            <label>{{Number(nulsCount.consensusTotal).toFixed(3)}}<span
                    class="fCN">{{addressInfo.symbol}}</span></label>
          </li>
          <li>{{$t('consensus.consensus7')}} <label>{{nodeCount.agentCount}}</label></li>
          <li>{{$t('consensus.consensus6')}} <label>{{nodeCount.consensusCount}}</label></li>
        </ul>
      </div>
    </div>
    <div class="cb"></div>
    <el-tabs v-model="consensusActive" @tab-click="handleClick" class="w1200">
      <el-tab-pane :label="$t('consensus.consensus9')" name="consensusFirst">
        <div class="filter">
          <SelectBar v-model="nodeStatusRegion" :typeOptions="nodeStatusOptions" typeName="nodeStatus"
                     @change="changeNodeStatus" v-show="false">
          </SelectBar>
          <SelectBar v-model="nodeTypeRegion" :typeOptions="nodeTypeOptions" typeName="nodeType"
                     @change="changeNodeType">
          </SelectBar>
          <el-input :placeholder="$t('consensus.consensus10')" class="search" v-model="searchValue"
                    suffix-icon="el-icon-search">
            <i class="iconfont icon-search_icon fr click"></i>
          </el-input>
        </div>
        <div class="node" v-loading="allNodeLoading" element-loading-spinner="el-icon-loading">
          <div class="node_info" v-for="item in searchData" :key="item.agentId">
            <h4 class="bg-gray">
              <i class="iconfont iconwo" v-show="item.isNew"></i>&nbsp;
              <span class="uppercase">{{item.agentId}}</span>&nbsp;
              <i class="iconfont"
                 :class="item.status ===0 ? 'icondaigongshi fred' : 'icongongshizhong fCN'"></i>
              <i class="follow clicks" :class="item.isCollect ? 'el-icon-star-on fCN':'el-icon-star-off'"
                 @click="collect(item)"></i>
            </h4>
            <ul class="bg-white click" @click="toUrl('consensusInfo',item.txHash)">
              <li>{{$t('public.alias')}}<span>{{item.agentAlias}}</span></li>
              <li>{{$t('public.commission')}} <span>{{item.commissionRate}}%</span></li>
              <li>{{$t('public.totalStake')}}<span>{{item.totalDeposit}}</span></li>
              <li>{{$t('public.participants')}}<span>{{item.depositCount}}</span></li>
              <li>{{$t('public.deposit')}}<span>{{item.deposit}}</span></li>
              <li>{{$t('public.credit')}}<span>{{item.creditValue}}</span></li>
            </ul>
          </div>
          <div class="cb"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('consensus.consensus11')" name="consensusSecond">
        <div class="node">
          <div class="node_info" v-for="item in myNodeData" :key="item.agentId">
            <h4 class="bg-gray">
              <i class="iconfont iconwo" v-show="item.isNew"></i>&nbsp;
              <span class="uppercase">{{item.agentId}}</span>&nbsp;
              <i class="iconfont"
                 :class="item.status ===0 ? 'icondaigongshi fred' : 'icongongshizhong fCN'"></i>
              <i class="follow clicks" :class="item.isCollect ? 'el-icon-star-on fCN':'el-icon-star-off'"
                 @click="collect(item)"></i>
            </h4>
            <ul class="bg-white click" @click="toUrl('consensusInfo',item.txHash)">
              <li>{{$t('public.alias')}}<span>{{item.agentAlias}}</span></li>
              <li>{{$t('public.commission')}} <span>{{item.commissionRate}}%</span></li>
              <li>{{$t('public.totalStake')}}<span>{{item.totalDeposit}}</span></li>
              <li>{{$t('public.participants')}}<span>{{item.depositCount}}</span></li>
              <li>{{$t('public.deposit')}}<span>{{item.deposit}}</span></li>
              <li>{{$t('public.credit')}}<span>{{item.creditValue}}</span></li>
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
  import {timesDecimals, copys, addressInfo, chainIdNumber} from '@/api/util'

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
        allNodeLoading: true,//所有节点信息加载动画
        addressInfo: [], //账户信息
        agentAsset: JSON.parse(sessionStorage.getItem('info')),//pocm合约单位等信息
        isRed: false,//地址是否有红牌
        isNew: false,//账户是否已经创建了节点
        pageIndex: 1, //页码
        pageSize: 500, //每页条数
        pageTotal: 0,//总页数
        myNodeData: [],//我的节点信息
        setInterval: null,//定时器变量
      };
    },
    components: {
      SelectBar
    },
    created() {
      this.addressInfo = addressInfo(1);
      setInterval(() => {
        this.addressInfo = addressInfo(1);
      }, 500);
    },
    mounted() {
      setTimeout(() => {
        this.getConsensusNodeCount();
        this.getCoinInfo();
        this.getConsensusNodes(this.pageIndex, this.pageSize, this.nodeTypeRegion);
        //this.getConsensusInfoByAddress(this.pageIndex, this.pageSize, this.addressInfo.address);
        this.getAddressInfoByNode(this.addressInfo);
        this.getPunishByAddress(this.addressInfo.address);
      }, 600);
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
          this.getPunishByAddress(this.addressInfo.address);
          this.getConsensusNodeCount();
          this.getCoinInfo();
          this.getConsensusNodes(this.pageIndex, this.pageSize, this.nodeTypeRegion);
          this.getConsensusInfoByAddress(this.pageIndex, this.pageSize, this.addressInfo.address);
        }
      }
    },
    methods: {

      /**
       * 查询创建地址是否有红牌
       * @param address
       **/
      getPunishByAddress(address) {
        this.$post('/', 'getPunishList', [1, 1, 2, address])
          .then((response) => {
            //console.log(response);
            if (response.result.list.length !== 0) {
              this.isRed = true;
            } else {
              this.isRed = false;
            }
          }).catch((error) => {
          this.$message({message: this.$t('public.err3') + error, type: 'error', duration: 1000});
        });
      },

      /**
       * 获取地址网络信息
       * @param addressInfos
       **/
      async getAddressInfoByNode(addressInfos) {
        await this.$post('/', 'getAccount', [addressInfos.address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              let newAddressInfo = addressInfo(0);
              for (let item of newAddressInfo) {
                if (item.address === addressInfos.address) {
                  newAddressInfo.alias = response.result.alias;
                  newAddressInfo.symbol = response.result.symbol;
                  newAddressInfo.balance = timesDecimals(response.result.balance);
                  newAddressInfo.consensusLock = timesDecimals(response.result.consensusLock);
                  newAddressInfo.totalReward = timesDecimals(response.result.totalReward);
                  if (response.result.lastReward) {
                    newAddressInfo.lastReward = timesDecimals(response.result.lastReward);
                  } else {
                    newAddressInfo.lastReward = 0;
                  }
                  newAddressInfo.totalIn = timesDecimals(response.result.totalIn);
                  newAddressInfo.totalOut = timesDecimals(response.result.totalOut);
                }
              }
              //newAddressInfo =
              localStorage.setItem(chainIdNumber(), JSON.stringify(newAddressInfo));
            }
          })
          .catch((error) => {
            console.log("getAccount:" + error);
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
        this.allNodeLoading = true;
        this.$post('/', 'getConsensusNodes', [pageIndex, pageSize, type])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              if (!this.addressInfo.collectList) {
                this.addressInfo.collectList = [];
              }
              for (let itme of response.result.list) {
                if (this.addressInfo.collectList.includes(itme.agentId)) {
                  itme.isCollect = true;
                } else {
                  itme.isCollect = false;
                }
                itme.bozhengjin = itme.deposit;
                itme.deposit = Number(timesDecimals(itme.deposit)).toFixed(3);
                itme.agentReward = Number(timesDecimals(itme.agentReward)).toFixed(3);
                itme.totalDeposit = Number(timesDecimals(itme.totalDeposit)).toFixed(3);
                itme.totalReward = Number(timesDecimals(itme.totalReward)).toFixed(3);
                if (itme.agentAddress === this.addressInfo.address) {
                  this.isNew = true;//创建的节点
                } else {
                  this.isNew = false;
                }
              }
              this.allNodeData = response.result.list;
              this.allNodeLoading = false;
            }
          })
          .catch((error) => {
            console.log("getConsensusNodes:" + error);
          });

      },

      /**
       * 收藏功能
       * @param nodeInfo
       **/
      collect(nodeInfo) {
        //console.log(nodeInfo);
        if (!this.addressInfo.hasOwnProperty('collectList')) {
          this.addressInfo.collectList = []
        }
        if (this.addressInfo.collectList.includes(nodeInfo.agentId)) {
          //移除已收藏
          this.addressInfo.collectList.splice(this.addressInfo.collectList.findIndex(v => v === nodeInfo.agentId), 1);
        } else {
          this.addressInfo.collectList.push(nodeInfo.agentId);
        }

        if (this.consensusActive === 'consensusFirst') {
          //循环是否收藏
          for (let item of this.allNodeData) {
            if (this.addressInfo.collectList.includes(item.agentId)) {
              item.isCollect = true;
            } else {
              item.isCollect = false;
            }
          }
        } else { //循环是否收藏
          for (let item of this.myNodeData) {
            if (this.addressInfo.collectList.includes(item.agentId)) {
              item.isCollect = true;
            } else {
              item.isCollect = false;
            }
          }
        }
        let newAddressList = addressInfo(0);
        for (let item of newAddressList) {
          if (item.address === this.addressInfo.address) {
            item.collectList = this.addressInfo.collectList
          }
        }
        localStorage.setItem(chainIdNumber(), JSON.stringify(newAddressList));
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
              //循环获取节点列表判断是否有地址创建列表
              let newAgentIdList = [];
              for (let item of response.result.list) {
                if (!this.addressInfo.collectList) {
                  this.addressInfo.collectList = [];
                }
                if (this.addressInfo.collectList.includes(item.agentId)) {
                  item.isCollect = true;
                } else {
                  item.isCollect = false;
                }
                newAgentIdList.push(item.agentId);
                item.deposit = Number(timesDecimals(item.deposit)).toFixed(3);
                item.totalDeposit = Number(timesDecimals(item.totalDeposit)).toFixed(3);
                item.totalReward = Number(timesDecimals(item.totalReward)).toFixed(3);
                if (item.agentAddress === this.addressInfo.address) {
                  item.isNew = true;//创建的节点
                  this.isNew = true;
                } else {
                  item.isNew = false;
                  this.isNew = false;
                }
              }
              let setnNewAgentIdList = new Set(newAgentIdList);
              let setCollectList = new Set(this.addressInfo.collectList);
              // 差集
              let difference = new Set([...setCollectList].filter(x => !setnNewAgentIdList.has(x)));
              let newCollectList = [];
              for (let items of difference) {
                newCollectList.push(this.allNodeData.filter(item => item.agentId === items)[0])
              }
              this.myNodeData = [...response.result.list, ...newCollectList];
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
          newQuery = {consensusLock: params}
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
        this.$message({message: this.$t('public.copySuccess'), type: 'success', duration: 1000});
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
