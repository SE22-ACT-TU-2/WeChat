// pages/topic-detail/index.js
//import { Paging } from "../../utils/paging"
const app = getApp()
const interact = require("../../utils/interact.js")
const util = require("../../utils/util.js")

Page({
  data: {
    stars: [],
    comments: [],
    topic: null,
    comment: null,
    commentId: null,
    commentTemplateId: null, // 评论订阅消息ID
    commentPaging: null,  // 评论分页器
    focus: false, // 获取焦点
    isAdmin: false, // 是否为平台管理员
    hasMore: false, // 是否还有更多数据
    height: 1000, // 内容区高度
    toIndex: 0, // 滚动至元素坐标
    userId: -1,
    placeholder: "说说你的想法"
  },

  onLoad(options) {
    const focus = options.focus
    // 获取焦点拉起键盘
    if (focus) {
      this.setData({
        focus: true
      })
    }
    interact.gettopicdetail(options.topicId).then(
      (res)=> {
        var comments = res.data.comments
        for (var i = 0;i<comments.length;i++) {
          var v = comments[i]
          //v.create_time = v.create_time.split(".")[0].replace("T", " ")
          v.create_time=util.getRelativeTime(v.create_time)
        }
        var topic = res.data.topic
        //topic.create_time = topic.create_time.split(".")[0].replace("T", " ")
        topic.create_time=util.getRelativeTime(topic.create_time)
        this.setData({
          comments:comments,
          userId:app.loginData.userId,
          topic:topic,
          stars:res.data.stars
        })
        console.log(this.data.comments)
      }
    )
    /*this.setData({
      topic:{
        id : 1,
        user:{avatar:"",id:1,nickName:"11111"},
        create_time:"now",
        content:"我爱人类",
        click_count:10,
      },
      comments:[{user:{avatar:"",id:1,nickName:"11111"},content:"hao",id:1}],
      userId:2,
      stars:[{user:{avatar:"",id:1,nickName:"11111"}}]
    })*/
  },

  onShow() {
    interact.gettopicdetail(this.data.topic.id).then(
      (res)=> {
        var comments = res.data.comments
        for (var i = 0;i<comments.length;i++) {
          var v = comments[i]
          //v.create_time = v.create_time.split(".")[0].replace("T", " ")
          v.create_time=util.getRelativeTime(v.create_time)
        }
        var topic = res.data.topic
        //topic.create_time = topic.create_time.split(".")[0].replace("T", " ")
        topic.create_time=util.getRelativeTime(topic.create_time)
        this.setData({
          comments:comments,
          topic:topic,
          stars:res.data.stars
        })
        console.log(this.data.comments)
      }
    )
  },

  /**
   * 点击收藏
   */
   onStarTap() {
    const topic = this.data.topic
    interact.startopic(this.data.topic.id).then(
      (res)=> {
        if(res.data.msg==="收藏成功") {
          topic.star_count++
          topic.has_star=true
        } else {
          topic.star_count--
          topic.has_star=false
        }
        this.setData({
          topic: topic
        })
      }
    )
  },

  deleteTopic() {
    const topic = this.data.topic
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
   * 点击评论图标
   */
  onCommentIconTap() {
    this.setData({
      focus: true,
      placeholder: "说说你的想法"
    })
  },

  /**
   * 设置评论
   */
  setComment(event) {
    this.setData({
      comment: event.detail.value
    })
  },

  /**
   * 发送评论
   */
  onCommntBtnTap() {
    const content = this.data.comment
    var that = this
    if(content==null) {
      wx.showToast({
        title: '评论内容不能为空',
      })
    } else {
      interact.sendcomment(content,this.data.topic.id).then(
        (res)=> {
          if(res.data.msg=="评论成功") {
            that.onShow()
          }
        }
      )
    }
  },

  /**
   * 删除评论
   */
  deleteComment(event) {
    const commentId = event.detail.commentId
    var that = this
    console.log(event)
    wx.showModal({
      title: '警告',
      content: '确定要删除该评论？',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          interact.delcomment(commentId).then(
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
  },
})