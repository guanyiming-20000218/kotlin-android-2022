// miniprogram/pages/product_detail/product_detail.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        product:{},
        select_num:1,
        select_specs:""
    },
    //选择数量
    select_num(e){
        let that = this
        that.setData({
            select_num:e.detail
        })
    },
    // 选择规格
    select_specs(e){
        let that = this
        let specs = e.currentTarget.dataset.specs
        that.setData({
            select_specs:specs
        })
    },
    // 添加到购物车
    add_shopping_car(){
        let that = this
        let product = that.data.product
        if(that.data.select_specs==''){
            wx.showToast({
              title: '请选择规格',
              icon:"none"
            })
        }else{
            wx.showLoading({
                title: '添加中',
            })
            db.collection('shopping_car').where({
                product_id:product._id,
                product_specs:that.data.select_specs,
            }).get().then(res=>{
                if(res.data.length>0){
                    wx.hideLoading()
                    wx.showToast({
                      title: '购物车已经有了',
                      icon:"none"
                    })
                }else{
                    db.collection('shopping_car').add({
                        data:{
                            product_id:product._id,
                            product_img:product.img[0],
                            product_name:product.name,
                            product_price:product.price,
                            product_specs:that.data.select_specs,
                            product_num:that.data.select_num,
                            time:db.serverDate()
                        }
                    }).then(res=>{
                        wx.hideLoading()
                        wx.showToast({
                            title: '添加成功',
                        })
                        console.log('添加到购物车',res)
                    })
                }
            })
        }

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

    // 跳转至购物车
    to_shopping_car(){
        wx.showLoading({
          title: '正在跳转至购物车',
        }),

        wx.switchTab({
          url: '../shopping_car/shopping_car',
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