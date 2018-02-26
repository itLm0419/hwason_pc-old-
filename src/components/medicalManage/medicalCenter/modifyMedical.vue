<template>
    <div>
      <div class="subTitle">{{form.name}}</div>

      <div class="content">
        <div class="con1">新合作医疗服务中心信息 <span class="tips">修改重新提交</span></div>

        <div class="mainContent">
          <el-row>
            <el-col :span="12">
              <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="所属地区">
                  <el-cascader :options="cityInfo" v-model="form.selectedCityInfo"></el-cascader>
                </el-form-item>

                <el-form-item label="名称">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="详细地址">
                  <el-input v-model="form.address"></el-input>
                </el-form-item>

                <el-form-item label="负责人">
                  <el-input v-model="form.supervisor.name"></el-input>
                </el-form-item>

                <el-form-item label="负责人身份证号码">
                  <el-input v-model="form.supervisor.IDNo"></el-input>
                </el-form-item>

                <el-form-item label="负责人电话号码">
                  <el-input v-model="form.supervisor.tel"></el-input>
                </el-form-item>

                <el-form-item label="合作时间">
                  <el-date-picker
                    v-model="form.cooperationTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>

                <el-form-item label="协议照片上传">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="/medicalManager/medicalCenter/medicalCenter/cacheProtocolAttach"
                    multiple
                    :file-list="fileList"
                    :auto-upload="false"
                    :data="{_id: id}"
                    :on-preview="handlePictureCardPreview"
                    accept="image/png, image/jpg"
                    :on-remove="removeAttach"
                    >
                    <el-button size="small" type="primary">选取文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-form-item>

                <el-form-item label="检测项目价格折扣">
                  <el-input v-model="form.discount">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>

              </el-form>

              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>

              <div style="float: right;">
                <el-button type="primary" @click="submit('form')">提交</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

    </div>
</template>
<script>
  import  cityInfo from '../../../../static/js/city-data';

	export default {
		data() {
			return {
			  id: '',
        form: {
          selectedCityInfo: [],
          name: '',
          address: '',
          supervisor: {
            IDNo: '',
            tel: '',
            name: '',
          },
          cooperationTime: '',
          protocolAttach: {
            name: ''
          },
          discount: ''

        },
        cityInfo: cityInfo,
        fileList: [],

        dialogImageUrl: '',
        dialogVisible: false
      }
		},
		methods: {
		  // 初始化页面
      init() {
        let vm = this;

        vm.queryMedicalDetail();
      },

      // 查询单条记录
      queryMedicalDetail() {
        let vm = this;

        if (!vm.id) {
          vm.api.msgTips(vm, '初始化查询失败', 'error');
          return false;
        }

        vm.axios.get('/medicalManager/medicalCenter/medicalCenter/queryMedicalDetail', {params: {_id: vm.id}})
          .then(function (response) {
            console.log(response);

            let resourceObj = response.data.network[0];

            if (response.data.resultCode === vm.config.success) {

              vm.form = resourceObj;

              // 转换
              for (let i in resourceObj) {
                if (i === 'region') {
                  vm.form.selectedCityInfo = vm.api.getRegionValue(resourceObj[i], cityInfo);
                }
              }

              // 填充fileList
              let protocolAttach = resourceObj.protocolAttach;

              for (let j=0; j<protocolAttach.length; j++) {
                let path = protocolAttach[j].path || protocolAttach[j].url;
                let url = vm.api.getRootPath() + '/' + path.replace('\\', '/');
                let name = protocolAttach[j].name;
                vm.fileList.push({name: name, url: url});
              }
            }
          }).catch(function (error) {})
      },

      // 提交
      submit (form) {
        let vm = this;

        // 参数校验
        if (!vm.validator()) {
          return false;
        }

        // 转换region
        vm.api.getRegion(vm.form.selectedCityInfo, vm);
        vm.form.region = vm.region;

        vm.form._id = vm.id;

        vm.axios.post('/medicalManager/medicalCenter/medicalCenter/cacheMedicalCenter', {params: vm.form})
          .then(function (response) {
            console.log(response);

            if (response.data.resultCode === vm.config.success) {
              // 图片上传服务器
              vm.$refs.upload.submit();

              vm.api.msgTips(vm, '提交成功，等待审核', 'success');

              setTimeout(() => {
                vm.$router.push("/medicalCenter/medicalCenter");
              },2000)
            }

          }).catch(function (error) {})

      },

      // 提交前，参数校验
      validator() {
        let vm = this;

        if (vm.form.selectedCityInfo.length === 0) {
          vm.api.msgTips(vm, '请选择所属地区', 'error');
          return false;
        }

        if (!vm.form.name) {
          vm.api.msgTips(vm, '请填写医疗服务中心名称', 'error');
          return false;
        }

        if (!vm.form.address) {
          vm.api.msgTips(vm, '请填写详细地址', 'error');
          return false;
        }

        if (!vm.form.supervisor.name) {
          vm.api.msgTips(vm, '请填写负责人名称', 'error');
          return false;
        }

        if (!vm.form.supervisor.IDNo) {
          vm.api.msgTips(vm, '请填写负责人身份证号', 'error');
          return false;
        } else {
          let reg = vm.config.IDNoReg;
          if (!reg.test(vm.form.supervisor.IDNo)) {
            vm.api.msgTips(vm, '请正确填写负责人身份证号', 'error');
            return false;
          }
        }

        if (!vm.form.supervisor.tel) {
          vm.api.msgTips(vm, '请填写负责人手机号码', 'error');
          return false;
        } else {
          let reg = vm.config.telReg;
          if (!reg.test(vm.form.supervisor.tel)) {
            vm.api.msgTips(vm, '请正确填写负责人手机号码', 'error');
            return false;
          }
        }

        if (vm.form.discount) {
          let reg = /(^[1-9][0-9]$|^[0-9]$|^100$)/;
          if (!reg.test(vm.form.discount)) {
            vm.api.msgTips(vm, '折扣必须为0-100的正整数', 'error');
            return false;
          }
        }

        if (vm.form.cooperationTime.length === 0) {
          vm.api.msgTips(vm, '请选择合作时间', 'error');
          return false;
        }

        return true;
      },

      // 预览图片
      handlePictureCardPreview(file) {
        let vm = this;

        vm.dialogImageUrl = file.url;
        vm.dialogVisible = true;
      },

      // 删除图片附件
      removeAttach(file, fileList) {
        console.log(file, fileList);

        let vm = this;

        fileList.forEach((item) => {
          item.url = "temp" + item.url.split("temp")[1];
        });

        vm.form.protocolAttach = fileList.length === 0 ? [] : fileList;
      }
    },
    mounted() {
		  let vm = this;

      vm.id = (new vm.api.UrlSearch())._id;

		  vm.init();
    }
	}
</script>
<style scoped>
  .subTitle {
    font-weight: bold;
    font-size: 18px;
  }

  .content {
    border-top: 3px #2D99D7 solid;
    background-color: white;
    padding: 20px;
  }

  .con1 {
    font-weight: bold;
  }

  .mainContent {
    border-top: 1px solid #CCCCCC;
    padding-top: 20px;
  }

  .tips {
    color: red;
    font-weight: bold;
  }

  .el-upload__tip {
    display: inline-block;
  }
</style>
