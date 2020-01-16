import common from "@/api/common";

export default {
  // 登录
  login(context, payload) {
    return new Promise(async (resolve, reject) => {
      const data = await common.login(payload);
      if (data) {
        localStorage.setItem("staff_ticket", data.ticket);
        localStorage.setItem("staff_user", JSON.stringify(data.user));
        resolve();
      } else {
        reject();
      }
    });
  },
  // 获取店员所有权限
  getAllStaffAuthority() {
    return new Promise(async (resolve, reject) => {
      const data = await common.getAllStaffAuthority();
      data ? resolve(data) : reject()
    });
  },
  // 获取当前店员权限
  getStaffAuthority() {
    return new Promise(async (resolve, reject) => {
      const data = await common.getStaffAuthority();
      data ? resolve(data) : reject()
    });
  }
};
