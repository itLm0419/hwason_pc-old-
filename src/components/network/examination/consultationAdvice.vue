<template>
    <div>
      <div style="color: #69B5E2;font-size: 18px;font-weight: bold;">问诊建议</div>

      <el-form class="divNoMarginLeft labelNoPaddingLeft" :model="adviceForm" status-icon :rules="adviceFormRules" ref="adviceForm"
               label-width="100px">
        <el-form-item label="病情" prop="illness" class="fontCls">
          <el-input type="textarea" :rows="5" v-model="adviceForm.illness" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="医生建议" prop="advice" class="fontCls">
          <el-input type="textarea" :rows="5" v-model="adviceForm.advice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用药处方" prop="prescription" class="fontCls">
          <el-input type="textarea" :rows="5" v-model.number="adviceForm.prescription"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('adviceForm')" style="background-color: #409EFE;color: white;"
                     icon="el-icon-refresh">重置
          </el-button>
          <el-button type="primary" @click="saveHistoryRecord('adviceForm')" style="background-color: #67C239;">提交
          </el-button>
        </el-form-item>
      </el-form>

    </div>
</template>

<script>
	export default {
    name:"consultationAdvice",
    props: [
      'userId',
      "vueNew"
    ],
		data() {
      return {
        adviceForm: {
          illness: '',
          advice: '',
          prescription: ''
        },
        adviceFormRules: {
          illness: [
            { required: true, message: '病情不能为空！'}
          ],
          advice: [
            { required: true, message: '医生建议不能为空！'}
          ],
          prescription: [
            { required: true, message: '用药处方不能为空！'}
          ]
        }
      }
		},
		methods: {
		  // 保存问诊历史记录
		  saveHistoryRecord(formName) {
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              _id: vm.userId,
              illness: vm.adviceForm.illness,
              advice: vm.adviceForm.advice,
              prescription: vm.adviceForm.prescription
            };

            this.$confirm('该文件一旦提交不能修改, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              vm.axios.post('/network/examination/historyRecord/saveHistoryRecord', {params: params})
                .then(function (response) {
                  console.log(response);

                  // 提示成功信息
                  vm.openMsg("success", "提交成功");

                  // 清空form表单数据
                  vm.resetForm("adviceForm");

                  // 刷新左侧病情历史记录
                  vm.vueNew.$emit('refresh');
                })
                .catch(function (err) {
                  console.log(err);


                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
            });
          } else {
            console.log("validate fail!");

            vm.openMsg("error", "您好，请填写相关信息！");

            return false;
          }
        });
      },

      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      // 操作结束，提示框
      openMsg(type, msg) {
        this.$message({
          message: msg,
          type: type
        });
      }
    },
    mounted() {
      let vm = this;
    }
	}
</script>

<style scoped>
.divNoMarginLeft div {
  margin-left: 0 !important;
}

.labelNoPaddingLeft label {
  padding-left: 0 !important;
  width: auto !important;
}

.fontCls {
  font-size:18px;
  font-weight:bold;
}
</style>
