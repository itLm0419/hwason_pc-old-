module.exports = {
  tempPath:"temp", //临时文件路径
  filePath : "public", //持久化文件路径
  imgPath : "public/img", //持久化图片路径
  defaultPassword : "123456", //创建账号初始密码
  createSuccess:"恭喜，创建成功，初始密码为",
  success : "00",  //成功状态码
  fail:"01", //失败状态码
  successMsg : "恭喜您，操作成功",
  cachingSuccess:"缓存操作成功",
  failMsg:"操作失败",
  unableDeleteReceiver:"该接收员已接收过样本，不可删除，建议停用",
  parameterVerFail :"参数校验失败",
  loginTips:"用户名或密码不正确",
  noUser:"该对象不存在",
  deleteMsg:"删除成功",
  hasUser:"用户已存在，请不要重复创建",
  hasTel:"该手机号码已被使用",
  roleCode : {
    sampleReceiver:"D01",  // 诊所医生
    doctor:"C01",  // 诊所医生
    admin:"000",   //超级管理员
    custom:"111",  //自定义角色
    sale:"A01",    //销售部
    logistics:"B01"   //物流部
  }
};
module.exports.default = module.exports;
