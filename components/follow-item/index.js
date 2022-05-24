// components/follow-item/index.js
Component({
  properties: {
    user: Object,
    change:Boolean,
    // 是否存在边框
    hasBorder: {
      type: Boolean,
      value: true
    },
    // 是否为已关注
    hasFollow: {
      type: Boolean,
      type: false
    },
    // 是否为主动关注
    isFollowing: {
      type: Boolean,
      type: false
    }
  },
  data: {

  },
  methods: {
    /**
     * 点击标签事件
     */
    onchat() {
      this.triggerEvent("onchat")
    }
  }
})
