const app = getApp()
const interact = require("../../../utils/interact.js")
const util = require("../../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
    data: {
      current: 'tab1',
      success:[],     //分别对应成功预约的、失效的、审核中的
      invalid:[],
      checking:[],

      showIndex: [false, false, false],  //展示页面初始是否显示
    },

   /**
     * 生命周期函数--监听页面加载
     */
    onShow: function() {
      console.log("2131231321313")
      interact.getAllStatusJoinSites().then(  //这个是开始从后端获取所有信息
        (res) => {
          this.setData({
            success : res.data.success,
            invalid : res.data.invalid,
            checking : res.data.checking
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

    changesite: function(e) {  //场地改期按钮
      console.log(e);
      if(e.currentTarget.dataset.can_change==true) {
        wx.navigateTo({
          url: `../site-change/site-change?siteid=${e.currentTarget.dataset.siteid}&apply_id=${e.currentTarget.dataset.apply_id}`,
        })
      } else {
        wx.showToast({
          title: '不可改期',
          icon : "none",
        })
      }      
    },
    change(event){
      console.log(event);
      console.log(event.currentTarget.dataset.id);
      const siteid = event.currentTarget.dataset.siteid;
      const id = event.currentTarget.dataset.id;
      if(event.currentTarget.dataset.can_change==true) {
        wx.navigateTo({
          url: `../site-change/site-change?siteid=${siteid}&apply_id=${id}`,
        })
      } else {
        wx.showToast({
          title: '不可改期',
          icon : "none",
        })
      }      
    },
    

    cancel: function(e) {  //场地取消按钮
      var that = this;
      console.log(e);
      wx.showModal({
        title: '警告',
        content: '您确定要取消吗，这将增加您的违约次数',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            interact.cancelSite(e.currentTarget.dataset.apply_id).then(
              (res) => {
                wx.showToast({
                  title: res.data.msg
                })
                that.onShow()
              }
            )
            console.log("test1");
            console.log("test2");
           
          }
        }
      })
    },
    handleChange ({ detail }) {
      this.setData({
          current: detail.key
      });
    }
})