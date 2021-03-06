// pages/sections/act-detail/new-comment/new-comment.js
const interact = require("../../../../utils/interact.js")
const util = require('../../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentId : -1,
    actId : -1,
    comment : "",
    rate : 0,
    mustRate : false
  },

  bindTextAreaInput: function(e) {
    // utils.debug(e.detail.value)
    this.data.comment = e.detail.value
  },

  onChange: function(e) {
    // utils.debug(e.detail)
    this.data.rate = e.detail
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      actId : options.actId
    })
    if (options.begin == "true") {
      this.setData({
        mustRate : true
      })
    }
    if (options.commentId) {  // 不要把条件写成 options.commentId != -1，因为可能的取值是undefine,条件成立
      this.setData({
        commentId : options.commentId
      })
      wx.setNavigationBarTitle({
        title: '编辑评论',
      })
    }
  },

  onShow: function () {
    if (this.data.commentId != -1) {
      interact.getCommentById(this.data.commentId).then(
        (res) => {
          this.setData({
            comment : res.data.content,
            rate: res.data.score
          })
        }
      )
    }
  },

  createComment : function () {
    if (this.data.comment.trim() == "") {
      wx.showToast({
        title: '请输入评论内容',
        icon : 'none'
      })
      return
    }
    if (this.data.rate == 0 && this.data.mustRate) {
      wx.showToast({
        title: '请评分',
        icon : 'none'
      })
      return
    }
    // util.debug(this.data.commentId)
    if (this.data.commentId != -1) {
      interact.editComment(this.data.commentId, this.data.rate, this.data.comment).then(res => {
        wx.showToast({
          title: '修改成功',
        })
        setTimeout(function () {
            wx.navigateBack({
                delta: 0,
            })
        }, 1500)
      })
    }
    else {
      interact.submitComment(this.data.actId, this.data.rate, this.data.comment).then(res => {
        wx.showToast({
          title: '评论成功',
        })
        setTimeout(function () {
            wx.navigateBack({
                delta: 0,
            })
        }, 1500)
      })
    }
  }
})