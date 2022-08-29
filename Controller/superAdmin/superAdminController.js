
const { user } = require("../../Model/userModel")
const { infra } = require("../../Model/infraModel")
const { masters } = require("../../Model/mastersModel")
const { orders } = require("../../Model/ordersModel/ordersModel")
const { brands } = require("../../Model/brandModel/brand")
const { products } = require("../../Model/productModel/product")
const { admin } = require("../../Model/adminMode/admins")

module.exports = {
    doLogin: (loginData) => {
        console.log(loginData);
        return new Promise(async (resolve, reject) => {
            let dd = await admin.findOne({})
            console.log(dd);
            let data = await admin.findOne({ email: loginData.email, password: loginData.password })
            if (data) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false })
            }
        })
    },
    createUser: (userData, profile) => {
        return new Promise(async (resolve, rejects) => {
            let userExist = await user.findOne({ $or: [{ contact: userData.contact }, { email: userData.email }, { device_id: userData.deviceId }] })
            if (userExist) {
                resolve({ status: true, user: userExist })
            }
            else {
                let data = await user.create({
                    name: userData.name,
                    email: userData.email,
                    contact: userData.contact,
                    user_name: userData.username,
                    password: userData.password,
                    designation: userData.designation,
                    cpc: userData.cpc,
                    warehouse: userData.warehouse,
                    department: userData.department,
                    store: userData.store,
                    reporting_manager: userData.reportingManager,
                    device_id: userData.deviceId,
                    device_name: userData.deviceName,
                    is_super_admin: userData.isSuperAdmin,
                    profile_picture: profile,
                    creation_date: new Date()
                })
                if (data) {
                    resolve({ status: false, user: data })
                }
                else {
                    resolve()
                }
            }
        })
    },
    getCpc: () => {
        return new Promise(async (resolve, rejects) => {
            let cpc = await infra.find({ type_taxanomy: "CPC" })
            resolve(cpc)
        })
    },
    getWarehouse: (code) => {
        return new Promise(async (resolve, reject) => {
            let warehouse = await infra.find({ parent_id: code })
            resolve(warehouse)
        })
    },
    getDesignation: () => {
        return new Promise(async (resolve, reject) => {
            let designation = await masters.find({ type_taxanomy: "designation-type" })
            console.log(designation);
        })
    },
    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            let usersData = await user.find({})
            resolve(usersData)
        })
    },
    userDeactivate: (userId) => {
        return new Promise(async (resolve, reject) => {
            let res = await user.findByIdAndUpdate(userId, { status: "Deactivated" })
            resolve(res)
        })
    },
    userActivate: (userId) => {
        return new Promise(async (resolve, reject) => {
            let res = await user.findByIdAndUpdate(userId, { status: "Active" })
            resolve(res)
        })
    },
    getEditData: (userId) => {
        return new Promise(async (resolve, reject) => {
            let userData = await user.findOne({ _id: userId })
            resolve(userData)
        })
    },
    editUserdata: (userData, profile) => {
        console.log(userData);
        console.log(profile);
        return new Promise(async (resolve, reject) => {
            let userDetails = await user.findByIdAndUpdate(userData._id, {
                name: userData.name,
                email: userData.email,
                contact: userData.contact,
                user_name: userData.username,
                password: userData.password,
                designation: userData.designation,
                cpc: userData.cpc,
                warehouse: userData.warehouse,
                department: userData.department,
                store: userData.store,
                reporting_manager: userData.reportingManager,
                device_id: userData.deviceId,
                device_name: userData.deviceName,
                is_super_admin: userData.isSuperAdmin,
                profile_picture: profile,
                last_update_date: new Date()
            })
            resolve(userDetails)
        })
    },
    getMasters: () => {
        return new Promise(async (resolve, reject) => {
            let mastersData = await masters.find({})
            console.log(mastersData);
            resolve(mastersData)
        })
    },
    getInfra: () => {
        return new Promise(async (resolve, reject) => {
            let infraData = await infra.find({})
            console.log(infraData);
            resolve(infraData)
        })
    },
    dashboard: () => {
        let obj = {
            users: 0,
            location: 0,
            warehouse: 0,
            brands: 0,
            products: 0,
        }
        return new Promise(async (resolve, reject) => {
            obj.users = await user.count({})
            obj.location = await infra.count({})
            obj.warehouse = await infra.count({})
            obj.brands = await brands.count({})
            obj.products = await products.count({})
            resolve(obj)
        })
    },
    bulkValidationBrands:(bandData)=>{
        return new Promise(async (resolve, reject) => {
            let err = {}
            let brand_id = []
            let brand_name = []
            for (let i = 0; i < bandData.length; i++) {
                let brandIdExists = await brands.findOne({brand_id: bandData[i].brand_id })
                if (brandIdExists) {
                    brand_id.push(brandIdExists.brand_id)
                    err["duplicate_brand_id"] = brand_id
                }
                else {
                    if (bandData.some((data, index) => data.brand_id == bandData[i].brand_id && index != i)) {
                        brand_id.push(bandData[i].brand_id)
                    err["duplicate_brand_id"] = brand_id
                    }
                }
                let barndName = await products.findOne({ brand_name: bandData[i].brand_name })
                if (barndName) {
                    brand_name.push(barndName.brand_name)
                    err["duplicate_brand_name"] = brand_name
                }
                else {
                    if (bandData.some((data, index) => data.brand_name == bandData[i].brand_name && index != i)) {
                        brand_name.push(bandData[i].brand_name)
                        err["duplicate_brand_name"] = brand_name
                    }
                }
            }
            if (Object.keys(err).length === 0) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false, err: err })
            }
        })
    },
    createBrands: (brandsData) => {
        return new Promise(async (resolve, reject) => {
            let brandExists = await brands.findOne({ brand_name: brandsData.brand_name }).catch((err) => reject(err))
            if (brandExists) {
                resolve({ status: false })
            }
            else {
                let data = await brands.create(brandsData).catch((err) => reject(err))
                if (data) {
                    resolve({ status: true })
                }
            }
        })
    },
    getHighestBrandId: () => {
        return new Promise(async (resolve, reject) => {
            let highestBrandId = await brands.find({}).sort({ _id: -1 }).limit(1)
            if (highestBrandId.length != 0) {
                let count = highestBrandId[0].brand_id.split("-")[1]
                let nextID = Number(count) + 1
                console.log(nextID);
                resolve(nextID)
            }
            else {
                resolve(1)
            }
        })
    },
    getHighestId: (prefix) => {
        return new Promise(async (resolve, reject) => {
            let id = await masters.aggregate([
                {
                    $match: { prefix: prefix }
                },
                {
                    $group: {
                        "_id": "code",
                        "Max": {
                            "$max": {
                                "$max": "$code"
                            }
                        }
                    }
                }
            ])
            console.log(id);
            if (id[0]?.Max != null || id.length != 0) {
                if (prefix == "bag-master") {
                    let count = id[0].Max.split("B0")[1]
                    let nextID = Number(count) + 1
                    console.log(nextID);
                    resolve(nextID)
                }
                else if (prefix == "tray-master") {
                    if (prefix == "tray-master") {
                        let count = id[0].Max.split("T")[1]
                        let nextID = Number(count) + 1
                        console.log(nextID);
                        resolve(nextID)
                    }
                    else {
                        resolve(1)
                    }
                }

            }
            else {
                resolve(1)
            }

        })
    },
    getBrands: () => {
        return new Promise(async (resolve, reject) => {
            let allBrands = await brands.find({}).catch((err) => reject(err))
            if (allBrands) {
                resolve(allBrands)
            }
        })
    },
    getOneBrand: (brandId) => {
        return new Promise(async (resolve, reject) => {
            let data = await brands.findOne({ _id: brandId }).catch((err) => reject(err))
            if (data) {
                let checkBrand = await products.findOne({ brand_name: data.brand_name })
                if (checkBrand) {
                    resolve({ status: 0 })
                }
                else {

                    resolve({ status: 1, data: data })
                }
            }
            else {
                resolve({ status: 2 })
            }
        })
    },
    editBrands: (editData) => {
        console.log(editData);
        return new Promise(async (resolve, reject) => {
            let data = await brands.updateOne({ _id: editData._id }, {
                $set: {
                    brand_name: editData.brand_name
                }
            }).catch((err) => reject(err))
            console.log(data);
            if (data.modifiedCount != 0) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false })
            }
        })
    },
    deleteBrands: (brandId) => {
        return new Promise(async (resolve, reject) => {
            let data = await brands.deleteOne({ _id: brandId }).catch((err) => reject(err))
            if (data.deletedCount != 0) {
                resolve({ status: true })
            }
            else {
                resolve({ staus: false })
            }
        })
    },
    validationBulkProduct: (productsData) => {
        return new Promise(async (resolve, reject) => {
            let err = {}
            let vendor_sku_id = []
            let brand = []
            let model = []
            for (let i = 0; i < productsData.length; i++) {
                let skuIdExists = await products.findOne({ vendor_sku_id: productsData[i].vendor_sku_id })
                if (skuIdExists) {
                    vendor_sku_id.push(skuIdExists.vendor_sku_id)
                    err["duplicate_vendor_iD"] = vendor_sku_id
                }
                else {
                    if (productsData.some((data, index) => data.vendor_sku_id == productsData[i].vendor_sku_id && index != i)) {
                        vendor_sku_id.push(productsData[i].vendor_sku_id)
                        err["duplicate_vendor_iD"] = vendor_sku_id
                    }
                }
                let brandNameExists = await brands.findOne({ brand_name: productsData[i].brand_name })
                if (brandNameExists == null) {
                    brand.push(productsData[i].brand_name)
                    err["brand_name"] = brand
                }

                let modelName = await products.findOne({ model_name: productsData[i].model_name })
                if (modelName) {
                    model.push(modelName.model_name)
                    err["model_name"] = model
                }
                else {
                    if (productsData.some((data, index) => data.model_name == productsData[i].model_name && index != i)) {
                        model.push(productsData[i].model_name)
                        err["model_name"] = model
                    }
                }
            }
            if (Object.keys(err).length === 0) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false, err: err })
            }
        })
    },
    createProduct: (productData) => {
        return new Promise(async (resolve, reject) => {
            let productExists = await products.findOne({ $or: [{ model_name: productData.model_name }, { vendor_sku_id: productData.vendor_sku_id }] }).catch((err) => reject(err))
            if (productExists) {
                resolve({ status: false })
            }
            else {
                let data = await products.create(productData).catch((err) => reject(err))
                console.log(data);
                if (data) {
                    resolve({ status: true })
                }
            }
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let allProducts = await products.find({})
            resolve(allProducts)
        })
    },
    getEditProduct: (productId) => {
        return new Promise(async (resolve, reject) => {
            let data = await products.findOne({ _id: productId }).catch((err) => reject(err))
            if (data) {
                console.log(data.model_name);
                let ordersCheck = await orders.findOne({ item_id: data.vendor_sku_id })
                if (ordersCheck) {
                    resolve({ status: 3, data: data })
                }
                else {
                    let deliveryCheck = await orders.findOne({ item_id: data.vendor_sku_id })
                    if (deliveryCheck) {
                        resolve({ status: 2, data: data })
                    }
                   else{
                    resolve({status:1,data:data})
                   }


                }
               
            }
            else {
                resolve({status:0})
            }
        })
    },
    editproduct: (productData) => {
        console.log(productData);
        return new Promise(async (resolve, reject) => {
            let data = await products.updateOne({ _id: productData._id }, {
                $set: {
                    brand_name: productData.brand_name,
                    model_name: productData.model_name,
                    vendor_sku_id: productData.vendor_sku_id,
                    vendor_name: productData.vendor_name

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
    deleteProduct: (productId) => {
        return new Promise(async (resolve, reject) => {
            let data = await products.deleteOne({ _id: productId })
            if (data.deletedCount != 0) {
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    addLocation: (locationData) => {
        return new Promise(async (resolve, reject) => {
            let checkNameExists = await infra.findOne({ $or: [{ name: locationData.name }, { code: locationData.code }] })
            if (checkNameExists) {
                resolve({ status: false })
            }
            else {
                let data = await infra.create(locationData)
                if (data) {
                    resolve({ status: true })
                }
            }
        })
    },
    getInfra: (infraId) => {
        return new Promise(async (resolve, reject) => {
            let data = await infra.findOne({ _id: infraId })
            if (data) {
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    editInfra: (infraId) => {
        return new Promise(async (resolve, reject) => {
            let data = await infra.updateOne({ _id: infraId._id }, {
                $set: {
                    name: infraId.name,
                    code: infraId.code,
                    address: infraId.address,
                    city: infraId.city,
                    state: infraId.state,
                    country: infraId.country,
                    pincode: infraId.pincode,
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
    deleteInfra: (infraId) => {
        return new Promise(async (resolve, reject) => {
            let data = await infra.deleteOne({ _id: infraId })
            if (data.deletedCount != 0) {
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    getLocation: () => {
        return new Promise(async (resolve, reject) => {
            let allLocation = await infra.find({ type_taxanomy: "CPC" })
            resolve(allLocation)
        })
    },
    getAllWarehouse: () => {
        return new Promise(async (resolve, reject) => {
            let data = await infra.find({ type_taxanomy: "Warehouse" })
            resolve(data)
        })
    },
    bulkBagValidation: (bagData) => {
        return new Promise(async (resolve, reject) => {
            let err = {}
            let bag_id = []
            let bag_display_name = []
            let dispaly_name = []
            for (let i = 0; i < bagData.length; i++) {
                let bagIdCheck = await masters.findOne({ prefix: "bag-master", code: bagData[i].bag_id })
                if (bagIdCheck) {
                    bag_id.push(bagData[i]?.bag_id)
                    err["bag_id_is_duplicate"] = bag_id
                }
                else {
                    if (bagData.some((data, index) => data?.bag_id == bagData[i]?.bag_id && index != i)) {
                        bag_id.push(bagData[i]?.bag_id)
                        err["bag_id_is_duplicate"] = bag_id
                    }
                }
                let bagName = await masters.findOne({ prefix: "bag-master", name: bagData[i].bag_display_name })
                if (bagName) {
                    bag_display_name.push(bagData[i]?.bag_display_name)
                    err["bag_display_name_is_duplicate"] = bag_display_name
                }
                else {
                    if (bagData.some((data, index) => data?.bag_display_name == bagData[i]?.bag_display_name && index != i)) {
                        bag_display_name.push(bagData[i]?.bag_display_name)
                        err["bag_display_name_is_duplicate"] = bag_display_name
                    }
                }
                let displayName = await masters.findOne({ prefix: "bag-master", display: bagData[i]?.bag_display })
                if (displayName) {
                    dispaly_name.push(bagData[i]?.bag_display)
                    err["bag_display_is_duplicate"] = dispaly_name
                }
                else {
                    if (bagData.some((data, index) => data?.bag_display == bagData[i]?.bag_display && index != i)) {
                        dispaly_name.push(bagData[i]?.bag_display)
                        err["bag_display_is_duplicate"] = dispaly_name
                    }
                }
            }
            if (Object.keys(err).length === 0) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false, data: err })
            }
        })

    },
    bulkBagValidationTray: (trayData) => {
        return new Promise(async (resolve, reject) => {
            let err = {}
            let tray_id = []
            let tray_name = []
            let tray_dispaly_name = []
            for (let i = 0; i < trayData.length; i++) {
                let trayCheck = await masters.findOne({ prefix: "tray-master", code: trayData[i].tray_id })
                if (trayCheck) {
                    tray_id.push(trayData[i]?.tray_id)
                    err["trya_id_is_duplicate"] = tray_id
                }
                else {
                    if (trayData.some((data, index) => data?.tray_id == trayData[i]?.tray_id && index != i)) {
                        tray_id.push(trayData[i]?.tray_id)
                        err["tray_id_is_duplicate"] = tray_id
                    }
                }
                let trayName = await masters.findOne({ prefix: "tray-master", name: trayData[i].tray_name })
                if (trayName) {
                    tray_name.push(trayData[i]?.tray_name)
                    err["tray_display_name_duplicate"] = tray_name
                }
                else {
                    if (trayData.some((data, index) => data?.tray_name == trayData[i]?.tray_name && index != i)) {
                        tray_name.push(trayData[i]?.tray_name)
                        err["tray_display_name_duplicate"] = tray_name
                    }
                }
                let displayName = await masters.findOne({ prefix: "tray-master", display: trayData[i]?.tray_display })
                if (displayName) {
                    tray_dispaly_name.push(trayData[i]?.tray_display)
                    err["tray_display_is_duplicate"] = tray_dispaly_name
                }
                else {
                    if (trayData.some((data, index) => data?.tray_display == trayData[i]?.tray_display && index != i)) {
                        tray_dispaly_name.push(trayData[i]?.tray_display)
                        err["tray_display_is_duplicate"] = tray_dispaly_name
                    }
                }
            }
            if (Object.keys(err).length === 0) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false, data: err })
            }
        })
    },
    addbulkTray: (bulkDataTray) => {
        const newArrayOfObj = bulkDataTray.map(({ "tray_id": code, "tray_category": type_taxanomy, "tray_model": model, "tray_name": name, tray_brand: brand, "tray_limit": limit, "tray_display": display, ...rest }) => ({
            code,
            type_taxanomy,
            model,
            brand,
            name,
            limit,
            display,
            ...rest,
        }));

        return new Promise(async (resolve, reject) => {
            let data = await masters.create(newArrayOfObj)
            console.log(data);
            if (data) {
                resolve(data)
            }
        })
    },
    addBulkBag: (bulkData) => {
        const newArrayOfObj = bulkData.map(({ "bag_id": code, "bag_category": type_taxanomy, "bag_display_name": name, "bag_limit": limit, "bag_display": display, ...rest }) => ({
            code,
            type_taxanomy,
            name,
            limit,
            display,
            ...rest,
        }));
        return new Promise(async (resolve, reject) => {
            let data = await masters.create(newArrayOfObj)
            console.log(data);
            if (data) {
                resolve(data)
            }
        })
    },
    getAudit:(bagId)=>{
        console.log(bagId);
        return new Promise(async (resolve, reject) => {
            let data = await masters.find({ code:bagId })
            console.log(data);
            resolve(data)
        })
    },
    createMasters: (mastersData) => {
        return new Promise(async (resolve, reject) => {
            let exist = await masters.findOne({ $or: [{ $and: [{ name: mastersData.name }, { prefix: "bag-master" }] }] })

            if (exist) {
                resolve()
            }
            else {
                let data = await masters.create(mastersData)
                if (data) {
                    resolve(data)
                }
            }
        })
    },
    getMasters: (type) => {
        console.log(type);
        return new Promise(async (resolve, reject) => {
            let data = await masters.find({ prefix: type.master_type })
            resolve(data)
        })
    },
    getOneMaster: (masterId) => {
        return new Promise(async (resolve, reject) => {
            let data = await masters.findOne({ _id: masterId,sort_id:"No Status" })
            if (data) {
                resolve(data)
            }
            else {
                resolve()
            }
        })
    },
    editMaster: (editData) => {
        return new Promise(async (resolve, reject) => {
            let data = await masters.updateOne({ _id: editData._id }, {
                $set: {
                    name: editData.name,
                    type_taxanomy: editData.type_taxanomy,
                    limit: editData.limit,
                    display: editData.display,
                    model: editData.model,
                    brand: editData.brand
                }
            })
            if (data.matchedCount != 0) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false })
            }
        })
    },
    delteMaster: (masterId) => {
        return new Promise(async (resolve, reject) => {
            let data = await masters.deleteOne({ _id: masterId })
            if (data.deletedCount != 0) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false })
            }
        })
    }

}