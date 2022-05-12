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
            user:{avatar:"",id:1,nickName:"yao"},
            create_time:"now",
            content:"我爱人类",
            click_count:10,
          }

        ],
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
                    
                    this.setData({
                      org_list : orgs.length > 10 ? orgs.slice(0,10) : orgs,
                      site_list : sites.length > 10 ? sites.slice(0,10): sites,
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
              /*interact.gettopic().then(
                (res) => {
                  topics : res.data.topics
                }
              )*/
              

              
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

    onEditTap () {
      wx.navigateTo({
        url: `../topic-edit/index`,
      })
    },

    /**
   * 删除话题
   */
  deleteTopic(e) {
    const topic = this.data.topics[e.currentTarget.dataset.index]
    var that = this
    if (topic.user.id == app.loginData.userId) {
        dialog.linShow({
        type: "confirm",
        title: "提示",
        content: "确定要删除该话题？",
        success: (res) => {
          if (res.confirm) {
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
    } 
  },

  /**
   * 跳转话题详情页
   */
  gotoTopicDetail(event) {
    const index = event.currentTarget.dataset.index
    const topics = this.data.topics
    const topic = topics[index]
    let url = "../topic-detail/index?"

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

    interact.startopic(topic.id).then(
      (res)=> {
        if(res.code===201) {
          const hasStar = topic.has_star
          topic.has_star = !topic.has_star
          if (hasStar) {
            topic.star_count--
          } else {
            topic.star_count++
          }
          this.setData({
            topics: topics
          })
        }
      }
    )
  },

  
})