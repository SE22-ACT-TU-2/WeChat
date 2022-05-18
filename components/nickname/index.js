// components/nickname/index.js
const app = getApp()

Component({
  externalClasses: ["nickname-class"],
  properties: {
    nickname: String,
    size: {
      type: Number,
      value: 28
    },
    userId: {
      type: Number,
      value: -1
    },
    // 是否可链接
    isLink: {
      type: Boolean,
      value: true
    }
  },
  data: {

  },
  methods: {
    /**
     * 跳转名片页或授权页
     */
    onNicknameTap() {
      if(app.loginData.userId!=this.data.userId) {
        wx.navigateTo({
          url: "/pages/visiting-card/visiting-card?userId=" + this.data.userId
        })
      }
    }
  }
})
