// pages/my/new-act/new-act.js
const interact = require("../../../utils/interact.js")
const util = require("../../../utils/util.js")

const chooseLocation = requirePlugin('chooseLocation')

const key = 'JXUBZ-Z36K4-NUOUO-DKVXN-7GN37-3RBPJ';
const referer = '一苇以航-地图'; //调用插件的app的名称
const category = '生活服务';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        actId : -1,
        actInfo : {},
        my_org:[],
        categories : [],
        index2: 0,
        flag : ['否','是'],
        index3 : 0,
        index1 : 0,
        createNewCategory : false,
        actPicUrl : '',

        presetOrgId : -1,
        presetOrgName : "",
        presetOrgForumId: -1,

        check : false, // 是否需要审核
        name: '',
        description: '',
        numPeople: '',
        newCategory: '',
        locationText: '',
        hasLocation : false,
        // haveLocation : false,

        // start_date: "2021-04-22",
        // start_time: "00:00",
        // end_date: "2021-04-22",
        // end_time: "23:59",
        start_date: null,
        start_time: null,
        end_date: null,
        end_time: null,
        show : false
    },

    inputNameHandler: function (e) {
        this.data.name = e.detail.detail.value
    },

    inputDescriptionHandler: function (e) {
        this.data.description = e.detail.detail.value
    },

    inputNumPeopleHandler: function (e) {
        this.data.numPeople = e.detail.detail.value
    },

    inputNewCategoryHandler: function (e) {
        this.data.newCategory = e.detail.detail.value
    },

    inputLocationTextHandler: function (e) {
        this.data.locationText = e.detail.detail.value
    },

    bindPicker_1_Change: function(e) {
        this.setData({
            index1: e.detail.value
        })
        if (this.data.categories[this.data.index1].create) {
            this.setData({
                createNewCategory: true
            })
        }
        else {
            this.setData({
                createNewCategory: false
            })
        }
    },

    bindPicker_2_Change: function(e) {
        this.setData({
            index2: e.detail.value
        })
    },

    bindPicker_3_Change: function(e) {
        this.setData({
            index3: e.detail.value,
        })

    },

    bindStartDateChange: function (e) {
        this.setData({
            start_date: e.detail.value
        })
    },
    bindStartTimeChange: function (e) {
        this.setData({
            start_time: e.detail.value
        })
    },

    bindEndDateChange: function (e) {
        this.setData({
            end_date: e.detail.value
        })
    },
    bindEndTimeChange: function (e) {
        this.setData({
            end_time: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        var time = util.formatTime(new Date()).split("T")
        this.setData({
            start_date : time[0],
            start_time : time[1].split(":")[0] + ":" + time[1].split(":")[1],
            end_date : time[0],
            end_time : time[1].split(":")[0] + ":" + time[1].split(":")[1]
        })
        if (options.actId) {
            this.setData({
                actId: options.actId,
                hasLocation : true
            })
            interact.getActNumPeople(this.data.actId).then(
            (res) => {
                this.setData({
                    participantNum : res.data.number
                })
            })
        }
        else {
            chooseLocation.setLocation(null);
            if (options.orgId) {
                this.setData({
                    presetOrgId : options.orgId,
                    presetOrgName : options.orgName,
                    presetOrgForumId : options.forumId
                })
            }
        }

        interact.getAllActCategories().then(
            (res) => {
                var r = res.data
                r.push({name : "【新建类别】", create : true})
                var cats = r
                this.setData({
                    categories : cats
                })
                if (cats[this.data.index1].create) {
                    this.setData({
                        createNewCategory: true
                    })
                }
                else {
                    this.setData({
                        createNewCategory: false
                    })
                }

                if (this.data.actId != -1) {
                    wx.setNavigationBarTitle({
                      title: '活动编辑',
                    })
                    interact.getActInfo(this.data.actId).then(
                        (res) => {
                          var r = res.data
                          r.pub_time = util.getTimeMinute(r.pub_time)
                          r.begin_time = util.getTimeMinute(r.begin_time)
                          r.end_time = util.getTimeMinute(r.end_time)
                          this.setData({
                            name: r.name,
                            description: r.description,
                            numPeople: r.contain + "",
                            actInfo: r,
                            locationText : r.location.name,
                            start_date : r.begin_time.split(" ")[0],
                            end_date : r.end_time.split(" ")[0],
                            start_time : r.begin_time.split(" ")[1],
                            end_time : r.end_time.split(" ")[1],
                            index3 : r.review ? 1 : 0,
                            actPicUrl : r.avatar
                        })
                        var newcats = []
                        for (var i = 0; i < cats.length; i++) {
                            if (cats[i].name == this.data.actInfo.type.name) {
                                newcats.unshift(cats[i])
                                // this.setData({
                                //     index1 : i
                                // })
                                // console.log("find", i)
                                // break
                            } else {
                                newcats.push(cats[i])
                            }
                        }
                        this.setData({
                            categories : newcats
                        })
                    })
                }
                else if (this.data.presetOrgId == -1) {
                    interact.getAllManageOrgs().then(
                        (res) => {
                            var dt = [{
                                name : "发布为个人活动",
                            }]
                            for (var i = 0; i < res.data.length; i++) {
                                dt.push(res.data[i].org)
                            }
                            this.setData({
                                my_org : dt
                            })
                        }
                    )
                }

            }
        )
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            show : getApp().show
        })
        // if (!getApp().haveRegistered()) {
        //     wx.navigateBack({
        //       delta: 0,
        //     }).then(
        //         setTimeout(function () {
        //           getApp().goCertificate()
        //         }, 500)
        //       )
        //     return
        // }
        if (chooseLocation.getLocation()) {
            this.setData({
                hasLocation : true
            })
        }
    },

    submitAct: function() {


    },

    submitActWrapper: util.throttle(
    function() {

        console.log("submit act continue")

        var d = this.data
        var start_datetime = d.start_date + "T" + d.start_time
        var end_datetime = d.end_date + "T" + d.end_time
        var start_timesec = Date.parse(start_datetime.replace(new RegExp('-','g'), '/').replace("T"," "))
        var end_timesec = Date.parse(end_datetime.replace(new RegExp('-','g'), '/').replace("T"," "))
        // wx.showModal({
        //   'title' : JSON.stringify(start),
        // })
        // return

        var location = chooseLocation.getLocation();

        if (!location) {
            location = d.actInfo.location
        }
        // console.log("location", location)

        if (location == null) {
            wx.showToast({
                title: '请选择活动地点',
                icon : 'none'
            })
        }
        else if (d.locationText.trim() == "") {
            wx.showToast({
                title: '请输入详细地址',
                icon : 'none'
            })
        }
        else if (d.name.trim() == "") {
            wx.showToast({
              title: '请输入名称',
              icon : 'none'
            })
        }
        else if (d.numPeople.trim() == "") {
            wx.showToast({
              title: '请输入人数',
              icon : 'none'
            })
        }
        else if (!(/(^[1-9]\d*$)/.test(d.numPeople.trim()))) {
            wx.showToast({
              title: '人数请输入正整数',
              icon : 'none'
            })
        }
        else if (parseInt(d.numPeople.trim()) < d.participantNum) {
            wx.showToast({
              title: '人数不能小于已报名人数',
              icon : 'none'
            })
        }
        else if (d.createNewCategory && d.newCategory.trim() == "") {
            wx.showToast({
                title: '请输入新类别',
                icon : 'none'
            })
        }
        else if (start_timesec >= end_timesec) {
            wx.showToast({
                title: '开始时间应早于结束时间',
                icon : 'none'
            })
        }
        // else if (start <= new Date()) {
        //     wx.showToast({
        //         title: '开始时间应晚于当前时间',
        //         icon :  'none'
        //     })
        // }
        else {
            if (d.createNewCategory) {
                interact.createActCategory(d.newCategory).then(
                    (res) => {
                        this.newActWrap(d, start_datetime, end_datetime, res.data.id, location)
                    }
                )
            } 
            else {
                this.newActWrap(d, start_datetime, end_datetime, d.categories[d.index1].id, location)
            }
        }
    }
    , 5000),  // set interval


    newActWrap: function(d, start_datetime, end_datetime, type_id, location) {

        interact.createActAddress(d.locationText, location.longitude, location.latitude, true).then(
         (res0) => {
            interact.createAct({
                id: d.actId,
                name: d.name,
                begin_time: start_datetime,
                end_time: end_datetime,
                contain: d.numPeople.trim(),
                description: d.description,
                review: false,
                owner: getApp().loginData.userId,
                type: type_id,
                org: d.presetOrgId != -1 ? d.presetOrgId : d.index2 == 0 ? null : d.my_org[d.index2].id,
                location: res0.data.id,
                block: d.presetOrgId != -1 ? d.presetOrgForumId : d.index2 == 0 ? 5 : d.my_org[d.index2].block.id
                //创建还是修改，通过下面一行的d.actId == -1来判断
            }, d.actId == -1).then(
                res => {
                    if (this.data.actPicUrl && this.data.actPicUrl != "" && this.data.actPicUrl != this.data.actInfo.avatar) {
                        // change a picture
                        interact.uploadActAvatar(this.data.actId == -1 ? res.data.id : this.data.actId, this.data.actPicUrl).then(
                            (res) => {
                               
                                wx.showToast({
                                    title: this.data.actId == -1 ? '创建成功' : '修改成功',
                                  })
                                setTimeout(function () {
                                    wx.navigateBack({
                                        delta: 0,
                                    })
                                }, 1500)
                            }
                        )
                    }
                    else if (this.data.actId != -1 && this.data.actInfo.avatar && this.data.actPicUrl == '') {
                        interact.removeActAvatar(this.data.actId).then(
                            (res) => {
                                
                                wx.showToast({
                                    title: this.data.actId == -1 ? '创建成功' : '修改成功',
                                })
                                setTimeout(function () {
                                    wx.navigateBack({
                                        delta: 0,
                                    })
                                }, 1500)
                            }
                        )
                    }
                    else {
                        
                        wx.showToast({
                            title: this.data.actId == -1 ? '创建成功' : '修改成功',
                          })
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 0,
                            })
                        }, 1500)
                    }
            })
        })
    },

    toMap : function() {
        wx.navigateTo({
            url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + JSON.stringify(getApp().buaaLocation) + '&category=' + category
        });
        // this.setData({
        //     haveLocation : true
        // })
    },

    uploadPic : function() {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType : ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success (res) {
              that.setData({
                  actPicUrl : res.tempFilePaths[0]
              })
              console.log(that.data.actPicUrl)
            }
        })
    },

    removePic : function() {
        this.setData({
            actPicUrl : ""
        })
    }
})