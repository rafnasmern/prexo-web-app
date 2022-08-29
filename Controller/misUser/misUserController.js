
const { orders } = require("../../Model/ordersModel/ordersModel")
const { delivery } = require("../../Model/deliveryModel/delivery")
const { infra } = require("../../Model/infraModel")
const { products } = require("../../Model/productModel/product")
const { brands } = require("../../Model/brandModel/brand")
const { stockIn } = require("../../Model/stock-in-model/model")
const { masters } = require("../../Model/mastersModel")
/******************************************************************* */

module.exports = {
    bulkOrdersValidation: (ordersData) => {
        console.log(ordersData);
        return new Promise(async (resolve, reject) => {
            let err = {}
            let order_id = []
            let partner_shop = []
            let partner_id = []
            let item_id = []
            let brand_name = []
            let model_name = []
            let imei = []
            for (let i = 0; i < ordersData.length; i++) {
                let orderExists = await orders.findOne({ order_id: ordersData[i]?.order_id })
                if (orderExists) {
                    order_id.push(ordersData[i]?.order_id)
                    err["order_id_is_duplicate"] = order_id
                }
                else {
                    if (ordersData.some((data, index) => data?.order_id == ordersData[i]?.order_id && index != i)) {
                        order_id.push(ordersData[i].order_id)
                        err["order_id_is_duplicate"] = order_id
                    }
                }
                let partnerShop = await infra.findOne({ code: ordersData[i]?.partner_shop })
                if (partnerShop == null) {
                    partner_shop.push(ordersData[i]?.partner_shop)
                    err["location_does_not_exist"] = partner_shop
                }
                if (ordersData[i]?.partner_id != "1613633867") {
                    partner_id.push(ordersData[i]?.partner_id)
                    err["partner_id_does_not_exist"] = partner_id
                }
                let itemId = await products.findOne({ vendor_sku_id: ordersData[i]?.item_id })
                if (itemId == null) {
                    item_id.push(ordersData[i]?.item_id)
                    err["item_id_does_not_exist"] = item_id
                }
                let brand = await brands.findOne({ brand_name: ordersData[i]?.old_item_details?.split(":")[0] })
                if (brand == null) {
                    brand_name.push(ordersData[i]?.old_item_details?.split(":")[0])
                    err["brand_name_does_not_exist"] = brand_name
                }
                let model = await products.findOne({ model_name: ordersData[i]?.old_item_details?.split(":")[1] })
                if (model == null) {
                    model_name.push(ordersData[i]?.old_item_details?.split(":")[1])
                    err["model_name_does_not_exist"] = model_name
                }
                let imei_nmuber = await orders.findOne({ imei: ordersData[i]?.imei })
                if (imei_nmuber) {
                    imei.push(ordersData[i]?.imei)
                    err["imei_number_is_duplicate"] = imei
                }
                else {
                    if (ordersData.some((data, index) => data?.imei == ordersData[i]?.imei && index != i)) {
                        imei.push(ordersData[i]?.imei)
                        err["imei_number_is_duplicate"] = imei
                    }
                }
                console.log(i);
            }
            if (Object.keys(err).length === 0) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false, data: err })
            }
        })
    },
    importOrdersData: (ordersData) => {
        return new Promise(async (resolve, reject) => {
            let data = await orders.create(ordersData).catch((err) => reject(err))
            if (data) {
                resolve(data)
            }
            else {
                resolve()
            }

        })
    },
    getOrders: () => {
        return new Promise(async (resolve, reject) => {
            let allOrders = await orders.aggregate([
                {
                    $addFields: {
                        model: { $split: ["$old_item_details", ":"] }
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: `model`,
                        foreignField: "model_name",
                        as: "products"
                    }
                },
                {
                    $unwind: "$products"
                }
            ])
            console.log(allOrders);
            if (allOrders) {
                resolve(allOrders)
            }
        })
    },
    getNewOrders: () => {
        return new Promise(async (resolve, reject) => {
            let data = await orders.find({ order_status: "NEW" })
            resolve(data)
        })
    },
    getDeliveredOrders: () => {
        return new Promise(async (resolve, reject) => {
            let data = await orders.aggregate([{
                $match: {
                    delivery_status: "Delivered"
                }
            },
            {
                $lookup: {
                    from: "deliveries",
                    localField: "tracking_id",
                    foreignField: "tracking_id",
                    as: "delivery"
                }
            },
            {
                $unwind: "$delivery"
            }
            ])
            console.log(data);
            resolve(data)
        })
    },
    notDeliveredOrders: () => {
        return new Promise(async (resolve, reject) => {
            let data = await orders.find({ delivery_status: "Pending" })
            resolve(data)
        })
    },
    getdeliveredNoOrderId: () => {
        return new Promise(async (resolve, reject) => {
            let data = await delivery.aggregate([{
                $lookup: {
                    from: "orders",
                    localField: "tracking_id",
                    foreignField: "tracking_id",
                    as: "delivery"
                }
            },

            ])
            let arr = []
            for (let i = 0; i < data.length; i++) {
                if (data[i].delivery.length == 0) {
                    arr.push(data[i])
                }
            }
            resolve(arr)
        })
    },
    bulkValidationDelivery: (deliveryData) => {
        return new Promise(async (resolve, reject) => {
            let err = {}
            let tracking_id = []
            let order_id = []
            let item_id = []
            let partner_shop = []
            for (let i = 0; i < deliveryData.length; i++) {
                let trackingId = await delivery.findOne({ tracking_id: deliveryData[i].tracking_id })
                if (trackingId) {
                    tracking_id.push(deliveryData[i].tracking_id)
                    err["duplicate_tracking_id"] = tracking_id
                }
                else {
                    if (deliveryData.some((data, index) => data.tracking_id == deliveryData[i].tracking_id && index != i)) {
                        tracking_id.push(deliveryData[i].tracking_id)
                        err["duplicate_tracking_id"] = tracking_id
                    }
                }
                let orederID = await delivery.findOne({ order_id: deliveryData[i].order_id })
                if (orederID) {
                    order_id.push(deliveryData[i].order_id)
                    err["duplicate_order_id_found"] = order_id
                }
                else {
                    if (deliveryData.some((data, index) => data.order_id == deliveryData[i].order_id && index != i)) {
                        order_id.push(deliveryData[i].order_id)
                        err["duplicate_order_id_found"] = order_id
                    }
                }
                let itemId = await products.findOne({ vendor_sku_id: deliveryData[i].item_id })
                if (itemId == null) {
                    item_id.push(deliveryData[i].item_id)
                    err["item_does_not_exist"] = item_id
                }
                let partnerShop = await infra.findOne({ code: deliveryData[i].partner_shop })
                if (partnerShop == null) {
                    partner_shop.push(deliveryData[i].partner_shop)
                    err["location_does_not_exist"] = partner_shop
                }
            }
            if (Object.keys(err).length == 0) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false, err: err })
            }
        })
    },
    importDelivery: (deliveryData) => {
        return new Promise(async (resolve, reject) => {
            let data = await delivery.create(deliveryData).catch((err) => reject(err))
            deliveryData.forEach(async (doc) => {
                let updateData = await orders.updateOne({ tracking_id: doc.tracking_id, order_id: doc.order_id }, {
                    $set: {
                        delivery_status: "Delivered"
                    }
                })

                console.log(updateData);
            })
            if (data) {
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    dashboard: () => {
        return new Promise(async (resolve, reject) => {
            let obj = {
                orders: 0,
                delivery: 0
            }
            obj.orders = await orders.count({})
            obj.delivery = await delivery.count({})
            resolve(obj)
        })
    },
    getDelivery: () => {
        return new Promise(async (resolve, reject) => {
            let allDeliveryData = await delivery.aggregate([{
                $lookup: {
                    from: "orders",
                    let: {
                        tracking_id: "$tracking_id",
                        order_id: "$order_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$tracking_id",
                                                "$$tracking_id"
                                            ]
                                        },
                                        {
                                            $eq: [
                                                "$order_id",
                                                "$$order_id"
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "result"
                },

            }, 
            ])
            console.log(allDeliveryData);
            resolve(allDeliveryData)
        })
    },
    addUicCode: (uicData) => {
        return new Promise(async (resolve, reject) => {
            let codeHighst = await delivery.aggregate([
                {
                    $group: {
                        "_id": "uic_code.code",
                        "Max": {
                            "$max": "$uic_code.code"
                        }
                    }
                }
            ])

            let code
            let count = ""
            if (codeHighst[0].Max == null) {
                count = "0000001"
            }
            else {
                for (let i = 0; i < codeHighst[0].Max.slice(-7).length; i++) {
                    if (codeHighst[0].Max.slice(-7)[i] != 0) {
                        let mm = ""
                        for (let k = codeHighst[0].Max.slice(-7)[i]; k < codeHighst[0].Max.slice(-7).length; k++) {
                            mm = mm + codeHighst[0].Max.slice(-7)[k].toString()
                        }
                        code = Number(mm) + 1
                        break;
                    }
                    else {
                        count = count + codeHighst[0].Max.slice(-7)[i].toString()
                    }
                }

                count = count + code.toString()
            }


            var date = new Date();
            let uic_code = "9" + (new Date().getFullYear().toString().slice(-1)) + (date.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + count

            let data = await delivery.updateOne({ _id: uicData._id }, {
                $set: {
                    "uic_code.code": uic_code,
                    "uic_code.user": uicData.email,
                    "uic_code.created_at": Date.now(),
                    uic_status: "Created"
                }

            }, { upsert: true })
            if (data.modifiedCount != 0) {
                console.log(data);
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    getUicRecon:(status)=>{
        return new Promise(async (resolve, reject) => {
            let data = await orders.aggregate([{
                $match: {
                    delivery_status: "Delivered"
                }
            },
            {
                $lookup: {
                    from: "deliveries",
                    localField: "tracking_id",
                    foreignField: "tracking_id",
                    as: "delivery"
                }
            },
            {$match:{'delivery.uic_status':status}},
            {
                $unwind: "$delivery"
            }
            ])
            console.log(data);
            resolve(data)
        })
    },
    changeUicStatus: (id) => {
        return new Promise(async (resolve, reject) => {
            let data = await delivery.updateOne({ _id: id }, {
                $set: {
                    uic_status: "Printed",
                    download_time:Date.now()
                }
            })
            if (data.modifiedCount != 0) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false })
            }
        })
    },
    getStockin: () => {
        return new Promise(async (resolve, reject) => {
            let data = await masters.find({ sort_id: { $ne: "No Status" } })
            console.log(data);
            resolve(data)
        })
    },
    sendIssueRequest: (bagData) => {
        return new Promise(async (resolve, reject) => {
            let data = await masters.updateOne({ code: bagData.bagId }, {
                $set: {
                    sort_id: "Requested to Warehouse"
                }
            })
            if (data.modifiedCount != 0) {
                resolve(data)
            }
            else {
                resolve()
            }
        })
    }
}


