// components/avatar/index.js
const app = getApp()

Component({
  externalClasses: ["avatar-class"],
  properties: {
    src: {
      type: String,
      value: "https://img.yejiefeng.com/poster/default.jpg"
    },
    size: {
      type: Number,
      value: 60
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
    onAvatarTap() {
      if(app.loginData.userId!=this.data.userId) {
        wx.navigateTo({
          url: "/pages/visiting-card/visiting-card?userId=" + this.data.userId
        })
      }
    }
  }
})
