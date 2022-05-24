// miniprogram/pages/shopping_car/shopping_car.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        product_list:[],
        all_price:0,
        result:[],
        is_all:false
    },
    // 提交订单
    submit_order(){
        let that = this
        if(that.data.result.length != 0){
            wx.showLoading({
              title: '提交中',
            })
            let goods = []
            for(let i=0;i < that.data.result.length;i++){
                goods.push(that.data.product_list[that.data.result[i]*i])
                if(i+1==that.data.result.length){
                    wx.hideLoading()
                    wx.setStorage({
                        key:"goods",
                        data:goods
                    })
                    wx.navigateTo({
                        url: '../add_order/add_order',
                    })

                }
            }
        }else{
            wx.showToast({
              title: '请选择商品',
              icon:"none"
            })
        }
    },
    // 删除商品
    delete_product(e){
        let that = this
        let id = e.currentTarget.dataset.id
        wx.showModal({
          title: '提示',
          content: '是否删除该商品',
          success(res){
              if(res.confirm){
                  console.log('用户点击确定')
                  wx.showLoading({
                    title: '删除中',
                  })
                  db.collection('shopping_car').doc(id).remove().then(res=>{
                    wx.hideLoading()
                    wx.showToast({
                      title: '删除成功',
                    })
                    that.get_shopping_car()
                })
              }else if(res.cancel){
                console.log('用户点击取消')
              }
          }
        })
    },
    //全选或者删除全选
    select_all(e){
        let that = this
        let name = e.currentTarget.dataset.name
        let result = []
        if(name=="全选"){
            for(let i=0;i<that.data.product_list.length;i++){
                result.push(i+'')
                if(i+1==that.data.product_list.length){
                    that.get_all_price(result)
                    that.setData({
                        result:result,
                        is_all:true
                    })
                }
            }
        }else{
            that.setData({
                result:[],
                is_all:false,
                all_price:0
            })
        }
    },
    // 选择商品数量
    select_product_num(e){
        let that=this
        let index = e.currentTarget.dataset.index
        that.setData({
            ['product_list['+index+'].product_num']:e.detail
        })
        //重新计算
        that.get_all_price(that.data.result)
        //更新云端
        db.collection('shopping_car').doc(that.data.product_list[index]._id).update({
            data:{
                product_num:e.detail
            }
        })
    },
    // 计算总价
    get_all_price(pro){
        let that=this
        let all_price=0
        let product_list=that.data.product_list
        if(pro.length==0){
            that.setData({
                all_price:0
            })
        }else{
            for(let i=0;i<pro.length;i++){
                let index = parseInt(pro[i])
                all_price = all_price + (product_list[index].product_num*product_list[index].product_price)
                if(i+1==pro.length){
                    that.setData({
                        all_price:parseFloat((all_price*100).toFixed(2))
                    })
                }
            }
        }
    },
    // 选择商品
    select_product(e){
        let that = this
        let select_pro = e.detail
        that.setData({
            result:select_pro
        })
        that.get_all_price(select_pro)
        console.log(e)
    },
    // 获取购物车
    get_shopping_car(){
        let that = this
        wx.showLoading({
          title: '获取中',
        })
        db.collection('shopping_car').orderBy('time','desc').get().then(res=>{
            wx.hideLoading()
            console.log('获取购物车成功',res)
            that.setData({
                product_list:res.data
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.get_shopping_car()
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