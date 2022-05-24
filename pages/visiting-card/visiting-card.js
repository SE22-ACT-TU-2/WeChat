// pages/visiting-card/index.js
const app = getApp()
const interact = require("../../utils/interact.js")
const util = require("../../utils/util.js")

Page({
  data: {
    user: null,
    topics: [],
    tabIndex: 0,  // Tabs选中的栏目
    tabsTop: 300, // Tabs距离顶部的高度
    genderText: "Ta", // 性别文本
    tabsFixed: false, // Tabs是否吸顶
    loading: false
  },

  onLoad(options) {
    
    interact.getotheruser(options.userId).then(
      (res) => {
        this.setData({
          user:res.data.user,
          topics:res.data.topics,
        })
      }
    )
    /*this.setData({
      user:{id:2,avatar:app.loginData.avatar,nickName:"yao",motto:"",has_follow:false,follower:1,following:1},
      topics:[{
        id : 1,
        user:{avatar:"",id:1,nickName:"11111"},
        create_time:"now",
        content:"我爱人类",
        click_count:10,
      },
      {
        id : 1,
        user:{avatar:"",id:1,nickName:"11111"},
        create_time:"now",
        content:"我爱人类",
        click_count:10,
      }]
    })*/
  },

  onShow() {
    if (!this.data.user) {
      return
    }
    //this.getTabsTop()
  },

  /**
   * 计算Tabs距离顶部的高度
   */
  getTabsTop() {
    const query = wx.createSelectorQuery()
    query.select("#tabs").boundingClientRect((res) => {
      this.setData({
        tabsTop: res.top
      })
    }).exec()
  },

  /**
   * 点击关注或取消关注事件
   */
  onFollowTap() {
    const user = this.data.user
    var that = this
    if (user.has_follow) {
      wx.showModal({
        content: '您确定要取消关注吗',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            interact.follow(user.id).then(
              (res) => {
                if(res.data.msg!=null) {
                  user.has_follow = !user.has_follow
                  user.follower--
                  that.setData({
                    user:user
                  })
                }
              }
            )
          }
        }
      })
    } else {
      interact.follow(user.id).then(
        (res) => {
          if(res.data.msg!=null) {
            user.has_follow = !user.has_follow
            user.follower++
            that.setData({
              user:user
            })
          }
        }
      )
    }
    
  },

})