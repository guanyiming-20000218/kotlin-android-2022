// miniprogram/pages/index/index.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        swaper : [],
        pro_list : [],
        search_list: [],
        search_case:false
    },
    // 搜索列表关闭
    search_case_close(){
        let that = this
        that.setData({
            search_case:false
        })
    },
    // 搜索列表展示
    search_case_show(){
        let that = this
        that.setData({
            search_case:true
        })
    },
    // 搜索事件，注意名称和bind:search对应
    onSearch(e){
        let that = this
        if(e.detail){
            wx.showLoading({
                title: '搜索中',
            })
            db.collection('product').where({
                name: db.RegExp({
                    regexp: e.detail,
                    options: 'i',
                })
            }).get().then(res=>{
                wx.hideLoading()
                console.log(res)
                that.setData({
                    search_list:res.data
                })
            })
        }else{
            that.setData({
                search_list:[],
            })
        }
    },
    onCancel(e){
        let that = this
        console.log(e.detail)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        db.collection('swaper').get({
            success:res=>{
                console.log("轮播图获取成功",res)
                that.setData({
                    swaper:res.data
                })
            },fail:err=>{
                console.log('轮播图失败',err)
            }
        })
        db.collection('product').get({
            success:res=>{
                console.log("商品获取成功",res)
                that.setData({
                    pro_list:res.data
                })
            },fail:err=>{
                console.log('商品获取失败',err)
            }
        })
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

    },
    onChange(event) {
        this.setData({ active: event.detail });
    },
})