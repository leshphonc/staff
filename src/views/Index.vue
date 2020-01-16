<template>
  <div>
    <van-nav-bar @click-left="$goBack" :border="false" fixed left-arrow :title="store" />
    <div class="nav-bar-holder" />
    <van-sticky :offset-top="46">
      <van-grid :border="false">
        <van-grid-item icon="gold-coin-o" text="收银" />
        <van-grid-item icon="scan" text="扫一扫" />
        <van-grid-item icon="chat-o" text="聊天" />
        <van-grid-item icon="setting-o" text="设置" />
      </van-grid>
    </van-sticky>
    <van-skeleton :row="31" :loading="authLoading">
      <div class="white-space" />
      <van-cell-group>
        <van-cell center :title="item.name" is-link v-for="(item, index) in auth" :key="index">
          <van-image slot="icon" :src="require(`@/assets/image/${item.icon}.png`)"></van-image>
        </van-cell>
      </van-cell-group>
    </van-skeleton>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'index',

  mixins: [],

  components: {},

  props: {},

  data() {
    return {
      allAuth: [],
      auth: []
    };
  },

  computed: {
    store() {
      const user = JSON.parse(localStorage.getItem('staff_user'));
      if (user) {
        return user.store_name + ' > ' + user.name;
      } else {
        return '暂未登录';
      }
    },
    authLoading() {
      return this.auth.length === 0;
    }
  },

  watch: {},

  created() {},

  mounted() {
    this.getAllStaffAuthority().then(res => {
      this.getStaffAuthority().then(res2 => {
        // this.auth = res;
        console.log(res);
        console.log(res2);
        const auth = [];
        res2.forEach(item => {
          const result = res.find(all => all.id === item.staff_menu_id);
          if (result) {
            if (result.name.length === 2) {
              result.name = result.name + '订单';
            }
            auth.push(result);
          }
        });
        console.log(auth);
        this.auth = auth;
      });
    });
  },

  destroyed() {},

  methods: {
    ...mapActions(['getAllStaffAuthority', 'getStaffAuthority'])
  }
};
</script>

<style lang="less" scoped>
.van-nav-bar__title {
  font-size: 14px;
}

/deep/.van-grid-item__content {
  background-color: @primary-c;
}

/deep/.van-grid-item__icon {
  font-size: 32px;
  color: #fff;
}

/deep/.van-grid-item__text {
  font-size: 13px;
  color: #fff;
}

.van-cell {
  .van-image {
    margin-right: 16px;
    width: 32px;
    height: 32px;
    line-height: inherit;
  }
}
</style>
