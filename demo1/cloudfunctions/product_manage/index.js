// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    if(event.method == 'get_product'){
        return await db.collection('product').orderBy("time","desc").get()
    }else if(event.method == 'search'){
        return await db.collection('product').where({
                name: db.RegExp({
                regexp: event.name,
                options: 'i',
            })
        }).orderBy("time","desc").get()
    }else if(event.method == 'to_classify'){
        return await db.collection('product').where({
            select_classify:event.classify
        }).orderBy("time","desc").get()
    }else if(event.method == 'inc_sales_volume'){
        return await db.collection('product').doc(event.id).update({
            data:{
                sales_volume:_.inc(event.num)
            }
        })
    }
}