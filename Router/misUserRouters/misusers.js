/* Express */
const express = require("express")
const router = express.Router()
// user controller 
const misUserController = require("../../Controller/misUser/misUserController")
// Multer 
const { cloudinary } = require("../../utils/cloudinary")
const upload = require("../../utils/multer")
/*******************************************************************************************************************/
/********************************************ORDERS*****************************************************************/
/* Bulk Orders Validation */
router.post('/bulkOrdersValidation', async (req, res, next) => {
    try {

        let data = await misUserController.bulkOrdersValidation(req.body)
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
/*Import Order*/
router.post("/ordersImport", async (req, res, next) => {
    try {
        let data = await misUserController.importOrdersData(req.body)
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
/*********************************************Recon sheet******************************************************** */
/*Get Orders*/
router.post("/getOrders", async (req, res, next) => {
    try {
        let data = await misUserController.getOrders()
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
/* New Orders */
router.post("/newOrders", async (req, res, next) => {
    try {
        let data = await misUserController.getNewOrders()
        if (data) {
            res.status(200).json({
                data: data
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Get Delivered Orders */
router.post("/getDeliveredOrders", async (req, res, next) => {
    try {
        let data = await misUserController.getDeliveredOrders()
        if (data) {
            res.status(200).json({
                data: data
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Not Delivered Orders */
router.post("/notDeliveredOrders", async (req, res, next) => {
    try {
        let data = await misUserController.notDeliveredOrders()
        if (data) {
            res.status(200).json({
                data: data
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Delivered But Not order Id */
router.post("/deliveredNoOrderId", async (req, res, next) => {
    try {
        let data = await misUserController.getdeliveredNoOrderId()
        if (data) {
            res.status(200).json({
                data: data
            })
        }
    } catch (error) {
        next(error)
    }
})
/**********************************************************************************************************************************************/
/* Bulk Delivery Validation */
router.post("/bulkValidationDelivery", async (req, res, next) => {
    try {
        let data = await misUserController.bulkValidationDelivery(req.body)
        if (data.status == true) {
            res.status(200).json({
                message: "Successfully Validated"
            })
        }
        else {
            res.status(400).json({
                data: data.err,
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Import Delivery */
router.post("/importDelivery", async (req, res, next) => {
    try {
        let data = await misUserController.importDelivery(req.body)
        if (data) {
            res.status(200).json({
                message: "Successfully Added"
            })
        }
        else {
            res.status(403).json({
                message: "Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Get Delivery */
router.post("/getAllDelivery", async (req, res, next) => {
    try {
        let data = await misUserController.getDelivery()
        console.log(data);
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
/**************************************************Dashboard*********************************************************************************/
router.get("/dashboard", async (req, res, next) => {
    try {
        let data = await misUserController.dashboard()
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
/*********************************************UIC**************************************************************************************************** */
/* Add UIC */
router.post("/addUicCode", async (req, res, next) => {
    try {
        let data = await misUserController.addUicCode(req.body)
        if (data) {
            res.status(200).json({
                message: "Successfully Added"
            })
        }
        else {
            res.status(400).json({
                message: "Creation Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Get uic genrated */
router.post("/uicGeneratedRecon/:status",async(req,res,next)=>{
    try {
        let data=await misUserController.getUicRecon(req.params.status)
        if(data){
            res.status(200).json({
                data:data
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Change uic Status */
router.put("/changeUicStatus/:id",async(req,res,next)=>{
    try {
        console.log("called");
        let data=await misUserController.changeUicStatus(req.params.id)
        if(data.status){
            res.status(200).json({
                message:"Successfully Updated"
            })
        }
        else
        {
            res.status(400).json({
                message:"Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
/******************************************************BAG ASSIGN*********************************************************************** */
/* Bag Assign */
router.post("/getStockin",async(req,res,next)=>{
    try {
        let data=await misUserController.getStockin()
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
/* Bag issued Request send to Warehouse dept */
router.post("/issueRequestSend",async(req,res,next)=>{
    try {
        let data=await misUserController.sendIssueRequest(req.body)
        if(data){
            res.status(200).json({
                message:"Requested"
            })
        }
        else {
            res.status(400).json({
                message:"Failed"
            })
        }
    } catch (error) {
        next(error)
    }
})
module.exports = router;