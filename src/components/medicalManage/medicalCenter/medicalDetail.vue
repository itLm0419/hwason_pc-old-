<template>
    <div class="container">
      <el-row>
        <el-col :span="24" class="divPadding">
          <div>
            <el-button type="primary" @click="modifyMedical"
                       v-if="(status == 10 || status == 1 || status == 3) && !isPending1 ">
              修改
            </el-button>
            <el-button type="primary" @click="viewModify"
                       v-show="(status == 10 || status == 1 || status == 3) && isPending1">
              查看修改记录
            </el-button>
          </div>

          <div class="nameCls">{{form.name}}</div>
          <div class="codeCls">医疗服务中心编号：{{form.code}}</div>
          <div style="font-weight: bold;color: black;">医疗服务中心信息</div>
          <div>地区：{{form.region}}</div>
          <div>地址：{{form.address}}</div>
          <div>负责人姓名：{{form.supervisor.name}}</div>
          <div>身份证号码：{{form.supervisor.IDNo}}</div>
          <div>联系电话：{{form.supervisor.tel}}</div>
          <div>合作时间：{{moment(form.cooperationTime.startTime).format('YYYY/MM/DD')}} -
            {{moment(form.cooperationTime.endTime).format('YYYY/MM/DD')}}</div>
          <div>
            协议照片：
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/medicalCenter/uploadProtocolAttach"
              multiple
              :limit="5"
              :file-list="fileList"
              :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              accept="image/png, image/jpg"
              disabled>
            </el-upload>
          </div>
          <div>检查项目价格折扣：{{form.discount}}%</div>

          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

        </el-col>
      </el-row>
    </div>
</template>
<script>
  import moment from 'moment'

	export default {
	  props:[
	    ""
    ],
		data() {
			return {
			  status: '',
        urlSearch: {},
        _id: "",
        form: {
          region: "",
          name: '',
          address: '',
          supervisor: {
            IDNo: "",
            tel: "",
            name: "",
          },
          cooperationTime: {
            startTime: "",
            endTime: ""
          },
          protocolAttach: {
            name: ""
          },
          discount: ''
        },
        fileList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        moment: moment,
        isPending1: false
      }
		},
		methods: {
		  // 初始化页面
      init() {
        let vm = this;

        vm.urlSearch = (new vm.api.UrlSearch());
        vm._id = vm.urlSearch._id;
        vm.status = vm.urlSearch.status;

        vm.isPending();

        vm.queryMedicalDetail();
      },

      // 查询单条记录
      queryMedicalDetail() {
        let vm = this;

        if (!vm._id) {
          vm.api.msgTips(vm, '初始化查询参数错误', 'error');
          return false;
        }

        vm.axios.get('/medicalManager/medicalCenter/medicalCenter/queryMedicalDetail', {params: {_id: vm._id, status: vm.status}})
          .then(function (response) {
            console.log(response);

            let resourceObj = response.data.network[0];

            if (response.data.resultCode === vm.config.success) {

              vm.form = resourceObj;

              // 填充fileList
              let protocolAttach = resourceObj.protocolAttach;

              for (let j=0; j<protocolAttach.length; j++) {
                let url = vm.api.getRootPath() + '/' + protocolAttach[j].path.replace('\\', '/');
                let name = protocolAttach[j].name;
                vm.fileList.push({name: name, url: url});
              }
            }
          }).catch(function (error) {})
      },

      // 预览图片
      handlePictureCardPreview(file) {
        let vm = this;

        vm.dialogImageUrl = file.url;
        vm.dialogVisible = true;
      },

      // 修改医疗服务中心
      modifyMedical() {
        let vm = this;

        vm.$router.push('/medicalCenter/modifyMedical?_id=' + vm._id);
      },

      // 查看修改
      viewModify() {
        let vm = this;

        vm.$router.push('/medicalCenter/viewModifyDetail?_id=' + vm._id + '&status=' + vm.status);
      },

      // 每个服务中心，同时只能有一个在审批中；
      isPending() {
        let vm = this;

        vm.axios.get('/medicalManager/medicalCenter/medicalCenter/isPending', {params: {_id: vm._id}})
          .then(function (response) {
            console.log(response);

            if (response.data.resultCode === vm.config.success) {
              /*vm.api.msgTips(vm, '此服务中心已修改正在审核,请耐心等待。', '');*/
              vm.isPending1 = response.data.isPending;
            }

          }).catch(function (error) {});
      }

    },
    mounted() {
		  let vm = this;

		  vm.init();
    }
	}
</script>
<style scoped>
  .container {
    padding: 20px 20px 20px 20px;
    font-size: 14px;
    background-color: white;
  }

  .nameCls {
    background-color: #F8F8FA;
    height: 100px;
    font-size: 18px;
    font-weight: bold;
    color: #A1A1A1;
    text-align: center;
    line-height: 100px;
  }

  .codeCls {
    font-weight: bold;
    color: #2D99D7 !important;
  }

  .divPadding div {
    padding: 5px 0 5px 0;
    color: #A1A1A1;
    font-weight: bold;
  }
</style>
