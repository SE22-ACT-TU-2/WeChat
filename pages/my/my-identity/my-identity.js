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
      imgs:[],
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
    
    bindUpload : function() {
      var that = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success : (res) =>{
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths : res.tempFilePaths,
          imgs:res.tempFilePaths
        })
        console.log(that.data.tempFilePaths)
      }
      })
    },
    
    // 删除图片
    deleteImg: function (e) {
      var that = this
      wx.showModal({
        title: "提示",
        content: "是否删除",
        success: function (res) {
          if (res.confirm) {
            for (var i = 0; i < that.data.imgs.length; i++) {
              if (i == e.currentTarget.dataset.index) that.data.imgs.splice(i, 1)
            }
            that.setData({
              imgs: that.data.imgs
            })
          } else if (res.cancel) {
            console.log("用户点击取消")
          }
        }
      })
    },

    upload : function() {
      const path = this.data.tempFilePaths[0]
      var that = this
      console.log(this.data.content1)
      if(this.data.content1=="") {
        wx.showToast({
          title: '未输入学号',
          icon : "none"
        })
      } else if(this.data.content2=="") {
        wx.showToast({
          title: '未输入姓名',
          icon : "none"
        })
      } else if(path==null) {
        wx.showToast({
          title: '未选择图片',
          icon : "none"
        })
      } else {
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
      
    }
})