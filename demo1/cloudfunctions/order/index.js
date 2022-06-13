// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    if(event.method == 'to_state_get_order'){
        return await db.collection('order').where({
            type:event.state
        }).orderBy("time","desc").skip(event.skip).get()
    }else if(event.method == 'deliver_goods'){
        return await db.collection('order').doc(event.id).update({
            data:{
                logistics:event.logistics,
                type:'运输中',
                logistics_time:db.serverDate()
            }
        })
    }
}