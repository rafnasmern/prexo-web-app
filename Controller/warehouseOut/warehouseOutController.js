
const {orders}=require("../../Model/ordersModel/ordersModel")
/******************************************************************* */

module.exports={
    dashboard:()=>{
        return new Promise(async(resolve,reject)=>{
            let obj={
                orders:0,
            }
          obj.orders=await orders.count({})
          resolve(obj)
        })
    }
}


