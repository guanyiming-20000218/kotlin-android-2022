// miniprogram/pages/admin_manage_product/admin_manage_product.js
var util = require('../../utils/time.js')
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classify:"全部",
        product:[],
        classify_list:[{'name':'全部'}]
    },
    // 选择分类
    select_classify(e){
        let that = this
        let classify = that.data.classify_list[e.detail.value*1].name
        that.setData({
            classify:classify
        })
        if(classify=='全部'){
            that.get_product()
        }else{
            wx.showLoading({
                title: '搜索中',
            })
            wx.cloud.callFunction({
                name:"product_manage",
                data:{
                    method:"to_classify",
                    classify:classify
                }
            }).then(res=>{
                wx.hideLoading()
                console.log('获取商品',res.result.data)
                that.setData({
                    product:res.result.data
                })
            })
        }
    },
    //搜索商品
    search(e){
        let that = this
        if(e.detail.value){
            wx.showLoading({
                title: '搜索中',
            })
            wx.cloud.callFunction({
                name:"product_manage",
                data:{
                    method:"search",
                    name:e.detail.value
                }
            }).then(res=>{
                wx.hideLoading()
                console.log('获取商品',res.result.data)
                that.setData({
                    product:res.result.data
                })
            })
        }else{
            that.get_product()
        }

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
    // 获取商品
    get_product(){
        let that = this
        wx.showLoading({
            title: '加载中',
        })
        wx.cloud.callFunction({
            name:"product_manage",
            data:{
                method:"get_product"
            }
        }).then(res=>{
            wx.hideLoading()
            console.log('获取商品',res.result.data)
            that.setData({
                product:res.result.data
            })
        })
    },
    // 获取分类
    get_classify(){
        let that = this
        db.collection('classify').get().then(res=>{
            let list = that.data.classify_list.concat(res.data)
            that.setData({
                classify_list:list
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.get_product()
        that.get_classify()
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