// pages/my/my-org/my-wallet.js
const interact = require("../../../utils/interact.js")
const util = require("../../../utils/util.js")
const App = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      identity: "",
      content1: "",
      content2: "",
      tempFilePaths:[],
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
        interact.searchidentity().then(
          (res) => {
            console.log(res);
            this.setData({
              identity: res.data.msg,
            })
          }
        )
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
//
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
  
    contactHandler1: function(e) {
      console.log(e)
      this.setData({
        content1 : e.detail
      })
    },
    contactHandler2: function(e) {
      this.setData({
        content2 : e.detail
      })
    },
    
    getPhoto : function() {
      var that = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success : (res) =>{
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths : res.tempFilePaths
        })
        console.log(that.data.tempFilePaths)
      }
      })
    },

    upload : function() {
      const path = this.data.tempFilePaths[0]
      var that = this
      console.log(this.data.content1)
      wx.uploadFile({
        // filePath: path,
        // name: 'picture',
        // url: App.server+"users/verify/",
        // header: {
        //   "Content-Type": "multipart/form-data",
        //   'accept': 'application/json',
        //   },
        url:App.server+"users/verify/",
        filePath: path,
        name: 'picture',
        method :'POST',
        header:{
          'content-type' : 'multipart/form-data',
          'Authorization': 'Bearer ' + getApp().loginData.token
        },
        /////
        formData:{
          user_id : App.loginData.userId,
          student_id : that.data.content1,
          name : that.data.content2,
        },
        success(res) {
          var data = JSON.parse(res.data);
          console.log(res)
          wx.showToast({
            title : data.msg,
            icon : "none"
          })
        }
      })
    }
})