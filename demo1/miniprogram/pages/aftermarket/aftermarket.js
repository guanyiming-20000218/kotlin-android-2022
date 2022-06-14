// miniprogram/pages/aftermarket/aftermarket.js
var util = require('../../utils/time.js');
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title:"售后中",
        order:[],
    },
    // 同意售后
    agree_aftermarket(e){
        let that = this
        let id = e.currentTarget.dataset.id
        wx.showModal({
            title: '提示',
            content: '是否同意售后',
            success (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.showLoading({
                      title: '确认售后中',
                    })
                    db.collection('order').doc(id).update({
                        data:{
                            aftermarket_state:"已售后"
                        }
                    }).then(order=>{
                        console.log(order)
                        wx.hideLoading()
                        that.get_order(that.data.title)
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    //转化时间
    change_time(li){
        if(li.length == 0){
            return li
        }else{
            for(let i=0;i<li.length;i++){
                li[i].time = util.formatTime(li[i].time)
                if(i+1 == li.length){
                    return li
                }
            }
        }
    },
    // 选择订单类型
    select_title(e){
        let that = this
        let name = e.currentTarget.dataset.name
        that.setData({
            title:name
        })
        that.get_order(name)
    },
    // 获取订单
    get_order(type){
        let that = this
        wx.showLoading({
          title: '获取订单中',
        })
        db.collection('order').where({
            type:"售后",
            aftermarket_state:type
        }).orderBy('time','desc').get().then(res=>{
            wx.hideLoading()
            that.setData({
                order:that.change_time(res.data)

            })
            console.log('获取订单成功',res.data)
        }).catch(err=>{
            wx.hideLoading()
            console.log('获取订单成功',err)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.get_order("售后中")
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})