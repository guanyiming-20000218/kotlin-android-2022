// miniprogram/pages/admin_upload_product/admin_upload_product.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classify:[],
        name:"",
        h_price:0,
        price:0,
        input_specs:"",
        specs:[],
        img:[],
        img_detail:[],
        select_classify:""
    },
    async submit(){
        let that = this
        let img = that.data.img
        let img_detail = that.data.img_detail
        wx.showLoading({
          title: '上传中',
        })
        for(let i = 0;i<img.length;i++){
            var timestamp = new Date().getTime()
            await wx.cloud.uploadFile({
                cloudPath: 'product/'+timestamp+''+i+''+'.png',
                filePath: img[i], // 文件路径
            }).then(async res => {
                // get resource ID
                console.log(res.fileID)
                img[i] = res.fileID
                if(i+1==img.length){
                    for(let j = 0;j<img_detail.length;j++){
                        var timestamp = new Date().getTime()
                        await wx.cloud.uploadFile({
                            cloudPath: 'product_detail/'+timestamp+''+j+''+'.png',
                            filePath: img_detail[j], // 文件路径
                        }).then(res_1 => {
                            // get resource ID
                            console.log(res_1.fileID)
                            img_detail[j] = res_1.fileID
                            if(j+1 == img_detail.length){
                                console.log('1')
                                wx.cloud.callFunction({
                                    name:"product",
                                    data:{
                                        name:that.data.name,
                                        h_price:that.data.h_price,
                                        price:that.data.price,
                                        specs:that.data.specs,
                                        img:img,
                                        img_detail:img_detail,
                                    }
                                }).then(res_2=>{
                                    wx.hideLoading()
                                    console.log('2',res_2)
                                })
                            }
                        }).catch(error => {
                            // handle error
                        })
                    }
                }
            }).catch(error => {
                // handle error
            })
        }
    },
    // 选择分类
    select_classify(e){
        let that = this
        that.setData({
            select_classify:e.detail
        })
    },
    // 获取分类
    get_classify(){
        let that = this
        db.collection('classify').get().then(res=>{
            console.log('获取分类',res.data)
            that.setData({
                classify:res.data
            })
        })
    },
    // 删除图片
    delete_img(e){
        let that = this
        let index = e.currentTarget.dataset.index
        let name = e.currentTarget.dataset.name
        if(name=='img'){
            let img = that.data.img
            wx.showModal({
                title: '提示',
                content: '是否删除此图片',
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    img.splice(index,1)
                    that.setData({
                        img:img
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
            })
        }else{
            let img = that.data.img_detail
            wx.showModal({
                title: '提示',
                content: '是否删除此图片',
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    img.splice(index,1)
                    that.setData({
                        iimg_detailmg:img
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
            })
        }
    },
    // 添加图片
    add_img(e){
        let that = this
        let name = e.currentTarget.dataset.name
        if(name == 'img'){
            let img = that.data.img
            wx.chooseImage({
                count: 9 - img.length,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                  // tempFilePath可以作为 img 标签的 src 属性显示图片
                  const tempFilePaths = res.tempFilePaths
                  that.setData({
                      img:img.concat(tempFilePaths)
                  })
                }
            })
        }else{
            let img = that.data.img_detail
            wx.chooseImage({
                count: 9 - img.length,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                  // tempFilePath可以作为 img 标签的 src 属性显示图片
                  const tempFilePaths = res.tempFilePaths
                  that.setData({
                    img_detail:img.concat(tempFilePaths)
                  })
                }
            })
        }
    },
    // 添加规格
    add_specs(){
        let that = this
        if(that.data.input_specs){
            let specs = that.data.specs
            specs.push(that.data.input_specs)
            that.setData({
                specs:specs,
                input_specs:""
            })
        }else{
            wx.showToast({
              title: '请输入规格名',
              icon:"none"
            })
        }
    },
    // 输入事件
    input_msg(e){
        let that = this
        let name = e.currentTarget.dataset.name
        if(name == 'h_price' || name == 'price'){
            that.setData({
                [name]:parseFloat((e.detail.value*1).toFixed(2))
            })
        }else{
            that.setData({
                [name]:e.detail.value
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
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