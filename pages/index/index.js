const app = getApp()
const interact = require("../../utils/interact.js")
const util = require("../../utils/util.js")

// pages/index/recommend.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        havelogin : false,
        info : "",
        org_list : null,
        act_list : null,
        site_list : null,
        current : "tab1",
        longitude: 116,
        latitude : 40,
        markers : [],
        show : false,
        topics: [
          {
            id : 1,
            user:{avatar:"",id:1,nickName:"11111"},
            create_time:"now",
            content:"我爱人类",
            click_count:10,
          }

        ],
        labelId:0,
        labels:[{id:0,name:"全部"},{id:1,name:"你们"}],
        user_list:[{id:1,avatar:app.loginData.avatar,nickName:"yes"}]
    },

    onLoad: function (options) {
      this.setData({
        longitude: app.buaaLocation.longitude,
        latitude: app.buaaLocation.latitude,
      })
    },

    onShow: function (e) {
      app.testShow().then(
        (rr) => {
          this.setData({
            show : app.show
          })
          if (app.haveRegistered()) {
              this.setData({
                  havelogin : true,
                  info : JSON.stringify(app.loginData.nickName)
              })
          }
          
          getApp().globalLogin().then(
            (res) => {
              this.setData({
                  havelogin : app.haveRegistered(),
                  info : JSON.stringify(app.loginData.nickName),
              })
              if (app.unreadNotifList.length != 0) {
                app.showRedDot()
              }
      
              interact.getRecommend().then(
                (res) => {
                    
                    var lst = []
                    var locations = []
                    var acts = res.data.acts
                    var orgs = res.data.orgs
                    var users = res.data.users
                    this.setData({
                      org_list : orgs.length > 10 ? orgs.slice(0,10) : orgs,
                      user_list:users.length>10?users.slice(0,10):users,
                    })
                    for (var i = 0; i < Math.min(10, acts.length); i++) {
                        var v = acts[i]
                        v.pub_time = v.pub_time.split(".")[0].replace("T", " ")
                        v.begin_time = util.getTimeMinute(v.begin_time)
                        v.end_time = util.getTimeMinute(v.end_time)
                        v.relative_pub_time = util.getRelativeTime(v.pub_time)
                        if (app.show || v.block.id == 2) {
                          lst.push(v)
                          locations.push({
                            id: v.id,
                            latitude: v.location.latitude,
                            longitude: v.location.longitude,
                            name: v.name,
                            width: "30",  
                            height: "60",
                            // callout : {content : v.name}
                          })
                        }
                    }

                    console.log("lst length", lst.length, lst)
                    
                    this.setData({
                      act_list : lst.sort(util.compare('id')).reverse(),
                      markers : locations,
                      show : app.show
                    })
                    console.log("act list", this.data.act_list)
                }
              )
              interact.getalllabels().then(
                (res)=>{
                  this.setData({
                    labels:res.data,
                    labelId:0
                  })
                  console.log(res)
                  this.init(0)
                }
              )
              
              
              

              
            }
        )
      })
    },

    // callLogin: function (e) {
    //   if (!app.haveRegistered()) {
    //     const login = require("../../../utils/login.js")
    //     login.registerInfo().then(
    //         this.setData({
    //             havelogin: true,
    //             info : JSON.stringify(app.loginData.nickName)
    //         })
    //     )
    //   }
    // },

    
    toOrg(e) {
        wx.navigateTo({
          url: `../sections/act-list/act-list?orgId=${e.currentTarget.dataset.orgid}`,
        })
    },

    toActivity(e) {
      wx.navigateTo({
        url: `../sections/act-detail/act-detail?actId=${e.currentTarget.dataset.actid}`,
      })
    },

    onShareAppMessage: function (res) {
      return {
        title: app.shareData.title,
        path: 'pages/index/index',
        imageUrl: app.shareData.imageUrl,
        success: function (res) {
          wx.showToast({
            title: '分享成功',
          })
        }
      }
    },

    handleChange ({ detail }) {
      this.setData({
          current: detail.key
      });
    },

    goMarker (e) {
      wx.navigateTo({
        url: `../sections/act-detail/act-detail?actId=${e.detail.markerId}`,
      })
    },
    //new
    init(e) {
      console.log(e)
      interact.gettopic(e).then(
        (res) => {
          var topics = res.data
          for(var i =0;i<topics.length;i++) {
            var v = topics[i]
            //v.create_time = v.create_time.split(".")[0].replace("T", " ")
            v.create_time=util.getRelativeTime(v.create_time)
          }
          this.setData({
            topics:topics
          })
        }
      )
    },

    onEditTap () {
      console.log("form")
      wx.navigateTo({
        url: `../topic-edit/topic-edit`,
      })
    },

    /**
   * 删除话题
   */
  deleteTopic(e) {
    const topic = this.data.topics[e.currentTarget.dataset.index]
    var that = this
    if (topic.user.id == app.loginData.userId) {
      wx.showModal({
        title: '警告',
        content: '确定要删除该话题？',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            interact.deltopic(topic.id).then(
              (res)=> {
                wx.showToast({
                  icon : "success",
                  title:res.data.msg
                })
                that.onShow()
              }
            )
          }
        }
      })
    } else {
      wx.showToast({
        icon : "none",
        title:"不是您的帖子"
      })
    } 
  },

  /**
   * 跳转话题详情页
   */
  gotoTopicDetail(event) {
    const index = event.currentTarget.dataset.index
    const topics = this.data.topics
    const topic = topics[index]
    let url = "../topic-detail/topic-detail?"

    if (event.type === "commentIconTap") {
      url += "focus=true&"
    }
    topic.click_count++
    this.setData({
      topics: topics
    })
    wx.navigateTo({
      url: url + "topicId=" + topic.id
    })
  },

  /**
   * 点击收藏
   */
  onStarTap(event) {
    const index = event.currentTarget.dataset.index
    const topics = this.data.topics
    const topic = topics[index]
    console.log(topic)
    interact.startopic(topic.id).then(
      (res)=> {
        if(res.data.msg==="收藏成功") {
          topic.star_count++
          topic.has_star=true
        } else {
          topic.star_count--
          topic.has_star=false
        }
        this.setData({
          topics: topics
        })
      }
    )
  },

  /**
   * 标签切换
   */
   onTagTap(event) {
     console.log(event)
    const labelId = event.detail.activeLabelId
    this.setData({
      labelId: labelId
    })
    this.init(labelId)
  },
})