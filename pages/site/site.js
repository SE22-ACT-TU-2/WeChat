const app = getApp()
const interact = require("../../utils/interact.js")
const util = require("../../utils/util.js")

// pages/index/recommend.js
Page({

    /**
     * 页面的初始数据
     */
     data: {
      showPrice : false,
      price : 0,
      field : '',
      year : 0,
      month :0,
      day : 0,
      click : true,
      identity: "请选择预约者身份",
      same : false,
      activeNames: [0],
      arrayid: [
        {
          name:"个人"
        },
        {
          name:"组织者"
        }
      ],
      num : 1,
      list: [
        {
          id : "0",
          area1: "请选择区域",
          area2: "请选择场地",
          date : "请选择日期",
          ground_id : 0,
          begin_time: 0,
          end_time:0,
          arrayarea2:[],
        },
      ],
      area1: "请选择区域",
      arrayarea1: [
        {
          name : "教学楼1",
        },
        {
          name : "教学楼2",
        },
        {
          name : "教学楼3",
        },
        {
          name : "教学楼5",
        },
        {
          name : "羽毛球馆",
        },
        {
          name : "乒乓球馆"
        },
        {
          name : "新主C楼",
        },
        {
          name : "新主D楼",
        },
        {
          name : "新主E楼",
        },
        {
          name : "新主F楼",
        },
        {
          name : "新主G楼",
        },
        {
          name : "主M"
        }
      ],
      arraytime:[
        {
          hour:"08"
        },
        {
          hour:"09"
        },
        {
          hour:10
        },
        {
          hour:11
        },
        {
          hour:12
        },
        {
          hour:13
        },
        {
          hour:14
        },
        {
          hour:15
        },
        {
          hour:16
        },
        {
          hour:17
        },
        {
          hour:18
        },
        {
          hour:19
        },
        {
          hour:20
        },
        {
          hour:21
        },
        {
          hour:22
        },
      ],
      file:"",

      site : "请选择区域",
      needdate : "请选择日期",
      array: [
        {
          id : 1,
          name : "教学楼1",
        },
        {
          id : 2,
          name : "教学楼2",
        },
        {
          id : 6,
          name : "教学楼3"
        },
        {
          id : 5,
          name : "教学楼5"
        },
        {
          id : 3,
          name : "羽毛球馆",
        },
       
        {
          id : 4,
          name : "乒乓球馆"
        },
        {
          id : 7,
          name : "新主C楼"
        },
        {
          id : 8,
          name : "新主D楼"
        },
        {
          id : 9,
          name : "新主E楼"
        },
        {
          id : 10,
          name : "新主F楼"
        },
        {
          id : 11,
          name : "新主G楼"
        },
        {
          id : 12,
          name : "主M"
        }
      ],
      arraydate : [],
      index1:0,
      index2:0,
      result:[
      ],
      longitude: 116,
      latitude : 40,
    },

    onLoad: function (options) {
      this.setData({
        longitude: app.buaaLocation.longitude,
        latitude: app.buaaLocation.latitude,
      })
      /*interact.getArea().then(
        (res) => {
          arrayarea1 : res.data.area
        }
      )*/
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        this.setData({
          year: year,
          month: month,
          day : day
        })
        this.nextday();
        this.nextday();
        this.nextday();
        this.nextday();
        this.nextday();
    },
    
    onShow: function() {
      if (!app.haveRegistered()) {
        app.goCertificate();
      }
      this.resetlist();
      this.setData({
        click: false,
        identity: "请选择预约者身份",
        file : "",
        activeNames : [0],
        same : false,
        site : "请选择区域",
        needdate: "请选择日期",
      })
    },

    nextday: function() {
      let day = this.data.day;
      let month = this.data.month;
      let year = this.data.year;
      if(day==31 &&(month==1||month==3||month==5||month==7||month==8||month==10||month==12)) {
        if(month==12) {
          this.setData({
            year : this.data.year+1,
            month : 1,
            day : 1
          })
        } else {
          this.setData({
            month : this.data.month + 1,
            day : 1,
          })
        }
      } else if (day==30&&(month==2||month==4||month==6||month==9||month==11)) {
        this.setData({
          month : this.data.month + 1,
          day : 1,
        })
      } else if (day==28&&year%4!=0&&month==2) {
        this.setData({
          month : this.data.month + 1,
          day : 1,
        })
      } else if (day==29&&year%4==0&&month==2) {
        this.setData({
          month : this.data.month + 1,
          day : 1,
        })
      } else {
        this.setData({
          day : this.data.day+1,
        })
      }
      var that = this;
      var tmp = that.data.arraydate;
      var toadd = {
          days : that.data.year+"-"+that.data.month+"-"+that.data.day,
        }
      tmp.push(toadd);
      this.setData({
        arraydate : tmp
      })
    },

    bindPickerChange1: function(e) {
      var that = this;
      that.setData({
        site: that.data.array[e.detail.value].name,
       })
    },

    bindPickerChange2: function(e) {
      var that = this;
      that.setData({
        needdate: that.data.arraydate[e.detail.value].days,
       })
    },

    onTap() {
      if(this.data.site=="请选择区域") {
        wx.showToast({
          title: '未选择场地',
          icon: 'none',
        })
        //window.alert("");
      } else if(this.data.needdate=="请选择日期"){
        wx.showToast({
          title: '未选择日期',
          icon: 'none',
        })
      } else {
        interact.searchSite(this.data.needdate,this.data.site,-1).then(//
        (res) => {
          console.log(res);
          this.setData({
            result:res.data,
            click: true
          })
          console.log(this.data.result);
        }
      )
      }
    },

    identity_select: function(e) {
      var that = this;
      that.setData({
        identity: that.data.arrayid[e.detail.value].name,
        same : that.data.arrayid[e.detail.value].name=="组织者"
       })
    },

    area_select: function(e) {
      var that = this;
      const curid = e.target.dataset.current;
      this.data.list[curid].area1 = that.data.arrayarea1[e.detail.value].name;
      this.data.list[curid].area2 = "请选择场地";
      interact.needsite(this.data.list[curid].area1).then(
        (res) => {
          console.log(res)
          this.data.list[curid].arrayarea2 = res.data;
          console.log(curid)
          console.log(this.data.list[curid].arrayarea2)
          this.setData({
            price: res.data[0].price,
            showPrice : true,
            list : this.data.list
          })
        }
      )
      
    },

    site_select: function(e) {
      var that = this;
      const curid = e.target.dataset.current;
      console.log("1") 
      this.data.list[curid].area2 = that.data.list[curid].arrayarea2[e.detail.value].name;
      this.data.list[curid].ground_id = that.data.list[curid].arrayarea2[e.detail.value].id;
      this.setData({
        list : this.data.list
      })
    },

    date_select: function(e) {
      var that = this;
      const curid = e.target.dataset.current;
      this.data.list[curid].date = that.data.arraydate[e.detail.value].days;
      this.setData({
        list : this.data.list
      })
    },

    begintime_select: function(e) {
      var that = this;
      const curid = e.target.dataset.current;
      this.data.list[curid].begin_time = that.data.arraytime[e.detail.value].hour;
      this.setData({
        list : this.data.list
      })
    },

    endtime_select: function(e) {
      var that = this;
      const curid = e.target.dataset.current;
      this.data.list[curid].end_time = that.data.arraytime[e.detail.value].hour;
      this.setData({
        list : this.data.list
      })
    },

    addlist() {
      if(this.data.identity!="组织者") {
        wx.showToast({
          title : "仅限组织者使用",
          icon : "none"
        })
      } else {
        var thatlist = this.data.list;
        var newlist = {
          id : this.data.num,
          area1: "请选择区域",
          area2: "请选择场地",
          date : "请选择日期",
          begin_time: 0,
          end_time:0,
          arrayarea2:[],
        }
        thatlist.push(newlist);
        this.setData({
          activeNames: [this.data.num],
          list : thatlist,
          num : this.data.num + 1
        })
      }
    },

    post() {
      if(this.data.identity=="请选择预约者身份") {
        wx.showToast({
          title : "未选择身份",
          icon : "none"
        })
      } else if (this.data.identity=="个人") {
        var success = -1;
        var item = this.data.list[0];
          if(item.area1=="请选择区域") {
            wx.showToast({
              title: '未选择区域',
              icon : "none"
            })
          } else if(item.area2=="请选择场地") {
            wx.showToast({
              title: '未选择场地',
              icon : "none"
            })
          } else if(item.date=="请选择日期") {
            wx.showToast({
              title: '未选择日期',
              icon : "none"
            })
          } else if(item.begin_time==0) {
            wx.showToast({
              title: '未选择起始时间',
              icon : "none"
            })
          } else if(item.end_time==0) {
            wx.showToast({
              title: '未选择结束时间',
              icon : "none"
            })
          } else if(item.begin_time>=item.end_time) {
            wx.showToast({
              title: '结束时间不能小于起始时间',
              icon : "none"
            })
          } else {
            success = 1
          }
        
        if(success == 1) {
          var mes = {
            user_id : app.loginData.userId,
            identity : this.data.identity=="组织者"?1:0,
            file : this.data.file,
            ground_times : this.data.list
          }
          interact.booksite(mes).then(
            (res) => {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
              })
            }
          )
        }
      } else {
        var success;
        var item;
        for(item of this.data.list) {
          success = 1;
          if(item.area1=="请选择区域") {
            wx.showToast({
              title: '未选择区域',
              icon : "none"
            })
            success  = -1;
            break;
          } else if(item.area2=="请选择场地") {
            wx.showToast({
              title: '未选择场地',
              icon : "none"
            })
            success  = -1;
            break;
          } else if(item.date=="请选择日期") {
            wx.showToast({
              title: '未选择日期',
              icon : "none"
            })
            success  = -1;
            break;
          } else if(item.begin_time==0) {
            wx.showToast({
              title: '未选择起始时间',
              icon : "none"
            })
            success  = -1;
            break;
          } else if(item.end_time==0) {
            wx.showToast({
              title: '未选择结束时间',
              icon : "none"
            })
            success  = -1;
            break;
          } else if(item.begin_time>=item.end_time) {
            wx.showToast({
              title: '结束时间不能小于起始时间',
              icon : "none"
            })
            success  = -1;
            break;
          }
        }
        if(success == 1) {
          var mes = {
            user_id : app.loginData.userId,
            identity : this.data.identity=="组织者"?1:0,
            file : this.data.file,
            ground_times : this.data.list
          }
          interact.booksite(mes).then(
            (res) => {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
              })
            }
          )
        }
      }
    },

    resetlist() {
      this.setData({
        num : 1,
        list: [
          {
            id : "0",
            area1: "请选择区域",
            area2: "请选择场地",
            date : "请选择日期",
            ground_id : 0,
            begin_time: 0,
            end_time:0,
            arrayarea2:[],
          },
        ],
        showPrice:false,
      })
    },

    onChange(event) {
      //console.log(event.detail);
      this.setData({
        activeNames: event.detail,
      });
    },
    changeReason(e){
      this.setData({
        file : e.detail
      })
      console.log(this.data.file)
    }
})