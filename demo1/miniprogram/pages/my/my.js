// miniprogram/pages/my/my.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show : true,
        user : {}
    },
    //我的地址
    my_address(){
        let that = this
        wx.chooseAddress({
            success (res) {
              console.log('我的地址',res)
            }
          })
    },
    // 注册
    register(e){
        let that = this
        wx.showModal({
            title: '提示',
            content: '您还未注册，是否注册',
            success(res){
                if(res.confirm){
                    console.log('用户点击确定')
                    wx.showLoading({
                      title: '注册中',
                    })
                    wx.getUserProfile({
                        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                        success: (userInfo) => {
                            db.collection('user').add({
                                data:{
                                    userInfo:userInfo.userInfo
                                }
                            }).then(user=>{
                                wx.hideLoading()
                                wx.showToast({
                                  title: '注册成功',
                                })
                                that.login()
                            })

                        }
                    })
                }else if(res.cancel){
                  console.log('用户点击取消')
                }
            }
        })
    },
    // 登录
    login(){
        let that = this
        db.collection('user').get().then(res=>{
            if(res.data.length > 0){
                that.setData({
                    user:res.data[0]
                })
            }else{
                that.register()
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.login()
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