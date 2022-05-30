const app = getApp()
const interact = require("../../../utils/interact.js")
const util = require("../../../utils/util.js")

Page({
    data : {
        date : "请选择日期",
        siteid : 0,
        apply_id : 0,
        begin_time: 0,
        end_time: 0,
        year : 0,
        month : 0,
        day : 0,
        arraydate : [],
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
        list : [],//空余场地查询
        list1: [],//前半时间
        list2: [],//后半时间
        file : "",
        showResult: false
    },

    onLoad: function (options) {
        this.setData({
          siteid : options.siteid,
          apply_id : options.apply_id,
        })
        wx.setNavigationBarTitle({
          title: '改期',
        })
        let now = new Date();
          let year = now.getFullYear();
          let month = now.getMonth() + 1;
          let day = now.getDate();
          this.setData({
            year: year,
            month: month,
            day : day
          })
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
          console.log(this.data.siteid)
      },
    
        /*interact.getbook(this.data.siteid).then(
            (res) => {
                //todo
            }
        ) */
        onShow: function() {
          
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

    date_select: function(e) {
      console.log(e);
      this.setData({
        date : this.data.arraydate[e.detail.value].days,
      })
    },
    //查询日期 剩余
    search: function(e) {
      var that = this;
      interact.searchSite(this.data.date,"",this.data.siteid).then(
        (res) => {
          that.setData({
            list : res.data[0].period,
            showResult: true,
          })
          this.setData({
            list1 : this.data.list.slice(0,7),
            list2 : this.data.list.slice(7,14),
          })
          console.log(this.data.list)
        }
      )
    },

    begintime_select:function(e) {
      this.setData({
        begin_time : this.data.arraytime[e.detail.value].hour
      })
    },

    endtime_select:function(e) {
      this.setData({
        end_time : this.data.arraytime[e.detail.value].hour
      })
    },

    book: function() {
      var mes = {
        date : this.data.date,
        apply_id : this.data.apply_id,
        begin_time : this.data.begin_time,
        end_time : this.data.end_time,
        file : this.data.file,
      }
      interact.changeSite(mes).then(
        (res) => {
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          }).then(
            wx.navigateBack({
            delta: 0,
          })
          )
          
        }
      )
    },

    onChange : function(e) {
      this.setData({
        file : e.detail
      })
    }
})