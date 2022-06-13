// miniprogram/pages/admin_manage_order/admin_manage_order.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_state:"已付款",
        order_skip:0,
        order:[],
        order_id:"",
        deliver_case_show:false,
        express:['中通快递','顺丰快递'],
        select_express:'请选择快递',
        express_number:"",
        is_submit:false
    },
    // 输入信息
    input_msg(e){
        let that = this
        let name = e.currentTarget.dataset.name
        that.setData({
            [name]:e.detail.value
        })
    },
    // 选择快递
    select_express(e){
        let that = this
        let index = parseInt(e.detail.value)
        that.setData({
            select_express:that.data.express[index],
        })
    },
    // 立刻发货
    deliver_goods(){
        let that = this
        if(that.data.select_express == '请选择快递' || !that.data.express_number){
            wx.showToast({
              title: '请填入信息',
              icon:"none"
            })
        }else{
            wx.showLoading({
              title: '发货中',
            })
            that.setData({
                is_submit:true
            })
            wx.cloud.callFunction({
                name:"order",
                data:{
                    method:"deliver_goods",
                    id:that.data.order_id,
                    logistics:{
                        select_express : that.data.select_express,
                        express_number: that.data.express_number,
                    }
                }
            }).then(res=>{
                wx.hideLoading()
                that.setData({
                    select_express:'请选择快递',
                    express_number:"",
                    deliver_case_show:false,
                    order_skip:0,
                })
                that.get_order('已付款',0)
            })
        }
    },
    // 物流框展示
    deliver_case_show(e){
        let that = this
        that.setData({
            order_id:e.currentTarget.dataset.id,
            deliver_case_show:true,
        })
    },
    //物流框关闭
    deliver_case_close(){
        this.setData({
            deliver_case_show:false
        })
    },
    //获取订单
    get_order(state,skip){
        let that = this
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
            name:"order",
            data:{
                method:"to_state_get_order",
                state:state,
                skip:skip
            }
        }).then(res=>{
            wx.hideLoading()
            console.log('获取订单',res.result.data)
            that.setData({
                order:res.result.data
            })
        })
    },
    // 选择订单状态
    select_order_state(e){
        let that = this
        let order_state = e.currentTarget.dataset.name
        that.setData({
            order_state,
            order_skip:0
        })
        that.get_order(order_state,0)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.get_order(that.data.order_state,that.data.order_skip)
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