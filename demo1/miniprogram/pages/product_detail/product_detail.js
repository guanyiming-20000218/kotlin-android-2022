// miniprogram/pages/product_detail/product_detail.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        product:{},
        select_num:1
    },
    select_num(e){
        let that = this
        that.setData({
            select_num:e.detail
        })
    },
    get_product(id){
        let that = this
        wx.showLoading({
          title: '加载中',
        })
        db.collection('product').doc(id).get().then(res=>{
            wx.hideLoading()
            console.log('获取商品详情',res)
            that.setData({
                product:res.data
            })
        }).catch(err=>{
            wx.hideLoading()
            wx.showToast({
              title: '获取失败',
              icon:"error"
            })
            console.log('获取商品详情失败',err)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.get_product(options.id)
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