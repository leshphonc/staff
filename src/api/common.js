import axios from "axios";

export default {
  // 登录
  login: payload =>
    axios.post("/appapi.php?c=Storestaff&a=login", {
      ...payload
    }),
  // 获取店员所有权限
  getAllStaffAuthority: () =>
    axios.post("/appapi.php?c=Storestaff&a=getStaffMenu"),
  // 获取当前店员权限
  getStaffAuthority: () =>
    axios.post("/appapi.php?c=Storestaff&a=getSelStaffRule"),
};
