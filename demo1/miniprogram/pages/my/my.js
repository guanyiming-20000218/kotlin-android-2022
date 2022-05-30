// miniprogram/pages/my/my.js
const db = wx.cloud.database()
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show_login : false,
        user : {},
        username:"",
        password:"",
        is_login:false
    },
    // 后台登录
    login_admin(){
        let that = this
        wx.showLoading({
            title: '登录中',
          })
        if(that.data.username == '' || that.data.password == ''){
            wx.showToast({
              title: '请输入账号或密码',
              icon:"none"
            })
        }
        else{
            that.setData({
                is_login:true
            })
            db.collection('admin').where({
                username:that.data.username,
                password:that.data.password,
            }).get().then(res=>{
                console.log('登录',res)
                that.setData({
                    is_login:false
                })
                wx.hideLoading()
                if(res.data.length==0){
                    wx.showToast({
                      title: '账号或密码错误',
                    })
                }else{
                    app.globalData.admin=res.data[0]
                    wx.navigateTo({
                      url: '../admin_index/admin_index',
                    })
                }
            })
        }
    },
    // 输入信息
    input_msg(e){
        let that = this
        let name = e.currentTarget.dataset.name
        that.setData({
            [name]:e.detail.value
        })
    },
    // 打开登录框
    show_login_case(){
        let that = this
        that.setData({
            show_login:true
        })
        wx.hideTabBar()
    },
    // 关闭登录框
    close_login_case(){
        let that = this
        that.setData({
            show_login:false
        })
        wx.showTabBar()
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