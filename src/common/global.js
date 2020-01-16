import Vue from 'vue'

// 返回上一页
Vue.prototype.$goBack = () => {
  router.go(-1)
}

// 判断是否为app环境
Vue.prototype._isApp =
  navigator.userAgent.toLowerCase().indexOf('android_chengshang_app') !== -1 ||
  navigator.userAgent.toLowerCase().indexOf('ios_chengshang_app') !== -1

// 判断是否为微信环境
Vue.prototype._isWx = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'

// 读取商户全局变量配置
Vue.prototype.$getGlobal = key => {
  const str = localStorage.getItem('merchant_global')
  let result = ''
  str && (result = JSON.parse(str)[key])
  return result || ''
}

// 格式化vant时间
Vue.prototype.$timeFormatter = (type, value) => {
  if (type === 'year') {
    return `${value}年`
  } else if (type === 'month') {
    return `${value}月`
  } else if (type === 'day') {
    return `${value}日`
  } else if (type === 'hour') {
    return `${value}时`
  } else if (type === 'minute') {
    return `${value}分`
  }
  return value
}

// app接口调用
Vue.prototype.$invokeAndroid = json => {
  if (navigator.userAgent.toLowerCase().indexOf('android_chengshang_app') !== -1) {
    window.android.invokeMethods(JSON.stringify(json))
  } else if (navigator.userAgent.toLowerCase().indexOf('ios_chengshang_app') !== -1) {
    window.location.replace('ios:' + JSON.stringify(json))
  }
}

// 获取微信code
Vue.prototype.$getWXCode = appId => {
  const url = encodeURIComponent(window.location.href)
  window.location.replace(
    `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
  )
}

// 微信config注入
Vue.prototype.$wxConfig = config => {
  window.wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: config.appId, // 必填，公众号的唯一标识
    timestamp: config.timestamp, // 必填，生成签名的时间戳
    nonceStr: config.nonceStr, // 必填，生成签名的随机串
    signature: config.signature, // 必填，签名
    jsApiList: [
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'scanQRCode',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getLocation',
      'openLocation',
      'getNetworkType',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'translateVoice',
      'requireSoterBiometricAuthentication',
      'getSupportSoter',
      'addCard',
      'chooseCard',
      'openCard',
      'hideAllNonBaseMenuItem',
      'chooseWXPay',
    ], // 必填，需要使用的JS接口列表
  })
}

// 微信支付
Vue.prototype.$wxPay = config => {
  return new Promise((resolve, reject) => {
    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId: config.appId, // 公众号名称，由商户传入
        timeStamp: config.timeStamp, // 时间戳，自1970年以来的秒数
        nonceStr: config.nonceStr, // 随机串
        package: config.package,
        signType: config.signType, // 微信签名方式：
        paySign: config.paySign, // 微信签名
      },
      res => {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          resolve()
          // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        } else {
          reject()
        }
      }
    )
  })
}

// 微信扫码
Vue.prototype.$scanQRCode = () => {
  return new Promise((resolve, reject) => {
    window.wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success(res) {
        const result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
        if (result) {
          resolve(result)
        } else {
          reject()
        }
      },
      fail() {
        reject()
      },
    })
  })
}
