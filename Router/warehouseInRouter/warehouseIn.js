/* Express */
const express = require("express")
const router = express.Router()
// user controller 
const warehouseInController = require("../../Controller/warehouseIn/warehouseInController")
/*******************************************************************************************************************/
/**************************************************Dashboard**************************************************************************/
router.get("/dashboard", async (req, res, next) => {
    try {
        let data = await warehouseInController.dashboard()
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
/******************************************************STOCK IN********************************************************************* */
/* Check Bag ID */
router.get("/checkBagId/:bagId", async (req, res, next) => {
    try {
        let data = await warehouseInController.checkBagId(req.params.bagId)
        console.log(data);
        if (data.status == 1) {
            res.status(400).json({
                message: "Bag ID Does Not Exist"
            })
        }
        else if (data.status == 2) {
            res.status(400).json({
                message: "Bag ID is not empty or close stage"
            })
        }
        else if (data.status == 0) {
            res.status(200).json({
                message: "Valid Bag"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Get Bag Data */
router.post("/getBagItem/:bagId", async (req, res, next) => {
    try {
        let data = await warehouseInController.getBagOne(req.params.bagId)
        if (data.length !=0) {
            res.status(200).json({
                data: data,
                message: "Successfully Get All Data"
            })
        }
        else {
            res.status(201).json({
                data: data,
                message: "Bag is Empty"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Get Bag Data */
router.post("/getBagItemRequest/:bagId", async (req, res, next) => {
    try {
        let data = await warehouseInController.getBagOneRequest(req.params.bagId)
        if (data.length !=0) {
            res.status(200).json({
                data: data,
                message: "Successfully Get All Data"
            })
        }
        else {
            res.status(201).json({
                data: data,
                message: "Bag is Empty"
            })
        }
    } catch (error) {
        next(error)
    }
})

/* Awbn Number Checking */
router.post("/checkAwbn", async (req, res, next) => {
    try {
        const {awbn,bagId}=req.body
        console.log(awbn);
        let data = await warehouseInController.checkAwbin(awbn,bagId)
        if (data.status == 1) {
            res.status(400).json({
                message: "AWBN Number does Not Exist"
            })
        }
        else if (data.status == 2) {
            res.status(200).json({
                message: "AWBN Number Is Invalid"
            })
        }
        else if (data.status == 3) {
            res.status(200).json({
                message: "AWBN Number Is Duplicate"
            })
        }
        else if (data.status == 0) {
            res.status(200).json({
                message: "AWBN Number Is valid"
            })
        }
    } catch (error) {
        next(error)
    }
})
/* Stock In to Warehouse */
router.post("/stockInToWarehouse", async (req, res, next) => {
    try {
        let data = await warehouseInController.stockInData(req.body)
        if (data) {
            res.status(200).json({
                message: "Successfully Added"
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
/* Bag Closing */
router.post("/bagClosing",async(req,res,next)=>{
    try {
        let data =await warehouseInController.closeBag(req.body)
        if(data){
            res.status(200).json({
                message:"Successfully Closed"
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
/* Remove Stockin */
router.put("/stockin",async(req,res,next)=>{
    try {
        let data=await warehouseInController.deleteStockin(req.body)
        if(data){
            res.status(200).json({
                message:"Successfully Removed"
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
/****************************************************BAG ISSUE REQUEST****************************************************************** */
/* Get Requests */
router.post("/getRequests",async(req,res,next)=>{
    let data=await warehouseInController.getRequests()
    if(data){
        res.status(200).json({
            data:data,
            message:"Success"
        })
    }
})
/* Add Actual Data */
router.post("/addActualitem",async(req,res,next)=>{
    try {
        let data=await warehouseInController.addActualData(req.body)
        if(data){
            res.status(200).json({
                message:"Successfully Added"
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
router.put("/actualBagItem",async(req,res,next)=>{
    try {
        let data=await warehouseInController.removeActualItem(req.body)
        if(data){
            res.status(200).json({
                message:"Successfully Removed"
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
/* Bag Issue to agent */
router.post("/issueToBot",async(req,res,next)=>{
    try {
        let data=await warehouseInController.issueToBot(req.body)
        if(data){
            res.status(200).json({
                message:"Successfully Issued"
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
// /* Get Stocks in warehouse */
// router.post("/getStocksWarehouse", async (req, res, next) => {
//     try {
//         let data = await warehouseInController.getStocksData()
//         if (data) {
//             res.status(200).json({
//                 data: data,
//                 message: "Success"
//             })
//         }
//     } catch (error) {
//         next(error)
//     }
// })
module.exports = router;