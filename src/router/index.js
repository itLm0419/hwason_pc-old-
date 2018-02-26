import Vue from 'vue'
import Router from 'vue-router'
import layout from "../components/layout"
const login = () => import('../components/login');
const registInfo = () => import('../components/network/createRecord/registInfo');
const createSuccess = () => import('../components/network/createRecord/createSuccess');
const userSearch = () => import('../components/network/examination/userSearch');
const examination = () => import('../components/network/examination/examination');
const examinationBill = () => import('../components/network/examination/examinationBill');
const customerDetails = () => import('../components/network/examination/customerDetails');
const createRecord = () => import('../components/network/createRecord/createRecord');
const choicePackage = () => import('../components/network/examination/choicePackage');
const itemsApply = () => import('../components/package/createPackage/itemsApply');
const packageList = () => import('../components/package/packageList/packageList');
const addItem = () => import('../components/package/createPackage/addItem');
const itemDetail = () => import('../components/package/packageList/itemDetail');
const createUser = () => import('../components/userManage/createUser/createUser');

//医疗服务中心管理
const accountApplication = ()=>import('../components/medicalManage/accountApplication/accountApplication');
const medicalCenter = ()=>import('../components/medicalManage/medicalCenter/medicalList');
const medicalInfoContainer = ()=>import('../components/medicalManage/medicalCenter/medicalInfoContainer');
const medicalThreeState = ()=>import('../components/medicalManage/medicalCenter/medicalThreeState');
const createDoctorAccount = ()=>import('../components/medicalManage/medicalCenter/doctor/createDoctorAccount');
const doctorMain = ()=>import('../components/medicalManage/medicalCenter/doctor/doctorMain');
const modifyMedical = ()=>import('../components/medicalManage/medicalCenter/modifyMedical');
const viewModifyDetail = ()=>import('../components/medicalManage/medicalCenter/viewModifyDetail');
const sampleReceiver = ()=>import('../components/medicalManage/sampleReceiver/sampleReceiver');

Vue.use(Router);

export default new Router({
  // mode:"history",
  routes: [
    {
      path:'/',
      name:'login',
      component:login,
    },
    {
      path:'/layout',
      name:'layout',
      component:layout,
      children:[
        //医疗服务中心管理
        {
          path:'/accountApplication/accountApplication',
          name:'accountApplication',
          component:accountApplication,
        },
        {
          path:'/medicalCenter/medicalCenter',
          name:'medicalCenter',
          component:medicalCenter,
        },
        {
          path:'/medicalCenter/medicalInfoContainer',
          name:'medicalInfoContainer',
          component:medicalInfoContainer,
        },
        {
          path:'/medicalCenter/medicalThreeState',
          name:'medicalThreeState',
          component:medicalThreeState,
        },
        {
          path:'/medicalCenter/createDoctorAccount',
          name:'createDoctorAccount',
          component:createDoctorAccount,
        },
        {
          path:'/medicalCenter/doctorMain',
          name:'doctorMain',
          component:doctorMain,
        },
        {
          path:'/medicalCenter/modifyMedical',
          name:'modifyMedical',
          component:modifyMedical,
        },
        {
          path:'/medicalCenter/viewModifyDetail',
          name:'viewModifyDetail',
          component:viewModifyDetail,
        },
        {
          path:'/sampleReceiver/sampleReceiver',
          name:'sampleReceiver',
          component:sampleReceiver,
        },
        //医疗网点
        {
          path:'/createRecord/registInfo',
          name:'registInfo',
          component:registInfo,
        },
        {
          path:'/createRecord/createRecord',
          name:'createRecord',
          component:createRecord,
        },
        {
          path:'/createRecord/createSuccess',
          name:'createSuccess',
          component:createSuccess,
        },
        {
          path:'/examination/userSearch',
          name:'userSearch',
          component:userSearch,
        },
        {
          path:'/examination/examination',
          name:'examination',
          component:examination,
        },
        {
          path:'/examination/customerDetails',
          name:'customerDetails',
          component:customerDetails,
        },
        {
          path:'/examination/choicePackage',
          name:'choicePackage',
          component:choicePackage,
        },
        {
          path:'/examination/examinationBill',
          name:'examinationBill',
          component:examinationBill,
        },
        //产品项目管理
        {
          path:'/createPackage/itemsApply',
          name:'itemsApply',
          component:itemsApply,
        },
        {
          path:'/packageList/packageList',
          name:'packageList',
          component:packageList,
        },
        {
          path:'/createPackage/addItem',
          name:'addItem',
          component:addItem,
        },
        {
          path:'/packageList/itemDetail',
          name:'itemDetail',
          component:itemDetail,
        },{
          path:'/createUser/createUser',
          name:'createUser',
          component:createUser,
        },

      ]
    }
  ]
})
