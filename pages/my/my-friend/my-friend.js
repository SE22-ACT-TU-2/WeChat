const app = getApp()
const interact = require("../../../utils/interact.js")
const util = require("../../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
    data: {
      current: 'tab1',
      followers:[{user:{id:1,avatar:"",nickName:11111}}],     //关注我的
      followings:[],    //我关注的
      change:[{user:{id:1,avatar:"",nickName:11111}},{user:{id:1,avatar:"",nickName:11111}}],              //互关的

      showIndex: [false, false, false],  //展示页面初始是否显示
    },

   /**
     * 生命周期函数--监听页面加载
     */
    onShow: function() {
      console.log("2131231321313")
      interact.getAllfriend(app.loginData.userId).then(  //这个是开始从后端获取所有信息
        (res) => {
          this.setData({
            followers : res.data.followed,
            followings : res.data.follow,
            change : res.data.friend
          })
          console.log(res);
        }
      )
    },

    panel: function (e) {   //这个函数时页面点击一下就展示或者不展示
      var index = e.currentTarget.dataset.index
      if (!this.data.showIndex[index]) {
        //此前未show
        var newIndex = this.data.showIndex
        newIndex[index] = true
        this.setData({
          showIndex: newIndex
        })
      } else {
        var newIndex = this.data.showIndex
        newIndex[index] = false
        this.setData({
          showIndex: newIndex
        })
      }
    },

    chat(e) {
      console.log(e)
      const user = e.currentTarget.dataset.user
      console.log(user)
      wx.navigateTo({
        url: '../message/message?id='+user.id+'&nickName='+user.nickName+'&avatar='+user.avatar,
      })
    },

    handleChange ({ detail }) {
      this.setData({
          current: detail.key
      });
    }
})