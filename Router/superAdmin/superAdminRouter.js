/* Express */
const express = require("express")
const router = express.Router()
// user controller 
const superAdminController = require("../../Controller/superAdmin/superAdminController")
// Multer 
const { cloudinary } = require("../../utils/cloudinary")
const upload = require("../../utils/multer")
/*******************************************************************************************************************/
router.post("/create", async (req, res, next) => {
    try {
        let img = req.body.user.imageOne
        const uploadedResponse = await cloudinary.uploader.upload(img)
        let data = await superAdminController.createUser(req.body.user, uploadedResponse.secure_url)
        if (data) {
            if (data.status) {
                res.status(200).json({ status: 0, data: { message: "User Exist" } })
            }
            else {
                res.status(200).json({
                    status: 1,
                    data: {
                        message: "User is created"
                    }
                })
            }
        }
    } catch (error) {
        next(error)
    }
})
/* Login api */
router.post("/login", async (req, res, next) => {
    try {
        let loginData = await superAdminController.doLogin(req.body)
        if (loginData.status == true) {
            res.status(200).json({
                status: 1,
                data: {
                    message: "Login Success"
                }
            })
        }
        else {
            res.status(501).json({ data: { message: "Wrong email or password" } })
        }
    } catch (error) {
        next(error)
    }

})
/* Get all cpc */
router.get("/getCpc/", async (req, res) => {
    let data = await superAdminController.getCpc()
    if (data) {
        res.status(200).json({ status: 1, data: { data } })
    }
    else {
        response.status(501).json({ status: 0, data: { message: "worng" } })
    }
})
/* Get CPC Data */
router.get("/getWarehouse/:code", async (req, res) => {
    try {
        let warehouse = await superAdminController.getWarehouse(req.params.code)
        console.log(warehouse);
        if (warehouse) {
            res.status(200).json({ data: { warehouse } })
        }
    } catch (error) {

    }
})
/* get designation */
router.get("/designation", async (req, res) => {
    try {
        let designation = await superAdminController.getDesignation()
        if (designation) {
            res.status(200).json({ data: { designation } })
        }
    } catch (error) {

    }
})
/* Get all users */
router.get("/getUsers", async (req, res) => {
    try {
        let user = await superAdminController.getUsers()
        console.log(user);
        if (user) {
            res.status(200).json({ data: { user } })
        }
    } catch (error) {

    }
})
/* Delete User */
router.put("/userDeactivate/:userID", async (req, res) => {
    try {
        let response = await superAdminController.userDeactivate(req.params.userID)
        if (response) {
            res.status(200).json({ data: { message: "Deactivate" } })
        }
    } catch (error) {

    }
})
router.put("/userActivate/:userId", async (req, res) => {
    try {
        let response = await superAdminController.userActivate(req.params.userId)
        if (response) {
            res.status(200).json({ data: { message: "Activate" } })
        }
    } catch (error) {

    }
})
router.get("/getEditData/:userId", async (req, res) => {
    try {
        let user = await superAdminController.getEditData(req.params.userId)
        console.log(user);
        if (user) {
            res.status(200).json({ data: user })
        }
    } catch (error) {

    }
})
router.post("/edituserDetails", async (req, res) => {
    try {

        let img = req.body.data.imageOne
        const uploadedResponse = await cloudinary.uploader.upload(img)
        let data = await superAdminController.editUserdata(req.body.data, uploadedResponse.secure_url)
        if (data) {
            res.status(200).json({ data: data })
        }
    } catch (error) {

    }
})
router.get("/masters", async (req, res) => {
    let data = await superAdminController.getMasters()
    res.status(200).json({ data: data })
})
router.get("/infra", async (req, res) => {
    let data = await superAdminController.getInfra()
    res.status(200).json({ data: data })
})
/*********************************************DASHBOARD***********************************************************************************/
/* Get Dashboard count */
router.get("/dashboard", async (req, res, next) => {
    try {
        let data = await superAdminController.dashboard()
        if (data) {
            res.status(200).json({
                data: data,
                message: "Success"
            })
        }
    } catch (error) {
        next(error)
    }
})
/********************************************ORDERS***************************************************************************************/
/*Import Order*/
router.post("/ordersImport", async (req, res, next) => {
    try {
        let data = await superAdminController.importOrders(req.body)
        if (data) {
            res.status(200).json({
                message: "Successfully Added"
            })
        }
        else {
            res.status(404).json({
                message: "Orders Import Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
/*Get Orders*/
router.post("/getOrders", async (req, res, next) => {
    try {
        let data = await superAdminController.getOrders()
        console.log(data[0]);
        if (data) {
            res.status(200).json({
                data: data,
                message: "Success"
            })
        }
        else {
            res.status(404).json({
                message: "Orders Get Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
/*************************************************************************************************************************************************** */
/* Create Brands */
router.post("/createBrands", async (req, res, next) => {
    try {
        let data = await superAdminController.createBrands(req.body)
        if (data.status == true) {
            res.status(200).json({
                message: "Successfullly Created"
            })
        }
        else {
            res.status(400).json({
                message: "Brand Already Exists"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Bulk Brands Validation */
router.post("/bulkValidationBrands",async(req,res,next)=>{
    try {
        let data=await superAdminController.bulkValidationBrands(req.body)
        console.log(data);
        if (data.status == true) {
            res.status(200).json({
                message: "Successfully Validated"
            })
        }
        else {
            res.status(400).json({
                data: data.err,
                message: "Please Check Errors"
            })
        }

    } catch (error) {
        next(error)
    }
})
/* Get Highest brand Id */
router.post("/getBrandIdHighest",async(req,res,next)=>{
    try {
        let data=await superAdminController.getHighestBrandId()
        if(data){
            res.status(200).json({
                data:data
            })
        }
    } catch (error) {
        alert(error)
    }
})
/* Get All Brands */
router.post("/getBrands", async (req, res, next) => {
    try {
        let data = await superAdminController.getBrands()
        if (data) {
            res.status(200).json({
                data: data,
                message: "Success"
            })

        }
    } catch (error) {
        next(error)
    }
})
/* get One data */
router.get("/getBrandOne/:brandId", async (req, res, next) => {
    try {
        let data = await superAdminController.getOneBrand(req.params.brandId)
        if (data.status == 1) {
            res.status(200).json({
                data: data.data,
                message: "Success"
            })
        }
         else if(data.status == 0){
            res.status(400).json({
               
                message: "This Brand You Can't Edit"
            })
         }
        else {
            res.status(400).json({
                message: "No data found"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Edit Brands */
router.put("/editBrand", async (req, res, next) => {
    try {
        let data = await superAdminController.editBrands(req.body)
        if (data.status == true) {
            res.status(200).json({
                message: "Successfully Edited"
            })
        }
        else {
            res.status(400).json({
                message: "Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Delete brands */
router.delete("/deleteBrand/:brandId", async (req, res, next) => {
    try {
        let data = await superAdminController.deleteBrands(req.params.brandId)
        if (data.status == true) {
            res.status(200).json({
                message: "Successfully Deleted"
            })
        }
        else {
            res.status(400).json({
                message: "Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
/***********************************************************************************************************************/
/* Product Bulk Validation */
router.post("/bulkValidationProduct", async (req, res, next) => {
    try {
        let data = await superAdminController.validationBulkProduct(req.body)
        console.log(data);
        if (data.status == true) {
            res.status(200).json({
                message: "Successfully Validated"
            })
        }
        else {
            res.status(400).json({
                data: data.err,
                message: "Please Check Errors"
            })
        }

    } catch (error) {
        next(error)
    }
})
/* Create Products */
router.post("/createproducts", async (req, res, next) => {
    try {
        let data = await superAdminController.createProduct(req.body)
        if (data.status === true) {
            res.status(200).json({
                message: "Successfully Created"
            })
        }
        else {
            res.status(400).json({
                message: "Product Exists"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Get Products */
router.post("/getAllProducts", async (req, res, next) => {
    try {
        let data = await superAdminController.getAllProducts()
        if (data) {
            res.status(200).json({
                data: data,
                message: "Success"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Get Edit Products */
router.get("/getEditProduct/:productId", async (req, res, next) => {
    try {
        let data = await superAdminController.getEditProduct(req.params.productId)
        console.log(data);
        if (data.status == 1) {
            res.status(200).json({
                data: data.data,
                message: "Success"
            })
        }
        else if(data.status == 3 || data.status == 2){
            res.status(400).json({
                message: "You Can't Edit This Product"
            })
        }
        else {
            res.status(403).json({
                message: "No data found"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Edit Product */
router.put("/editProduct", async (req, res, next) => {
    try {
        let data = await superAdminController.editproduct(req.body)
        if (data) {
            res.status(200).json({
                message: "Successfully Updated"
            })
        }
        else {
            res.status(400).json({
                message: "Product Edit Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Delete Product */
router.delete("/deleteProduct/:productId", async (req, res, next) => {
    try {
        let data = await superAdminController.deleteProduct(req.params.productId)
        if (data) {
            res.status(200).json({
                message: "Successfully Deleted"
            })
        }
        else {
            res.status(400).json({
                message: "Product delete failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
/****************************************************INFRA CRED***************************************************************************/
/* Add Location */
router.post("/addLocation", async (req, res, next) => {
    try {
        let data = await superAdminController.addLocation(req.body)
        if (data.status == true) {
            res.status(200).json({
                message: "Successfully Added"
            })
        }
        else {
            res.status(400).json({
                message: "Location Already Exists"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Get one Infra based on the Id */
router.get("/getInfra/:infraId", async (req, res, next) => {
    try {
        let data = await superAdminController.getInfra(req.params.infraId)
        if (data) {
            res.status(200).json({
                data: data,
                message: "Success"
            })
        }
        else {
            res.status(400).json({
                message: "Data Not Found"
            })
        }

    } catch (error) {
        next(error)
    }
})
/* Get Location */
router.post("/getLocation", async (req, res, next) => {
    try {
        let location = await superAdminController.getLocation()
        if (location) {
            res.status(200).json({
                data: location,
                message: "Success"
            })
        }
    } catch (error) {
        next(error)
    }
})

/* Edit infra */
router.put("/editInfra", async (req, res, next) => {
    try {
        let data = await superAdminController.editInfra(req.body)
        if (data) {
            res.status(200).json({
                message: "Successfully Updated"
            })
        }
        else {
            res.status(400).json({
                message: "Updation Failed"
            })
        }

    } catch (error) {
        next(error)
    }
})
/* Delete Infra */
router.delete("/deleteInfra/:infraId", async (req, res, next) => {
    try {
        let data = await superAdminController.deleteInfra(req.params.infraId)
        if (data) {
            res.status(200).json({
                message: "Successfully Deleted"
            })
        }
        else {
            res.status(400).json({
                message: "Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
/************************************************************************************************************************************/
router.post("/getWarehouse", async (req, res, next) => {
    try {
        let data = await superAdminController.getAllWarehouse()
        if (data) {
            res.status(200).json({
                data: data,
                message: "Success"
            })
        }
    } catch (error) {
        next(error)
    }
})
/*****************************************************MASTERs************************************************************************ */
/* Bulk Bag Validation */
router.post("/bulkValidationBag",async(req,res,next)=>{
    try {
        let data=await superAdminController.bulkBagValidation(req.body)
        if (data.status == true) {
            res.status(200).json({
                message: "Successfully Validated"
            })
        }
        else {
            res.status(400).json({
                data: data.data,
                message: "Please Check Errors"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Get Highest Master Id */
router.post("/getMasterHighest/:prefix",async(req,res,next)=>{
    try {
        let data=await superAdminController.getHighestId(req.params.prefix)
        if(data){
            res.status(200).json({
                data:data
            })
        }
    } catch (error) {
        alert(error)
    }
})
/* Bulk Validation for Tray */
router.post("/bulkValidationTray",async(req,res,next)=>{
    try {
        let data=await superAdminController.bulkBagValidationTray(req.body)
        console.log(data);
       if (data.status == true) {
        res.status(200).json({
            message: "Successfully Validated"
        })
    }
    else {
        res.status(400).json({
            data: data.data,
            message: "Please Check Errors"
        })
    }
    } catch (error) {
        next(error)
    }
})
/* Bulk tray create */
router.post("/createBulkTray",async(req,res,next)=>{
    try {
        let data=await superAdminController.addbulkTray(req.body)
        if(data){
            res.status(200).json({
                message:"Successfully Created"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Bulk Create */
router.post("/createBulkBag",async(req,res,next)=>{
    try {
        let data=await superAdminController.addBulkBag(req.body)
        if(data){
            res.status(200).json({
                message:"Successfully Created"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Get Audit */
router.post("/getAudit/:bagId",async(req,res,next)=>{
    try {
        let data=await superAdminController.getAudit(req.params.bagId)
        if(data){
            res.status(200).json({
                data:data
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Create Bag */
router.post("/createMasters",async(req,res,next)=>{
    try {
        let data=await superAdminController.createMasters(req.body)
        if(data){
            res.status(200).json({
                message:"Successfully Created"
            })
        }
        else
        {
            res.status(400).json({
                message:"Creation Failed"
            })
        }
    } catch (error) {
        next(error)
        
    }
})
/* Get Master */
router.post("/getMasters",async(req,res,next)=>{
    try {
        let data=await superAdminController.getMasters(req.body)
        if(data){
            res.status(200).json({
                data:data,
                message:"Success"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Get One Master */
router.get("/getOneMaster/:masterId",async(req,res,ne)=>{
    try {
        let data=await superAdminController.getOneMaster(req.params.masterId)
        if(data){
            res.status(200).json({
                data:data
            })
        }
        else{
            res.status(400).json({
                message:"You Can't Edit This Bag"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Edit Master */
router.put("/editMaster",async(req,res,next)=>{
    try {
        let data=await superAdminController.editMaster(req.body)
        if(data.status){
            res.status(200).json({
                message:"Successfully Updated"
            })
        }
        else{
            res.status(400).json({
                message:"Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Delete Master */
router.delete("/deleteMaster/:masterId",async(req,res,next)=>{
    try {
        let data=await superAdminController.delteMaster(req.params.masterId)
        if(data.status){
            res.status(200).json({
                message:"Successfully Deleted"
            })
        }
        else{
            res.status(400).json({
                message:"Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
module.exports = router;