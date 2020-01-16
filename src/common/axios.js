import axios from "axios";
import qs from "qs";
import router from "@/router";
import { Notify, Toast } from "vant";
import errorcode from "@/common/errorcode";

// axios全局请求拦截
axios.interceptors.request.use(
  config => {
    // Toast.loading({
    //   message: '加载中...',
    //   forbidClick: true,
    //   duration: 0,
    // })
    // 转为formdata数据格式
    config.data = qs.stringify({
      ...config.data,
      "Device-Id": "packapp",
      ticket: localStorage.getItem('staff_ticket')
    });
    return config;
  },
  error => {
    Toast.fail(error.message);
  }
);
axios.interceptors.response.use(
  config => {
    // Toast.clear()
    if (config.data.errorCode !== errorcode.SUCCESS) {
      // 兼容上传oss图片错误
      if (config.data.error === errorcode.SUCCESS) {
        return config.data.msg;
      }
      // 是否为登录验证过期
      if (
        config.data.errorCode === errorcode.NOTICKET ||
        config.data.errorCode === errorcode.TIMEOUT
      ) {
        Toast({
          message: "请重新登录",
          icon: "warn-o",
          forbidClick: true,
          duration: 1500,
          onClose: () => {
            localStorage.removeItem("ticket");
            localStorage.removeItem("merchant_global");
            localStorage.removeItem("merchant_user");
            router.replace("/login");
          }
        });
        return false;
      }
      // 是否非法操作
      if (!config.data.errorCode) {
        Toast({
          message: "后台接口未配置，请联系后台管理员",
          duration: 1500
        });
        return false;
      }
      Notify({
        type: "warning",
        message: config.data.errorMsg
      });
    }
    return config.data.result;
  },
  error => {
    Toast.fail(error.message);
  }
);
