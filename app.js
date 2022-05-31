const util = require('utils/util.js')
const interact = require('utils/interact.js')
const login = require('utils/login.js')

// app.js
App({
  version: "1.7.2",
  show : false,
  debug : true,
  second : 60,
  timerRunning : false,
  loginData: {
    token: '',
    email : '',
    userExist : -1,
    userId : -1,
    nickName : '',
    motto : '',
    avatar : '',
    contact : '',
    follow_boya : false

  },
  // allNotifList : [],
  unreadNotifList : [], 
  allMessage : [],
  unreadMessage :[  //后端要发来的未读消息
    {
        "id": 3,
        "content": "hello1",
        "is_read": false,
        "created_time": "2022-05-18 04:24:03",
        "from_user": 1,
        "to_user": 0
    },
    {
        "id": 4,
        "content": "hello2",
        "is_read": false,
        "created_time": "2022-05-18 04:26:04",
        "from_user": 0,
        "to_user": 1
    },
    {
      "id": 4,
      "content": "hello3",
      "is_read": false,
      "created_time": "2022-05-18 04:26:04",
      "from_user": 0,
      "to_user": 2
  },
],
  // readNotifList: [],
  forumList : [
    {
        id : 1,
        title : "社团",
        hasOrgLevel: true,
        picUrl : "/icon/club.png",
    
    },
    {
        id : 2,
        title : "博雅",
        hasOrgLevel: false,
        picUrl : "/icon/boya.png",
    },
    {
        id : 3,
        title : "学生会",
        hasOrgLevel: true,
        picUrl : "/icon/student_union.png",
    },
    {
        id : 4,
        title : "志愿",
        hasOrgLevel: true,
        picUrl : "/icon/volunteer.png",
    },
    {
        id : 5,
        title : "个人",
        hasOrgLevel: false,
        picUrl : "/icon/person_forum.png",
    },

  ],
  socketOpen : false,
  firstShow : true,
  //server : 'https://www.reedsailing.xyz/api/',
  //ws_werver: 'wss://www.reedsailing.xyz/ws/',
  // server : 'http://127.0.0.1:8000/api/',
  // ws_werver: 'ws://127.0.0.1:8000/ws/',
  // ws_werver: 'wss://rs.test/ws/',
  // server : 'http://rs.test/',
  server : 'http://114.116.194.3:8000/api/',
  ws_werver: 'ws://114.116.194.3:8000/ws/',
  

  shareData : {
    title : "一苇以航活动发布社交平台",
    imageUrl: 'https://www.hualigs.cn/image/609625f87beca.jpg',
  },

  buaaLocation : {
    latitude: 39.981891,
    longitude: 116.347256
  },
  havelaunched:false,
  testShow() {
    return new Promise((resolve, reject) => {
      interact.show().then(
        (res) => {
          this.show = res.data.show
          console.log("show: ", this.show)
          resolve(this.show)
        }
      )
    })
  },

  onLaunch() {
    util.debug("launching app... server is " + this.server)
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    this.testShow()
    wx.setStorageSync('logs', logs)
    this.allMessage = wx.getStorageSync('message') || []
    console.log("历史消息")
    console.log(this.allMessage)
    //接收数据
    var that = this;
    wx.login({
      success: e => {
        if (this.loginData) {
          login.login_({
            code: e.code
          }).then(() => {
            this.havelaunched = true;
            console.log("first connect websocket")
            var notification = wx.connectSocket({
              url: that.ws_werver + `link/${that.loginData.userId}/`,
              timeout: 1000,
            })
            notification.onOpen(function(res){
              console.log("notification第一次连接成功")
            })
            notification.onMessage(function(data) {
              var r = JSON.parse(data.data)
              console.log('服务器返回的数据: ', r);
              that.unreadNotifList = r
              if (that.unreadNotifList.length > 0) {
                that.showRedDot()
              }
          })
          }).then(() =>{
             var message = wx.connectSocket({
              url: that.ws_werver + `message/${that.loginData.userId}/`,
              timeout: 1000,
            })
            message.onOpen(function(res){
              console.log("message第一次连接成功")
            })
            this.ws = message
            message.onMessage(function(data) {
              var r = JSON.parse(data.data)
              console.log('服务器返回的数据: ', r);
              if(r.type == "ws_connected"){
              that.unreadMessage = r.messages;
              that.allMessage = that.allMessage.concat(r.messages);
              }
              else if(r.type == "new_message"){
                that.message.push(r.message);
                console.log('收到一条新消息')
              }
              //that.message = that.message.concat(r.messages);
              //wx.setStorageSync('message', that.message)
          })
            message.onClose(function(res){
              wx.setStorageSync('message', that.allMessage);
              console.log("第一次关闭socket")
            })
          }).catch((e) => {
            console.error(funcInfo.funcName + ': 未登录')
            funcInfo.reject({ err: funcInfo.funcName + ': 未登录', errMsg: '未登录' })
          }).finally(function(){
            
          })
        } else {                                                                
          console.error(funcInfo.funcName + ': 未登录')
          funcInfo.reject({ err: funcInfo.funcName + ': 未登录', errMsg: '未登录' })
        }
      }
    })
    
  },

  onShow() {
    // when the app is hiden, the websocket link will disconnect. So we need connect again in Onshow
    var that = this;
    
    if (this.firstShow) {
      //console.log("第一次显示，无需连接websocket")
      this.firstShow = false
    } else if(this.loginData.userId != -1 && !this.socketOpen) {
      console.log("尝试连接websocket")
      var notification = wx.connectSocket({
        url: that.ws_werver + `link/${that.loginData.userId}/`,
        timeout: 1000,
      })
      notification.onOpen(function(res){
        console.log("notification再次连接成功")
      })
      notification.onMessage(function(data) {
        var r = JSON.parse(data.data)
        console.log('服务器返回的数据: ', r.message);
        that.unreadNotifList = r
        if (that.unreadNotifList.length > 0) {
          that.showRedDot()
        }
    })
  
    var message = wx.connectSocket({
      url: that.ws_werver + `message/${that.loginData.userId}/`,
      timeout: 1000,
    })
    message.onOpen(function(res){
      console.log("message再次连接成功")
    })
    message.onMessage(function(data) {
      var r = JSON.parse(data.data)
      console.log('服务器返回的数据: ', r);
      if(r.type == "ws_connected"){
        that.unreadMessage = r.messages;
        that.allMessage = that.allMessage.concat(r.messages);
        }
        else if(r.type == "new_message"){
          that.message.push(r.message);
          console.log('收到一条新消息')
        }
  })
    message.onClose(function(res){
      wx.setStorageSync('message', that.allMessage)
      console.log("再次关闭socket")
    })
  }
  },
  showRedDot() {
    wx.showTabBarRedDot({
      index: 4,
    }).catch(
     (res) => {
       console.log("showRedDot called but not a TabBar page; ignore")
     }
    )
  },

  globalLogin() {
    var that = this;
    return new Promise((resolve, reject) => {
      if (that.loginData.userId == -1) {
        login.newLogin().then(
          (resgit) => {
            that.loopSocket()
            resolve()
          }
        )
      } else {
        resolve()
      }
    })
  },

  loopSocket() {
    var that = this
    return new Promise((resolve, reject) => {
      let notification = wx.connectSocket({
        url: that.ws_werver + `link/${that.loginData.userId}/`,
        timeout: 1000,
      })
      //连接成功
      notification.onSocketOpen(function() {
        console.log("websocket连接服务器成功,notification")
        that.socketOpen = true
        wx.sendSocketMessage({
          data: 'This is a test from the client',
        })
      })

      //监听链接断开事件
      notification.onSocketClose(function(res) {
        console.log("notification连接断开:" + res.reason)
        that.socketOpen = false
      })
    })
  },

  haveRegistered() {
    return this.loginData.email && this.loginData.email != ""
  },

  goCertificate() {
    wx.showModal({
      title : '提示',
      content : '您还没有认证，点击跳转到认证页面',
      success: function (res) {
        if (!res.cancel) {
            wx.navigateTo({
                url: '/pages/my/my-account/my-account',
            })
        }
        else {
        }
      }
    })
  },
  sendMsg(msg){
    console.log(msg)
    //this.message.push(msg)
    this.ws.send({
      data : JSON.stringify(msg)
    })
  },
  sendReadMsg(id){
    console.log("sendReadmessage:" + id)
    this.ws.send({
      data: JSON.stringify({
      "type": "receive_message",
      "user_id": id
    }),
   })
  },
  sendRobotMsg(msg){
    console.log("sendRobotmessage:" + msg)
    this.ws.send({
      data : JSON.stringify(msg)
    })
  },
  onMessage(id){
    
  }
})
