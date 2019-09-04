<template>
  <div class="contract">
    <h3 class="title">TTakMrubBXi998CZgaYdTy2Nrqwd2ptq<span>(wave)</span><i class="iconfont icon-fuzhi clicks"></i></h3>

    <el-tabs v-model="contractActive" @tab-click="handleClick" class="w1200">
      <el-tab-pane label="我的合约" name="contractFirst">
        <div class="my_contract">
          <el-table :data="tableData" stripe border>
            <el-table-column label="合约地址" align="center" min-width="220">
              <template slot-scope="scope">
                <span class="click" @click="toUrl()"><i class="el-icon-star-off"></i>{{scope.row.accountAddress}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" align="center">
            </el-table-column>
            <el-table-column label="标签" align="center">
              <template slot-scope="scope">
                <span class="click" @click="toUrl()">{{scope.row.tag}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="状态" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template>
                <label class="click tab_bn">移除</label>
              </template>
            </el-table-column>
          </el-table>
          <div class="pages">
            <div class="page-total">显示1-20 共 1000</div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class="fr"
                           :current-page="currentPage4"
                           :page-sizes="[100, 200, 300, 400]"
                           background
                           :page-size="100"
                           layout=" prev, pager, next, jumper"
                           :total="400">
            </el-pagination>
          </div>

        </div>
      </el-tab-pane>
      <el-tab-pane label="查找合约" name="contractSecond">
        查找合约
      </el-tab-pane>
      <el-tab-pane label="部署合约" name="contractThird">
        <div class="deploy">
          <div class="select_resource">
            <el-radio-group v-model="resource">
              <el-radio label="HEX码"></el-radio>
              <el-radio label="Jar包"></el-radio>
            </el-radio-group>
          </div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item label="活动形式" prop="desc" v-show="false">
              <el-input type="textarea" :rows="15" v-model="ruleForm.desc"></el-input>
            </el-form-item>

            <div class="upload_jar bg-white w1200">
              <div class="click upload tc">
                <i class="el-icon-upload2 font30"></i>
                <p class="font18">上传jar包</p>
              </div>
            </div>
            <el-form-item class="form-next">
              <el-button type="success" @click="submitForm('ruleForm')">测试合约</el-button>
              <br/>
              <div class="mb_20"></div>
              <el-button @click="resetForm('ruleForm')">部署合约</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        contractActive: 'contractFirst',
        //我的合约
        tableData: [
          {accountAddress: 'TTakMrubBXi998CZgaYdTy2Nrqwd2ptq', time: '2019-03-08 15:45:58', tag: 'bolang',state:1},
          {accountAddress: 'TTakMrubBXi998CZgaYdTy2Nrqwd2ptq', time: '2019-03-08 15:45:58', tag: 'bolang',state:1},
          {accountAddress: 'TTakMrubBXi998CZgaYdTy2Nrqwd2ptq', time: '2019-03-08 15:45:58', tag: 'bolang',state:1},
          {accountAddress: 'TTakMrubBXi998CZgaYdTy2Nrqwd2ptq', time: '2019-03-08 15:45:58', tag: 'bolang',state:1},
        ],
        currentPage4: 4,

        //选择部署
        resource: '',
        ruleForm: {
          desc: ''
        },
        rules: {}
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },

      /**
       * 连接跳转
       * @param name
       */
      toUrl(name){
        //console.log(name)
        this.$router.push({
          name: name
        })
      },

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },


      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .contract {
    background-color: @Bcolour1;
    .el-tabs {
      margin: 30px auto 0;
    }

    .deploy {
      margin: 20px auto 0;
      .upload_jar{
        min-height: 350px;
        margin: 20px auto 0;
        padding: 50px 0 0 0;
        .upload{
          width: 200px;
          height: 200px;
          margin: 0 auto 0;
          padding: 50px 0 0 0;
          border: @BD1;
          i{

          }
          p{
            line-height: 30px;
          }
        }
      }
    }

  }

</style>
