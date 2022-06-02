// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return await db.collection('product').add({
        data:{
            time:db.serverDate(),
            name:event.name,
            h_price:event.h_price,
            price:event.price,
            specs:event.specs,
            img:event.img,
            img_detail:event.img_detail,
            sales_volume:0
        }
    })
}