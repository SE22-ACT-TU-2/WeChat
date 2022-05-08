// pages/my/my-org/my-wallet.js
const interact = require("../../../utils/interact.js")
const util = require("../../../utils/util.js")
const App = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      money: "1",
      content: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      // if (!getApp().haveRegistered()) {
      //   wx.navigateBack({
      //     delta: 0,
      //   }).then(
      //     setTimeout(function () {
      //       getApp().goCertificate()
      //     }, 500)
      //   )
        
      //   return
      // }
      /*interact.getAllManageOrgs().then(
        (res) => {
          this.setData({
            orgList : res.data
          })
        }
      )
      */
     interact.getMoney().then(
       (res) => {
        this.setData({
          money: res.data.money
        })
       }
     )
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
  
    contactHandler: function(e) {
      this.setData({
        content : e.detail
      })
    },

    addMoney: function() {
      var that = this
      interact.addMoney(this.data.content).then(
        (res) => {
          wx.showToast({
            title: res.data.msg,
            icon : "none",
          })
          that.onShow()
        }
      )
    }
    
})