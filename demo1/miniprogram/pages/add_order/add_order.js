// miniprogram/pages/add_order/add_order.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address:{},
        goods:[],
        remarks:"",
        all_price:0
    },
    //下单事件
    add_order(){
        let that = this
        if(that.data.address=="" || that.data.goods.length == 0){
            wx.showToast({
              title: '请填写信息',
              icon:"none"
            })
        }else{
            wx.showLoading({
              title: '下单中',
            })

            db.collection('order').add({
                data:{
                    address:that.data.address,
                    goods:that.data.goods,
                    remarks:that.data.remarks,
                    all_price:that.data.all_price,
                    type:"已付款",
                    time:db.serverDate()
                }
            }).then(res=>{
                wx.hideLoading()
                wx.showToast({
                  title: '下单成功',
                })
                wx.removeStorage({
                  key: 'goods',
                  success(res){
                    wx.navigateBack({
                        delta: 1,
                    })
                  }
                })
                console.log('下单成功',res)
            }).catch(err=>{
                wx.showLoading({
                    title: '下单失败',
                    icon:"error"
                })
                console.log('下单失败',err)
            })
        }
    },
    // 选择商品数量
    select_product_num(e){
        let that=this
        let index = e.currentTarget.dataset.index
        that.setData({
            ['goods['+index+'].product_num']:e.detail
        })
        //重新计算
        that.get_all_price(that.data.goods)
    },
    // 计算总价
    get_all_price(pro){
        let that=this
        let all_price=0
        let product_list=pro
        for(let i=0;i<product_list.length;i++){
            all_price = all_price + (product_list[i].product_num*product_list[i].product_price)
            if(i+1==product_list.length){
                that.setData({
                    all_price:parseFloat((all_price).toFixed(2))
                })
            }
        }
    },
    // 备注
    input_remarks(e){
        let that = this
        that.setData({
            remarks:e.detail.value
        })
    },
    // 我的地址
    get_address(){
        let that = this
        wx.chooseAddress({
            success (res) {
              console.log('我的地址',res)
              that.setData({
                  address:res
              })
            }
          })
    },
    //获取商品
    get_goods(){
        let that = this
        wx.getStorage({
            key: 'goods',
            success (res) {
              console.log('获取到的商品',res.data)
              that.setData({
                  goods:res.data
              })
              that.get_all_price(res.data)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.get_goods()
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