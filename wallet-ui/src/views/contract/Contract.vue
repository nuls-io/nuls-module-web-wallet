<template>
  <div class="contract">
    <h3 class="title">
      {{addressInfo.address}}
      <span v-show="addressInfo.alias"> | {{addressInfo.alias}}</span>
      <i class="iconfont icon-fuzhi clicks"></i>
    </h3>
    <el-tabs v-model="contractActive" class="w1200" @tab-click="handleClick">
      <el-tab-pane :label="$t('contract.contract1')" name="contractFirst" v-loading="myContractDataLoading"
                   element-loading-spinner="el-icon-loading">
        <div class="my_contract">
          <el-table :data="myContractData" stripe border>
            <el-table-column :label="$t('contract.contract2')" align="center" min-width="220">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 3">{{scope.row.contractAddress}}</span>
                <span class="click" @click="toUrl('contractInfo',scope.row.contractAddress,0,'first')"
                      v-if="scope.row.status !== 3">{{scope.row.contractAddress}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.contractName')" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.alias}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.status')" align="center">
              <template slot-scope="scope"><span>{{ $t('contractStatus.'+scope.row.status) }}</span></template>
            </el-table-column>
            <el-table-column prop="createTime" :label="$t('public.time')" align="center">
            </el-table-column>
            <el-table-column :label="$t('public.operation')" align="center">
              <template slot-scope="scope">
                <label class="tab_bn" v-if="scope.row.status ===3 || scope.row.status ===-1">--</label>
                <label class="click tab_bn" v-else @click="toUrl('contractInfo',scope.row.contractAddress,0,'fourth')">{{$t('contract.contract4')}}</label>
                <i class="el-icon-star-on font20 transparent" v-show="scope.row.creater === addressInfo.address"></i>
                <el-tooltip :content="$t('public.cancelCollection')" placement="top"
                            v-show="scope.row.creater !== addressInfo.address">
                  <i class="el-icon-star-on font20 clicks" @click="cancelCollection(scope.row.contractAddress)"></i>
                </el-tooltip>

              </template>
            </el-table-column>
          </el-table>
          <div class="pages">
            <div class="page-total">
              {{pageIndex-1 === 0 ? 1 : (pageIndex-1) *pageSize}}-{{pageIndex*pageSize}}
              of {{pageTotal}}
            </div>
            <el-pagination v-show="pageTotal > pageSize" @current-change="myContractPages" class="fr"
                           :current-page="pageIndex"
                           :page-size="pageSize"
                           background
                           layout=" prev, pager, next, jumper"
                           :total="pageTotal">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('contract.contract5')" name="contractSecond">
        <div class="bg-white w1200 search">
          <div class="search-div">
            <el-input :placeholder="$t('contract.contract6')" v-model.trim="searchContract" class="search-input">
            </el-input>
            <el-button type="success" class="search-button" @click="searchContractByAddress">
              {{$t('contract.contract7')}}
            </el-button>
            <u class="click td" @click="toUrl('contracts','',1)">{{$t('contract.contract8')}}</u>
          </div>
          <div class="contract-info bg-gray" v-show="contractInfo.contractAddress">
            <div class="contract-address font16">
              <div>
                <p class="fl">{{$t('contract.contract9')}}:</p>
                <h6 class="fl font16">
                  {{contractInfo.contractAddress}}
                  <i class="font18" :class="isCollection ? 'el-icon-star-on' : 'el-icon-star-off'"
                     @click="collection(contractInfo.contractAddress)"
                     v-show="contractInfo.creater !== addressInfo.address"
                  ></i>
                </h6>
              </div>
              <div class="cb"></div>
              <div>
                <p class="fl">{{$t('public.contractName')}}:</p>
                <h6 class="fl font16">{{contractInfo.alias}}</h6>
              </div>
              <div class="cb"></div>
              <div v-show="contractInfo.remark">
                <p class="fl">{{$t('public.contractInfo')}}:</p>
                <h6 class="fl font16 overflow">{{contractInfo.remark}}</h6>
              </div>
            </div>
            <Call :modelList="modelData" :contractAddress="contractInfo.contractAddress" :decimals="decimals">
            </Call>
          </div>
        </div>

      </el-tab-pane>
      <el-tab-pane :label="$t('contract.contract10')" name="contractThird">
        <Deploy :addressInfo="addressInfo">
        </Deploy>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import moment from 'moment'
  import {getLocalTime, chainIdNumber, addressInfo, connectToExplorer} from '@/api/util'
  import Deploy from './Deploy'
  import Call from './Call'

  export default {
    data() {
      return {
        addressInfo: {},//地址信息
        contractActive: 'contractFirst',
        //我的合约
        myContractData: [],
        pageIndex: 1, //页码
        pageSize: 10, //每页条数
        pageTotal: 0,//总页数
        currentPage4: 0,
        searchContract: '',//搜索合约
        isCollection: false,//是否收藏
        contractInfo: {},//合约详情
        modelData: [],//合约方法列表
        decimals: 0,//合约精度系数
        myContractDataLoading: true,//我的合约加载动画
      };
    },
    created() {
      this.addressInfo = addressInfo(1);
      setInterval(() => {
        this.addressInfo = addressInfo(1);
      }, 500);

    },
    mounted() {
      setTimeout(() => {
        this.getMyContractByAddress(this.addressInfo.address);
      }, 600);
    },
    components: {
      Deploy,
      Call
    },
    watch: {
      addressInfo(val, old) {
        if (val.address !== old.address && old.address) {
          this.getMyContractByAddress(this.addressInfo.address);
        }
      }
    },
    methods: {

      /**
       * tab 切换
       * @param tab
       **/
      handleClick(tab) {
        //console.log(tab.name);
        if (tab.name === 'contractSecond') {
          this.searchContract = '';
          this.isCollection = false;
          this.contractInfo = {};
          this.modelData = [];
        } else if (tab.name === 'contractFirst') {
          this.getMyContractByAddress(this.addressInfo.address);
        }
      },

      /**
       * 获取合约列表根据地址
       * @param address
       **/
      async getMyContractByAddress(address) {
        await this.$post('/', 'getAccountContractList', [this.pageIndex, this.pageSize, address, -1, false])
          .then((response) => {
            //console.log(response);
            if (!this.addressInfo.contractList) {
              this.addressInfo.contractList = [];
            }
            if (response.hasOwnProperty("result")) {
              if (response.result.list.length !== 0) {
                let myContractList = [];
                for (let item of response.result.list) {
                  myContractList.push(item.contractAddress)
                }
                if (!this.addressInfo.contractList) {
                  this.addressInfo.contractList = [];
                }
                let newContractList = [...myContractList, ...this.addressInfo.contractList];
                this.getContractListById(this.pageIndex, this.pageSize, this.addressInfo.contractList.length + response.result.totalCount, newContractList);
              } else {
                this.getContractListById(this.pageIndex, this.pageSize, this.addressInfo.contractList.length, this.addressInfo.contractList);
              }
              this.myContractDataLoading = false;
            } else {
              this.$message({
                message: this.$t('contract.contract11') + JSON.stringify(response.error),
                type: 'error',
                duration: 1000
              });
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('contract.contract12') + error, type: 'error', duration: 1000});
          });
      },

      /**
       * 合约列表分页
       * @param val
       **/
      myContractPages(val) {
        this.pageIndex = val;
        this.getMyContractByAddress(this.addressInfo.address)
      },

      /**
       * 获取智能合约列表
       * @param pageIndex
       * @param pageSize
       * @param totalCount
       * @param contractAddressList
       **/
      async getContractListById(pageIndex, pageSize, totalCount, contractAddressList) {
        await this.$post('/', 'getContractListById', [pageIndex, pageSize, totalCount, contractAddressList])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result.list) {
                item.createTime = moment(getLocalTime(item.createTime * 1000)).format('YYYY-MM-DD HH:mm:ss');
              }
              this.myContractData = response.result.list;
              this.pageTotal = response.result.totalCount;
            } else {
              this.$message({message: this.$t('contract.contract11') + response.error, type: 'error', duration: 3000});
            }
          })
          .catch((error) => {
            this.$message({message: this.$t('contract.contract12') + error, type: 'error', duration: 3000});
          });
      },

      /**
       * 搜索合约
       **/
      async searchContractByAddress() {
        if (this.searchContract.length > 30) {
          await this.$post('/', 'getContract', [this.searchContract])
            .then((response) => {
              //console.log(response);
              if (response.hasOwnProperty("result")) {
                this.contractInfo = response.result;
                this.modelData = response.result.methods;
                this.decimals = response.result.decimals;
                let contractList = this.addressInfo.contractList;
                if (contractList.length !== 0 && contractList.includes(this.contractInfo.contractAddress)) {
                  this.isCollection = true;
                } else {
                  this.isCollection = false;
                }
              } else {
                this.$message({
                  message: this.$t('contract.contract13') + response.error,
                  type: 'error',
                  duration: 1000
                });
              }
            })
            .catch((error) => {
              this.$message({message: this.$t('contract.contract14') + error, type: 'error', duration: 1000});
            });
        } else {
          this.$message({message: this.$t('contract.contract15'), type: 'error', duration: 1000});
        }
      },

      /**
       * 收藏合约
       * @param contractAddress
       **/
      collection(contractAddress) {
        this.isCollection = !this.isCollection;
        let contractList = this.addressInfo.contractList ? this.addressInfo.contractList : [];
        if (contractList.length !== 0) {
          if (contractList.includes(contractAddress)) {
            for (let [index, elem] of contractList.entries()) {
              if (elem === contractAddress) {
                contractList.splice(index, 1);
              }
            }
          } else {
            contractList.push(contractAddress);
          }
        } else {
          contractList.push(contractAddress);
        }

        let addressList = addressInfo(0);
        for (let item of addressList) {
          if (item.address === this.addressInfo.address) {
            if (!item.contractList) {
              item.contractList = [];
            }
            item.contractList.length = 0;
            let newArr = [...contractList, ...item.contractList];
            let oldArr = Array.from(new Set(newArr));
            item.contractList = [...oldArr]
          }
        }
        localStorage.setItem(chainIdNumber(), JSON.stringify(addressList));
      },

      /**
       * 取消收藏合约
       * @param contractAddress
       **/
      cancelCollection(contractAddress) {
        let contractList = this.addressInfo.contractList;
        if (contractList.includes(contractAddress)) {
          for (let [index, elem] of contractList.entries()) {
            if (elem === contractAddress) {
              contractList.splice(index, 1);
            }
          }
        }
        let addressList = addressInfo(0);
        for (let item of addressList) {
          if (item.address === this.addressInfo.address) {
            item.contractList.length = 0;
            item.contractList = [...contractList]
          }
        }
        localStorage.setItem(chainIdNumber(), JSON.stringify(addressList));
        this.getMyContractByAddress(this.addressInfo.address);
      },

      /**
       * 连接跳转
       * @param name
       * @param parms
       * @param type
       * @param activeName
       */
      toUrl(name, parms, type = 0, activeName) {
        //console.log(name) contractInfo
        if (type.toString() === '0') {
          if (name === 'contractInfo') {
            this.$router.push({
              name: name,
              query: {contractAddress: parms, activeName: activeName}
            });
          } else {
            this.$router.push({
              name: name
            });
          }
        } else {
          connectToExplorer(name, parms)
        }
      },

    }
  };
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .contract {
    background-color: @Bcolour1;
    .el-tabs {
      margin: 30px auto 0;
      .my_contract {
        margin: 0 0 100px 0;
      }
      .search {
        min-height: 500px;
        border: @BD1;
        margin: 20px 0 0 0;
        .search-div {
          text-align: center;
          margin: 20px 0 0 0;
          .search-input {
            width: 400px;
          }
          .search-button {
            width: 120px;
            margin: 0 20px;
            padding: 9px;
          }
        }
        .contract-info {
          width: 625px;
          padding: 0;
          margin: 20px auto 30px;
          .contract-address {
            line-height: 20px;
            padding: 0.5rem 0 0 0;
            p, h6 {
              padding: 0;
            }
            p {
              margin: 0.5rem 0 0 5rem;
            }
            h6 {
              margin: 0.5rem 0 0 0.2rem;
              line-height: 22px;
              i {
                float: right;
                margin: 0 0 0 1rem;
                font-size: 1.4rem;
              }
            }
            .overflow {
              width: 25rem;
            }
          }
        }
      }
    }
  }
</style>
