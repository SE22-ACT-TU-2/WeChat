// components/profile-card/index.js
Component({
  properties: {
    user: Object,
    // 默认封面
    defaultPoster: {
      type: String,
      value: "https://img.yejiefeng.com/poster/default.jpg"
    },
    // 默认头像
    defaultAvatar: {
      type: String,
      value: "https://img.yejiefeng.com/avatar/default.jpg"
    },
    // 默认昵称
    defaultNickname: {
      type: String,
      value: "微信用户"
    },
    // 默认个性签名
    defaultSignature: {
      type: String,
      value: "这家伙选择躺平，什么都没有留下"
    },
    // 是否为内容所有者
    isOwner: {
      type: Boolean,
      value: true
    }
  },
  data: {

  },
  methods: {
    /**
     * 点击封面事件
     */
    onPosterTap() {
      this.triggerEvent("posterTap")
    },

    /**
     * 点击头像事件
     */
    onAvatarTap() {
      this.triggerEvent("avatarTap")
    },

    /**
     * 点击关注或取消关注事件
     */
    onFollowTap() {
      this.triggerEvent("followTap")
    },

  }
})
