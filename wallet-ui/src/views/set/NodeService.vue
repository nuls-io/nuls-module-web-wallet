<template>
  <div class="node_service bg-gray cb" v-loading="loading" :element-loading-text="$t('nodeService.nodeService0')"
       element-loading-spinner="el-icon-loading">
    <h3 class="title">{{$t('nodeService.nodeService1')}}</h3>

    <div class="w1200 mt_20" v-loading="nodeServiceLoading">
      <div class="top_ico">
        <i class="el-icon-plus click" @click="addNodeService"></i>
      </div>
      <el-table :data="nodeServiceData" stripe border>
        <el-table-column prop="chainName" :label="$t('nodeService.nodeService23')" align="center">
        </el-table-column>
        <el-table-column :label="$t('nodeService.nodeService2')" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.name === 'Official'">{{ $t('nodeService.official') }}</span>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="urls" :label="$t('nodeService.nodeService3')" align="center" min-width="180">
        </el-table-column>
        <el-table-column :label="$t('nodeService.nodeService4')" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.delay === 100000">{{ $t('nodeService.nodeService17') }}</span>
            <span v-else-if="scope.row.delay === 200000">{{ $t('nodeService.nodeService18') }}</span>
            <span v-else-if="scope.row.delay === 300000"><i class="el-icon-loading"></i></span>
            <span v-else>{{ scope.row.delay }} ms</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" :label="$t('nodeService.nodeService5')" align="center">
          <template slot-scope="scope">
            <span @click="editState(scope.$index)">
              <i class="iconfont clicks"
                 :class="scope.row.selection ? 'iconziyuan fCN' : 'iconduankailianjie flan'"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('nodeService.nodeService6')" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.isDelete">
              <label class="click tab_bn" @click="edit(scope.$index)">{{$t('nodeService.nodeService7')}}</label>
              <span class="tab_line">|</span>
              <label class="click tab_bn" @click="removeUrl(scope.$index)">{{$t('nodeService.nodeService8')}}</label>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="$t('nodeService.nodeService9')" width="40%"
               :visible.sync="nodeServiceDialog"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               v-loading="nodeServiceDialogLoading"
               @close="resetForm('nodeServiceForm')"
    >
      <span>{{$t('nodeService.nodeService10')}}</span>

      <div class="bg-white">
        <el-form :model="nodeServiceForm" status-icon :rules="nodeServiceRules" ref="nodeServiceForm">
          <el-form-item :label="$t('nodeService.nodeService2')" prop="name">
            <el-input v-model.number="nodeServiceForm.name" maxlength="20">
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('nodeService.nodeService3')" prop="urls">
            <el-input type="text" autocomplete="off" maxlength="50"
                      v-model="nodeServiceForm.urls"
                      placeholder="http://192.168.1.108:18003"
                      @change="changeUrls">
            </el-input>
          </el-form-item>
          <el-form-item class="btns tl" style="margin-top: 2.5rem">
            <el-button type="success" class="fl" @click="testSubmitForm('nodeServiceForm')">
              {{$t('nodeService.nodeService11')}}
            </el-button>
            <div class="fl ml_50" v-show="testInfo.state !==0">
              <i :class="testInfo.state === 1 ? 'el-icon-circle-check fCN' : 'el-icon-circle-close fred' "></i>&nbsp;
              <span v-show="testInfo.state ===2" class="fred font12">{{testInfo.result}}</span>
            </div>
          </el-form-item>
          <div v-show="testInfo.state ===1">
            <el-form-item>
              <el-checkbox v-model="nodeServiceForm.resource">{{$t('nodeService.nodeService12')}}</el-checkbox>
            </el-form-item>
            <el-form-item class="btns tc">
              <el-button @click="resetForm('nodeServiceForm')">{{$t('password.password2')}}</el-button>
              <el-button type="success" @click="submitForm('nodeServiceForm')">{{$t('password.password3')}}</el-button>
            </el-form-item>
          </div>
          <div class="cb"></div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import {RUN_DEV} from '@/config'

  export default {
    data() {
      let checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.$t('nodeService.nodeService13')));
        } else {
          callback();
        }
      };
      let validateUrls = (rule, value, callback) => {
        let patrn = /(http|https):\/\/([\w.]+\/?)\S*/;
        if (value === '') {
          callback(new Error(this.$t('nodeService.nodeService14')));
        } else if (!patrn.exec(value)) {
          callback(new Error(this.$t('nodeService.nodeService15')));
        } else {
          callback();
        }
      };
      return {
        loading: false,//切换时加载动画
        urlName: RUN_DEV ? 'mainUrlData' : 'TestUrlData',//服务节点名称
        nodeServiceData: [],//节点列表
        nodeServiceLoading: false,//节点列表加载动画
        nodeServiceDialog: false,//服务地址弹框
        nodeServiceDialogLoading: false,//服务地址弹框加载动画
        //添加、编辑表单
        nodeServiceForm: {
          name: '',
          urls: '',
          resource: false
        },
        //表单验证
        nodeServiceRules: {
          name: [
            {validator: checkName, trigger: 'blur'}
          ],
          urls: [
            {validator: validateUrls, trigger: 'blur'}
          ]
        },
        testInfo: {
          state: 0,
          result: {}
        },//测试连接提示信息
        editIndex: 10000, //编辑ID
      };
    },

    created() {
      this.loading = true;
      setTimeout(() => {
        this.nodeServiceData = this.$store.getters.getUrlData;
        let newInfo = sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')) : '';
        if (newInfo) {
          let newUrlsList = ['https://wallet.nuls.io/public', 'https://public1.nuls.io', 'https://public1.nuls.io', 'https://beta.wallet.nuls.io/api', 'http://beta.public1.nuls.io/', 'http://beta.public2.nuls.io/']
          let newUrlData = this.$store.getters.getUrlData;
          if (newInfo.defaultAsset.symbol !== 'NULS') {
            for (let item of newUrlsList) {
              if (newUrlData.findIndex(o => o.urls === item) !== -1) {
                newUrlData.splice(newUrlData.findIndex(o => o.urls === item), 1);
              }
            }
            this.nodeServiceData = newUrlData;
          }
        } else {
          this.nodeServiceData = this.$store.getters.getUrlData;
        }
      }, 500);
    },
    mounted() {
      setTimeout(() => {
        this.getDelay();
        /*this.symbol = sessionStorage.hasOwnProperty('info') ? JSON.parse(sessionStorage.getItem('info')).defaultAsset.symbol : 'NULS';
        document.title = this.symbol + " wallet";*/
      }, 500);
    },
    methods: {

      /**
       * @disc: 连接或断开
       * @params: index
       * @date: 2019-09-05 18:07
       * @author: Wave
       */
      editState(index) {
        if (this.nodeServiceData[index].delay === 200000 || this.nodeServiceData[index].delay === 300000) {
          this.$message({message: this.$t('nodeService.nodeService16'), type: 'error', duration: 1000});
        } else {
          if (!this.nodeServiceData[index].selection) {
            this.loading = true;
            for (let item of this.nodeServiceData) {
              item.selection = false;
            }
            this.nodeServiceData[index].selection = true;
            this.$store.commit('setUrlData', this.nodeServiceData);
            setTimeout(() => {
              this.loading = false;
            }, 2000);
          }
        }
      },

      /**
       * 获取延迟毫秒
       **/
      async getDelay() {
        let newData = [];
        for (let item of this.nodeServiceData) {
          item.delay = 300000;
          newData.push(item);
        }
        this.nodeServiceData = newData;
        this.nodeServiceLoading = false;
        this.$store.commit('setUrlData', this.nodeServiceData);
        this.getDelays();
      },

      async getDelays() {
        let newData = [];
        for (let item of this.nodeServiceData) {
          let startTime = (new Date()).valueOf();
          let endTime = 0;
          const params = {jsonrpc: "2.0", method: "getChainInfo", "params": [], "id": Math.floor(Math.random() * 1000)};
          await axios.post(item.urls, params)
            .then(function (response) {
              //console.log(response);
              if (response.data.hasOwnProperty("result")) {
                endTime = (new Date()).valueOf();
                item.delay = endTime - startTime;
                item.chainId = response.data.result.chainId;
                item.chainName = response.data.result.chainName;
              } else {
                item.delay = 100000;
                item.selection = false;
                item.state = 0;
              }
            })
            .catch(function (error) {
              item.delay = 200000;
              item.selection = false;
              item.state = 0;
              console.log(error);
            });
          newData.push(item);
        }
        this.nodeServiceData = newData;
        this.nodeServiceLoading = false;
        this.loading = false;
        //没有选中的连接默认选中一个
        let selectionUrl = newData.filter(item => item.selection);
        if (selectionUrl.length === 0) {
          let minNumber = Math.min.apply(Math, newData.map((o) => o.delay));
          if (minNumber !== 200000) {
            let minIndex = newData.map((o) => o.delay).findIndex((n) => n === minNumber);
            for (let item in newData) {
              if (Number(item) === minIndex) {
                newData[minIndex].selection = true;
              }
            }
          } else {
            this.$message({message: this.$t('public.checkNetwork'), type: 'error', duration: 3000});
          }
        }
        this.$store.commit('setUrlData', this.nodeServiceData);
      },

      /**
       * 获取链ID
       *@param url
       */
      async getChainInfo(url) {
        const params = {jsonrpc: "2.0", method: "getChainInfo", "params": [], "id": Math.floor(Math.random() * 1000)};
        await axios.post(url, params)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            console.log("getChainInfo:" + error)
          })
      },

      /**
       * 测试连接
       * @param formName
       **/
      async testSubmitForm(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.nodeServiceDialogLoading = true;
            const params = {
              jsonrpc: "2.0",
              method: "getChainInfo",
              "params": [],
              "id": Math.floor(Math.random() * 1000)
            };
            axios.post(this.nodeServiceForm.urls, params)
              .then(function (response) {
                //console.log(response.data);
                if (response.data.hasOwnProperty("result")) {
                  that.testInfo.state = 1;
                  that.testInfo.result = response.data.result;
                  that.nodeServiceDialogLoading = false;
                } else {
                  that.testInfo.state = 200000;
                  that.testInfo.result = response.data;
                  that.nodeServiceDialogLoading = false;
                }
              })
              .catch(function (error) {
                console.log(that.testInfo.success);
                that.testInfo.state = 300000;
                that.testInfo.result = error;
                console.log("getBestBlockHeader:" + error);
                that.nodeServiceDialogLoading = false;
              });
          } else {
            return false;
          }
        });

      },

      /**
       * 添加节点
       **/
      addNodeService() {
        this.nodeServiceDialog = true;
        this.nodeServiceForm.name = '';
        this.nodeServiceForm.urls = '';
      },

      /**
       * 添加节点提交
       * @param formName
       */
      async submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let newNodeInfo = {
              name: this.nodeServiceForm.name,
              urls: this.nodeServiceForm.urls,
              delay: '',
              selection: false,
              isDelete: true,
              chainId: this.testInfo.result.chainId,
              assetId: this.testInfo.result.assetId,
              chainName: this.testInfo.result.chainName,
              decimals: this.testInfo.result.defaultAsset.decimals
            };
            //立即使用
            if (this.nodeServiceForm.resource) {
              for (let itme in this.nodeServiceData) {
                if (this.nodeServiceData[itme].selection) {
                  this.nodeServiceData[itme].selection = false
                }
              }
              newNodeInfo.selection = true;
            }
            if (this.editIndex !== 10000) {
              this.nodeServiceData[this.editIndex] = newNodeInfo;
              this.$store.commit('setUrlData', this.nodeServiceData);
            } else {
              this.nodeServiceData.push(newNodeInfo);
              this.$store.commit('setUrlData', this.nodeServiceData);
            }
            this.getDelay();
            this.nodeServiceDialog = false;
            this.$refs[formName].resetFields();
          } else {
            return false;
          }
        });
      },

      /**
       * Url改变
       **/
      changeUrls(e) {
        console.log(e);
        this.testInfo.state = 0;
        this.testInfo.result = {}
      },

      /**
       * 取消
       * @param formName
       **/
      resetForm(formName) {
        this.nodeServiceDialog = false;
        this.testInfo.state = 0;
        this.testInfo.result = {};
        this.$refs[formName].resetFields();
      },

      /**
       * 编辑连接
       * @param index
       **/
      edit(index) {
        this.editIndex = index;
        this.nodeServiceForm = this.nodeServiceData[index];
        this.nodeServiceDialog = true;
      },

      /**
       * 移除连接
       * @param index
       **/
      removeUrl(index) {
        this.$confirm(this.$t('nodeService.nodeService19') + this.nodeServiceData[index].urls + this.$t('nodeService.nodeService20'), this.$t('nodeService.nodeService21'), {
          confirmButtonText: this.$t('password.password3'),
          cancelButtonText: this.$t('password.password2'),
          type: 'warning'
        }).then(() => {
          this.$message({type: 'success', message: this.$t('nodeService.nodeService22')});
          this.nodeServiceData.splice(index, 1);
          this.getDelays();
          this.$store.commit('setUrlData', this.nodeServiceData);
        }).catch(() => {
        });
      },

      /**
       * 连接跳转
       * @param name
       */
      toUrl(name) {
        //console.log(name)
        this.$router.push({
          name: name
        })
      },
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .node_service {
    .el-dialog__wrapper {
      .el-dialog__body {
        padding-bottom: 50px;
        .bg-white {
          margin: 20px auto 0;
          padding: 20px;
          .btns {
            .el-form-item__content {
              .el-button {
                width: 130px;
                span {
                  color: @Bcolour;
                }
              }
              .el-button--default {
                span {
                  color: @Fcolour;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
