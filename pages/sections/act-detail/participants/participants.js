// pages/sections/act-detail/participants/participants.js
const util = require("../../../../utils/util.js")
const interact = require("../../../../utils/interact")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actId : -1,
    participantList: [],
    actions : [
      {
        name : '查看',
        color : '#80848f',
        fontsize : '20',
        width : 100,
        // icon : 'delete',
      },
      {
        name : '移除',
        color : '#fff',
        fontsize : '20',
        width : 100,
        icon : 'delete',
        background : '#ed3f14'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      actId : options.actId
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    interact.getActParticipantList(this.data.actId).then(
      (res) => {
        that.setData({
          participantList: res.data
        })
      }
    )

  },

  handleSwipeClick: function(e) {
    let index = e.detail.index
    if (index == 0){
      // util.debug("click left")
      this.goUser(e.currentTarget.dataset.personid)
    }
    else if (index == 1) {
      // util.debug("click right")
      this.deleteParticipant(e)
    }
  },

  goUser: function (userid) {
    wx.navigateTo({
      url: `../../user-info/user-info?userId=${userid}`,
    })
  },

  deleteParticipant: function(e) {
    // util.debug(JSON.stringify(e))
    var that = this
    var dataset = e.currentTarget.dataset
    wx.showModal({
      title : '确认将以下用户从活动中移除？',
      content : "用户： " + dataset.personname,
      success: function(res) {
        if (res.cancel) {

        } else {
          interact.deleteActParticipant(that.data.actId, dataset.personid).then(
            res2 => {
              wx.showToast({
                title: '删除成功',
              })
              that.onShow()
            }
          )
        }
      }
    })
    
  },

})