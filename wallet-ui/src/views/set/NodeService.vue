<template>
    <div class="node_service bg-gray" v-loading="loading"
         element-loading-text="节点切换中....">
        <h3 class="title">节点服务列表</h3>

        <div class="w1200 mt_20" v-loading="nodeServiceLoading">
            <div class="top_ico">
                <i class="el-icon-plus click" @click="addNodeService"></i>
            </div>
            <el-table :data="nodeServiceData" stripe border>
                <el-table-column prop="name" label="名称" align="center">
                </el-table-column>
                <el-table-column prop="urls" label="地址" align="center">
                </el-table-column>
                <el-table-column prop="delay" label="延迟" align="center">
                </el-table-column>
                <el-table-column prop="state" label="状态" align="center">
                    <template slot-scope="scope">
                        <span @click="editState(scope.$index)">
                          <i class="iconfont clicks" :class="scope.row.state === 0 ? 'iconduankailianjie flan' : 'iconziyuan fCN'"></i>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isDelete">
                            <label class="click tab_bn" @click="edit(scope.$index)">修改</label>
                            <span class="tab_line">|</span>
                            <label class="click tab_bn" @click="removeUrl(scope.$index)">移除</label>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="添加节点服务地址" width="40%"
                   :visible.sync="nodeServiceDialog"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   v-loading="nodeServiceDialogLoading"
        >
            <span>您输入的非官方地址可能无法正常使用，因此造成的损失将由您自己承担</span>

            <div class="bg-white">
                <el-form :model="nodeServiceForm" status-icon :rules="nodeServiceRules" ref="nodeServiceForm">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model.number="nodeServiceForm.name" maxlength="20">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="服务地址" prop="urls">
                        <el-input type="text" v-model="nodeServiceForm.urls" autocomplete="off" maxlength="50">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="btns tl">
                        <el-button type="success" class="fl" @click="testSubmitForm('nodeServiceForm')">测试连接</el-button>
                        <div class="fl ml_50" v-show="testInfo">
                            <i :class="testInfo === '0' ? 'el-icon-circle-check fCN' : 'el-icon-circle-close fred' "></i>&nbsp;
                            <span v-show="testInfo !== '0'" class="fred font12">{{testInfo}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="nodeServiceForm.resource">立即使用</el-checkbox>
                    </el-form-item>
                    <el-form-item class="btns tc">
                        <el-button @click="resetForm('nodeServiceForm')">取 消</el-button>
                        <el-button type="success" @click="submitForm('nodeServiceForm')">确 定</el-button>
                    </el-form-item>
                    <div class="cb"></div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      let checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('名称不能为空'));
        } else {
          callback();
        }
      };
      let validateUrls = (rule, value, callback) => {
        let patrn = /(http|https):\/\/([\w.]+\/?)\S*/;
        if (value === '') {
          callback(new Error('地址不能为空'));
        } else if (!patrn.exec(value)) {
          callback(new Error('请输入正确的连接地址'))
        } else {
          callback();
        }
      };
      return {
        loading: false,//切换时加载动画
        defaultData: [
          {name: '官方', urls: 'http://apitn1.nulscan.io/', delay: '10ms', state: 0, isDelete: false},
          {name: '官方', urls: 'http://apitn2.nulscan.io/', delay: '10ms', state: 1, isDelete: false},
        ],
        //节点列表
        nodeServiceData: [],
        nodeServiceLoading: true,//节点列表加载动画
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
        testInfo: '',//测试连接提示信息
        editIndex: 10000, //编辑ID
      };
    },

    created() {
      this.nodeServiceData = localStorage.hasOwnProperty('urlsData') ? JSON.parse(localStorage.getItem('urlsData')) : this.defaultData;
      setInterval(() => {
        this.nodeServiceData = localStorage.hasOwnProperty('urlsData') ? JSON.parse(localStorage.getItem('urlsData')) : this.defaultData;
      }, 500);
    },
    mounted() {
      this.getDelay();
    },
    methods: {

      /**
       * 连接或断开
       **/
      editState(index) {
        if (this.nodeServiceData[index].delay === "连接失败" || this.nodeServiceData[index].delay === "请求超时") {
          this.$message({message: "节点不可以连接", type: 'error', duration: 1000});
        } else {
          if (this.nodeServiceData[index].state === 0) {
            this.loading = true;
            for (let item of this.nodeServiceData) {
              item.state = 0;
            }
            this.nodeServiceData[index].state = 1;
            localStorage.setItem("urls", JSON.stringify(this.nodeServiceData[index]));
            localStorage.setItem("urlsData", JSON.stringify(this.nodeServiceData));
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
          if (item.state === 1) {
            localStorage.setItem("urls", JSON.stringify(item))
          }
          let startTime = (new Date()).valueOf();
          let endTime = 0;
          const params = {jsonrpc: "2.0", method: "getBestBlockHeader", "params": [2], "id": 5898};
          await axios.post(item.urls, params)
            .then(function (response) {
              //console.log(response);
              if (response.data.hasOwnProperty("result")) {
                endTime = (new Date()).valueOf();
                item.delay = endTime - startTime + "ms";
              } else {
                item.delay = "请求超时";
              }
            })
            .catch(function (error) {
              item.delay = "连接失败";
              console.log(item.urls + " getBestBlockHeader:" + error);
            });

          newData.push(item);
        }
        this.nodeServiceData = newData;
        this.nodeServiceLoading = false;
        localStorage.setItem("urlsData", JSON.stringify(this.nodeServiceData));
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
            const params = {jsonrpc: "2.0", method: "getBestBlockHeader", "params": [2], "id": 5898};
            axios.post(this.nodeServiceForm.urls, params)
              .then(function (response) {
                //console.log(response.data);
                if (response.data.hasOwnProperty("result")) {
                  that.testInfo = '0';
                  that.nodeServiceDialogLoading = false;
                } else {
                  that.testInfo = response.data;
                  that.nodeServiceDialogLoading = false;
                }
              })
              .catch(function (error) {
                console.log("getBestBlockHeader:" + error);
                that.testInfo = error;
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
        this.nodeServiceDialog = true
      },

      /**
       * 添加节点提交
       * @param formName
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let newNodeInfo = {
              name: this.nodeServiceForm.name,
              urls: this.nodeServiceForm.urls,
              delay: '',
              state: 0,
              isDelete: true
            };
            //立即使用
            if (this.nodeServiceForm.resource) {
              for (let itme in this.nodeServiceData) {
                if (this.nodeServiceData[itme].state === 1) {
                  this.nodeServiceData[itme].state = 0
                }
              }
              newNodeInfo.state = 1;
            }
            if (this.editIndex !== 10000) {
              this.nodeServiceData[this.editIndex] = newNodeInfo;
              localStorage.setItem("urlsData", JSON.stringify(this.nodeServiceData));
            } else {
              this.nodeServiceData.push(newNodeInfo);
              localStorage.setItem("urlsData", JSON.stringify(this.nodeServiceData));
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
       * 取消
       * @param formName
       **/
      resetForm(formName) {
        this.nodeServiceDialog = false;
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
       *移除连接
       * @param index
       **/
      removeUrl(index) {
        this.$confirm('此操作将移除' + this.nodeServiceData[index].urls + '节点服务是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({type: 'success', message: '移除成功!'});
          this.nodeServiceData.splice(index, 1);
          localStorage.setItem("urlsData", JSON.stringify(this.nodeServiceData));
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
