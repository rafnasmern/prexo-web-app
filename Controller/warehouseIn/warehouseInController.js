
const { orders } = require("../../Model/ordersModel/ordersModel")
const { masters } = require("../../Model/mastersModel")
const { delivery } = require("../../Model/deliveryModel/delivery")
var mongoose = require('mongoose')
/********************************************************************/
module.exports = {
    dashboard: () => {
        return new Promise(async (resolve, reject) => {
            let obj = {
                orders: 0,
            }
            obj.orders = await orders.count({})
            resolve(obj)
        })
    },
    checkBagId: (bagId) => {
        return new Promise(async (resolve, reject) => {
            let bagExist = await masters.findOne({ prefix: "bag-master", code: bagId })
            if (bagExist == null) {
                resolve({ status: 1 })
            }
            else {
                let emptyBag = await masters.findOne({ prefix: "bag-master", code: bagId, sort_id: "Closed" })

                if (emptyBag) {
                    resolve({ status: 2 })
                }
                else {
                    resolve({ status: 0 })
                }
            }

        })
    },
    getBagOne: (bagId) => {
        return new Promise(async (resolve, reject) => {
            let data = await masters.aggregate([{$match:{$or:[{$and:[{code:bagId},{sort_id:"No Status"}]},{$and:[{code:bagId},{sort_id:"Inprogress"}]}]}},
            {
                $lookup: {
                    from: "deliveries",
                    localField: "items.awbn_number",
                    foreignField: "tracking_id",
                    as: "delivery"
                }
            },
            {
                $unwind: "$delivery"
            },
            ])
            if (data.length != 0 && data?.items?.length != 0) {
                resolve(data)
            }
            else {
                resolve(data)
            }
        })
    },
    getBagOneRequest:(bagId)=>{
        return new Promise(async (resolve, reject) => {
            let data = await masters.aggregate([{$match:{code:bagId,sort_id:"Requested to Warehouse"}},
            {
                $lookup: {
                    from: "deliveries",
                    localField: "items.awbn_number",
                    foreignField: "tracking_id",
                    as: "delivery"
                }
            },
            {
                $unwind: "$delivery"
            },
            ])
            if (data.length != 0 && data?.items?.length != 0) {
                resolve(data)
            }
            else {
                resolve(data)
            }
        })
    },
    checkAwbin: (awbn, bagId) => {
        return new Promise(async (resolve, reject) => {
            let data = await delivery.findOne({ tracking_id: awbn })
            if (data == null) {
                resolve({ status: 1 ,data:data})
            }
            else {
                let dup = await masters.findOne({ "items.awbn_number": awbn, code: bagId })
                if (dup) {
                    resolve({ status: 3,data:data })
                }
               
                else {
                    let valid = await masters.findOne({ "items.awbn_number": awbn, code: { $ne: bagId } })
                    if (valid) {
                        resolve({ status: 2 ,data:data})
                    }
                    else {

                        resolve({ status: 0,data:data })
                    }
                }
            }
        })
    },
    stockInData: (data) => {
        console.log(data);
        data._id = mongoose.Types.ObjectId()
        return new Promise(async (resolve, reject) => {
            let res = await masters.updateOne({
                code: data.bag_id
            },
                {
                    $push: {
                        "items": data
                    },
                    $set: {
                        "sort_id": "Inprogress"
                    }
                },
              
            )
            console.log(res);
            if (res) {
                resolve(res)
            }
            else {
                resolve()
            }
        })
    },
    addActualData:(actualBagItem)=>{
        actualBagItem._id = mongoose.Types.ObjectId()
        return new Promise(async (resolve, reject) => {
            let res = await masters.updateOne({
                code: actualBagItem.bag_id
            },
                {
                    $push: {
                        "actual_items": actualBagItem
                    },
                },
              
            )
            console.log(res);
            if (res) {
                resolve(res)
            }
            else {
                resolve()
            }
        })
    },
    closeBag: (bagData) => {
        return new Promise(async (resolve, reject) => {
            let data = await masters.updateOne({ code: bagData.bagId }, {
                $set: {
                    sort_id: "Closed",
                    status_change_time: Date.now()
                }
            })
            if (data.modifiedCount != 0) {
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    deleteStockin: (bgData) => {
        bgData.id=mongoose.Types.ObjectId(bgData.id)
        console.log(bgData.id);
        return new Promise(async (resolve, reject) => {
            let data = await masters.updateOne({code:bgData.bagId},{
                $pull:{
                    items: {
                        _id:bgData.id
                    }
                }
            },
            { new: true })
            console.log(data);
            if (data.modifiedCount != 0) {
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    removeActualItem:(bgData)=>{
        bgData.id=mongoose.Types.ObjectId(bgData.id)
        // console.log(id);
        return new Promise(async (resolve, reject) => {
            let data = await masters.updateOne({code:bgData.bagId},{
                $pull:{
                    actual_items: {
                        _id:bgData.id
                    }
                }
            })
            console.log(data);
            if (data.modifiedCount != 0) {
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    issueToBot:(issueData)=>{
         return new Promise(async(resolve,reject)=>{
            let data=await masters.updateOne({code:issueData.bagId},{
                $set:{
                    sort_id:"Issued",
                    description:issueData.description
                }
            })
            if(data.modifiedCount !=0){
                resolve(data)
            }
            else{
                resolve()
            }
         })
    },
    getRequests:()=>{
        return new Promise(async(resolve,reject)=>{
            let data=await masters.find({sort_id:"Requested to Warehouse"})
            resolve(data)
        })
    }
    // getStocksData: () => {
    //     return new Promise(async (resolve, reject) => {
    //         let data = await stockIn.aggregate([{
    //             $lookup: {
    //                 from: "deliveries",
    //                 localField: "awbn_number",
    //                 foreignField: "tracking_id",
    //                 as: "delivery"
    //             }
    //         },
    //         {
    //             $unwind: "$delivery"
    //         }
    //         ])
    //         resolve(data)
    //     })
    // }
}


