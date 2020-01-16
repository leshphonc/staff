<template>
  <div class="container">
    <div class="group">
      <div class="title">
        <div class="img-box"><img :src="logo" alt /></div>
        <div>店员中心</div>
      </div>
      <van-field
        :border="false"
        class="input"
        label-align="center"
        label-width="80"
        left-icon="user-o"
        placeholder="请输入账号"
        v-model="account"
      ></van-field>
      <van-field
        :border="false"
        class="input"
        label-align="center"
        label-width="80"
        left-icon="closed-eye"
        placeholder="请输入密码"
        type="password"
        v-model="pwd"
      ></van-field>
      <van-button @click="_login" class="button" round type="primary"
        >登录</van-button
      >
    </div>
    <!-- <img class="blur" src="@/assets/image/login_bg.jpeg" /> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "login",

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      account: "",
      pwd: "",
      logo: ""
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    let logo = "";
    if (window.location.href.indexOf("9youke") > -1) {
      logo = require("@/assets/image/yk_logo.jpg");
    } else {
      logo = require("@/assets/image/xyzg_logo.png");
    }
    this.logo = logo;
    // 判断是否已经登录
    const ticket = localStorage.getItem("ticket");
    if (ticket) {
      this.$router.push("/");
      this.$toast({
        duration: 800, // 持续展示 toast
        forbidClick: true,
        message: "欢迎回来"
      });
    }
  },

  destroyed() {},

  methods: {
    ...mapActions(["login", "getAlias", "getPlatFormInfo", "getWxConfig"]),
    ...mapActions("basicInformation", ["readMerchantInfo"]),
    _login() {
      this.login({ account: this.account, passwd: this.pwd }).then(() => {
        this.$toast({
          icon: "success",
          message: "登录成功",
          duration: 1000,
          onClose: () => {
            this.$router.replace("/", () => {
              // this._injection();
            });
          }
        });
      });
    },
    // 注入变量到vue全局
    _injection() {
      // 获取别名
      this.getAlias().then(async res => {
        // 创建注入全局的对象
        const obj = {};
        // 兑换币，积分别名获取
        const dhb = res.find(item => item.name === "dhb_name");
        dhb && (obj.dhb_alias = dhb.value);
        const score = res.find(item => item.name === "score_name");
        score && (obj.score_alias = score.value);

        // 获取是否开启兑换币，积分，三级分佣（条件1）
        const setting = await this._readMerchantInfo();
        // 获取是否开启平安支付，三级分佣（条件2）
        const authority = await this.getPlatFormInfo();
        const pingan = authority.find(item => item.name === "pay_pingan_open");
        const spread = authority.find(item => item.name === "open_user_spread");

        pingan && (obj.pingan = pingan.value);
        spread && (obj.open_spread = spread.value);
        Object.assign(obj, setting);

        // 将处理过的obj注入全局localStorage
        localStorage.setItem("merchant_global", JSON.stringify(obj));

        // 判断是否微信环境，注入sdk
        if (this._isWx) {
          this.getWxConfig().then(config => {
            // 保存appid
            sessionStorage.setItem("merchant_wx_appid", config.appId);
            // 注入sdk
            this.$wxConfig(config);
          });
        }
      });
    },
    // 获取商家配置信息
    async _readMerchantInfo() {
      let dhb_open = "0",
        score_open = "0",
        show_three = "";
      await this.readMerchantInfo().then(res => {
        dhb_open = res.now_merchant.dhb_open;
        score_open = res.now_merchant.score_open;
        show_three = res.now_merchant.show_three;
      });
      return { dhb_open, score_open, show_three };
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .blur {
    position: absolute;
    width: 108vw;
    height: 108vh;
    // filter: blur(10px);
    z-index: -10;
    top: -15px;
    left: -15px;
  }

  .group {
    margin-top: 60px;
    text-align: center;
    .title {
      text-align: center;
      font-size: 20px;
      color: rgb(102, 102, 102);
      margin-bottom: 60px;
      .img-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 28vw;
        box-shadow: 0 0 8px 1px #ccc;
        border: 1px solid #ccc;
        box-sizing: border-box;
        width: 31vw;
        height: 31vw;
        margin: 0 auto 15px;
        img {
          width: 27vw;
          height: 27vw;
          border-radius: 27vw;
        }
      }
    }

    .input {
      width: 300px;
      margin: 10px auto;
      background: transparent;
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
      padding-left: 20px;
      /deep/.van-field__left-icon {
        color: @font-gray-c;
      }
      /deep/.van-field__control {
        color: @font-gray-c;
        padding-left: 20px;
      }
    }

    .button {
      width: 280px;
      margin-top: 70px;
    }
  }
}
</style>
