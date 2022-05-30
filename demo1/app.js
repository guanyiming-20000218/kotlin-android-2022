// app.js
App({
    onLaunch: function(){
        if(!wx.cloud){
            console.error("请使用2.2.3或以上的基础库以使用云能力")
        }else{
            wx.cloud.init({
                traceUser: true
            })
        }
        this.globalData = {
            admin:{}
        }
    },
    options: {
        addGlobalClass: true
    },
})
