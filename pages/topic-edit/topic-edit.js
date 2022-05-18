// pages/topic-edit/index.js
const app = getApp()
const interact = require("../../utils/interact.js")
const util = require("../../utils/util.js")


Page({
  data: {
    height: 1000,  // 内容区高度
    content: null,
    labals: null,
  },

  onLoad() {
    this.getScrollHeight()
    interact.getalllabels().then(
      (res) => {
        this.setData({
          labals:res.data.labals
        })
      }
    )
  },

  onShow() {
  },

  /**
   * 获取窗口高度
   */
  getScrollHeight() {
    const systemInfo = wx.getSystemInfoSync()
    const windowHeight = systemInfo.windowHeight

    const query = wx.createSelectorQuery()
    query.select(".btn-send").boundingClientRect(rect => {
      const btnHeight = rect.height
      this.setData({
        height: windowHeight - btnHeight
      })
    }).exec()
  },

  /**
   * 设置内容
   */
  setContent(event) {
    console.log(event)
    this.setData({
      content: event.detail.detail.value
    })
  },

  /**
   * 点击发布
   */
  sumitTopic() {
    const content = this.data.content
    console.log(content)
    if (content==null) {
      wx.showToast({
        title: '内容不能为空',
      })
      return
    }

    interact.submittopic(content).then(
      (res) => {
        wx.showToast({
          title:res.data.msg
        })
        return {
          path : "../index/index"
        }
      }
    )
  },

  onTagTap(e) {
    const detail = e.detail
    console.log(e)
//todo
  },
})